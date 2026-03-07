export function isOffline(): boolean {
  if (typeof window === 'undefined') return false;
  if ('onLine' in navigator) {
    return navigator.onLine === false;
  }
  return false;
}

export function isOfflineError(err: unknown): boolean {
  if (isOffline()) return true;

  const msg = (err as any)?.message ?? String(err ?? '');
  const name = (err as any)?.name ?? '';
  const code = (err as any)?.code ?? '';

  // Common fetch/network failure signals in browsers and Node
  if (name === 'TypeError') return true; // fetch() network failure often throws TypeError
  if (typeof msg === 'string') {
    const m = msg.toLowerCase();
    if (m.includes('failed to fetch')) return true;
    if (m.includes('networkerror')) return true;
    if (m.includes('network error')) return true;
    if (m.includes('fetch failed')) return true;
    if (m.includes('load failed')) return true;
    if (m.includes('connection refused')) return true;
    if (m.includes('connection reset')) return true;
    if (m.includes('network request failed')) return true;
  }
  if (code && typeof code === 'string') {
    const c = code.toUpperCase();
    if (c.includes('ENOTFOUND') || c.includes('ECONNREFUSED') || c.includes('EAI_AGAIN')) return true;
  }

  return false;
}
