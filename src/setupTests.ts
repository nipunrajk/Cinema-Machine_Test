import '@testing-library/jest-dom';

/**
 * Minimal TextEncoder/TextDecoder polyfill for older Node versions.
 * Keep it here only — don't scatter polyfills across repo.
 */
if (typeof globalThis.TextEncoder === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const util = require('util');
  globalThis.TextEncoder = util.TextEncoder;
  globalThis.TextDecoder = util.TextDecoder;
}

// Mock window.matchMedia (used by some UI libs like react-hot-toast)
if (typeof window.matchMedia === 'undefined') {
  window.matchMedia = () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
