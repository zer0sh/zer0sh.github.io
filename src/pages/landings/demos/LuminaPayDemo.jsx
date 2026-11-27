import React, { useState } from 'react';
import { DemoWrapper } from '../DemoWrapper';

const INITIAL_TX = [
  { id: 1, vendor: 'AWS Cloud Services', dept: 'Infraestructura', amount: '-$1,240.00', pos: false },
  { id: 2, vendor: 'Figma Enterprise', dept: 'Diseño', amount: '-$450.00', pos: false },
  { id: 3, vendor: 'Rendimiento Tesorería', dept: 'Tesorería', amount: '+$571.40', pos: true },
];

export const LuminaPayDemo = () => {
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [deptFilter, setDeptFilter] = useState('Todos');
  const [transactions, setTransactions] = useState(INITIAL_TX);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const treasuryBalance = 250000;
  const annualYield = Math.round(treasuryBalance * 0.048).toLocaleString('en-US');

  const cdYields = [
    { q: 'Q1 25', val: 3.1 },
    { q: 'Q2 25', val: 3.5 },
    { q: 'Q3 25', val: 3.9 },
    { q: 'Q4 25', val: 4.3 },
    { q: 'Q1 26', val: 4.6 },
    { q: 'Q2 26', val: 4.8 },
  ];

  const creditRates = [
    { q: 'Q1 25', val: 11.4 },
    { q: 'Q2 25', val: 10.6 },
    { q: 'Q3 25', val: 9.8 },
    { q: 'Q4 25', val: 8.9 },
    { q: 'Q1 26', val: 8.1 },
    { q: 'Q2 26', val: 7.4 },
  ];

  const simulateExpense = () => {
    const newTx = {
      id: Date.now(),
      vendor: 'Vercel Pro Team',
      dept: 'Infraestructura',
      amount: '-$180.00',
      pos: false,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const visibleTx = transactions.filter((t) => deptFilter === 'Todos' || t.dept === deptFilter);

  return (
    <DemoWrapper>
      <div
        className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 text-slate-900"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <header className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="font-extrabold text-xl tracking-tight text-indigo-600 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs flex items-center justify-center font-black">L</span>
              <span>Lumina</span>
            </div>
            <nav className="hidden lg:flex items-center gap-1 text-sm text-slate-600">
              <button onClick={() => scrollTo('lum-tarjetas')} className="px-3.5 py-1.5 rounded-full hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer">Tarjetas</button>
              <button onClick={() => scrollTo('lum-tesoreria')} className="px-3.5 py-1.5 rounded-full hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer flex items-center gap-1.5">
                Tesorería <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">4.8% APY</span>
              </button>
              <button onClick={() => scrollTo('lum-auto')} className="px-3.5 py-1.5 rounded-full hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer">Automatización</button>
              <button onClick={() => scrollTo('lum-integraciones')} className="px-3.5 py-1.5 rounded-full hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer">Integraciones</button>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm font-medium text-slate-600 cursor-pointer hover:text-slate-900">Iniciar sesión</span>
            <button className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all">
              Abrir Cuenta
            </button>
          </div>
        </header>

        <section id="lum-tarjetas" className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <span className="inline-block px-3.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-5">
              Tesorería Corporativa
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.04] mb-6">
              Control total sobre el capital de tu empresa.
            </h1>
            <p className="text-slate-600 text-lg mb-8">
              Tarjetas virtuales ilimitadas, aprobaciones automáticas y rendimiento del 4.8% APY sobre tu saldo operativo.
            </p>
            <div className="flex items-center gap-4">
              <button className="px-7 py-3.5 rounded-full bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors">
                Empezar Gratis
              </button>
              <span className="text-xs text-slate-500">Sin comisiones ocultas</span>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col items-center gap-5">
            <div className="w-full max-w-md rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-slate-900 p-8 text-white shadow-2xl transform hover:-rotate-1 transition-transform duration-300">
              <div className="flex justify-between items-center mb-10">
                <span className="text-xs tracking-widest opacity-80 font-semibold">LUMINA CORPORATE</span>
                <button
                  onClick={() => setShowCardNumber((s) => !s)}
                  className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-[10px] font-bold uppercase"
                >
                  {showCardNumber ? 'Ocultar' : 'Revelar'}
                </button>
              </div>
              <div className="text-xl tracking-widest mb-8 tabular-nums" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {showCardNumber ? '4532 8910 2234 4829' : '•••• •••• •••• 4829'}
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[10px] uppercase opacity-70">Titular</div>
                  <div className="font-semibold text-sm">STEVEN MUÑOZ</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase opacity-70">Balance</div>
                  <div className="font-bold text-lg tabular-nums" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    ${treasuryBalance.toLocaleString('en-US')}.00
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full max-w-md rounded-2xl bg-white/90 backdrop-blur border border-slate-200 p-4 shadow-sm flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Rendimiento anual (4.8% APY)</span>
              <span className="font-bold text-emerald-600 tabular-nums">+${annualYield} USD/año</span>
            </div>
          </div>
        </section>

        {/* Dual Financial Charts: CD Yields Up & Credit Rates Down */}
        <section id="lum-tesoreria" className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: CD Yields Rising */}
            <div className="bg-white/90 backdrop-blur rounded-3xl p-7 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs font-bold uppercase text-emerald-600 mb-1">Rendimiento CDs / Tesorería</div>
                  <h2 className="text-xl font-extrabold text-slate-900">Evolución al alza hasta 4.8% APY</h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold tabular-nums">
                  +1.70% YoY
                </span>
              </div>
              <div className="flex items-end gap-3 h-44 pt-4">
                {cdYields.map((item, idx) => (
                  <div key={item.q} className="flex-1 h-full flex flex-col justify-end items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-700 tabular-nums">{item.val}%</span>
                    <div
                      className={`w-full rounded-t-xl transition-all ${
                        idx === cdYields.length - 1
                          ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-lg shadow-emerald-500/25'
                          : 'bg-emerald-200'
                      }`}
                      style={{ height: `${Math.round(item.val * 24)}px` }}
                    />
                    <span className="text-[10px] text-slate-400 font-semibold">{item.q}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2: Corporate Credit Rates Falling */}
            <div className="bg-white/90 backdrop-blur rounded-3xl p-7 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs font-bold uppercase text-indigo-600 mb-1">Tasas de Crédito Corporativo</div>
                  <h2 className="text-xl font-extrabold text-slate-900">Reducción sostenida de intereses</h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold tabular-nums">
                  -4.00% YoY
                </span>
              </div>
              <div className="flex items-end gap-3 h-44 pt-4">
                {creditRates.map((item, idx) => (
                  <div key={item.q} className="flex-1 h-full flex flex-col justify-end items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-700 tabular-nums">{item.val}%</span>
                    <div
                      className={`w-full rounded-t-xl transition-all ${
                        idx === creditRates.length - 1
                          ? 'bg-gradient-to-t from-indigo-600 to-violet-400 shadow-lg shadow-indigo-500/25'
                          : 'bg-indigo-200'
                      }`}
                      style={{ height: `${Math.round(item.val * 10)}px` }}
                    />
                    <span className="text-[10px] text-slate-400 font-semibold">{item.q}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Filterable Expense Feed Mockup */}
        <section id="lum-auto" className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="font-bold text-sm text-slate-800">Movimientos Recientes</div>
                <button
                  onClick={simulateExpense}
                  className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-bold"
                >
                  + Simular Gasto
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Todos', 'Infraestructura', 'Diseño', 'Tesorería'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDeptFilter(d)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
                      deptFilter === d ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              {visibleTx.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between text-sm py-2">
                  <div>
                    <div className="font-semibold text-slate-800">{tx.vendor}</div>
                    <div className="text-xs text-slate-400">{tx.dept}</div>
                  </div>
                  <span className={`font-semibold tabular-nums ${tx.pos ? 'text-emerald-600' : 'text-slate-900'}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
            <div className="lg:col-span-6">
              <h2 className="text-3xl font-extrabold mb-4">Cierra la contabilidad en minutos, no en semanas</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Cada pago con tarjeta captura automáticamente el recibo vía Slack o correo, asigna la categoría contable y sincroniza con NetSuite, QuickBooks o Xero.
              </p>
              <div className="flex flex-wrap gap-2">
                {['NetSuite', 'QuickBooks', 'Xero', 'Slack', 'Stripe'].map((erp) => (
                  <span key={erp} className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                    {erp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-200/70 py-12 px-6 text-center text-xs text-slate-400">
          Lumina Finance Inc. · Servicios financieros asegurados hasta $5M FDIC
        </footer>
      </div>
    </DemoWrapper>
  );
};
