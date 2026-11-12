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
