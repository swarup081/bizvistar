'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const FaqItem = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left group transition-colors"
      >
        <span className={cn("text-lg font-medium transition-colors", isOpen ? "text-[#8a63d2]" : "text-gray-900 group-hover:text-[#8a63d2]")}>{q}</span>
        <div className={cn("flex items-center justify-center w-8 h-8 rounded-full transition-colors", isOpen ? "bg-[#8a63d2]/10" : "bg-gray-50 group-hover:bg-[#8a63d2]/10")}>
          <ChevronDown
            className={cn(
              'h-5 w-5 transition-transform duration-300',
              isOpen ? 'rotate-180 text-[#8a63d2]' : 'text-gray-400 group-hover:text-[#8a63d2]'
            )}
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-5 pr-10 text-base text-gray-600 leading-relaxed">
              {typeof a === 'string' ? <p>{a}</p> : a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FaqSection({ pageType = 'default' }) {
  const allFaqs = {
    checkout: [
      {
        q: 'Is my payment information secure?',
        a: 'Yes, all payments are processed securely. We use industry-standard encryption to protect your personal and payment information.'
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept major credit cards, debit cards, UPI, and net banking depending on your location and the store\'s preferences.'
      },
      {
        q: 'When will my order be processed?',
        a: 'Orders are typically processed within 24-48 hours. You will receive a confirmation email once your order is confirmed and another when it ships.'
      },
      {
        q: 'How can I track my order?',
        a: 'Once your order is shipped, you will receive a tracking link via email to monitor its delivery status.'
      },
      {
        q: 'Can I change my shipping address after placing an order?',
        a: 'If you need to change your shipping address, please contact the store owner immediately. Address changes are only possible before the order has been dispatched.'
      }
    ],
    pricing: [
      {
        q: 'Can I cancel my subscription at any time?',
        a: 'Yes, you can cancel your subscription at any time from your dashboard. Your plan will remain active until the end of the current billing cycle.'
      },
      {
        q: 'Do you offer a free trial?',
        a: 'We offer a free tier with basic features so you can try out our platform before committing to a paid plan.'
      },
      {
        q: 'What happens if I exceed my plan limits?',
        a: 'If you exceed your plan limits, you will be notified and given the option to upgrade to a higher tier. Your store will remain active, but certain features may be restricted until you upgrade.'
      },
      {
        q: 'Are there any hidden fees?',
        a: 'No, we believe in transparent pricing. The price you see is the price you pay, plus any applicable taxes. We do not charge commission on your sales.'
      }
    ],
    landing: [
      {
        q: 'What is BizVistar?',
        a: 'BizVistar is a platform that empowers businesses to easily create and manage their online presence with powerful e-commerce tools.'
      },
      {
        q: 'How do I get started?',
        a: 'Simply sign up, choose a template that fits your business, customize it in our easy-to-use editor, and launch your site!'
      },
      {
        q: 'Do I need technical skills to use BizVistar?',
        a: 'Not at all! Our intuitive drag-and-drop editor and pre-designed templates make it easy for anyone to build a professional website without writing a single line of code.'
      },
      {
        q: 'Can I use my own domain name?',
        a: 'Yes, you can easily connect your own custom domain name to your BizVistar website.'
      },
      {
        q: 'Is BizVistar optimized for mobile devices?',
        a: 'Absolutely. All our templates are fully responsive and designed to look great on any device, from desktops to smartphones.'
      },
      {
        q: 'Do you charge any transaction fees?',
        a: 'No, BizVistar does not charge any transaction fees on your sales. You keep 100% of your profits.'
      }
    ],
    default: [
      {
        q: 'What is BizVistar?',
        a: 'BizVistar is a platform that empowers businesses to easily create and manage their online presence with powerful e-commerce tools.'
      },
      {
        q: 'How do I get started?',
        a: 'Simply sign up, choose a template that fits your business, customize it in our easy-to-use editor, and launch your site!'
      },
      {
        q: 'Do I need technical skills to use BizVistar?',
        a: 'Not at all! Our intuitive drag-and-drop editor and pre-designed templates make it easy for anyone to build a professional website without writing a single line of code.'
      }
    ]
  };

  const faqs = allFaqs[pageType] || allFaqs['default'];

  // Handle opening the chatbot
  const handleHelpCenterClick = (e) => {
    e.preventDefault();
    // Dispatch a custom event that the SupportWidget can listen to, or simply focus it if it exists
    const chatButton = document.querySelector('button[aria-label="Open Chat"]') || document.querySelector('.bg-gradient-to-r.from-\\[\\#8A63D2\\]');
    if (chatButton) {
        chatButton.click();
    } else {
        // Fallback or custom event
        window.dispatchEvent(new CustomEvent('open-support-widget'));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-8">
      <div className="lg:col-span-1">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Frequently asked questions
        </h2>
        <p className="text-lg text-gray-600">
          Haven't found what you're looking for? Try the{' '}
          <button onClick={handleHelpCenterClick} className="text-[#8a63d2] hover:underline hover:text-[#7554b3] font-medium text-left">
            BizVistar Help Center
          </button>{' '}
          or{' '}
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_CONTACT_US || '919013063854'}?text=Hi!%20I%20have%20a%20question%20from%20the%20FAQ%20page.`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8a63d2] hover:text-[#7554b3] hover:underline font-medium"
          >
            contact us
          </a>.
        </p>
      </div>
      
      <div className="lg:col-span-2">
        <div>
          {faqs.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </div>
  );
}
