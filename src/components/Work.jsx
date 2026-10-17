import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Work = () => {
  const { t } = useLanguage();

  const functionKeys = ['function1', 'function2', 'function3', 'function4', 'function5', 'function6'];

  return (
    <section id="disciplines" className="py-24 sm:py-32">
      {/* Kicker */}
      <p className="font-mono text-[0.75rem] tracking-[0.3em] uppercase text-[#ef4444] mb-4">
        {t('work.kicker')}
      </p>

      <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-[-0.03em] leading-tight text-white uppercase mb-3">
        {t('work.title')}
      </h2>

      <p className="text-[#64748b] text-base sm:text-lg mb-16 sm:mb-20 max-w-[50ch]">
        {t('work.subtitle')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
        {functionKeys.map((key, index) => {
          const name = t(`work.${key}.name`);
          const description = t(`work.${key}.description`);

          return (
            <article key={key} className="flex flex-col">
              <span className="font-mono text-xs text-[#10b981] tracking-[0.2em] mb-2">
                {`0${index + 1} //`}
              </span>
              <h3 className="text-xl font-bold tracking-tight text-white mb-2">
                {name}
              </h3>
              <p className="text-[0.95rem] leading-[1.55] text-[#8e99a8] mb-3">
                {description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
};
