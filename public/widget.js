/* GlowAura AI chat widget. Built from src/ga2-ai-chat.liquid by tools/build-widget.py. Do not edit by hand. */
(() => {
  if (customElements.get('ga2-ai-chat')) return;
  if (!document.getElementById('gac-style')) {
    const st = document.createElement('style');
    st.id = 'gac-style';
    st.textContent = `.gac { --gac-ink: #3A2E2A; --gac-soft: #6A564E; --gac-terra: #C1694F; --gac-terra-d: #8C4A36; --gac-blush: #F5E3DB; --gac-cream: #FFFCFA; --gac-line: #EEDDD4; position: relative; z-index: 6; font-size: 1.5rem; }
.gac *, .gac *::before, .gac *::after { box-sizing: border-box; }
.gac-launch { position: fixed; right: 18px; bottom: calc(18px + env(safe-area-inset-bottom)); z-index: 6; display: inline-flex; align-items: center; gap: 8px; min-height: 52px; padding: 0 20px 0 16px; border: 0; border-radius: 999px; background: var(--gac-terra-d); color: #fff; font: inherit; font-weight: 700; cursor: pointer; box-shadow: 0 12px 28px rgba(140,74,54,.32); transition: transform .2s ease, box-shadow .2s ease, bottom .25s ease, opacity .2s; }
.gac-launch:hover { transform: translateY(-2px); box-shadow: 0 16px 34px rgba(140,74,54,.38); }
.gac-launch__icon { color: #FCE7DD; animation: gac-twinkle 2.6s ease-in-out infinite; }
.gac-launch__dot { position: absolute; top: 6px; right: 10px; width: 9px; height: 9px; border-radius: 50%; background: #F7C9B6; animation: gac-pulse 2.2s infinite; }
.gac.is-open .gac-launch__dot { display: none; }
.gac :is(button, a, textarea):focus-visible { outline: 3px solid #E7B9A6; outline-offset: 2px; }
body:has(.ga2-satc:not([hidden])) .gac-launch { bottom: calc(86px + env(safe-area-inset-bottom)); }
body:has(.ga2-satc:not([hidden])) .gac-teaser { bottom: calc(148px + env(safe-area-inset-bottom)); }
.gac-teaser { position: fixed; right: 18px; bottom: calc(80px + env(safe-area-inset-bottom)); z-index: 6; display: flex; align-items: flex-start; max-width: 250px; background: #fff; border: 1px solid var(--gac-line); border-radius: 16px 16px 4px 16px; box-shadow: 0 14px 30px rgba(58,46,42,.16); animation: gac-in .35s cubic-bezier(.2,.8,.2,1); }
.gac-teaser[hidden] { display: none; }
.gac-teaser__text { flex: 1; border: 0; background: none; padding: 12px 4px 12px 14px; text-align: left; font: inherit; font-size: 1.4rem; line-height: 1.4; color: var(--gac-ink); cursor: pointer; }
.gac-teaser__x { border: 0; background: none; padding: 6px 10px; font-size: 2rem; line-height: 1; color: var(--gac-soft); cursor: pointer; }
.gac-panel { position: fixed; right: 18px; bottom: calc(82px + env(safe-area-inset-bottom)); z-index: 7; width: min(410px, calc(100vw - 24px)); height: min(680px, calc(100vh - 110px)); display: flex; flex-direction: column; background: var(--gac-cream); color: var(--gac-ink); border: 1px solid var(--gac-line); border-radius: 22px; box-shadow: 0 30px 70px rgba(58,46,42,.22); overflow: hidden; animation: gac-in .28s cubic-bezier(.2,.8,.2,1); }
.gac-panel[hidden] { display: none; }
.gac-grab { display: none; }
html.gac-lock, html.gac-lock body { overflow: hidden; overscroll-behavior: none; }
.gac-head { display: flex; align-items: center; gap: 10px; padding: 12px 10px 12px 14px; background: linear-gradient(135deg, #F5E3DB 0%, #FBEDE6 60%, #FFFCFA 100%); border-bottom: 1px solid var(--gac-line); }
.gac-avatar { position: relative; flex: none; width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; background: var(--gac-terra-d); color: #fff; font-family: 'Fraunces', Georgia, serif; font-size: 1.5rem; }
.gac-avatar i { position: absolute; right: 0; bottom: 1px; width: 11px; height: 11px; border-radius: 50%; background: #3FAE66; border: 2px solid #FBEDE6; }
.gac-head__text { flex: 1; min-width: 0; }
.gac-head__title { margin: 0; font-family: 'Fraunces', Georgia, serif; font-size: 1.75rem; line-height: 1.15; }
.gac-head__sub { margin: 2px 0 0; font-size: 1.2rem; color: var(--gac-soft); line-height: 1.3; }
.gac-icon-btn { flex: none; width: 36px; height: 36px; display: grid; place-items: center; border: 0; border-radius: 50%; background: transparent; color: var(--gac-ink); cursor: pointer; }
.gac-icon-btn:hover { background: rgba(140,74,54,.08); }
.gac-log { flex: 1; min-height: 0; overflow-y: auto; padding: 16px 14px 10px; display: flex; flex-direction: column; gap: 8px; overscroll-behavior: contain; }
.gac-log > * { flex-shrink: 0; }
.gac-msg { max-width: 88%; padding: 10px 14px; border-radius: 18px; line-height: 1.5; font-size: 1.45rem; animation: gac-pop .22s ease both; overflow-wrap: anywhere; }
.gac-msg.no-anim, .gac-cards.no-anim .gac-card { animation: none; }
.gac-msg p { margin: 0; } .gac-msg p + p, .gac-msg p + ul, .gac-msg p + ol, .gac-msg ul + p, .gac-msg ol + p { margin-top: 6px; }
.gac-msg ul, .gac-msg ol { margin: 4px 0 0; padding-left: 20px; } .gac-msg li + li { margin-top: 3px; }
.gac-msg--bot { align-self: flex-start; background: #fff; border: 1px solid var(--gac-line); border-bottom-left-radius: 6px; }
.gac-msg--me { align-self: flex-end; background: var(--gac-terra-d); color: #fff; border-bottom-right-radius: 6px; white-space: pre-line; }
.gac-typing { display: inline-flex; gap: 4px; padding: 14px 16px; }
.gac-typing i { width: 7px; height: 7px; border-radius: 50%; background: #C9A99B; animation: gac-dot 1s infinite; }
.gac-typing i:nth-child(2) { animation-delay: .15s; } .gac-typing i:nth-child(3) { animation-delay: .3s; }
.gac-cards { display: flex; gap: 10px; overflow-x: auto; padding: 2px 2px 8px; margin: 0 -14px; padding-left: 14px; padding-right: 14px; scroll-snap-type: x mandatory; scrollbar-width: thin; }
.gac-card { flex: 0 0 158px; scroll-snap-align: start; display: flex; flex-direction: column; gap: 4px; padding: 8px; background: #fff; border: 1px solid var(--gac-line); border-radius: 16px; animation: gac-rise .35s ease both; }
.gac-card__img { display: block; aspect-ratio: 1; max-width: 100%; border-radius: 12px; background: var(--gac-blush); overflow: hidden; }
.gac-card__img img { width: 100%; height: 100%; object-fit: contain; }
.gac-card__brand { font-size: 1.05rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--gac-terra-d); margin-top: 2px; }
.gac-card__title { font-size: 1.3rem; font-weight: 600; line-height: 1.3; color: var(--gac-ink); text-decoration: none; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 3.4rem; }
.gac-card__title:hover { text-decoration: underline; }
.gac-card__price { font-size: 1.35rem; font-weight: 700; } .gac-card__price s { font-weight: 400; color: var(--gac-soft); font-size: 1.15rem; margin-left: 4px; }
.gac-card__add { margin-top: auto; min-height: 36px; border: 0; border-radius: 999px; background: var(--gac-terra-d); color: #fff; font: inherit; font-size: 1.3rem; font-weight: 700; cursor: pointer; transition: background .15s; }
.gac-card__add:hover { background: #7A3F2E; } .gac-card__add[disabled] { cursor: default; opacity: .7; }
.gac-card__add.is-added { background: #2F7A4A; opacity: 1; }
.gac-bundle { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 10px 10px 14px; border-radius: 16px; background: var(--gac-blush); animation: gac-pop .3s ease both; }
.gac-bundle__text { display: flex; flex-direction: column; min-width: 0; line-height: 1.3; }
.gac-bundle__text b { font-size: 1.4rem; } .gac-bundle__text span { font-size: 1.2rem; color: #13572F; font-weight: 600; }
.gac-bundle__btn { flex: none; min-height: 40px; padding: 0 16px; border: 0; border-radius: 999px; background: var(--gac-terra-d); color: #fff; font: inherit; font-size: 1.35rem; font-weight: 700; cursor: pointer; }
.gac-bundle__btn.is-added { background: #2F7A4A; }
.gac-wa { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; min-height: 40px; padding: 8px 16px; border-radius: 999px; background: #F1FBF4; border: 1.5px solid #8DD3A5; color: #13572F; font-weight: 700; font-size: 1.35rem; text-decoration: none; animation: gac-pop .25s ease both; }
.gac-wa:hover { background: #E2F6E8; }
.gac-chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 14px 10px; }
.gac-chips:empty { display: none; }
.gac-chip { min-height: 36px; padding: 6px 12px; border: 1.5px solid #E0BFB1; border-radius: 999px; background: #fff; color: var(--gac-ink); font: inherit; font-size: 1.3rem; font-weight: 600; cursor: pointer; animation: gac-pop .25s ease both; transition: background .15s, border-color .15s; }
.gac-chip:hover { background: var(--gac-blush); border-color: var(--gac-terra); }
.gac-form { display: flex; align-items: flex-end; gap: 8px; padding: 10px 12px 8px; border-top: 1px solid var(--gac-line); background: #fff; }
.gac-form textarea { flex: 1; min-height: 44px; max-height: 120px; resize: none; padding: 11px 14px; border: 1.5px solid #E3C8BC; border-radius: 22px; background: var(--gac-cream); color: var(--gac-ink); font: inherit; font-size: 16px; line-height: 1.35; box-shadow: none; overflow-y: hidden; }
.gac-form textarea:focus { outline: none; border-color: var(--gac-terra); }
.gac-send { flex: none; width: 44px; height: 44px; display: grid; place-items: center; border: 0; border-radius: 50%; background: var(--gac-terra-d); color: #fff; cursor: pointer; }
.gac-send[disabled] { opacity: .5; cursor: progress; }
.gac-foot { margin: 0; padding: 0 14px calc(10px + env(safe-area-inset-bottom)); background: #fff; font-size: 1.1rem; color: var(--gac-soft); text-align: center; }
.gac-foot a { display: inline-block; padding: 6px 0; color: #13572F; font-weight: 700; }
.gac-toast { position: absolute; left: 12px; right: 12px; margin: 0 auto; width: max-content; max-width: calc(100% - 24px); bottom: 128px; display: flex; align-items: center; gap: 12px; padding: 10px 10px 10px 16px; border-radius: 999px; background: var(--gac-ink); color: #fff; font-size: 1.3rem; font-weight: 600; white-space: nowrap; box-shadow: 0 10px 24px rgba(0,0,0,.2); animation: gac-pop .25s ease both; transition: opacity .4s; }
.gac-toast button { border: 0; border-radius: 999px; padding: 6px 12px; background: #fff; color: var(--gac-ink); font: inherit; font-weight: 700; cursor: pointer; }
.gac-toast.is-error { background: #9B2C2C; padding-right: 16px; white-space: normal; }
.gac-toast.is-out { opacity: 0; }
@keyframes gac-in { from { opacity: 0; transform: translateY(14px) scale(.98); } to { opacity: 1; transform: none; } }
@keyframes gac-pop { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@keyframes gac-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@keyframes gac-dot { 0%, 80%, 100% { opacity: .3; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-3px); } }
@keyframes gac-pulse { 0% { box-shadow: 0 0 0 0 rgba(247,201,182,.8); } 70% { box-shadow: 0 0 0 10px rgba(247,201,182,0); } 100% { box-shadow: 0 0 0 0 rgba(247,201,182,0); } }
@keyframes gac-twinkle { 0%, 100% { transform: scale(1) rotate(0); } 50% { transform: scale(1.15) rotate(12deg); } }
@media (max-width: 749px) {
  .gac-launch { right: 12px; bottom: calc(12px + env(safe-area-inset-bottom)); min-height: 48px; padding: 0 16px 0 13px; font-size: 1.4rem; transition: transform .2s ease, bottom .25s ease, padding .2s ease, width .2s ease; }
  .gac-launch.is-compact { width: 48px; padding: 0; justify-content: center; }
  .gac-launch.is-compact .gac-launch__text { display: none; }
  .gac-launch.is-compact .gac-launch__dot { top: 4px; right: 4px; }
  body:has(.ga2-satc:not([hidden])) .gac-launch { bottom: calc(80px + env(safe-area-inset-bottom)); }
  .gac-teaser { right: 12px; bottom: calc(70px + env(safe-area-inset-bottom)); max-width: 230px; }
  .gac-teaser__text { font-size: 1.35rem; padding: 10px 2px 10px 12px; }
  .gac-panel { top: 0; right: 0; left: 0; bottom: auto; width: 100%; height: 100vh; height: 100dvh; border: 0; border-radius: 0; box-shadow: none; padding-top: env(safe-area-inset-top); animation: gac-up .28s cubic-bezier(.2,.8,.2,1); }
  .gac-head { position: relative; padding: 18px 6px 10px 14px; touch-action: none; }
  .gac-grab { display: block; position: absolute; top: 6px; left: 50%; width: 40px; height: 5px; margin-left: -20px; border-radius: 3px; background: #DCC3B7; }
  .gac-head__title { font-size: 1.7rem; }
  .gac-icon-btn { width: 44px; height: 44px; }
  .gac-log { padding: 14px 12px 8px; }
  .gac-msg { max-width: 90%; font-size: 1.5rem; }
  .gac-cards { margin: 0 -12px; padding-left: 12px; padding-right: 12px; }
  .gac-card { flex-basis: 148px; }
  .gac-card__add { min-height: 40px; }
  .gac-chips { flex-wrap: nowrap; overflow-x: auto; padding: 2px 12px 10px; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
  .gac-chips::-webkit-scrollbar { display: none; }
  .gac-chip { flex: none; min-height: 40px; font-size: 1.35rem; }
  .gac-wa { min-height: 44px; }
  .gac-form { padding: 8px 10px 6px; }
  .gac-foot { font-size: 1.2rem; padding-bottom: calc(8px + env(safe-area-inset-bottom)); }
  .gac-toast { bottom: 120px; }
  .gac.is-open .gac-launch, .gac.is-open .gac-teaser { display: none; }
}
@keyframes gac-up { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) {
  .gac *, .gac *::before, .gac *::after { animation: none !important; transition: none !important; }
}`;
    document.head.appendChild(st);
  }
  const TEMPLATE = (d, e) => `  <div class="gac-teaser" data-gac-teaser hidden>
    <button type="button" class="gac-teaser__text" data-gac-open>${e(d.teaser || '')}</button>
    <button type="button" class="gac-teaser__x" data-gac-teaser-x aria-label="Dismiss">&times;</button>
  </div>
  <button type="button" class="gac-launch" aria-expanded="false" aria-controls="gac-panel" data-gac-toggle>
    <span class="gac-launch__dot" aria-hidden="true"></span>
    <svg class="gac-launch__icon" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2c.5 5 4.5 9 9.5 9.5-5 .5-9 4.5-9.5 9.5-.5-5-4.5-9-9.5-9.5C7.5 11 11.5 7 12 2z"/></svg>
    <span class="gac-launch__text">${e(d.launcher || '')}</span>
  </button>

  <div class="gac-panel" id="gac-panel" role="dialog" aria-label="${e(d.heading || '')}" hidden>
    <header class="gac-head" data-gac-head>
      <span class="gac-grab" aria-hidden="true"></span>
      <span class="gac-avatar" aria-hidden="true">GA<i></i></span>
      <div class="gac-head__text">
        <p class="gac-head__title">${e(d.heading || '')}</p>
        <p class="gac-head__sub">Skin questions, routines, delivery · English &amp; Urdu</p>
      </div>
      <button type="button" class="gac-icon-btn" data-gac-reset aria-label="Start a new chat" title="New chat">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <button type="button" class="gac-icon-btn" data-gac-toggle aria-label="Close chat">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
      </button>
    </header>
    <div class="gac-log" data-gac-log aria-live="polite"></div>
    <div class="gac-chips" data-gac-chips></div>
    <form class="gac-form" data-gac-form>
      <label class="visually-hidden" for="gac-input">Type your message</label>
      <textarea id="gac-input" rows="1" maxlength="600" enterkeyhint="send" autocomplete="off" autocapitalize="sentences" placeholder="Ask about your skin or any product…" data-gac-input></textarea>
      <button type="submit" class="gac-send" aria-label="Send" data-gac-send>
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l16-8-6 16-2.5-6.5L4 12z" fill="currentColor"/></svg>
      </button>
    </form>
    <p class="gac-foot">AI assistant, can make mistakes · <a href="https://wa.me/${e(d.wa || '')}" target="_blank" rel="noopener" data-gac-wa-foot>Chat with a person</a></p>
  </div>`;
  const KEY = 'gac-history-v1';
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (cents) => 'Rs ' + Math.round(cents / 100).toLocaleString('en-US');
  const store = {
    get(k, d) { try { const v = sessionStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const isPhone = () => matchMedia('(max-width: 749px)').matches;
  const productCache = new Map();
  const getProduct = (h) => {
    if (!productCache.has(h)) productCache.set(h, fetch('/products/' + encodeURIComponent(h) + '.js').then((r) => (r.ok ? r.json() : null)).catch(() => null));
    return productCache.get(h);
  };

  // Light formatting: escape first, then **bold**, list lines and line breaks.
  function format(text) {
    const lines = esc(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').split('\n');
    let html = '', list = null;
    for (const raw of lines) {
      const line = raw.trim();
      const m = line.match(/^(?:[-•*]|(\d+)[.)])\s+(.*)$/);
      if (m) {
        const type = m[1] ? 'ol' : 'ul';
        if (list !== type) { if (list) html += '</' + list + '>'; html += '<' + type + '>'; list = type; }
        html += '<li>' + m[2] + '</li>';
      } else {
        if (list) { html += '</' + list + '>'; list = null; }
        if (line) html += '<p>' + line + '</p>';
      }
    }
    if (list) html += '</' + list + '>';
    return html;
  }

  class AiChat extends HTMLElement {
    connectedCallback() {
      if (!this.querySelector('.gac-panel')) this.innerHTML = TEMPLATE(this.dataset, esc);
      document.querySelectorAll('ga2-skin-advisor').forEach((el) => el.remove());
      this.panel = this.querySelector('.gac-panel');
      this.log = this.querySelector('[data-gac-log]');
      this.chipsEl = this.querySelector('[data-gac-chips]');
      this.form = this.querySelector('[data-gac-form]');
      this.input = this.querySelector('[data-gac-input]');
      this.sendBtn = this.querySelector('[data-gac-send]');
      this.launch = this.querySelector('.gac-launch');
      this.history = store.get(KEY, []);
      this.querySelectorAll('[data-gac-toggle]').forEach((b) => b.addEventListener('click', () => this.toggle()));
      this.querySelector('[data-gac-reset]').addEventListener('click', () => this.reset());
      this.form.addEventListener('submit', (e) => { e.preventDefault(); this.send(this.input.value); });
      this.input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.send(this.input.value); } });
      this.input.addEventListener('input', () => this.grow());
      this.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !this.panel.hidden) this.toggle(false); });
      document.addEventListener('click', (e) => {
        const t = e.target.closest('[data-skin-advisor-open],[data-ai-chat-open],[data-gac-open]');
        if (t) { e.preventDefault(); this.hideTeaser(true); this.toggle(true); if (t.dataset.aiChatOpen) this.send(t.dataset.aiChatOpen); }
      });
      this.querySelector('[data-gac-teaser-x]').addEventListener('click', () => this.hideTeaser(true));
      // Phone: the back button closes the chat instead of leaving the page.
      window.addEventListener('popstate', () => { if (!this.panel.hidden && !(history.state && history.state.gac)) this.toggle(false, true, true); });
      // Phone: keep the panel inside the visible area when the keyboard opens.
      if (window.visualViewport) {
        const fit = () => {
          if (this.panel.hidden || !isPhone()) return;
          this.panel.style.height = visualViewport.height + 'px';
          this.panel.style.top = visualViewport.offsetTop + 'px';
          this.scrollDown();
        };
        visualViewport.addEventListener('resize', fit);
        visualViewport.addEventListener('scroll', fit);
        this.fit = fit;
      }
      // Phone: swipe the header down to close.
      const head = this.querySelector('[data-gac-head]');
      let y0 = null, dy = 0;
      head.addEventListener('touchstart', (e) => { if (isPhone() && !e.target.closest('button')) { y0 = e.touches[0].clientY; dy = 0; this.panel.style.transition = 'none'; } }, { passive: true });
      head.addEventListener('touchmove', (e) => { if (y0 === null) return; dy = Math.max(0, e.touches[0].clientY - y0); this.panel.style.transform = 'translateY(' + dy + 'px)'; }, { passive: true });
      head.addEventListener('touchend', () => {
        if (y0 === null) return;
        y0 = null; this.panel.style.transition = 'transform .2s ease'; this.panel.style.transform = '';
        if (dy > 90) this.toggle(false);
      });
      // Phone: shrink the launcher to a round button while scrolling down, so it covers less of the page.
      let lastY = scrollY, ticking = false;
      window.addEventListener('scroll', () => {
        if (ticking) return; ticking = true;
        requestAnimationFrame(() => {
          const y = scrollY;
          if (isPhone()) this.launch.classList.toggle('is-compact', y > 300 && y > lastY);
          lastY = y; ticking = false;
        });
      }, { passive: true });
      if (store.get('gac-open', false) && !matchMedia('(max-width: 749px)').matches) this.toggle(true, true);
      else this.scheduleTeaser();
    }
    scheduleTeaser() {
      if (store.get('gac-teased', false) || this.history.length > 1) return;
      this.teaserTimer = setTimeout(() => {
        if (!this.panel.hidden) return;
        this.querySelector('[data-gac-teaser]').hidden = false;
        store.set('gac-teased', true);
      }, 12000);
    }
    hideTeaser(forever) {
      clearTimeout(this.teaserTimer);
      this.querySelector('[data-gac-teaser]').hidden = true;
      if (forever) store.set('gac-teased', true);
    }
    toggle(force, quiet, fromBack) {
      const open = typeof force === 'boolean' ? force : this.panel.hidden;
      if (open === !this.panel.hidden) return;
      this.panel.hidden = !open;
      this.launch.setAttribute('aria-expanded', open);
      this.classList.toggle('is-open', open);
      store.set('gac-open', open);
      const phone = isPhone();
      document.documentElement.classList.toggle('gac-lock', open && phone);
      if (open) {
        this.hideTeaser(true);
        if (!this.rendered) this.renderAll();
        if (phone) {
          if (!(history.state && history.state.gac)) history.pushState({ ...(history.state || {}), gac: 1 }, '');
          if (this.fit) this.fit();
        } else if (!quiet) setTimeout(() => this.input.focus({ preventScroll: true }), 60);
        if (!quiet) this.track('ai_chat_opened');
        this.scrollDown();
      } else {
        this.panel.style.height = ''; this.panel.style.top = '';
        if (!fromBack && history.state && history.state.gac) history.back();
        if (!quiet && !phone) this.launch.focus();
      }
    }
    welcome() {
      const p = this.dataset.product;
      return p
        ? 'Hi! I see you\'re looking at ' + p + '. Ask me if it suits your skin, how to use it, or what to pair it with. English ya Urdu, jo aap ko asaan lage.'
        : 'Hi! I\'m the GlowAura beauty advisor ✨ Tell me about your skin and I\'ll suggest what\'s right from our shelves, or ask anything about delivery and COD. English ya Urdu, jo aap ko asaan lage.';
    }
    chips() {
      if (this.dataset.handle) return ['Is this good for my skin?', 'How do I use it?', 'What goes well with this?', 'Delivery & COD'];
      return ['Build my skincare routine', 'Something for acne', 'Dark spots ke liye kya hai?', 'Is everything original?', 'Delivery & COD'];
    }
    renderAll() {
      this.rendered = true;
      this.log.innerHTML = '';
      if (!this.history.length) this.history = [{ role: 'assistant', content: this.welcome() }];
      this.history.forEach((m) => this.renderMsg(m, false));
      const last = this.history[this.history.length - 1];
      if (this.history.length <= 1) this.renderChips(true);
      else this.renderChips(!!(last && last.suggestions && last.suggestions.length), last && last.suggestions);
    }
    renderChips(show, list) {
      this.chipsEl.innerHTML = '';
      if (!show) return;
      (list || this.chips()).forEach((c, i) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'gac-chip'; b.textContent = c; b.style.animationDelay = i * 40 + 'ms';
        b.addEventListener('click', () => this.send(c));
        this.chipsEl.appendChild(b);
      });
    }
    renderMsg(m, animate = true) {
      const row = document.createElement('div');
      row.className = 'gac-msg gac-msg--' + (m.role === 'user' ? 'me' : 'bot') + (animate ? '' : ' no-anim');
      if (m.role === 'user') row.textContent = m.content;
      else row.innerHTML = format(m.content);
      this.log.appendChild(row);
      if (m.products && m.products.length) this.renderCards(m.products, animate, m.bundle);
      if (m.whatsapp) this.renderWa();
      this.scrollDown();
      return row;
    }
    async renderCards(handles, animate, bundle) {
      const rail = document.createElement('div');
      rail.className = 'gac-cards' + (animate ? '' : ' no-anim');
      this.log.appendChild(rail);
      const items = await Promise.all(handles.map(getProduct));
      items.forEach((p, i) => {
        if (!p) return;
        const v = p.variants.find((x) => x.available) || p.variants[0];
        const img = p.featured_image ? (p.featured_image.startsWith('//') ? 'https:' + p.featured_image : p.featured_image) : '';
        const card = document.createElement('div');
        card.className = 'gac-card';
        card.style.animationDelay = i * 80 + 'ms';
        card.innerHTML =
          '<a class="gac-card__img" href="/products/' + esc(p.handle) + '">' + (img ? '<img loading="lazy" alt="" src="' + esc(img) + (img.includes('?') ? '&' : '?') + 'width=240">' : '') + '</a>' +
          '<span class="gac-card__brand">' + esc(p.vendor || '') + '</span>' +
          '<a class="gac-card__title" href="/products/' + esc(p.handle) + '">' + esc(p.title) + '</a>' +
          '<span class="gac-card__price">' + money(v.price) + (v.compare_at_price > v.price ? ' <s>' + money(v.compare_at_price) + '</s>' : '') + '</span>';
        const add = document.createElement('button');
        add.type = 'button'; add.className = 'gac-card__add';
        add.textContent = v.available ? 'Add to bag' : 'Sold out';
        add.disabled = !v.available;
        add.addEventListener('click', () => this.addToCart(v.id, add, p.title));
        card.appendChild(add);
        rail.appendChild(card);
      });
      if (!rail.children.length) { rail.remove(); return; }
      const ids = items.filter((p) => p).map((p) => (p.variants.find((x) => x.available) || {}).id).filter(Boolean);
      if (bundle && ids.length >= 2) {
        const bar = document.createElement('div');
        bar.className = 'gac-bundle';
        bar.innerHTML = '<div class="gac-bundle__text"><b>' + ids.length + ' items · ' + money(bundle.total * 100) + '</b><span>' +
          (bundle.freeDelivery ? 'Free delivery on this order ✓' : 'Add ' + money(bundle.gap * 100) + ' more for free delivery') + '</span></div>';
        const all = document.createElement('button');
        all.type = 'button'; all.className = 'gac-bundle__btn'; all.textContent = 'Add all to bag';
        all.addEventListener('click', () => this.addAll(ids, all, rail));
        bar.appendChild(all);
        rail.after(bar);
      }
      this.scrollDown();
    }
    async addAll(ids, btn, rail) {
      btn.disabled = true; btn.textContent = 'Adding…';
      const drawer = document.querySelector('cart-drawer');
      try {
        const body = { items: ids.map((id) => ({ id, quantity: 1 })) };
        if (drawer) { body.sections = 'cart-drawer,cart-icon-bubble'; body.sections_url = location.pathname; }
        const res = await fetch('/cart/add.js', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) });
        const data = await res.json();
        if (!res.ok || data.status) throw new Error(data.description || 'add failed');
        if (data.sections) this.refreshCart(drawer, data.sections);
        btn.textContent = 'All added ✓'; btn.classList.add('is-added');
        rail.querySelectorAll('.gac-card__add').forEach((b) => { b.textContent = 'Added ✓'; b.disabled = true; b.classList.add('is-added'); });
        this.toast('all');
        this.track('ai_chat_add_all', { items: ids.length });
      } catch (e) {
        btn.disabled = false; btn.textContent = 'Add all to bag';
        this.toast(null, (e && e.message) || 'Could not add these items.');
      }
    }
    renderWa() {
      const a = document.createElement('a');
      a.className = 'gac-wa'; a.target = '_blank'; a.rel = 'noopener';
      a.href = 'https://wa.me/' + this.dataset.wa + '?text=' + encodeURIComponent(this.waText());
      a.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.6-.1 1z"/></svg><span>Continue on WhatsApp</span>';
      a.addEventListener('click', () => this.track('ai_chat_whatsapp'));
      this.log.appendChild(a);
    }
    waText() {
      const asks = this.history.filter((m) => m.role === 'user').slice(-3).map((m) => '• ' + m.content.slice(0, 160));
      const shown = [...new Set(this.history.flatMap((m) => m.products || []))].slice(-4);
      const lines = ['Hi GlowAura! I was chatting with the assistant on your website.'];
      if (asks.length) lines.push('', 'I asked:', ...asks);
      if (shown.length) lines.push('', 'Products I looked at:', ...shown.map((h) => location.origin + '/products/' + h));
      return lines.join('\n');
    }
    async addToCart(id, btn, title) {
      btn.disabled = true; btn.textContent = 'Adding…';
      const drawer = document.querySelector('cart-drawer');
      try {
        const body = { items: [{ id, quantity: 1 }] };
        if (drawer) { body.sections = 'cart-drawer,cart-icon-bubble'; body.sections_url = location.pathname; }
        const res = await fetch('/cart/add.js', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) });
        const data = await res.json();
        if (!res.ok || data.status) throw new Error(data.description || 'add failed');
        if (data.sections) this.refreshCart(drawer, data.sections);
        btn.textContent = 'Added ✓'; btn.classList.add('is-added');
        this.toast(title);
        this.track('ai_chat_add_to_cart', { variant: id });
      } catch (e) {
        btn.disabled = false; btn.textContent = 'Add to bag';
        this.toast(null, (e && e.message) || 'Could not add this item.');
      }
    }
    // Same as Dawn's cart-drawer renderContents, without opening the drawer over the chat.
    refreshCart(drawer, sections) {
      const inner = (html, sel) => { const d = new DOMParser().parseFromString(html, 'text/html'); const el = d.querySelector(sel); return el ? el.innerHTML : null; };
      const bubble = document.getElementById('cart-icon-bubble');
      if (bubble && sections['cart-icon-bubble']) { const h = inner(sections['cart-icon-bubble'], '.shopify-section'); if (h !== null) bubble.innerHTML = h; }
      const cd = document.getElementById('CartDrawer');
      if (drawer && cd && sections['cart-drawer']) {
        const h = inner(sections['cart-drawer'], '#CartDrawer');
        if (h !== null) {
          cd.innerHTML = h;
          drawer.classList.remove('is-empty');
          const overlay = drawer.querySelector('#CartDrawer-Overlay');
          if (overlay && drawer.close) overlay.addEventListener('click', drawer.close.bind(drawer));
        }
      }
    }
    toast(title, error) {
      const t = document.createElement('div');
      t.className = 'gac-toast' + (error ? ' is-error' : '');
      if (error) t.textContent = error;
      else {
        t.innerHTML = '<span>' + (title === 'all' ? 'Routine added to your bag' : 'Added to your bag') + '</span>';
        const view = document.createElement('button');
        view.type = 'button'; view.textContent = 'View bag';
        view.addEventListener('click', () => {
          const d = document.querySelector('cart-drawer');
          if (d && d.open) { this.toggle(false, true); d.open(); } else location.href = '/cart';
        });
        t.appendChild(view);
      }
      this.panel.appendChild(t);
      setTimeout(() => t.classList.add('is-out'), 3200);
      setTimeout(() => t.remove(), 3700);
    }
    async context() {
      const ctx = { page: { type: this.dataset.page, handle: this.dataset.handle || undefined, title: this.dataset.title }, cart: [], cartTotal: 0 };
      try {
        const c = await (await fetch('/cart.js')).json();
        ctx.cart = c.items.map((i) => ({ handle: i.handle, qty: i.quantity }));
        ctx.cartTotal = c.total_price / 100;
      } catch (e) {}
      return ctx;
    }
    async send(text) {
      text = String(text || '').trim();
      if (!text || this.busy) return;
      if (this.panel.hidden) this.toggle(true, true);
      this.busy = true; this.sendBtn.disabled = true;
      this.input.value = ''; this.grow();
      this.renderChips(false);
      const userMsg = { role: 'user', content: text.slice(0, 600) };
      this.history.push(userMsg); this.save();
      this.renderMsg(userMsg);
      const typing = document.createElement('div');
      typing.className = 'gac-msg gac-msg--bot gac-typing';
      typing.innerHTML = '<i></i><i></i><i></i>';
      this.log.appendChild(typing); this.scrollDown();
      this.track('ai_chat_message');
      let reply;
      try {
        const payload = {
          messages: this.history.slice(-16).map((m) => ({ role: m.role, content: m.role === 'assistant' && m.products && m.products.length ? m.content + '\n' + m.products.map((h) => '[[p:' + h + ']]').join('\n') : m.content })),
          context: await this.context()
        };
        const res = await fetch(this.dataset.api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await res.json().catch(() => ({}));
        if (data.reply) reply = { role: 'assistant', content: data.reply, products: data.products || [], whatsapp: !!data.whatsapp, suggestions: data.suggestions || [], bundle: data.bundle || null };
        else throw new Error('no reply');
      } catch (e) {
        reply = { role: 'assistant', content: "Sorry, I couldn't connect just now. Our team will help you on WhatsApp.", whatsapp: true };
      }
      typing.remove();
      this.history.push(reply);
      if (this.history.length > 40) this.history = this.history.slice(-40);
      this.save();
      this.renderMsg(reply);
      if (reply.suggestions && reply.suggestions.length) this.renderChips(true, reply.suggestions);
      this.busy = false; this.sendBtn.disabled = false;
      if (!matchMedia('(max-width: 749px)').matches) this.input.focus({ preventScroll: true });
    }
    reset() {
      this.history = [];
      this.save();
      this.renderAll();
      if (!isPhone()) this.input.focus({ preventScroll: true });
    }
    save() { store.set(KEY, this.history); }
    grow() { const i = this.input; i.style.height = 'auto'; i.style.height = Math.min(i.scrollHeight + 3, 120) + 'px'; i.style.overflowY = i.scrollHeight > 120 ? 'auto' : 'hidden'; }
    scrollDown() { requestAnimationFrame(() => { this.log.scrollTop = this.log.scrollHeight; }); }
    track(name, data) {
      try { if (window.Shopify && Shopify.analytics && Shopify.analytics.publish) Shopify.analytics.publish(name, data || {}); } catch (e) {}
      try { if (window.fbq) fbq('trackCustom', name, data || {}); } catch (e) {}
    }
  }
  customElements.define('ga2-ai-chat', AiChat);
})();
