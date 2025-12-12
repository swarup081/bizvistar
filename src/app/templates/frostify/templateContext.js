'use client';
import { createContext, useContext } from 'react';

export const TemplateContext = createContext(null);

export const useTemplateContext = () => {
    const context = useContext(TemplateContext);
    if (!context) {
        throw new Error('useTemplateContext must be used within a TemplateProvider');
    }
    return context;
};