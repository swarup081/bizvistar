"use client";
import React from 'react';
import { Receipt, FileImage, Truck } from 'lucide-react';
import Link from 'next/link';

export default function AppsPage() {
  const apps = [
    {
      id: 'quick-invoice',
      name: 'Quick Invoice',
      description: 'Create professional invoices for walk-in or offline customers instantly.',
      icon: Receipt,
      href: '/dashboard/apps/quick-invoice',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'offer-poster',
      name: 'Offer Poster',
      description: 'Generate beautiful promotional images for Instagram Stories and social media.',
      icon: FileImage,
      href: '/dashboard/apps/offer-poster',
      color: 'bg-purple-100 text-purple-600',
    },
    {
        id: 'shipping-labels',
        name: 'Shipping Labels',
        description: 'Generate and print shipping labels for your orders directly from the Orders page.',
        icon: Truck,
        href: '/dashboard/orders', // Links to Orders page as requested
        color: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <div className="flex flex-col gap-8 font-sans p-2">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Apps & Tools</h1>
        <p className="text-gray-500 text-lg">
          Boost your productivity with these built-in tools for your business.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app) => (
          <Link
            key={app.id}
            href={app.href}
            className="group flex flex-col gap-4 p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${app.color} shadow-sm group-hover:scale-110 transition-transform`}>
              <app.icon size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{app.name}</h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                {app.description}
              </p>
            </div>
            <div className="mt-auto pt-4 flex items-center text-sm font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
              Open Tool →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
