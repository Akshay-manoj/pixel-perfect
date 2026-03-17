import React from 'react';

/** Root popup component */
export const Popup: React.FC = () => (
  <div
    style={{
      width: 320,
      padding: 16,
      fontFamily: "'JetBrains Mono', monospace",
      background: '#1E1E2E',
      color: '#CDD6F4',
    }}
  >
    <h1 style={{ fontSize: 18, margin: '0 0 8px 0' }}>PixelPerfect</h1>
    <p style={{ fontSize: 12, color: '#6C7086', margin: 0 }}>
      v1.0.0 — Phase 1 scaffold complete
    </p>
  </div>
);
