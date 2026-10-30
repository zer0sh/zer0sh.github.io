import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from '../context/LanguageContext';

const README_CACHE = {};

const CodeSnippet = ({ children }) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);

  const handleCopy = () => {
    const text = codeRef.current?.innerText || '';
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative group my-4 border border-[#131722] bg-[#050608]">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#0a0c12] border-b border-[#131722] text-[0.7rem] font-mono text-[#64748b] select-none">
        <span className="uppercase tracking-wider">TERMINAL // BUFFER OUTPUT</span>
        <button
          onClick={handleCopy}
          className="text-[#10b981] hover:text-white transition-colors uppercase tracking-wider px-2 py-0.5 border border-[#131722] hover:border-[#10b981] font-mono text-[0.68rem]"
        >
          {copied ? '[COPIED!]' : '[COPY]'}
        </button>
      </div>
      <div ref={codeRef} className="p-3.5 overflow-x-auto font-mono text-xs text-[#e2e8f0] leading-relaxed">
        {children}
      </div>
    </div>
  );
};

export const ProjectReadmeModal = ({ isOpen, onClose, repoName, projectTitle }) => {
  const { lang } = useLanguage();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sourceStatus, setSourceStatus] = useState('IDLE');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !repoName) return;

    if (README_CACHE[repoName]) {
      setContent(README_CACHE[repoName]);
      setSourceStatus('CACHE_HIT');
      setLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);
    setSourceStatus('FETCHING');

    const fetchReadme = async () => {
      try {
        // First try raw github user content (direct, fastest, no API rate limit)
        const rawRes = await fetch(
          `https://raw.githubusercontent.com/zer0sh/${repoName}/main/README.md`
        );
        if (rawRes.ok) {
          const text = await rawRes.text();
          if (isMounted) {
            README_CACHE[repoName] = text;
            setContent(text);
            setSourceStatus('GITHUB_RAW');
            setLoading(false);
          }
          return;
        }

        // Fallback to GitHub API
        const apiRes = await fetch(
          `https://api.github.com/repos/zer0sh/${repoName}/readme`,
          {
            headers: {
              Accept: 'application/vnd.github.raw+json',
            },
          }
        );

        if (apiRes.ok) {
          const text = await apiRes.text();
          if (isMounted) {
            README_CACHE[repoName] = text;
            setContent(text);
            setSourceStatus('GITHUB_API');
            setLoading(false);
          }
          return;
        }

        throw new Error(`HTTP ${apiRes.status}`);
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch specification buffer');
          setLoading(false);
          setSourceStatus('ERROR');
        }
      }
    };

    fetchReadme();

    return () => {
      isMounted = false;
    };
  }, [isOpen, repoName]);

  if (!isOpen) return null;

  const githubUrl = `https://github.com/zer0sh/${repoName}`;
  const rawGithubUrl = `https://raw.githubusercontent.com/zer0sh/${repoName}/main/README.md`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-4xl max-h-[88vh] flex flex-col bg-[#07080b] border-2 border-[#131722] shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden">
        {/* Titlebar / Terminal HUD Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#0a0c12] border-b border-[#131722] font-mono text-xs select-none">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
            <span className="ml-2 text-white font-bold tracking-wider uppercase">
              SPEC // zer0sh/{repoName}/README.md
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] text-[0.68rem] tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              {sourceStatus}
            </span>

            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#64748b] hover:text-[#10b981] transition-colors uppercase tracking-wider text-[0.72rem] hidden sm:inline-flex items-center gap-1"
            >
              <span>{lang === 'es' ? 'VER EN REPO' : 'VIEW IN REPO'}</span>
              <span>&rarr;</span>
            </a>

            <button
              onClick={onClose}
              className="text-[#64748b] hover:text-[#ef4444] transition-colors font-bold tracking-wider px-2 py-0.5 border border-transparent hover:border-[#ef4444]/40"
              aria-label="Close modal"
            >
              [ESC / CLOSE]
            </button>
          </div>
        </div>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          {loading && (
            <div className="py-20 flex flex-col items-center justify-center font-mono text-xs text-[#10b981] space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
                <span>$ git fetch-remote --stream zer0sh/{repoName}:README.md</span>
              </div>
              <p className="text-[#64748b] text-[0.72rem]">
                {lang === 'es'
                  ? 'Consultando y formateando especificación en tiempo real...'
                  : 'Retrieving and parsing raw markdown specification buffer...'}
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="p-6 border border-[#ef4444]/40 bg-[#ef4444]/5 font-mono text-xs text-white">
              <p className="text-[#ef4444] font-bold uppercase tracking-wider mb-2">
                [!] ERROR RETRIEVING SPECIFICATION BUFFER
              </p>
              <p className="text-[#8e99a8] mb-4">
                {lang === 'es'
                  ? 'No fue posible cargar el README directamente desde GitHub. Puedes inspeccionarlo en el repositorio web:'
                  : 'Unable to stream raw README directly. You can inspect it directly on GitHub:'}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#10b981] text-[#07080b] font-bold uppercase hover:bg-white transition-colors"
                >
                  {lang === 'es' ? 'ABRIR EN GITHUB' : 'OPEN IN GITHUB'} &rarr;
                </a>
                <a
                  href={rawGithubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 border border-[#131722] text-[#64748b] hover:text-white transition-colors uppercase"
                >
                  RAW URL
                </a>
              </div>
            </div>
          )}

          {!loading && !error && content && (
            <div className="prose prose-invert max-w-none text-[#d1d5db]
              prose-headings:text-white prose-headings:font-extrabold prose-headings:tracking-[-0.02em]
              prose-h1:text-2xl sm:prose-h1:text-3xl prose-h1:border-b prose-h1:border-[#131722] prose-h1:pb-3 prose-h1:mb-6
              prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-[#10b981]
              prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-[#94a3b8] prose-p:leading-[1.7] prose-p:mb-4 prose-p:text-sm sm:prose-p:text-base
              prose-a:text-[#10b981] prose-a:no-underline hover:prose-a:underline
              prose-code:text-[#10b981] prose-code:bg-[#0c0e14] prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-xs
              prose-blockquote:border-l-2 prose-blockquote:border-[#10b981] prose-blockquote:text-[#8e99a8] prose-blockquote:italic
              prose-ul:text-[#94a3b8] prose-li:my-1 prose-li:text-sm sm:prose-li:text-base
              prose-table:border prose-table:border-[#131722] prose-th:bg-[#0a0c12] prose-th:text-[#10b981] prose-th:p-2 prose-td:p-2 prose-td:border-t prose-td:border-[#131722]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  pre: ({ children }) => <CodeSnippet>{children}</CodeSnippet>,
                  img: ({ src, alt }) => (
                    <img
                      src={src}
                      alt={alt || 'Specification asset'}
                      className="max-w-full h-auto border border-[#131722] my-4"
                      loading="lazy"
                    />
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Footer Status Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#050608] border-t border-[#131722] font-mono text-[0.7rem] text-[#64748b]">
          <div className="flex items-center gap-2">
            <span className="text-[#10b981] font-bold uppercase">{projectTitle}</span>
            <span>{'//'}</span>
            <span>SPEC_VIEWER v1.0</span>
          </div>
          <div>
            <span>[ESC] TO EXIT</span>
          </div>
        </div>
      </div>
    </div>
  );
};
