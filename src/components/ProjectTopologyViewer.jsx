import React, { useState, useEffect } from 'react';
import DeclarativeTopology from './topologies/DeclarativeTopology';

// Global cache to avoid redundant network requests across tab switches
const TOPOLOGY_CACHE = {};

export default function ProjectTopologyViewer({ projectId, rawAscii }) {
  const [animationKey, setAnimationKey] = useState(0);
  const [viewMode, setViewMode] = useState('vector'); // 'vector' | 'ascii'
  const [topologyData, setTopologyData] = useState(TOPOLOGY_CACHE[projectId] || null);
  const [sourceType, setSourceType] = useState(
    TOPOLOGY_CACHE[projectId] ? TOPOLOGY_CACHE[projectId]._source : 'INITIALIZING'
  );
  const [loading, setLoading] = useState(!TOPOLOGY_CACHE[projectId]);

  useEffect(() => {
    if (TOPOLOGY_CACHE[projectId]) {
      setTopologyData(TOPOLOGY_CACHE[projectId]);
      setSourceType(TOPOLOGY_CACHE[projectId]._source);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    async function loadTopology() {
      // 1. Primary remote source: GitHub raw docs/architecture.json
      try {
        const rawUrl = `https://raw.githubusercontent.com/zer0sh/${projectId}/main/docs/architecture.json`;
        const res = await fetch(rawUrl);
        if (res.ok) {
          const json = await res.json();
          if (json && json.nodes && json.zones) {
            json._source = 'GITHUB_RAW';
            TOPOLOGY_CACHE[projectId] = json;
            if (isMounted) {
              setTopologyData(json);
              setSourceType('GITHUB_RAW');
              setLoading(false);
            }
            return;
          }
        }
      } catch (err) {
        // Fallback to local static file
      }

      // 2. Secondary source: Local bundled /topologies/${projectId}.json
      try {
        const localUrl = `/topologies/${projectId}.json`;
        const res = await fetch(localUrl);
        if (res.ok) {
          const json = await res.json();
          if (json && json.nodes && json.zones) {
            json._source = 'LOCAL_SPECS';
            TOPOLOGY_CACHE[projectId] = json;
            if (isMounted) {
              setTopologyData(json);
              setSourceType('LOCAL_SPECS');
              setLoading(false);
            }
            return;
          }
        }
      } catch (err) {
        // Fallback to ASCII
      }

      // 3. Fallback to ASCII if no JSON is available
      if (isMounted) {
        setTopologyData(null);
        setSourceType('RAW_ASCII');
        setViewMode('ascii');
        setLoading(false);
      }
    }

    loadTopology();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  const handleReplay = () => {
    setAnimationKey((prev) => prev + 1);
  };

  const hasVector = Boolean(topologyData && topologyData.nodes);

  return (
    <div className="bg-[#050608] border border-[#131722] shadow-2xl overflow-hidden flex flex-col">
      {/* Topology Window Titlebar & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#0a0c12] border-b border-[#131722] font-mono text-xs select-none">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
          <span className="text-[#10b981] font-bold uppercase tracking-wider">
            ARCHITECTURE_SCHEMATIC // {projectId}
          </span>
          <span className="text-[#64748b] hidden sm:inline text-[0.7rem]">
            [{sourceType}]
          </span>
        </div>

        <div className="flex items-center gap-2">
          {hasVector && viewMode === 'vector' && (
            <button
              onClick={handleReplay}
              title="Replay sequence animation"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#0c1017] hover:bg-[#131c2a] text-[#38bdf8] border border-[#1e293b] hover:border-[#38bdf8]/40 transition-colors text-[0.7rem] uppercase font-bold tracking-wider cursor-pointer active:scale-95"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>REPLAY_TRACE</span>
            </button>
          )}

          {rawAscii && hasVector && (
            <button
              onClick={() => setViewMode(viewMode === 'vector' ? 'ascii' : 'vector')}
              title="Toggle Raw ASCII or Vector HUD"
              className="px-2.5 py-1 bg-[#0c1017] hover:bg-[#131c2a] text-[#94a3b8] hover:text-white border border-[#1e293b] transition-colors text-[0.7rem] uppercase font-mono cursor-pointer"
            >
              {viewMode === 'vector' ? '[ </> RAW_ASCII ]' : '[ ◧ VECTOR_HUD ]'}
            </button>
          )}
        </div>
      </div>

      {/* Main Viewport Content */}
      <div className="p-2 sm:p-4 overflow-x-auto select-text custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#64748b] font-mono text-xs gap-3">
            <span className="w-6 h-6 border-2 border-[#10b981] border-t-transparent rounded-full animate-spin" />
            <span className="tracking-widest uppercase">
              QUERYING_ARCHITECTURE_MANIFEST // {projectId}
            </span>
          </div>
        ) : viewMode === 'vector' && hasVector ? (
          <div className="min-w-[740px] lg:min-w-0">
            <DeclarativeTopology data={topologyData} animationKey={animationKey} />
          </div>
        ) : (
          <pre className="font-mono text-[0.64rem] sm:text-[0.75rem] text-[#10b981] leading-relaxed whitespace-pre m-0 p-3 bg-[#030406]">
            {rawAscii}
          </pre>
        )}
      </div>

      {/* Legend & Telemetry Status Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-[#080a0f] border-t border-[#131722] font-mono text-[0.68rem] text-[#64748b] select-none">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-[#10b981] inline-block" />
            <span>PRIMARY DATA BUS</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-[#06b6d4] inline-block" />
            <span>INGRESS & OBSERVABILITY</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse inline-block" />
            <span>LIVE TELEMETRY PULSE</span>
          </span>
        </div>
        <div className="text-[#475569]">
          <span>STATUS: ALL_SYSTEMS_NOMINAL</span>
        </div>
      </div>
    </div>
  );
}
