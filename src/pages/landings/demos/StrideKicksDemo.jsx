import React, { useState } from 'react';
import { DemoWrapper } from '../DemoWrapper';

const COLORWAYS = [
  { id: 'crimson', name: 'CRIMSON V2', sku: 'STR-09-CRM', accent: 'text-lime-400', price: 210, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80' },
  { id: 'volt', name: 'VOLT CARBON', sku: 'STR-09-VLT', accent: 'text-emerald-400', price: 225, img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=900&q=80' },
  { id: 'stealth', name: 'STEALTH OG', sku: 'STR-09-BLK', accent: 'text-zinc-300', price: 195, img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80' },
];

const CATALOG_SHOES = [
  { id: 'crimson', title: 'APEX RUNNER CRIMSON V2', tag: 'DROP 09 · EN STOCK', price: '$210', colorwayId: 'crimson', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80' },
  { id: 'volt', title: 'APEX RUNNER VOLT CARBON', tag: 'LIMITED EDITION', price: '$225', colorwayId: 'volt', img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=700&q=80' },
  { id: 'stealth', title: 'APEX RUNNER STEALTH OG', tag: 'CORE ARCHIVE', price: '$195', colorwayId: 'stealth', img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=700&q=80' },
  { id: 'vortex', title: 'VORTEX CARBON', tag: '12 DIC · PRE-ORDER', price: '$240', colorwayId: 'volt', img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=700&q=80' },
  { id: 'nitro', title: 'NITRO PHANTOM', tag: '24 DIC · DROP', price: '$195', colorwayId: 'crimson', img: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=700&q=80' },
  { id: 'low', title: 'STEALTH LOW OG', tag: '08 ENE · DROP', price: '$180', colorwayId: 'stealth', img: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=700&q=80' },
];

export const StrideKicksDemo = () => {
  const [view, setView] = useState('catalog');
  const [selectedSize, setSelectedSize] = useState('42');
  const [colorwayId, setColorwayId] = useState('crimson');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [notifiedDrops, setNotifiedDrops] = useState([]);

  const activeColorway = COLORWAYS.find((c) => c.id === colorwayId) || COLORWAYS[0];
  const remainingPairs = Math.max(1, 18 - cart.length);

  const openProduct = (cwId) => {
    setColorwayId(cwId);
    setView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = () => {
    setCart((prev) => [
      ...prev,
      { id: Date.now(), name: `APEX RUNNER ${activeColorway.name}`, size: selectedSize, price: activeColorway.price },
    ]);
    setCartOpen(true);
  };

  const toggleNotify = (name) => {
    setNotifiedDrops((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
  };

  return (
    <DemoWrapper>
      <div
        className="min-h-screen bg-[#0d0d0f] text-white"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        <div className="bg-lime-400 text-black text-xs font-black uppercase tracking-widest py-2 text-center">
          DROP 09 DISPONIBLE AHORA · ENVÍO EXPRESS GLOBAL EN 24H
        </div>

        <header className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setView('catalog')}
              className="font-black text-2xl tracking-tighter italic cursor-pointer"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              STRIDE<span className="text-lime-400">.</span>
            </button>
            <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-widest text-zinc-400">
              <button onClick={() => setView('catalog')} className={`hover:text-white ${view === 'catalog' ? 'text-lime-400 font-bold' : ''}`}>
                Catálogo
              </button>
              <button onClick={() => setView('product')} className={`hover:text-white ${view === 'product' ? 'text-lime-400 font-bold' : ''}`}>
                Drop 09
              </button>
              <button
                onClick={() => {
                  setView('product');
                  setTimeout(() => document.getElementById('stride-specs')?.scrollIntoView({ behavior: 'smooth' }), 60);
                }}
                className="hover:text-white cursor-pointer"
              >
                Tecnología
              </button>
              <button
                onClick={() => {
                  setView('product');
                  setTimeout(() => document.getElementById('stride-archive')?.scrollIntoView({ behavior: 'smooth' }), 60);
                }}
                className="hover:text-white cursor-pointer"
              >
                Archivo
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-xs text-lime-400 font-bold uppercase tracking-widest">
              Edición Limitada
            </span>
            <button
              onClick={() => setCartOpen(true)}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Bolsa ({cart.length})
            </button>
          </div>
        </header>

        {view === 'catalog' ? (
          <section className="max-w-6xl mx-auto px-6 py-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="inline-block px-3.5 py-1 rounded-full bg-lime-400/15 text-lime-400 text-xs font-bold uppercase tracking-widest mb-4">
                  COLECCIÓN 2026 · 6 SILUETAS
                </span>
                <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-none" style={{ fontFamily: "'Syne', sans-serif" }}>
                  STREETWEAR <span className="text-lime-400">FOOTWEAR</span>
                </h1>
              </div>
              <p className="text-zinc-400 text-sm max-w-sm">
                Selecciona cualquier par de la galería para inspeccionar su ficha técnica, cambiar el colorway y elegir tu talla.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {CATALOG_SHOES.map((shoe) => (
                <div
                  key={shoe.id}
                  onClick={() => openProduct(shoe.colorwayId)}
                  className="group cursor-pointer rounded-3xl bg-zinc-900/90 border border-white/10 hover:border-lime-400/70 overflow-hidden transition-all hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div className="h-60 overflow-hidden relative bg-zinc-950">
                    <img
                      src={shoe.img}
                      alt={shoe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-black/80 text-lime-400 text-[10px] font-bold uppercase tracking-wider">
                      {shoe.tag}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <h2 className="font-black text-lg tracking-tight uppercase">{shoe.title}</h2>
                      <span className="font-bold text-lime-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{shoe.price}</span>
                    </div>
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                      <span>EU 40 – 44</span>
                      <span className="text-white font-bold group-hover:text-lime-400 transition-colors">Ver Producto &rarr;</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <>
            <div className="max-w-6xl mx-auto px-6 pt-8">
              <button
                onClick={() => setView('catalog')}
                className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-lime-400 transition-colors inline-flex items-center gap-2"
              >
                <span>&larr;</span>
                <span>Volver al Catálogo</span>
              </button>
            </div>

            <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6">
                <div className="rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/10 p-6 overflow-hidden relative">
                  <span className="absolute top-5 left-5 px-3 py-1 rounded-full bg-black/70 text-[11px] text-zinc-300" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {activeColorway.sku}
                  </span>
                  <img
                    src={activeColorway.img}
                    alt={activeColorway.name}
                    className="w-full h-80 object-cover rounded-2xl hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              <div className="lg:col-span-6">
                <span className="inline-block px-3.5 py-1 rounded-full bg-lime-400 text-black text-xs font-black uppercase tracking-wider mb-4">
                  En Stock · {remainingPairs} Pares Restantes
                </span>
                <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-none mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
                  APEX RUNNER <br />
                  <span className={activeColorway.accent}>{activeColorway.name}</span>
                </h1>
                <p className="text-zinc-400 text-base mb-6 leading-relaxed">
                  Entresuela de espuma reactiva de doble densidad, malla balística ultraligera y suela de tracción urbana.
                </p>
                <div className="text-3xl font-black mb-6" style={{ fontFamily: "'JetBrains Mono', monospace" }}>${activeColorway.price}.00 USD</div>

                <div className="mb-6">
                  <div className="text-xs text-zinc-400 uppercase font-semibold mb-2">Colorway</div>
                  <div className="flex flex-wrap gap-2">
                    {COLORWAYS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setColorwayId(c.id)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                          colorwayId === c.id ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-300 border-white/15'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <div className="text-xs text-zinc-400 uppercase font-semibold mb-2.5">Seleccionar Talla (EU)</div>
                  <div className="flex flex-wrap gap-2">
                    {['40', '41', '42', '43', '44'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-11 rounded-xl text-sm font-bold border transition-colors ${
                          selectedSize === size
                            ? 'bg-lime-400 text-black border-lime-400'
                            : 'bg-zinc-900 text-zinc-300 border-white/15 hover:border-lime-400/60'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={addToCart}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-lime-400 hover:bg-lime-300 text-black font-black uppercase tracking-widest text-sm transition-colors"
                >
                  Añadir al Carrito &rarr;
                </button>
              </div>
            </section>

            <section id="stride-specs" className="max-w-6xl mx-auto px-6 py-12 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Placa de Carbono', desc: 'Retorno de energía del 87% en cada zancada urbana.' },
                  { title: 'Upper Ripstop', desc: 'Tejido técnico repelente al agua con ventilación lateral.' },
                  { title: 'Suela Vibram', desc: 'Agarre superior en asfalto húmedo y superficies lisas.' },
                ].map((sp) => (
                  <div key={sp.title} className="rounded-2xl bg-zinc-900/80 border border-white/10 p-6">
                    <h3 className="font-bold text-lg text-lime-400 mb-2">{sp.title}</h3>
                    <p className="text-sm text-zinc-400">{sp.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="stride-archive" className="max-w-6xl mx-auto px-6 pb-20 pt-8 border-t border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">Próximos Lanzamientos</div>
                <span className="text-xs text-lime-400 font-bold">Calendario 2026</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'VORTEX CARBON', date: '12 DIC', price: '$240', img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80' },
                  { name: 'NITRO PHANTOM', date: '24 DIC', price: '$195', img: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=600&q=80' },
                  { name: 'STEALTH LOW OG', date: '08 ENE', price: '$180', img: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80' },
                ].map((drop) => {
                  const isNotified = notifiedDrops.includes(drop.name);
                  return (
                    <div key={drop.name} className="rounded-2xl bg-zinc-900 border border-white/10 overflow-hidden group">
                      <div className="h-48 overflow-hidden relative">
                        <img src={drop.img} alt={drop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 text-lime-400 text-[11px] font-bold">
                          {drop.date}
                        </span>
                      </div>
                      <div className="p-5 flex items-center justify-between gap-2">
                        <div>
                          <div className="font-black uppercase tracking-tight">{drop.name}</div>
                          <div className="text-xs font-bold text-lime-400">{drop.price}</div>
                        </div>
                        <button
                          onClick={() => toggleNotify(drop.name)}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors ${
                            isNotified ? 'bg-lime-400 text-black' : 'bg-white/10 text-zinc-200 hover:bg-white/20'
                          }`}
                        >
                          {isNotified ? 'Activo ✓' : 'Notificarme'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {/* Slide-Over Cart Drawer */}
        {cartOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end" onClick={() => setCartOpen(false)}>
            <div className="w-full max-w-md bg-zinc-950 border-l border-white/15 p-7 h-full flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
              <div>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                  <h3 className="text-lg font-black uppercase" style={{ fontFamily: "'Syne', sans-serif" }}>Tu Bolsa ({cart.length})</h3>
                  <button onClick={() => setCartOpen(false)} className="text-xs text-zinc-400 hover:text-white">Cerrar ✕</button>
                </div>
                {cart.length === 0 ? (
                  <p className="text-sm text-zinc-500">Tu bolsa está vacía.</p>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="p-4 rounded-2xl bg-zinc-900 border border-white/10 flex justify-between items-center text-sm">
                        <div>
                          <div className="font-bold">{item.name}</div>
                          <div className="text-xs text-zinc-400">Talla EU {item.size}</div>
                        </div>
                        <span className="font-bold text-lime-400">${item.price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between text-sm font-bold mb-4">
                  <span>Subtotal</span>
                  <span>${cart.reduce((sum, i) => sum + i.price, 0)}.00 USD</span>
                </div>
                <button onClick={() => setCartOpen(false)} className="w-full py-3.5 rounded-full bg-lime-400 text-black font-black text-xs uppercase tracking-widest">
                  Finalizar Compra
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="border-t border-white/10 py-12 px-6 text-center text-xs text-zinc-500">
          STRIDE KICKS · Envíos internacionales · Garantía de autenticidad
        </footer>
      </div>
    </DemoWrapper>
  );
};
