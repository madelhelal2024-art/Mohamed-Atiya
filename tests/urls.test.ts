import { describe, expect, it } from 'vitest';
import { isExternalUrl, isSafeUrl, sanitizeUrl } from '../src/lib/urls';

describe('URL Safety Helpers', () => {
  it('identifies safe internal and hash routes', () => {
    expect(isSafeUrl('/curriculum')).toBe(true);
    expect(isSafeUrl('#/lesson/lesson-01')).toBe(true);
    expect(isSafeUrl('/assets/sample.pdf')).toBe(true);
  });

  it('identifies safe external http/https/mailto protocols', () => {
    expect(isSafeUrl('https://youtube.com')).toBe(true);
    expect(isSafeUrl('http://example.com')).toBe(true);
    expect(isSafeUrl('mailto:teacher@example.com')).toBe(true);
    expect(isSafeUrl('tel:+123456789')).toBe(true);
  });

  it('rejects unsafe protocols like javascript: or data:', () => {
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('vbscript:msgbox(1)')).toBe(false);
    expect(isSafeUrl('')).toBe(false);
    expect(isSafeUrl(null)).toBe(false);
    expect(isSafeUrl(undefined)).toBe(false);
  });

  it('sanitizes unsafe URLs with fallback', () => {
    expect(sanitizeUrl('javascript:alert(1)', '#')).toBe('#');
    expect(sanitizeUrl('https://safe.org', '#')).toBe('https://safe.org');
    expect(sanitizeUrl(null, '#')).toBe('#');
  });

  it('detects external URLs properly', () => {
    expect(isExternalUrl('https://google.com')).toBe(true);
    expect(isExternalUrl('http://localhost:3000')).toBe(true);
    expect(isExternalUrl('/curriculum')).toBe(false);
    expect(isExternalUrl('#/board')).toBe(false);
  });
});
