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
