// src/components/ui/Section.js
import React from 'react';
import { cn } from '@/lib/utils';

export const Section = ({ children, className, background = 'transparent', spacing = 'md' }) => {
  const spacings = {
    none: 'py-0',
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-20', // Standard section
    lg: 'py-20 md:py-32', // Hero or large feature areas
  };

  return (
    <section className={cn(spacings[spacing], className)} style={{ backgroundColor: background }}>
      {children}
    </section>
  );
};