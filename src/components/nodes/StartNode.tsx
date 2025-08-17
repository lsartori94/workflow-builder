import { Handle, Position } from '@xyflow/react';
import type { BaseNodeProps } from '../../types/workflow';

export const StartNode: React.FC<BaseNodeProps> = ({ id, data, selected }) => {
  const handleConnectClick = () => {
    if (data.onConnectStart) {
      data.onConnectStart();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  return (
    <div 
      className={`workflow-node start-node ${selected ? 'selected' : ''}`}
      style={{
        background: 'var(--node-start)',
        color: 'white',
        padding: 'var(--space-md)',
        borderRadius: 'var(--radius-md)',
        minWidth: '80px',
        textAlign: 'center',
        fontSize: '13px',
        fontWeight: '500',
        border: selected ? '2px solid var(--border-focus)' : '1px solid transparent',
        boxShadow: 'var(--shadow-sm)',
        position: 'relative',
      }}
    >
      {/* Delete button */}
      <button
        className="node-delete-button"
        onClick={handleDelete}
      >
        ×
      </button>

      <div style={{ marginBottom: 'var(--space-xs)' }}>▶️</div>
      <div>{data.label}</div>
      
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: 'white',
          border: '2px solid var(--node-start)',
          width: '8px',
          height: '8px',
        }}
        onClick={handleConnectClick}
      />
    </div>
  );
};
