import React from 'react';
import { Hero } from '../components/Hero';
import { Projects } from '../components/Projects';
import { DailyOperations } from '../components/DailyOperations';
import { DayInTheLife } from '../components/DayInTheLife';
import { Work } from '../components/Work';
import { TechStack } from '../components/TechStack';
import { About } from '../components/About';
import { Dispatches } from '../components/Dispatches';
import { Contact } from '../components/Contact';

export const Home = () => {
  return (
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
  );
};

