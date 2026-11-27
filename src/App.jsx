import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Blog } from './pages/Blog';
import { Landings } from './pages/Landings';
import { LandingDemoRouter } from './pages/landings/LandingDemoRouter';
import { NotFound } from './pages/NotFound';
import { TerminalModal } from './components/TerminalModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { CursorSpotlight } from './components/CursorSpotlight';
import './index.css';

const LanguageSyncer = () => {
  const location = useLocation();
  const { changeLang, lang: currentCtxLang } = useLanguage();

  useEffect(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const routeLang = pathParts[0];
    const isBlog = location.pathname.includes('/blog');
    const isLandings = location.pathname.includes('/landings');

    if (routeLang === 'es' || routeLang === 'en') {
      changeLang(routeLang);
    }

    const effectiveLang = routeLang === 'es' || routeLang === 'en' ? routeLang : currentCtxLang;

    if (isLandings) {
      document.title = 'Steven Muñoz // Galería de Landings (Zero Edition)';
    } else if (isBlog) {
      document.title =
        effectiveLang === 'es'
          ? 'Steven Muñoz // Notas de Campo SRE & Artículos'
          : 'Steven Muñoz // SRE Field Notes & Articles';
    } else {
      document.title =
        effectiveLang === 'es'
          ? 'Steven Muñoz // zer0sh — Ingeniero de Fiabilidad de Sitios (SRE)'
          : 'Steven Muñoz // zer0sh — Site Reliability Engineer';
    }
  }, [location.pathname, changeLang, currentCtxLang]);

  return null;
};

const LanguageWrapper = ({ isTerminalOpen, setIsTerminalOpen, isShortcutsOpen, setIsShortcutsOpen }) => {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const lang = pathParts[0];

  const validLangs = ['en', 'es'];
  if (!validLangs.includes(lang)) {
    return <Navigate to="/404" replace />;
  }

  return (
    <LanguageContent
      currentLang={lang}
      isTerminalOpen={isTerminalOpen}
      setIsTerminalOpen={setIsTerminalOpen}
      isShortcutsOpen={isShortcutsOpen}
      setIsShortcutsOpen={setIsShortcutsOpen}
    />
  );
};

const LanguageContent = ({
  currentLang,
  isTerminalOpen,
  setIsTerminalOpen,
  isShortcutsOpen,
  setIsShortcutsOpen,
}) => {
  const { changeLang } = useLanguage();

  React.useEffect(() => {
    changeLang(currentLang);
  }, [currentLang, changeLang]);

  return (
    <div className="min-h-screen bg-[#07080b] text-white">
      <Navbar
        currentLang={currentLang}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />
      <Home isModalOpen={isTerminalOpen || isShortcutsOpen} />
      <Footer />
    </div>
  );
};

const ConditionalSpotlight = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/landings')) return null;
  return <CursorSpotlight />;
};

export default function App() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Global key bindings for Terminal (~) and Shortcuts (?)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      } else if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <ConditionalSpotlight />
          <LanguageSyncer />
          <Routes>
            <Route path="/" element={<Navigate to="/en" replace />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/landings" element={<Landings />} />
            <Route path="/landings/:slug" element={<LandingDemoRouter />} />
            <Route
              path="/:lang"
              element={
                <LanguageWrapper
                  isTerminalOpen={isTerminalOpen}
                  setIsTerminalOpen={setIsTerminalOpen}
                  isShortcutsOpen={isShortcutsOpen}
                  setIsShortcutsOpen={setIsShortcutsOpen}
                />
              }
            />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
          <TerminalModal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
          <ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}