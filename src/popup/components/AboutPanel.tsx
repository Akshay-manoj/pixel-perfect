import React from 'react';

export const AboutPanel: React.FC = () => {
  return (
    <div style={styles.container}>
      <span style={styles.version}>v1.0.0</span>
      <a
        href="https://github.com/user/pixelperfect"
        target="_blank"
        rel="noopener noreferrer"
        style={styles.link}
      >
        GitHub
      </a>
      <button
        onClick={() => {
          // Feedback placeholder
        }}
        style={styles.feedbackBtn}
        aria-label="Send feedback"
      >
        Feedback
      </button>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  version: {
    fontSize: 11,
    color: '#6C7086',
  },
  link: {
    fontSize: 11,
    color: '#89B4FA',
    textDecoration: 'none',
  },
  feedbackBtn: {
    background: 'none',
    border: 'none',
    color: '#89B4FA',
    fontSize: 11,
    cursor: 'pointer',
    padding: 0,
  },
};
