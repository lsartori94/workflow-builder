import type { WorkflowPaletteProps, NodeType } from '../types/workflow';

interface NodeTypeConfig {
  type: NodeType;
  label: string;
  icon: string;
  description: string;
}

const NODE_TYPES: NodeTypeConfig[] = [
  {
    type: 'start',
    label: 'Start',
    icon: '▶️',
    description: 'Starting point of the workflow',
  },
  {
    type: 'step',
    label: 'Step',
    icon: '⚙️',
    description: 'Process or action step',
  },
  {
    type: 'decision',
    label: 'Decision',
    icon: '❓',
    description: 'Conditional branching point',
  },
  {
    type: 'end',
    label: 'End',
    icon: '🏁',
    description: 'End point of the workflow',
  },
];

export const WorkflowPalette: React.FC<WorkflowPaletteProps> = ({
  onAddNode,
}) => {
  const handleNodeAdd = (type: NodeType) => {
    // Add node at center of canvas with some randomization to avoid overlap
    const centerX = 400 + (Math.random() - 0.5) * 100;
    const centerY = 300 + (Math.random() - 0.5) * 100;
    onAddNode(type, { x: centerX, y: centerY });
  };

  return (
    <div className="workflow-palette">
      <div className="palette-header">
        <h3 className="palette-title">Node Types</h3>
        <p className="palette-subtitle">Click to add nodes to the canvas</p>
      </div>
      
      <div className="palette-grid">
        {NODE_TYPES.map(({ type, label, icon, description }) => (
          <button
            key={type}
            className="palette-node-button"
            onClick={() => handleNodeAdd(type)}
            title={description}
          >
            <span className="node-icon">{icon}</span>
            <span className="node-label">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
