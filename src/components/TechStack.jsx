import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const TechStack = () => {
  const { t } = useLanguage();

  const categories = [
    {
      key: 'infrastructure',
      name: t('skills.infrastructure.name'),
      items: ['Kubernetes', 'K3s', 'Docker', 'Docker Compose', 'ArgoCD', 'Helm', 'Self-Hosted'],
    },
    {
      key: 'observability',
      name: t('skills.observability.name'),
      items: ['Prometheus', 'Grafana', 'Loki', 'Sentry', 'Log Aggregation', 'Metric Alerts'],
    },
    {
      key: 'systems',
      name: t('skills.systems.name'),
      items: ['Linux Administration', 'POSIX Shell', 'Bash', 'Rust', 'Wayland', 'Hardware Telemetry'],
    },
    {
      key: 'reliability',
      name: t('skills.reliability.name'),
      items: ['GitHub Actions', 'Trivy Scanning', 'NGINX', 'PostgreSQL', 'MySQL', 'SSL/TLS'],
    },
  ];

  return (
    <section id="stack" className="py-24 sm:py-32">
      {/* Kicker */}
      <p className="font-mono text-[0.75rem] tracking-[0.3em] uppercase text-[#ef4444] mb-4">
        {t('skills.kicker')}
      </p>

      <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-[-0.03em] leading-tight text-white uppercase mb-16 sm:mb-20">
        {t('skills.title')}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
        {categories.map((cat) => (
          <div key={cat.key}>
            <h3 className="font-mono text-[0.8rem] uppercase tracking-[0.15em] text-[#10b981] mb-5">
              {cat.name}
            </h3>
            <ul className="space-y-2.5">
              {cat.items.map((item) => (
                <li
                  key={item}
                  className="text-[0.95rem] text-white/90 hover:text-[#10b981] transition-colors"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};
