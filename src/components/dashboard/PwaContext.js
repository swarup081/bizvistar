"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const PwaContext = createContext();

export function PwaProvider({ children }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsPwaInstalled(true);
    }

    // Capture from the pre-hydration script if it already fired
    if (window.deferredPwaPrompt) {
      setDeferredPrompt(window.deferredPwaPrompt);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsPwaInstalled(false);
    };

    const handleAppInstalled = () => {
      setIsPwaInstalled(true);
      setDeferredPrompt(null);
    };

    // Listen for our custom event from the head script
    window.addEventListener('pwa-prompt-ready', () => {
        if (window.deferredPwaPrompt) {
            setDeferredPrompt(window.deferredPwaPrompt);
        }
    });

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const clearPrompt = () => setDeferredPrompt(null);

  return (
    <PwaContext.Provider value={{ deferredPrompt, clearPrompt, isPwaInstalled }}>
      {children}
    </PwaContext.Provider>
  );
}

export function usePwa() {
  return useContext(PwaContext);
}
