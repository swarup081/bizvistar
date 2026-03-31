"use client";

import { cn } from "@/lib/utils"
import { Marquee } from "@/components/marquee"

// 1. TEMPLATE DATA
const templates = [
  { slug: "aurora", isMobile: false },
  { slug: "avenix", isMobile: true },
  { slug: "blissly", isMobile: false },
  { slug: "flara", isMobile: false },
  { slug: "flavornest", isMobile: true },
  { slug: "frostify", isMobile: false }
]

const firstRow = templates.slice(0, 3)
const secondRow = templates.slice(3, 6)

// 2. TEMPLATE CARD COMPONENT
const TemplateCard = ({ slug, isMobile }) => {
  
  // Dynamically generate the image URL based on slug and mobile status
  const imageUrl = `/templatemarquee/${slug}${isMobile ? 'mobile' : ''}.png`;
  const redirectUrl = `/preview/${slug}`;

  // --- Dynamic Styles based on device type ---
  const cardDimensions = isMobile 
    ? "h-[350px] w-[160px]" 
    : "h-[350px] w-[480px]";

  // --- Main Card Render ---
  return (
    <div 
      onClick={() => window.open(redirectUrl, '_blank', 'noopener,noreferrer')}
      className={cn(
        "group relative mx-4 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-white/10",
        cardDimensions
      )}
    >
      {/* Invisible layer to ensure smooth hover states */}
      <div className="absolute inset-0 z-10" />
      
      {/* HOVER OVERLAY */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
        <div className="flex flex-col items-center gap-4 translate-y-4 transition-transform duration-300 ease-in-out group-hover:translate-y-0">
          
          {/* Start Editing Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation(); 
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
      
      {/* Template Image Placeholder */}
      <img
        src={imageUrl}
        alt={`${slug} template preview`}
        className="pointer-events-none absolute left-0 top-0 h-full w-full object-cover object-top"
        loading="lazy"
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