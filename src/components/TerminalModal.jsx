import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const BANNER = `
  ______ ______ _____   ____   _____ _    _ 
 |___  /|  ____|  __ \\ / __ \\ / ____| |  | |
    / / | |__  | |__) | |  | | (___ | |__| |
   / /  |  __| |  _  /| |  | |\\___ \\|  __  |
  / /__ | |____| | \\ \\| |__| |____) | |  | |
 /_____|______| _|  \\_\\\\____/|_____/|_|  |_|
  OPERATIONAL RELIABILITY TERMINAL // v2.4.0
  Type 'help' to view available system routines.
`;

const COMMANDS = {
  help: 'Display all available terminal commands and utilities',
  whoami: 'Print operator identity, background, and doctrine',
  uptime: 'Show current cluster uptime metrics and session duration',
  projects: 'List registered engineering systems and lab repositories',
  skills: 'List infrastructure, observability, and systems stack',
  dispatches: 'List published field notes and incident analyses',
  status: 'Query live pipeline telemetry status and health probe',
  theme: 'Inspect Direction J telemetry design tokens',
  clear: 'Clear terminal screen buffer',
  exit: 'Close this interactive terminal session',
};

export const TerminalModal = ({ isOpen, onClose }) => {
  const { lang } = useLanguage();
  const [history, setHistory] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [cmdHistory, setCmdHistory] = useState([]);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const sessionStartTime = useRef(Date.now());
  const navigate = useNavigate();

  // Initialize terminal on open
  useEffect(() => {
    if (isOpen) {
      if (history.length === 0) {
        setHistory([
          { type: 'banner', text: BANNER },
          { type: 'system', text: "Terminal initialized on tty1. Type 'help' for available commands." },
        ]);
      }
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, history.length]);

  // Auto-scroll on new content
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Global escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const getSessionUptime = () => {
    const elapsedSec = Math.floor((Date.now() - sessionStartTime.current) / 1000);
    const mins = Math.floor(elapsedSec / 60);
    const secs = elapsedSec % 60;
    return `${mins}m ${secs}s`;
  };

  const handleCommand = (rawCmd) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    // Save to command history
    setCmdHistory((prev) => [...prev, cmd]);
    setHistoryIdx(-1);

    const parts = cmd.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const newEntries = [{ type: 'command', text: cmd }];

    switch (mainCmd) {
      case 'help': {
        const lines = Object.entries(COMMANDS).map(
          ([k, v]) => `  ${k.padEnd(14, ' ')} : ${v}`
        );
        newEntries.push({
          type: 'output',
          text: `AVAILABLE ROUTINES:\n${lines.join('\n')}\n\nTip: You can also use Vim keys (j/k) to navigate the portfolio.`,
        });
        break;
      }

      case 'whoami': {
        newEntries.push({
          type: 'output',
          text: [
            'OPERATOR: Steven Muñoz (zer0sh)',
            'ROLE:     Site Reliability Engineer & Platform Engineer',
            'LOCATION: Colombia',
            'FOCUS:    Kubernetes, Cloud Infrastructure, High-Reliability Systems, Observability',
            'DOCTRINE: "Systems must be observable, predictable, and resilient by design."',
          ].join('\n'),
        });
        break;
      }

      case 'uptime': {
        newEntries.push({
          type: 'output',
          text: [
            'CLUSTER AVAILABILITY : 99.99%',
            `SESSION UPTIME       : ${getSessionUptime()}`,
            'WORKFLOW HEALTH      : NOMINAL (GitHub Actions Probe)',
            'CONTAINER RUNTIME   : Docker / K3s (Active)',
            'STATUS               : ZERO_INCIDENTS_REPORTED',
          ].join('\n'),
        });
        break;
      }

      case 'projects': {
        newEntries.push({
          type: 'output',
          text: [
            'REGISTERED REPOSITORIES & LABS:',
            '  1. k3s-lab                      -> Production K3s GitOps cluster with ArgoCD & Prometheus',
            '  2. sunim-tui                    -> Async POSIX Terminal UI written in Rust',
            '  3. zer0sh-site-health-monitor   -> WordPress.org plugin & security vulnerability monitor',
            '  4. cms-local-envs               -> Hardened Docker Compose environments with CI/CD',
            '  5. gh-runner-selfhosted-docker  -> Ephemeral self-hosted GitHub Actions container runner',
            '  6. dotfiles                     -> Declarative Hyprland / Wayland POSIX environment',
            '',
            'Type "open <1-6>" or visit https://github.com/zer0sh to explore.',
          ].join('\n'),
        });
        break;
      }

      case 'open': {
        const num = parseInt(args[0], 10);
        const map = {
          1: 'https://github.com/zer0sh/k3s-lab',
          2: 'https://github.com/zer0sh/sunim-tui',
          3: 'https://github.com/zer0sh/zer0sh-site-health-monitor',
          4: 'https://github.com/zer0sh/cms-local-envs',
          5: 'https://github.com/zer0sh/gh-runner-selfhosted-docker',
          6: 'https://github.com/zer0sh/dotfiles',
        };
        if (map[num]) {
          window.open(map[num], '_blank');
          newEntries.push({ type: 'output', text: `Opening repository [${map[num]}] in a new tab...` });
        } else {
          newEntries.push({ type: 'error', text: 'Usage: open <1-6>. Type "projects" to view the index.' });
        }
        break;
      }

      case 'skills':
      case 'stack': {
        newEntries.push({
          type: 'output',
          text: [
            'CORE RELIABILITY STACK:',
            '  [INFRASTRUCTURE] : Kubernetes, K3s, Docker, Docker Compose, ArgoCD, Helm',
            '  [OBSERVABILITY]  : Prometheus, Grafana, Loki, Sentry, Metric Alerts, Log Aggregation',
            '  [SYSTEMS]        : Linux Administration (Debian/Ubuntu), POSIX Shell, Bash, Rust, Wayland',
            '  [RELIABILITY]    : GitHub Actions, Trivy Scanning, NGINX Upstream, PostgreSQL, SSL/TLS',
          ].join('\n'),
        });
        break;
      }

      case 'dispatches':
      case 'blog': {
        const postsList = lang === 'es'
          ? [
              '  - Docker y entornos estandarizados: Evitando el "en mi máquina funcionaba"',
              '  - Automatizaciones tradicionales vs Automatizaciones con IA',
              '  - GitHub Actions: Guía de uso, dependencias y runbooks con criterio humano',
              '  - Análisis forense de un OOMKilled en Kubernetes',
              '  - Post-Mortem: Caída de resolución DNS interna en alta demanda',
            ]
          : [
              '  - Standardized Docker Environments: Eradicating "Works On My Machine"',
              '  - Traditional Automation vs AI-Driven Workflows',
              '  - GitHub Actions: Production Runbooks & Human-Centered Guardrails',
              '  - Forensic Analysis of Kubernetes OOMKilled Containers',
              '  - Post-Mortem: Internal DNS Resolution Degradation Under High Load',
            ];

        newEntries.push({
          type: 'output',
          text: [
            'LATEST SRE FIELD NOTES:',
            ...postsList,
            '',
            lang === 'es' ? 'Redirigiendo a /blog en 1 segundo...' : 'Redirecting to /blog in 1 second...',
          ].join('\n'),
        });
        setTimeout(() => {
          onClose();
          navigate('/blog');
        }, 1200);
        break;
      }

      case 'status': {
        newEntries.push({
          type: 'output',
          text: [
            'TELEMETRY PROBE STATUS: OK',
            'DNS RESOLUTION:         LATENCY 12ms // NOMINAL',
            'SSL CERTIFICATE:        VALID // EXPIRY 82 DAYS',
            'DEPLOYMENT TARGET:      GitHub Pages (zer0sh.github.io)',
            'DIRECTION J INTEGRITY:  100% PURE CSS // ZERO SVG TOLERATED',
          ].join('\n'),
        });
        break;
      }

      case 'theme': {
        newEntries.push({
          type: 'output',
          text: [
            'DIRECTION J COLOR MATRIX:',
            '  GROUND COAL     : #07080b',
            '  PRIMARY WHITE   : #ffffff',
            '  TELEMETRY GREEN : #10b981',
            '  DUSK SLATE      : #64748b',
            '  ALERT VERMILION : #ef4444',
            '  GHOST CARBON    : #131722',
            '  LEDGER SURFACE  : #0c0e14',
          ].join('\n'),
        });
        break;
      }

      case 'clear': {
        setHistory([]);
        setInputVal('');
        return;
      }

      case 'exit': {
        onClose();
        return;
      }

      case 'sudo': {
        newEntries.push({
          type: 'error',
          text: "Permission denied: user 'guest' is not in sudoers file. Incident logged in /var/log/antigravity.log",
        });
        break;
      }

      case 'matrix': {
        newEntries.push({
          type: 'output',
          text: [
            '01010011 01010010 01000101 00100000 01010011 01011001 01010011 01010100 01000101 01001101',
            '01001111 01010000 01000101 01010010 01000001 01010100 01001001 01001111 01001110 01000001',
            '01001100 00100000 01010010 01000101 01001100 01001001 01000001 01000010 01001100 01000101',
            'SYSTEM IS SECURE // DIRECTION J RESILIENCY VERIFIED.',
          ].join('\n'),
        });
        break;
      }

      default: {
        newEntries.push({
          type: 'error',
          text: `Command not recognized: "${cmd}". Type "help" to view available routines.`,
        });
        break;
      }
    }

    setHistory((prev) => [...prev, ...newEntries]);
    setInputVal('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const nextIdx = historyIdx + 1;
        if (nextIdx < cmdHistory.length) {
          setHistoryIdx(nextIdx);
          setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInputVal('');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Interactive SRE Terminal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-3xl h-[85vh] max-h-[640px] bg-[#07080b] border-2 border-[#131722] shadow-[0_12px_40px_rgba(0,0,0,0.9)] flex flex-col font-mono text-xs sm:text-sm text-white overflow-hidden">
        {/* Terminal Header Bar */}
        <div className="bg-[#0c0e14] border-b border-[#131722] px-4 py-2.5 flex items-center justify-between select-none shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-[#10b981] font-bold tracking-wider uppercase text-xs">
              zer0sh-sre-cli // tty1
            </span>
            <span className="text-[#64748b] text-xs hidden sm:inline">
              [POSIX / BASH COMPLIANT]
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-[#64748b] hidden sm:inline">ESC to exit</span>
            <button
              onClick={onClose}
              className="text-[#64748b] hover:text-[#ef4444] transition-colors px-1 font-bold"
              aria-label="Close terminal"
            >
              [X]
            </button>
          </div>
        </div>

        {/* Terminal Screen Buffer */}
        <div
          className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3 leading-relaxed text-[#d1d5db] select-text"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((entry, idx) => {
            if (entry.type === 'banner') {
              return (
                <pre
                  key={idx}
                  className="font-mono text-[0.62rem] sm:text-xs text-[#10b981] leading-tight select-none overflow-x-auto whitespace-pre"
                >
                  {entry.text}
                </pre>
              );
            }
            if (entry.type === 'command') {
              return (
                <div key={idx} className="flex items-center gap-2 text-white">
                  <span className="text-[#10b981] font-bold">zer0sh@sre:~$</span>
                  <span className="text-white">{entry.text}</span>
                </div>
              );
            }
            if (entry.type === 'error') {
              return (
                <div key={idx} className="text-[#ef4444] whitespace-pre-wrap pl-4 border-l border-[#ef4444]/40">
                  {entry.text}
                </div>
              );
            }
            return (
              <div key={idx} className="text-[#cbd5e1] whitespace-pre-wrap pl-4 border-l border-[#131722]">
                {entry.text}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Prompt Input Line */}
        <div className="bg-[#0c0e14] border-t border-[#131722] p-3 sm:p-4 flex items-center gap-2 shrink-0">
          <span className="text-[#10b981] font-bold shrink-0">zer0sh@sre:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type 'help' for routines..."
            spellCheck="false"
            autoComplete="off"
            className="flex-1 bg-transparent text-white font-mono text-xs sm:text-sm focus:outline-none placeholder:text-[#64748b]/50"
          />
          <button
            onClick={() => handleCommand(inputVal)}
            className="text-xs uppercase font-mono px-2 py-1 bg-[#131722] text-[#10b981] hover:bg-[#10b981] hover:text-[#07080b] transition-colors"
          >
            [ENTER]
          </button>
        </div>
      </div>
    </div>
  );
};
