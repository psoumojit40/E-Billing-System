/**
 * Dynamic API Base URL resolver.
 * In development / unified deployment: uses relative '/api' (via Vite proxy or same-origin server).
 * When VITE_API_URL is set (e.g. separate Vercel frontend + Render backend): prepends custom backend origin.
 */
export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
