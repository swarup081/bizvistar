// src/components/ui/Container.js
import React from 'react';
import { cn } from '@/lib/utils'; // Assuming you have a clsx/tailwind-merge utility

export const Container = ({ children, className, size = 'lg' }) => {
  const sizes = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[1920px]', // Matches Aurora's wide layout
    full: 'max-w-full',
  };

  return (
    <div className={cn("mx-auto px-4 sm:px-6 lg:px-8 w-full", sizes[size], className)}>
      {children}
    </div>
  );
};