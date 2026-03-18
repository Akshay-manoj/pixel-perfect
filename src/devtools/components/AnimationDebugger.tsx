import React, { useState, useCallback } from 'react';

interface AnimationEntry {
  selector: string;
  animationName: string;
  duration: string;
  easing: string;
  type: 'animation' | 'transition';
}

interface AnimationDebuggerProps {
  tabId: number;
}

export const AnimationDebugger: React.FC<AnimationDebuggerProps> = ({ tabId }) => {
  const [animations, setAnimations] = useState<AnimationEntry[]>([]);
  const [slowMotion, setSlowMotion] = useState(false);
  const [paused, setPaused] = useState(false);

  const scan = useCallback(() => {
    if (typeof chrome === 'undefined' || !chrome.scripting) return;
    chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const results: Array<{ selector: string; animationName: string; duration: string; easing: string; type: string }> = [];
        const els = document.querySelectorAll('*');
        for (let i = 0; i < els.length; i++) {
          const style = window.getComputedStyle(els[i]);
          if (style.animationName && style.animationName !== 'none') {
            results.push({
              selector: els[i].tagName.toLowerCase() + (els[i].className ? '.' + els[i].className.split(' ')[0] : ''),
              animationName: style.animationName,
              duration: style.animationDuration,
              easing: style.animationTimingFunction,
              type: 'animation',
            });
          }
          if (style.transitionProperty && style.transitionProperty !== 'all' && style.transitionProperty !== 'none') {
            results.push({
              selector: els[i].tagName.toLowerCase() + (els[i].className ? '.' + els[i].className.split(' ')[0] : ''),
              animationName: style.transitionProperty,
              duration: style.transitionDuration,
              easing: style.transitionTimingFunction,
              type: 'transition',
            });
          }
        }
        return results;
      },
    }).then((results) => {
      if (results?.[0]?.result) {
        setAnimations(results[0].result as AnimationEntry[]);
      }
    }).catch(() => {});
  }, [tabId]);

  const toggleSlowMotion = useCallback(() => {
    const newVal = !slowMotion;
    setSlowMotion(newVal);
    if (typeof chrome !== 'undefined' && chrome.scripting) {
      chrome.scripting.executeScript({
        target: { tabId },
        func: (slow: boolean) => {
          document.documentElement.style.setProperty('--pp-anim-scale', slow ? '10' : '1');
          const style = document.getElementById('pp-slow-motion') || document.createElement('style');
          style.id = 'pp-slow-motion';
          style.textContent = slow
            ? '*, *::before, *::after { animation-duration: calc(var(--pp-anim-scale, 1) * var(--orig-duration, 1s)) !important; transition-duration: calc(var(--pp-anim-scale, 1) * var(--orig-duration, 0.3s)) !important; }'
            : '';
          if (!style.parentNode) document.head.appendChild(style);
        },
        args: [newVal],
      }).catch(() => {});
    }
  }, [slowMotion, tabId]);

  const togglePause = useCallback(() => {
    const newVal = !paused;
    setPaused(newVal);
    if (typeof chrome !== 'undefined' && chrome.scripting) {
      chrome.scripting.executeScript({
        target: { tabId },
        func: (pause: boolean) => {
          document.documentElement.style.setProperty('animation-play-state', pause ? 'paused' : 'running');
          const style = document.getElementById('pp-pause-anims') || document.createElement('style');
          style.id = 'pp-pause-anims';
          style.textContent = pause
            ? '*, *::before, *::after { animation-play-state: paused !important; }'
            : '';
          if (!style.parentNode) document.head.appendChild(style);
        },
        args: [newVal],
      }).catch(() => {});
    }
  }, [paused, tabId]);

  return (
    <div>
      {/* Controls */}
      <div style={styles.controls}>
        <button onClick={scan} style={styles.btn}>Scan Animations</button>
        <button
          onClick={toggleSlowMotion}
          style={{ ...styles.btn, background: slowMotion ? '#FAB387' : '#313244', color: slowMotion ? '#1E1E2E' : '#CDD6F4' }}
        >
          {slowMotion ? 'Slow Motion ON' : 'Slow Motion'}
        </button>
        <button
          onClick={togglePause}
          style={{ ...styles.btn, background: paused ? '#F38BA8' : '#313244', color: paused ? '#1E1E2E' : '#CDD6F4' }}
        >
          {paused ? 'Paused' : 'Pause All'}
        </button>
      </div>

      {/* Animation list */}
      {animations.length === 0 && (
        <div style={styles.empty}>
          <p style={styles.emptyText}>Click "Scan Animations" to detect active animations</p>
        </div>
      )}

      {animations.map((anim, i) => (
        <div key={i} style={styles.entry}>
          <div style={styles.entryHeader}>
            <span style={styles.selector}>{anim.selector}</span>
            <span style={styles.typeBadge}>{anim.type}</span>
          </div>
          <div style={styles.entryBody}>
            <span style={styles.prop}>{anim.animationName}</span>
            <span style={styles.detail}>{anim.duration} &middot; {anim.easing}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  controls: { display: 'flex', gap: 8, marginBottom: 12 },
  btn: {
    background: '#313244', border: '1px solid #45475A', color: '#CDD6F4',
    fontSize: 11, padding: '5px 12px', borderRadius: 4, cursor: 'pointer',
    transition: 'background-color 0.15s',
  },
  empty: { padding: 32, textAlign: 'center' },
  emptyText: { color: '#6C7086', fontSize: 13, margin: 0 },
  entry: {
    background: '#181825', border: '1px solid #313244', borderRadius: 6,
    padding: '8px 12px', marginBottom: 4,
  },
  entryHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  selector: { color: '#89B4FA', fontSize: 11, fontFamily: 'monospace' },
  typeBadge: { color: '#6C7086', fontSize: 9, background: '#313244', padding: '1px 6px', borderRadius: 3 },
  entryBody: { display: 'flex', gap: 12, fontSize: 11, fontFamily: 'monospace' },
  prop: { color: '#CDD6F4' },
  detail: { color: '#6C7086' },
};
