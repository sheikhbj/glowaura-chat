(function(){
// Clean product cut-outs for GlowAura kit images. Real photos are only masked, cropped or rotated, never repainted.
const C = window.CUT = window.CUT || {};
const BASE = '/s/files/1/0659/7987/5518/files/';
C.init = async () => { if (!C.lib) C.lib = await import('https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.5.5/+esm'); return 'ok'; };
C.load = async (u) => { const url = u.startsWith('http') ? u : BASE + u; return await createImageBitmap(await (await fetch(url)).blob()); };

// ---------- IndexedDB persistence ----------
C.db = () => new Promise((res, rej) => { const r = indexedDB.open('gacut', 1); r.onupgradeneeded = () => r.result.createObjectStore('c'); r.onsuccess = () => res(r.result); r.onerror = rej; });
C.put = async (k, blob) => { const d = await C.db(); return new Promise(r => { const t = d.transaction('c', 'readwrite'); t.objectStore('c').put(blob, k); t.oncomplete = () => r(1); }); };
C.get = async (k) => { const d = await C.db(); return new Promise(r => { const q = d.transaction('c').objectStore('c').get(k); q.onsuccess = () => r(q.result); q.onerror = () => r(null); }); };
C.keys = async () => { const d = await C.db(); return new Promise(r => { const q = d.transaction('c').objectStore('c').getAllKeys(); q.onsuccess = () => r(q.result); }); };

// ---------- helpers ----------
function canvasFrom(bm, crop, rot) {
  const [sx, sy, sw, sh] = crop || [0, 0, bm.width, bm.height];
  if (!rot) { const c = new OffscreenCanvas(sw, sh); c.getContext('2d').drawImage(bm, sx, sy, sw, sh, 0, 0, sw, sh); return c; }
  const cs = Math.abs(Math.cos(rot)), sn = Math.abs(Math.sin(rot));
  const W = Math.ceil(sw * cs + sh * sn), H = Math.ceil(sw * sn + sh * cs);
  const c = new OffscreenCanvas(W, H), x = c.getContext('2d');
  x.translate(W / 2, H / 2); x.rotate(rot); x.drawImage(bm, sx, sy, sw, sh, -sw / 2, -sh / 2, sw, sh); return c;
}
function gradMap(d, w, h) {
  const L = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) { const r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2]; L[i] = 0.3 * r + 0.59 * g + 0.11 * b; }
  const G = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const i = y * w + x;
    let gx = 0, gy = 0;
    for (let c = 0; c < 3; c++) { gx += Math.abs(d[(i + 1) * 4 + c] - d[(i - 1) * 4 + c]); gy += Math.abs(d[(i + w) * 4 + c] - d[(i - w) * 4 + c]); }
    G[i] = Math.hypot(gx, gy);
  }
  return G;
}
// polygon in crop coords; snap each densified point along its normal to the strongest edge within +-R
function snapPoly(poly, G, w, h, R) {
  const pts = [];
  for (let i = 0; i < poly.length; i++) {
    const [ax, ay] = poly[i], [bx, by] = poly[(i + 1) % poly.length];
    const len = Math.hypot(bx - ax, by - ay), n = Math.max(1, Math.round(len / 3));
    const nx = (by - ay) / len, ny = -(bx - ax) / len; // normal (right-hand)
    for (let k = 0; k < n; k++) pts.push([ax + (bx - ax) * k / n, ay + (by - ay) * k / n, nx, ny]);
  }
  if (!R) return pts.map(p => [p[0], p[1]]);
  const ts = pts.map(([px, py, nx, ny]) => {
    let best = 0, bv = -1;
    for (let t = -R; t <= R; t++) { const x = Math.round(px + nx * t), y = Math.round(py + ny * t); if (x < 1 || y < 1 || x >= w - 1 || y >= h - 1) continue; const v = G[y * w + x] * (1 - Math.abs(t) / (R * 3)); if (v > bv) { bv = v; best = t; } }
    return best;
  });
  const m = ts.map((_, i) => { const win = []; for (let j = -4; j <= 4; j++) win.push(ts[(i + j + ts.length) % ts.length]); win.sort((a, b) => a - b); return win[4]; });
  return pts.map(([px, py, nx, ny], i) => [px + nx * m[i], py + ny * m[i]]);
}
function polyAlpha(pts, w, h, feather) {
  const c = new OffscreenCanvas(w, h), x = c.getContext('2d');
  if (feather) x.filter = `blur(${feather}px)`;
  x.fillStyle = '#fff'; x.beginPath(); pts.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.closePath(); x.fill();
  const d = x.getImageData(0, 0, w, h).data; const A = new Uint8ClampedArray(w * h); for (let i = 0; i < w * h; i++) A[i] = d[i * 4 + 3]; return A;
}
function keepComponents(A, w, h, frac) {
  const lab = new Int32Array(w * h).fill(-1); const sizes = []; const st = [];
  for (let i = 0; i < w * h; i++) {
    if (A[i] < 128 || lab[i] >= 0) continue;
    const id = sizes.length; let n = 0; st.push(i); lab[i] = id;
    while (st.length) { const p = st.pop(); n++; const x = p % w, y = (p / w) | 0;
      for (const q of [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, y > 0 ? p - w : -1, y < h - 1 ? p + w : -1]) if (q >= 0 && A[q] >= 128 && lab[q] < 0) { lab[q] = id; st.push(q); } }
    sizes.push(n);
  }
  const mx = Math.max(...sizes, 1);
  // pixels of soft edge (alpha<128) attach to neighbouring kept component
  const keep = sizes.map(s => s >= mx * frac);
  for (let i = 0; i < w * h; i++) {
    if (A[i] === 0) continue;
    if (lab[i] >= 0) { if (!keep[lab[i]]) A[i] = 0; continue; }
    const x = i % w, y = (i / w) | 0; let ok = false;
    for (let dy = -2; dy <= 2 && !ok; dy++) for (let dx = -2; dx <= 2 && !ok; dx++) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue; const l = lab[yy * w + xx]; if (l >= 0 && keep[l]) ok = true; }
    if (!ok) A[i] = 0;
  }
}
function fillHoles(A, w, h) { // fill enclosed transparent holes (e.g. pale label areas eaten by the model)
  const out = new Uint8Array(w * h); const st = [];
  for (let x = 0; x < w; x++) { st.push(x, (h - 1) * w + x); } for (let y = 0; y < h; y++) { st.push(y * w, y * w + w - 1); }
  while (st.length) { const p = st.pop(); if (out[p] || A[p] > 60) continue; out[p] = 1; const x = p % w, y = (p / w) | 0;
    if (x > 0) st.push(p - 1); if (x < w - 1) st.push(p + 1); if (y > 0) st.push(p - w); if (y < h - 1) st.push(p + w); }
  for (let i = 0; i < w * h; i++) if (!out[i] && A[i] <= 60) A[i] = 255;
}
function peelWhite(d, A, w, h, it) {
  for (let k = 0; k < it; k++) {
    const kill = [];
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
      const i = y * w + x; if (A[i] === 0) continue;
      if (A[i - 1] > 20 && A[i + 1] > 20 && A[i - w] > 20 && A[i + w] > 20) continue;
      const r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2]; const mn = Math.min(r, g, b), mx = Math.max(r, g, b);
      if (mn > 232 && mx - mn < 16) kill.push(i);
    }
    if (!kill.length) break; kill.forEach(i => A[i] = 0);
  }
}
function soften(A, w, h) { // 1px anti-aliased edge, removes the bright rim
  const B = A.slice();
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) { const i = y * w + x; if (A[i] === 0) continue;
    let z = 0; for (const q of [i - 1, i + 1, i - w, i + w, i - w - 1, i - w + 1, i + w - 1, i + w + 1]) if (A[q] < 30) z++;
    if (z) B[i] = Math.min(A[i], z >= 3 ? 90 : 170); }
  A.set(B);
}
function defringe(d, A, w, h) {
  for (let y = 2; y < h - 2; y++) for (let x = 2; x < w - 2; x++) { const i = y * w + x; if (A[i] === 0 || A[i] > 240) continue;
    let r = 0, g = 0, b = 0, n = 0;
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const q = i + dy * w + dx; if (A[q] > 240) { r += d[q * 4]; g += d[q * 4 + 1]; b += d[q * 4 + 2]; n++; } }
    if (n) { d[i * 4] = r / n; d[i * 4 + 1] = g / n; d[i * 4 + 2] = b / n; } }
}

// cfg: {src, crop, rot, poly:[[x,y]...] (crop coords, before rot), snap:R, feather, noSeg, peel, frac, holes, bbox}
C.make = async (cfg) => {
  const bm = await C.load(cfg.src);
  if (cfg.bboxCrop) { const t = new OffscreenCanvas(bm.width, bm.height), tx = t.getContext('2d'); tx.drawImage(bm, 0, 0); const dd = tx.getImageData(0, 0, bm.width, bm.height).data; let x0 = 1e9, y0 = 1e9, x1 = 0, y1 = 0; for (let y = 0; y < bm.height; y++) for (let xx = 0; xx < bm.width; xx++) { const i = (y * bm.width + xx) * 4; if (Math.min(dd[i], dd[i + 1], dd[i + 2]) < 225) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (y < y0) y0 = y; if (y > y1) y1 = y; } } cfg = Object.assign({}, cfg, { crop: [x0, y0, x1 - x0 + 1, y1 - y0 + 1], noSeg: 'rect' }); }
  let cnv = canvasFrom(bm, cfg.crop, cfg.rot);
  // scale large images down to max 1400 for speed
  const sc = Math.min(1, 1400 / Math.max(cnv.width, cnv.height));
  let w = Math.round(cnv.width * sc), h = Math.round(cnv.height * sc);
  const c2 = new OffscreenCanvas(w, h); c2.getContext('2d').drawImage(cnv, 0, 0, w, h); cnv = c2;
  const x = cnv.getContext('2d'); const id = x.getImageData(0, 0, w, h); const d = id.data;
  let A = new Uint8ClampedArray(w * h);
  if (cfg.noSeg === 'white') { // flood-fill white background from edges
    const st = []; const vis = new Uint8Array(w * h); for (let i = 0; i < w; i++) st.push(i, (h - 1) * w + i); for (let j = 0; j < h; j++) st.push(j * w, j * w + w - 1);
    A.fill(255);
    while (st.length) { const p = st.pop(); if (vis[p]) continue; vis[p] = 1; const r = d[p * 4], g = d[p * 4 + 1], b = d[p * 4 + 2]; if (Math.min(r, g, b) < 236 && d[p * 4 + 3] > 10) continue; A[p] = 0; const xx = p % w, yy = (p / w) | 0;
      if (xx > 0) st.push(p - 1); if (xx < w - 1) st.push(p + 1); if (yy > 0) st.push(p - w); if (yy < h - 1) st.push(p + w); }
    for (let i = 0; i < w * h; i++) A[i] = Math.min(A[i], d[i * 4 + 3]);
  } else if (cfg.noSeg === 'alpha') { for (let i = 0; i < w * h; i++) A[i] = d[i * 4 + 3]; }
  else if (cfg.noSeg === 'rect') { A.fill(255); }
  else {
    const blob = await cnv.convertToBlob({ type: 'image/png' });
    const out = await C.lib.removeBackground(blob, { model: 'isnet_fp16', output: { format: 'image/png' } });
    const ob = await createImageBitmap(out); const oc = new OffscreenCanvas(w, h); const ox = oc.getContext('2d'); ox.drawImage(ob, 0, 0, w, h);
    const od = ox.getImageData(0, 0, w, h).data; for (let i = 0; i < w * h; i++) { const a = od[i * 4 + 3]; A[i] = a < 40 ? 0 : a > 215 ? 255 : (a - 40) * 255 / 175; }
  }
  if (cfg.poly) {
    let poly = cfg.poly.map(([px, py]) => [px * sc, py * sc]);
    if (cfg.rot) { // poly given in un-rotated crop coords -> rotate into canvas coords
      const [sx, sy, sw, sh] = cfg.crop || [0, 0, bm.width, bm.height]; const W0 = cnv.width / sc, H0 = cnv.height / sc;
      poly = cfg.poly.map(([px, py]) => { const ux = px - sw / 2, uy = py - sh / 2; const cs = Math.cos(cfg.rot), sn = Math.sin(cfg.rot); return [(ux * cs - uy * sn + W0 / 2) * sc, (ux * sn + uy * cs + H0 / 2) * sc]; });
    }
    const G = cfg.snap ? gradMap(d, w, h) : null;
    const pts = snapPoly(poly, G, w, h, cfg.snap ? Math.round(cfg.snap * sc) || 2 : 0);
    const P = polyAlpha(pts, w, h, cfg.feather ?? 0.7);
    for (let i = 0; i < w * h; i++) A[i] = cfg.polyOnly ? P[i] : Math.min(A[i], P[i]);
  }
  if (cfg.holes !== false) fillHoles(A, w, h);
  keepComponents(A, w, h, cfg.frac ?? 0.04);
  if (cfg.peel) peelWhite(d, A, w, h, cfg.peel);
  if (cfg.noSeg !== 'rect') soften(A, w, h);
  defringe(d, A, w, h);
  for (let i = 0; i < w * h; i++) d[i * 4 + 3] = A[i];
  x.putImageData(id, 0, 0);
  if (cfg.round) { // rounded-corner rect packshot (sheet masks)
    const r = new OffscreenCanvas(w, h), rx = r.getContext('2d'); rx.beginPath(); rx.roundRect(0, 0, w, h, cfg.round * sc); rx.clip(); rx.drawImage(cnv, 0, 0); cnv = r;
  }
  if (cfg.postRot) { const a = cfg.postRot, cs = Math.abs(Math.cos(a)), sn = Math.abs(Math.sin(a)); const W2 = Math.ceil(w * cs + h * sn), H2 = Math.ceil(w * sn + h * cs); const r = new OffscreenCanvas(W2, H2), rx = r.getContext('2d'); rx.translate(W2 / 2, H2 / 2); rx.rotate(a); rx.drawImage(cnv, -w / 2, -h / 2); cnv = r; }
  return await cnv.convertToBlob({ type: 'image/png' });
};
C.run = async (list) => { // list of [key,cfg]; stores results in IndexedDB; progress in C.log
  await C.init(); C.log = C.log || [];
  for (const [k, cfg] of list) { try { const t0 = performance.now(); const b = await C.make(cfg); await C.put(k, b); C.log.push(k + ' ok ' + Math.round((performance.now() - t0) / 1000) + 's'); } catch (e) { C.log.push(k + ' ERR ' + e.message); } }
  C.log.push('DONE');
};
C.preview = async (keys, bg) => { // show cut-outs on a coloured backdrop for checking
  document.body.innerHTML = ''; document.body.style.cssText = 'margin:0;background:#666';
  const d = document.createElement('div'); d.style.cssText = 'display:grid;grid-template-columns:repeat(5,260px);gap:4px'; document.body.appendChild(d);
  for (const k of keys) { const b = await C.get(k); if (!b) continue; const i = new Image(); i.src = URL.createObjectURL(b); i.title = k; i.style.cssText = `width:260px;height:260px;object-fit:contain;background:${bg || 'linear-gradient(135deg,#e7d1f0,#9fd0c7)'}`; d.appendChild(i); }
  window.scrollTo(0, 0); return keys.length;
};
})();
