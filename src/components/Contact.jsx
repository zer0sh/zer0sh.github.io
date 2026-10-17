import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FiMail, FiArrowRight } from 'react-icons/fi';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { SiDiscord } from 'react-icons/si';

export const Contact = () => {
  const { t } = useLanguage();

  const iconMap = {
    email: <FiMail className="w-16 h-16" />,
    discord: <SiDiscord className="w-16 h-16" />,
    linkedin: <FaLinkedin className="w-16 h-16" />,
    github: <FaGithub className="w-16 h-16" />,
  };

  const contactLinks = [
    {
      key: 'email',
      label: t('contact.email'),
      href: 'mailto:zer0sh@protonmail.ch',
      description: 'For professional inquiries and business proposals',
      badge: 'Response within 24h',
    },
    {
      key: 'discord',
      label: t('contact.discord'),
      href: 'https://discord.com/users/stephem.dev',
      description: 'Quick chats, tech discussions, and real-time collaboration',
      badge: 'Usually online',
    },
    {
      key: 'linkedin',
      label: t('contact.linkedin'),
      href: 'https://www.linkedin.com/in/steven-munozl',
      description: 'Connect professionally and follow my journey',
      badge: 'Always open',
    },
    {
      key: 'github',
      label: t('contact.github'),
      href: 'https://github.com/zer0sh',
      description: 'Check out my projects and contributions',
      badge: 'View code',
    },
  ];

  return (
    <section id="contact" className="py-20 bg-[var(--color-background)] text-[var(--color-text-primary)] relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-bold mb-4 text-center">
          <span className="text-[var(--color-primary)]">{t('contact.title')}</span>
        </h2>
        <p className="text-xl text-center text-[var(--color-text-secondary)] mb-16 max-w-3xl mx-auto">
          {t('contact.description')}
        </p>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {contactLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 shadow-md"
            >
              {/* Background with gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 group-hover:border-[var(--color-primary)] transition-colors duration-300 rounded-xl"></div>

              {/* Animated glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10"></div>

              {/* Content - Horizontal Layout */}
              <div className="relative p-6 h-full flex items-start gap-5">
                {/* Icon Container - Left Side */}
                <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 group-hover:from-[var(--color-primary)]/20 group-hover:to-[var(--color-accent)]/20 transition-all duration-300 group-hover:scale-110 mt-1">
                  <div className="text-[var(--color-primary)] group-hover:text-[var(--color-primary)] transition-colors duration-300">
                    {iconMap[link.key]}
                  </div>
                </div>

                {/* Content - Right Side */}
                <div className="flex-grow min-w-0 flex flex-col justify-between">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-bold text-[var(--color-primary)] leading-tight">
                      {link.label}
                    </h3>
                    <FiArrowRight className="w-4 h-4 text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 mt-1" />
                  </div>

                  {/* Description */}
                  <p className="text-[var(--color-text-secondary)] mb-3 text-xs leading-relaxed">
                    {link.description}
                  </p>

                  {/* Badge */}
                  <div className="inline-flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full group-hover:animate-pulse"></div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:text-[var(--color-primary)] transition-colors duration-300">
                      {link.badge}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
