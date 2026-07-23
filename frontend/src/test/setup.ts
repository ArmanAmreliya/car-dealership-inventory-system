/**
 * Vitest global test setup
 *
 * Imported by every test file via vitest.config.ts `setupFiles`.
 * Extends Vitest's `expect` with @testing-library/jest-dom matchers
 * so assertions like `toBeInTheDocument()`, `toHaveValue()`, etc. work.
 */
import '@testing-library/jest-dom';
