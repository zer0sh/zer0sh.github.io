import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const About = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-24 sm:py-32">
      {/* Kicker */}
      <p className="font-mono text-[0.75rem] tracking-[0.3em] uppercase text-[#ef4444] mb-4">
        {t('about.kicker')}
      </p>

      <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-[-0.03em] leading-tight text-white uppercase mb-12 sm:mb-16">
        {t('about.title')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16">
        <p className="text-[1.1rem] sm:text-[1.2rem] leading-[1.6] text-white">
          {t('about.description')}
        </p>
        <p className="text-[1.05rem] leading-[1.65] text-[#8e99a8]">
          {t('about.experience')}
        </p>
      </div>
    </section>
  );
};
