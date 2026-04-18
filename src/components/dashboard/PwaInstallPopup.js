'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { usePwa } from './PwaContext';

export default function PwaInstallPopup() {
  const { deferredPrompt, clearPrompt, isPwaInstalled } = usePwa();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isPwaInstalled) {
        setIsVisible(false);
        return;
    }

    if (deferredPrompt) {
        checkAndShowPopup();
    }
  }, [deferredPrompt, isPwaInstalled]);

  const checkAndShowPopup = () => {
    const lastDismissedStr = localStorage.getItem('pwa_popup_dismissed_at');
    const lastDismissed = lastDismissedStr ? parseInt(lastDismissedStr) : 0;
    const now = Date.now();

    // Show max once per week if dismissed (7 * 24 * 60 * 60 * 1000)
    const ONE_WEEK_MS = 604800000;

    // Only show randomly (e.g. 30% chance on load if eligible)
    // Always show if test-pwa page
    const isTest = typeof window !== 'undefined' && window.location.pathname === '/test-pwa';

    if (now - lastDismissed > ONE_WEEK_MS || isTest) {
        if (Math.random() < 0.3 || isTest) {
            // Delay slightly for better UX
            setTimeout(() => {
                setIsVisible(true);
            }, 3000);
        }
    }
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    clearPrompt();
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pwa_popup_dismissed_at', Date.now().toString());
  };

  if (!isVisible || isPwaInstalled || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-5 max-w-sm w-full relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#8A63D2]/10 rounded-bl-full -z-10 opacity-50"></div>

        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors bg-white/50 rounded-full p-1"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#8A63D2]/10 flex items-center justify-center flex-shrink-0">
            <Smartphone className="text-[#8A63D2]" size={24} />
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg mb-1">Install Dashboard App</h3>
            <p className="text-sm text-gray-600 mb-4">
              Get one-tap access to your Bizvistar dashboard and manage your site faster.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleInstall}
                className="flex-1 bg-[#0A1128] hover:bg-[#002B5E] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Install Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
