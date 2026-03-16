"use client";
import React from 'react';
import { Sparkles, TrendingUp, Package, Tag, AlertCircle } from 'lucide-react';

export default function PredictionCard({ prediction }) {
  if (!prediction) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col justify-center items-center text-center">
         <Sparkles className="h-8 w-8 text-gray-300 mb-2" />
         <p className="text-gray-500 text-sm font-medium">Generating AI Insights...</p>
      </div>
    );
  }

  const getIcon = (type) => {
      switch(type) {
          case 'stock': return <Package className="h-4 w-4 text-[#8A63D2]" />;
          case 'offer': return <Tag className="h-4 w-4 text-[#4CAF50]" />;
          case 'marketing': return <TrendingUp className="h-4 w-4 text-[#FF9800]" />;
          default: return <AlertCircle className="h-4 w-4 text-blue-500" />;
      }
  };

  const insights = prediction.actionableInsights || [];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 font-sans flex items-center gap-2">
             <Sparkles className="h-5 w-5 text-[#8A63D2]" />
             AI Insights & Predictions
          </h3>
          <span className="text-xs font-medium bg-purple-50 text-[#8A63D2] px-2 py-1 rounded-full">Updated Monthly</span>
      </div>

      <p className="text-sm text-gray-600 mb-6">{prediction.summary}</p>

      <div className="space-y-4 flex-grow">
          {insights.map((insight, idx) => (
             <div key={idx} className="flex gap-3 items-start border-l-2 border-[#8A63D2] pl-3">
                 <div className="mt-0.5 bg-gray-50 p-1.5 rounded-md">
                    {getIcon(insight.type)}
                 </div>
                 <div>
                     <h4 className="text-sm font-bold text-gray-900">{insight.title}</h4>
                     <p className="text-xs text-gray-500 mt-1">{insight.description}</p>
                 </div>
             </div>
          ))}
      </div>

      {prediction.predictedRevenueNextMonth && (
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500 font-medium">Predicted Revenue Next Month:</span>
              <span className="text-lg font-bold text-gray-900">₹{Number(prediction.predictedRevenueNextMonth).toLocaleString()}</span>
          </div>
      )}
    </div>
  );
}
