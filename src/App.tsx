import { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import type { WorkflowNode, WorkflowEdge, WorkflowData, NodeType } from './types/workflow';
import { 
  createNode, 
  createEdge, 
  validateWorkflow, 
  exportWorkflow, 
  importWorkflow 
} from './utils/workflowUtils';

import { WorkflowPalette } from './components/WorkflowPalette';
import { StartNode } from './components/nodes/StartNode';
import { StepNode } from './components/nodes/StepNode';
import { DecisionNode } from './components/nodes/DecisionNode';
import { EndNode } from './components/nodes/EndNode';
import { ValidationBadge } from './components/ValidationBadge';
import { ImportExportControls } from './components/ImportExportControls';
import { NodeEditor } from './components/NodeEditor';
import { ThemeToggle } from './components/ThemeToggle';
import './App.css';

const nodeTypes = {
  start: StartNode,
  step: StepNode,
  decision: DecisionNode,
  end: EndNode,
};

const initialNodes: WorkflowNode[] = [];
const initialEdges: WorkflowEdge[] = [];

function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const onConnect = useCallback(
    (params: { source: string; target: string; sourceHandle?: string | null }) => {
      const sourceNode = nodes.find(n => n.id === params.source);
      const targetNode = nodes.find(n => n.id === params.target);
      
      if (!sourceNode || !targetNode) return;

      // Check if decision node already has 2 edges
      if (sourceNode.type === 'decision') {
        const existingEdges = edges.filter(e => e.source === params.source);
        if (existingEdges.length >= 2) return;
      }

      let edgeLabel = '';
      if (sourceNode.type === 'decision' && params.sourceHandle) {
        // Use the sourceHandle ID to determine the label
        edgeLabel = params.sourceHandle === 'yes' ? 'yes' : 'no';
      }

      const newEdge = createEdge(params.source, params.target, edgeLabel, params.sourceHandle || undefined);
      setEdges((eds) => addEdge(newEdge, eds));
      setIsConnecting(false);
      setConnectingFrom(null);
    },
    [nodes, edges, setEdges]
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: WorkflowNode) => {
    if (isConnecting && connectingFrom && connectingFrom !== node.id) {
      // Complete connection
      onConnect({ source: connectingFrom, target: node.id });
    } else if (isConnecting && connectingFrom === node.id) {
      // Cancel connection
      setIsConnecting(false);
      setConnectingFrom(null);
    } else {
      // Select node for editing
      setSelectedNode(node);
    }
  }, [isConnecting, connectingFrom, onConnect]);

  const onConnectStart = useCallback((nodeId: string) => {
    setIsConnecting(true);
    setConnectingFrom(nodeId);
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(null);
    }
  }, [setNodes, setEdges, selectedNode]);

  const addNode = useCallback((type: NodeType, position: { x: number; y: number }) => {
    const newNode = createNode(type, position, onConnectStart, deleteNode);
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes, onConnectStart, deleteNode]);

  const deleteSelected = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);

  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      )
    );
  }, [setNodes]);

  const validation = useMemo(() => {
    return validateWorkflow(nodes, edges);
  }, [nodes, edges]);

  const handleExport = useCallback((): WorkflowData => {
    return exportWorkflow(nodes, edges, {
      name: 'Untitled Workflow',
      description: 'Created with Workflow Builder',
    });
  }, [nodes, edges]);

  const handleImport = useCallback((workflowData: WorkflowData) => {
    const { nodes: importedNodes, edges: importedEdges } = importWorkflow(
      workflowData,
      onConnectStart,
      deleteNode
    );
    
    setNodes(importedNodes);
    setEdges(importedEdges);
    setSelectedNode(null);
    setIsConnecting(false);
    setConnectingFrom(null);
  }, [setNodes, setEdges, onConnectStart, deleteNode]);

  return (
    <div className="workflow-builder">
      <header className="workflow-header">
        <div>
          <h1 className="workflow-title">Workflow Builder</h1>
          <p className="workflow-subtitle">Design and create custom workflows</p>
        </div>
        <div className="header-controls">
          <ImportExportControls
            onExport={handleExport}
            onImport={handleImport}
          />
          <ThemeToggle />
        </div>
      </header>
      
      <div className="workflow-content">
        <aside className={`workflow-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-section">
            <WorkflowPalette onAddNode={addNode} />
          </div>
          
          <div className="sidebar-section">
            <h3 className="section-title">Validation</h3>
            <ValidationBadge validation={validation} />
          </div>
        </aside>
        
        <button 
          className={`sidebar-toggle ${sidebarOpen ? 'sidebar-open' : ''}`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>
        
        <main className="canvas-container">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView={true}
            zoomOnScroll={false}
            zoomOnPinch={false}
            zoomOnDoubleClick={false}
            panOnDrag={true}
            panOnScroll={false}
            preventScrolling={false}
            nodesDraggable={true}
            nodesConnectable={true}
            elementsSelectable={true}
            selectNodesOnDrag={false}
            className={isConnecting ? 'connecting' : ''}
          >
            <Background />
          </ReactFlow>
        </main>
      </div>

      {selectedNode && (
        <NodeEditor
          node={selectedNode}
          onUpdate={updateNodeData}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ReactFlowProvider>
      <WorkflowBuilder />
    </ReactFlowProvider>
  );
}

export default App;
