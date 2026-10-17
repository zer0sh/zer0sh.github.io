import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { WorkflowTelemetry } from './WorkflowTelemetry';

export const Hero = () => {
  const { t } = useLanguage();

  const scrollToProjects = () => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="relative pt-16 sm:pt-24 pb-28 sm:pb-36 overflow-hidden">
      {/* Ghost Ambient Watermark */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none select-none text-[#131722] font-black uppercase tracking-[-0.06em] text-[clamp(3.5rem,12vw,10.5rem)] leading-[0.85] mb-[-1.5rem] sm:mb-[-2rem]"
      >
        {t('hero.kicker')}
      </div>

      {/* Telemetry Strip */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[0.75rem] uppercase tracking-[0.2em] text-[#10b981] mb-6">
        <div>{t('hero.telemetry')}</div>
      </div>

      {/* Headline Name */}
      <h1 className="text-[clamp(3rem,7vw,5.5rem)] font-extrabold tracking-[-0.04em] leading-[0.95] text-white uppercase mb-4">
        {t('hero.name')}
      </h1>

      {/* Subtitle / Handle */}
      <p className="font-mono text-[1.1rem] text-[#10b981] tracking-tight mb-8 sm:mb-10">
        {t('hero.handle')}
      </p>

      {/* SRE Doctrine */}
      <p className="text-[clamp(1.2rem,2.3vw,1.75rem)] font-normal leading-[1.4] text-white max-w-[44ch] mb-8">
        {t('hero.doctrinePrimary')}{' '}
        <span className="text-[#64748b]">
          {t('hero.doctrineSecondary')}
        </span>
      </p>

      {/* Live Pipeline Telemetry Probe */}
      <WorkflowTelemetry />

      {/* Fast Action Indicator */}
      <div className="mt-8">
        <button
          onClick={scrollToProjects}
          className="font-mono text-xs uppercase tracking-[0.25em] text-[#10b981] hover:text-white transition-colors flex items-center gap-2"
        >
          <span>&darr;</span>
          <span>{t('projects.title')}</span>
        </button>
      </div>
    </header>
  );
};
