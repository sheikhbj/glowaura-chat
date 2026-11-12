# GlowAura chat server

The private side of the AI chat on glowaura.com.pk. It keeps the Anthropic API key
off the website, reads the live product list and the "Chat assistant notes" page,
and asks Claude for a short reply.

## Deploy on Vercel

1. vercel.com → Add New → Project → import this repo. No build settings needed.
2. Settings → Environment Variables:
   - `ANTHROPIC_API_KEY` (required): from console.anthropic.com → API Keys
   - `CLAUDE_MODEL` (optional): defaults to `claude-haiku-5-5`
   - `ALLOWED_ORIGINS` (optional): defaults to glowaura.com.pk, www, and the myshopify domain
3. Deploy. Your endpoint is `https://<project>.vercel.app/api/chat`.
   Opening it in a browser should show `{"ok":true,"service":"glowaura-chat"}`.
4. In Shopify: Online Store → Themes → Customize → footer → "GlowAura AI chat" → paste the endpoint.

## Updating what the assistant knows

- Products and prices: automatic, refreshed every 10 minutes.
- Temporary notes (dispatch delays, holidays, offers): edit the Shopify page "Chat assistant notes".
- Policies and tone: `RULES` in `lib/assistant.js`.

## Test

`node test/mock.test.js`
