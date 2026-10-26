import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import AuthModal from './components/AuthModal/AuthModal';
import MasterHub from './pages/MasterHub/MasterHub';
import Analytics from './pages/Analytics/Analytics';
import CreativeStudio from './pages/CreativeStudio/CreativeStudio';
import Campaigns from './pages/Campaigns/Campaigns';
import FatigueDetector from './pages/FatigueDetector/FatigueDetector';
import styles from './App.module.css';

export default function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className={styles.appLayout}>
      <Sidebar onOpenAuth={() => setIsAuthOpen(true)} />

      <main className={styles.mainContent}>
        <Routes>
          <Route path="/" element={<Navigate to="/hub" replace />} />
          <Route path="/hub" element={<MasterHub />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/creative" element={<CreativeStudio />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/fatigue" element={<FatigueDetector />} />
          <Route path="*" element={<Navigate to="/hub" replace />} />
        </Routes>
      </main>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
