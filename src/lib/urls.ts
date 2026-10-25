/**
 * URL validation and safety helpers
 */

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

export function isSafeUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) {
    return true;
  }
  try {
    const parsed = new URL(trimmed, 'https://placeholder.internal');
    return ALLOWED_PROTOCOLS.has(parsed.protocol);
  } catch {
    return false;
  }
}

export function sanitizeUrl(url: string | null | undefined, fallback = '#'): string {
  if (!url) return fallback;
  return isSafeUrl(url) ? url.trim() : fallback;
}

export function isExternalUrl(url: string): boolean {
  if (!url) return false;
  return /^https?:\/\//i.test(url.trim());
}
