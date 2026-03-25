import { Handle, Position } from 'reactflow';

const InputNode = ({ data }) => {
  const stopAll = (e) => e.stopPropagation();

  return (
    <div className="input-node w-80 bg-[#12121a] border border-[#2a2a3d] rounded-2xl shadow-2xl hover:border-[#3d3d5c] transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#2a2a3d]">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-[rgba(124,106,247,0.15)] flex items-center justify-center text-xs text-violet-400">
            ✦
          </div>
          <span className="text-[13px] font-bold text-[#e8e8f0] tracking-wide" style={{ fontFamily: "'Syne', sans-serif" }}>
            Prompt Input
          </span>
        </div>
        <span className="text-[10px] font-medium text-violet-300 border border-[rgba(124,106,247,0.3)] bg-[rgba(124,106,247,0.08)] px-2.5 py-0.5 rounded-full">
          INPUT
        </span>
      </div>

      {/* Body */}
      <div className="px-4 pt-3.5 pb-4">
        <p className="text-[10px] text-[#6b6b8a] uppercase tracking-[1px] mb-2" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
          Your Prompt
        </p>
        <textarea
          className="nodrag nowheel w-full min-h-[100px] bg-[#1c1c2e] border border-[#2a2a3d] rounded-lg text-[#e8e8f0] text-[12.5px] leading-relaxed px-3 py-2.5 resize-none outline-none focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(124,106,247,0.12)] transition-all duration-200 placeholder:text-[#3d3d5c]"
          style={{ fontFamily: "'IBM Plex Mono', monospace", pointerEvents: 'all' }}
          placeholder={"Ask anything…\ne.g. What is the capital of France?"}
          value={data.prompt}
          onChange={(e) => {
            e.stopPropagation();
            data.onPromptChange(e.target.value);
          }}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === 'Enter' && e.ctrlKey) data.onRun?.();
          }}
          onKeyUp={stopAll}
          onKeyPress={stopAll}
          onMouseDown={stopAll}
          onMouseUp={stopAll}
          onPointerDown={stopAll}
          onPointerUp={stopAll}
          onTouchStart={stopAll}
          onTouchEnd={stopAll}
          onClick={stopAll}
          onFocus={stopAll}
          onBlur={stopAll}
          rows={5}
        />
        <p className="text-[10px] text-[#3d3d5c] mt-1.5" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
          Ctrl+Enter to run
        </p>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !border-2 !border-violet-500 !bg-[#12121a] !shadow-[0_0_8px_rgba(124,106,247,0.6)]"
      />
    </div>
  );
};

export default InputNode;