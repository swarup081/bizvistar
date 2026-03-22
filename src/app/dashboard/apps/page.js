"use client";

import React from 'react';
import Link from 'next/link';
import {
  PieChart,
  Tag,
  Users,
  Paintbrush,
  ReceiptText,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const appsList = [
  {
    id: 'pulse',
    name: 'Pulse',
    description: 'Real-time visitor tracking and Revenue Heatmaps.',
    icon: PieChart,
    color: 'bg-blue-500',
    href: '/dashboard/analytics',
    badge: 'Core'
  },
  {
    id: 'boost',
    name: 'Boost',
    description: 'WhatsApp Coupons, Deals, and Offers to drive sales.',
    icon: Tag,
    color: 'bg-green-500',
    href: '/dashboard/apps/boost',
    badge: 'Growth'
  },
  {
    id: 'patron',
    name: 'Patron',
    description: 'CRM App to track repeat buyers and total spend.',
    icon: Users,
    color: 'bg-purple-500',
    href: '/dashboard/apps/patron',
    badge: 'Pro'
  },
  {
    id: 'design-studio',
    name: 'Design Studio',
    description: 'Website editor to customize themes, sections, and more.',
    icon: Paintbrush,
    color: 'bg-pink-500',
    href: '/dashboard/website',
    badge: 'Core'
  },
  {
    id: 'billing',
    name: 'Bill Generator',
    description: 'Generate and print professional invoices for orders.',
    icon: ReceiptText,
    color: 'bg-orange-500',
    href: '/dashboard/apps/billing',
    badge: 'Pro'
  }
];

export default function AppsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Apps</h1>
          <p className="text-gray-500 mt-2 text-lg">
            Supercharge your store with powerful tools and features.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appsList.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={app.href} className="block group h-full">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#8A63D2]/30 transition-all duration-300 h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${app.color} shadow-sm group-hover:scale-105 transition-transform`}>
                    <app.icon size={24} />
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {app.badge}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#8A63D2] transition-colors">
                  {app.name}
                </h3>

                <p className="text-gray-500 text-sm flex-grow">
                  {app.description}
                </p>

                <div className="mt-6 flex items-center text-sm font-medium text-[#8A63D2]">
                  Open App
                  <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
