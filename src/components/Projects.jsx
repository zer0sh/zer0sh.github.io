import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Projects = () => {
  const { t } = useLanguage();

  const projectKeys = ['project1', 'project2', 'project3', 'project4', 'project5', 'project6'];

  return (
    <section id="projects" className="py-24 sm:py-32">
      {/* Section Kicker */}
      <p className="font-mono text-[0.75rem] tracking-[0.3em] uppercase text-[#ef4444] mb-4">
        {t('projects.kicker')}
      </p>

      <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-[-0.03em] leading-tight text-white uppercase mb-3">
        {t('projects.title')}
      </h2>

      <p className="text-[#64748b] text-base sm:text-lg mb-16 sm:mb-20 max-w-[50ch]">
        {t('projects.subtitle')}
      </p>

      {/* Systems Registry Track */}
      <div className="grid row-gap-16 sm:row-gap-24">
        {projectKeys.map((key) => {
          const name = t(`projects.${key}.name`);
          const domain = t(`projects.${key}.domain`);
          const description = t(`projects.${key}.description`);
          const link = t(`projects.${key}.link`);
          const tags = [
            'k3s-lab' === name ? 'Kubernetes · ArgoCD · Prometheus · Grafana · Loki · Shell' : null,
            'sunim-tui' === name ? 'Rust · Terminus CLI · Asynchronous POSIX · Vim-Style TUI' : null,
            'zer0sh-site-health-monitor' === name ? 'PHP · Security Headers · Vulnerability Telemetry · Cron Diagnostics' : null,
            'cms-local-envs' === name ? 'Docker Compose · GitHub Actions · Trivy Security · Automatic Rollback · CI/CD' : null,
            'gh-runner-selfhosted-docker' === name ? 'Docker · GitHub Actions · CI/CD Automation · Linux Isolation' : null,
            'dotfiles' === name ? 'Hyprland · Wayland · POSIX Shell · Declarative Config · Wiki' : null,
          ].filter(Boolean)[0] || '';

          return (
            <article
              key={key}
              className="grid grid-cols-1 lg:grid-cols-[18rem_1fr] xl:grid-cols-[20rem_1fr] gap-x-12 gap-y-3"
            >
              <div>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-block"
                >
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] leading-tight text-white group-hover:text-[#10b981] transition-colors">
                    {name}{' '}
                    <span className="inline-block text-[#64748b] text-lg group-hover:text-[#10b981] transition-colors">
                      &rarr;
                    </span>
                  </h3>
                </a>
                <p className="font-mono text-[0.78rem] tracking-[0.08em] uppercase text-[#10b981] mt-1.5">
                  {domain}
                </p>
              </div>

              <div>
                <p className="text-[1.05rem] leading-[1.55] text-white/95 max-w-[54ch] mb-3">
                  {description}
                </p>
                <p className="font-mono text-[0.78rem] tracking-[0.04em] text-[#64748b]">
                  {tags}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {/* GitHub Repository All Link */}
      <div className="mt-20 pt-8">
        <a
          href="https://github.com/zer0sh?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs uppercase tracking-[0.2em] text-[#10b981] hover:text-white transition-colors inline-flex items-center gap-2"
        >
          <span>{t('projects.viewAll')}</span>
          <span>&rarr;</span>
        </a>
      </div>
    </section>
  );
};
