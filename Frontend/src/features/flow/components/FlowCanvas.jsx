import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
} from 'reactflow';
import 'reactflow/dist/style.css';
import InputNode from './InputNode';
import ResultNode from './ResultNode';

const nodeTypes = {
  inputNode: InputNode,
  resultNode: ResultNode,
};

const initialEdges = [
  { id: 'e1-2', source: 'input-1', target: 'result-1', animated: true },
];

const FlowCanvas = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const onPromptChange = useCallback((newPrompt) => {
    setPrompt(newPrompt);
  }, []);

  const initialNodes = useMemo(() => [
    {
      id: 'input-1',
      type: 'inputNode',
      position: { x: 50, y: 100 },
      data: { prompt, onPromptChange },
    },
    {
      id: 'result-1',
      type: 'resultNode',
      position: { x: 450, y: 100 },
      data: { result },
    },
  ], [prompt, result, onPromptChange]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const runFlow = async () => {
    if (!prompt) return alert('Please enter a prompt');
    setLoading(true);
    try {
      const response = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (data.result) {
        setResult(data.result);
        // Update nodes state to reflect new result
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === 'result-1') {
              return { ...node, data: { ...node.data, result: data.result } };
            }
            return node;
          })
        );
      }
    } catch (error) {
      console.error('Error running flow:', error);
      alert('Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  const saveFlow = async () => {
    if (!prompt || !result) return alert('Nothing to save');
    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, result }),
      });
      const data = await response.json();
      alert(data.message || 'Saved successfully');
    } catch (error) {
      console.error('Error saving flow:', error);
      alert('Failed to save');
    }
  };

  return (
    <div style={{ width: '100%', height: '80vh', position: 'relative' }}>
      <div className="controls-bar">
        <button onClick={runFlow} disabled={loading}>
          {loading ? 'Running...' : 'Run Flow'}
        </button>
        <button onClick={saveFlow}>Save</button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

const FlowCanvasWrapper = () => (
  <ReactFlowProvider>
    <FlowCanvas />
  </ReactFlowProvider>
);

export default FlowCanvasWrapper;
