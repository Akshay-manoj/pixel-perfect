import React from 'react';

interface ElementData {
  selector: string;
  tagName: string;
  classList: string[];
  boxModel: {
    margin: { top: number; right: number; bottom: number; left: number };
    padding: { top: number; right: number; bottom: number; left: number };
    border: { top: number; right: number; bottom: number; left: number };
    content: { width: number; height: number };
  };
  properties: Array<{ prop: string; value: string; tokenName?: string; tailwindClass?: string }>;
}

interface ElementDetailsViewProps {
  element: ElementData | null;
}

export const ElementDetailsView: React.FC<ElementDetailsViewProps> = ({ element }) => {
  if (!element) {
    return (
      <div style={styles.empty}>
        <p style={styles.emptyText}>Click an element on the page to inspect it</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.tag}>{element.tagName}</span>
        {element.classList.map((cls, i) => (
          <span key={i} style={styles.cls}>.{cls}</span>
        ))}
      </div>
      <div style={styles.selector}>{element.selector}</div>

      {/* Box Model Diagram */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>BOX MODEL</div>
        <BoxModelDiagram boxModel={element.boxModel} />
      </div>

      {/* Computed Properties */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>COMPUTED STYLES</div>
        <div style={styles.propTable}>
          {element.properties.map(({ prop, value, tokenName, tailwindClass }) => (
            <div key={prop} style={styles.propRow}>
              <span style={styles.propName}>{prop}</span>
              <span style={styles.propValue}>{value}</span>
              {tokenName && <span style={styles.tokenBadge}>{tokenName}</span>}
              {tailwindClass && <span style={styles.twBadge}>{tailwindClass}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BoxModelDiagram: React.FC<{ boxModel: ElementData['boxModel'] }> = ({ boxModel }) => {
  const { margin, padding, border, content } = boxModel;
  return (
    <svg width="260" height="180" viewBox="0 0 260 180" style={{ display: 'block', margin: '8px auto' }}>
      {/* Margin */}
      <rect x="0" y="0" width="260" height="180" fill="rgba(246,178,107,0.3)" rx="4" />
      <text x="130" y="14" textAnchor="middle" fill="#F6B26B" fontSize="9" fontFamily="monospace">{margin.top}</text>
      <text x="130" y="176" textAnchor="middle" fill="#F6B26B" fontSize="9" fontFamily="monospace">{margin.bottom}</text>
      <text x="8" y="92" fill="#F6B26B" fontSize="9" fontFamily="monospace">{margin.left}</text>
      <text x="242" y="92" textAnchor="end" fill="#F6B26B" fontSize="9" fontFamily="monospace">{margin.right}</text>

      {/* Padding */}
      <rect x="30" y="22" width="200" height="136" fill="rgba(147,196,125,0.3)" rx="3" />
      <text x="130" y="36" textAnchor="middle" fill="#93C47D" fontSize="9" fontFamily="monospace">{padding.top}</text>
      <text x="130" y="154" textAnchor="middle" fill="#93C47D" fontSize="9" fontFamily="monospace">{padding.bottom}</text>
      <text x="38" y="92" fill="#93C47D" fontSize="9" fontFamily="monospace">{padding.left}</text>
      <text x="222" y="92" textAnchor="end" fill="#93C47D" fontSize="9" fontFamily="monospace">{padding.right}</text>

      {/* Content */}
      <rect x="60" y="44" width="140" height="92" fill="rgba(111,168,220,0.3)" rx="2" />
      <text x="130" y="94" textAnchor="middle" fill="#6FA8DC" fontSize="11" fontFamily="monospace" fontWeight="700">
        {Math.round(content.width)} x {Math.round(content.height)}
      </text>

      {/* Labels */}
      <text x="4" y="14" fill="#F6B26B" fontSize="8" fontFamily="monospace">margin</text>
      <text x="34" y="34" fill="#93C47D" fontSize="8" fontFamily="monospace">padding</text>
      <text x="64" y="56" fill="#6FA8DC" fontSize="8" fontFamily="monospace">content</text>
    </svg>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { padding: 0 },
  empty: { padding: 32, textAlign: 'center' },
  emptyText: { color: '#6C7086', fontSize: 13, margin: 0 },
  header: { display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 4 },
  tag: { color: '#89B4FA', fontSize: 16, fontWeight: 700, fontFamily: 'monospace' },
  cls: { color: '#A6ADC8', fontSize: 14, fontFamily: 'monospace' },
  selector: { color: '#6C7086', fontSize: 11, fontFamily: 'monospace', marginBottom: 12 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 10, fontWeight: 600, color: '#6C7086', letterSpacing: '0.05em', marginBottom: 6 },
  propTable: { display: 'flex', flexDirection: 'column', gap: 2 },
  propRow: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontFamily: 'monospace', padding: '2px 0' },
  propName: { color: '#6C7086', minWidth: 160 },
  propValue: { color: '#CDD6F4' },
  tokenBadge: { color: '#89B4FA', fontSize: 10, background: '#313244', padding: '1px 6px', borderRadius: 3 },
  twBadge: { color: '#A6E3A1', fontSize: 10, background: '#313244', padding: '1px 6px', borderRadius: 3 },
};
