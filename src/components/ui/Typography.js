// src/components/ui/Typography.js
import React from 'react';
import { cn } from '@/lib/utils';

export const Heading = ({ children, level = 2, className, variant = 'serif' }) => {
  const Tag = `h${level}`;
  
  const styles = {
    1: "text-4xl md:text-6xl font-bold tracking-tight",
    2: "text-3xl md:text-5xl font-bold", // Standard Section Title
    3: "text-2xl md:text-3xl font-semibold", // Card Titles
    4: "text-xl font-medium",
  };

  const fonts = {
    serif: "font-serif", // For Aurora/Blissly vibes
    sans: "font-sans",   // For Avenix/Modern vibes
  };

  return (
    <Tag className={cn(styles[level], fonts[variant], "text-gray-900", className)}>
      {children}
    </Tag>
  );
};

export const Text = ({ children, size = 'base', className, muted = false }) => {
  const sizes = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg leading-relaxed",
    xl: "text-xl font-light", // Used in Aurora intros
  };

  return (
    <p className={cn(sizes[size], muted ? "text-gray-500" : "text-gray-700", className)}>
      {children}
    </p>
  );
};