import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, ChevronLeft, Check, Clock, Coffee, User, TrendingUp, ShoppingBag, Home, Gift } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { Page } from '../types';

// ============================================================
// EMPLOYEE DASHBOARD
// ============================================================
function EmployeeDashboard({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-cream-50 pb-24">
      <div className="bg-gradient-to-br from-espresso-950 to-espresso-900 px-6 pt-12 pb-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-cream-400 text-xs">Xodim paneli</p>
            <h1 className="text-xl font-bold text-white">{user?.name || 'Alisher'}</h1>
            <p className="text-xs text-espresso-400 mt-0.5">Artel Coffee — Markaziy filial</p>
          </div>
          <button onClick={() => onNavigate('employee-scan')} className="w-12 h-12 rounded-xl bg-coffee-500 flex items-center justify-center shadow-lg shadow-coffee-500/30">
            <QrCode className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Today Stats */}
      <div className="px-6 -mt-3">
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-white rounded-xl text-center shadow-sm">
            <ShoppingBag className="w-4 h-4 text-coffee-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-espresso-900">8</p>
            <p className="text-[10px] text-espresso-500">Sotuv</p>
          </div>
          <div className="p-3 bg-white rounded-xl text-center shadow-sm">
            <TrendingUp className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-espresso-900">320K</p>
            <p className="text-[10px] text-espresso-500">Tushum</p>
          </div>
          <div className="p-3 bg-white rounded-xl text-center shadow-sm">
            <Gift className="w-4 h-4 text-amber-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-espresso-900">160</p>
            <p className="text-[10px] text-espresso-500">Ball</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mt-6">
        <h2 className="font-bold text-espresso-900 mb-3">Tezkor amallar</h2>
        <div className="space-y-3">
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={() => onNavigate('employee-scan')} className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm card-hover active:scale-[0.98] transition-transform">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-coffee-400 to-coffee-500 flex items-center justify-center">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-espresso-900">Mijozni aniqlash</h3>
              <p className="text-sm text-espresso-500">QR kodni skanerlang</p>
            </div>
          </motion.button>

          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm card-hover active:scale-[0.98] transition-transform">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-espresso-900">Sotuv qo'shish</h3>
              <p className="text-sm text-espresso-500">Yangi buyurtma kiritish</p>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Recent Scans */}
      <div className="px-6 mt-6">
        <h2 className="font-bold text-espresso-900 mb-3">So'nggi mijozlar</h2>
        <div className="space-y-2">
          {[
            { name: 'Sardor K.', time: '10:30', points: '+225' },
            { name: 'Bobur A.', time: '11:15', points: '+310' },
            { name: 'Nilufar R.', time: '14:00', points: '+105' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="flex items-center gap-3 p-3 bg-white rounded-xl">
              <div className="w-8 h-8 rounded-full bg-coffee-100 flex items-center justify-center">
                <User className="w-4 h-4 text-coffee-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-espresso-900">{item.name}</p>
                <p className="text-xs text-espresso-400">{item.time}</p>
              </div>
              <span className="text-sm font-bold text-emerald-600">{item.points}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// EMPLOYEE SCAN
// ============================================================
function EmployeeScan({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [showPurchase, setShowPurchase] = useState(false);
  const [amount, setAmount] = useState('');

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
    }, 1500);
  };

  const handleProcessPurchase = () => {
    if (amount && parseInt(amount) > 0) {
      setShowPurchase(false);
      setScanned(false);
      setAmount('');
      // Show success
      setTimeout(() => {
        onNavigate('employee-dashboard');
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-espresso-950 flex flex-col items-center justify-center px-6">
      <button onClick={() => onNavigate('employee-dashboard')} className="absolute top-6 left-6 flex items-center gap-1 text-espresso-400">
        <ChevronLeft className="w-5 h-5" /><span className="text-sm">Ortga</span>
      </button>

      {!scanned && !showPurchase && (
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
      )}

      {scanned && !showPurchase && (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center w-full max-w-sm">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Mijoz aniqlandi!</h2>
          <p className="text-lg text-cream-300 font-medium">Sardor Karimov</p>
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
            <button onClick={() => { setScanned(false); }} className="flex-1 py-3 bg-white/10 text-white font-medium rounded-xl active:scale-95 transition-transform">Yangi</button>
            <button onClick={() => setShowPurchase(true)} className="flex-1 py-3 bg-coffee-500 text-white font-medium rounded-xl active:scale-95 transition-transform">Sotuv</button>
          </div>
        </motion.div>
      )}

      {showPurchase && (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center w-full max-w-sm">
          <h2 className="text-xl font-bold text-white mb-2">Sotuv kiritish</h2>
          <p className="text-sm text-espresso-400 mb-6">Mijoz: Sardor Karimov</p>
          <div className="mb-6">
            <label className="text-sm text-cream-300 mb-2 block text-left">Summa (so'm)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="45000"
              className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-xl font-bold text-center placeholder:text-espresso-500 outline-none focus:border-coffee-400"
            />
            {amount && parseInt(amount) > 0 && (
              <p className="text-sm text-emerald-400 mt-2">
                +{Math.floor(parseInt(amount) / 1000 * 5)} ball beriladi
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowPurchase(false)} className="flex-1 py-3 bg-white/10 text-white font-medium rounded-xl active:scale-95 transition-transform">Bekor</button>
            <button onClick={handleProcessPurchase} className="flex-1 py-3 bg-emerald-500 text-white font-medium rounded-xl active:scale-95 transition-transform">Tasdiqlash</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ============================================================
// MAIN EXPORT
// ============================================================
export function EmployeePages({ currentPage, onNavigate }: { currentPage: Page; onNavigate: (page: Page) => void }) {
  return (
    <>
      {currentPage === 'employee-dashboard' && <EmployeeDashboard onNavigate={onNavigate} />}
      {currentPage === 'employee-scan' && <EmployeeScan onNavigate={onNavigate} />}
      {currentPage === 'employee-purchase' && <EmployeeScan onNavigate={onNavigate} />}
    </>
  );
}
