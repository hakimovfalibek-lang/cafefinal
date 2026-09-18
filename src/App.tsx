import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coffee, QrCode, User, MapPin, Star, Gift, Clock, TrendingUp, 
  Users, ChevronRight, ChevronLeft, Home, Award, History, Settings,
  LogOut, Phone, ArrowRight, Sparkles, Zap, Heart, Eye, Check,
  BarChart3, ShoppingBag, Crown, Target, Bell, Search, Filter
} from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { 
  PILOT_CAFES, PILOT_CUSTOMERS, PILOT_ORDERS, PILOT_REWARDS, 
  PILOT_PROMOTIONS, PILOT_LOYALTY_TRANSACTIONS,
  generateAnalytics, formatUZS, formatShortUZS, getLevelColor, getLevelName 
} from './data/store';
import type { Page, Cafe, Customer, Reward } from './types';

// ============ ANIMATION VARIANTS ============
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } }
};

const fadeUpItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }
};

// ============ LANDING PAGE ============
function LandingPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen bg-cream-50">
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
            Raqamli sodiqlik kartangiz
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

      {/* Partner Cafes Preview */}
      <div className="px-6 pb-12">
        <h2 className="text-lg font-bold text-espresso-900 mb-4">Hamkor kafelar</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
          {PILOT_CAFES.slice(0, 4).map((cafe, i) => (
            <motion.div key={cafe.id} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex-shrink-0 w-40 p-4 bg-white rounded-2xl shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-coffee-100 to-coffee-200 flex items-center justify-center mb-3">
                <Coffee className="w-5 h-5 text-coffee-600" />
              </div>
              <h3 className="font-semibold text-sm text-espresso-900 truncate">{cafe.name}</h3>
              <p className="text-xs text-espresso-500 mt-1">{cafe.workingHours}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-8 text-center border-t border-espresso-100">
        <p className="text-xs text-espresso-400">CaféPass © 2025 — Namangan, O'zbekiston</p>
        <p className="text-xs text-espresso-300 mt-1">Pilot loyiha</p>
      </div>
    </motion.div>
  );
}

// ============ LOGIN PAGE ============
function LoginPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { login } = useAuth();
  const [phone, setPhone] = useState('+998 ');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'customer' | 'cafe_owner'>('customer');

  const handleLogin = () => {
    if (phone.length >= 13 && name.trim()) {
      login(phone, name.trim(), role);
      onNavigate(role === 'customer' ? 'customer-home' : 'cafe-dashboard');
    }
  };

  // Quick pilot login
  const quickLogin = (type: 'customer' | 'cafe') => {
    if (type === 'customer') {
      login('+998 91 234 56 78', 'Sardor Karimov', 'customer');
      onNavigate('customer-home');
    } else {
      login('+998 90 111 22 33', 'Artel Coffee', 'cafe_owner');
      onNavigate('cafe-dashboard');
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen bg-cream-50 px-6 py-12">
      <button onClick={() => onNavigate('landing')} className="flex items-center gap-1 text-espresso-500 mb-8">
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Ortga</span>
      </button>

      <div className="max-w-sm mx-auto">
        <h1 className="text-2xl font-bold text-espresso-900 mb-2">Kirish</h1>
        <p className="text-espresso-500 mb-8">CaféPass hisobingizga kiring</p>

        {/* Quick pilot access */}
        <div className="mb-6 p-4 bg-coffee-50 rounded-2xl border border-coffee-100">
          <p className="text-xs font-medium text-coffee-700 mb-3">⚡ Pilot tez kirish</p>
          <div className="flex gap-2">
            <button onClick={() => quickLogin('customer')} className="flex-1 py-2 text-xs font-medium bg-white rounded-xl text-coffee-700 border border-coffee-200 active:scale-95 transition-transform">
              Mijoz sifatida
            </button>
            <button onClick={() => quickLogin('cafe')} className="flex-1 py-2 text-xs font-medium bg-white rounded-xl text-coffee-700 border border-coffee-200 active:scale-95 transition-transform">
              Kafe sifatida
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-espresso-700 mb-1.5 block">Telefon raqam</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-espresso-400" />
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 XX XXX XX XX"
                className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl border border-espresso-200 focus:border-coffee-400 focus:ring-2 focus:ring-coffee-100 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-espresso-700 mb-1.5 block">Ism</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ismingiz"
              className="w-full px-4 py-3.5 bg-white rounded-xl border border-espresso-200 focus:border-coffee-400 focus:ring-2 focus:ring-coffee-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-espresso-700 mb-1.5 block">Rol</label>
            <div className="flex gap-2">
              <button onClick={() => setRole('customer')} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${role === 'customer' ? 'bg-coffee-500 text-white shadow-sm' : 'bg-white text-espresso-600 border border-espresso-200'}`}>
                Mijoz
              </button>
              <button onClick={() => setRole('cafe_owner')} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${role === 'cafe_owner' ? 'bg-coffee-500 text-white shadow-sm' : 'bg-white text-espresso-600 border border-espresso-200'}`}>
                Kafe egasi
              </button>
            </div>
          </div>

          <button onClick={handleLogin} className="w-full py-4 bg-gradient-to-r from-coffee-500 to-coffee-600 text-white font-semibold rounded-2xl shadow-lg shadow-coffee-500/20 active:scale-[0.98] transition-transform mt-6">
            Kirish
          </button>
        </div>

        <p className="text-center text-sm text-espresso-500 mt-6">
          Hisobingiz yo'qmi?{' '}
          <button onClick={() => onNavigate('register')} className="text-coffee-600 font-medium">
            Ro'yxatdan o'ting
          </button>
        </p>
      </div>
    </motion.div>
  );
}

// ============ REGISTER PAGE ============
function RegisterPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { login } = useAuth();
  const [phone, setPhone] = useState('+998 ');
  const [name, setName] = useState('');

  const handleRegister = () => {
    if (phone.length >= 13 && name.trim()) {
      login(phone, name.trim(), 'customer');
      onNavigate('customer-home');
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen bg-cream-50 px-6 py-12">
      <button onClick={() => onNavigate('landing')} className="flex items-center gap-1 text-espresso-500 mb-8">
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Ortga</span>
      </button>

      <div className="max-w-sm mx-auto">
        <h1 className="text-2xl font-bold text-espresso-900 mb-2">Ro'yxatdan o'tish</h1>
        <p className="text-espresso-500 mb-8">CaféPass ga qo'shiling va ball to'plang</p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-espresso-700 mb-1.5 block">To'liq ism</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ismingiz va familiyangiz"
              className="w-full px-4 py-3.5 bg-white rounded-xl border border-espresso-200 focus:border-coffee-400 focus:ring-2 focus:ring-coffee-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-espresso-700 mb-1.5 block">Telefon raqam</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-espresso-400" />
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 XX XXX XX XX"
                className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl border border-espresso-200 focus:border-coffee-400 focus:ring-2 focus:ring-coffee-100 outline-none transition-all"
              />
            </div>
          </div>

          <button onClick={handleRegister} className="w-full py-4 bg-gradient-to-r from-coffee-500 to-coffee-600 text-white font-semibold rounded-2xl shadow-lg shadow-coffee-500/20 active:scale-[0.98] transition-transform mt-6">
            Ro'yxatdan o'tish
          </button>
        </div>

        <p className="text-center text-sm text-espresso-500 mt-6">
          Hisobingiz bormi?{' '}
          <button onClick={() => onNavigate('login')} className="text-coffee-600 font-medium">
            Kirish
          </button>
        </p>
      </div>
    </motion.div>
  );
}

// ============ CUSTOMER HOME ============
function CustomerHome({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { customer, logout } = useAuth();
  if (!customer) return null;

  const nextLevel = customer.level === 'bronze' ? 'silver' : customer.level === 'silver' ? 'gold' : customer.level === 'gold' ? 'platinum' : 'platinum';
  const pointsForNext = customer.level === 'bronze' ? 1000 : customer.level === 'silver' ? 2000 : customer.level === 'gold' ? 5000 : 10000;
  const progress = Math.min((customer.totalPoints / pointsForNext) * 100, 100);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen bg-cream-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-espresso-950 to-espresso-900 px-6 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-cream-400 text-sm">Salom,</p>
            <h1 className="text-xl font-bold text-white">{customer.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onNavigate('customer-qr')} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white" />
            </button>
            <button onClick={() => onNavigate('customer-profile')} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Points Card */}
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-gradient-to-br from-coffee-500 to-coffee-700 rounded-2xl p-5 shadow-lg shadow-coffee-500/20">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-cream-200 text-xs font-medium">Sizning ballaringiz</p>
              <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }} className="text-3xl font-bold text-white mt-1">
                {customer.totalPoints.toLocaleString()}
              </motion.p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: getLevelColor(customer.level) + '30', color: getLevelColor(customer.level) }}>
                <Crown className="w-3 h-3" />
                {getLevelName(customer.level)}
              </span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-cream-200 mb-1.5">
              <span>{getLevelName(nextLevel)} gacha</span>
              <span>{pointsForNext - customer.totalPoints} ball</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }} className="h-full bg-gradient-to-r from-cream-200 to-white rounded-full" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 -mt-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: QrCode, label: 'QR kod', page: 'customer-qr' as Page, color: 'from-coffee-400 to-coffee-500' },
            { icon: Gift, label: 'Sovg\'alar', page: 'customer-rewards' as Page, color: 'from-rose-400 to-rose-500' },
            { icon: MapPin, label: 'Kafelar', page: 'customer-cafes' as Page, color: 'from-emerald-400 to-emerald-500' },
          ].map((action, i) => (
            <motion.button key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} onClick={() => onNavigate(action.page)} className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-sm card-hover active:scale-95 transition-transform">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-espresso-700">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 mt-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Tashriflar', value: customer.totalVisits, icon: Eye },
            { label: 'Sarflangan', value: formatShortUZS(customer.totalSpent), icon: ShoppingBag },
            { label: 'Sevimli', value: customer.favoriteCafes.length, icon: Heart },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.1 }} className="p-3 bg-white rounded-xl text-center">
              <stat.icon className="w-4 h-4 text-coffee-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-espresso-900">{stat.value}</p>
              <p className="text-[10px] text-espresso-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-6 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-espresso-900">So'nggi harakatlar</h2>
          <button onClick={() => onNavigate('customer-history')} className="text-xs text-coffee-600 font-medium">Barchasi →</button>
        </div>
        <div className="space-y-2">
          {PILOT_LOYALTY_TRANSACTIONS.filter(t => t.customerId === customer.id).slice(0, 3).map((tx, i) => (
            <motion.div key={tx.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className="flex items-center gap-3 p-3 bg-white rounded-xl">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.type === 'earn' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                {tx.type === 'earn' ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <Gift className="w-4 h-4 text-rose-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-espresso-900 truncate">{tx.description}</p>
                <p className="text-xs text-espresso-400">{new Date(tx.createdAt).toLocaleDateString('uz-UZ')}</p>
              </div>
              <span className={`text-sm font-bold ${tx.points > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {tx.points > 0 ? '+' : ''}{tx.points}
              </span>
            </motion.div>
          ))}
          {PILOT_LOYALTY_TRANSACTIONS.filter(t => t.customerId === customer.id).length === 0 && (
            <div className="p-6 text-center bg-white rounded-xl">
              <Coffee className="w-8 h-8 text-espresso-300 mx-auto mb-2" />
              <p className="text-sm text-espresso-500">Hali harakatlar yo'q</p>
              <p className="text-xs text-espresso-400 mt-1">Kafega tashrif buyuring va ball to'plang</p>
            </div>
          )}
        </div>
      </div>

      {/* Active Promotions */}
      <div className="px-6 mt-6">
        <h2 className="font-bold text-espresso-900 mb-3">Faol takliflar</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6">
          {PILOT_PROMOTIONS.filter(p => p.isActive).map((promo, i) => (
            <motion.div key={promo.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 + i * 0.1 }} className="flex-shrink-0 w-56 p-4 bg-gradient-to-br from-coffee-50 to-cream-100 rounded-2xl border border-coffee-100">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-coffee-500" />
                <span className="text-xs font-medium text-coffee-600">
                  {PILOT_CAFES.find(c => c.id === promo.cafeId)?.name}
                </span>
              </div>
              <h3 className="font-semibold text-sm text-espresso-900">{promo.title}</h3>
              <p className="text-xs text-espresso-500 mt-1">{promo.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ============ CUSTOMER QR ============
function CustomerQR({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { customer } = useAuth();
  if (!customer) return null;

  const [timeLeft, setTimeLeft] = useState(60);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 60);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Generate a visual QR-like pattern
  const generateQRPattern = () => {
    const size = 21;
    const pattern: boolean[][] = [];
    const seed = customer.id.charCodeAt(0) + timeLeft;
    for (let i = 0; i < size; i++) {
      pattern[i] = [];
      for (let j = 0; j < size; j++) {
        // Corner squares
        if ((i < 7 && j < 7) || (i < 7 && j >= size - 7) || (i >= size - 7 && j < 7)) {
          const isOuter = i === 0 || i === 6 || j === 0 || j === 6 || 
                         (i < 7 && (j === size - 7 || j === size - 1)) ||
                         (i >= size - 7 && (j === 0 || j === 6)) ||
                         (j < 7 && (i === size - 7 || i === size - 1)) ||
                         (j >= size - 7 && (i === 0 || i === 6));
          const isInner = (i >= 2 && i <= 4 && j >= 2 && j <= 4) ||
                         (i >= 2 && i <= 4 && j >= size - 5 && j <= size - 3) ||
                         (i >= size - 5 && i <= size - 3 && j >= 2 && j <= 4);
          pattern[i][j] = isOuter || isInner;
        } else {
          pattern[i][j] = ((i * 7 + j * 13 + seed) % 3) !== 0;
        }
      }
    }
    return pattern;
  };

  const qrPattern = generateQRPattern();

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen bg-espresso-950 flex flex-col items-center justify-center px-6">
      <button onClick={() => onNavigate('customer-home')} className="absolute top-6 left-6 flex items-center gap-1 text-espresso-400">
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Ortga</span>
      </button>

      <div className="text-center mb-8">
        <h1 className="text-xl font-bold text-white mb-1">Sizning QR kodingiz</h1>
        <p className="text-sm text-espresso-400">Kafedochi ushbu kodni skanerlaydi</p>
      </div>

      {/* QR Code */}
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="relative">
        <div className="w-64 h-64 bg-white rounded-3xl p-4 shadow-2xl shadow-black/30">
          <div className="w-full h-full relative">
            <div className="grid grid-cols-[repeat(21,1fr)] gap-[1px] w-full h-full">
              {qrPattern.flat().map((filled, idx) => (
                <div key={idx} className={`rounded-[1px] ${filled ? 'bg-espresso-900' : 'bg-white'}`} />
              ))}
            </div>
            {/* Scan line */}
            <div className="absolute left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-coffee-500 to-transparent animate-qr-scan" />
          </div>
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-3xl animate-pulse-glow" />
      </motion.div>

      {/* Timer */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
          <Clock className="w-4 h-4 text-coffee-400" />
          <span className="text-sm text-white font-medium">{timeLeft}s</span>
        </div>
        <p className="text-xs text-espresso-500 mt-2">Kod har 60 soniyada yangilanadi</p>
      </div>

      {/* Customer info */}
      <div className="mt-8 text-center">
        <p className="text-lg font-semibold text-white">{customer.name}</p>
        <p className="text-sm text-espresso-400">{customer.phone}</p>
      </div>
    </motion.div>
  );
}

// ============ CUSTOMER CAFES LIST ============
function CustomerCafes({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredCafes = PILOT_CAFES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen bg-cream-50 pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <button onClick={() => onNavigate('customer-home')} className="flex items-center gap-1 text-espresso-500 mb-4">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Ortga</span>
        </button>
        <h1 className="text-2xl font-bold text-espresso-900 mb-4">Kafelar</h1>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-espresso-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kafe qidirish..."
            className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-espresso-100 focus:border-coffee-400 outline-none"
          />
        </div>
      </div>

      {/* Cafe List */}
      <div className="px-6 mt-4">
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
          {filteredCafes.map((cafe, i) => (
            <motion.button key={cafe.id} variants={fadeUpItem} onClick={() => onNavigate('customer-cafe-detail')} className="w-full text-left p-4 bg-white rounded-2xl shadow-sm card-hover active:scale-[0.98] transition-transform">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-coffee-100 to-coffee-200 flex items-center justify-center flex-shrink-0">
                  <Coffee className="w-6 h-6 text-coffee-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-espresso-900">{cafe.name}</h3>
                  <p className="text-sm text-espresso-500 mt-0.5">{cafe.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs text-espresso-400">
                      <MapPin className="w-3 h-3" />
                      {cafe.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-coffee-600 font-medium">
                      <Star className="w-3 h-3" />
                      {cafe.loyaltyRate} ball / 1000 so'm
                    </span>
                    <span className="flex items-center gap-1 text-xs text-espresso-400">
                      <Clock className="w-3 h-3" />
                      {cafe.workingHours}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-espresso-300 flex-shrink-0 mt-1" />
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ============ CUSTOMER CAFE DETAIL ============
function CustomerCafeDetail({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const cafe = PILOT_CAFES[0];
  const rewards = PILOT_REWARDS.filter(r => r.cafeId === cafe.id);
  const promo = PILOT_PROMOTIONS.find(p => p.cafeId === cafe.id);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen bg-cream-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-espresso-900 to-espresso-950 px-6 pt-12 pb-8 rounded-b-3xl">
        <button onClick={() => onNavigate('customer-cafes')} className="flex items-center gap-1 text-espresso-400 mb-4">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Ortga</span>
        </button>
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-coffee-400 to-coffee-600 flex items-center justify-center shadow-lg">
            <Coffee className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{cafe.name}</h1>
            <p className="text-sm text-espresso-400 mt-0.5">{cafe.address}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-coffee-400 font-medium">
                ⭐ {cafe.loyaltyRate} ball / 1000 so'm
              </span>
              <span className="text-xs text-espresso-500">•</span>
              <span className="text-xs text-espresso-400">{cafe.workingHours}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Promotion */}
      {promo && (
        <div className="px-6 -mt-4">
          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-4 bg-gradient-to-r from-coffee-50 to-cream-100 rounded-2xl border border-coffee-100">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-coffee-500" />
              <span className="text-xs font-bold text-coffee-600 uppercase">Maxsus taklif</span>
            </div>
            <h3 className="font-semibold text-espresso-900">{promo.title}</h3>
            <p className="text-sm text-espresso-600 mt-0.5">{promo.description}</p>
          </motion.div>
        </div>
      )}

      {/* Rewards */}
      <div className="px-6 mt-6">
        <h2 className="font-bold text-espresso-900 mb-3">Mavjud sovg'alar</h2>
        <div className="space-y-3">
          {rewards.map((reward, i) => (
            <motion.div key={reward.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="p-4 bg-white rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                    <Gift className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-espresso-900">{reward.name}</h3>
                    <p className="text-xs text-espresso-500">{reward.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-coffee-600">{reward.pointsCost} ball</p>
                  <button className="text-xs text-coffee-500 font-medium mt-1">Almashtirish</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Branches */}
      <div className="px-6 mt-6">
        <h2 className="font-bold text-espresso-900 mb-3">Filiallar</h2>
        <div className="space-y-2">
          {cafe.branches.map((branch, i) => (
            <div key={branch.id} className="flex items-center gap-3 p-3 bg-white rounded-xl">
              <MapPin className="w-4 h-4 text-coffee-500" />
              <div>
                <p className="text-sm font-medium text-espresso-900">{branch.name}</p>
                <p className="text-xs text-espresso-500">{branch.address}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ============ CUSTOMER REWARDS ============
function CustomerRewards({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { customer } = useAuth();
  if (!customer) return null;

  const allRewards = PILOT_REWARDS;
  const canAfford = (points: number) => customer.totalPoints >= points;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen bg-cream-50 pb-24">
      <div className="px-6 pt-12 pb-4">
        <button onClick={() => onNavigate('customer-home')} className="flex items-center gap-1 text-espresso-500 mb-4">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Ortga</span>
        </button>
        <h1 className="text-2xl font-bold text-espresso-900 mb-1">Sovg'alar</h1>
        <p className="text-sm text-espresso-500">Sizda <span className="font-bold text-coffee-600">{customer.totalPoints}</span> ball mavjud</p>
      </div>

      <div className="px-6 mt-4">
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
          {allRewards.map((reward, i) => {
            const cafe = PILOT_CAFES.find(c => c.id === reward.cafeId);
            const affordable = canAfford(reward.pointsCost);
            return (
              <motion.div key={reward.id} variants={fadeUpItem} className={`p-4 rounded-2xl shadow-sm ${affordable ? 'bg-white' : 'bg-espresso-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${affordable ? 'bg-gradient-to-br from-amber-100 to-amber-200' : 'bg-espresso-100'}`}>
                    <Gift className={`w-6 h-6 ${affordable ? 'text-amber-600' : 'text-espresso-400'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold text-sm ${affordable ? 'text-espresso-900' : 'text-espresso-500'}`}>{reward.name}</h3>
                    <p className="text-xs text-espresso-500 mt-0.5">{cafe?.name}</p>
                    <p className="text-xs text-espresso-400 mt-0.5">{reward.description}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${affordable ? 'text-coffee-600' : 'text-espresso-400'}`}>{reward.pointsCost}</p>
                    <p className="text-[10px] text-espresso-400">ball</p>
                    {affordable && (
                      <button className="mt-1 px-3 py-1 bg-coffee-500 text-white text-xs font-medium rounded-lg active:scale-95 transition-transform">
                        Olish
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ============ CUSTOMER HISTORY ============
function CustomerHistory({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { customer } = useAuth();
  if (!customer) return null;
  
  const transactions = PILOT_LOYALTY_TRANSACTIONS.filter(t => t.customerId === customer.id);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen bg-cream-50 pb-24">
      <div className="px-6 pt-12 pb-4">
        <button onClick={() => onNavigate('customer-home')} className="flex items-center gap-1 text-espresso-500 mb-4">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Ortga</span>
        </button>
        <h1 className="text-2xl font-bold text-espresso-900">Tarix</h1>
      </div>

      <div className="px-6 mt-4">
        {transactions.length > 0 ? (
          <div className="space-y-2">
            {transactions.map((tx, i) => {
              const cafe = PILOT_CAFES.find(c => c.id === tx.cafeId);
              return (
                <motion.div key={tx.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-4 bg-white rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'earn' ? 'bg-emerald-50' : tx.type === 'redeem' ? 'bg-rose-50' : 'bg-amber-50'}`}>
                      {tx.type === 'earn' ? <TrendingUp className="w-5 h-5 text-emerald-500" /> : 
                       tx.type === 'redeem' ? <Gift className="w-5 h-5 text-rose-500" /> : 
                       <Sparkles className="w-5 h-5 text-amber-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-espresso-900">{tx.description}</p>
                      <p className="text-xs text-espresso-500">{cafe?.name} • {new Date(tx.createdAt).toLocaleDateString('uz-UZ')}</p>
                    </div>
                    <span className={`text-sm font-bold ${tx.points > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {tx.points > 0 ? '+' : ''}{tx.points}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl">
            <History className="w-12 h-12 text-espresso-200 mx-auto mb-3" />
            <p className="text-sm text-espresso-500">Hali tarix yo'q</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============ CUSTOMER PROFILE ============
function CustomerProfile({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { customer, logout } = useAuth();
  if (!customer) return null;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen bg-cream-50 pb-24">
      <div className="bg-gradient-to-br from-espresso-900 to-espresso-950 px-6 pt-12 pb-8 rounded-b-3xl">
        <button onClick={() => onNavigate('customer-home')} className="flex items-center gap-1 text-espresso-400 mb-6">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Ortga</span>
        </button>
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-coffee-400 to-coffee-600 flex items-center justify-center text-2xl font-bold text-white">
            {customer.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{customer.name}</h1>
            <p className="text-sm text-espresso-400">{customer.phone}</p>
            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: getLevelColor(customer.level) + '30', color: getLevelColor(customer.level) }}>
              <Crown className="w-3 h-3" />
              {getLevelName(customer.level)}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-white rounded-2xl text-center">
            <p className="text-2xl font-bold text-espresso-900">{customer.totalPoints.toLocaleString()}</p>
            <p className="text-xs text-espresso-500 mt-1">Ball</p>
          </div>
          <div className="p-4 bg-white rounded-2xl text-center">
            <p className="text-2xl font-bold text-espresso-900">{customer.totalVisits}</p>
            <p className="text-xs text-espresso-500 mt-1">Tashriflar</p>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 bg-white rounded-2xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-espresso-500">Qo'shilgan sana</span>
            <span className="text-sm font-medium text-espresso-900">{new Date(customer.joinedAt).toLocaleDateString('uz-UZ')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-espresso-500">Jami sarflangan</span>
            <span className="text-sm font-medium text-espresso-900">{formatUZS(customer.totalSpent)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-espresso-500">Sevimli kafelar</span>
            <span className="text-sm font-medium text-espresso-900">{customer.favoriteCafes.length}</span>
          </div>
        </div>

        {/* Logout */}
        <button onClick={() => { logout(); onNavigate('landing'); }} className="w-full py-3 bg-white rounded-2xl text-rose-500 font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
          <LogOut className="w-4 h-4" />
          Chiqish
        </button>
      </div>
    </motion.div>
  );
}

// ============ CAFE DASHBOARD ============
function CafeDashboard({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { cafe, logout } = useAuth();
  if (!cafe) return null;
  
  const analytics = generateAnalytics(cafe.id);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen bg-cream-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-espresso-950 to-espresso-900 px-6 pt-12 pb-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-cream-400 text-xs">Boshqaruv paneli</p>
            <h1 className="text-xl font-bold text-white">{cafe.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </button>
            <button onClick={() => onNavigate('cafe-scan')} className="w-10 h-10 rounded-xl bg-coffee-500 flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Today Stats */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-coffee-400" />
              <span className="text-xs text-cream-300">Bugun tashriflar</span>
            </div>
            <p className="text-2xl font-bold text-white">{analytics.todayVisits}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-cream-300">Bugun tushum</span>
            </div>
            <p className="text-2xl font-bold text-white">{formatShortUZS(analytics.todayRevenue)}</p>
          </motion.div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 -mt-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-white rounded-2xl shadow-sm">
            <p className="text-xs text-espresso-500">Jami mijozlar</p>
            <p className="text-xl font-bold text-espresso-900 mt-1">{analytics.totalCustomers}</p>
          </div>
          <div className="p-4 bg-white rounded-2xl shadow-sm">
            <p className="text-xs text-espresso-500">Jami buyurtmalar</p>
            <p className="text-xl font-bold text-espresso-900 mt-1">{analytics.totalOrders}</p>
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="px-6 mt-6">
        <h2 className="font-bold text-espresso-900 mb-3">Haftalik statistika</h2>
        <div className="p-4 bg-white rounded-2xl shadow-sm">
          <div className="flex items-end justify-between h-32 gap-2">
            {analytics.weeklyData.map((day, i) => {
              const maxRevenue = Math.max(...analytics.weeklyData.map(d => d.revenue));
              const height = (day.revenue / maxRevenue) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }} className="w-full bg-gradient-to-t from-coffee-500 to-coffee-300 rounded-t-lg min-h-[4px]" />
                  <span className="text-[10px] text-espresso-500">{day.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div className="px-6 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-espresso-900">Top mijozlar</h2>
          <button onClick={() => onNavigate('cafe-customers')} className="text-xs text-coffee-600 font-medium">Barchasi →</button>
        </div>
        <div className="space-y-2">
          {analytics.topCustomers.slice(0, 3).map((cust, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="flex items-center gap-3 p-3 bg-white rounded-xl">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-coffee-200 to-coffee-300 flex items-center justify-center text-xs font-bold text-coffee-800">
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-espresso-900">{cust.name}</p>
                <p className="text-xs text-espresso-500">{cust.visits} tashrif</p>
              </div>
              <span className="text-sm font-bold text-espresso-700">{formatShortUZS(cust.spent)}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mt-6">
        <h2 className="font-bold text-espresso-900 mb-3">Boshqarish</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Users, label: 'Mijozlar', page: 'cafe-customers' as Page },
            { icon: ShoppingBag, label: 'Buyurtmalar', page: 'cafe-orders' as Page },
            { icon: Gift, label: 'Sovg\'alar', page: 'cafe-rewards' as Page },
            { icon: BarChart3, label: 'Analitika', page: 'cafe-analytics' as Page },
            { icon: Sparkles, label: 'Aksiyalar', page: 'cafe-promotions' as Page },
            { icon: Settings, label: 'Sozlamalar', page: 'cafe-settings' as Page },
          ].map((action, i) => (
            <motion.button key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.05 }} onClick={() => onNavigate(action.page)} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm card-hover active:scale-[0.97] transition-transform">
              <div className="w-9 h-9 rounded-lg bg-coffee-50 flex items-center justify-center">
                <action.icon className="w-4 h-4 text-coffee-600" />
              </div>
              <span className="text-sm font-medium text-espresso-700">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="px-6 mt-6">
        <button onClick={() => { logout(); onNavigate('landing'); }} className="w-full py-3 bg-white rounded-2xl text-rose-500 font-medium flex items-center justify-center gap-2">
          <LogOut className="w-4 h-4" />
          Chiqish
        </button>
      </div>
    </motion.div>
  );
}

// ============ CAFE SCAN ============
function CafeScan({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { cafe } = useAuth();
  const [scanning, setScanning] = useState(true);
  const [scanned, setScanned] = useState(false);
  const [customerName, setCustomerName] = useState('');

  const handleScan = () => {
    setScanning(false);
    setTimeout(() => {
      setScanned(true);
      setCustomerName('Sardor Karimov');
    }, 1500);
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen bg-espresso-950 flex flex-col items-center justify-center px-6">
      <button onClick={() => onNavigate('cafe-dashboard')} className="absolute top-6 left-6 flex items-center gap-1 text-espresso-400">
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Ortga</span>
      </button>

      {!scanned ? (
        <div className="text-center">
          <h1 className="text-xl font-bold text-white mb-2">Mijozni aniqlash</h1>
          <p className="text-sm text-espresso-400 mb-8">Mijozning QR kodini skanerlang</p>

          <div className="w-64 h-64 bg-white/5 border-2 border-dashed border-white/20 rounded-3xl flex items-center justify-center relative overflow-hidden">
            {scanning && (
              <div className="absolute left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-coffee-500 to-transparent animate-qr-scan" />
            )}
            <QrCode className="w-16 h-16 text-white/30" />
          </div>

          <button onClick={handleScan} className="mt-8 px-8 py-3 bg-coffee-500 text-white font-medium rounded-2xl active:scale-95 transition-transform">
            {scanning ? 'Skanerlash...' : 'Skanerlashni boshlash'}
          </button>
        </div>
      ) : (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Mijoz aniqlandi!</h2>
          <p className="text-lg text-cream-300 font-medium">{customerName}</p>
          
          <div className="mt-6 p-4 bg-white/10 rounded-2xl text-left">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-espresso-400">Daraja</span>
              <span className="text-sm font-medium text-white">Oltin</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-espresso-400">Ball</span>
              <span className="text-sm font-medium text-white">1,250</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-espresso-400">Tashriflar</span>
              <span className="text-sm font-medium text-white">34</span>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={() => { setScanned(false); setScanning(true); }} className="flex-1 py-3 bg-white/10 text-white font-medium rounded-xl active:scale-95 transition-transform">
              Yangi
            </button>
            <button onClick={() => onNavigate('cafe-dashboard')} className="flex-1 py-3 bg-coffee-500 text-white font-medium rounded-xl active:scale-95 transition-transform">
              Tayyor
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// ============ CAFE CUSTOMERS ============
function CafeCustomers({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { cafe } = useAuth();
  if (!cafe) return null;

  const customers = PILOT_CUSTOMERS.filter(c => c.favoriteCafes.includes(cafe.id));

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen bg-cream-50 pb-24">
      <div className="px-6 pt-12 pb-4">
        <button onClick={() => onNavigate('cafe-dashboard')} className="flex items-center gap-1 text-espresso-500 mb-4">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Ortga</span>
        </button>
        <h1 className="text-2xl font-bold text-espresso-900 mb-1">Mijozlar</h1>
        <p className="text-sm text-espresso-500">{customers.length} ta faol mijoz</p>
      </div>

      <div className="px-6 mt-4">
        <div className="space-y-2">
          {customers.map((cust, i) => (
            <motion.div key={cust.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-4 bg-white rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coffee-200 to-coffee-300 flex items-center justify-center text-sm font-bold text-coffee-800">
                  {cust.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-espresso-900">{cust.name}</p>
                  <p className="text-xs text-espresso-500">{cust.totalVisits} tashrif • {cust.totalPoints} ball</p>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: getLevelColor(cust.level) + '20', color: getLevelColor(cust.level) }}>
                  {getLevelName(cust.level)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ============ CAFE ANALYTICS ============
function CafeAnalytics({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { cafe } = useAuth();
  if (!cafe) return null;
  const analytics = generateAnalytics(cafe.id);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen bg-cream-50 pb-24">
      <div className="px-6 pt-12 pb-4">
        <button onClick={() => onNavigate('cafe-dashboard')} className="flex items-center gap-1 text-espresso-500 mb-4">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Ortga</span>
        </button>
        <h1 className="text-2xl font-bold text-espresso-900">Analitika</h1>
      </div>

      <div className="px-6 mt-4 space-y-4">
        {/* Revenue Chart */}
        <div className="p-4 bg-white rounded-2xl shadow-sm">
          <h3 className="font-semibold text-espresso-900 mb-3">Haftalik tushum</h3>
          <div className="flex items-end justify-between h-40 gap-2">
            {analytics.weeklyData.map((day, i) => {
              const maxRevenue = Math.max(...analytics.weeklyData.map(d => d.revenue));
              const height = (day.revenue / maxRevenue) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] text-espresso-400">{(day.revenue / 1000).toFixed(0)}K</span>
                  <motion.div initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }} className="w-full bg-gradient-to-t from-coffee-500 to-coffee-300 rounded-t-lg min-h-[4px]" />
                  <span className="text-[10px] text-espresso-500">{day.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Items */}
        <div className="p-4 bg-white rounded-2xl shadow-sm">
          <h3 className="font-semibold text-espresso-900 mb-3">Ommabop mahsulotlar</h3>
          <div className="space-y-3">
            {analytics.popularItems.map((item, i) => {
              const maxCount = Math.max(...analytics.popularItems.map(p => p.count));
              const width = (item.count / maxCount) * 100;
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-espresso-700">{item.name}</span>
                    <span className="text-espresso-500">{item.count}</span>
                  </div>
                  <div className="h-2 bg-espresso-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${width}%` }} transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }} className="h-full bg-gradient-to-r from-coffee-400 to-coffee-500 rounded-full" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-white rounded-2xl shadow-sm">
            <p className="text-xs text-espresso-500">O'rtacha check</p>
            <p className="text-lg font-bold text-espresso-900 mt-1">
              {formatShortUZS(analytics.todayRevenue / (analytics.todayVisits || 1))}
            </p>
          </div>
          <div className="p-4 bg-white rounded-2xl shadow-sm">
            <p className="text-xs text-espresso-500">Takrorlanish</p>
            <p className="text-lg font-bold text-espresso-900 mt-1">78%</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============ CAFE REWARDS MANAGEMENT ============
function CafeRewardsPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { cafe } = useAuth();
  if (!cafe) return null;
  const rewards = PILOT_REWARDS.filter(r => r.cafeId === cafe.id);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen bg-cream-50 pb-24">
      <div className="px-6 pt-12 pb-4">
        <button onClick={() => onNavigate('cafe-dashboard')} className="flex items-center gap-1 text-espresso-500 mb-4">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Ortga</span>
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-espresso-900">Sovg'alar</h1>
          <button className="px-4 py-2 bg-coffee-500 text-white text-sm font-medium rounded-xl active:scale-95 transition-transform">
            + Qo'shish
          </button>
        </div>
      </div>

      <div className="px-6 mt-4">
        <div className="space-y-3">
          {rewards.map((reward, i) => (
            <motion.div key={reward.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="p-4 bg-white rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                    <Gift className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-espresso-900">{reward.name}</h3>
                    <p className="text-xs text-espresso-500">{reward.pointsCost} ball</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${reward.isActive ? 'bg-emerald-400' : 'bg-espresso-300'}`} />
                  <span className="text-xs text-espresso-500">{reward.isActive ? 'Faol' : 'O\'chirilgan'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ============ CAFE PROMOTIONS ============
function CafePromotions({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { cafe } = useAuth();
  if (!cafe) return null;
  const promos = PILOT_PROMOTIONS.filter(p => p.cafeId === cafe.id);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen bg-cream-50 pb-24">
      <div className="px-6 pt-12 pb-4">
        <button onClick={() => onNavigate('cafe-dashboard')} className="flex items-center gap-1 text-espresso-500 mb-4">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Ortga</span>
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-espresso-900">Aksiyalar</h1>
          <button className="px-4 py-2 bg-coffee-500 text-white text-sm font-medium rounded-xl active:scale-95 transition-transform">
            + Yaratish
          </button>
        </div>
      </div>

      <div className="px-6 mt-4">
        {promos.length > 0 ? (
          <div className="space-y-3">
            {promos.map((promo, i) => (
              <motion.div key={promo.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="p-4 bg-gradient-to-r from-coffee-50 to-cream-100 rounded-2xl border border-coffee-100">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-coffee-500" />
                  <span className={`text-xs font-medium ${promo.isActive ? 'text-emerald-600' : 'text-espresso-400'}`}>
                    {promo.isActive ? 'Faol' : 'Tugagan'}
                  </span>
                </div>
                <h3 className="font-bold text-espresso-900">{promo.title}</h3>
                <p className="text-sm text-espresso-600 mt-1">{promo.description}</p>
                <p className="text-xs text-espresso-400 mt-2">
                  {new Date(promo.startDate).toLocaleDateString('uz-UZ')} — {new Date(promo.endDate).toLocaleDateString('uz-UZ')}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl">
            <Sparkles className="w-12 h-12 text-espresso-200 mx-auto mb-3" />
            <p className="text-sm text-espresso-500">Hali aksiyalar yo'q</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============ CAFE ORDERS ============
function CafeOrders({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { cafe } = useAuth();
  if (!cafe) return null;
  const orders = PILOT_ORDERS.filter(o => o.cafeId === cafe.id);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen bg-cream-50 pb-24">
      <div className="px-6 pt-12 pb-4">
        <button onClick={() => onNavigate('cafe-dashboard')} className="flex items-center gap-1 text-espresso-500 mb-4">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Ortga</span>
        </button>
        <h1 className="text-2xl font-bold text-espresso-900 mb-1">Buyurtmalar</h1>
        <p className="text-sm text-espresso-500">{orders.length} ta buyurtma</p>
      </div>

      <div className="px-6 mt-4">
        <div className="space-y-3">
          {orders.map((order, i) => {
            const customer = PILOT_CUSTOMERS.find(c => c.id === order.customerId);
            return (
              <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-4 bg-white rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-espresso-500">#{order.id.slice(-4)}</span>
                  <span className="text-xs text-espresso-400">{new Date(order.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-espresso-900">{customer?.name}</p>
                    <p className="text-xs text-espresso-500 mt-0.5">
                      {order.items.map(item => `${item.name} x${item.quantity}`).join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-espresso-900">{formatShortUZS(order.amount)}</p>
                    <p className="text-xs text-emerald-600">+{order.pointsEarned} ball</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ============ CAFE SETTINGS ============
function CafeSettings({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { cafe, logout } = useAuth();
  if (!cafe) return null;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen bg-cream-50 pb-24">
      <div className="px-6 pt-12 pb-4">
        <button onClick={() => onNavigate('cafe-dashboard')} className="flex items-center gap-1 text-espresso-500 mb-4">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Ortga</span>
        </button>
        <h1 className="text-2xl font-bold text-espresso-900">Sozlamalar</h1>
      </div>

      <div className="px-6 mt-4 space-y-4">
        {/* Cafe Info */}
        <div className="p-4 bg-white rounded-2xl shadow-sm space-y-3">
          <h3 className="font-semibold text-espresso-900">Kafe ma'lumotlari</h3>
          <div className="flex justify-between items-center">
            <span className="text-sm text-espresso-500">Nomi</span>
            <span className="text-sm font-medium text-espresso-900">{cafe.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-espresso-500">Manzil</span>
            <span className="text-sm font-medium text-espresso-900">{cafe.address}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-espresso-500">Telefon</span>
            <span className="text-sm font-medium text-espresso-900">{cafe.phone}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-espresso-500">Ish vaqti</span>
            <span className="text-sm font-medium text-espresso-900">{cafe.workingHours}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-espresso-500">Ball stavkasi</span>
            <span className="text-sm font-medium text-coffee-600">{cafe.loyaltyRate} ball / 1000 so'm</span>
          </div>
        </div>

        {/* Branches */}
        <div className="p-4 bg-white rounded-2xl shadow-sm">
          <h3 className="font-semibold text-espresso-900 mb-3">Filiallar</h3>
          <div className="space-y-2">
            {cafe.branches.map(branch => (
              <div key={branch.id} className="flex items-center gap-3 p-2">
                <MapPin className="w-4 h-4 text-coffee-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-espresso-900">{branch.name}</p>
                  <p className="text-xs text-espresso-500">{branch.address}</p>
                </div>
                <span className={`w-2 h-2 rounded-full ${branch.isActive ? 'bg-emerald-400' : 'bg-espresso-300'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Pilot Info */}
        <div className="p-4 bg-coffee-50 rounded-2xl border border-coffee-100">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-coffee-500" />
            <span className="text-sm font-medium text-coffee-700">Pilot rejimi</span>
          </div>
          <p className="text-xs text-coffee-600">
            Siz CaféPass pilot dasturida ishtirok etyapsiz. Namangan shahridagi birinchi hamkor kafelardan birisisiz.
          </p>
        </div>

        {/* Logout */}
        <button onClick={() => { logout(); onNavigate('landing'); }} className="w-full py-3 bg-white rounded-2xl text-rose-500 font-medium flex items-center justify-center gap-2">
          <LogOut className="w-4 h-4" />
          Chiqish
        </button>
      </div>
    </motion.div>
  );
}

// ============ BOTTOM NAV (Customer) ============
function CustomerBottomNav({ currentPage, onNavigate }: { currentPage: Page; onNavigate: (page: Page) => void }) {
  const tabs = [
    { icon: Home, label: 'Bosh', page: 'customer-home' as Page },
    { icon: QrCode, label: 'QR', page: 'customer-qr' as Page },
    { icon: MapPin, label: 'Kafelar', page: 'customer-cafes' as Page },
    { icon: Gift, label: 'Sovg\'alar', page: 'customer-rewards' as Page },
    { icon: User, label: 'Profil', page: 'customer-profile' as Page },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 glass border-t border-espresso-100 safe-bottom z-50">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-2">
        {tabs.map((tab) => {
          const isActive = currentPage === tab.page || (tab.page === 'customer-home' && (currentPage === 'customer-history'));
          return (
            <button key={tab.page} onClick={() => onNavigate(tab.page)} className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${isActive ? 'text-coffee-600' : 'text-espresso-400'}`}>
              <tab.icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============ BOTTOM NAV (Cafe) ============
function CafeBottomNav({ currentPage, onNavigate }: { currentPage: Page; onNavigate: (page: Page) => void }) {
  const tabs = [
    { icon: Home, label: 'Bosh', page: 'cafe-dashboard' as Page },
    { icon: QrCode, label: 'Skaner', page: 'cafe-scan' as Page },
    { icon: BarChart3, label: 'Analitika', page: 'cafe-analytics' as Page },
    { icon: Users, label: 'Mijozlar', page: 'cafe-customers' as Page },
    { icon: Settings, label: 'Sozl.', page: 'cafe-settings' as Page },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 glass border-t border-espresso-100 safe-bottom z-50">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-2">
        {tabs.map((tab) => {
          const isActive = currentPage === tab.page;
          return (
            <button key={tab.page} onClick={() => onNavigate(tab.page)} className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${isActive ? 'text-coffee-600' : 'text-espresso-400'}`}>
              <tab.icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============ MAIN APP ============
function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'customer') {
        setCurrentPage('customer-home');
      } else {
        setCurrentPage('cafe-dashboard');
      }
    } else {
      setCurrentPage('landing');
    }
  }, [isAuthenticated, user]);

  const navigate = (page: Page) => setCurrentPage(page);

  const isCustomerPage = currentPage.startsWith('customer-');
  const isCafePage = currentPage.startsWith('cafe-');
  const showCustomerNav = isCustomerPage && currentPage !== 'customer-qr';
  const showCafeNav = isCafePage && currentPage !== 'cafe-scan';

  return (
    <div className="max-w-lg mx-auto min-h-screen relative">
      <AnimatePresence mode="wait">
        {currentPage === 'landing' && <LandingPage key="landing" onNavigate={navigate} />}
        {currentPage === 'login' && <LoginPage key="login" onNavigate={navigate} />}
        {currentPage === 'register' && <RegisterPage key="register" onNavigate={navigate} />}
        {currentPage === 'customer-home' && <CustomerHome key="chome" onNavigate={navigate} />}
        {currentPage === 'customer-qr' && <CustomerQR key="cqr" onNavigate={navigate} />}
        {currentPage === 'customer-cafes' && <CustomerCafes key="ccafes" onNavigate={navigate} />}
        {currentPage === 'customer-cafe-detail' && <CustomerCafeDetail key="ccafedetail" onNavigate={navigate} />}
        {currentPage === 'customer-rewards' && <CustomerRewards key="crewards" onNavigate={navigate} />}
        {currentPage === 'customer-history' && <CustomerHistory key="chistory" onNavigate={navigate} />}
        {currentPage === 'customer-profile' && <CustomerProfile key="cprofile" onNavigate={navigate} />}
        {currentPage === 'cafe-dashboard' && <CafeDashboard key="cdash" onNavigate={navigate} />}
        {currentPage === 'cafe-scan' && <CafeScan key="cscan" onNavigate={navigate} />}
        {currentPage === 'cafe-customers' && <CafeCustomers key="ccust" onNavigate={navigate} />}
        {currentPage === 'cafe-analytics' && <CafeAnalytics key="canalytics" onNavigate={navigate} />}
        {currentPage === 'cafe-rewards' && <CafeRewardsPage key="crewards2" onNavigate={navigate} />}
        {currentPage === 'cafe-promotions' && <CafePromotions key="cpromos" onNavigate={navigate} />}
        {currentPage === 'cafe-orders' && <CafeOrders key="corders" onNavigate={navigate} />}
        {currentPage === 'cafe-settings' && <CafeSettings key="csettings" onNavigate={navigate} />}
      </AnimatePresence>

      {showCustomerNav && <CustomerBottomNav currentPage={currentPage} onNavigate={navigate} />}
      {showCafeNav && <CafeBottomNav currentPage={currentPage} onNavigate={navigate} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
