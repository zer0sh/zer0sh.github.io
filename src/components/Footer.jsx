import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { SiDiscord } from 'react-icons/si';

export const Footer = () => {
  const { t } = useLanguage();

  const buildTag = process.env.REACT_APP_BUILD_TAG || 'dev';
  const buildCommit = process.env.REACT_APP_BUILD_COMMIT || 'local';
  const commitUrl = `https://github.com/zer0sh/zer0sh.github.io/commit/${buildCommit}`;

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const quickLinks = ['about', 'skills', 'projects', 'contact'];

  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-8 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="text-xl font-bold text-[var(--color-primary)] mb-4">zer0sh</h4>
            <p className="text-gray-400">DevOps & Backend Engineer</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              {quickLinks.map((id) => (
                <li key={id}>
                  <button
                    onClick={() => scrollToSection(id)}
                    className="capitalize hover:text-[var(--color-primary)] transition-colors"
                  >
                    {id}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Social</h4>
            <div className="flex gap-6">
              <a href="https://github.com/zer0sh" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors" title="GitHub">
                <FaGithub className="w-6 h-6" />
              </a>
              <a href="https://www.linkedin.com/in/steven-munozl" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors" title="LinkedIn">
                <FaLinkedin className="w-6 h-6" />
              </a>
              <a href="https://discord.com/users/stephem.dev" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors" title="Discord">
                <SiDiscord className="w-6 h-6" />
              </a>
              <a href="https://www.instagram.com/zer0sh.dev" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors" title="Instagram">
                <FaInstagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">{t('footer.copyright')}</p>
          <p className="text-gray-400 text-sm">{t('footer.madewith')}</p>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-800 flex justify-center">
          <a
            href={commitUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 text-xs hover:text-[var(--color-primary)] transition-colors font-mono"
            title="Commit de este build"
          >
            build {buildTag} · {buildCommit}
          </a>
        </div>
      </div>
    </footer>
  );
};
