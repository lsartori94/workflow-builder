import type { Node, Edge } from '@xyflow/react';

// Base workflow types
export type NodeType = 'start' | 'step' | 'decision' | 'end';

export interface NodeConfig {
  // Start node has no config
  // Step node config
  key?: string;
  value?: string;
  // Decision node config
  condition?: string;
  // End node has no config
}

export interface NodeData extends Record<string, unknown> {
  label: string;
  config: NodeConfig;
  onConnectStart?: () => void;
  onDelete?: (nodeId: string) => void;
}

export interface WorkflowNode extends Node<NodeData, NodeType> {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: NodeData;
}

export interface WorkflowEdge extends Edge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
  sourceHandle?: string;
}

export interface ValidationResult {
  isValid: boolean;
  issues: string[];
}

export interface WorkflowMetadata {
  name?: string;
  description?: string;
  version?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkflowData {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  metadata?: WorkflowMetadata;
}

// Component prop types
export interface WorkflowPaletteProps {
  onAddNode: (type: NodeType, position: { x: number; y: number }) => void;
}

export interface ValidationBadgeProps {
  validation: ValidationResult;
}

export interface ImportExportControlsProps {
  onExport: () => WorkflowData;
  onImport: (data: WorkflowData) => void;
}

export interface NodeEditorProps {
  node: WorkflowNode;
  onUpdate: (nodeId: string, newData: Partial<NodeData>) => void;
  onClose: () => void;
}

// Node component props
export interface BaseNodeProps {
  id: string;
  data: NodeData;
  selected?: boolean;
}
