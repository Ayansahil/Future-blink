import { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

import InputNode from '../components/InputNode';
import ResultNode from '../components/ResultNode';

const nodeTypes = {
  inputNode: InputNode,
  resultNode: ResultNode,
};

const FlowPage = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('ready');
  const [toast, setToast] = useState(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: 'input-1',
      type: 'inputNode',
      position: { x: 80, y: 160 },
      data: { prompt: '', onPromptChange: () => {}, onRun: () => {} },
    },
    {
      id: 'result-1',
      type: 'resultNode',
      position: { x: 560, y: 160 },
      data: { response: '', isLoading: false },
    },
  ]);

  const [edges, setEdges, onEdgesChange] = useEdgesState([
    {
      id: 'e1-2',
      source: 'input-1',
      target: 'result-1',
      type: 'default',
      animated: false,
      style: { stroke: 'url(#edgeGrad)', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#34d399' },
    },
  ]);


  // Sync prompt into node data whenever prompt state changes
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === 'input-1'
          ? { ...n, data: { ...n.data, prompt } }
          : n
      )
    );
  }, [prompt]); 

  // Sync response into node data whenever response state changes
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === 'result-1'
          ? { ...n, data: { ...n.data, response } }
          : n
      )
    );
  }, [response]); 

  // Attach handlers to input node on mount only
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === 'input-1'
          ? {
              ...n,
              data: {
                ...n.data,
                onPromptChange: (val) => setPrompt(val),
                onRun: () => runFlow(),
              },
            }
          : n
      )
    );
  }, []); 

  const runFlow = useCallback(async () => {
    const currentPrompt = prompt;
    if (!currentPrompt.trim()) {
      showToast('Enter a prompt first.', 'error');
      return;
    }

    setIsLoading(true);
    setStatus('processing');
    setResponse('');

    setNodes((nds) =>
      nds.map((n) =>
        n.id === 'result-1' ? { ...n, data: { ...n.data, response: '', isLoading: true } } : n
      )
    );
    setEdges((eds) =>
      eds.map((e) => (e.id === 'e1-2' ? { ...e, animated: true } : e))
    );

    try {
      const res = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentPrompt }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Server error ${res.status}: ${errText}`);
      }

      const data = await res.json();
      const answer = data.answer || data.response || '';

      setResponse(answer);
      setStatus('ready');

      setNodes((nds) =>
        nds.map((n) =>
          n.id === 'result-1'
            ? { ...n, data: { ...n.data, response: answer, isLoading: false } }
            : n
        )
      );
    } catch (err) {
      showToast(err.message || 'Request failed', 'error');
      setStatus('error');
      setNodes((nds) =>
        nds.map((n) =>
          n.id === 'result-1'
            ? { ...n, data: { ...n.data, response: '', isLoading: false } }
            : n
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [prompt]); // eslint-disable-line

  // Keep onRun fresh so it always has latest prompt
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === 'input-1'
          ? { ...n, data: { ...n.data, onRun: runFlow } }
          : n
      )
    );
  }, [runFlow]); 

  const handleSave = async () => {
    if (!prompt || !response) return;
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, response }),
      });
      if (!res.ok) throw new Error('Save failed');
      showToast('✓ Saved to MongoDB', 'success');
    } catch {
      showToast('Save failed. Check backend.', 'error');
    }
  };

  const handleClear = () => {
    setPrompt('');
    setResponse('');
    setStatus('ready');
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === 'input-1') return { ...n, data: { ...n.data, prompt: '' } };
        if (n.id === 'result-1') return { ...n, data: { ...n.data, response: '', isLoading: false } };
        return n;
      })
    );
    setEdges((eds) => eds.map((e) => ({ ...e, animated: false })));
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0f] overflow-hidden">

      {/* ── HEADER ── */}
      <header className="flex items-center justify-between px-7 h-14 border-b border-[#2a2a3d] bg-[#12121a] z-10 flex-shrink-0">
        <div className="flex items-center gap-2.5" style={{ fontFamily: "'Syne', sans-serif" }}>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-violet-300 flex items-center justify-center text-sm">
            ⚡
          </div>
          <span className="font-black text-[17px] text-[#e8e8f0] tracking-tight">
            AI<span className="text-violet-300">Flow</span>
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center gap-1.5 text-[11px] text-[#6b6b8a] px-2.5 py-1 border border-[#2a2a3d] rounded-full"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                status === 'processing' ? 'bg-violet-400 animate-pulse' :
                status === 'error' ? 'bg-red-400' : 'bg-emerald-400'
              }`}
              style={{ boxShadow: status === 'ready' ? '0 0 6px #34d399' : undefined }}
            />
            {status}
          </div>
        </div>
      </header>

      {/* ── CANVAS ── */}
      <div className="flex-1 relative">

        {/* Gradient def for edge */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c6af7" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
        </svg>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
        >
          <Background
            variant={BackgroundVariant.Lines}
            gap={40}
            size={1}
            color="#1a1a2e"
          />
          <Controls className="!bg-[#12121a] !border-[#2a2a3d] !rounded-xl" />
          <MiniMap
            nodeColor={(n) => (n.type === 'inputNode' ? '#7c6af7' : '#34d399')}
            maskColor="rgba(10,10,15,0.85)"
            className="!bg-[#12121a] !border !border-[#2a2a3d] !rounded-xl"
          />
        </ReactFlow>

        {/* ── TOOLBAR ── */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-[#12121a] border border-[#2a2a3d] rounded-full px-3 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-10">
          <button
            onClick={runFlow}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[12px] font-medium rounded-full transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(124,106,247,0.4)] active:translate-y-0"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {isLoading ? (
              <>
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Running…
              </>
            ) : (
              <><span>▶</span> Run Flow</>
            )}
          </button>

          <div className="w-px h-7 bg-[#2a2a3d]" />

          <button
            onClick={handleSave}
            disabled={!response}
            className="flex items-center gap-2 px-5 py-2.5 bg-transparent text-emerald-400 border border-[rgba(52,211,153,0.3)] hover:bg-[rgba(52,211,153,0.08)] hover:border-emerald-400 disabled:opacity-35 disabled:cursor-not-allowed text-[12px] font-medium rounded-full transition-all duration-150 hover:-translate-y-0.5"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            <span>⬡</span> Save
          </button>

          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-5 py-2.5 bg-transparent text-[#6b6b8a] border border-[#2a2a3d] hover:bg-[rgba(248,113,113,0.08)] hover:border-red-400 hover:text-red-400 text-[12px] font-medium rounded-full transition-all duration-150 hover:-translate-y-0.5"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            <span>✕</span> Clear
          </button>
        </div>

        {/* Model tag */}
        <div
          className="absolute bottom-[88px] left-1/2 -translate-x-1/2 text-[10px] text-[#3d3d5c] flex items-center gap-1.5"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          <span className="text-violet-700">⬡</span>
          mistral-7b-instruct · openrouter
        </div>

        {/* Toast */}
        {toast && (
          <div
            className={`absolute top-4 right-4 flex items-center gap-2 px-4 py-2.5 rounded-lg text-[12px] font-medium border z-50
              ${toast.type === 'success'
                ? 'bg-[rgba(52,211,153,0.12)] border-[rgba(52,211,153,0.3)] text-emerald-400'
                : 'bg-[rgba(248,113,113,0.1)] border-[rgba(248,113,113,0.3)] text-red-400'
              }`}
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {toast.msg}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlowPage;