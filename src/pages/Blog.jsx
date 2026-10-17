import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiTag, FiClock, FiArrowRight } from 'react-icons/fi';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { SiDiscord } from 'react-icons/si';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AnimatedNetwork } from '../components/AnimatedNetwork';

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
  const [hoveredPost, setHoveredPost] = useState(null);

  const backLabel = 'Inicio';

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
        }
      } catch (error) {
        console.error('Error loading posts:', error);
      }
    };

    loadPosts();
  }, []);

  const handlePostClick = (post) => {
    setSelectedPost(post);
    window.scrollTo(0, 0);
  };

  const handleBackClick = () => {
    setSelectedPost(null);
    window.scrollTo(0, 0);
  };

  const categoryColors = {
    'DevOps': { bg: 'from-orange-500 to-red-500', text: 'bg-orange-500' },
    'Ciberseguridad': { bg: 'from-red-500 to-pink-500', text: 'bg-red-500' },
    'Desarrollo': { bg: 'from-blue-500 to-cyan-500', text: 'bg-blue-500' },
    'General': { bg: 'from-purple-500 to-indigo-500', text: 'bg-purple-500' },
  };

  const getCategoryStyle = (category) => {
    return categoryColors[category] || categoryColors['General'];
  };

  if (selectedPost) {
    const readingTime = calculateReadingTime(selectedPost.content);
    
    return (
      <div className="min-h-screen bg-[#05000a] py-8 px-4">
        <AnimatedNetwork primaryColor="255, 45, 173" secondaryColor="0, 229, 255" />
        <div className="max-w-5xl mx-auto relative z-10">
          <button
            onClick={handleBackClick}
            className="inline-flex items-center gap-2 text-[#9080b0] hover:text-[#ff2dad] transition-all duration-300 mb-10 group"
          >
            <div className="p-2 rounded-full bg-[#12002e] group-hover:bg-[#ff2dad] group-hover:text-white transition-colors border border-[#2a1050]">
              <FiArrowLeft className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Volver al blog</span>
          </button>
          
          <article className="relative">
            <div className="absolute -top-4 -left-4 -right-4 h-32 bg-gradient-to-r from-[#ff2dad] to-[#00e5ff] opacity-5 rounded-3xl -z-10"></div>
            
            <div className="bg-[#0b0020]/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-[#2a1050] shadow-[#ff2dad]/10">
              <header className="mb-10 pb-8 border-b border-[#2a1050]">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-white text-xs font-semibold rounded-full shadow-lg ${getCategoryStyle(selectedPost.category).text}`}>
                    <FiTag className="w-3 h-3" />
                    {selectedPost.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-[#9080b0]">
                    <FiCalendar className="w-4 h-4" />
                    {selectedPost.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-[#9080b0]">
                    <FiClock className="w-4 h-4" />
                    {readingTime} min de lectura
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black text-[#e0d0ff] mb-4 leading-tight">
                  {selectedPost.title}
                </h1>
                
                
              </header>
              
              {selectedPost.coverImage && (
                <div className="mb-10 rounded-2xl overflow-hidden shadow-xl border border-[#2a1050]">
                  <img
                    src={selectedPost.coverImage}
                    alt={selectedPost.coverAlt || selectedPost.title}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              
              {(() => {
                const headings = extractHeadings(selectedPost.content);
                if (headings.length < 2) return null;
                return (
                  <div className="mb-10 p-6 bg-[#12002e] rounded-2xl border border-[#2a1050]">
                    <h3 className="text-sm font-bold text-[#ff2dad] uppercase tracking-wider mb-4">
                      Tabla de contenido
                    </h3>
                    <nav className="space-y-2">
                      {headings.map((h) => (
                        <button
                          key={h.id}
                          onClick={() => document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' })}
                          className={`block text-left text-sm transition-colors hover:text-[#00e5ff] ${
                            h.level === 3 ? 'ml-4 text-[#9080b0]' : 'font-medium text-[#e0d0ff]'
                          }`}
                        >
                          {h.text}
                        </button>
                      ))}
                    </nav>
                  </div>
                );
              })()}

              <div className="prose prose-lg max-w-none text-[#c0b0d0]
                prose-headings:font-black prose-headings:text-[#e0d0ff]
                prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                prose-p:text-[#c0b0d0] prose-p:leading-loose prose-p:text-lg
                prose-a:text-[#ff2dad] prose-a:no-underline hover:prose-a:underline hover:prose-a:text-[#00e5ff] prose-a:font-medium
                prose-strong:text-[#e0d0ff] prose-strong:font-bold
                prose-ul:prose-li:text-[#c0b0d0] prose-li:text-lg
                prose-ol:prose-li:text-[#c0b0d0] prose-li:text-lg
                prose-code:text-[#ff2dad] prose-code:bg-[#12002e] prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:text-sm prose-code:font-bold
                prose-pre:bg-[#05000a] prose-pre:text-[#c0b0d0] prose-pre:rounded-2xl prose-pre:p-6 prose-pre:shadow-xl prose-pre:border prose-pre:border-[#2a1050]
                prose-blockquote:border-l-4 prose-blockquote:border-[#ff2dad] prose-blockquote:bg-gradient-to-r prose-blockquote:from-[#12002e] prose-blockquote:to-transparent prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:italic
                prose-hr:border-[#2a1050] prose-hr:my-12
                prose-headings:mb-4 prose-p:mb-6">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    img: ({ src, alt, title }) => (
                      <figure className="my-8">
                        <img
                          src={src}
                          alt={alt}
                          title={title}
                          className="rounded-2xl shadow-xl border border-[#2a1050] w-full h-auto"
                          loading="lazy"
                        />
                        {title && (
                          <figcaption className="text-center text-sm text-[var(--color-text-secondary)] mt-3 italic">
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
              
              
            </div>
          </article>

          <footer className="mt-12 bg-[#05000a] text-[#c0b0d0] py-8 rounded-2xl border border-[#2a1050]">
            <div className="px-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h4 className="text-xl font-bold text-[#ff2dad]">zer0sh</h4>
                  <p className="text-[#9080b0] text-sm mt-1">DevOps & Backend Engineer</p>
                </div>
                <div className="flex gap-6">
                  <a href="https://github.com/zer0sh" target="_blank" rel="noopener noreferrer" className="text-[#9080b0] hover:text-[#00e5ff] transition-colors" title="GitHub">
                    <FaGithub className="w-6 h-6" />
                  </a>
                  <a href="https://www.linkedin.com/in/steven-munozl" target="_blank" rel="noopener noreferrer" className="text-[#9080b0] hover:text-[#00e5ff] transition-colors" title="LinkedIn">
                    <FaLinkedin className="w-6 h-6" />
                  </a>
                  <a href="https://discord.com/users/stephem.dev" target="_blank" rel="noopener noreferrer" className="text-[#9080b0] hover:text-[#00e5ff] transition-colors" title="Discord">
                    <SiDiscord className="w-6 h-6" />
                  </a>
                  <a href="https://www.instagram.com/zer0sh.dev" target="_blank" rel="noopener noreferrer" className="text-[#9080b0] hover:text-[#00e5ff] transition-colors" title="Instagram">
                    <FaInstagram className="w-6 h-6" />
                  </a>
                </div>
              </div>
              <div className="border-t border-[#2a1050] mt-6 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-[#9080b0] text-sm">&copy; {new Date().getFullYear()} Steven Munoz &mdash; Copyleft</p>
                <p className="text-[#9080b0] text-sm">Hecho con React y Tailwind</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-background)] via-white to-[var(--color-background)] dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-16 px-4">
      <AnimatedNetwork />
      <div className="max-w-5xl mx-auto relative z-10">
        <Link
          to="/es"
          className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-all duration-300 mb-12 group"
        >
          <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
            <FiArrowLeft className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium">{backLabel}</span>
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-[var(--color-text-primary)] mb-6 tracking-tight">
            Blog
          </h1>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-[var(--color-text-secondary)] font-medium">
              DevOps, Ciberseguridad y Desarrollo
            </p>
          </div>
        </div>

        <div className="grid gap-8">
          {posts.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          ) : (
            posts.map((post, index) => {
              const readingTime = calculateReadingTime(post.content);
              const isHovered = hoveredPost === post.slug;
              const categoryStyle = getCategoryStyle(post.category);
              
              return (
                <article
                  key={post.slug}
                  onClick={() => handlePostClick(post)}
                  onMouseEnter={() => setHoveredPost(post.slug)}
                  onMouseLeave={() => setHoveredPost(null)}
                  className={`relative group cursor-pointer transition-all duration-500 ${isHovered ? 'transform -translate-y-2' : ''}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500 -z-10"></div>
                  
                  <div className={`relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/50 dark:border-gray-700/50 shadow-xl transition-all duration-500 ${isHovered ? 'shadow-2xl border-[var(--color-primary)]/30' : ''}`}>
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-white text-xs font-bold rounded-full shadow-md ${categoryStyle.text}`}>
                            <FiTag className="w-3 h-3" />
                            {post.category}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] bg-gray-100 dark:bg-gray-700/50 px-3 py-1 rounded-full">
                            <FiCalendar className="w-3.5 h-3.5" />
                            {post.date}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] bg-gray-100 dark:bg-gray-700/50 px-3 py-1 rounded-full">
                            <FiClock className="w-3.5 h-3.5" />
                            {readingTime} min
                          </span>
                        </div>
                        
                        <h2 className={`text-2xl md:text-3xl font-bold mb-4 transition-colors duration-300 ${isHovered ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]'}`}>
                          {post.title}
                        </h2>
                        
                        <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed mb-6">
                          {post.excerpt}
                        </p>
                        
                        <div className={`flex items-center gap-3 font-bold transition-all duration-500 ${isHovered ? 'text-[var(--color-primary)] translate-x-2' : 'text-[var(--color-text-secondary)]'}`}>
                          <span>Leer artículo</span>
                          <FiArrowRight className={`w-5 h-5 transform transition-transform duration-300 ${isHovered ? 'translate-x-2' : ''}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50">
            <span className="text-2xl">📝</span>
            <p className="text-[var(--color-text-secondary)]">
              {posts.length} {posts.length === 1 ? 'articulo publicado' : 'articulos publicados'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};