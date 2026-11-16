(function(){
// GlowAura kit scene renderer (runs in the browser on a cdn.shopify.com tab).
// window.__cut[handle] = transparent PNG blob of the real product photo (background removed only).
window.__THEME = {
  acne:   {a:'#E6F2EA', b:'#BFDCCB', glow:'#FFFFFF', deep:'#1F4A3A', acc:'#2F7A5B', leaf:'#7FB89A'},
  marks:  {a:'#E8F0EC', b:'#C7D9D1', glow:'#FFFFFF', deep:'#22413A', acc:'#3E7A6B', leaf:'#8DB5A7'},
  teen:   {a:'#E3F4F6', b:'#B9E0E6', glow:'#FFFFFF', deep:'#174A55', acc:'#1F8A9A', leaf:'#7CC4CF'},
  peach:  {a:'#FCEDE4', b:'#F6CDB8', glow:'#FFF7F2', deep:'#5A2E22', acc:'#C1694F', leaf:'#EAA88C'},
  vitc:   {a:'#FFF3DE', b:'#FBD9A0', glow:'#FFFBEF', deep:'#5C3A12', acc:'#D9822B', leaf:'#F2B865'},
  rice:   {a:'#F8F2E6', b:'#E7D9BE', glow:'#FFFDF7', deep:'#4A3B26', acc:'#A2804F', leaf:'#CDB78F'},
  glass:  {a:'#FCEAF0', b:'#F4C6D6', glow:'#FFF6F9', deep:'#5B2238', acc:'#C04D78', leaf:'#E99AB6'},
  ice:    {a:'#EAF2FA', b:'#C6DAEE', glow:'#FFFFFF', deep:'#1E3550', acc:'#3D6E9E', leaf:'#93B6D8'},
  calm:   {a:'#EEF4EC', b:'#D2E3CD', glow:'#FFFFFF', deep:'#2D4127', acc:'#5D8A50', leaf:'#A6C59A'},
  plum:   {a:'#F1ECF6', b:'#D8CAE8', glow:'#FFFFFF', deep:'#3A2650', acc:'#7A57A3', leaf:'#B8A0D3'},
  bridal: {a:'#FBEDEB', b:'#EBC2BE', glow:'#FFF8F4', deep:'#5A1F2A', acc:'#B8925A', leaf:'#D9A3A3'},
  blush:  {a:'#FDF0F0', b:'#F5D0D4', glow:'#FFFFFF', deep:'#5A2A35', acc:'#C9A15C', leaf:'#EDB0BA'},
  men:    {a:'#E4E9EF', b:'#BCC8D6', glow:'#F7F9FB', deep:'#1C2733', acc:'#3A4D63', leaf:'#8FA1B6'},
  brand:  {a:'#FCF1EC', b:'#F2D3C6', glow:'#FFFCFA', deep:'#3A2E2A', acc:'#C1694F', leaf:'#E2A893'},
};

window.__trim = async function (blob) {
  const im = await createImageBitmap(blob);
  const c = new OffscreenCanvas(im.width, im.height), x = c.getContext('2d');
  x.drawImage(im, 0, 0);
  const d = x.getImageData(0, 0, im.width, im.height).data;
  let x0 = im.width, y0 = im.height, x1 = 0, y1 = 0;
  for (let y = 0; y < im.height; y++) for (let i = 0; i < im.width; i++) {
    if (d[(y * im.width + i) * 4 + 3] > 24) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  const w = x1 - x0 + 1, h = y1 - y0 + 1;
  const o = new OffscreenCanvas(w, h); o.getContext('2d').drawImage(im, x0, y0, w, h, 0, 0, w, h);
  return await createImageBitmap(o);
};

function leaf(x, cx, cy, len, ang, col, alpha) {
  x.save(); x.translate(cx, cy); x.rotate(ang); x.globalAlpha = alpha; x.fillStyle = col;
  x.beginPath(); x.moveTo(0, 0); x.bezierCurveTo(len * 0.3, -len * 0.28, len * 0.75, -len * 0.22, len, 0);
  x.bezierCurveTo(len * 0.75, len * 0.22, len * 0.3, len * 0.28, 0, 0); x.fill();
  x.globalAlpha = alpha * 0.6; x.strokeStyle = '#ffffff'; x.lineWidth = 2; x.beginPath(); x.moveTo(0, 0); x.lineTo(len * 0.92, 0); x.stroke();
  x.restore();
}
function sprig(x, cx, cy, s, ang, col, alpha) {
  x.save(); x.translate(cx, cy); x.rotate(ang);
  x.strokeStyle = col; x.globalAlpha = alpha; x.lineWidth = 3 * s; x.beginPath(); x.moveTo(0, 0); x.bezierCurveTo(40 * s, -60 * s, 60 * s, -150 * s, 50 * s, -240 * s); x.stroke(); x.restore();
  for (let i = 0; i < 6; i++) {
    const t = i / 6, px = cx + Math.sin(ang) * 0, yy = -40 * s - t * 190 * s;
    const p = rot(30 * s * (1 - t) + 20 * s * t + 10 * s, yy, ang);
    leaf(x, cx + p[0], cy + p[1], (70 - i * 6) * s, ang + (i % 2 ? -0.9 : -2.3), col, alpha);
  }
}
function rot(px, py, a) { return [px * Math.cos(a) - py * Math.sin(a), px * Math.sin(a) + py * Math.cos(a)]; }

function podium(x, cx, top, w, h, t) {
  const rx = w / 2, ry = w * 0.12;
  const g = x.createLinearGradient(cx - rx, 0, cx + rx, 0);
  g.addColorStop(0, shade(t.b, -10)); g.addColorStop(0.45, shade(t.a, 6)); g.addColorStop(1, shade(t.b, -22));
  x.fillStyle = g; x.beginPath(); x.moveTo(cx - rx, top); x.lineTo(cx - rx, top + h); x.ellipse(cx, top + h, rx, ry, 0, Math.PI, 0, true); x.lineTo(cx + rx, top); x.closePath(); x.fill();
  const g2 = x.createLinearGradient(cx - rx, top - ry, cx + rx, top + ry);
  g2.addColorStop(0, '#ffffff'); g2.addColorStop(1, shade(t.a, -4));
  x.fillStyle = g2; x.beginPath(); x.ellipse(cx, top, rx, ry, 0, 0, Math.PI * 2); x.fill();
}
function shade(hex, p) {
  const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const f = p / 100; r = Math.round(Math.min(255, Math.max(0, r + (f > 0 ? (255 - r) * f : r * f))));
  g = Math.round(Math.min(255, Math.max(0, g + (f > 0 ? (255 - g) * f : g * f)))); b = Math.round(Math.min(255, Math.max(0, b + (f > 0 ? (255 - b) * f : b * f))));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function rr(x, X, Y, W, H, R) { x.beginPath(); x.roundRect(X, Y, W, H, R); }

// draw the product group standing on podiums in a box (bx,by,bw,bh); returns nothing
async function group(x, items, bx, by, bw, bh, t) {
  const n = items.length;
  // sizes: normalise by area, cap height/width
  const A = (n <= 2 ? 0.20 : n === 3 ? 0.135 : 0.10) * bw * bh;
  const sz = items.map(im => { let s = Math.sqrt(A / (im.width * im.height)); let w = im.width * s, h = im.height * s;
    const mh = bh * 0.78, mw = bw / n * (n <= 2 ? 0.95 : 1.15); const k = Math.min(1, mh / h, mw / w); return [w * k, h * k]; });
  // order: tallest in the middle
  const idx = [...Array(n).keys()].sort((a, b) => sz[b][1] - sz[a][1]);
  const slots = n === 1 ? [0] : n === 2 ? [0, 1] : n === 3 ? [1, 0, 2] : [1, 2, 0, 3];
  const order = new Array(n); idx.forEach((k, j) => order[slots[j]] = k);
  const floor = by + bh;
  const pw = bw / n;
  const lifts = n === 2 ? [0, 0] : n === 3 ? [0, bh * 0.07, 0] : [bh * 0.02, bh * 0.08, bh * 0.08, bh * 0.02];
  // podiums
  for (let s = 0; s < n; s++) {
    const k = order[s], [w] = sz[k]; const cx = bx + pw * (s + 0.5);
    const ph = bh * 0.10 + lifts[s];
    podium(x, cx, floor - ph, Math.max(w * 1.25, pw * 0.82), ph, t);
  }
  for (let s = 0; s < n; s++) {
    const k = order[s], [w, h] = sz[k]; const cx = bx + pw * (s + 0.5);
    const ph = bh * 0.10 + lifts[s]; const base = floor - ph;
    // contact shadow
    x.save(); x.filter = 'blur(10px)'; x.fillStyle = 'rgba(40,25,20,0.28)'; x.beginPath(); x.ellipse(cx, base + 4, w * 0.42, w * 0.07, 0, 0, Math.PI * 2); x.fill(); x.restore();
    // soft drop shadow then product
    x.save(); x.shadowColor = 'rgba(40,25,20,0.22)'; x.shadowBlur = 30; x.shadowOffsetX = 10; x.shadowOffsetY = 14;
    x.drawImage(items[k], cx - w / 2, base - h + 6, w, h); x.restore();
  }
}

function backdrop(x, W, H, t, seed) {
  const g = x.createLinearGradient(0, 0, W * 0.3, H); g.addColorStop(0, t.a); g.addColorStop(1, t.b); x.fillStyle = g; x.fillRect(0, 0, W, H);
  const rg = x.createRadialGradient(W * 0.62, H * 0.58, 30, W * 0.62, H * 0.58, W * 0.55); rg.addColorStop(0, t.glow); rg.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = rg; x.fillRect(0, 0, W, H);
  // arch
  const aw = W * 0.62, ax = W * 0.5 - aw / 2, atop = H * 0.30;
  x.fillStyle = 'rgba(255,255,255,0.45)'; x.beginPath(); x.moveTo(ax, H); x.lineTo(ax, atop + aw / 2); x.arc(W * 0.5, atop + aw / 2, aw / 2, Math.PI, 0); x.lineTo(ax + aw, H); x.fill();
  // botanicals
  sprig(x, W * 0.07, H * 0.98, W / 1200 * 1.25, -0.25, t.leaf, 0.55);
  sprig(x, W * 0.95, H * 0.96, W / 1200 * 1.05, 0.35, t.leaf, 0.45);
  // bubbles
  let r = seed; const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 14; i++) { const bx = W * (0.08 + rnd() * 0.86), by = H * (0.32 + rnd() * 0.45), br = 4 + rnd() * 14;
    x.strokeStyle = 'rgba(255,255,255,0.75)'; x.lineWidth = 2; x.beginPath(); x.arc(bx, by, br, 0, 7); x.stroke();
    x.fillStyle = 'rgba(255,255,255,0.35)'; x.beginPath(); x.arc(bx - br * 0.3, by - br * 0.3, br * 0.3, 0, 7); x.fill(); }
  // floor
  const fg = x.createLinearGradient(0, H * 0.86, 0, H); fg.addColorStop(0, 'rgba(255,255,255,0)'); fg.addColorStop(1, 'rgba(255,255,255,0.35)'); x.fillStyle = fg; x.fillRect(0, H * 0.86, W, H * 0.14);
}

function sticker(x, cx, cy, r, t, top, mid, bot) {
  x.save(); x.translate(cx, cy); x.rotate(-0.12);
  x.shadowColor = 'rgba(0,0,0,0.18)'; x.shadowBlur = 18; x.shadowOffsetY = 6;
  x.fillStyle = t.acc; x.beginPath();
  for (let i = 0; i < 48; i++) { const a = i / 48 * Math.PI * 2, rr2 = i % 2 ? r * 0.93 : r; x.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); } x.closePath(); x.fill();
  x.shadowColor = 'transparent'; x.strokeStyle = 'rgba(255,255,255,0.6)'; x.lineWidth = 2; x.setLineDash([4, 5]); x.beginPath(); x.arc(0, 0, r * 0.8, 0, 7); x.stroke(); x.setLineDash([]);
  x.fillStyle = '#fff'; x.textAlign = 'center';
  x.font = `700 ${r * 0.2}px Assistant`; x.fillText(top, 0, -r * 0.28);
  x.font = `600 ${r * 0.36}px Fraunces`; x.fillText(mid, 0, r * 0.12);
  x.font = `700 ${r * 0.17}px Assistant`; x.fillText(bot, 0, r * 0.42);
  x.restore();
}

function wrap(x, text, maxW) { const w = text.split(' '), lines = []; let l = ''; for (const s of w) { const tt = l ? l + ' ' + s : s; if (x.measureText(tt).width > maxW && l) { lines.push(l); l = s; } else l = tt; } lines.push(l); return lines; }

// mode 'hero' 1200x1200, 'post' 1080x1350
window.__render = async function (sp, mode) {
  const W = mode === 'post' ? 1080 : 1200, H = mode === 'post' ? 1350 : 1200;
  const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  const t = window.__THEME[sp.theme];
  backdrop(x, W, H, t, sp.seed || 7);
  const L = mode === 'post' ? 64 : 72;
  let y = mode === 'post' ? 96 : 110;
  // hook (post only)
  if (mode === 'post') {
    x.fillStyle = t.deep; x.font = '600 50px Fraunces';
    const ls = wrap(x, sp.hook, W - 2 * L); ls.forEach((l, i) => x.fillText(l, L, y + i * 60)); y += ls.length * 60 + 18;
    x.fillStyle = t.acc; x.fillRect(L, y - 14, 90, 4); y += 34;
  }
  x.fillStyle = t.acc; x.font = '700 22px Assistant'; x.letterSpacing = '5px'; x.fillText(sp.eb, L, y); x.letterSpacing = '0px';
  y += mode === 'post' ? 66 : 84;
  x.fillStyle = t.deep; let fs = mode === 'post' ? 70 : 92; x.font = `600 ${fs}px Fraunces`;
  const maxW = W - 2 * L - (mode === 'post' ? 0 : 290); while (x.measureText(sp.t).width > maxW && fs > 66) { fs -= 2; x.font = `600 ${fs}px Fraunces`; }
  if (x.measureText(sp.t).width > maxW) { const ls = wrap(x, sp.t, maxW); ls.forEach((l, i) => x.fillText(l, L, y + i * fs * 1.05)); y += (ls.length - 1) * fs * 1.05; } else x.fillText(sp.t, L, y);
  y += mode === 'post' ? 50 : 60;
  x.fillStyle = shade(t.deep, 25); x.font = `500 ${mode === 'post' ? 32 : 38}px Assistant`; x.fillText(sp.s, L, y);
  // sticker
  const sr = mode === 'post' ? 105 : 120;
  sticker(x, W - L - sr + 8, mode === 'post' ? y + 150 : 205, sr, t, 'SAVE', 'Rs ' + sp.save, sp.pct + '% OFF');
  // products
  for (const h of sp.parts) if (!window.__bm[h]) window.__bm[h] = await window.__trim(window.__cut[h]);
  const items = sp.parts.map(h => window.__bm[h]);
  const top = mode === 'post' ? y + 90 : y + 70, bottomPad = mode === 'post' ? 170 : 150;
  await group(x, items, L - 10, top, W - 2 * L + 20, H - bottomPad - top, t);
  // bottom bar
  const bh = mode === 'post' ? 112 : 104, by = H - bh - (mode === 'post' ? 36 : 30);
  x.save(); x.shadowColor = 'rgba(0,0,0,0.12)'; x.shadowBlur = 24; x.fillStyle = 'rgba(255,255,255,0.88)'; rr(x, L, by, W - 2 * L, bh, bh / 2); x.fill(); x.restore();
  x.fillStyle = t.deep; x.font = `700 ${mode === 'post' ? 46 : 46}px Assistant`; const ptxt = 'Rs ' + sp.price; x.fillText(ptxt, L + 44, by + bh / 2 + 16);
  const pw = x.measureText(ptxt).width; x.fillStyle = shade(t.deep, 45); x.font = '500 28px Assistant'; const ot = 'Rs ' + sp.total; x.fillText(ot, L + 60 + pw, by + bh / 2 + 12);
  const ow = x.measureText(ot).width; x.strokeStyle = shade(t.deep, 45); x.lineWidth = 2.5; x.beginPath(); x.moveTo(L + 58 + pw, by + bh / 2 + 2); x.lineTo(L + 62 + pw + ow, by + bh / 2 + 2); x.stroke();
  x.textAlign = 'right'; x.fillStyle = t.acc; x.font = '700 24px Assistant';
  x.fillText(sp.info1, W - L - 44, by + bh / 2 - 4); x.fillStyle = shade(t.deep, 30); x.font = '600 22px Assistant'; x.fillText(sp.info2, W - L - 44, by + bh / 2 + 26); x.textAlign = 'left';
  if (mode === 'post') { x.fillStyle = shade(t.deep, 20); x.font = '600 22px Assistant'; x.textAlign = 'center'; x.letterSpacing = '3px'; x.fillText('GLOWAURA.COM.PK', W / 2, H - 12); x.letterSpacing = '0px'; x.textAlign = 'left'; }
  return c;
};

})();