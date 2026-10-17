import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

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

  'zer0sh-site-health-monitor': `+-- AUTOMATED SECURITY HEADERS & VULNERABILITY AUDITOR --------------------+
| [Scheduled Cron Worker @ 00:00 UTC] ---> [Endpoint Multiplexer]          |
|                                                   |                      |
|        +------------------------------------------+------------------+   |
|        v                                          v                  v   |
| [TLS/SSL Handshake]                     [HTTP Security Headers] [DNS NS] |
|   - Expiration warning (<14d)             - CSP, HSTS, X-Frame    - TTL  |
|        |                                          |                  |   |
|        +------------------------------------------+------------------+   |
|                                                   v                      |
|                      [Telemetry JSON Report & Discord Dispatch]          |
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

export const Projects = () => {
  const { t, lang } = useLanguage();
  const [expandedTopology, setExpandedTopology] = useState(null);

  const projectKeys = ['project1', 'project2', 'project3', 'project4', 'project5', 'project6'];

  const toggleTopology = (name) => {
    setExpandedTopology((prev) => (prev === name ? null : name));
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

      <p className="text-[#64748b] text-base sm:text-[1.05rem] mb-14 sm:mb-18 max-w-[52ch]">
        {t('projects.subtitle')}
      </p>

      {/* Systems Registry Track */}
      <div className="grid row-gap-14 sm:row-gap-20">
        {projectKeys.map((key) => {
          const name = t(`projects.${key}.name`);
          const domain = t(`projects.${key}.domain`);
          const description = t(`projects.${key}.description`);
          const link = t(`projects.${key}.link`);
          const tags = [
            'k3s-lab' === name ? 'Kubernetes · ArgoCD · Prometheus · Grafana · Loki · Shell' : null,
            'sunim-tui' === name ? 'Rust · Terminus CLI · Asynchronous POSIX · Vim-Style TUI' : null,
            'zer0sh-site-health-monitor' === name ? 'PHP · Security Headers · Vulnerability Telemetry · Cron Diagnostics' : null,
            'cms-local-envs' === name ? 'Docker Compose · GitHub Actions · Trivy Security · Automatic Rollback · CI/CD' : null,
            'gh-runner-selfhosted-docker' === name ? 'Docker · GitHub Actions · CI/CD Automation · Linux Isolation' : null,
            'dotfiles' === name ? 'Hyprland · Wayland · POSIX Shell · Declarative Config · Wiki' : null,
          ].filter(Boolean)[0] || '';

          const hasTopology = Boolean(TOPOLOGIES[name]);
          const isExpanded = expandedTopology === name;

          return (
            <article
              key={key}
              className="grid grid-cols-1 lg:grid-cols-[19rem_1fr] xl:grid-cols-[21rem_1fr] gap-x-10 gap-y-3 pb-7 border-b border-[#131722]/60 last:border-b-0"
            >
              <div>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-block"
                >
                  <h3 className="text-2xl sm:text-[1.85rem] font-extrabold tracking-[-0.03em] leading-tight text-white group-hover:text-[#10b981] transition-colors">
                    {name}{' '}
                    <span className="inline-block text-[#64748b] text-lg group-hover:text-[#10b981] transition-colors">
                      &rarr;
                    </span>
                  </h3>
                </a>
                <p className="font-mono text-[0.8rem] tracking-[0.08em] uppercase text-[#10b981] mt-1.5">
                  {domain}
                </p>
              </div>

              <div>
                <p className="text-[1.04rem] leading-[1.6] text-white/95 max-w-[54ch] mb-3">
                  {description}
                </p>
                <p className="font-mono text-[0.8rem] tracking-[0.04em] text-[#64748b] mb-4">
                  {tags}
                </p>

                {/* Technical Architecture Topology Trigger */}
                {hasTopology && (
                  <div className="pt-2">
                    <button
                      onClick={() => toggleTopology(name)}
                      className="font-mono text-xs uppercase tracking-wider text-[#10b981] hover:text-white transition-colors inline-flex items-center gap-2 group cursor-pointer"
                      aria-expanded={isExpanded}
                    >
                      <span className="text-[#64748b] group-hover:text-[#10b981] font-bold">
                        {isExpanded ? '[-]' : '[+]'}
                      </span>
                      <span>
                        {isExpanded
                          ? (lang === 'es' ? 'OCULTAR TOPOLOGÍA DE SISTEMA' : 'COLLAPSE SYSTEM TOPOLOGY')
                          : (lang === 'es' ? 'VER TOPOLOGÍA DE SISTEMA (ASCII)' : 'VIEW SYSTEM TOPOLOGY (ASCII)')}
                      </span>
                    </button>

                    {/* Collapsible Architecture Schematic Box */}
                    {isExpanded && (
                      <div className="mt-3 p-3.5 sm:p-4 bg-[#07080b] border border-[#131722] overflow-x-auto select-text shadow-xl">
                        <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#131722] font-mono text-[0.7rem] text-[#64748b]">
                          <span className="text-[#10b981] font-bold uppercase">
                            SCHEMATIC // {name}
                          </span>
                          <span>DIRECTION_J // ARCH_SYS</span>
                        </div>
                        <pre className="font-mono text-[0.6rem] sm:text-[0.72rem] text-[#10b981] leading-relaxed whitespace-pre m-0">
                          {TOPOLOGIES[name]}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* GitHub Repository All Link */}
      <div className="mt-20 pt-8">
        <a
          href="https://github.com/zer0sh?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs uppercase tracking-[0.2em] text-[#10b981] hover:text-white transition-colors inline-flex items-center gap-2"
        >
          <span>{t('projects.viewAll')}</span>
          <span>&rarr;</span>
        </a>
      </div>
    </section>
  );
};
