import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Blog } from './pages/Blog';
import './index.css';

const BlogPage = () => {
  return (
    <LanguageProvider>
      <Blog />
    </LanguageProvider>
  );
};

const LanguageWrapper = () => {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const lang = pathParts[0];

  const validLangs = ['en', 'es'];
  const currentLang = validLangs.includes(lang) ? lang : 'en';

  return (
    <LanguageProvider>
      <LanguageContent currentLang={currentLang} />
    </LanguageProvider>
  );
};

const LanguageContent = ({ currentLang }) => {
  const { changeLang } = useLanguage();

  React.useEffect(() => {
    changeLang(currentLang);
  }, [currentLang, changeLang]);

  return (
    <div className="min-h-screen bg-[#07080b] text-white">
      <Navbar currentLang={currentLang} />
      <Home />
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/en" replace />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/:lang" element={<LanguageWrapper />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}