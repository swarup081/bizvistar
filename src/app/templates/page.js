'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// --- Data for the templates ---
const templates = [
  {
    title: 'Parlence',
    description: 'Focus on a single to promote upcoming releases with a coming soon approach that has a modern layout.',
    url: '/templates/flavornest',
    previewUrl: '/preview/flavornest', // Added leading slash for consistency
  },
  {
    title: 'Lanily',
    description: 'Give site visitors eye-catching design, appointment booking, and shopping in one seamless experience.',
    url: '/templates/flara',
    previewUrl: '/preview/flara', // Added leading slash for consistency
  },
  {
    title: 'Karl Bewick',
    description: 'A bold, minimalist portfolio template to showcase your creative work and professional journey.',
    url: '/templates/karl-bewick',
    previewUrl: '/preview/flavornest', // Added leading slash for consistency
  },
  {
    title: 'Factory',
    description: 'A modern, dark-themed storefront perfect for apparel brands and high-end fashion retailers.',
    url: '/templates/factory',
    previewUrl: '/preview/flavornest', // Added leading slash for consistency
  },
  {
    title: 'XYZ Store',
    description: 'A modern, dark-themed storefront perfect for apparel brands and high-end fashion retailers.',
    url: '/templates/xyz',
    previewUrl: '/preview/flavornest', // Added leading slash for consistency
  }
];

// --- Reusable Template Card Component with Animation ---
// FIX: Added 'previewUrl' to the component's props destructuring
const TemplateCard = ({ title, description, url, previewUrl }) => {
  return (
    <motion.div
      className="group max-w-xl cursor-pointer"
      whileHover="hover"
      initial="initial"
      animate="initial"
    >
      {/* Container for the visual part (iframes). */}
      <div className="relative h-[320px]">

        {/* Mobile View - Positioned BEHIND the desktop view */}
        <motion.div
          className="absolute bottom-0 right-[-60px] z-0 w-[140px] h-[260px] transform overflow-hidden rounded-2xl bg-white shadow-lg p-1.5 pt-6"
          style={{ transformOrigin: "bottom right" }}
          variants={{
            initial: {
              x: -25,
              zIndex: 0,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
            },
            hover: {
              x: [-25, 45, -30],
              zIndex: [0, 0, 20],
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              transition: {
                duration: 0.7,
                ease: "easeInOut",
                times: [0, 0.5, 1]
              },
            },
          }}
        >
          <div className="w-full h-full overflow-hidden rounded-b-xl bg-white">
            <iframe
              src={url}
              className="w-[350px] h-[667px] origin-top-left scale-[0.37] transform pointer-events-none"
              scrolling="no"
              title={`${title} Mobile Preview`}
            />
          </div>
        </motion.div>

        {/* Desktop View - Positioned IN FRONT of the mobile view */}
        <motion.div
          className="absolute left-0 top-0 z-10 h-[320px] w-[500px] overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-xl p-1 pt-7"
          style={{ transformOrigin: "bottom left" }}
          variants={{
            initial: {
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.30)"
            },
            hover: {
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
            }
          }}
        >
          <div className="w-full h-full overflow-hidden rounded-b-xl bg-white">
            <iframe
              src={url}
              className="w-[1280px] h-[750px] origin-top-left scale-[0.39] transform pointer-events-none"
              scrolling="no"
              title={`${title} Desktop Preview`}
            />
          </div>
        </motion.div>
      </div>

      {/* --- Hover Info Block --- */}
      <div className="mt-8 min-h-[140px] transform px-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="mt-2 text-base leading-relaxed text-gray-600">{description}</p>
        <div className="mt-6 flex items-center gap-3">
            <Link href={`${url}/edit`}>
              <button className="rounded-lg bg-gray-900 px-6 py-2.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-gray-800">
                  Start Editing
              </button>
            </Link>
            <Link href={previewUrl} target="_blank" rel="noopener noreferrer">
                <button className="rounded-lg bg-white px-6 py-2.5 text-base font-semibold text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-50">
                    Preview Site
                </button>
            </Link>
        </div>
      </div>
    </motion.div>
  );
};


// --- Main Page ---
export default function TemplatesPage() {
  const [storeName, setStoreName] = useState("Your Business");

  useEffect(() => {
    const storedStoreName = localStorage.getItem('storeName');
    if (storedStoreName) {
      setStoreName(storedStoreName);
    }
  }, []);

  return (
    <div className="bg-white font-sans">
      <div className="mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Choose a Template for {storeName}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-xl text-gray-600">
                Each template is professionally designed to be the perfect starting point for your new website.
            </p>
        </div>

        {/* Updated Grid Container */}
        <div className="mt-24 grid grid-cols-1 justify-items-start gap-x-16 gap-y-24 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-28 pl-6">
          {templates.map((template, index) => (
            <TemplateCard key={`${template.title}-${index}`} {...template} />
          ))}
        </div>
      </div>

       {/* Floating Contact Us Button */}
       <button className="fixed bottom-8 right-8 z-50 flex items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-gray-800 shadow-lg ring-1 ring-inset ring-gray-200 transition-transform hover:scale-105">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
            Contact Us
       </button>
    </div>
  );
}