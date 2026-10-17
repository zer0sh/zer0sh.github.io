import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export const WorkflowTelemetry = () => {
  const { lang } = useLanguage();
  const [telemetry, setTelemetry] = useState({
    rate: '99.0',
    total: 100,
    successful: 99,
    runs: [],
    isLive: false,
    lastRunName: 'Deploy to GitHub Pages',
  });

  useEffect(() => {
    let isMounted = true;

    const fetchLiveTelemetry = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/zer0sh/zer0sh.github.io/actions/runs?per_page=100');
        if (response.ok) {
          const data = await response.json();
          const runs = data.workflow_runs || [];
          const completed = runs.filter((r) => r.status === 'completed');
          const successful = completed.filter((r) => r.conclusion === 'success').length;
          const total = completed.length || runs.length;
          const rate = total > 0 ? ((successful / total) * 100).toFixed(1) : '99.0';

          if (isMounted) {
            setTelemetry({
              rate,
              total,
              successful,
              runs: runs.slice(0, 28),
              isLive: true,
              lastRunName: runs[0]?.name || 'Deploy to GitHub Pages',
            });
          }
          return;
        }
      } catch (err) {
        // Fallback below
      }

      // Fallback to local snapshot
      try {
        const localRes = await fetch('/telemetry.json');
        if (localRes.ok) {
          const fallback = await localRes.json();
          if (isMounted) {
            setTelemetry({
              rate: fallback.successRate.toFixed(1),
              total: fallback.totalRuns,
              successful: fallback.successfulRuns,
              runs: fallback.recentRuns.slice(0, 28),
              isLive: false,
              lastRunName: fallback.recentRuns[0]?.name || 'Deploy to GitHub Pages',
            });
          }
        }
      } catch (e) {
        // Silent
      }
    };

    fetchLiveTelemetry();

    return () => {
      isMounted = false;
    };
  }, []);

  const probeLabel = lang === 'es' ? 'SONDA TELEMETRÍA CI/CD' : 'CI/CD TELEMETRY PROBE';
  const runsLabel = lang === 'es' ? 'ÚLTIMAS EJECUCIONES' : 'RECENT RUNS';
  const successLabel = lang === 'es' ? 'DISPONIBILIDAD' : 'SUCCESS RATE';

  return (
    <div className="bg-[#0c0e14] border border-[#131722] p-4 sm:p-5 max-w-2xl my-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[0.72rem] tracking-wider mb-3 pb-2.5 border-b border-[#131722]">
        <div className="flex items-center gap-2 text-[#10b981]">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          <span className="uppercase font-bold">{probeLabel}</span>
          <span className="text-[#64748b]">
            [{telemetry.isLive ? 'LIVE' : 'CACHED'}]
          </span>
        </div>
        <div className="text-[#64748b] text-[0.7rem]">
          GITHUB_ACTIONS // zer0sh.github.io
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <span className="font-mono text-xs text-[#64748b] uppercase tracking-wider block mb-1">
            {successLabel}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
              {telemetry.rate}%
            </span>
            <span className="font-mono text-xs text-[#10b981]">
              ({telemetry.successful}/{telemetry.total})
            </span>
          </div>
        </div>

        {/* Micro Visual Status Bar */}
        <div>
          <span className="font-mono text-[0.7rem] text-[#64748b] uppercase tracking-wider block mb-1.5 sm:text-right">
            {runsLabel} ({telemetry.runs.length || 28})
          </span>
          <div className="flex items-center gap-1 flex-wrap">
            {(telemetry.runs.length > 0
              ? telemetry.runs
              : Array.from({ length: 28 }, (_, i) => ({
                  conclusion: i === 19 ? 'failure' : 'success',
                  name: 'Workflow Execution',
                }))
            ).map((run, idx) => {
              const isSuccess = run.conclusion === 'success';
              const isFailure = run.conclusion === 'failure';
              const isInProgress = run.status === 'in_progress';

              const barColor = isSuccess
                ? 'bg-[#10b981] hover:bg-emerald-400'
                : isFailure
                ? 'bg-[#ef4444] hover:bg-red-400'
                : isInProgress
                ? 'bg-[#38bdf8] animate-pulse'
                : 'bg-[#64748b]';

              return (
                <span
                  key={idx}
                  title={`${run.name || 'Workflow'}: ${run.conclusion || run.status || 'success'}`}
                  className={`w-1.5 h-4 sm:h-5 rounded-[1px] transition-colors cursor-pointer ${barColor}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="font-mono text-[0.68rem] text-[#64748b] flex items-center justify-between pt-2 border-t border-[#131722]">
        <span>
          {lang === 'es' ? 'Último workflow' : 'Last run'}: <span className="text-white">{telemetry.lastRunName}</span>
        </span>
        <span className="text-[#10b981]">
          {telemetry.rate >= 95 ? 'STATUS: NOMINAL' : 'STATUS: DEGRADED'}
        </span>
      </div>
    </div>
  );
};
