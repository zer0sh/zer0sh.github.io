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

  const channelMeta = {
    github: {
      protocol: 'PROTOCOL // GIT-SSH',
      status: '25+ REPOSITORIES',
      dotBg: 'bg-[#10b981]',
    },
    linkedin: {
      protocol: 'NETWORK // SRE B2B',
      status: 'AVAILABLE // ROLES',
      dotBg: 'bg-[#38bdf8]',
    },
    discord: {
      protocol: 'SOCKET // WS-TLS',
      status: 'DIRECT CHAT',
      dotBg: 'bg-[#10b981]',
    },
    email: {
      protocol: 'DISPATCH // SMTP-PGP',
      status: 'DIRECT INBOX',
      dotBg: 'bg-[#ef4444]',
    },
  };

  return (
    <section id="contact" className="py-24 sm:py-32">
      {/* Kicker */}
      <p className="font-mono text-[0.78rem] tracking-[0.3em] uppercase text-[#ef4444] mb-4">
        {t('contact.kicker')}
      </p>

      <h2 className="text-[clamp(2.15rem,4vw,3.3rem)] font-extrabold tracking-[-0.03em] leading-tight text-white uppercase mb-3">
        {t('contact.title')}
      </h2>

      <p className="text-[#64748b] text-base sm:text-[1.05rem] mb-14 sm:mb-18 max-w-[54ch]">
        {t('contact.description')}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {channels.map((ch) => {
          const meta = channelMeta[ch.key];
          return (
            <a
              key={ch.key}
              href={ch.href}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#131722] hover:border-[#10b981] bg-[#0c0e14]/50 p-5 sm:p-6 flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#131722] font-mono text-[0.7rem]">
                  <span className="text-[#64748b] tracking-wider uppercase font-semibold">
                    {meta.protocol}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${meta.dotBg}`} />
                  </div>
                </div>

                <p className="font-mono text-[0.76rem] font-bold uppercase tracking-[0.2em] text-[#10b981] mb-1.5">
                  {ch.label}
                </p>
                <p className="text-lg sm:text-[1.12rem] font-extrabold text-white group-hover:text-[#10b981] transition-colors break-all">
                  {ch.value}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#131722]/80 font-mono text-[0.68rem] text-[#64748b] flex items-center justify-between">
                <span className="tracking-wider uppercase">{meta.status}</span>
                <span className="text-[#10b981] font-bold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform inline-block">
                  [ &#8599; ]
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};
