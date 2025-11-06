'use client';
import { createContext, useContext } from 'react';

// Create a context to hold the dynamic businessData
export const TemplateContext = createContext(null);

// Custom hook to easily use the template context
export const useTemplateContext = () => {
    const context = useContext(TemplateContext);
    if (!context) {
        throw new Error('useTemplateContext must be used within a TemplateProvider');
    }
    return context;
};