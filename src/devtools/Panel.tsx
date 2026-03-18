import React, { useState, useEffect, useCallback } from 'react';
import { ElementDetailsView } from './components/ElementDetailsView';
import { ExportTabsView } from './components/ExportTabsView';
import { EditHistoryPanel } from './components/EditHistoryPanel';
import { AuditReportView } from './components/AuditReportView';
import { AnimationDebugger } from './components/AnimationDebugger';
import { MESSAGE_ACTIONS } from '@shared/constants/messages.constants';
import type { AuditReport } from '@shared/types/audit.types';
import type { EditOperation } from '@shared/types/editor.types';

type Tab = 'element' | 'history' | 'audit' | 'animations';

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
  exports: Record<string, string>;
}

/** Root DevTools panel component */
export const Panel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('element');
  const [element, setElement] = useState<ElementData | null>(null);
  const [history, setHistory] = useState<EditOperation[]>([]);
  const [auditReport, setAuditReport] = useState<AuditReport | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [tabId, setTabId] = useState<number>(0);

  useEffect(() => {
    // Get current tab ID
    if (typeof chrome !== 'undefined' && chrome.devtools?.inspectedWindow) {
      setTabId(chrome.devtools.inspectedWindow.tabId);
    }

    // Listen for messages from content script
    if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
      const listener = (message: { action: string; payload?: unknown }) => {
        if (message.action === MESSAGE_ACTIONS.ELEMENT_SELECTED && message.payload) {
          setElement(message.payload as ElementData);
        }
      };
      chrome.runtime.onMessage.addListener(listener);
      return () => chrome.runtime.onMessage.removeListener(listener);
    }
  }, []);

  const sendToContentScript = useCallback(
    (action: string, payload?: unknown): Promise<unknown> => {
      return new Promise((resolve) => {
        if (typeof chrome !== 'undefined' && chrome.tabs && tabId) {
          chrome.tabs.sendMessage(tabId, { action, payload }, (response) => {
            if (chrome.runtime.lastError) { /* ignore */ }
            resolve(response);
          });
        } else {
          resolve(null);
        }
      });
    },
    [tabId],
  );

  const handleRunAudit = useCallback(async () => {
    setAuditLoading(true);
    const report = await sendToContentScript(MESSAGE_ACTIONS.RUN_AUDIT);
    if (report) setAuditReport(report as AuditReport);
    setAuditLoading(false);
  }, [sendToContentScript]);

  const handleUndo = useCallback(async (id: string) => {
    await sendToContentScript('UNDO_EDIT', { id });
    setHistory((prev) => prev.filter((op) => op.override.id !== id));
  }, [sendToContentScript]);

  const handleUndoAll = useCallback(async () => {
    await sendToContentScript('UNDO_ALL');
    setHistory([]);
  }, [sendToContentScript]);

  const handleExportPatch = useCallback(async () => {
    const result = await sendToContentScript(MESSAGE_ACTIONS.EXPORT_PATCH);
    if (result && typeof result === 'object' && 'code' in (result as Record<string, unknown>)) {
      navigator.clipboard.writeText((result as { code: string }).code).catch(() => {});
    }
  }, [sendToContentScript]);

  const handleCopyCode = useCallback((code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
  }, []);

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: 'element', label: 'Element Details' },
    { id: 'history', label: 'Edit History' },
    { id: 'audit', label: 'Audit Report' },
    { id: 'animations', label: 'Animations' },
  ];

  return (
    <div style={styles.container}>
      {/* Tab bar */}
      <div style={styles.tabBar}>
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              ...styles.tab,
              backgroundColor: activeTab === id ? '#6366F1' : 'transparent',
              color: activeTab === id ? '#FFFFFF' : '#A6ADC8',
              borderBottom: activeTab === id ? '2px solid #6366F1' : '2px solid transparent',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={styles.content}>
        {activeTab === 'element' && (
          <>
            <ElementDetailsView element={element} />
            {element && (
              <div style={{ marginTop: 16 }}>
                <ExportTabsView exports={element.exports || {}} onCopy={handleCopyCode} />
              </div>
            )}
          </>
        )}
        {activeTab === 'history' && (
          <EditHistoryPanel
            operations={history}
            onUndo={handleUndo}
            onUndoAll={handleUndoAll}
            onExportPatch={handleExportPatch}
          />
        )}
        {activeTab === 'audit' && (
          <AuditReportView
            report={auditReport}
            onRunAudit={handleRunAudit}
            loading={auditLoading}
          />
        )}
        {activeTab === 'animations' && (
          <AnimationDebugger tabId={tabId} />
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    background: '#1E1E2E',
    color: '#CDD6F4',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  tabBar: {
    display: 'flex',
    borderBottom: '1px solid #313244',
    background: '#181825',
    padding: '0 8px',
  },
  tab: {
    padding: '10px 16px',
    border: 'none',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
    transition: 'all 0.15s',
    background: 'transparent',
  },
  content: {
    flex: 1,
    padding: 16,
    overflowY: 'auto',
  },
};
