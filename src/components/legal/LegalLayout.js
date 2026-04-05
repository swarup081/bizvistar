import React from 'react';
import Link from 'next/link';

export function LegalLayout({ title, lastUpdated, children }) {
  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans">
      {/* Header Area */}
      <div className="pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto border-b border-gray-100">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        <p className="text-gray-500">Last Revised: {lastUpdated}</p>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="flex flex-col gap-12">
          {children}
        </div>
      </div>
    </div>
  );
}

export function LegalSection({ title, legalText, plainEnglish }) {
  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 border-b border-gray-100 pb-12 last:border-0">
      {/* Left Column: Legal Text */}
      <div className="w-full lg:w-2/3 prose prose-gray max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-li:text-gray-700">
        {title && <h2 className="text-2xl font-bold mb-6 text-gray-900">{title}</h2>}
        {legalText}
      </div>

      {/* Right Column: Plain English Summary (#TheBizvistarWay) */}
      <div className="w-full lg:w-1/3">
        {plainEnglish && (
          <div className="sticky top-24 bg-gray-50 rounded-2xl p-6 lg:p-8">
            <h3 className="text-lg font-bold mb-4 text-brand-600 flex items-center gap-2">
              <span className="text-[#8A63D2]">#TheBizvistarWay</span>
            </h3>
            <div className="text-gray-600 text-sm leading-relaxed space-y-4">
              {plainEnglish}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
