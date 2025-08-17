import { Handle, Position } from '@xyflow/react';
import type { BaseNodeProps } from '../../types/workflow';

export const EndNode: React.FC<BaseNodeProps> = ({ id, data, selected }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  return (
    <div 
      className={`workflow-node end-node ${selected ? 'selected' : ''}`}
      style={{
        background: 'var(--node-end)',
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

      <div style={{ marginBottom: 'var(--space-xs)' }}>🏁</div>
      <div>{data.label}</div>
      
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: 'white',
          border: '2px solid var(--node-end)',
          width: '8px',
          height: '8px',
        }}
      />
    </div>
  );
};
