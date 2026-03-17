import React, { useState } from 'react';
import type { CustomToken } from '@shared/types/settings.types';

interface TokenConfigPanelProps {
  customTokens: CustomToken[];
  onChange: (tokens: CustomToken[]) => void;
}

export const TokenConfigPanel: React.FC<TokenConfigPanelProps> = ({ customTokens, onChange }) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');

  const handleAdd = () => {
    if (!name.trim() || !value.trim()) return;
    const token: CustomToken = { name: name.trim(), value: value.trim() };
    onChange([...customTokens, token]);
    setName('');
    setValue('');
  };

  const handleDelete = (index: number) => {
    const updated = customTokens.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.addEventListener('change', async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const json = JSON.parse(text);
        // Send to content script for processing
        if (typeof chrome !== 'undefined' && chrome.tabs) {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
              chrome.tabs.sendMessage(tabs[0].id, {
                action: 'IMPORT_TOKENS',
                payload: json,
              });
            }
          });
        }
      } catch {
        // Invalid JSON
      }
    });
    input.click();
  };

  return (
    <div>
      <div style={styles.headerRow}>
        <span style={styles.label}>DESIGN TOKENS</span>
        <button onClick={handleImport} style={styles.importBtn}>Import</button>
      </div>

      {customTokens.length > 0 && (
        <div style={styles.tokenList}>
          {customTokens.map((token, i) => (
            <div key={i} style={styles.tokenRow}>
              <span style={styles.tokenName}>{token.name}</span>
              <span style={styles.tokenValue}>{token.value}</span>
              <button onClick={() => handleDelete(i)} style={styles.deleteBtn}>&times;</button>
            </div>
          ))}
        </div>
      )}

      <div style={styles.addRow}>
        <input
          placeholder="--name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
          aria-label="Token name"
        />
        <input
          placeholder="value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={styles.input}
          aria-label="Token value"
        />
        <button onClick={handleAdd} style={styles.addBtn}>+</button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 10,
    fontWeight: 600,
    color: '#6C7086',
    letterSpacing: '0.05em',
  },
  importBtn: {
    background: 'none',
    border: '1px solid #45475A',
    color: '#89B4FA',
    fontSize: 10,
    padding: '2px 8px',
    borderRadius: 4,
    cursor: 'pointer',
  },
  tokenList: {
    marginBottom: 6,
  },
  tokenRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '3px 0',
    fontSize: 11,
  },
  tokenName: {
    color: '#89B4FA',
    fontFamily: 'monospace',
    flex: 1,
  },
  tokenValue: {
    color: '#A6ADC8',
    fontFamily: 'monospace',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#F38BA8',
    cursor: 'pointer',
    fontSize: 14,
    padding: '0 4px',
  },
  addRow: {
    display: 'flex',
    gap: 4,
  },
  input: {
    flex: 1,
    padding: '4px 6px',
    borderRadius: 4,
    border: '1px solid #45475A',
    background: '#313244',
    color: '#CDD6F4',
    fontSize: 11,
    fontFamily: 'monospace',
    minWidth: 0,
  },
  addBtn: {
    background: '#6366F1',
    border: 'none',
    color: '#FFFFFF',
    fontSize: 14,
    padding: '2px 10px',
    borderRadius: 4,
    cursor: 'pointer',
  },
};
