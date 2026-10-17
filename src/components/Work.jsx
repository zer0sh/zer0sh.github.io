import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Work = () => {
  const { t } = useLanguage();

  const functionKeys = ['function1', 'function2', 'function3', 'function4', 'function5', 'function6'];

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
        {functionKeys.map((key, index) => {
          const name = t(`work.${key}.name`);
          const description = t(`work.${key}.description`);

          return (
            <article key={key} className="flex flex-col">
              <span className="font-mono text-xs sm:text-[0.82rem] font-bold text-[#10b981] tracking-[0.2em] mb-2">
                {`0${index + 1} //`}
              </span>
              <h3 className="text-xl sm:text-[1.35rem] font-extrabold tracking-tight text-white mb-2.5">
                {name}
              </h3>
              <p className="text-[1.02rem] leading-[1.6] text-[#cbd5e1]">
                {description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
};
