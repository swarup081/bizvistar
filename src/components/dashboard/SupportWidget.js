"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Bot, AlertTriangle, ExternalLink, GripHorizontal, LogIn } from 'lucide-react';
import { findLayer1Match } from '@/lib/support-bot/intents';
import { useRouter, usePathname } from 'next/navigation';
import { getSupportConfig } from '@/app/actions/supportActions';
import { createBrowserClient } from '@supabase/ssr';

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am the BizVistar Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contactFounderNumber, setContactFounderNumber] = useState(null); // Null initially
  const [user, setUser] = useState(null);
  
  const messagesEndRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  // Create client-side supabase instance
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
      // 1. Fetch server-side config securely (only if user logged in, strictly speaking, but the number is useless without auth logic)
      getSupportConfig().then(config => {
          if (config.contactFounder) {
              setContactFounderNumber(config.contactFounder);
          }
      });

      // 2. Check Auth Status
      const checkUser = async () => {
          const { data: { session } } = await supabase.auth.getSession();
          setUser(session?.user || null);
      };
      checkUser();

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user || null);
      });

      return () => subscription.unsubscribe();
  }, [supabase]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    
    // Add User Message
    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // --- Layer 1: The Silent Guard (Browser-Side) ---
      const layer1Match = findLayer1Match(userText);

      if (layer1Match) {
        setTimeout(() => {
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: layer1Match.text,
                action: layer1Match.action 
            }]);
            setIsLoading(false);
        }, 500); 
        return;
      }

      // --- Auth Check for Layer 2 & 3 ---
      if (!user) {
          // If not logged in and no Layer 1 match -> Block Access
          setTimeout(() => {
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: "I can help with basic questions, but for advanced AI support or to contact the founder, please **Sign In** to your account.",
                action: { type: 'navigate', label: 'Sign In / Register', url: '/sign-in' }
            }]);
            setIsLoading(false);
          }, 500);
          return;
      }

      // --- Layer 2: The AI Analyst (Server-Side) ---
      const apiMessages = newMessages.map(msg => ({
          role: msg.role,
          content: msg.content
      }));

      const response = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await response.json();

      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting right now. Please try again later." }]);
      }

    } catch (error) {
      console.error("Support Widget Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Something went wrong. Please check your internet connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action) => {
      if (action.type === 'navigate') {
          setIsOpen(false);
          router.push(action.url);
      } else if (action.type === 'link') {
          window.open(action.url, '_blank');
      }
  };

  // Hide widget on public sites or templates
  // Assuming paths like /site/[slug] or /preview/[template] are public
  if (pathname?.startsWith('/site/') || pathname?.startsWith('/preview/')) {
    return null;
  }

  const renderMessageContent = (msg) => {
    // --- Layer 3: The Escalation Protocol ---
    // Strict check: Only show if user is logged in
    if (msg.content === '[ESCALATE_TO_HUMAN]') {
        if (!user) return null; // Should not happen due to logic above, but safe guard

        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2 mt-2">
                <div className="flex items-center gap-2 text-red-700 font-semibold">
                    <AlertTriangle size={18} />
                    <span>Urgent Issue</span>
                </div>
                <p className="text-sm text-red-600">
                    I see this is an urgent issue. Please chat directly with the Founder.
                </p>
                <a 
                    href={`https://wa.me/${contactFounderNumber || '919876543210'}?text=I%20need%20urgent%20help%20with%20my%20BizVistar%20account`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-2 rounded-md text-sm font-medium transition-colors"
                >
                    <MessageCircle size={16} />
                    Chat on WhatsApp
                </a>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {/* Render simple markdown-like bold text */}
            <p className="whitespace-pre-wrap leading-relaxed">
                {msg.content.split('**').map((part, i) => 
                    i % 2 === 1 ? <span key={i} className="font-bold text-[#8A63D2]">{part}</span> : part
                )}
            </p>
            {msg.action && (
                <button
                    onClick={() => handleActionClick(msg.action)}
                    className="flex items-center gap-2 text-xs font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-2 rounded-md transition-colors w-fit border border-purple-100 mt-2"
                >
                    {msg.action.url?.includes('http') ? <ExternalLink size={14} /> : <LogIn size={14} />}
                    {msg.action.label}
                </button>
            )}
        </div>
    );
  };

  return (
    // Unified Draggable Container
    <motion.div
        drag
        dragMomentum={false}
        whileDrag={{ scale: 1.02 }}
        className="fixed bottom-6 right-6 z-[9999] touch-none flex flex-col items-end"
    >
        <AnimatePresence mode="wait">
            {!isOpen ? (
                 <motion.button
                    key="button"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    onClick={() => setIsOpen(true)}
                    className="p-4 bg-gradient-to-r from-[#8A63D2] to-[#6C4AB6] text-white rounded-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                >
                    <MessageCircle size={24} />
                </motion.button>
            ) : (
                <motion.div
                    key="window"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="w-[calc(100vw-2rem)] md:w-[380px] h-[500px] max-h-[80vh] bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl flex flex-col overflow-hidden"
                >
                    {/* Header (Drag Handle) */}
                    <div className="p-4 bg-gradient-to-r from-[#8A63D2] to-[#6C4AB6] text-white flex items-center justify-between cursor-move">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">BizVistar Assistant</h3>
                                <div className="flex items-center gap-1.5 opacity-80">
                                    <span className={`w-1.5 h-1.5 rounded-full ${user ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`} />
                                    <span className="text-xs">{user ? 'Online' : 'Guest Mode'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setMessages([{ role: 'assistant', content: 'Hi! I am the BizVistar Assistant. How can I help you today?' }])}
                                className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"
                            >
                                Clear
                            </button>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:text-gray-200"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area (Stop Propagation so we can select text without dragging window) */}
                    <div 
                        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 cursor-auto"
                        onPointerDown={(e) => e.stopPropagation()} 
                    >
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                                    msg.role === 'user'
                                        ? 'bg-[#8A63D2] text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                    }`}
                                >
                                    {renderMessageContent(msg)}
                                </div>
                            </motion.div>
                        ))}
                        
                        {isLoading && (
                            <div className="flex justify-start">
                            <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area (Stop Propagation) */}
                    <form 
                        onSubmit={handleSendMessage} 
                        className="p-3 bg-white border-t border-gray-100 flex gap-2 cursor-auto"
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={user ? "Type your question..." : "Guest mode: Basic questions only"}
                            className="flex-1 px-4 py-2 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#8A63D2]/50 transition-all placeholder:text-gray-400"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="p-2 bg-[#8A63D2] text-white rounded-full hover:bg-[#7854C5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
  );
}
