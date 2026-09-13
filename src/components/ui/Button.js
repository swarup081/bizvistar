// src/components/ui/Button.js
import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', // primary, secondary, outline, ghost
  size = 'md', // sm, md, lg
  className = '', 
  icon: Icon,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm", // Used in Editor Publish
    secondary: "bg-gray-900 text-white hover:bg-gray-800", // Used in Aurora
    outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50", // Used in Editor
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900", // Used in Nav
    danger: "bg-red-600 text-white hover:bg-red-700", // Used in Delete actions
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    icon: "p-2", // For icon-only buttons
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {Icon && <Icon className={`w-4 h-4 ${children ? 'mr-2' : ''}`} />}
      {children}
    </button>
  );
};