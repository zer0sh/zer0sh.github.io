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
    <header id="hero" className="relative pt-16 sm:pt-24 pb-28 sm:pb-36">
      {/* Neon Ambient Watermark - Stacked Two Lines */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none select-none neon-text-infra font-black uppercase tracking-[-0.05em] text-[clamp(4rem,11.5vw,8.5rem)] leading-[0.82] mb-3 sm:mb-4 flex flex-col relative z-0 pl-2 sm:pl-4"
      >
        <span>{t('hero.kickerLine1') || 'INFRA'}</span>
        <span>{t('hero.kickerLine2') || 'STRUCTURE'}</span>
      </div>

      <div className="relative z-10">
        {/* Telemetry Strip */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[0.78rem] uppercase tracking-[0.2em] text-[#10b981] mb-6">
          <div>{t('hero.telemetry')}</div>
        </div>

        {/* Headline Name */}
        <h1 className="text-[clamp(3.1rem,6.8vw,5.2rem)] font-extrabold tracking-[-0.04em] leading-[0.95] text-white uppercase mb-4">
          {t('hero.name')}
        </h1>

        {/* Subtitle / Handle */}
        <p className="font-mono text-[1.15rem] text-[#10b981] tracking-tight mb-7 sm:mb-9">
          {t('hero.handle')}
        </p>

        {/* SRE Doctrine */}
        <p className="text-[clamp(1.22rem,2.2vw,1.75rem)] font-normal leading-[1.45] text-white max-w-[45ch] mb-8">
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
            className="font-mono text-xs uppercase tracking-[0.22em] text-[#10b981] hover:text-white transition-colors flex items-center gap-2"
          >
            <span>&darr;</span>
            <span>{t('projects.title')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
