import React, { useState, useMemo } from 'react';

const ZONE_Y_COORDS = [35, 175, 320];

export default function DeclarativeTopology({ data, animationKey = 0 }) {
  const [activeNode, setActiveNode] = useState(null);

  // Compute Layout Positions for all nodes
  const layout = useMemo(() => {
    if (!data || !data.nodes || !data.zones) return null;

    const positions = {};
    const totalWidth = 940;
    const paddingX = 40;
    const availableWidth = totalWidth - paddingX * 2; // 860

    data.zones.forEach((zone, zoneIdx) => {
      const zoneNodes = data.nodes.filter((n) => n.zone === zone.id);
      const count = zoneNodes.length;
      if (count === 0) return;

      const zoneY = ZONE_Y_COORDS[zoneIdx] !== undefined ? ZONE_Y_COORDS[zoneIdx] : 35 + zoneIdx * 140;

      // Calculate width per node
      const maxCol = Math.max(...zoneNodes.map((n) => n.col !== undefined ? n.col : 0), count - 1);
      const colSlots = Math.max(count, maxCol + 1);

      const spacing = 18;
      const nodeWidth = Math.min(270, Math.floor((availableWidth - (colSlots - 1) * spacing) / colSlots));
      const step = colSlots > 1 ? (availableWidth - nodeWidth) / (colSlots - 1) : 0;

      zoneNodes.forEach((node, nodeIdx) => {
        const col = node.col !== undefined ? node.col : nodeIdx;
        const x = paddingX + (colSlots > 1 ? col * step : (availableWidth - nodeWidth) / 2);
        const y = zoneY;
        const detailsCount = node.details ? node.details.length : 0;
        const height = detailsCount > 1 ? 82 : 62;

        positions[node.id] = {
          x,
          y,
          width: nodeWidth,
          height,
          zoneIdx,
          col,
          top: { x: x + nodeWidth / 2, y },
          bottom: { x: x + nodeWidth / 2, y: y + height },
          left: { x, y: y + height / 2 },
          right: { x: x + nodeWidth, y: y + height / 2 },
        };
      });
    });

    return positions;
  }, [data]);

  if (!data || !layout) return null;

  return (
    <div key={animationKey} className="relative w-full overflow-hidden select-none">
      <svg
        viewBox="0 0 940 435"
        className="w-full h-auto max-h-[520px] font-mono text-xs"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Blueprint Background Grid Pattern */}
          <pattern id={`topo-grid-${data.project}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill="#131d2e" opacity="0.6" />
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0e1626" strokeWidth="0.5" opacity="0.3" />
          </pattern>

          {/* Glowing Gradients */}
          <linearGradient id="cyber-node-bg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0a0f18" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#05070c" stopOpacity="0.98" />
          </linearGradient>

          {/* Directional Arrow Markers */}
          <marker
            id="arr-emerald"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#10b981" />
          </marker>

          <marker
            id="arr-cyan"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#06b6d4" />
          </marker>

          <marker
            id="arr-amber"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Blueprint Grid Canvas */}
        <rect width="940" height="435" fill={`url(#topo-grid-${data.project})`} />

        {/* Corner Brackets */}
        <g stroke="#1a273b" strokeWidth="1.5" fill="none">
          <path d="M 10 25 L 10 10 L 25 10" />
          <path d="M 930 25 L 930 10 L 915 10" />
          <path d="M 10 410 L 10 425 L 25 425" />
          <path d="M 930 410 L 930 425 L 915 425" />
        </g>

        {/* Zone Demarcation Labels */}
        {data.zones.map((zone, idx) => {
          const yCoord = ZONE_Y_COORDS[idx] !== undefined ? ZONE_Y_COORDS[idx] - 12 : 23 + idx * 140;
          return (
            <text
              key={zone.id}
              x="30"
              y={yCoord}
              fill="#64748b"
              fontSize="8.5"
              letterSpacing="0.12em"
              fontWeight="bold"
            >
              {zone.label}
            </text>
          );
        })}

        {/* ======================================================== */}
        {/* FLOW CONNECTIONS (Animated Vector Paths & Telemetry)    */}
        {/* ======================================================== */}
        <g>
          {(data.flows || []).map((flow, flowIdx) => {
            const src = layout[flow.from];
            const tgt = layout[flow.to];
            if (!src || !tgt) return null;

            const isRelated = activeNode === flow.from || activeNode === flow.to;
            const isIngress = flow.busType === 'ingress';
            const isAmber = flow.busType === 'telemetry';

            let strokeColor = '#10b981';
            let packetColor = '#34d399';
            let markerId = 'arr-emerald';

            if (isIngress) {
              strokeColor = '#06b6d4';
              packetColor = '#38bdf8';
              markerId = 'arr-cyan';
            } else if (isAmber) {
              strokeColor = '#f59e0b';
              packetColor = '#fbbf24';
              markerId = 'arr-amber';
            }

            if (isRelated) {
              strokeColor = '#38bdf8';
              packetColor = '#ffffff';
              markerId = 'arr-cyan';
            }

            // Route Path Calculation
            let pathD = '';
            if (src.y === tgt.y) {
              // Same tier horizontal flow
              if (tgt.x > src.x) {
                pathD = `M ${src.right.x} ${src.right.y} L ${tgt.left.x} ${tgt.left.y}`;
              } else {
                pathD = `M ${src.left.x} ${src.left.y} L ${tgt.right.x} ${tgt.right.y}`;
              }
            } else if (tgt.y > src.y) {
              // Downward flow
              const midY = (src.bottom.y + tgt.top.y) / 2;
              pathD = `M ${src.bottom.x} ${src.bottom.y} L ${src.bottom.x} ${midY} L ${tgt.top.x} ${midY} L ${tgt.top.x} ${tgt.top.y}`;
            } else {
              // Upward flow
              const midY = (src.top.y + tgt.bottom.y) / 2;
              pathD = `M ${src.top.x} ${src.top.y} L ${src.top.x} ${midY} L ${tgt.bottom.x} ${midY} L ${tgt.bottom.x} ${tgt.bottom.y}`;
            }

            const delay = `${0.25 + flowIdx * 0.12}s`;

            return (
              <g key={`${flow.from}->${flow.to}-${flowIdx}`}>
                {/* Circuit Base Draw Line */}
                <path
                  d={pathD}
                  stroke={strokeColor}
                  strokeWidth={isRelated ? '2' : '1.5'}
                  fill="none"
                  markerEnd={`url(#${markerId})`}
                  className="topology-path-draw"
                  style={{ animationDelay: delay }}
                />

                {/* Packet Stream Animation */}
                <path
                  d={pathD}
                  stroke={packetColor}
                  strokeWidth={isRelated ? '3' : '2'}
                  fill="none"
                  strokeLinecap="round"
                  className="topology-packet-stream"
                />
              </g>
            );
          })}
        </g>

        {/* ======================================================== */}
        {/* NODES (Staggered Animation Reveal + Cyber HUD Box)       */}
        {/* ======================================================== */}
        <g>
          {data.nodes.map((node) => {
            const pos = layout[node.id];
            if (!pos) return null;

            const isHovered = activeNode === node.id;
            const isConnected =
              activeNode &&
              (data.flows || []).some(
                (f) =>
                  (f.from === activeNode && f.to === node.id) ||
                  (f.to === activeNode && f.from === node.id)
              );

            let borderColor = '#1e293b';
            let dotColor = '#10b981';
            let badgeColor = '#10b981';

            if (node.color === 'cyan') {
              dotColor = '#06b6d4';
              badgeColor = '#06b6d4';
            } else if (node.color === 'amber') {
              dotColor = '#f59e0b';
              badgeColor = '#f59e0b';
            }

            if (isHovered) {
              borderColor = '#38bdf8';
            } else if (isConnected) {
              borderColor = '#10b981';
            }

            const delay = `${0.1 + pos.zoneIdx * 0.35 + (pos.col || 0) * 0.08}s`;

            return (
              <g
                key={node.id}
                className="topology-node-in cursor-pointer transition-transform hover:translate-y-[-1px]"
                style={{ animationDelay: delay }}
                onMouseEnter={() => setActiveNode(node.id)}
                onMouseLeave={() => setActiveNode(null)}
              >
                {/* Node Outer Container */}
                <rect
                  x={pos.x}
                  y={pos.y}
                  width={pos.width}
                  height={pos.height}
                  rx="3"
                  fill="url(#cyber-node-bg)"
                  stroke={borderColor}
                  strokeWidth={isHovered ? '2' : '1.5'}
                />

                {/* Node Header Separator */}
                <line
                  x1={pos.x}
                  y1={pos.y + 18}
                  x2={pos.x + pos.width}
                  y2={pos.y + 18}
                  stroke="#172236"
                  strokeWidth="1"
                />

                {/* Status Dot */}
                <circle cx={pos.x + 10} cy={pos.y + 9} r="3" fill={dotColor} />

                {/* Header Badge */}
                <text
                  x={pos.x + 18}
                  y={pos.y + 12.5}
                  fill={badgeColor}
                  fontSize="7.8"
                  fontWeight="bold"
                  letterSpacing="0.05em"
                >
                  {node.badge || 'NODE // COMPONENT'}
                </text>

                {/* Right Status Tag */}
                {node.status && (
                  <text
                    x={pos.x + pos.width - 8}
                    y={pos.y + 12.5}
                    textAnchor="end"
                    fill="#64748b"
                    fontSize="7"
                    fontWeight="bold"
                  >
                    [{node.status}]
                  </text>
                )}

                {/* Main Node Label */}
                <text
                  x={pos.x + 10}
                  y={pos.y + 35}
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                  letterSpacing="0.02em"
                >
                  {node.label}
                </text>

                {/* Details Sub-Items */}
                {node.details &&
                  node.details.map((item, itemIdx) => (
                    <text
                      key={itemIdx}
                      x={pos.x + 10}
                      y={pos.y + 51 + itemIdx * 14}
                      fill={item.startsWith('[') ? '#64748b' : '#94a3b8'}
                      fontSize="8"
                      letterSpacing="0.01em"
                    >
                      {item.startsWith('-') || item.startsWith('[') ? item : `- ${item}`}
                    </text>
                  ))}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
