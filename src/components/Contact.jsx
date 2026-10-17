import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Contact = () => {
  const { t } = useLanguage();

  const channels = [
    {
      key: 'github',
      label: 'GitHub',
      value: 'github.com/zer0sh',
      href: 'https://github.com/zer0sh',
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      value: 'linkedin.com/in/steven-munozl',
      href: 'https://www.linkedin.com/in/steven-munozl',
    },
    {
      key: 'discord',
      label: 'Discord',
      value: 'stephem.dev',
      href: 'https://discord.com/users/stephem.dev',
    },
    {
      key: 'email',
      label: 'Email',
      value: 'steven.jm357@gmail.com',
      href: 'mailto:steven.jm357@gmail.com',
    },
  ];

  return (
    <section id="contact" className="py-24 sm:py-32">
      {/* Kicker */}
      <p className="font-mono text-[0.75rem] tracking-[0.3em] uppercase text-[#ef4444] mb-4">
        {t('contact.kicker')}
      </p>

      <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-[-0.03em] leading-tight text-white uppercase mb-3">
        {t('contact.title')}
      </h2>

      <p className="text-[#64748b] text-base sm:text-lg mb-16 sm:mb-20 max-w-[50ch]">
        {t('contact.description')}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {channels.map((ch) => (
          <a
            key={ch.key}
            href={ch.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-[#10b981] mb-1">
              {ch.label}
            </p>
            <p className="text-lg font-bold text-white group-hover:text-[#10b981] transition-colors break-all">
              {ch.value}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
};
