import { useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';

const ResultNode = ({ data }) => {
  const textRef = useRef('');
  const elRef = useRef(null);
  const intervalRef = useRef(null);

  // Typewriter effect when response changes
  useEffect(() => {
    if (!data.response || !elRef.current) return;
    if (data.response === textRef.current) return;

    clearInterval(intervalRef.current);
    textRef.current = '';
    elRef.current.innerHTML = '';

    const text = data.response;
    let i = 0;

    // Create cursor
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    elRef.current.appendChild(cursor);

    intervalRef.current = setInterval(() => {
      if (i < text.length) {
        elRef.current.insertBefore(document.createTextNode(text[i]), cursor);
        i++;
        textRef.current += text[i - 1];
      } else {
        cursor.remove();
        clearInterval(intervalRef.current);
      }
    }, 12);

    return () => clearInterval(intervalRef.current);
  }, [data.response]);

  const hasContent = Boolean(data.response);
  const isLoading = data.isLoading;

  return (
    <div className="result-node w-80 bg-[#0f1a1a] border border-[#2a2a3d] rounded-2xl shadow-2xl hover:border-[#3d3d5c] hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-200">
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !border-2 !border-emerald-400 !bg-[#0f1a1a] !shadow-[0_0_8px_rgba(52,211,153,0.6)]"
      />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#2a2a3d]">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-[rgba(52,211,153,0.12)] flex items-center justify-center text-xs text-emerald-400">
            ◈
          </div>
          <span
            className="text-[13px] font-bold text-[#e8e8f0] tracking-wide"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            AI Response
          </span>
        </div>
        <span className="text-[10px] font-medium text-emerald-300 border border-[rgba(52,211,153,0.3)] bg-[rgba(52,211,153,0.08)] px-2.5 py-0.5 rounded-full">
          OUTPUT
        </span>
      </div>

      {/* Body */}
      <div className="px-4 pt-3.5 pb-4">
        <p
          className="text-[10px] text-[#6b6b8a] uppercase tracking-[1px] mb-2"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          Result
        </p>

        <div
          className={`
            min-h-[100px] rounded-lg px-3 py-2.5 text-[12.5px] leading-relaxed relative overflow-hidden
            transition-all duration-300
            ${isLoading
              ? 'bg-[#111a1a] border border-[#2a2a3d] animate-shimmer'
              : hasContent
                ? 'bg-[#111a1a] border border-[rgba(52,211,153,0.25)] shadow-[inset_0_0_0_1px_rgba(52,211,153,0.08)]'
                : 'bg-[#111a1a] border border-[#2a2a3d]'
            }
          `}
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          {isLoading ? (
            <div className="flex items-center gap-2 text-[#3d3d5c]">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-violet-500 opacity-60 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <span>Generating response…</span>
            </div>
          ) : hasContent ? (
            <p
              ref={elRef}
              className="text-[#e8e8f0] whitespace-pre-wrap"
            />
          ) : (
            <span className="text-[#3d3d5c]">Awaiting prompt…</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultNode;