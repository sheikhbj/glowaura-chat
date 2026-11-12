import { handle } from '../../lib/assistant.js';

const env = {
  get ANTHROPIC_API_KEY() { return Netlify.env.get('ANTHROPIC_API_KEY'); },
  get CLAUDE_MODEL() { return Netlify.env.get('CLAUDE_MODEL'); },
  get ALLOWED_ORIGINS() { return Netlify.env.get('ALLOWED_ORIGINS'); }
};

export default (request) => handle(request, env);

export const config = { path: '/api/chat' };
