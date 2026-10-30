import React, { useState } from 'react';

export default function K3sTopology({ animationKey = 0 }) {
  const [activeNode, setActiveNode] = useState(null);

  return (
    <div key={animationKey} className="relative w-full overflow-hidden select-none">
      <svg
        viewBox="0 0 940 430"
        className="w-full h-auto max-h-[520px] font-mono text-xs"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Cyber Blueprint Grid Pattern */}
          <pattern id="k3s-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill="#131d2e" opacity="0.6" />
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0e1626" strokeWidth="0.5" opacity="0.3" />
          </pattern>

          {/* Glowing linear gradients */}
          <linearGradient id="cyber-cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="cyber-emerald-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="node-bg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0a0f18" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#05070c" stopOpacity="0.98" />
          </linearGradient>

          {/* Directional Arrowheads */}
          <marker
            id="arrow-emerald"
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
            id="arrow-cyan"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#06b6d4" />
          </marker>
        </defs>

        {/* Blueprint background grid */}
        <rect width="940" height="430" fill="url(#k3s-grid)" />

        {/* Outer HUD Corner Brackets */}
        <g stroke="#1a273b" strokeWidth="1.5" fill="none">
          <path d="M 10 25 L 10 10 L 25 10" />
          <path d="M 930 25 L 930 10 L 915 10" />
          <path d="M 10 405 L 10 420 L 25 420" />
          <path d="M 930 405 L 930 420 L 915 420" />
        </g>

        {/* Architecture Pipeline Boundary Labels */}
        <text x="30" y="24" fill="#64748b" fontSize="9" letterSpacing="0.1em">
          ZONE // 01: EDGE INGRESS & ZERO TRUST
        </text>
        <text x="30" y="145" fill="#64748b" fontSize="9" letterSpacing="0.1em">
          ZONE // 02: K3S CLUSTER ORCHESTRATION & STATEFUL STORAGE
        </text>
        <text x="30" y="295" fill="#64748b" fontSize="9" letterSpacing="0.1em">
          ZONE // 03: OBSERVABILITY BUS & TELEMETRY STREAM
        </text>

        {/* ======================================================== */}
        {/* CONNECTION CIRCUITS (Animated draw-in + Packet Stream)    */}
        {/* ======================================================== */}
        <g>
          {/* Circuit 1: Internet -> Cloudflare */}
          <path
            d="M 190 55 L 260 55"
            stroke="#10b981"
            strokeWidth="1.5"
            markerEnd="url(#arrow-emerald)"
            className="topology-path-draw"
            style={{ animationDelay: '0.2s' }}
          />
          <path
            d="M 190 55 L 260 55"
            stroke="#34d399"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="topology-packet-stream"
          />

          {/* Circuit 2: Cloudflare -> Traefik Ingress */}
          <path
            d="M 480 55 L 560 55"
            stroke="#10b981"
            strokeWidth="1.5"
            markerEnd="url(#arrow-emerald)"
            className="topology-path-draw"
            style={{ animationDelay: '0.4s' }}
          />
          <path
            d="M 480 55 L 560 55"
            stroke="#34d399"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="topology-packet-stream"
          />

          {/* Circuit 3: Traefik Ingress -> Production Services */}
          <path
            d="M 680 82 L 680 115 L 230 115 L 230 165"
            stroke="#06b6d4"
            strokeWidth="1.5"
            fill="none"
            markerEnd="url(#arrow-cyan)"
            className="topology-path-draw"
            style={{ animationDelay: '0.6s' }}
          />
          <path
            d="M 680 82 L 680 115 L 230 115 L 230 165"
            stroke="#38bdf8"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            className="topology-packet-stream"
          />

          {/* Circuit 4: Traefik Ingress -> Monitoring Stack */}
          <path
            d="M 760 82 L 760 165"
            stroke="#06b6d4"
            strokeWidth="1.5"
            markerEnd="url(#arrow-cyan)"
            className="topology-path-draw"
            style={{ animationDelay: '0.7s' }}
          />
          <path
            d="M 760 82 L 760 165"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="topology-packet-stream"
          />

          {/* Circuit 5: Production Services -> Longhorn Storage */}
          <path
            d="M 390 205 L 470 205"
            stroke="#10b981"
            strokeWidth="1.5"
            markerEnd="url(#arrow-emerald)"
            className="topology-path-draw"
            style={{ animationDelay: '0.9s' }}
          />
          <path
            d="M 390 205 L 470 205"
            stroke="#34d399"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="topology-packet-stream"
          />

          {/* Circuit 6: Longhorn Storage <- Monitoring telemetry */}
          <path
            d="M 680 205 L 635 205"
            stroke="#06b6d4"
            strokeWidth="1.5"
            markerEnd="url(#arrow-cyan)"
            className="topology-path-draw"
            style={{ animationDelay: '1.0s' }}
          />

          {/* Circuit 7: Telemetry Bus (Vector + cAdvisor) -> Prometheus & Loki */}
          <path
            d="M 310 355 L 390 355"
            stroke="#10b981"
            strokeWidth="1.5"
            markerEnd="url(#arrow-emerald)"
            className="topology-path-draw"
            style={{ animationDelay: '1.2s' }}
          />
          <path
            d="M 310 355 L 390 355"
            stroke="#34d399"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="topology-packet-stream"
          />

          {/* Circuit 8: Prometheus & Loki -> Grafana Dashboard */}
          <path
            d="M 610 355 L 690 355"
            stroke="#10b981"
            strokeWidth="1.5"
            markerEnd="url(#arrow-emerald)"
            className="topology-path-draw"
            style={{ animationDelay: '1.4s' }}
          />
          <path
            d="M 610 355 L 690 355"
            stroke="#34d399"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="topology-packet-stream"
          />
        </g>

        {/* ======================================================== */}
        {/* HARDWARE & SOFTWARE NODES (Staggered Animation Reveal)   */}
        {/* ======================================================== */}

        {/* NODE 1: Internet Traffic */}
        <g
          className="topology-node-in cursor-pointer transition-transform hover:translate-y-[-1px]"
          style={{ animationDelay: '0.1s' }}
          onMouseEnter={() => setActiveNode('internet')}
          onMouseLeave={() => setActiveNode(null)}
        >
          <rect
            x="40"
            y="32"
            width="150"
            height="46"
            rx="3"
            fill="url(#node-bg)"
            stroke={activeNode === 'internet' ? '#38bdf8' : '#1e293b'}
            strokeWidth="1.5"
          />
          <line x1="40" y1="46" x2="190" y2="46" stroke="#172236" strokeWidth="1" />
          <circle cx="52" cy="39" r="3" fill="#38bdf8" />
          <text x="62" y="42" fill="#94a3b8" fontSize="8.5" fontWeight="bold">
            CLIENT // INGRESS
          </text>
          <text x="52" y="66" fill="#ffffff" fontSize="11" fontWeight="bold">
            Internet Traffic
          </text>
        </g>

        {/* NODE 2: Cloudflare Edge Tunnel */}
        <g
          className="topology-node-in cursor-pointer transition-transform hover:translate-y-[-1px]"
          style={{ animationDelay: '0.25s' }}
          onMouseEnter={() => setActiveNode('cloudflare')}
          onMouseLeave={() => setActiveNode(null)}
        >
          <rect
            x="260"
            y="30"
            width="220"
            height="50"
            rx="3"
            fill="url(#node-bg)"
            stroke={activeNode === 'cloudflare' ? '#10b981' : '#1e293b'}
            strokeWidth="1.5"
          />
          <line x1="260" y1="46" x2="480" y2="46" stroke="#172236" strokeWidth="1" />
          <circle cx="273" cy="38" r="3" fill="#10b981" />
          <text x="283" y="42" fill="#10b981" fontSize="8.5" fontWeight="bold">
            WAN GATEWAY · ZERO TRUST
          </text>
          <text x="273" y="66" fill="#f8fafc" fontSize="11" fontWeight="bold">
            Cloudflare Edge Tunnel
          </text>
          <text x="440" y="42" fill="#64748b" fontSize="8">
            SSL:443
          </text>
        </g>

        {/* NODE 3: Traefik K3s Ingress Controller */}
        <g
          className="topology-node-in cursor-pointer transition-transform hover:translate-y-[-1px]"
          style={{ animationDelay: '0.45s' }}
          onMouseEnter={() => setActiveNode('traefik')}
          onMouseLeave={() => setActiveNode(null)}
        >
          <rect
            x="560"
            y="30"
            width="340"
            height="52"
            rx="3"
            fill="url(#node-bg)"
            stroke={activeNode === 'traefik' ? '#06b6d4' : '#1e293b'}
            strokeWidth="1.5"
          />
          <line x1="560" y1="46" x2="900" y2="46" stroke="#172236" strokeWidth="1" />
          <circle cx="574" cy="38" r="3" fill="#06b6d4" />
          <text x="584" y="42" fill="#06b6d4" fontSize="8.5" fontWeight="bold">
            K3S INGRESS LAYER · REVERSE PROXY
          </text>
          <text x="574" y="67" fill="#ffffff" fontSize="11.5" fontWeight="bold">
            Traefik Ingress Controller
          </text>
          <text x="830" y="42" fill="#10b981" fontSize="8" fontWeight="bold">
            [HA ACTIVE]
          </text>
        </g>

        {/* NODE 4: Production Services Stack */}
        <g
          className="topology-node-in cursor-pointer transition-transform hover:translate-y-[-1px]"
          style={{ animationDelay: '0.7s' }}
          onMouseEnter={() => setActiveNode('prod')}
          onMouseLeave={() => setActiveNode(null)}
        >
          <rect
            x="70"
            y="165"
            width="320"
            height="95"
            rx="3"
            fill="url(#node-bg)"
            stroke={activeNode === 'prod' ? '#10b981' : '#1e293b'}
            strokeWidth="1.5"
          />
          <line x1="70" y1="184" x2="390" y2="184" stroke="#172236" strokeWidth="1" />
          <circle cx="85" cy="175" r="3" fill="#10b981" />
          <text x="96" y="178" fill="#10b981" fontSize="8.5" fontWeight="bold">
            WORKLOAD NAMESPACE // PRODUCTION
          </text>
          <text x="85" y="204" fill="#ffffff" fontSize="11" fontWeight="bold">
            Stateful & Application Services
          </text>
          {/* Sub-items */}
          <text x="85" y="222" fill="#94a3b8" fontSize="9">
            - Nextcloud / Vaultwarden Secure Passwords
          </text>
          <text x="85" y="238" fill="#94a3b8" fontSize="9">
            - Authelia SSO / High-Availability Postgres DB
          </text>
          <text x="85" y="252" fill="#64748b" fontSize="8.5">
            [TLS Cert-Manager Auto-Renewal · Namespace Isolation]
          </text>
        </g>

        {/* NODE 5: Longhorn Distributed Block Storage */}
        <g
          className="topology-node-in cursor-pointer transition-transform hover:translate-y-[-1px]"
          style={{ animationDelay: '0.9s' }}
          onMouseEnter={() => setActiveNode('storage')}
          onMouseLeave={() => setActiveNode(null)}
        >
          <rect
            x="470"
            y="170"
            width="165"
            height="85"
            rx="3"
            fill="url(#node-bg)"
            stroke={activeNode === 'storage' ? '#f59e0b' : '#1e293b'}
            strokeWidth="1.5"
          />
          <line x1="470" y1="188" x2="635" y2="188" stroke="#172236" strokeWidth="1" />
          <circle cx="484" cy="179" r="3" fill="#f59e0b" />
          <text x="494" y="182" fill="#f59e0b" fontSize="8" fontWeight="bold">
            STORAGE ENGINE
          </text>
          <text x="484" y="208" fill="#ffffff" fontSize="10.5" fontWeight="bold">
            Longhorn Block
          </text>
          <text x="484" y="226" fill="#94a3b8" fontSize="8.5">
            - CSI Replicated Disks
          </text>
          <text x="484" y="240" fill="#64748b" fontSize="8.5">
            - Snapshot Snap/Sync
          </text>
        </g>

        {/* NODE 6: Monitoring Stack (Prometheus / Loki) */}
        <g
          className="topology-node-in cursor-pointer transition-transform hover:translate-y-[-1px]"
          style={{ animationDelay: '0.8s' }}
          onMouseEnter={() => setActiveNode('monitoring')}
          onMouseLeave={() => setActiveNode(null)}
        >
          <rect
            x="680"
            y="165"
            width="220"
            height="95"
            rx="3"
            fill="url(#node-bg)"
            stroke={activeNode === 'monitoring' ? '#06b6d4' : '#1e293b'}
            strokeWidth="1.5"
          />
          <line x1="680" y1="184" x2="900" y2="184" stroke="#172236" strokeWidth="1" />
          <circle cx="694" cy="175" r="3" fill="#06b6d4" />
          <text x="704" y="178" fill="#06b6d4" fontSize="8.5" fontWeight="bold">
            OBSERVABILITY NAMESPACE
          </text>
          <text x="694" y="204" fill="#ffffff" fontSize="11" fontWeight="bold">
            Monitoring Stack
          </text>
          <text x="694" y="222" fill="#94a3b8" fontSize="9">
            - Prometheus Metrics Core
          </text>
          <text x="694" y="238" fill="#94a3b8" fontSize="9">
            - Loki Structured Log Store
          </text>
          <text x="694" y="252" fill="#64748b" fontSize="8.5">
            [Telemetry Alertmanager Hook]
          </text>
        </g>

        {/* NODE 7: Metrics & Log Agents (Vector + cAdvisor + NodeExporter) */}
        <g
          className="topology-node-in cursor-pointer transition-transform hover:translate-y-[-1px]"
          style={{ animationDelay: '1.1s' }}
          onMouseEnter={() => setActiveNode('agents')}
          onMouseLeave={() => setActiveNode(null)}
        >
          <rect
            x="50"
            y="320"
            width="260"
            height="78"
            rx="3"
            fill="url(#node-bg)"
            stroke={activeNode === 'agents' ? '#10b981' : '#1e293b'}
            strokeWidth="1.5"
          />
          <line x1="50" y1="338" x2="310" y2="338" stroke="#172236" strokeWidth="1" />
          <circle cx="64" cy="329" r="3" fill="#10b981" />
          <text x="74" y="332" fill="#10b981" fontSize="8.5" fontWeight="bold">
            NODE AGENTS // DAEMONSET
          </text>
          <text x="64" y="356" fill="#ffffff" fontSize="10.5" fontWeight="bold">
            Vector + cAdvisor + Exporters
          </text>
          <text x="64" y="374" fill="#94a3b8" fontSize="8.5">
            - Kernel, CPU/RAM, Container Metrics
          </text>
          <text x="64" y="388" fill="#64748b" fontSize="8">
            [Push Stream / Kernel cgroups v2]
          </text>
        </g>

        {/* NODE 8: Log & Metrics Engine (Prometheus & Loki) */}
        <g
          className="topology-node-in cursor-pointer transition-transform hover:translate-y-[-1px]"
          style={{ animationDelay: '1.3s' }}
          onMouseEnter={() => setActiveNode('engine')}
          onMouseLeave={() => setActiveNode(null)}
        >
          <rect
            x="390"
            y="320"
            width="220"
            height="78"
            rx="3"
            fill="url(#node-bg)"
            stroke={activeNode === 'engine' ? '#06b6d4' : '#1e293b'}
            strokeWidth="1.5"
          />
          <line x1="390" y1="338" x2="610" y2="338" stroke="#172236" strokeWidth="1" />
          <circle cx="404" cy="329" r="3" fill="#06b6d4" />
          <text x="414" y="332" fill="#06b6d4" fontSize="8.5" fontWeight="bold">
            STORAGE & TSDB ENGINE
          </text>
          <text x="404" y="356" fill="#ffffff" fontSize="10.5" fontWeight="bold">
            Prometheus Server + Loki
          </text>
          <text x="404" y="374" fill="#94a3b8" fontSize="8.5">
            - Real-time PromQL TSDB
          </text>
          <text x="404" y="388" fill="#64748b" fontSize="8">
            - High-compression Log Chunks
          </text>
        </g>

        {/* NODE 9: Visualization HUD (Grafana) */}
        <g
          className="topology-node-in cursor-pointer transition-transform hover:translate-y-[-1px]"
          style={{ animationDelay: '1.5s' }}
          onMouseEnter={() => setActiveNode('grafana')}
          onMouseLeave={() => setActiveNode(null)}
        >
          <rect
            x="690"
            y="320"
            width="210"
            height="78"
            rx="3"
            fill="url(#node-bg)"
            stroke={activeNode === 'grafana' ? '#f59e0b' : '#1e293b'}
            strokeWidth="1.5"
          />
          <line x1="690" y1="338" x2="900" y2="338" stroke="#172236" strokeWidth="1" />
          <circle cx="704" cy="329" r="3" fill="#f59e0b" />
          <text x="714" y="332" fill="#f59e0b" fontSize="8.5" fontWeight="bold">
            TELEMETRY DASHBOARD
          </text>
          <text x="704" y="356" fill="#ffffff" fontSize="10.5" fontWeight="bold">
            Grafana Operational HUD
          </text>
          <text x="704" y="374" fill="#94a3b8" fontSize="8.5">
            - Real-time Node Health Graphs
          </text>
          <text x="704" y="388" fill="#10b981" fontSize="8" fontWeight="bold">
            [P99 LATENCY · SRE DRILLDOWN]
          </text>
        </g>
      </svg>
    </div>
  );
}
