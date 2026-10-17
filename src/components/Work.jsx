import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Work = () => {
  const { t } = useLanguage();

  const functionKeys = ['function1', 'function2', 'function3', 'function4', 'function5', 'function6'];

  const functionMeta = {
    function1: {
      badge: 'K8S // GITOPS',
      status: 'SYNCED',
      statusColor: 'text-[#10b981]',
      dotBg: 'bg-[#10b981]',
      cmd: 'argocd app sync cluster --prune',
    },
    function2: {
      badge: 'TRIAGE // RCA P1',
      status: 'BLAMELESS',
      statusColor: 'text-[#ef4444]',
      dotBg: 'bg-[#ef4444]',
      cmd: 'ss -tulpn && journalctl -u nginx -f',
    },
    function3: {
      badge: 'KERNEL // BASTION',
      status: 'HARDENED',
      statusColor: 'text-[#38bdf8]',
      dotBg: 'bg-[#38bdf8]',
      cmd: 'ufw status verbose && fail2ban-client status',
    },
    function4: {
      badge: 'CI/CD // BUILDX',
      status: 'OPTIMIZED',
      statusColor: 'text-[#10b981]',
      dotBg: 'bg-[#10b981]',
      cmd: 'docker buildx build --target prod -t app',
    },
    function5: {
      badge: 'METRICS // PROM',
      status: 'MONITORED',
      statusColor: 'text-[#38bdf8]',
      dotBg: 'bg-[#38bdf8]',
      cmd: 'curl -s localhost:9090/api/v1/query?query=up',
    },
    function6: {
      badge: 'SYS // MODAL POSIX',
      status: 'IDEMPOTENT',
      statusColor: 'text-[#10b981]',
      dotBg: 'bg-[#10b981]',
      cmd: 'dotbot -c install.conf.yaml --verbose',
    },
  };

  return (
    <section id="disciplines" className="py-24 sm:py-32">
      {/* Kicker */}
      <p className="font-mono text-[0.78rem] tracking-[0.3em] uppercase text-[#ef4444] mb-4">
        {t('work.kicker')}
      </p>

      <h2 className="text-[clamp(2.15rem,4vw,3.3rem)] font-extrabold tracking-[-0.03em] leading-tight text-white uppercase mb-3">
        {t('work.title')}
      </h2>

      <p className="text-[#64748b] text-base sm:text-[1.05rem] mb-14 sm:mb-18 max-w-[54ch]">
        {t('work.subtitle')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {functionKeys.map((key, index) => {
          const name = t(`work.${key}.name`);
          const description = t(`work.${key}.description`);
          const meta = functionMeta[key];

          return (
            <article
              key={key}
              className="border border-[#131722] hover:border-[#10b981]/50 bg-[#0c0e14]/50 p-6 flex flex-col justify-between transition-colors group"
            >
              <div>
                {/* Micro Telemetry Header */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#131722] font-mono text-[0.72rem]">
                  <span className="font-bold text-[#10b981] tracking-[0.15em]">
                    {`0${index + 1} // ${meta.badge}`}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${meta.dotBg}`} />
                    <span className={`tracking-wider ${meta.statusColor}`}>{meta.status}</span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-[1.32rem] font-extrabold tracking-tight text-white mb-2.5 group-hover:text-[#10b981] transition-colors">
                  {name}
                </h3>
                <p className="text-[0.98rem] leading-[1.62] text-[#cbd5e1] mb-5">
                  {description}
                </p>
              </div>

              {/* Monospace CLI Operator Anchor */}
              <div className="pt-3 border-t border-[#131722]/80 font-mono text-[0.72rem] text-[#64748b] flex items-center gap-2 overflow-x-auto select-all">
                <span className="text-[#10b981] select-none">$</span>
                <span className="text-white/80 whitespace-nowrap">{meta.cmd}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
