'use client';

import { Bell, Trash2, CheckCircle, Package, AlertTriangle, Info, X } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useNotifications } from '@/components/dashboard/notifications/NotificationManager';

const NotificationBell = () => {
    const { notifications, unreadCount, deleteNotification, markRead, clearAll } = useNotifications();

    const getIcon = (type) => {
        switch (type) {
            case 'new_order': return <Package size={16} className="text-blue-500" />;
            case 'low_stock': return <AlertTriangle size={16} className="text-orange-500" />;
            case 'out_of_stock': return <AlertTriangle size={16} className="text-red-500" />;
            default: return <Info size={16} className="text-gray-500" />;
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'new_order': return 'bg-blue-50';
            case 'low_stock': return 'bg-orange-50';
            case 'out_of_stock': return 'bg-red-50';
            default: return 'bg-gray-50';
        }
    };

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button className="relative p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#8A63D2]/20">
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content 
                    align="end" 
                    className="w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden mt-2 mr-2"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                        <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                        {notifications.length > 0 && (
                            <button 
                                onClick={(e) => { e.preventDefault(); clearAll(); }}
                                className="text-xs text-red-600 hover:text-red-700 font-medium hover:underline flex items-center gap-1"
                            >
                                <Trash2 size={12} /> Clear All
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                    <Bell size={20} className="text-gray-300" />
                                </div>
                                <p className="text-sm font-medium text-gray-900">All caught up!</p>
                                <p className="text-xs text-gray-500 mt-1">No new notifications at the moment.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((notif) => (
                                    <DropdownMenu.Item 
                                        key={notif.id}
                                        className={`group relative flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer outline-none ${!notif.is_read ? 'bg-purple-50/30' : ''}`}
                                        onSelect={(e) => e.preventDefault()}
                                        onClick={() => markRead(notif.id)}
                                    >
                                        <div className={`h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center ${getBgColor(notif.type)}`}>
                                            {getIcon(notif.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className={`text-sm font-semibold truncate ${!notif.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                                                    {notif.title}
                                                </p>
                                                <span className="text-[10px] text-gray-400 flex-shrink-0">
                                                    {new Date(notif.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                            <p className={`text-xs mt-0.5 line-clamp-2 ${!notif.is_read ? 'text-gray-600 font-medium' : 'text-gray-500'}`}>
                                                {notif.message}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-1 absolute right-2 top-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                                title="Delete"
                                            >
                                                <X size={14} />
                                            </button>
                                            {!notif.is_read && (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); markRead(notif.id); }}
                                                    className="p-1.5 text-gray-400 hover:text-purple-500 hover:bg-purple-50 rounded-full transition-all"
                                                    title="Mark as read"
                                                >
                                                    <CheckCircle size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </DropdownMenu.Item>
                                ))}
                            </div>
                        )}
                    </div>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};

export default NotificationBell;
