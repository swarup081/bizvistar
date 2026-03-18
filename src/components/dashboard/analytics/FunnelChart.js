"use client";
import React from 'react';

export default function FunnelChart({ data }) {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const themeColors = ['#F5F3FF', '#EDE9FE', '#DDD6FE', '#C4B5FD', '#A78BFA'];


  const purchases = data.find(d => d.name === 'Completed Purchases')?.value || 0;
  const productViews = data.find(d => d.name === 'Product Views')?.value || 1; // Prevent div/0
  let conversionRate = ((purchases / productViews) * 100).toFixed(1);
  if (isNaN(conversionRate) || conversionRate === "Infinity") conversionRate = "0.0";

  return (
    <div id="funnel-chart" className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col h-full w-full">
      <div className="flex justify-between items-center mb-10">
        <h3 className="font-semibold text-gray-900 text-lg">Conversion Funnel</h3>
        <span className="text-xs font-semibold bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-100 flex items-center gap-1">
           <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
           {conversionRate}% Conv. Rate
        </span>
      </div>


      <div className="flex-grow flex items-end justify-between relative w-full h-48 mt-12 overflow-visible">
        {data.map((step, index) => {
          const heightPercent = step.value === 0 ? 5 : (step.value / maxVal) * 100;
          const bgCol = themeColors[index % themeColors.length];

          return (
            <div key={step.name} className="flex flex-col items-center justify-end h-full w-full group relative px-1">

              <div className="absolute -top-12 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-gray-900 text-white shadow-lg rounded-lg px-3 py-1.5 pointer-events-none transform -translate-y-2 text-xs whitespace-nowrap">
                 <span className="font-semibold">{step.value.toLocaleString()} users</span>
                 <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>

              <div className="absolute top-[-90px] w-full flex flex-col items-start px-2 z-10">
                 <span className="text-[11px] font-medium text-gray-500 leading-tight h-8 flex items-start w-full break-words whitespace-normal">
                     {step.name}
                 </span>
                 <span className="text-lg font-bold text-gray-900 mt-1">{step.value.toLocaleString()}</span>

                 {step.trend && (
                   <span className={`text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded flex items-center w-max ${
                       step.trend.startsWith('+') ? 'text-[#4CAF50] bg-green-50' : 'text-red-500 bg-red-50'
                   }`}>
                       {step.trend}
                   </span>
                 )}
              </div>

              <div className="w-full h-full flex items-end">
                <div
                   className="w-full rounded-t-lg transition-all duration-500 ease-out hover:brightness-95 mx-auto"
                   style={{
                     height: `${heightPercent}%`,
                     backgroundColor: bgCol,
                     maxWidth: '85%'
                   }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
