import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const About = () => {
  const { t, lang } = useLanguage();

  return (
    <section id="about" className="py-24 sm:py-32">
      {/* Kicker */}
      <p className="font-mono text-[0.78rem] tracking-[0.3em] uppercase text-[#ef4444] mb-4">
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
            {lang === 'es' ? '// ESQUEMA: CICLO OPERATIVO SRE Y RESOLUCIÓN' : '// SCHEMATIC: SRE OPERATIONAL & RESOLUTION LOOP'}
          </span>
          <span className="hidden sm:inline text-[#1e2433]">ID: PROTOCOL.SRE.LOOP_01</span>
        </div>

        <div className="bg-[#0c0e14] border border-[#131722] p-4 sm:p-5 overflow-x-auto text-[0.68rem] sm:text-[0.78rem] font-mono leading-relaxed text-[#10b981]">
          <pre className="whitespace-pre m-0">
{`+-- SRE RELIABILITY & OPERATIONAL LOOP ---------------------------------------------+
|                                                                                   |
|  [TELEMETRY & LOG STREAMS]                                                        |
|         |                                                                         |
|         +--> [PROACTIVE ANOMALY DETECTION] ---> [PREVENTIVE HARDENING]            |
|         |                                              |                          |
|         v                                              v                          |
|  [HOT INCIDENT (P1)] ---> [LIVE RUNBOOK TRIAGE] ---> [ROOT CAUSE ANALYSIS (RCA)]  |
|                                                              |                    |
|                                                              v                    |
|  [TOIL ELIMINATION] <--- [ARGOCD & GITHUB ACTIONS] <--- [AUTOMATED REMEDIATION]   |
|                                                                                   |
+-----------------------------------------------------------------------------------+`}
          </pre>
        </div>

        {/* Operational Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4 font-mono text-[0.74rem]">
          <div className="bg-[#0c0e14] border border-[#131722] p-3.5 flex flex-col gap-1">
            <span className="text-[#64748b] tracking-wider uppercase">{lang === 'es' ? 'DETECCIÓN TEMPRANA' : 'PROACTIVE TRIAGE'}</span>
            <span className="text-white font-bold text-sm tracking-tight">
              {lang === 'es' ? '> 85% TELEMETRÍA' : '> 85% TELEMETRY'}
            </span>
          </div>
          <div className="bg-[#0c0e14] border border-[#131722] p-3.5 flex flex-col gap-1">
            <span className="text-[#64748b] tracking-wider uppercase">{lang === 'es' ? 'RESOLUCIÓN P1' : 'P1 MTTR TARGET'}</span>
            <span className="text-[#10b981] font-bold text-sm tracking-tight">&lt; 15 MIN HOT TRIAGE</span>
          </div>
          <div className="bg-[#0c0e14] border border-[#131722] p-3.5 flex flex-col gap-1">
            <span className="text-[#64748b] tracking-wider uppercase">{lang === 'es' ? 'DESPLIEGUES' : 'DELIVERY TOPOLOGY'}</span>
            <span className="text-white font-bold text-sm tracking-tight">GITOPS // ARGOCD</span>
          </div>
          <div className="bg-[#0c0e14] border border-[#131722] p-3.5 flex flex-col gap-1">
            <span className="text-[#64748b] tracking-wider uppercase">{lang === 'es' ? 'PRESUPUESTO TOIL' : 'TOIL REDUCTION'}</span>
            <span className="text-[#10b981] font-bold text-sm tracking-tight">
              {lang === 'es' ? 'AUTOMATIZACIÓN CI/CD' : 'CI/CD AUTOMATION'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
