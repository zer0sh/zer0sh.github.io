import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FiExternalLink } from 'react-icons/fi';
import { SiKubernetes, SiDocker } from 'react-icons/si';
import { DiJava } from 'react-icons/di';

export const Projects = () => {
  const { t } = useLanguage();

  const projectIconMap = {
    project1: <SiDocker className="w-12 h-12" />,
    project2: <DiJava className="w-12 h-12" />,
    project3: <SiKubernetes className="w-12 h-12" />,
  };

  const projects = [
    {
      key: 'project1',
      name: t('projects.project1.name'),
      description: t('projects.project1.description'),
      tags: t('projects.project1.tags'),
      icon: '☸️',
      link: t('projects.project1.link'),
    },
    {
      key: 'project2',
      name: t('projects.project2.name'),
      description: t('projects.project2.description'),
      tags: t('projects.project2.tags'),
      icon: '🐳',
      link: t('projects.project2.link'),
    },
    {
      key: 'project3',
      name: t('projects.project3.name'),
      description: t('projects.project3.description'),
      tags: t('projects.project3.tags'),
      icon: '⚡',
      link: t('projects.project3.link'),
    },
  ];

  return (
    <section id="projects" className="py-20 bg-white dark:bg-gray-900 text-[var(--color-text-primary)]">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-16 text-center">
          <span className="text-[var(--color-primary)]">{t('projects.title')}</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.key}
              className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-[var(--color-primary)] transition-all hover:shadow-2xl hover:-translate-y-2 duration-300"
            >
              <div className="p-8 h-full flex flex-col">
                <div className="text-gray-400 dark:text-gray-500 mb-4 hover:text-[var(--color-primary)] transition-colors">{projectIconMap[project.key]}</div>
                <h3 className="text-xl font-bold mb-3 text-[var(--color-primary)]">{project.name}</h3>
                <p className="text-[var(--color-text-secondary)] mb-6 flex-grow">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[var(--color-primary)]/15 dark:bg-[var(--color-primary)]/25 text-[var(--color-primary)] dark:text-white rounded-full text-xs font-semibold border border-[var(--color-primary)]/40 dark:border-[var(--color-primary)]/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-[var(--color-primary)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  {t('projects.viewMore')}
                  <FiExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <a
            href="https://github.com/zer0sh?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            {t('projects.viewAll')}
            <FiExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
