"use client";
import React, { useState, useEffect } from 'react';
import { Tag, TrendingUp, Package, AlertTriangle, Zap, Sparkles, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const iconMap = {
  Tag: Tag,
  TrendingUp: TrendingUp,
  Package: Package,
  AlertTriangle: AlertTriangle,
  Zap: Zap
};

export default function AIPredictionCard({ websiteId }) {
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState(null);
  const [error, setError] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    async function fetchInsights() {
      if (!websiteId) return;
      try {
        setLoading(true);
        const res = await fetch('/api/analytics/ai-prediction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ websiteId })
        });
        
        const data = await res.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setInsight(data.data);
      } catch (err) {
        console.error("Failed to fetch AI insights:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchInsights();
  }, [websiteId]);

  return (
    <div id="ai-insights" className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col h-full w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
          AI Insights
        </h3>
        <span className="text-xs bg-brand-50 text-[#8A63D2] px-2 py-1 rounded-full font-medium border border-brand-100">Monthly AI</span>
      </div>

      {loading ? (
        <div className="flex-grow flex flex-col gap-5 w-full h-full min-h-[250px] animate-pulse">
          <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-2"></div>
          {[1, 2, 3].map((i) => (
             <div key={i} className="flex items-start gap-3 w-full bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="w-8 h-8 bg-gray-200 rounded-lg shrink-0 mt-0.5"></div>
                <div className="flex-1 space-y-2.5 py-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
             </div>
          ))}
        </div>
      ) : error || !insight ? (
        <div className="flex-grow flex items-center justify-center text-sm text-gray-400 min-h-[150px]">
          No insights available right now.
        </div>
      ) : (
        <div className="flex flex-col gap-4 flex-grow w-full">
          <p className="text-sm text-gray-600 mb-2 leading-relaxed font-medium">{insight.summary}</p>
          <div className="flex flex-col gap-3">
            {insight.recommendations?.map((rec, idx) => {
              const IconComponent = iconMap[rec.icon] || Sparkles;
              const isExpanded = expandedIndex === idx;

              return (
                <div 
                   key={idx} 
                   onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                   className="flex flex-col bg-brand-50/40 p-3 rounded-xl border border-brand-50 hover:bg-brand-50/80 hover:border-brand-100 transition-all cursor-pointer w-full group overflow-hidden"
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="mt-0.5 p-1.5 bg-white rounded-lg shadow-sm border border-gray-50 flex-shrink-0 group-hover:scale-105 transition-transform">
                      <IconComponent className="w-4 h-4 text-[#8A63D2]" />
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="text-sm font-semibold text-gray-800 break-words leading-snug">{rec.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{rec.description}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 mt-1 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                  
                  <AnimatePresence>
                     {isExpanded && (
                        <motion.div
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: 'auto', opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           transition={{ duration: 0.2 }}
                           className="overflow-hidden"
                        >
                           <div className="mt-3 ml-12 pr-2 pt-3 border-t border-brand-100/50">
                              <p className="text-xs text-gray-600 leading-relaxed font-medium italic">
                                 "{rec.detailed_insight || rec.description}"
                              </p>
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
