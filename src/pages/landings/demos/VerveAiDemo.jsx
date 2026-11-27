import React, { useState } from 'react';
import { DemoWrapper } from '../DemoWrapper';

export const VerveAiDemo = () => {
  const [activeTab, setActiveTab] = useState('refunds');
  const [confidence, setConfidence] = useState(88);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [demoSent, setDemoSent] = useState(false);
  const [activeChannel, setActiveChannel] = useState('Zendesk');

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const tabData = {
    refunds: {
      user: 'Hola, mi pedido #ORD-9921 llegó con la talla equivocada. ¿Puedo cambiarlo?',
      bot: '¡Claro! He verificado tu orden #ORD-9921. Ya generé la etiqueta de devolución gratuita y reservé tu talla M para envío express hoy mismo.',
      trace: [
        '1. GET /shopify/orders/ORD-9921 → 200 OK (95ms)',
        '2. POST /shipping/return-label → 201 Created (140ms)',
      ],
    },
    billing: {
      user: 'Necesito cambiar nuestra suscripción al plan Anual y descargar la última factura.',
      bot: 'Listo. Actualicé tu cuenta al plan Anual (ahorro del 20% aplicado) y envié el PDF de tu factura #INV-4092 a finanzas@empresa.com.',
      trace: [
        '1. PATCH /stripe/subscriptions/sub_88a → 200 OK (110ms)',
        '2. POST /mailer/send-invoice → 202 Accepted (170ms)',
      ],
    },
    access: {
      user: 'Agregamos 3 desarrolladores nuevos, ¿pueden darles acceso SSO con Okta?',
      bot: 'He aprovisionado los 3 asientos bajo tu grupo de Okta SAML y enviado los enlaces de activación a sus correos corporativos.',
      trace: [
        '1. GET /okta/groups/eng-core → 200 OK (80ms)',
        '2. POST /okta/scim/users/batch → 201 Created (330ms)',
      ],
    },
  };

  const deflectionRate = Math.min(95, Math.max(52, Math.round(118 - confidence * 0.52)));
  const dailyTickets = 1200;
  const resolvedCount = Math.round((dailyTickets * deflectionRate) / 100);
  const escalatedCount = dailyTickets - resolvedCount;
  const monthlySavings = (resolvedCount * 30 * 2.4).toLocaleString('en-US');

  const channelDetails = {
    Zendesk: {
      summary: 'Se conecta vía OAuth 2.0 y Webhooks bidireccionales para leer tickets entrantes, consultar macros y responder o escalar en menos de 1.5s.',
      steps: ['Lee historial del cliente y etiquetas en Zendesk Support', 'Genera borrador o respuesta automática según umbral', 'Asigna grupo humano si requiere aprobación'],
      latency: '140ms · Setup 2 min',
    },
    Intercom: {
      summary: 'Integración nativa con Intercom Messenger y Fin-compatible inbox para resolver dudas en tiempo real dentro de tu app web o móvil.',
      steps: ['Intercepta conversaciones nuevas en el Messenger', 'Consulta estado de suscripción en tu backend', 'Cierra o transfiere con resumen estructurado'],
      latency: '115ms · Setup 2 min',
    },
    Slack: {
      summary: 'Convierte canales internos de #soporte-vip o #it-helpdesk en asistentes autónomos conectados a Notion, Linear y Okta.',
      steps: ['Responde menciones en hilos de Slack', 'Crea issues automáticos en Linear o Jira', 'Aprovisiona accesos tras aprobación con un clic'],
      latency: '95ms · Setup 1 min',
    },
    WhatsApp: {
      summary: 'Atiende pedidos, rastreos y cambios por WhatsApp Business Cloud API con soporte multimodal para audios e imágenes de recibos.',
      steps: ['Verifica identidad por número y código OTP', 'Envía etiquetas de envío y PDFs directamente al chat', 'Soporte 24/7 en 45 idiomas'],
      latency: '210ms · Setup 4 min',
    },
    Shopify: {
      summary: 'Acceso directo a órdenes, inventario y reembolsos de Shopify Plus para resolver cambios de talla, cancelaciones y devoluciones sin humanos.',
      steps: ['Consulta tracking en tiempo real de paquetería', 'Ejecuta reembolsos parciales o totales vía API', 'Genera guías de retorno automáticas'],
      latency: '180ms · Setup 3 min',
    },
  };

  return (
    <DemoWrapper>
      <div
        className="min-h-screen bg-[#0d0d10] text-[#f4f4f5]"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <header className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-10">
            <div className="text-xl font-bold tracking-tight flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-orange-500" />
              <span>Verve</span>
            </div>
            <nav className="hidden lg:flex items-center gap-1 text-sm text-zinc-400">
              <button onClick={() => scrollTo('verve-capacidades')} className="px-3 py-1.5 rounded-full hover:bg-white/5 hover:text-white cursor-pointer">Capacidades</button>
              <button onClick={() => scrollTo('verve-agente')} className="px-3 py-1.5 rounded-full hover:bg-white/5 hover:text-white cursor-pointer flex items-center gap-1.5">
                Agente v3 <span className="px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold">LIVE</span>
              </button>
              <button onClick={() => scrollTo('verve-integraciones')} className="px-3 py-1.5 rounded-full hover:bg-white/5 hover:text-white cursor-pointer">Integraciones</button>
              <button onClick={() => scrollTo('verve-seguridad')} className="px-3 py-1.5 rounded-full hover:bg-white/5 hover:text-white cursor-pointer">Seguridad</button>
              <button onClick={() => scrollTo('verve-casos')} className="px-3 py-1.5 rounded-full hover:bg-white/5 hover:text-white cursor-pointer">Casos de Éxito</button>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-zinc-400 cursor-pointer hover:text-white">Ver precios</span>
            <button
              onClick={() => { setIsDemoOpen(true); setDemoSent(false); }}
              className="px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-400 text-black font-semibold text-sm transition-colors"
            >
              Solicitar Demo
            </button>
          </div>
        </header>

        {/* Hero */}
        <section id="verve-agente" className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
          <div className="lg:col-span-6">
            <span className="inline-block px-3 py-1 rounded-full bg-orange-500/15 text-orange-400 text-xs font-semibold mb-5">
              Agente de Soporte Autónomo 24/7
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
              Resuelve el 82% de tus tickets{' '}
              <span className="italic font-normal text-orange-400" style={{ fontFamily: "'Instrument Serif', serif" }}>
                sin intervención humana.
              </span>
            </h1>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
              Verve comprende el contexto de tu negocio, ejecuta reembolsos, consulta órdenes en tiempo real y escala solo lo estrictamente necesario.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <button
                onClick={() => { setIsDemoOpen(true); setDemoSent(false); }}
                className="px-6 py-3 rounded-full bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors"
              >
                Probar Agente en Vivo
              </button>
              <button className="px-6 py-3 rounded-full border border-white/15 text-white font-semibold text-sm hover:bg-white/5 transition-colors">
                Ver Benchmarks
              </button>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
              <div>
                <div className="text-3xl font-bold text-white tabular-nums">82%</div>
                <div className="text-xs text-zinc-500 mt-1">Resolución autónoma</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white tabular-nums">&lt; 1.4s</div>
                <div className="text-xs text-zinc-500 mt-1">Tiempo de respuesta</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white tabular-nums">4.9/5</div>
                <div className="text-xs text-zinc-500 mt-1">CSAT promedio</div>
              </div>
            </div>
          </div>

          {/* Chat Simulation Card with Live Tool Trace */}
          <div className="lg:col-span-6">
            <div className="flex gap-2 mb-3">
              {[
                { id: 'refunds', label: 'Cambios y Envíos' },
                { id: 'billing', label: 'Facturación' },
                { id: 'access', label: 'Accesos SSO' },
              ].map((tb) => (
                <button
                  key={tb.id}
                  onClick={() => setActiveTab(tb.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    activeTab === tb.id ? 'bg-orange-500 text-black' : 'bg-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  {tb.label}
                </button>
              ))}
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#15151a] p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs text-zinc-400 font-medium">Conversación en vivo · Ticket #8492</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[11px] font-semibold">
                  Verificado
                </span>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 text-sm text-zinc-200 max-w-[85%]">
                {tabData[activeTab].user}
              </div>
              <div className="rounded-xl bg-black/40 border border-white/10 p-3 text-[11px] text-emerald-400 space-y-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {tabData[activeTab].trace.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>
              <div className="bg-orange-500/15 border border-orange-500/30 rounded-2xl p-4 text-sm text-orange-100 ml-auto max-w-[85%]">
                {tabData[activeTab].bot}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Analytics & Confidence Simulator */}
        <section id="verve-capacidades" className="max-w-6xl mx-auto px-6 py-20 border-t border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <span className="text-xs text-orange-400 uppercase tracking-widest font-semibold">Observabilidad</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">Simulador de Umbral de Confianza IA</h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Ajusta el nivel de certeza mínimo requerido antes de que Verve responda automáticamente o escale a un agente humano.
              </p>
              <div className="p-5 rounded-2xl bg-[#15151a] border border-white/10 space-y-4">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Umbral de Confianza Mínimo</span>
                  <span className="text-orange-400 font-bold tabular-nums">{confidence}%</span>
                </div>
                <input
                  type="range"
                  min="65"
                  max="98"
                  value={confidence}
                  onChange={(e) => setConfidence(Number(e.target.value))}
                  style={{
                    background: `linear-gradient(to right, #f97316 ${((confidence - 65) / 33) * 100}%, #27272a ${((confidence - 65) / 33) * 100}%)`,
                  }}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-orange-500 [&::-webkit-slider-thumb]:shadow-md"
                />
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center">
                  <div className="bg-black/30 rounded-xl p-2.5">
                    <div className="text-sm font-bold text-emerald-400 tabular-nums">{resolvedCount}</div>
                    <div className="text-[10px] text-zinc-500">Resueltos/día</div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-2.5">
                    <div className="text-sm font-bold text-orange-400 tabular-nums">{escalatedCount}</div>
                    <div className="text-[10px] text-zinc-500">Escalados</div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-2.5">
                    <div className="text-sm font-bold text-white tabular-nums">${monthlySavings}</div>
                    <div className="text-[10px] text-zinc-500">Ahorro/mes</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-white/10 bg-[#15151a] p-6 relative">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs text-zinc-400 font-medium">Simulación semanal ({deflectionRate}% desvío actual)</span>
                  <span className="text-xs text-emerald-400 font-semibold tabular-nums">CSAT est: {(4.5 + (confidence - 65) * 0.013).toFixed(2)}/5</span>
                </div>
                <div className="flex items-end gap-3 h-48 pt-4 relative">
                  {[0.72, 0.78, 0.84, 0.88, 0.93, 0.97, 1].map((factor, idx) => {
                    const val = Math.max(30, Math.min(96, Math.round(deflectionRate * factor)));
                    return (
                      <div key={idx} className="flex-1 h-full flex flex-col justify-end items-center gap-2">
                        <span className="text-[11px] text-zinc-300 font-semibold tabular-nums">{val}%</span>
                        <div
                          className={`w-full rounded-t-xl transition-all duration-300 ${
                            idx === 6
                              ? 'bg-gradient-to-t from-orange-500 to-amber-300 shadow-[0_0_20px_rgba(249,115,22,0.4)]'
                              : 'bg-gradient-to-t from-orange-600/80 to-amber-400/80'
                          }`}
                          style={{ height: `${Math.round(val * 1.35)}px` }}
                        />
                        <span className="text-[11px] text-zinc-500">Día {idx + 1}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Channels & Integrations */}
        <section id="verve-integraciones" className="border-y border-white/10 bg-[#111116] py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs text-orange-400 uppercase tracking-widest font-semibold">Omnicanal Nativo</span>
              <h2 className="text-3xl font-bold mt-2">Conectado a todo tu stack de soporte</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center mb-6">
              {['Zendesk', 'Intercom', 'Slack', 'WhatsApp', 'Shopify'].map((ch) => (
                <button
                  key={ch}
                  onClick={() => setActiveChannel(ch)}
                  className={`py-4 px-5 rounded-2xl border font-semibold text-sm transition-all ${
                    activeChannel === ch
                      ? 'bg-orange-500 text-black border-orange-500'
                      : 'bg-[#18181f] border-white/10 text-zinc-200 hover:border-orange-500/40'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
            <div className="rounded-3xl bg-[#15151a] border border-white/10 p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div>
                  <div className="text-xs text-orange-400 font-bold uppercase tracking-wider">Integración Activa</div>
                  <div className="text-xl font-bold text-white mt-0.5">{activeChannel} Bidirectional Sync</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {channelDetails[activeChannel].latency}
                </span>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">{channelDetails[activeChannel].summary}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                {channelDetails[activeChannel].steps.map((st, idx) => (
                  <div key={st} className="rounded-2xl bg-black/30 border border-white/10 p-4 text-xs text-zinc-300">
                    <span className="text-orange-400 font-bold block mb-1">Paso 0{idx + 1}</span>
                    <span>{st}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Security & Guardrails */}
        <section id="verve-seguridad" className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { tag: 'Precisión', title: 'Cero Alucinaciones', desc: 'Respuestas estrictamente ancladas en tu base de conocimiento y políticas internas.' },
              { tag: 'Acciones', title: 'Ejecución Segura', desc: 'Conecta webhooks para cancelar suscripciones, emitir reembolsos o actualizar envíos.' },
              { tag: 'Seguridad', title: 'SOC2 Type II & GDPR', desc: 'Enmascaramiento automático de PII y cero entrenamiento con datos de clientes.' },
            ].map((item) => (
              <div key={item.tag} className="p-7 rounded-3xl bg-[#141419] border border-white/10">
                <div className="text-xs text-orange-400 font-semibold uppercase mb-3">{item.tag}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section id="verve-casos" className="max-w-6xl mx-auto px-6 py-16 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                quote: 'Pasamos de un tiempo de primera respuesta de 4 horas a 1.2 segundos. Nuestro equipo humano ahora se enfoca solo en casos VIP.',
                author: 'Andrea Morales',
                role: 'VP of Customer Experience en NovaPay',
                metric: '79% menos tickets escalados',
              },
              {
                quote: 'La integración con nuestra API de envíos permitió que Verve gestione cambios de dirección y reembolsos sin errores.',
                author: 'Carlos Vega',
                role: 'Head of Operations en Kora Commerce',
                metric: '4.94/5 CSAT sostenido',
              },
            ].map((t) => (
              <div key={t.author} className="rounded-3xl bg-[#141419] border border-white/10 p-8 flex flex-col justify-between">
                <p className="text-zinc-200 text-base leading-relaxed mb-6">“{t.quote}”</p>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-white/10">
                  <div>
                    <div className="font-bold text-sm text-white">{t.author}</div>
                    <div className="text-xs text-zinc-500">{t.role}</div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-orange-500/15 text-orange-400 text-xs font-semibold">
                    {t.metric}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Demo Modal */}
        {isDemoOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setIsDemoOpen(false)}>
            <div className="bg-[#16161c] border border-white/15 rounded-3xl max-w-md w-full p-7" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-2">Agendar Demo con Verve</h3>
              {demoSent ? (
                <div className="py-6 text-center space-y-3">
                  <div className="text-emerald-400 font-bold text-lg">✓ Solicitud Confirmada</div>
                  <p className="text-xs text-zinc-400">Te enviamos el acceso al sandbox interactivo a tu correo.</p>
                  <button onClick={() => setIsDemoOpen(false)} className="px-6 py-2 rounded-full bg-orange-500 text-black text-xs font-bold">Cerrar</button>
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  <input type="email" placeholder="tu@empresa.com" className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-sm outline-none focus:border-orange-500" />
                  <button onClick={() => setDemoSent(true)} className="w-full py-3 rounded-full bg-orange-500 text-black font-bold text-sm hover:bg-orange-400">
                    Enviar Acceso al Sandbox
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <footer className="border-t border-white/10 py-14 px-6 bg-[#09090b]">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div>
              <div className="font-bold text-white mb-3">Verve AI</div>
              <p className="text-xs text-zinc-500">Plataforma autónoma de atención al cliente para empresas modernas.</p>
            </div>
            <div>
              <div className="font-semibold text-zinc-300 mb-3">Soluciones</div>
              <ul className="space-y-2 text-xs text-zinc-500">
                <li>E-commerce</li>
                <li>Fintech</li>
                <li>SaaS B2B</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-zinc-300 mb-3">Empresa</div>
              <ul className="space-y-2 text-xs text-zinc-500">
                <li>Sobre nosotros</li>
                <li>Carreras</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-zinc-300 mb-3">Confianza</div>
              <ul className="space-y-2 text-xs text-zinc-500">
                <li>SOC2 Type II</li>
                <li>Privacidad</li>
                <li>Términos</li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </DemoWrapper>
  );
};
