import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: true, media: query, onchange: null,
        addListener: vi.fn(), removeListener: vi.fn(),
        addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
    })),
});
Object.defineProperty(Element.prototype, 'scrollIntoView', { configurable: true, value: vi.fn() });
Object.defineProperty(window, 'scrollTo', { configurable: true, value: vi.fn() });
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (callback: FrameRequestCallback) => window.setTimeout(() => callback(performance.now()), 0);
    window.cancelAnimationFrame = (id: number) => window.clearTimeout(id);
}
afterEach(cleanup);
