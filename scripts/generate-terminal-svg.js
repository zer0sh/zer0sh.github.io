#!/usr/bin/env node

/**
 * Generador de Ilustraciones SVG de Terminal para el Blog
 * Uso rápido:
 *   node scripts/generate-terminal-svg.js --title "hostname" --cmd "cat /etc/nginx/..." --output public/blog-posts/images/demo.svg
 */

const fs = require('fs');
const path = require('path');

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

function generateTerminalSvg({
  title = 'bash',
  badge = 'TERMINAL',
  user = 'root',
  host = 'srv-prod',
  pathText = '/etc',
  command = 'uptime',
  lines = [],
  outputFile
}) {
  const lineHeight = 24;
  const topPadding = 110;
  const bottomPadding = 40;
  const contentHeight = Math.max(lines.length * lineHeight + topPadding + bottomPadding, 320);
  const width = 1100;

  const renderedLines = lines.map((line, idx) => {
    const lineNum = idx + 1;
    const y = topPadding + idx * lineHeight;
    let lineContent = '';

    if (typeof line === 'string') {
      lineContent = `<text x="15" y="${y}" class="text-param">${escapeXml(line)}</text>`;
    } else if (line.type === 'comment') {
      lineContent = `<text x="15" y="${y}" class="text-comment">${escapeXml(line.text)}</text>`;
    } else if (line.type === 'alert') {
      lineContent = `<text x="15" y="${y}" class="text-alert-comment">${escapeXml(line.text)}</text>`;
    } else if (line.spans) {
      const spansXml = line.spans.map(s => {
        const cls = s.cls || 'text-param';
        return `<tspan class="${cls}">${escapeXml(s.text)}</tspan>`;
      }).join('');
      lineContent = `<text x="${line.indent || 15}" y="${y}">${spansXml}</text>`;
    }

    return `    <text x="-15" y="${y}" class="text-line-num">${lineNum}</text>\n    ${lineContent}`;
  }).join('\n');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${contentHeight}" width="${width}" height="${contentHeight}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0d1117"/>
      <stop offset="100%" stop-color="#080a0f"/>
    </linearGradient>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#161b22"/>
      <stop offset="100%" stop-color="#0f141c"/>
    </linearGradient>
    <filter id="windowShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <style>
    .font-mono { font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace; }
    .text-title { font-size: 12px; fill: #94a3b8; font-weight: 600; letter-spacing: 0.05em; }
    .text-prompt-user { font-size: 13px; fill: #10b981; font-weight: bold; }
    .text-prompt-at { font-size: 13px; fill: #64748b; }
    .text-prompt-host { font-size: 13px; fill: #38bdf8; font-weight: bold; }
    .text-prompt-path { font-size: 13px; fill: #f59e0b; }
    .text-prompt-cmd { font-size: 13px; fill: #f1f5f9; }
    .text-line-num { font-size: 12px; fill: #475569; text-anchor: end; user-select: none; }
    .text-comment { font-size: 12.5px; fill: #64748b; font-style: italic; }
    .text-alert-comment { font-size: 12.5px; fill: #f87171; font-weight: bold; }
    .text-keyword { font-size: 12.5px; fill: #f43f5e; font-weight: 600; }
    .text-directive { font-size: 12.5px; fill: #38bdf8; }
    .text-param { font-size: 12.5px; fill: #e2e8f0; }
    .text-highlight { font-size: 12.5px; fill: #fbbf24; font-weight: bold; }
    .text-ip { font-size: 12.5px; fill: #ef4444; font-weight: bold; text-decoration: underline; }
    .text-var { font-size: 12.5px; fill: #a78bfa; }
    .text-semicolon { font-size: 12.5px; fill: #64748b; }
  </style>

  <!-- Ventana Exterior con Sombra -->
  <rect x="20" y="20" width="${width - 40}" height="${contentHeight - 40}" rx="10" fill="url(#bgGrad)" stroke="#1e293b" stroke-width="1.5" filter="url(#windowShadow)"/>

  <!-- Barra de Encabezado de la Ventana -->
  <path d="M 20 30 Q 20 20 30 20 L ${width - 30} 20 Q ${width - 20} 20 ${width - 20} 30 L ${width - 20} 62 L 20 62 Z" fill="url(#headerGrad)"/>
  <line x1="20" y1="62" x2="${width - 20}" y2="62" stroke="#1e293b" stroke-width="1"/>

  <!-- Botones de Control de Ventana (Rojo, Amarillo, Verde) -->
  <circle cx="44" cy="41" r="6" fill="#ef4444"/>
  <circle cx="64" cy="41" r="6" fill="#f59e0b"/>
  <circle cx="84" cy="41" r="6" fill="#10b981"/>

  <!-- Título Centrado -->
  <text x="${width / 2}" y="45" text-anchor="middle" class="font-mono text-title">${escapeXml(title)}</text>

  <!-- Badge en la Derecha -->
  <rect x="${width - 160}" y="32" width="120" height="20" rx="3" fill="#1e293b" stroke="#334155" stroke-width="1"/>
  <text x="${width - 100}" y="46" text-anchor="middle" class="font-mono" font-size="10" fill="#38bdf8" font-weight="bold" letter-spacing="0.1em">${escapeXml(badge)}</text>

  <!-- Contenido de Terminal -->
  <g class="font-mono" transform="translate(45, 95)">
    <!-- Prompt de Comandos -->
    <text x="0" y="0">
      <tspan class="text-prompt-user">${escapeXml(user)}</tspan>
      <tspan class="text-prompt-at">@</tspan>
      <tspan class="text-prompt-host">${escapeXml(host)}</tspan>
      <tspan class="text-prompt-at">:</tspan>
      <tspan class="text-prompt-path">${escapeXml(pathText)}</tspan>
      <tspan class="text-prompt-user">#</tspan>
      <tspan class="text-prompt-cmd"> ${escapeXml(command)}</tspan>
    </text>

    <!-- Líneas de salida / código -->
${renderedLines}
  </g>
</svg>
`;

  if (outputFile) {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, svg, 'utf8');
    console.log(`[OK] Ilustración generada con éxito en: ${outputFile}`);
  }

  return svg;
}

module.exports = { generateTerminalSvg };

// Ejecución directa de ejemplo
if (require.main === module) {
  const exampleFile = path.join(__dirname, '../public/blog-posts/images/ejemplo-terminal.svg');
  generateTerminalSvg({
    title: 'srv-demo — /etc/systemd/system/app.service',
    badge: 'SYSTEMD UNIT',
    user: 'root',
    host: 'srv-node-01',
    pathText: '/etc/systemd/system',
    command: 'cat app.service',
    lines: [
      { type: 'comment', text: '# Demostración de configuración de servicio' },
      { spans: [{ cls: 'text-keyword', text: '[Unit]' }] },
      { spans: [{ cls: 'text-directive', text: 'Description' }, { text: '=Demo Service Daemon' }] },
      { spans: [{ cls: 'text-directive', text: 'After' }, { text: '=network.target' }] },
      { type: 'comment', text: '' },
      { spans: [{ cls: 'text-keyword', text: '[Service]' }] },
      { spans: [{ cls: 'text-directive', text: 'Type' }, { text: '=simple' }] },
      { spans: [{ cls: 'text-directive', text: 'ExecStart' }, { cls: 'text-highlight', text: '=/usr/local/bin/demo-daemon' }] },
      { spans: [{ cls: 'text-directive', text: 'Restart' }, { cls: 'text-ip', text: '=always' }] },
    ],
    outputFile: exampleFile
  });
}
