import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const About = () => {
  const { t, lang } = useLanguage();

  return (
    <section id="about" className="py-24 sm:py-32">
      {/* Kicker */}
      <p className="font-mono text-[0.78rem] tracking-[0.3em] uppercase text-[#10b981] mb-4">
        {t('about.kicker')}
      </p>

      <h2 className="text-[clamp(2.15rem,4vw,3.3rem)] font-extrabold tracking-[-0.03em] leading-tight text-white uppercase mb-10 sm:mb-14">
        {t('about.title')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14">
        <p className="text-[1.12rem] sm:text-[1.22rem] leading-[1.62] text-white">
          {t('about.description')}
        </p>
        <p className="text-[1.04rem] leading-[1.65] text-[#cbd5e1]">
          {t('about.experience')}
        </p>
      </div>

      {/* SRE Operational Architecture Schematic */}
      <div className="mt-12 sm:mt-16">
        <div className="flex items-center justify-between mb-3 font-mono text-[0.74rem] uppercase tracking-[0.2em] text-[#64748b]">
          <span className="text-[#10b981] font-bold">
            {lang === 'es' ? '// CÓMO ABORDO LOS PROBLEMAS: DE LA ALERTA A LA SOLUCIÓN' : '// HOW I APPROACH PROBLEMS: FROM ALERT TO FIX'}
          </span>
        </div>

        <div className="bg-[#0c0e14] border border-[#131722] p-4 sm:p-5 overflow-x-auto text-[0.68rem] sm:text-[0.78rem] font-mono leading-relaxed text-[#10b981]">
          <pre className="whitespace-pre m-0">
{lang === 'es'
? `+-- CÓMO ABORDO LOS PROBLEMAS EN PRODUCCIÓN -----------------------------------------+
|                                                                                   |
|  [MÉTRICAS Y LOGS EN VIVO]                                                        |
|         |                                                                         |
|         +--> [PREVENCIÓN TEMPRANA] ---------> [AJUSTES ANTES DE QUE SE ROMPA]     |
|         |                                              |                          |
|         v                                              v                          |
|  [ALERTA O INCIDENTE] -------> [REVISAR CON CALMA] -> [ENCONTRAR LA CAUSA REAL]   |
|                                                              |                    |
|                                                              v                    |
|  [MENOS TRABAJO MANUAL] <----- [GITOPS Y CI/CD] <---- [AUTOMATIZAR LA SOLUCIÓN]   |
|                                                                                   |
+-----------------------------------------------------------------------------------+`
: `+-- HOW I APPROACH PROBLEMS IN PRODUCTION ------------------------------------------+
|                                                                                   |
|  [REAL-TIME METRICS & LOGS]                                                       |
|         |                                                                         |
|         +--> [EARLY ANOMALY DETECTION] -----> [PREVENTIVE HARDENING]              |
|         |                                              |                          |
|         v                                              v                          |
|  [LIVE INCIDENT / ALERT] ----> [CALM INVESTIGATION] -> [FINDING THE ROOT CAUSE]   |
|                                                              |                    |
|                                                              v                    |
|  [NO REPETITIVE TOIL] <------- [GITOPS & CI/CD] <----- [AUTOMATE THE FIX]         |
|                                                                                   |
+-----------------------------------------------------------------------------------+`}
          </pre>
        </div>
      </div>
    </section>
  );
};
