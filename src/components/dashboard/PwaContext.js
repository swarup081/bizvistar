"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const PwaContext = createContext();

export function PwaProvider({ children }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);

  useEffect(() => {
    // Check local storage, standalone mode, and device APIs
    const checkIsInstalled = async () => {
        // 1. Check Standalone mode (most reliable if currently running AS an app)
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
            localStorage.setItem('pwa_installed', 'true');
            return true;
        }

        // 2. Check getInstalledRelatedApps API (Supported in Chromium browsers)
        // This actually queries the device to see if the PWA is installed reliably
        if ('getInstalledRelatedApps' in navigator) {
            try {
                const relatedApps = await navigator.getInstalledRelatedApps();
                if (relatedApps.length > 0) {
                    localStorage.setItem('pwa_installed', 'true');
                    return true;
                }
            } catch (e) {
                console.error("Error checking installed apps", e);
            }
        }

        // 3. Fallback to our localStorage cache
        return localStorage.getItem('pwa_installed') === 'true';
    };

    // Initialize check
    checkIsInstalled().then(installed => {
        if (installed) {
            setIsPwaInstalled(true);
        }
    });

    // Capture from the pre-hydration script if it already fired
    if (window.deferredPwaPrompt) {
      setDeferredPrompt(window.deferredPwaPrompt);
      // If it fired, we know it's NOT installed
      setIsPwaInstalled(false);
      localStorage.setItem('pwa_installed', 'false');
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsPwaInstalled(false);
      localStorage.setItem('pwa_installed', 'false');
    };

    const handleAppInstalled = () => {
      setIsPwaInstalled(true);
      setDeferredPrompt(null);
      localStorage.setItem('pwa_installed', 'true');
    };

    // Listen for our custom event from the head script
    window.addEventListener('pwa-prompt-ready', () => {
        if (window.deferredPwaPrompt) {
            setDeferredPrompt(window.deferredPwaPrompt);
            setIsPwaInstalled(false);
            localStorage.setItem('pwa_installed', 'false');
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
