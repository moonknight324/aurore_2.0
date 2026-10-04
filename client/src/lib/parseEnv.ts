export interface Env {
  apiUrl: string;
  useMocks: boolean;
}

const DEFAULT_API_URL = 'http://localhost:4000/api/v1';

export function parseEnv(source: Record<string, unknown>): Env {
  const rawUrl = typeof source.VITE_API_URL === 'string' ? source.VITE_API_URL.trim() : '';
  const apiUrl = (rawUrl || DEFAULT_API_URL).replace(/\/+$/, '');
  const useMocks =
    String(source.VITE_USE_MOCKS ?? 'false')
      .trim()
      .toLowerCase() === 'true';
  return { apiUrl, useMocks };
}
