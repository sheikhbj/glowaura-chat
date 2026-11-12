import { handle, parseReply, cleanMessages } from '../lib/assistant.js';
import assert from 'node:assert';

const products = [
  { handle: 'dr-althea-147-barrier-cream', vendor: 'Dr. Althea', title: 'Dr. Althea 147 Barrier Cream', product_type: 'Moisturiser', tags: ['cat:moisturiser','concern:barrier','ceramide','pick'], variants: [{ title: 'Default Title', price: '5149.00', compare_at_price: '5800.00', available: true }] },
  { handle: 'old-thing', vendor: 'X', title: 'Old', product_type: '', tags: [], variants: [{ title: '30ml', price: '1000', available: false }] }
];
let sent;
const fakeFetch = async (url, opts) => {
  if (url.includes('/products.json')) return new Response(JSON.stringify({ products: url.includes('page=1') ? products : [] }));
  if (url.includes('chat-assistant-notes')) return new Response('COD dispatch resumes Monday.');
  if (url.includes('api.anthropic.com')) {
    sent = JSON.parse(opts.body);
    return new Response(JSON.stringify({ content: [{ type: 'text', text: 'Try this one.\n[[p:dr-althea-147-barrier-cream]]\n[[p:made-up-product]]\n[[wa]]' }], usage: { input_tokens: 10, output_tokens: 5 } }));
  }
  throw new Error('unexpected ' + url);
};
const env = { ANTHROPIC_API_KEY: 'test' };
const req = (body, origin = 'https://glowaura.com.pk') => new Request('https://x/api/chat', { method: 'POST', headers: { origin, 'content-type': 'application/json' }, body: JSON.stringify(body) });

const res = await handle(req({ messages: [{ role: 'assistant', content: 'hi' }, { role: 'user', content: 'meri skin red ho jati hai' }], context: { page: { type: 'index' }, cart: [] } }), env, fakeFetch);
const out = await res.json();
assert.equal(res.status, 200);
assert.deepEqual(out.products, ['dr-althea-147-barrier-cream']);
assert.equal(out.whatsapp, true);
assert.equal(out.reply, 'Try this one.');
assert.equal(sent.messages.length, 1, 'leading assistant turn dropped');
assert.match(sent.messages[0].content, /not instructions/);
assert.match(sent.system[1].text, /Rs 5,149 \(was Rs 5,800\)/);
assert.match(sent.system[1].text, /SOLD OUT/);
assert.match(sent.system[2].text, /COD dispatch resumes Monday/);
assert.equal(res.headers.get('access-control-allow-origin'), 'https://glowaura.com.pk');

const bad = await handle(req({ messages: [{ role: 'user', content: 'x' }] }, 'https://evil.example'), env, fakeFetch);
assert.equal(bad.status, 403);
const noKey = await handle(req({ messages: [{ role: 'user', content: 'x' }] }), {}, fakeFetch);
assert.equal(noKey.status, 503);
assert.equal(cleanMessages([{ role: 'user', content: 'a' }, { role: 'assistant', content: 'b' }]), null);
console.log('all tests passed');
const hs = new Set(['anua-niacinamide-10-txa-4-serum-30ml', 'medicube-zero-foam-cleanser-120g']);
assert.deepEqual(parseReply('x\n[[p:anua-niacinamide-10-txa-4-serum]]\n[[ p:medicube-zero-foam-cleanser-120g ]]\n[[p:totally-unknown]]', hs).products, ['anua-niacinamide-10-txa-4-serum-30ml', 'medicube-zero-foam-cleanser-120g']);
console.log('handle matching passed');
{
  const pr = parseReply('Hi\n[[q:Oily skin]]\n[[ q: Dry skin ]]\n[[p:anua-niacinamide-10-txa-4-serum-30ml]]', new Set(['anua-niacinamide-10-txa-4-serum-30ml']));
  assert.deepEqual(pr.suggestions, ['Oily skin', 'Dry skin']);
  assert.equal(pr.reply, 'Hi');
  const { briefOf, contextNote } = await import('../lib/assistant.js');
  const b = briefOf("<p>A peel shot.</p><h3>What's inside</h3><ul><li>BHA</li><li>Centella</li></ul><h3>How to use</h3><p>Evening only.</p><h3>Frequently asked questions</h3><details>x</details><script>{}</script>");
  assert.equal(b, 'A peel shot. | Inside: BHA, Centella | How to use: Evening only.');
  const note = contextNote({ cart: [{ handle: 'a', qty: 1 }], cartTotal: 5000 }, new Map([['a', { title: 'Cream A' }]]));
  assert.match(note, /Cream A \[a\].*Rs 1,000 more for free delivery/);
  console.log('v2 features passed');
}
