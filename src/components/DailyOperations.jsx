import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const DailyOperations = () => {
  const { t } = useLanguage();

  const opsKeys = ['op1', 'op2', 'op3', 'op4', 'op5'];

  return (
    <section id="operations" className="py-24 sm:py-32">
      {/* Kicker */}
      <p className="font-mono text-[0.78rem] tracking-[0.3em] uppercase text-[#10b981] mb-4">
        {t('dailyOps.kicker')}
      </p>

      <h2 className="text-[clamp(2.15rem,4vw,3.3rem)] font-extrabold tracking-[-0.03em] leading-tight text-white uppercase mb-3">
        {t('dailyOps.title')}
      </h2>

      <p className="text-[#64748b] text-base sm:text-[1.05rem] mb-14 sm:mb-18 max-w-[65ch]">
        {t('dailyOps.subtitle')}
      </p>

      {/* Operational Runbook Ledger */}
      <div className="space-y-10 sm:space-y-14">
        {opsKeys.map((key) => {
          const code = t(`dailyOps.${key}.code`);
          const title = t(`dailyOps.${key}.title`);
          const description = t(`dailyOps.${key}.description`);

          return (
            <article
              key={key}
              className="border-b border-[#131722] pb-10 sm:pb-14 last:border-b-0 last:pb-0 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-start"
            >
              {/* Code Column */}
              <div className="lg:col-span-3">
                <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-[0.85rem] text-[#10b981] tracking-[0.2em] uppercase bg-[#0c0e14] border border-[#131722] px-3 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                  <span>{code}</span>
                </div>
              </div>

              {/* Content Column */}
              <div className="lg:col-span-9">
                <h3 className="text-xl sm:text-[1.65rem] font-extrabold tracking-tight text-white mb-2.5">
                  {title}
                </h3>
                <p className="text-[1.02rem] leading-[1.65] text-[#cbd5e1] mb-5 max-w-[70ch]">
                  {description}
                </p>

                {/* Scope Indicators */}
                <div className="flex flex-wrap gap-2">
                  {(t(`dailyOps.${key}.tags`) || []).map((tag) => (
                    <span key={tag} className="font-mono text-[0.76rem] text-[#94a3b8] bg-[#0c0e14] border border-[#131722] px-2.5 py-1 uppercase tracking-wider">
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
