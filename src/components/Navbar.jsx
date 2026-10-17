import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ThemeToggle } from './ThemeToggle';
import { FiUser, FiCode, FiFolder, FiMail, FiMenu, FiX, FiChevronDown, FiExternalLink, FiBook } from 'react-icons/fi';

export const Navbar = ({ currentLang }) => {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navIconMap = {
    about: <FiUser className="w-4 h-4" />,
    skills: <FiCode className="w-4 h-4" />,
    projects: <FiFolder className="w-4 h-4" />,
    blog: <FiBook className="w-4 h-4" />,
    contact: <FiMail className="w-4 h-4" />,
  };

  const otherLang = currentLang === 'en' ? 'es' : 'en';
  const navItems = [
    { key: 'about', label: t('nav.about'), id: 'about' },
    { key: 'skills', label: t('nav.skills'), id: 'skills' },
    { key: 'projects', label: t('nav.projects'), id: 'projects' },
    { key: 'blog', label: t('nav.blog'), path: '/blog', external: true },
    { key: 'contact', label: t('nav.contact'), id: 'contact' },
  ];

  const othersLinks = [
    { label: 'DevOps', path: '/blog' },
    { label: 'Ciberseguridad', path: '/blog' },
    { label: 'Desarrollo', path: '/blog' },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false); // Cerrar menú después de hacer click
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-[var(--color-background)] border-b border-gray-200 dark:border-[var(--color-border)] backdrop-blur-sm bg-opacity-95">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to={`/${currentLang}`} className="text-2xl font-bold text-[var(--color-primary)] hover:opacity-80">
            zer0sh
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              item.path ? (
                <Link
                  key={item.key}
                  to={item.external ? item.path : `/${currentLang}${item.path}`}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-[var(--color-primary)] transition-colors"
                >
                  {navIconMap[item.key]}
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.key}
                  onClick={() => scrollToSection(item.id)}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-[var(--color-primary)] transition-colors"
                >
                  {navIconMap[item.key]}
                  {item.label}
                </button>
              )
            ))}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-[var(--color-primary)] transition-colors"
              >
                {t('nav.others')}
                <FiChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50">
                  {othersLinks.map((link, index) => (
                    <Link
                      key={index}
                      to={link.path}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[var(--color-primary)] transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FiExternalLink className="w-3 h-3" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right side - Theme toggle and language */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              to={`/${otherLang}`}
              className="px-3 py-1 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {otherLang.toUpperCase()}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 text-gray-700 dark:text-gray-300 hover:text-[var(--color-primary)] transition-colors"
            >
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            {navItems.map((item) => (
              item.path ? (
                <Link
                  key={item.key}
                  to={item.external ? item.path : `/${currentLang}${item.path}`}
                  className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-[var(--color-primary)] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {navIconMap[item.key]}
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ) : (
                <button
                  key={item.key}
                  onClick={() => { scrollToSection(item.id); setIsMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-[var(--color-primary)] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {navIconMap[item.key]}
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              )
            ))}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
              <div className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">{t('nav.others')}</div>
              {othersLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-[var(--color-primary)] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiExternalLink className="w-4 h-4" />
                  <span className="text-sm font-medium">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
