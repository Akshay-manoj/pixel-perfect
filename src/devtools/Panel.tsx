import React from 'react';

/** Root DevTools panel component */
export const Panel: React.FC = () => (
  <div
    style={{
      padding: 16,
      fontFamily: "'JetBrains Mono', monospace",
      background: '#1E1E2E',
      color: '#CDD6F4',
      minHeight: '100vh',
    }}
  >
    <h1 style={{ fontSize: 16, margin: '0 0 8px 0' }}>PixelPerfect DevTools</h1>
    <p style={{ fontSize: 12, color: '#6C7086', margin: 0 }}>
      Panel will be wired in Phase 10
    </p>
  </div>
);
