import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const TechStack = () => {
  const { t } = useLanguage();

  const categories = [
    {
      key: 'infrastructure',
      name: t('skills.infrastructure.name'),
      domain: 'DOMAIN.01 // ORCHESTRATION',
      status: 'CLUSTER READY',
      items: t('skills.infrastructure.items') || ['Kubernetes', 'K3s', 'Docker', 'Docker Compose', 'ArgoCD', 'Helm', 'Self-Hosted'],
    },
    {
      key: 'observability',
      name: t('skills.observability.name'),
      domain: 'DOMAIN.02 // TELEMETRY',
      status: 'REALTIME STREAM',
      items: t('skills.observability.items') || ['Prometheus', 'Grafana', 'Loki', 'Sentry', 'Log Aggregation', 'Metric Alerts'],
    },
    {
      key: 'systems',
      name: t('skills.systems.name'),
      domain: 'DOMAIN.03 // POSIX & RUNTIMES',
      status: 'POSIX STRICT',
      items: t('skills.systems.items') || ['Linux Administration', 'POSIX Shell', 'Bash', 'Rust', 'Wayland', 'Hardware Telemetry'],
    },
    {
      key: 'reliability',
      name: t('skills.reliability.name'),
      domain: 'DOMAIN.04 // RESILIENCE',
      status: 'SECURITY AUDITED',
      items: t('skills.reliability.items') || ['GitHub Actions', 'Trivy Scanning', 'NGINX', 'PostgreSQL', 'MySQL', 'SSL/TLS'],
    },
  ];

  return (
    <section id="stack" className="py-24 sm:py-32">
      {/* Kicker */}
      <p className="font-mono text-[0.78rem] tracking-[0.3em] uppercase text-[#ef4444] mb-4">
        {t('skills.kicker')}
      </p>

      <h2 className="text-[clamp(2.15rem,4vw,3.3rem)] font-extrabold tracking-[-0.03em] leading-tight text-white uppercase mb-14 sm:mb-18">
        {t('skills.title')}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.key}
            className="border border-[#131722] hover:border-[#10b981]/50 bg-[#0c0e14]/50 p-5 sm:p-6 flex flex-col justify-between transition-colors group"
          >
            <div>
              {/* Category Domain Strip */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#131722] font-mono text-[0.7rem]">
                <span className="text-[#64748b] tracking-wider uppercase font-semibold">
                  {cat.domain}
                </span>
                <span className="text-[#10b981] font-bold">
                  {`[0${cat.items.length}]`}
                </span>
              </div>

              <h3 className="font-mono text-[0.88rem] font-bold uppercase tracking-[0.12em] text-[#10b981] mb-5">
                {cat.name}
              </h3>

              <ul className="space-y-2.5">
                {cat.items.map((item) => (
                  <li
                    key={item}
                    className="text-[0.94rem] text-white/90 hover:text-[#10b981] transition-colors flex items-center gap-2"
                  >
                    <span className="font-mono text-xs text-[#10b981]/70 group-hover:text-[#10b981] select-none">
                      ▸
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Telemetry Verification Pill */}
            <div className="mt-6 pt-3 border-t border-[#131722]/80 font-mono text-[0.68rem] text-[#64748b] flex items-center justify-between">
              <span className="tracking-wider uppercase">STATUS</span>
              <span className="text-white/80 font-bold">{cat.status}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
