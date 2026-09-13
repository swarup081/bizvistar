// src/components/ui/GridBackground.js
import React from "react";

export const GridBackground = ({ children }) => {
  return (
    <div className="relative w-full min-h-[50vh] flex items-center justify-center bg-gray-50 overflow-hidden">
      {/* Radial Gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-50 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.05)_0%,transparent_65%)]" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 [background-size:58px_58px] [background-image:linear-gradient(to_right,#d1d5db_1px,transparent_1px),linear-gradient(to_bottom,#d1d5db_1px,transparent_1px)] opacity-50" />

      {/* Fade Mask */}
      <div className="pointer-events-none absolute inset-0 bg-gray-50 [mask-image:radial-gradient(ellipse_at_center,transparent_-78%,white)]" />

      {/* Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};