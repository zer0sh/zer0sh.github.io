import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const Navbar = ({ currentLang, onOpenTerminal, onOpenShortcuts }) => {
  const { t, changeLang } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLanguageSwitch = (newLang) => {
    changeLang(newLang);
    navigate(`/${newLang}`);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#07080b]/90 backdrop-blur-md border-b border-[#131722]">
      <div className="max-w-[1250px] mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to={`/${currentLang}`}
            className="text-xl sm:text-2xl font-extrabold tracking-tight text-white hover:text-[#10b981] transition-colors"
          >
            zer0sh
          </Link>
        </div>

        {/* Desktop Links - Minimal Essentials */}
        <div className="hidden md:flex items-center gap-7 font-mono text-[0.84rem] uppercase tracking-[0.1em] text-[#64748b]">
          <button
            onClick={() => scrollToSection('projects')}
            className="hover:text-white transition-colors"
          >
            {t('nav.projects')}
          </button>
          <Link
            to="/blog"
            className="hover:text-white transition-colors"
          >
            {t('nav.blog')}
          </Link>
          <button
            onClick={() => scrollToSection('contact')}
            className="hover:text-white transition-colors"
          >
            {t('nav.contact')}
          </button>
        </div>

        {/* Actions Cluster: CLI / Shortcuts / Language Switcher */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* SRE Terminal & Shortcuts Triggers */}
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs">
            <button
              onClick={onOpenTerminal}
              className="px-2 py-0.5 bg-[#0c0e14] border border-[#131722] hover:border-[#10b981] text-[#10b981] hover:text-white transition-colors cursor-pointer"
              title={currentLang === 'es' ? "Abrir consola SRE (~ o `)" : "Open SRE terminal (~ or `)"}
            >
              [CLI]
            </button>
            <button
              onClick={onOpenShortcuts}
              className="px-1.5 py-0.5 text-[#64748b] hover:text-white transition-colors cursor-pointer"
              title={currentLang === 'es' ? "Guía de atajos de teclado (?)" : "Keyboard shortcuts guide (?)"}
            >
              [?]
            </button>
          </div>

          {/* Language Switcher */}
          <div className="font-mono text-xs sm:text-[0.82rem] tracking-wider flex items-center gap-1.5">
            <button
              onClick={() => handleLanguageSwitch('en')}
              className={`px-2 py-0.5 rounded transition-colors ${
                currentLang === 'en'
                  ? 'text-white font-bold'
                  : 'text-[#64748b] hover:text-white'
              }`}
            >
              EN
            </button>
            <span className="text-[#1e2433]">/</span>
            <button
              onClick={() => handleLanguageSwitch('es')}
              className={`px-2 py-0.5 rounded transition-colors ${
                currentLang === 'es'
                  ? 'text-white font-bold'
                  : 'text-[#64748b] hover:text-white'
              }`}
            >
              ES
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-[#64748b] hover:text-white p-2 font-mono text-sm"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? '[X]' : '[MENU]'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#07080b] border-b border-[#131722] px-6 py-6 font-mono text-sm uppercase tracking-wider flex flex-col gap-4 text-[#64748b]">
          <button
            onClick={() => scrollToSection('projects')}
            className="text-left hover:text-white"
          >
            {t('nav.projects')}
          </button>
          <button
            onClick={() => scrollToSection('operations')}
            className="text-left hover:text-white"
          >
            {t('nav.operations')}
          </button>
          <button
            onClick={() => scrollToSection('routine')}
            className="text-left hover:text-white"
          >
            {t('nav.routine')}
          </button>
          <button
            onClick={() => scrollToSection('disciplines')}
            className="text-left hover:text-white"
          >
            {t('nav.architecture')}
          </button>
          <button
            onClick={() => scrollToSection('stack')}
            className="text-left hover:text-white"
          >
            {t('nav.systems')}
          </button>
          <Link
            to="/blog"
            onClick={() => setIsMenuOpen(false)}
            className="text-left hover:text-white"
          >
            {t('nav.blog')}
          </Link>
          <button
            onClick={() => scrollToSection('contact')}
            className="text-left hover:text-white"
          >
            {t('nav.contact')}
          </button>
          <div className="pt-3 border-t border-[#131722] flex flex-col gap-3 text-xs">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onOpenTerminal?.();
              }}
              className="text-left text-[#10b981] hover:text-white"
            >
              {currentLang === 'es' ? '[CLI] Consola Terminal SRE' : '[CLI] SRE Terminal Console'}
            </button>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onOpenShortcuts?.();
              }}
              className="text-left text-[#64748b] hover:text-white"
            >
              {currentLang === 'es' ? '[?] Atajos de Teclado' : '[?] Keyboard Shortcuts'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
