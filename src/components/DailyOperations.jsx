import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const DailyOperations = () => {
  const { t } = useLanguage();

  const opsKeys = ['op1', 'op2', 'op3', 'op4', 'op5'];

  return (
    <section id="operations" className="py-24 sm:py-32">
      {/* Kicker */}
      <p className="font-mono text-[0.75rem] tracking-[0.3em] uppercase text-[#ef4444] mb-4">
        {t('dailyOps.kicker')}
      </p>

      <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-[-0.03em] leading-tight text-white uppercase mb-3">
        {t('dailyOps.title')}
      </h2>

      <p className="text-[#64748b] text-base sm:text-lg mb-16 sm:mb-20 max-w-[65ch]">
        {t('dailyOps.subtitle')}
      </p>

      {/* Operational Runbook Ledger */}
      <div className="space-y-10 sm:space-y-12">
        {opsKeys.map((key) => {
          const code = t(`dailyOps.${key}.code`);
          const title = t(`dailyOps.${key}.title`);
          const description = t(`dailyOps.${key}.description`);

          return (
            <article
              key={key}
              className="border-b border-[#131722] pb-10 sm:pb-12 last:border-b-0 last:pb-0 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start"
            >
              {/* Code Column */}
              <div className="lg:col-span-3">
                <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm text-[#10b981] tracking-[0.2em] uppercase bg-[#0c0e14] border border-[#131722] px-3 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                  <span>{code}</span>
                </div>
              </div>

              {/* Content Column */}
              <div className="lg:col-span-9">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-3">
                  {title}
                </h3>
                <p className="text-[0.95rem] leading-[1.65] text-[#8e99a8] mb-5 max-w-[72ch]">
                  {description}
                </p>

                {/* Scope Indicators */}
                <div className="flex flex-wrap gap-2">
                  {key === 'op1' && ['Prometheus', 'Grafana', 'Sentry', 'SLI/SLO Auditing'].map((tag) => (
                    <span key={tag} className="font-mono text-[0.7rem] text-[#64748b] bg-[#0c0e14] border border-[#131722] px-2.5 py-1 uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                  {key === 'op2' && ['GitHub Actions', 'Docker Buildx', 'Rollback Hooks', 'Multi-Env Delivery'].map((tag) => (
                    <span key={tag} className="font-mono text-[0.7rem] text-[#64748b] bg-[#0c0e14] border border-[#131722] px-2.5 py-1 uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                  {key === 'op3' && ['Incident Response', 'NGINX Upstream', 'SSL/TLS', 'Cloudflare Proxy', 'Blameless RCA'].map((tag) => (
                    <span key={tag} className="font-mono text-[0.7rem] text-[#64748b] bg-[#0c0e14] border border-[#131722] px-2.5 py-1 uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                  {key === 'op4' && ['Linux (Debian/Ubuntu)', 'Docker Compose', 'SSH Bastion Hardening', 'UFW / Fail2ban'].map((tag) => (
                    <span key={tag} className="font-mono text-[0.7rem] text-[#64748b] bg-[#0c0e14] border border-[#131722] px-2.5 py-1 uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                  {key === 'op5' && ['Bash Scripting', 'Python Automation', 'DB Sanitization', 'Toil Elimination'].map((tag) => (
                    <span key={tag} className="font-mono text-[0.7rem] text-[#64748b] bg-[#0c0e14] border border-[#131722] px-2.5 py-1 uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
