import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Footer } from '../components/Footer';

const calculateReadingTime = (content) => {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
};

const slugify = (text) =>
  text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

const extractHeadings = (content) => {
  const regex = /^(#{2,3})\s+(.+)$/gm;
  const headings = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    headings.push({ level: match[1].length, text: match[2], id: slugify(match[2]) });
  }
  return headings;
};

export const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const listResponse = await fetch('/blog-posts/index.json');
        if (listResponse.ok) {
          const { posts: postList } = await listResponse.json();
          
          const postsWithContent = [];
          for (const post of postList) {
            const contentResponse = await fetch(`/blog-posts/${post.slug}.md`);
            if (contentResponse.ok) {
              const content = await contentResponse.text();
              const frontmatter = content.match(/^---\n([\s\S]*?)\n---/);
              const extract = (key) => {
                const m = frontmatter?.[1]?.match(new RegExp(`^${key}:\\s*"([^"]+)"`, 'm'));
                return m ? m[1] : null;
              };
              const cleanContent = content.replace(/^---[\s\S]*?---\n/, '');
              postsWithContent.push({
                ...post,
                content: cleanContent,
                coverImage: post.coverImage || extract('coverImage'),
                coverAlt: post.coverAlt || extract('coverAlt'),
              });
            }
          }
          
          setPosts(postsWithContent);

          // If query param ?post=slug exists, open it directly
          const params = new URLSearchParams(location.search);
          const postSlug = params.get('post');
          if (postSlug) {
            const matched = postsWithContent.find((p) => p.slug === postSlug);
            if (matched) {
              setSelectedPost(matched);
            }
          }
        }
      } catch (error) {
        console.error('Error loading posts:', error);
      }
    };

    loadPosts();
  }, [location.search]);

  const handlePostClick = (post) => {
    setSelectedPost(post);
    window.scrollTo(0, 0);
  };

  const handleBackClick = () => {
    setSelectedPost(null);
    window.scrollTo(0, 0);
  };

  if (selectedPost) {
    const readingTime = calculateReadingTime(selectedPost.content);
    const headings = extractHeadings(selectedPost.content);

    return (
      <div className="min-h-screen bg-[#07080b] text-white pt-10 pb-20">
        <div className="max-w-[1000px] mx-auto px-6 sm:px-8">
          {/* Back Navigation */}
          <button
            onClick={handleBackClick}
            className="font-mono text-xs uppercase tracking-[0.2em] text-[#10b981] hover:text-white transition-colors mb-12 flex items-center gap-2"
          >
            <span>&larr;</span>
            <span>Volver a las notas de campo</span>
          </button>

          <article>
            <header className="mb-12">
              <div className="flex flex-wrap items-center gap-4 font-mono text-[0.75rem] uppercase tracking-[0.15em] mb-4">
                <span className="text-[#ef4444]">{selectedPost.category || 'ANALYSIS'}</span>
                <span className="text-[#64748b]">·</span>
                <span className="text-[#64748b]">{selectedPost.date}</span>
                <span className="text-[#64748b]">·</span>
                <span className="text-[#10b981]">{readingTime} MIN READ</span>
              </div>

              <h1 className="text-[clamp(2.4rem,5vw,4.2rem)] font-extrabold tracking-[-0.04em] leading-[1.0] text-white mb-6">
                {selectedPost.title}
              </h1>

              {selectedPost.excerpt && (
                <p className="text-xl leading-relaxed text-[#8e99a8] max-w-[48ch]">
                  {selectedPost.excerpt}
                </p>
              )}
            </header>

            {selectedPost.coverImage && (
              <div className="mb-12 overflow-hidden border border-[#131722]">
                <img
                  src={selectedPost.coverImage}
                  alt={selectedPost.coverAlt || selectedPost.title}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            )}

            {headings.length >= 2 && (
              <div className="mb-12 py-6 border-y border-[#131722]">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#ef4444] mb-3">
                  Tabla de Contenido
                </p>
                <nav className="space-y-1.5 font-mono text-sm">
                  {headings.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' })}
                      className={`block text-left text-[#8e99a8] hover:text-[#10b981] transition-colors ${
                        h.level === 3 ? 'ml-4 text-xs' : ''
                      }`}
                    >
                      # {h.text}
                    </button>
                  ))}
                </nav>
              </div>
            )}

            {/* Markdown Body */}
            <div className="prose prose-invert prose-lg max-w-none text-[#d1d5db]
              prose-headings:text-white prose-headings:font-extrabold prose-headings:tracking-[-0.03em]
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-[#d1d5db] prose-p:leading-[1.75] prose-p:mb-6
              prose-a:text-[#10b981] prose-a:no-underline hover:prose-a:underline
              prose-code:text-[#10b981] prose-code:bg-[#0e1118] prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm
              prose-pre:bg-[#0c0d12] prose-pre:border prose-pre:border-[#131722] prose-pre:text-[#e2e8f0] prose-pre:p-5 prose-pre:font-mono
              prose-blockquote:border-l-2 prose-blockquote:border-[#10b981] prose-blockquote:text-[#8e99a8] prose-blockquote:italic
              prose-ul:text-[#d1d5db] prose-li:mb-1">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  img: ({ src, alt, title }) => (
                    <figure className="my-8">
                      <img
                        src={src}
                        alt={alt}
                        title={title}
                        className="w-full h-auto border border-[#131722]"
                        loading="lazy"
                      />
                      {title && (
                        <figcaption className="text-center font-mono text-xs text-[#64748b] mt-2">
                          {title}
                        </figcaption>
                      )}
                    </figure>
                  ),
                  h2: ({ children, ...props }) => {
                    const text = children?.toString() || '';
                    return <h2 id={slugify(text)} {...props}>{children}</h2>;
                  },
                  h3: ({ children, ...props }) => {
                    const text = children?.toString() || '';
                    return <h3 id={slugify(text)} {...props}>{children}</h3>;
                  },
                }}
              >
                {selectedPost.content}
              </ReactMarkdown>
            </div>
          </article>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080b] text-white pt-12 pb-24">
      <div className="max-w-[1250px] mx-auto px-6 sm:px-8">
        {/* Navigation back */}
        <Link
          to="/"
          className="font-mono text-xs uppercase tracking-[0.2em] text-[#10b981] hover:text-white transition-colors mb-16 inline-flex items-center gap-2"
        >
          <span>&larr;</span>
          <span>Volver al inicio</span>
        </Link>

        {/* Section Header */}
        <div className="mb-20">
          <p className="font-mono text-[0.75rem] tracking-[0.3em] uppercase text-[#ef4444] mb-4">
            INCIDENT_ANALYSES // SRE_FIELD_NOTES
          </p>
          <h1 className="text-[clamp(2.8rem,6vw,4.8rem)] font-extrabold tracking-[-0.04em] leading-[0.95] text-white uppercase mb-4">
            Field Dispatches
          </h1>
          <p className="text-xl text-[#64748b] max-w-[48ch]">
            Artículos técnicos, investigación de incidentes en producción e ingeniería de sistemas.
          </p>
        </div>

        {/* Posts List */}
        <div className="grid row-gap-14 sm:row-gap-20">
          {posts.length === 0 ? (
            <div className="py-20 font-mono text-sm text-[#64748b]">
              CARGANDO REGISTRO DE DISPATCHES...
            </div>
          ) : (
            posts.map((post) => {
              const readingTime = calculateReadingTime(post.content);

              return (
                <article
                  key={post.slug}
                  onClick={() => handlePostClick(post)}
                  className="group cursor-pointer grid grid-cols-1 md:grid-cols-[14rem_1fr] gap-6"
                >
                  <div className="font-mono text-xs text-[#64748b] uppercase tracking-wider">
                    <p className="text-[#ef4444] mb-1">{post.category || 'DISPATCH'}</p>
                    <p>{post.date}</p>
                    <p className="text-[#10b981] mt-1">{readingTime} MIN READ</p>
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:text-[#10b981] transition-colors mb-2.5">
                      {post.title} &rarr;
                    </h2>
                    <p className="text-base sm:text-lg text-[#8e99a8] leading-relaxed max-w-[54ch]">
                      {post.excerpt}
                    </p>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};