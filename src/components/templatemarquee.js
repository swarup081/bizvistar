"use client";

import { cn } from "@/lib/utils"
import { Marquee } from "@/components/marquee"

// 1. TEMPLATE DATA (Using slugs to build distinct URLs)
const templates = [
  { slug: "aurora", isMobile: false },
  { slug: "avenix", isMobile: true },
  { slug: "blissly", isMobile: false },
  { slug: "flara", isMobile: true },
  { slug: "flavornest", isMobile: false },
  { slug: "frostify", isMobile: false }
]

const firstRow = templates.slice(0, 3)
const secondRow = templates.slice(3, 6)

// 2. TEMPLATE IFRAME CARD COMPONENT
const TemplateCard = ({ slug, isMobile }) => {
  
  // Set the distinct URLs based on the slug
  const iframeUrl = `/templates/${slug}`;
  const redirectUrl = `/preview/${slug}`;

  // --- Dynamic Styles based on device type ---
  const cardDimensions = isMobile 
    ? "h-[350px] w-[160px]" 
    : "h-[350px] w-[480px]";

  const iframeStyles = isMobile 
    ? { width: "320px", height: "700px", transform: "scale(0.5)", transformOrigin: "top left" }
    : { width: "400%", height: "400%", transform: "scale(0.25)", transformOrigin: "top left" };

  // --- Main Card Render ---
  return (
    <div 
      // Click anywhere on the card to open the /preview/ URL
      onClick={() => window.open(redirectUrl, '_blank', 'noopener,noreferrer')}
      // The 'group' class ensures hover states only apply to THIS specific card
      className={cn(
        "group relative mx-4 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-white/10",
        cardDimensions
      )}
    >
      {/* Invisible layer blocks iframe from stealing mouse events */}
      <div className="absolute inset-0 z-10" />
      
      {/* HOVER OVERLAY 
        (Inlined directly here to fix the hover isolation bug) 
      */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100">
        <div className="flex flex-col items-center gap-4 translate-y-4 transition-transform duration-300 ease-in-out hover:translate-y-0">
          
          {/* Start Editing Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Stops the card's redirect from firing
              console.log("Start editing clicked for", slug);
            }}
            className={cn(
              "flex items-center justify-center rounded-lg bg-white font-bold text-gray-900 shadow-xl transition-transform hover:scale-105",
              isMobile ? "px-6 py-2.5 text-sm" : "px-8 py-3.5 text-lg"
            )}
          >
            Start Editing
          </button>

          {/* Preview Text Indicator */}
          <span 
            className={cn(
              "font-semibold tracking-wide text-white transition-colors hover:text-gray-300",
              isMobile ? "text-sm" : "text-lg"
            )}
          >
            Click to Preview
          </span>
          
        </div>
      </div>
      
      {/* Background iframe loading the /template/ URL */}
      <iframe
        src={iframeUrl}
        style={iframeStyles}
        className="pointer-events-none absolute left-0 top-0 border-0 bg-white"
        tabIndex="-1"
        scrolling="no"
      />
    </div>
  )
}

// 3. MAIN EXPORT COMPONENT
export default function TemplatesShowcaseUI() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-10">
      <Marquee pauseOnHover className="[--duration:40s] mb-6">
        {firstRow.map((template, index) => (
          <TemplateCard key={`row1-${template.slug}-${index}`} {...template} />
        ))}
      </Marquee>

      <Marquee reverse pauseOnHover className="[--duration:40s]">
        {secondRow.map((template, index) => (
          <TemplateCard key={`row2-${template.slug}-${index}`} {...template} />
        ))}
      </Marquee>
    </div>
  )
}