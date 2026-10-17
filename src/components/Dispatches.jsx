import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const Dispatches = () => {
  const { t } = useLanguage();

  const posts = [
    {
      title: t('dispatches.post1.title'),
      tag: t('dispatches.post1.tag'),
      desc: t('dispatches.post1.description'),
      slug: t('dispatches.post1.slug'),
    },
    {
      title: t('dispatches.post2.title'),
      tag: t('dispatches.post2.tag'),
      desc: t('dispatches.post2.description'),
      slug: t('dispatches.post2.slug'),
    },
    {
      title: t('dispatches.post3.title'),
      tag: t('dispatches.post3.tag'),
      desc: t('dispatches.post3.description'),
      slug: t('dispatches.post3.slug'),
    },
  ];

  const postMeta = [
    {
      code: 'DISPATCH.01',
      metric: 'INCIDENT // P1 POSTMORTEM',
      meta: 'SOMAXCONN · NGINX 502',
    },
    {
      code: 'DISPATCH.02',
      metric: 'INTERNALS // POSIX KERNEL',
      meta: 'FORK/EXEC · SUBSHELL MEMORY',
    },
    {
      code: 'DISPATCH.03',
      metric: 'ADVISORY // CVE-2026-9860',
      meta: 'CVSS 8.8 · PROACTIVE HARDENING',
    },
  ];

  return (
    <section id="dispatches" className="py-24 sm:py-32">
      {/* Kicker */}
      <p className="font-mono text-[0.78rem] tracking-[0.3em] uppercase text-[#ef4444] mb-4">
        {t('dispatches.kicker')}
      </p>

      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-14 sm:mb-18">
        <div>
          <h2 className="text-[clamp(2.15rem,4vw,3.3rem)] font-extrabold tracking-[-0.03em] leading-tight text-white uppercase mb-2">
            {t('dispatches.title')}
          </h2>
          <p className="text-[#64748b] text-base sm:text-[1.05rem]">
            {t('dispatches.subtitle')}
          </p>
        </div>

        <Link
          to="/blog"
          className="font-mono text-xs sm:text-[0.82rem] uppercase tracking-[0.2em] text-[#10b981] hover:text-white transition-colors shrink-0"
        >
          {t('nav.blog')} &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {posts.map((post, index) => {
          const meta = postMeta[index];
          return (
            <article
              key={index}
              className="border border-[#131722] hover:border-[#10b981]/50 bg-[#0c0e14]/50 p-6 flex flex-col justify-between transition-colors group"
            >
              <div>
                {/* Dispatch Header Strip */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#131722] font-mono text-[0.7rem]">
                  <span className="font-bold text-[#10b981] tracking-[0.15em]">
                    {meta.code}
                  </span>
                  <span className="text-[#ef4444] font-semibold tracking-wider uppercase">
                    {post.tag}
                  </span>
                </div>

                <Link
                  to={`/blog?post=${post.slug}`}
                  className="block group-hover:text-[#10b981] transition-colors"
                >
                  <h3 className="text-xl sm:text-[1.32rem] font-extrabold tracking-tight text-white group-hover:text-[#10b981] transition-colors mb-2.5">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-[0.98rem] leading-[1.62] text-[#cbd5e1] mb-5">
                  {post.desc}
                </p>
              </div>

              {/* Bottom Telemetry Strip & Read Action */}
              <div className="pt-3 border-t border-[#131722]/80 font-mono text-[0.7rem] flex items-center justify-between gap-2">
                <span className="text-[#64748b] tracking-wider uppercase truncate">
                  {meta.meta}
                </span>
                <Link
                  to={`/blog?post=${post.slug}`}
                  className="text-[#10b981] font-bold uppercase tracking-wider hover:text-white transition-colors shrink-0"
                >
                  [ {t('dispatches.readArticle') || 'READ'} &#8599; ]
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
