'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getNotifications, markNotificationRead, deleteNotification, clearAllNotifications } from '@/app/actions/notificationActions';
import StockAlertPopup from './StockAlertPopup';

const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationManager({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [popupNotification, setPopupNotification] = useState(null);
  const [websiteId, setWebsiteId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Website ID & Initial Data
  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get Website ID
        const { data: website } = await supabase
            .from('websites')
            .select('id')
            .eq('user_id', user.id)
            .eq('is_published', true) // Assuming active website, or handle multiple
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (website) {
            setWebsiteId(website.id);
            // Fetch initial notifications
            const initialData = await getNotifications(website.id);
            setNotifications(initialData || []);
            setUnreadCount((initialData || []).filter(n => !n.is_read).length);
        }
      } catch (err) {
          console.error("Notification Init Error:", err);
      } finally {
          setLoading(false);
      }
    };
    init();
  }, []);

  // 2. Realtime Subscription
  useEffect(() => {
    if (!websiteId) return;

    const channel = supabase
      .channel(`notifications:${websiteId}`)
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'notifications', 
          filter: `website_id=eq.${websiteId}` 
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
              const newNotif = payload.new;
              setNotifications(prev => [newNotif, ...prev]);
              if (!newNotif.is_read) setUnreadCount(prev => prev + 1);

              // Trigger Popup Logic
              // "Alert should come once not repeated if user has clicked the buttons"
              // The popup only shows on NEW realtime event.
              if (['low_stock', 'out_of_stock'].includes(newNotif.type)) {
                  setPopupNotification(newNotif);
              }
          } 
          else if (payload.eventType === 'DELETE') {
              setNotifications(prev => {
                  const filtered = prev.filter(n => n.id !== payload.old.id);
                  setUnreadCount(filtered.filter(n => !n.is_read).length);
                  return filtered;
              });
          }
          else if (payload.eventType === 'UPDATE') {
              setNotifications(prev => {
                  const updated = prev.map(n => n.id === payload.new.id ? payload.new : n);
                  setUnreadCount(updated.filter(n => !n.is_read).length);
                  return updated;
              });
          }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [websiteId]);


  // Actions
  const handleDelete = useCallback(async (id) => {
      // Optimistic Update
      setNotifications(prev => prev.filter(n => n.id !== id));
      setUnreadCount(prev => prev > 0 ? prev - 1 : 0); // Approx
      await deleteNotification(id);
  }, []);

  const handleMarkRead = useCallback(async (id) => {
      // Optimistic Update
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => prev > 0 ? prev - 1 : 0);
      await markNotificationRead(id);
  }, []);

  const handleClearAll = useCallback(async () => {
      if (!websiteId) return;
      if (!confirm("Delete all notifications?")) return;
      setNotifications([]);
      setUnreadCount(0);
      await clearAllNotifications(websiteId);
  }, [websiteId]);


  const value = {
      notifications,
      unreadCount,
      loading,
      deleteNotification: handleDelete,
      markRead: handleMarkRead,
      clearAll: handleClearAll,
      websiteId
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {popupNotification && (
          <StockAlertPopup 
              notification={popupNotification} 
              isOpen={!!popupNotification} 
              onClose={() => setPopupNotification(null)}
          />
      )}
    </NotificationContext.Provider>
  );
}
