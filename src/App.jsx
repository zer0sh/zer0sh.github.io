import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Blog } from './pages/Blog';
import { TerminalModal } from './components/TerminalModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import './index.css';

const BlogPage = () => {
  return (
    <LanguageProvider>
      <Blog />
    </LanguageProvider>
  );
};

const LanguageWrapper = ({ isTerminalOpen, setIsTerminalOpen, isShortcutsOpen, setIsShortcutsOpen }) => {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const lang = pathParts[0];

  const validLangs = ['en', 'es'];
  const currentLang = validLangs.includes(lang) ? lang : 'en';

  return (
    <LanguageProvider>
      <LanguageContent
        currentLang={currentLang}
        isTerminalOpen={isTerminalOpen}
        setIsTerminalOpen={setIsTerminalOpen}
        isShortcutsOpen={isShortcutsOpen}
        setIsShortcutsOpen={setIsShortcutsOpen}
      />
    </LanguageProvider>
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
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/en" replace />} />
          <Route path="/blog" element={<BlogPage />} />
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
        </Routes>
        <TerminalModal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
        <ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
      </Router>
    </ThemeProvider>
  );
}