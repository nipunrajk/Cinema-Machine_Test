import '@testing-library/jest-dom';

/**
 * Minimal TextEncoder/TextDecoder polyfill for older Node versions.
 * Keep it here only — don't scatter polyfills across repo.
 */
if (typeof (global as any).TextEncoder === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const util = require('util');
  (global as any).TextEncoder = util.TextEncoder;
  (global as any).TextDecoder = util.TextDecoder;
}
