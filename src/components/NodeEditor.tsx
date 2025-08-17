import { useState, useEffect } from 'react';
import type { NodeEditorProps, NodeConfig } from '../types/workflow';

export const NodeEditor: React.FC<NodeEditorProps> = ({
  node,
  onUpdate,
  onClose,
}) => {
  const [label, setLabel] = useState(node.data.label);
  const [config, setConfig] = useState<NodeConfig>(node.data.config || {});

  useEffect(() => {
    setLabel(node.data.label);
    setConfig(node.data.config || {});
  }, [node]);

  const handleSave = () => {
    onUpdate(node.id, { label, config });
    onClose();
  };

  const handleConfigChange = (key: keyof NodeConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="node-editor-overlay" onClick={handleOverlayClick}>
      <div className="node-editor">
        <div className="node-editor-header">
          <h3>Edit {node.type} Node</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="node-editor-content">
          <div className="form-group">
            <label>Label:</label>
            <input
              className="input"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Node label"
            />
          </div>

          {node.type === 'step' && (
            <>
              <div className="form-group">
                <label>Key:</label>
                <input
                  className="input"
                  type="text"
                  value={config.key || ''}
                  onChange={(e) => handleConfigChange('key', e.target.value)}
                  placeholder="Configuration key"
                />
              </div>
              <div className="form-group">
                <label>Value:</label>
                <input
                  className="input"
                  type="text"
                  value={config.value || ''}
                  onChange={(e) => handleConfigChange('value', e.target.value)}
                  placeholder="Configuration value"
                />
              </div>
            </>
          )}

          {node.type === 'decision' && (
            <div className="form-group">
              <label>Condition:</label>
              <input
                className="input"
                type="text"
                value={config.condition || ''}
                onChange={(e) => handleConfigChange('condition', e.target.value)}
                placeholder="Decision condition"
              />
            </div>
          )}
        </div>

        <div className="node-editor-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
