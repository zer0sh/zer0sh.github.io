import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ProjectReadmeModal } from './ProjectReadmeModal';
import ProjectTopologyViewer from './ProjectTopologyViewer';

const TOPOLOGIES = {
  'k3s-lab': `+--------------------------------------------------------------------------+
| GITOPS REPOSITORY ---> ARGO CD CONTROLLER ---> CLUSTER RECONCILIATION    |
+--------------------------------------------------------------------------+
       |
       v
+-- K3S HIGH-AVAILABILITY CLUSTER -----------------------------------------+
| [Traefik Ingress Controller] ---> [Production Workload Pods]             |
|                                         |                                |
|                                         v                                |
| [Prometheus Server] <--- [cAdvisor / Node Exporter Metrics Stream]       |
|        |                                                                 |
|        v                                                                 |
| [Grafana Dashboard] <--- [Loki Log Engine] <--- [Vector DaemonSet]       |
+--------------------------------------------------------------------------+`,

  'sunim-tui': `+-- ASYNCHRONOUS POSIX EVENT-DRIVEN PIPELINE ------------------------------+
| [POSIX Terminal Raw Mode] ---> [Crossterm Asynchronous Stream]           |
|                                       |                                  |
|                                       v                                  |
|                            [Tokio Multi-Thread Runtime]                  |
|                                       |                                  |
|                 +---------------------+---------------------+            |
|                 v                                           v            |
|        [Input State Mutex]                         [Render Frame Buffer] |
|                 |                                           |            |
|                 +--------------------> [Diff Engine] <------+            |
|                                              |                           |
|                                              v                           |
|                                     [ANSI Escape Flush]                  |
+--------------------------------------------------------------------------+`,

  'zer0sh-site-health-monitor': `+-- WORDPRESS.ORG RUNTIME HEALTH & VULNERABILITY AUDITOR -------------------+
| [Admin Trigger / WP-Cron Scheduler] ---> [Diagnostic Engine (Read-Only)]  |
|                                                     |                    |
|        +-------------------+------------------------+-----------------+  |
|        v                   v                        v                 v  |
| [PHP & Server Checks] [Core & Plugins]       [HTTP Security]  [Reliability]|
|  - EOL & memory_limit  - Pending updates      - HSTS, CSP, XFO - WP-Cron  |
|  - Required modules    - WPVulnerability API  - XML-RPC, SSL   - Loopback |
|        |                   |                        |                 |  |
|        +-------------------+------------------------+-----------------+  |
|                                    |                                     |
|                                    v                                     |
|              [WP Transient Cache (12h TTL) · Zero Telemetry]              |
+--------------------------------------------------------------------------+`,

  'cms-local-envs': `+-- ISOLATED REPRODUCIBLE CONTAINER WORKFLOW -----------------------------+
| [Local Dev Push] ---> [GitHub Actions CI Runner] ---> [Trivy Security]  |
|                                                              |           |
|                                                              v           |
|                                                    [Multi-Platform Build]|
|                                                              |           |
|       +------------------------------------------------------+           |
|       v                                                                  |
| [Docker Compose Upstream Environment]                                    |
|   ├── [NGINX Gateway]     ---> TLS Offload & FastCGI Socket Bridge       |
|   ├── [PHP-FPM Worker]    ---> Sandboxed Non-Root Execution              |
|   ├── [MariaDB Database]  ---> Ephemeral Database Sanitization Fixture   |
|   └── [Rollback Hook]     ---> Healthcheck Fail-Safe Auto Recovery       |
+--------------------------------------------------------------------------+`,

  'gh-runner-selfhosted-docker': `+-- EPHEMERAL DOCKER-IN-DOCKER EXECUTION RUNBOOK --------------------------+
| [GitHub Repository Job Trigger] ---> [Bastion Host Control Loop]         |
|                                                   |                      |
|                                                   v                      |
|                                    [Spawn Ephemeral Container]           |
|                                                   |                      |
|                   +-------------------------------+------------------+   |
|                   v                                                  v   |
|         [DinD Socket Isolation]                            [Job Sandbox] |
|                   |                                                  |   |
|                   +--------------------> [Execute Job] <-------------+   |
|                                                |                         |
|                                                v                         |
|                                    [Auto-Deregister & Prune]             |
+--------------------------------------------------------------------------+`,

  'dotfiles': `+-- DECLARATIVE WAYLAND / HYPRLAND WORKSTATION ----------------------------+
| [Hardware Inputs] ---> [Hyprland Wayland Window Compositor]              |
|                                  |                                       |
|         +------------------------+------------------------+              |
|         v                        v                        v              |
|   [Waybar HUD]            [Alacritty POSIX]        [Mako Notifications]  |
|   - CPU / MEM Telemetry   - Tmux Multi-Pane        - Incident Alerts     |
|   - PipeWire Audio State  - Neovim Lua IDE         - Priority Filter     |
|         |                        |                        |              |
|         +------------------------+------------------------+              |
|                                  v                                       |
|                [Declarative Dotbot Symlink Automation]                   |
+--------------------------------------------------------------------------+`,
};

const PROJECT_METADATA = {
  'k3s-lab': {
    image: '/images/projects/k3s-lab.png',
    badge: 'K3S // ARGO_CD // PROMETHEUS',
    tagline: 'HIGH-AVAILABILITY CLOUD-NATIVE STACK',
    branch: 'git:(main)',
    runtime: 'Kubernetes v1.28 / Linux 6.x',
    telemetry: 'Prometheus + Loki + Vector',
  },
  'sunim-tui': {
    image: '/images/projects/sunim-tui.png',
    badge: 'RUST // TERMINUS // TOKIO',
    tagline: 'ASYNC POSIX OPERATOR TUI',
    branch: 'git:(v1.0.0)',
    runtime: 'Rust 2021 / Tokio Async POSIX',
    telemetry: 'Zero Alloc Diff Engine / Crossterm',
  },
  'zer0sh-site-health-monitor': {
    image: '/images/projects/zer0sh-site-health-monitor.png',
    badge: 'PHP // WORDPRESS.ORG // CVE-SCAN',
    tagline: 'RUNTIME HEALTH & VULNERABILITY AUDITOR',
    branch: 'git:(main)',
    runtime: 'PHP 7.4-8.3 / WP 6.0+',
    telemetry: 'Transient Cache (12h TTL) · Zero Outbound Telemetry',
  },
  'cms-local-envs': {
    image: '/images/projects/cms-local-envs.png',
    badge: 'DOCKER // COMPOSE // TRIVY',
    tagline: 'REPRODUCIBLE MULTI-CONTAINER PIPELINE',
    branch: 'git:(main)',
    runtime: 'Docker Engine 24+ / Compose v2',
    telemetry: 'GitHub Actions Buildx Cache & Trivy Scan',
  },
  'gh-runner-selfhosted-docker': {
    image: '/images/projects/gh-runner-selfhosted-docker.png',
    badge: 'ACTIONS // DIND // SANDBOX',
    tagline: 'EPHEMERAL ISOLATED CI/CD INFRASTRUCTURE',
    branch: 'git:(main)',
    runtime: 'Docker-in-Docker / Systemd cgroups v2',
    telemetry: 'Auto-prune Ephemeral Runner Daemon',
  },
  'dotfiles': {
    image: '/images/projects/dotfiles.png',
    badge: 'HYPRLAND // WAYLAND // POSIX',
    tagline: 'DECLARATIVE MODAL WORKSTATION',
    branch: 'git:(main)',
    runtime: 'Debian Trixie / Hyprland Wayland Compositor',
    telemetry: 'Waybar Custom Telemetry & Dotbot Automation',
  },
};

const BATCHES = [
  {
    id: 'batch-core',
    lotNumber: '01',
    badge: 'CORE_SYSTEMS',
    label: 'Core Infrastructure & Tools',
    keys: ['project1', 'project3', 'project2'],
  },
  {
    id: 'batch-infra',
    lotNumber: '02',
    badge: 'PLATFORM_&_ENVIRONMENT',
    label: 'Platform & Environment Automation',
    keys: ['project5', 'project4', 'project6'],
  },
];

export const Projects = () => {
  const { t } = useLanguage();
  const [activeBatchIndex, setActiveBatchIndex] = useState(0);
  const [activeTabs, setActiveTabs] = useState({});
  const [activeModalRepo, setActiveModalRepo] = useState(null);
  const [activeModalTitle, setActiveModalTitle] = useState('');

  const currentBatch = BATCHES[activeBatchIndex];
  const visibleKeys = currentBatch.keys;

  const setTab = (projectName, tabKey) => {
    setActiveTabs((prev) => ({
      ...prev,
      [projectName]: tabKey,
    }));
  };

  const openReadmeModal = (repoName, title) => {
    setActiveModalRepo(repoName);
    setActiveModalTitle(title);
  };

  const closeReadmeModal = () => {
    setActiveModalRepo(null);
    setActiveModalTitle('');
  };

  return (
    <section id="projects" className="py-24 sm:py-32">
      {/* Section Kicker */}
      <p className="font-mono text-[0.78rem] tracking-[0.3em] uppercase text-[#ef4444] mb-4">
        {t('projects.kicker')}
      </p>

      <h2 className="text-[clamp(2.15rem,4vw,3.3rem)] font-extrabold tracking-[-0.03em] leading-tight text-white uppercase mb-3">
        {t('projects.title')}
      </h2>

      <p className="text-[#64748b] text-base sm:text-[1.05rem] mb-10 max-w-[56ch]">
        {t('projects.subtitle')}
      </p>

      {/* Lot / Batch Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-4 border-b border-[#131722] font-mono text-xs select-none">
        <div className="flex flex-wrap items-center gap-2">
          {BATCHES.map((batch, idx) => {
            const isActive = activeBatchIndex === idx;
            return (
              <button
                key={batch.id}
                onClick={() => setActiveBatchIndex(idx)}
                className={`px-3.5 py-2 border transition-all cursor-pointer uppercase tracking-wider flex items-center gap-2 text-[0.74rem] ${
                  isActive
                    ? 'bg-[#0e1626] border-[#10b981] text-[#10b981] font-bold shadow-lg shadow-[#10b981]/10'
                    : 'bg-[#07080b] border-[#131722] text-[#64748b] hover:text-white hover:border-[#222f46]'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? 'bg-[#10b981] animate-pulse' : 'bg-[#334155]'
                  }`}
                />
                <span>
                  [ {batch.lotNumber} {'//'} {batch.badge} ]
                </span>
                <span className="text-[0.68rem] opacity-70">({batch.keys.length})</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#64748b] text-[0.72rem] hidden sm:inline">
            CLUSTER_VIEW: <strong className="text-white">0{activeBatchIndex + 1}</strong> / 0{BATCHES.length}
          </span>
          <div className="inline-flex items-center gap-1.5">
            <button
              onClick={() =>
                setActiveBatchIndex((prev) => (prev > 0 ? prev - 1 : BATCHES.length - 1))
              }
              title="Previous cluster batch"
              className="px-2.5 py-1.5 bg-[#0a0c12] hover:bg-[#131722] text-[#94a3b8] hover:text-white border border-[#131722] hover:border-[#10b981]/40 transition-colors text-[0.7rem] uppercase font-bold cursor-pointer"
            >
              &lt; PREV_LOT
            </button>
            <button
              onClick={() =>
                setActiveBatchIndex((prev) => (prev < BATCHES.length - 1 ? prev + 1 : 0))
              }
              title="Next cluster batch"
              className="px-2.5 py-1.5 bg-[#0a0c12] hover:bg-[#131722] text-[#94a3b8] hover:text-white border border-[#131722] hover:border-[#10b981]/40 transition-colors text-[0.7rem] uppercase font-bold cursor-pointer"
            >
              NEXT_LOT &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Systems Registry - TUI Window Frames */}
      <div key={`batch-${activeBatchIndex}`} className="space-y-12 sm:space-y-16 animate-fadeIn">
        {visibleKeys.map((key, index) => {
          const name = t(`projects.${key}.name`);
          const domain = t(`projects.${key}.domain`);
          const description = t(`projects.${key}.description`);
          const link = t(`projects.${key}.link`);
          const externalLink = t(`projects.${key}.externalLink`);
          const externalLabel = t(`projects.${key}.externalLabel`);
          const projectTagsList = t(`projects.${key}.tags`);
          const tags = Array.isArray(projectTagsList) ? projectTagsList : [];

          const meta = PROJECT_METADATA[name] || {
            image: '/images/og-preview.png',
            badge: 'SYS // ARCHITECTURE',
            tagline: domain,
            branch: 'git:(main)',
            runtime: 'POSIX / Linux',
            telemetry: 'Active Stream',
          };

          const activeTab = activeTabs[name] || 'preview';
          const hasTopology = Boolean(TOPOLOGIES[name]);

          return (
            <article
              key={key}
              className="bg-[#07080b] border border-[#131722] hover:border-[#10b981]/40 transition-colors shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Window Titlebar */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#0a0c12] border-b border-[#131722] font-mono text-xs select-none">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]/80 inline-block" />
                  <span className="ml-2 text-white font-bold tracking-wider">
                    zer0sh@infra:~/{name}
                  </span>
                  <span className="text-[#64748b] hidden sm:inline">{meta.branch}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] text-[0.68rem] tracking-wider uppercase font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                    <span>{t('projects.runtimeStatus') || 'SYSTEM_OK'}</span>
                  </span>
                  <span className="text-[#64748b] text-[0.72rem] hidden md:inline">
                    NODE // 0{activeBatchIndex * 3 + index + 1}
                  </span>
                </div>
              </div>

              {/* TUI Navigation Tab Bar */}
              <div className="flex flex-wrap items-center border-b border-[#131722] bg-[#06070a] px-3 pt-2 gap-1 font-mono text-xs select-none">
                <button
                  onClick={() => setTab(name, 'preview')}
                  className={`px-3.5 py-1.5 border-t border-x transition-colors cursor-pointer text-[0.74rem] uppercase tracking-wider ${
                    activeTab === 'preview'
                      ? 'bg-[#07080b] text-[#10b981] border-[#131722] font-bold border-b-transparent -mb-[1px]'
                      : 'border-transparent text-[#64748b] hover:text-white'
                  }`}
                >
                  [ 01 // {t('projects.tabPreview') || 'PREVIEW'} ]
                </button>

                {hasTopology && (
                  <button
                    onClick={() => setTab(name, 'topology')}
                    className={`px-3.5 py-1.5 border-t border-x transition-colors cursor-pointer text-[0.74rem] uppercase tracking-wider ${
                      activeTab === 'topology'
                        ? 'bg-[#07080b] text-[#10b981] border-[#131722] font-bold border-b-transparent -mb-[1px]'
                        : 'border-transparent text-[#64748b] hover:text-white'
                    }`}
                  >
                    [ 02 // {t('projects.tabTopology') || 'TOPOLOGY'} ]
                  </button>
                )}

                <button
                  onClick={() => setTab(name, 'specs')}
                  className={`px-3.5 py-1.5 border-t border-x transition-colors cursor-pointer text-[0.74rem] uppercase tracking-wider ${
                    activeTab === 'specs'
                      ? 'bg-[#07080b] text-[#10b981] border-[#131722] font-bold border-b-transparent -mb-[1px]'
                      : 'border-transparent text-[#64748b] hover:text-white'
                  }`}
                >
                  [ 03 // {t('projects.tabSpecs') || 'SPECS'} ]
                </button>
              </div>

              {/* Viewport Content by Tab */}
              <div className="p-4 sm:p-6 lg:p-7 flex-1">
                {/* TAB 1: PREVIEW */}
                {activeTab === 'preview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                    {/* Media Container */}
                    <div className="lg:col-span-7">
                      <div className="relative aspect-[16/10] overflow-hidden bg-[#050608] border border-[#131722] group shadow-inner">
                        <img
                          src={meta.image}
                          alt={`${name} preview`}
                          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03] opacity-85 group-hover:opacity-100"
                          onError={(e) => {
                            e.currentTarget.src = '/images/og-preview.png';
                          }}
                        />

                        {/* Cyber overlay gradient & subtle scanline feel */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07080b] via-transparent to-transparent opacity-80" />

                        {/* Floating HUD Chip */}
                        <div className="absolute top-2.5 right-2.5">
                          <span className="font-mono text-[0.68rem] tracking-wider px-2 py-1 bg-[#07080b]/90 border border-[#131722] text-[#10b981] uppercase backdrop-blur-sm shadow-md">
                            {meta.badge}
                          </span>
                        </div>

                        {/* Bottom Tagline Overlay */}
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between font-mono text-[0.68rem] text-[#94a3b8] px-2 py-1 bg-[#07080b]/80 border border-[#131722]/60 backdrop-blur-sm">
                          <span className="text-[#10b981] font-bold uppercase truncate mr-2">
                            {meta.tagline}
                          </span>
                          <span className="text-[#64748b] hidden sm:inline shrink-0">
                            LIVE_PREVIEW
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description & Technical Summary */}
                    <div className="lg:col-span-5 flex flex-col justify-between h-full">
                      <div>
                        <div className="mb-2">
                          <span className="font-mono text-[0.76rem] tracking-[0.1em] uppercase text-[#10b981]">
                            {domain}
                          </span>
                        </div>

                        <h3 className="text-2xl font-extrabold tracking-[-0.03em] leading-tight text-white mb-3">
                          {name}
                        </h3>

                        <p className="text-[0.98rem] leading-[1.65] text-[#94a3b8] mb-5">
                          {description}
                        </p>
                      </div>

                      {/* Stack Tags */}
                      <div className="pt-2">
                        <p className="font-mono text-[0.7rem] uppercase tracking-wider text-[#64748b] mb-2">
                          STACK // RUNTIME
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {tags.map((tag) => (
                            <span
                              key={tag}
                              className="font-mono text-[0.72rem] px-2 py-0.5 bg-[#0c0e14] border border-[#192030] text-[#cbd5e1]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: TOPOLOGY (INTERACTIVE VECTOR & ASCII VIEWER) */}
                {activeTab === 'topology' && hasTopology && (
                  <ProjectTopologyViewer
                    projectId={name}
                    rawAscii={TOPOLOGIES[name]}
                  />
                )}

                {/* TAB 3: SPECS & RUNTIME */}
                {activeTab === 'specs' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                    <div className="p-4 bg-[#0a0c12] border border-[#131722]">
                      <p className="text-[#64748b] text-[0.7rem] uppercase tracking-wider mb-1">
                        PLATFORM / ARCHITECTURE DOMAIN
                      </p>
                      <p className="text-white font-bold text-sm mb-3">{domain}</p>

                      <p className="text-[#64748b] text-[0.7rem] uppercase tracking-wider mb-1">
                        TARGET RUNTIME
                      </p>
                      <p className="text-[#10b981] mb-0">{meta.runtime}</p>
                    </div>

                    <div className="p-4 bg-[#0a0c12] border border-[#131722]">
                      <p className="text-[#64748b] text-[0.7rem] uppercase tracking-wider mb-1">
                        OBSERVABILITY & TELEMETRY
                      </p>
                      <p className="text-white text-sm mb-3">{meta.telemetry}</p>

                      <p className="text-[#64748b] text-[0.7rem] uppercase tracking-wider mb-1">
                        UPSTREAM SYNC
                      </p>
                      <p className="text-[#10b981] mb-0">{meta.branch}</p>
                    </div>

                    <div className="md:col-span-2 p-4 bg-[#050608] border border-[#131722]">
                      <p className="text-[#64748b] text-[0.7rem] uppercase tracking-wider mb-2">
                        SYSTEM ABSTRACT
                      </p>
                      <p className="text-[#94a3b8] font-sans text-sm leading-relaxed mb-0">
                        {description}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Window Footer / Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#0a0c12] border-t border-[#131722] font-mono text-xs">
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* GitHub README Inspector Trigger */}
                  <button
                    onClick={() => openReadmeModal(name, `${name} // Technical Specification`)}
                    className="font-mono text-xs uppercase tracking-wider px-3 py-1.5 bg-[#10b981]/10 border border-[#10b981]/40 text-[#10b981] hover:bg-[#10b981] hover:text-[#07080b] transition-colors inline-flex items-center gap-1.5 cursor-pointer font-bold"
                  >
                    <span>[i]</span>
                    <span>{t('projects.viewReadme') || 'README // DOCS'}</span>
                  </button>

                  {/* External Link (e.g. WordPress.org Plugin) */}
                  {externalLink && (
                    <a
                      href={externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs tracking-wider text-[#64748b] hover:text-white uppercase inline-flex items-center gap-1 px-2.5 py-1.5 border border-[#131722] hover:border-[#64748b] transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] inline-block" />
                      <span>{externalLabel || 'PLUGIN ↗'}</span>
                    </a>
                  )}
                </div>

                {/* Source Code Link */}
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs uppercase tracking-wider text-[#64748b] hover:text-[#10b981] transition-colors inline-flex items-center gap-1.5 group"
                >
                  <span>{t('projects.viewCode') || 'SOURCE CODE'}</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </a>
              </div>
            </article>
          );
        })}
      </div>

      {/* Bottom Batch Navigation Controller */}
      <div className="mt-12 p-4 bg-[#07080b] border border-[#131722] flex flex-wrap items-center justify-between gap-4 font-mono text-xs select-none">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          <span className="text-[#64748b]">CLUSTER_LOT:</span>
          <span className="text-white font-bold tracking-wider">
            [{currentBatch.lotNumber} {'//'} {currentBatch.badge}]
          </span>
          <span className="text-[#64748b] text-[0.7rem] hidden sm:inline">
            (SHOWING 3 OF 6 TOTAL SYSTEMS)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {BATCHES.map((batch, idx) => (
            <button
              key={batch.id}
              onClick={() => {
                setActiveBatchIndex(idx);
                const el = document.getElementById('projects');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 border transition-all cursor-pointer uppercase tracking-wider text-[0.72rem] ${
                activeBatchIndex === idx
                  ? 'bg-[#0e1626] border-[#10b981] text-[#10b981] font-bold'
                  : 'bg-[#0a0c12] border-[#131722] text-[#64748b] hover:text-white hover:border-[#1e293b]'
              }`}
            >
              [ LOT 0{idx + 1} ]
            </button>
          ))}

          <button
            onClick={() => {
              const nextIdx = activeBatchIndex < BATCHES.length - 1 ? activeBatchIndex + 1 : 0;
              setActiveBatchIndex(nextIdx);
              const el = document.getElementById('projects');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3.5 py-1.5 bg-[#0e1626] hover:bg-[#131f36] text-[#38bdf8] hover:text-white border border-[#1e293b] hover:border-[#38bdf8]/40 transition-colors uppercase font-bold tracking-wider text-[0.72rem] cursor-pointer"
          >
            {activeBatchIndex === 0
              ? 'ADVANCE TO LOT 02: PLATFORM & ENV >>'
              : '<< RETURN TO LOT 01: CORE SYSTEMS'}
          </button>
        </div>
      </div>

      {/* GitHub Repository All Link */}
      <div className="mt-20 pt-8 border-t border-[#131722]/60 flex items-center justify-between">
        <a
          href="https://github.com/zer0sh?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs uppercase tracking-[0.2em] text-[#10b981] hover:text-white transition-colors inline-flex items-center gap-2"
        >
          <span>{t('projects.viewAll')}</span>
          <span>&rarr;</span>
        </a>
        <span className="font-mono text-[0.72rem] text-[#64748b]">
          REPOSITORIES_TOTAL: 6 // SYNCED
        </span>
      </div>

      {/* Specification README Modal HUD */}
      <ProjectReadmeModal
        isOpen={Boolean(activeModalRepo)}
        onClose={closeReadmeModal}
        repoName={activeModalRepo}
        projectTitle={activeModalTitle}
      />
    </section>
  );
};
