"use client";
import React, { useState, useEffect } from 'react';
import { Tag, TrendingUp, Package, AlertTriangle, Zap, Sparkles } from 'lucide-react';

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
          <Sparkles className="w-5 h-5 text-[#8A63D2]" />
          AI Insights
        </h3>
        <span className="text-xs bg-purple-50 text-[#8A63D2] px-2 py-1 rounded-full font-medium">Monthly AI</span>
      </div>

      {loading ? (
        <div className="flex-grow flex flex-col gap-4 w-full h-full min-h-[150px] animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="flex items-start gap-3 w-full">
             <div className="w-8 h-8 bg-gray-200 rounded-lg shrink-0"></div>
             <div className="flex-1 space-y-2">
                 <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                 <div className="h-3 bg-gray-200 rounded w-full"></div>
             </div>
          </div>
          <div className="flex items-start gap-3 w-full">
             <div className="w-8 h-8 bg-gray-200 rounded-lg shrink-0"></div>
             <div className="flex-1 space-y-2">
                 <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                 <div className="h-3 bg-gray-200 rounded w-full"></div>
             </div>
          </div>
        </div>
      ) : error || !insight ? (
        <div className="flex-grow flex items-center justify-center text-sm text-gray-400 min-h-[150px]">
          No insights available right now.
        </div>
      ) : (
        <div className="flex flex-col gap-4 flex-grow w-full">
          <p className="text-sm text-gray-600 mb-2 leading-relaxed">{insight.summary}</p>
          <div className="flex flex-col gap-3">
            {insight.recommendations?.map((rec, idx) => {
              const IconComponent = iconMap[rec.icon] || Sparkles;
              return (
                <div key={idx} className="flex items-start gap-3 bg-purple-50/50 p-3 rounded-xl border border-purple-50/80 hover:bg-purple-50 transition-colors w-full">
                  <div className="mt-0.5 p-1.5 bg-white rounded-lg shadow-sm">
                    <IconComponent className="w-4 h-4 text-[#8A63D2]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-800 truncate">{rec.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed overflow-hidden text-ellipsis line-clamp-2">{rec.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
