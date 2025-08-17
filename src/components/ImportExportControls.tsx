import { useState } from 'react';
import type { ImportExportControlsProps, WorkflowData } from '../types/workflow';

export const ImportExportControls: React.FC<ImportExportControlsProps> = ({
  onExport,
  onImport,
}) => {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [importText, setImportText] = useState('');
  const [exportText, setExportText] = useState('');

  const handleExport = () => {
    const workflowData = onExport();
    setExportText(JSON.stringify(workflowData, null, 2));
    setShowExportDialog(true);
  };

  const handleImport = () => {
    if (!importText.trim()) {
      alert('Please enter JSON data to import');
      return;
    }

    try {
      const data = JSON.parse(importText);
      
      // Type guard to validate the data structure
      if (!isWorkflowData(data)) {
        throw new Error('Invalid workflow data format');
      }

      onImport(data);
      setImportText('');
      setShowImportDialog(false);
    } catch (error) {
      alert(`Failed to import workflow: ${error instanceof Error ? error.message : 'Invalid JSON format'}`);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(exportText);
      alert('JSON copied to clipboard!');
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = exportText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('JSON copied to clipboard!');
    }
  };

  return (
    <>
      <div className="import-export-controls">
        <button
          className="btn btn-secondary"
          onClick={() => setShowImportDialog(true)}
          title="Import workflow from JSON"
        >
          📁 Import
        </button>
        
        <button
          className="btn btn-primary"
          onClick={handleExport}
          title="Export workflow to JSON"
        >
          💾 Export
        </button>
      </div>

      {/* Import Dialog */}
      {showImportDialog && (
        <div className="dialog-overlay" onClick={() => setShowImportDialog(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h3>Import Workflow</h3>
              <button 
                className="dialog-close"
                onClick={() => setShowImportDialog(false)}
              >
                ×
              </button>
            </div>
            <div className="dialog-content">
              <p>Paste your workflow JSON data below:</p>
              <textarea
                className="json-textarea"
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste JSON data here..."
                rows={12}
              />
            </div>
            <div className="dialog-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowImportDialog(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleImport}
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Dialog */}
      {showExportDialog && (
        <div className="dialog-overlay" onClick={() => setShowExportDialog(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h3>Export Workflow</h3>
              <button 
                className="dialog-close"
                onClick={() => setShowExportDialog(false)}
              >
                ×
              </button>
            </div>
            <div className="dialog-content">
              <p>Copy the JSON data below:</p>
              <textarea
                className="json-textarea"
                value={exportText}
                readOnly
                rows={12}
              />
            </div>
            <div className="dialog-actions">
              <button
                className="btn btn-secondary"
                onClick={copyToClipboard}
              >
                📋 Copy to Clipboard
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setShowExportDialog(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Type guard function
function isWorkflowData(data: unknown): data is WorkflowData {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;
  
  return (
    Array.isArray(obj.nodes) &&
    Array.isArray(obj.edges) &&
    obj.nodes.every(isValidNode) &&
    obj.edges.every(isValidEdge)
  );
}

function isValidNode(node: unknown): boolean {
  if (typeof node !== 'object' || node === null) {
    return false;
  }

  const n = node as Record<string, unknown>;
  
  return (
    typeof n.id === 'string' &&
    typeof n.type === 'string' &&
    ['start', 'step', 'decision', 'end'].includes(n.type) &&
    typeof n.position === 'object' &&
    n.position !== null &&
    typeof n.data === 'object' &&
    n.data !== null
  );
}

function isValidEdge(edge: unknown): boolean {
  if (typeof edge !== 'object' || edge === null) {
    return false;
  }

  const e = edge as Record<string, unknown>;
  
  return (
    typeof e.id === 'string' &&
    typeof e.source === 'string' &&
    typeof e.target === 'string'
  );
}
