import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LandingPage } from './pages/Landing';
import { AuthPage } from './pages/Auth';
import { CustomerPages } from './pages/CustomerPages';
import { OwnerPages } from './pages/OwnerPages';
import { EmployeePages } from './pages/EmployeePages';
import { AdminPages } from './pages/AdminPages';
import type { Page } from './types';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
};

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'PLATFORM_ADMIN') {
        setCurrentPage('admin-dashboard');
      } else if (user.role === 'CAFE_OWNER') {
        setCurrentPage('owner-dashboard');
      } else if (user.role === 'CAFE_EMPLOYEE') {
        setCurrentPage('employee-dashboard');
      } else {
        setCurrentPage('customer-home');
      }
    } else {
      setCurrentPage('landing');
    }
  }, [isAuthenticated, user]);

  const navigate = (page: Page) => setCurrentPage(page);

  return (
    <div className="max-w-lg mx-auto min-h-screen relative">
      <AnimatePresence mode="wait">
        {!isAuthenticated && currentPage === 'landing' && (
          <motion.div key="landing" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <LandingPage onNavigate={navigate} />
          </motion.div>
        )}
        {!isAuthenticated && (currentPage === 'login' || currentPage === 'register') && (
          <motion.div key="auth" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <AuthPage mode={currentPage} onNavigate={navigate} />
          </motion.div>
        )}
        {isAuthenticated && user?.role === 'CUSTOMER' && (
          <motion.div key="customer" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <CustomerPages currentPage={currentPage} onNavigate={navigate} />
          </motion.div>
        )}
        {isAuthenticated && user?.role === 'CAFE_OWNER' && (
          <motion.div key="owner" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <OwnerPages currentPage={currentPage} onNavigate={navigate} />
          </motion.div>
        )}
        {isAuthenticated && user?.role === 'CAFE_EMPLOYEE' && (
          <motion.div key="employee" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <EmployeePages currentPage={currentPage} onNavigate={navigate} />
          </motion.div>
        )}
        {isAuthenticated && user?.role === 'PLATFORM_ADMIN' && (
          <motion.div key="admin" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <AdminPages currentPage={currentPage} onNavigate={navigate} />
          </motion.div>
        )}
      </AnimatePresence>
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
