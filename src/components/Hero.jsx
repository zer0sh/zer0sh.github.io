import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Hero = () => {
  const { t } = useLanguage();

  const scrollToProjects = () => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header id="hero" className="relative pt-16 sm:pt-24 pb-20 sm:pb-28">
      <div className="relative z-10 max-w-4xl">
        {/* Profile Avatar & Focus Tag */}
        <div className="flex items-center gap-5 sm:gap-6 mb-8">
          <img
            src="/images/profile.png"
            alt={t('hero.name')}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#10b981]/50 shadow-lg shadow-[#10b981]/15 shrink-0"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2 font-mono text-[0.75rem] uppercase tracking-[0.18em] text-[#10b981] mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span>{t('hero.telemetry')}</span>
            </div>
            <p className="font-mono text-sm sm:text-[0.95rem] text-[#94a3b8]">
              {t('hero.handle')}
            </p>
          </div>
        </div>

        {/* Headline Name - Space Grotesk Font, Titanium Shimmer Effect */}
        <h1 className="font-display font-extrabold uppercase text-[clamp(2.45rem,5.4vw,4.15rem)] tracking-[-0.035em] leading-[0.98] mb-6 select-none">
          <span className="name-gradient-glow inline-block hover:scale-[1.01] transition-transform duration-300">
            {t('hero.name')}
          </span>
        </h1>

        {/* SRE Doctrine */}
        <p className="text-[clamp(1.15rem,2vw,1.5rem)] font-normal leading-[1.6] text-white max-w-[64ch] mb-8">
          {t('hero.doctrinePrimary')}{' '}
          <span className="text-[#94a3b8]">
            {t('hero.doctrineSecondary')}
          </span>
        </p>

        {/* Quick Links & Projects CTA */}
        <div className="flex flex-wrap items-center gap-5 sm:gap-6 pt-2 font-mono text-xs uppercase tracking-[0.18em]">
          <button
            onClick={scrollToProjects}
            className="text-[#10b981] hover:text-white transition-colors flex items-center gap-2 font-bold"
          >
            <span>&darr;</span>
            <span>{t('projects.title')}</span>
          </button>
          <span className="text-[#1e2433]">/</span>
          <a
            href="https://github.com/zer0sh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#94a3b8] hover:text-[#10b981] transition-colors"
          >
            GitHub
          </a>
          <span className="text-[#1e2433]">/</span>
          <a
            href="https://linkedin.com/in/steven-munozl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#94a3b8] hover:text-[#10b981] transition-colors"
          >
            LinkedIn
          </a>
          <span className="text-[#1e2433]">/</span>
          <a
            href="#/blog"
            className="text-[#94a3b8] hover:text-[#10b981] transition-colors"
          >
            Blog
          </a>
        </div>
      </div>
    </header>
  );
};
