import React, { useState } from 'react';
import { EXPORT_FORMAT_LABELS } from '@shared/constants/export.constants';
import type { ExportFormat } from '@shared/types/export.types';

interface ExportTabsViewProps {
  exports: Record<string, string>;
  onCopy: (code: string) => void;
}

const TABS: Array<{ format: ExportFormat; label: string }> = [
  { format: 'css', label: 'CSS' },
  { format: 'scss', label: 'SCSS' },
  { format: 'sass', label: 'SASS' },
  { format: 'tailwind', label: 'Tailwind' },
  { format: 'css-in-js-template', label: 'Styled' },
  { format: 'css-in-js-object', label: 'JS Object' },
  { format: 'css-variables', label: 'CSS Vars' },
];

export const ExportTabsView: React.FC<ExportTabsViewProps> = ({ exports, onCopy }) => {
  const [activeTab, setActiveTab] = useState<ExportFormat>('css');
  const [copied, setCopied] = useState(false);

  const code = exports[activeTab] || '// Select an element to export';

  const handleCopy = () => {
    onCopy(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      {/* Tab bar */}
      <div style={styles.tabBar}>
        {TABS.map(({ format, label }) => (
          <button
            key={format}
            onClick={() => setActiveTab(format)}
            style={{
              ...styles.tab,
              backgroundColor: activeTab === format ? '#6366F1' : 'transparent',
              color: activeTab === format ? '#FFFFFF' : '#A6ADC8',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Code block */}
      <div style={styles.codeContainer}>
        <div style={styles.codeHeader}>
          <span style={styles.codeLabel}>{EXPORT_FORMAT_LABELS[activeTab] || activeTab}</span>
          <button onClick={handleCopy} style={styles.copyBtn}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre style={styles.code}>{highlightCode(code, activeTab)}</pre>
      </div>
    </div>
  );
};

/** Simple syntax highlighting — colorizes property names and values */
function highlightCode(code: string, format: ExportFormat): React.ReactNode {
  if (format === 'tailwind') {
    // Tailwind: just show as-is with accent color
    return <span style={{ color: '#A6E3A1' }}>{code}</span>;
  }

  // For CSS-like formats: colorize property: value pairs
  const lines = code.split('\n');
  return lines.map((line, i) => {
    const propMatch = line.match(/^(\s*)([\w-]+)(\s*:\s*)(.+?)(;?\s*)$/);
    if (propMatch) {
      const [, indent, prop, colon, value, rest] = propMatch;
      return (
        <span key={i}>
          {indent}
          <span style={{ color: '#89B4FA' }}>{prop}</span>
          {colon}
          <span style={{ color: '#FAB387' }}>{value}</span>
          {rest}
          {'\n'}
        </span>
      );
    }
    return <span key={i}>{line}{'\n'}</span>;
  });
}

const styles: Record<string, React.CSSProperties> = {
  tabBar: {
    display: 'flex',
    gap: 2,
    flexWrap: 'wrap',
    background: '#313244',
    borderRadius: 6,
    padding: 2,
    marginBottom: 8,
  },
  tab: {
    padding: '4px 8px',
    borderRadius: 4,
    border: 'none',
    cursor: 'pointer',
    fontSize: 10,
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    transition: 'background-color 0.15s',
  },
  codeContainer: {
    background: '#181825',
    border: '1px solid #313244',
    borderRadius: 6,
    overflow: 'hidden',
  },
  codeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 12px',
    borderBottom: '1px solid #313244',
  },
  codeLabel: { fontSize: 10, color: '#6C7086' },
  copyBtn: {
    background: '#6366F1',
    border: 'none',
    color: '#FFFFFF',
    fontSize: 10,
    padding: '3px 10px',
    borderRadius: 4,
    cursor: 'pointer',
  },
  code: {
    padding: 12,
    margin: 0,
    fontSize: 11,
    fontFamily: "'JetBrains Mono', monospace",
    color: '#CDD6F4',
    overflowX: 'auto',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
  },
};
