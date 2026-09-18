import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, QrCode, Award, Gift, MapPin, Sparkles, Star, Clock } from 'lucide-react';
import type { Page } from '../types';

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } }
};

const fadeUpItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

// Demo cafés for landing page
const DEMO_CAFES = [
  { name: 'Artel Coffee', hours: '08:00 — 22:00' },
  { name: 'Bukhara Coffee House', hours: '07:00 — 23:00' },
  { name: 'Latte Art Café', hours: '09:00 — 21:00' },
  { name: 'Green Bean', hours: '08:00 — 20:00' },
];

export function LandingPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-espresso-950 via-espresso-900 to-coffee-900" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-32 h-32 bg-coffee-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-coffee-400 rounded-full blur-3xl" />
        </div>
        
        {/* Steam effect */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2">
          {[0, 1, 2].map(i => (
            <div key={i} className="absolute w-2 h-8 bg-white/10 rounded-full animate-steam" style={{ animationDelay: `${i * 0.8}s`, left: `${i * 12 - 12}px` }} />
          ))}
        </div>

        <div className="relative px-6 pt-16 pb-20 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-coffee-400 to-coffee-600 mb-6 shadow-lg shadow-coffee-500/30">
            <Coffee className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl font-bold text-white mb-3">
            CaféPass
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-lg text-cream-300 mb-2">
            Raqamli sodiqlik platformangiz
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-sm text-espresso-400 mb-8">
            Namangan kafelarida ball to'plang, sovg'alar oling
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-col gap-3 max-w-xs mx-auto">
            <button onClick={() => onNavigate('register')} className="w-full py-4 bg-gradient-to-r from-coffee-500 to-coffee-600 text-white font-semibold rounded-2xl shadow-lg shadow-coffee-500/30 active:scale-[0.98] transition-transform">
              Ro'yxatdan o'tish
            </button>
            <button onClick={() => onNavigate('login')} className="w-full py-4 bg-white/10 backdrop-blur-sm text-white font-medium rounded-2xl border border-white/20 active:scale-[0.98] transition-transform">
              Kirish
            </button>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="px-6 py-12">
        <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }} className="space-y-4">
          {[
            { icon: QrCode, title: 'Tezkor QR', desc: 'Bir skanerlash — ball to\'plang', color: 'from-coffee-400 to-coffee-500' },
            { icon: Award, title: 'Sodiqlik ballari', desc: 'Har xaridda ball, sovg\'a uchun', color: 'from-amber-400 to-amber-500' },
            { icon: Gift, title: 'Sovg\'alar', desc: 'Bepul kofe, chegirmalar, sovg\'alar', color: 'from-rose-400 to-rose-500' },
            { icon: MapPin, title: 'Kafelarni kashf eting', desc: 'Yaqin atrofdagi eng yaxshi kafelar', color: 'from-emerald-400 to-emerald-500' },
          ].map((f, i) => (
            <motion.div key={i} variants={fadeUpItem} className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm card-hover">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center flex-shrink-0`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-espresso-900">{f.title}</h3>
                <p className="text-sm text-espresso-500">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Partner Cafes */}
      <div className="px-6 pb-12">
        <h2 className="text-lg font-bold text-espresso-900 mb-4">Hamkor kafelar</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
          {DEMO_CAFES.map((cafe, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex-shrink-0 w-40 p-4 bg-white rounded-2xl shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-coffee-100 to-coffee-200 flex items-center justify-center mb-3">
                <Coffee className="w-5 h-5 text-coffee-600" />
              </div>
              <h3 className="font-semibold text-sm text-espresso-900 truncate">{cafe.name}</h3>
              <p className="text-xs text-espresso-500 mt-1">{cafe.hours}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-8 text-center border-t border-espresso-100">
        <p className="text-xs text-espresso-400">CaféPass © 2025 — Namangan, O'zbekiston</p>
        <p className="text-xs text-espresso-300 mt-1">Pilot loyiha</p>
      </div>
    </div>
  );
}
