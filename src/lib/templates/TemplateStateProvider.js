'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { TemplateContext } from './TemplateContext';

export function TemplateStateProvider({ children, serverData, websiteId, initialBusinessData, templateName }) {
    const [businessData, setBusinessData] = useState(serverData || initialBusinessData);
    const router = useRouter();
    const pathname = usePathname();

    // Base Path Logic
    let basePath = `/templates/${templateName}`;
    if (serverData) {
        if (pathname && pathname.startsWith('/site/')) {
            const parts = pathname.split('/');
            if (parts.length >= 3) {
                 basePath = `/${parts[1]}/${parts[2]}`;
            }
        } else {
             basePath = '.';
        }
    }

    useEffect(() => {
        // Theme Logic (shared)
        if (businessData?.theme?.colorPalette) {
            document.body.classList.forEach(className => {
                if (className.startsWith('theme-')) {
                    document.body.classList.remove(className);
                }
            });
            document.body.classList.add(`theme-${businessData.theme.colorPalette}`);
        }

         // Font Logic (shared)
        if (businessData?.theme?.font) {
            document.body.style.fontFamily = `'${businessData.theme.font.body}', sans-serif`;
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            headings.forEach(heading => {
                heading.style.fontFamily = `'${businessData.theme.font.heading}', serif`;
            });
        }

        if (serverData) return;

        let parentPath = '';
        try { parentPath = window.parent.location.pathname; } catch (e) { }
        const isEditor = parentPath.startsWith('/editor/') || parentPath.startsWith('/dashboard/website');
        const isPreview = parentPath.startsWith('/preview/');
        const isLiveSite = !isEditor && !isPreview;

        if (isEditor) {
            const handleMessage = (event) => {
                if (event.data.type === 'UPDATE_DATA') setBusinessData(event.data.payload);
                if (event.data.type === 'SCROLL_TO_SECTION') {
                    const element = document.getElementById(event.data.payload.sectionId);
                    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                if (event.data.type === 'CHANGE_PAGE') router.push(event.data.payload.path);
            };
            window.addEventListener('message', handleMessage);
            window.parent.postMessage({ type: 'IFRAME_READY' }, '*');
            return () => window.removeEventListener('message', handleMessage);
        } else if (isPreview) {
            const savedData = localStorage.getItem(`editorData_${templateName}`);
            if (savedData) {
                try { setBusinessData(JSON.parse(savedData)); } catch (e) {}
            }
        } else if (isLiveSite) {
            const storedStoreName = localStorage.getItem('storeName');
            if (storedStoreName) {
                setBusinessData(prevData => ({
                    ...prevData,
                    name: storedStoreName,
                    logoText: storedStoreName,
                    footer: {
                        ...prevData.footer,
                        copyright: `© ${new Date().getFullYear()} ${storedStoreName}. All Rights Reserved.`
                    }
                }));
            }
        }
    }, [businessData.theme?.colorPalette, businessData.theme?.font?.body, businessData.theme?.font?.heading, router, serverData, templateName]);

    return (
        <TemplateContext.Provider value={{ businessData, setBusinessData, websiteId, basePath }}>
            {children}
        </TemplateContext.Provider>
    );
}
