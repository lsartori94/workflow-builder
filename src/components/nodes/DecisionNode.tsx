import { Handle, Position } from '@xyflow/react';
import type { BaseNodeProps } from '../../types/workflow';

export const DecisionNode: React.FC<BaseNodeProps> = ({ id, data, selected }) => {
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
      className={`workflow-node decision-node ${selected ? 'selected' : ''}`}
      style={{
        width: '100px',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      {/* Delete button - positioned outside the clipped area */}
      <button
        className="node-delete-button"
        onClick={handleDelete}
        style={{
          right: '15px',
        }}
      >
        ×
      </button>

      {/* Diamond shape container */}
      <div
        style={{
          width: '100px',
          height: '100px',
          background: 'var(--node-decision)',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          border: selected ? '3px solid var(--border-focus)' : 'none',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{
          color: 'white',
          textAlign: 'center',
          fontSize: '12px',
          fontWeight: '500',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
        }}>
          <div style={{ fontSize: '16px' }}>❓</div>
          <div style={{ 
            maxWidth: '60px', 
            lineHeight: '1.2',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {data.label}
            {data.config.condition && (
              <div style={{fontSize: '8px'}}>{data.config.condition}</div>
            )}
          </div>
        </div>
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: 'white',
          border: '2px solid var(--node-decision)',
          width: '10px',
          height: '10px',
          left: '-5px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
      
      <Handle
        type="source"
        position={Position.Top}
        id="yes"
        style={{
          background: 'white',
          border: '2px solid var(--node-decision)',
          width: '10px',
          height: '10px',
          top: '-5px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        onClick={handleConnectClick}
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="no"
        style={{
          background: 'white',
          border: '2px solid var(--node-decision)',
          width: '10px',
          height: '10px',
          bottom: '-5px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        onClick={handleConnectClick}
      />
      
    </div>
  );
};
