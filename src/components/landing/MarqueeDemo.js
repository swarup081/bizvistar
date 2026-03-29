import { cn } from "@/lib/utils"
import { Marquee } from "@/components/marquee"

// 1. UNIQUE B2B SAAS & WEBSITE BUILDER REVIEWS
const reviews = [
  {
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    headline: "Built our B2B portal in days",
    authorName: "Rohan M. - Manufacturing Hub, Pune",
    attribution: "-- Verified Client",
    body: "We needed a secure catalog site for our wholesale distributors. This builder allowed us to drag-and-drop a professional B2B site without hiring an expensive agency. Outstanding SaaS platform.",
  },
  {
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    headline: "Perfect for our agency clients",
    authorName: "Anjali S. - Growth Agency, Bengaluru",
    attribution: "-- Trustpilot review",
    body: "We use this website builder for all our local business clients. The client management dashboard, fast hosting, and SEO tools make it the best B2B software investment we've made this year.",
  },
  {
    avatarUrl: "https://randomuser.me/api/portraits/men/65.jpg",
    headline: "Scaled our lead generation.",
    authorName: "Vikram K. - IT Consultancy, Chennai",
    attribution: "-- Verified Client",
    body: "As a B2B service provider, our website is our main sales funnel. The templates are highly optimized for conversions. Our enterprise lead capture rate has doubled since migrating to this platform.",
  },
  {
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    headline: "Zero downtime, pure speed.",
    authorName: "Priya D. - SaaS Founder, Delhi",
    attribution: "-- Capterra Review",
    body: "We moved our startup's marketing site here. The infrastructure is rock solid. No more worrying about plugin updates or server crashes—just a brilliant, cloud-based website builder that actually scales.",
  },
  {
    avatarUrl: "https://randomuser.me/api/portraits/men/75.jpg",
    headline: "Incredibly intuitive interface.",
    authorName: "Sanjay R. - Logistics Partner, Mumbai",
    attribution: "-- Google Review",
    body: "I have zero coding experience, but setting up our company website was seamless. The built-in forms connect straight to our CRM, streamlining how we onboard new corporate transport clients.",
  },
]

const firstRow = reviews.slice(0, 3)
const secondRow = reviews.slice(3, 5)

// 2. HELPER STAR RATING COMPONENT
const Stars = () => {
  return (
    <div className="flex flex-row items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className="size-4 fill-brand-500 text-brand-500"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545-4.755-4.633 6.572-.955L10 0l2.938 5.957 6.572.955-4.755 4.633 1.123 6.545z" />
        </svg>
      ))}
    </div>
  )
}

// 3. SCALED DOWN REVIEW CARD
const ReviewCard = ({
  avatarUrl,
  headline,
  authorName,
  attribution,
  body,
}) => {
  return (
    <figure
      className={cn(
        // Reduced width (350px), padding (p-6), and slightly smaller border radius
        "relative h-full w-[420px] mx-4 cursor-pointer overflow-hidden rounded-xl border p-5 shadow-sm transition-all duration-300",
        "border-gray-100 bg-white hover:bg-gray-50",
        "dark:border-white/10 dark:bg-gray-900 dark:hover:bg-gray-800"
      )}
    >
      {/* Top Header: Scaled down avatar and text */}
      <div className="flex items-center gap-4">
        <img
          className="size-14 rounded-full object-cover border border-gray-100 dark:border-white/10"
          width="56"
          height="56"
          alt={authorName}
          src={avatarUrl}
        />
        <div className="flex flex-col flex-1">
          <figcaption className="text-lg font-bold text-gray-950 dark:text-white leading-tight">
            {headline}
          </figcaption>
          <p className="mt-0.5 text-xs font-medium text-gray-600 dark:text-gray-400">
            {authorName}
          </p>
        </div>
      </div>

      {/* Middle Row: Tighter spacing */}
      <div className="mt-4 flex flex-row items-center justify-between  pt-1 dark:border-white/10">
        <Stars />
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {attribution}
        </span>
      </div>

      {/* Bottom Body: Smaller text size */}
      <blockquote className="mt-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        {body}
      </blockquote>
    </figure>
  )
}

// 4. MAIN EXPORT COMPONENT
export default function ThrivingSection() {
  return (
    
    // Reduced vertical padding (py-10) to compress the section height
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-10">
         {/* Header */}
         <div className="text-center m-20">
           <h2 className="text-6xl not-italic font-bold text-gray-900 mb-4 leading-[1.1] tracking-tight">
           Customer are our valuable <br/>assest for you & us
           </h2>
           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
           Don’t just take our word for it hear from customers who trusted us, built with us, and saw real growth through their experience.
                      </p>
        </div>
      
      {/* Tighter bottom margins (mb-6) between the rows */}
      <Marquee pauseOnHover className="[--duration:40s] mb-6">
        {firstRow.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </Marquee>

      <Marquee reverse pauseOnHover className="[--duration:40s] mb-6">
        {secondRow.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </Marquee>
      
      {/* Gradient blur divs have been completely removed from here */}
    </div>
  )
}