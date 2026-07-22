import React from 'react';
import ReactDOM from 'react-dom/client';
import { Providers } from './app/providers';
import './styles/globals.css';

// Error logging
console.log('[main.tsx] Initializing application...');
console.log('[main.tsx] React version:', React.version);
console.log('[main.tsx] Root element:', document.getElementById('root'));

// Global error handler
window.addEventListener('error', (event) => {
  console.error('[Global Error]', event.message, event.filename, event.lineno);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[Unhandled Promise Rejection]', event.reason);
});

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  ReactDOM.createRoot(rootElement).render(
    <Providers />
  );
  console.log('[main.tsx] Application rendered successfully');
} catch (error) {
  console.error('[main.tsx] Failed to render application:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; color: red; font-family: monospace;">
      <h1>Application Error</h1>
      <pre>${error instanceof Error ? error.message : String(error)}</pre>
      <p>Check the console for more details.</p>
    </div>
  `;
}
