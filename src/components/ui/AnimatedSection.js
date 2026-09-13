'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function AnimatedSection({ children, className, id, style }) {
    // Default to true during SSR to render a plain section and avoid hydration mismatch.
    // This also keeps animations disabled in the editor (if in an iframe).
    const [isEditor, setIsEditor] = useState(true);

    useEffect(() => {
        // If we are NOT in an iframe (or if we are, but want to check specifically),
        // window.parent === window means it's the live site.
        // Wait, some previews might be in an iframe. Let's just enable animations 
        // if we are NOT in the dashboard/editor route.
        const isLive = window.location.pathname.startsWith('/preview') || window.parent === window;
        if (isLive) {
            setIsEditor(false);
        }
    }, []);

    if (isEditor) {
        return (
            <section id={id} className={className} style={style}>
                {children}
            </section>
        );
    }

    return (
        <motion.section
            id={id}
            className={className}
            style={style}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {children}
        </motion.section>
    );
}
