import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const DayInTheLife = () => {
  const { t } = useLanguage();

  const steps = [
    {
      key: 'step1',
      tags: ['Grafana Dashboards', 'Sentry Streams', 'Host Health', 'SLO Budget'],
      nodeBorder: 'border-[#10b981]',
      nodeBg: 'bg-[#10b981]',
      badgeStyle: 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/30',
    },
    {
      key: 'step2',
      tags: ['GitHub Actions', 'Docker Buildx', 'Trivy CVE Scan', 'Zero-Downtime Rollout'],
      nodeBorder: 'border-[#38bdf8]',
      nodeBg: 'bg-[#38bdf8]',
      badgeStyle: 'text-[#38bdf8] bg-[#38bdf8]/10 border-[#38bdf8]/30',
    },
    {
      key: 'step3',
      tags: ['SSH Bastion', 'systemd Journal', 'Network Sockets', 'Root-Cause Discovery'],
      nodeBorder: 'border-[#ef4444]',
      nodeBg: 'bg-[#ef4444]',
      badgeStyle: 'text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/30',
    },
    {
      key: 'step4',
      tags: ['Blameless Post-Mortem', 'Alerting Rules', 'Idempotent Automation', 'GitOps Commit'],
      nodeBorder: 'border-[#10b981]',
      nodeBg: 'bg-[#10b981]',
      badgeStyle: 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/30',
    },
  ];

  return (
    <section id="routine" className="py-24 sm:py-32">
      {/* Kicker */}
      <p className="font-mono text-[0.78rem] tracking-[0.3em] uppercase text-[#10b981] mb-4">
        {t('timeline.kicker')}
      </p>

      <h2 className="text-[clamp(2.15rem,4vw,3.3rem)] font-extrabold tracking-[-0.03em] leading-tight text-white uppercase mb-3">
        {t('timeline.title')}
      </h2>

      <p className="text-[#64748b] text-base sm:text-[1.05rem] mb-14 sm:mb-18 max-w-[65ch]">
        {t('timeline.subtitle')}
      </p>

      {/* Graphical Chronological Trace */}
      <div className="relative border-l-2 border-[#131722] ml-3 sm:ml-6 pl-7 sm:pl-10 space-y-12 sm:space-y-16">
        {steps.map(({ key, tags, nodeBorder, nodeBg, badgeStyle }) => {
          const time = t(`timeline.${key}.time`);
          const status = t(`timeline.${key}.status`);
          const title = t(`timeline.${key}.title`);
          const description = t(`timeline.${key}.description`);

          return (
            <article key={key} className="relative">
              {/* Telemetry Axis Node */}
              <div
                className={`absolute -left-[35px] sm:-left-[47px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#07080b] border-2 ${nodeBorder} flex items-center justify-center`}
              >
                <span className={`w-1 h-1 rounded-full ${nodeBg}`} />
              </div>

              {/* Timestamp & Status Header */}
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="font-mono text-xs sm:text-[0.82rem] font-bold text-white bg-[#0c0e14] border border-[#1e2433] px-2.5 py-1 tracking-wider">
                  {time}
                </span>
                <span
                  className={`font-mono text-[0.74rem] uppercase tracking-wider px-2 py-0.5 border ${badgeStyle}`}
                >
                  {status}
                </span>
              </div>

              {/* Title & Narrative */}
              <h3 className="text-xl sm:text-[1.65rem] font-extrabold tracking-tight text-white mb-2.5">
                {title}
              </h3>
              <p className="text-[1.02rem] leading-[1.65] text-[#cbd5e1] mb-4 max-w-[70ch]">
                {description}
              </p>

              {/* Telemetry Tags */}
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[0.76rem] text-[#94a3b8] bg-[#0c0e14] border border-[#131722] px-2.5 py-1 uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
