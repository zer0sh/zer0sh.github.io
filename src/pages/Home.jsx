import React, { useEffect, useRef } from 'react';
import { Hero } from '../components/Hero';
import { Projects } from '../components/Projects';
import { DailyOperations } from '../components/DailyOperations';
import { DayInTheLife } from '../components/DayInTheLife';
import { Work } from '../components/Work';
import { TechStack } from '../components/TechStack';
import { About } from '../components/About';
import { Dispatches } from '../components/Dispatches';
import { Contact } from '../components/Contact';
import { Minimap } from '../components/Minimap';

export const Home = ({ isModalOpen }) => {
  const lastKeyTime = useRef(0);
  const lastKey = useRef('');

  useEffect(() => {
    const sections = [
      'hero',
      'projects',
      'operations',
      'routine',
      'disciplines',
      'stack',
      'about',
      'dispatches',
      'contact',
    ];

    const getCurrentSectionIndex = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && scrollPos >= el.offsetTop) {
          return i;
        }
      }
      return 0;
    };

    const scrollToSection = (id) => {
      if (id === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    const handleKeyDown = (e) => {
      // Don't intercept if typing in input/textarea or if modal is open
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || isModalOpen) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key;
      const now = Date.now();

      // Vim: 'j' or ArrowDown -> next section
      if (key === 'j' || key === 'ArrowDown') {
        e.preventDefault();
        const currentIdx = getCurrentSectionIndex();
        if (currentIdx < sections.length - 1) {
          scrollToSection(sections[currentIdx + 1]);
        }
      }
      // Vim: 'k' or ArrowUp -> previous section
      else if (key === 'k' || key === 'ArrowUp') {
        e.preventDefault();
        const currentIdx = getCurrentSectionIndex();
        if (currentIdx > 0) {
          scrollToSection(sections[currentIdx - 1]);
        }
      }
      // Vim: 'g g' -> jump to top
      else if (key === 'g') {
        if (lastKey.current === 'g' && now - lastKeyTime.current < 500) {
          e.preventDefault();
          scrollToSection('hero');
          lastKey.current = '';
          return;
        }
        lastKey.current = 'g';
        lastKeyTime.current = now;
      }
      // Vim: 'G' (Shift+G) -> jump to bottom (contact)
      else if (key === 'G') {
        e.preventDefault();
        scrollToSection('contact');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  return (
    <>
      <Minimap />
      <main className="max-w-[1250px] mx-auto px-6 sm:px-8">
        <Hero />
        <Projects />
        <DailyOperations />
        <DayInTheLife />
        <Work />
        <TechStack />
        <About />
        <Dispatches />
        <Contact />
      </main>
    </>
  );
};
