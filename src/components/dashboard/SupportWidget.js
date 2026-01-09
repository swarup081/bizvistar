"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Bot, AlertTriangle, ExternalLink, GripHorizontal } from 'lucide-react';
import { findLayer1Match } from '@/lib/support-bot/intents';
import { useRouter } from 'next/navigation';
import { getSupportConfig } from '@/app/actions/supportActions';

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am the BizVistar Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contactFounderNumber, setContactFounderNumber] = useState("919876543210");
  const messagesEndRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
      // Fetch server-side config securely
      getSupportConfig().then(config => {
          if (config.contactFounder) {
              setContactFounderNumber(config.contactFounder);
          }
      });
  }, []);

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
        // Immediate response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: layer1Match.text,
                action: layer1Match.action
            }]);
            setIsLoading(false);
        }, 500); // Small fake delay for natural feel
        return;
      }

      // --- Layer 2: The AI Analyst (Server-Side) ---
      // Prepare messages for API (exclude actions, just content)
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
          setIsOpen(false); // Close widget on nav
          router.push(action.url);
      } else if (action.type === 'link') {
          window.open(action.url, '_blank');
      }
  };

  const renderMessageContent = (msg) => {
    // --- Layer 3: The Escalation Protocol ---
    if (msg.content === '[ESCALATE_TO_HUMAN]') {
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
                    href={`https://wa.me/${contactFounderNumber}?text=I%20need%20urgent%20help%20with%20my%20BizVistar%20account`}
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
                    <ExternalLink size={14} />
                    {msg.action.label}
                </button>
            )}
        </div>
    );
  };

  return (
    <>
      {/* Floating Button (Draggable) */}
      <motion.div
        drag
        dragMomentum={false}
        whileDrag={{ scale: 1.1 }}
        className="fixed bottom-6 right-6 z-[9999] cursor-move touch-none"
      >
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-4 bg-gradient-to-r from-[#8A63D2] to-[#6C4AB6] text-white rounded-full shadow-lg hover:shadow-xl transition-shadow outline-none"
        >
            {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </motion.div>

      {/* Chat Window (Draggable) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            drag
            dragMomentum={false}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 md:right-6 z-[9999] w-[calc(100vw-2rem)] md:w-[380px] h-[500px] max-h-[80vh] bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl flex flex-col overflow-hidden touch-none"
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
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs">Online</span>
                    </div>
                </div>
              </div>
              <button
                onClick={() => setMessages([{ role: 'assistant', content: 'Hi! I am the BizVistar Assistant. How can I help you today?' }])}
                className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"
              >
                Clear
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
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

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
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
    </>
  );
}
