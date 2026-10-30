import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { WorkflowTelemetry } from './WorkflowTelemetry';
import { HeroParticles } from './HeroParticles';
import { DynamicWatermark } from './DynamicWatermark';

export const Hero = () => {
  const { t } = useLanguage();

  const scrollToProjects = () => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header id="hero" className="relative pt-16 sm:pt-24 pb-28 sm:pb-36">
      {/* Floating Interactive Particle Constellation */}
      <HeroParticles />

      {/* Dynamic Ambient Cyber Watermark */}
      <DynamicWatermark />

      <div className="relative z-10">
        {/* Telemetry Strip */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[0.78rem] uppercase tracking-[0.2em] text-[#10b981] mb-6">
          <div>{t('hero.telemetry')}</div>
        </div>

        {/* Headline Name - 20% Smaller, Space Grotesk Font, Titanium Shimmer Effect */}
        <h1 className="font-display font-extrabold uppercase text-[clamp(2.45rem,5.4vw,4.15rem)] tracking-[-0.035em] leading-[0.98] mb-4 select-none">
          <span className="name-gradient-glow inline-block hover:scale-[1.01] transition-transform duration-300">
            {t('hero.name')}
          </span>
        </h1>

        {/* Subtitle / Handle */}
        <p className="font-mono text-[1.15rem] text-[#10b981] tracking-tight mb-7 sm:mb-9">
          {t('hero.handle')}
        </p>

        {/* SRE Doctrine */}
        <p className="text-[clamp(1.15rem,2vw,1.65rem)] font-normal leading-[1.55] text-white max-w-[64ch] mb-8">
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
