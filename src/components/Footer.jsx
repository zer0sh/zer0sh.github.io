import React from 'react';

export const Footer = () => {

  const buildCommit = process.env.REACT_APP_BUILD_COMMIT || 'main';
  const commitUrl = `https://github.com/zer0sh/zer0sh.github.io/commit/${buildCommit}`;

  return (
    <footer className="mt-20 border-t border-[#131722] py-14 font-mono text-[0.78rem] tracking-[0.08em] uppercase text-[#64748b]">
      <div className="max-w-[1250px] mx-auto px-6 sm:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <span>OPERATOR</span>
          <span className="block text-white mt-1">Steven Muñoz</span>
        </div>
        <div>
          <span>SOURCE CODE</span>
          <a
            href="https://github.com/zer0sh/zer0sh.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-white hover:text-[#10b981] mt-1 transition-colors"
          >
            github.com/zer0sh
          </a>
        </div>
        <div>
          <span>LINKEDIN</span>
          <a
            href="https://linkedin.com/in/steven-munozl"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-white hover:text-[#10b981] mt-1 transition-colors"
          >
            steven-munozl
          </a>
        </div>
        <div>
          <span>STATUS</span>
          <a
            href={commitUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-[#10b981] hover:text-white mt-1 transition-colors"
          >
            BUILD // {buildCommit.slice(0, 7)} · 99.99%
          </a>
        </div>
      </div>
    </footer>
  );
};
