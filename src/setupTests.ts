import '@testing-library/jest-dom';

/**
 * Minimal TextEncoder/TextDecoder polyfill for older Node versions.
 * Keep it here only — don't scatter polyfills across repo.
 */
if (typeof globalThis.TextEncoder === 'undefined') {
  // @ts-expect-error - require is available in Jest/Node environment
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { TextEncoder, TextDecoder } = require('util');
  globalThis.TextEncoder = TextEncoder;
  globalThis.TextDecoder = TextDecoder;
}
