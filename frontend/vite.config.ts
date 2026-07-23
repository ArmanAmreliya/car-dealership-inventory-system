import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
    },
  },
  test: {
    // Use jsdom so DOM APIs are available in unit tests
    environment: 'jsdom',

    // Run the jest-dom setup before every test file
    setupFiles: ['./src/test/setup.ts'],

    // Make vi / describe / it / expect globally available (no imports needed)
    globals: true,

    // Coverage via V8 (fast, no babel transforms required)
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      // Only measure coverage on application source — exclude test helpers,
      // auto-generated files, and node_modules.
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/test/**',
        'src/**/*.d.ts',
        'src/main.tsx',           // app entry — not unit-testable
        'src/vite-env.d.ts',
      ],
      thresholds: {
        statements: 0,
        branches: 0,
        functions: 0,
        lines: 0,
      },
    },
  },
});
