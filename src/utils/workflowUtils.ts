import type { 
  WorkflowNode, 
  WorkflowEdge, 
  WorkflowData, 
  ValidationResult, 
  NodeType
} from '../types/workflow';

export const createNode = (
  type: NodeType,
  position: { x: number; y: number },
  onConnectStart: (nodeId: string) => void,
  onDelete?: (nodeId: string) => void
): WorkflowNode => {
  const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const label = type.charAt(0).toUpperCase() + type.slice(1);
  
  const defaultConfigs = {
    start: {},
    step: { key: '', value: '' },
    decision: { condition: '' },
    end: {},
  };

  return {
    id,
    type,
    position,
    data: {
      label,
      config: defaultConfigs[type],
      onConnectStart: () => onConnectStart(id),
      onDelete,
    },
  };
};

export const createEdge = (
  source: string,
  target: string,
  label?: string,
  sourceHandle?: string
): WorkflowEdge => ({
  id: `${source}-${target}`,
  source,
  target,
  label,
  type: 'default',
  ...(sourceHandle && { sourceHandle }),
});

export const validateWorkflow = (
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): ValidationResult => {
  const issues: string[] = [];
  
  // Check for exactly one start node
  const startNodes = nodes.filter(n => n.type === 'start');
  if (startNodes.length === 0) {
    issues.push('Missing Start node');
  } else if (startNodes.length > 1) {
    issues.push('Multiple Start nodes found');
  }
  
  // Validate decision nodes
  nodes.forEach(node => {
    if (node.type === 'decision') {
      const outgoingEdges = edges.filter(e => e.source === node.id);
      
      if (outgoingEdges.length === 1) {
        issues.push(`Decision "${node.data.label}" needs 0 or 2 outgoing edges`);
      } else if (outgoingEdges.length === 2) {
        const labels = outgoingEdges.map(e => e.label).sort();
        if (labels[0] !== 'no' || labels[1] !== 'yes') {
          issues.push(`Decision "${node.data.label}" edges must be labeled "yes" and "no"`);
        }
      } else if (outgoingEdges.length > 2) {
        issues.push(`Decision "${node.data.label}" cannot have more than 2 outgoing edges`);
      }
    }
  });
  
  // Check for orphaned nodes (except start nodes)
  const connectedNodeIds = new Set([
    ...edges.map(e => e.source),
    ...edges.map(e => e.target),
  ]);
  
  const orphanedNodes = nodes.filter(
    node => node.type !== 'start' && !connectedNodeIds.has(node.id)
  );
  
  if (orphanedNodes.length > 0) {
    issues.push(`${orphanedNodes.length} disconnected node(s) found`);
  }
  
  return {
    isValid: issues.length === 0,
    issues,
  };
};

export const exportWorkflow = (
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  metadata?: WorkflowData['metadata']
): WorkflowData => {
  const cleanNodes = nodes.map(({ id, type, position, data }) => ({
    id,
    type,
    position,
    data: {
      label: data.label,
      config: data.config,
    },
  }));

  const cleanEdges = edges.map(({ id, source, target, label, sourceHandle }) => ({
    id,
    source,
    target,
    ...(label && { label }),
    ...(sourceHandle && { sourceHandle }),
  }));

  return {
    nodes: cleanNodes,
    edges: cleanEdges,
    metadata: {
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...metadata,
    },
  };
};

export const importWorkflow = (
  workflowData: WorkflowData,
  onConnectStart: (nodeId: string) => void,
  onDelete?: (nodeId: string) => void
): { nodes: WorkflowNode[]; edges: WorkflowEdge[] } => {
  const nodes = workflowData.nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      onConnectStart: () => onConnectStart(node.id),
      onDelete,
    },
  }));

  return {
    nodes,
    edges: workflowData.edges,
  };
};
