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

  return (
    <section id="dispatches" className="py-24 sm:py-32">
      {/* Kicker */}
      <p className="font-mono text-[0.75rem] tracking-[0.3em] uppercase text-[#ef4444] mb-4">
        {t('dispatches.kicker')}
      </p>

      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-16 sm:mb-20">
        <div>
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-[-0.03em] leading-tight text-white uppercase mb-2">
            {t('dispatches.title')}
          </h2>
          <p className="text-[#64748b] text-base sm:text-lg">
            {t('dispatches.subtitle')}
          </p>
        </div>

        <Link
          to="/blog"
          className="font-mono text-xs uppercase tracking-[0.2em] text-[#10b981] hover:text-white transition-colors shrink-0"
        >
          {t('nav.blog')} &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {posts.map((post, index) => (
          <article key={index} className="flex flex-col">
            <span className="font-mono text-[0.72rem] uppercase tracking-[0.15em] text-[#ef4444] mb-2.5">
              {post.tag}
            </span>
            <Link
              to={`/blog?post=${post.slug}`}
              className="group"
            >
              <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-[#10b981] transition-colors mb-2.5">
                {post.title}
              </h3>
            </Link>
            <p className="text-[0.95rem] leading-[1.5] text-[#8e99a8]">
              {post.desc}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};
