import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const About = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-24 sm:py-32">
      {/* Kicker */}
      <p className="font-mono text-[0.78rem] tracking-[0.3em] uppercase text-[#ef4444] mb-4">
        {t('about.kicker')}
      </p>

      <h2 className="text-[clamp(2.15rem,4vw,3.3rem)] font-extrabold tracking-[-0.03em] leading-tight text-white uppercase mb-10 sm:mb-14">
        {t('about.title')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14">
        <p className="text-[1.12rem] sm:text-[1.22rem] leading-[1.62] text-white">
          {t('about.description')}
        </p>
        <p className="text-[1.04rem] leading-[1.65] text-[#cbd5e1]">
          {t('about.experience')}
        </p>
      </div>
    </section>
  );
};
