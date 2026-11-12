import { handle } from '../lib/assistant.js';

export const config = { runtime: 'edge' };

export default function handler(request) {
  return handle(request, process.env);
}
