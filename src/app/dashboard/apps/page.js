"use client";
import React from 'react';
import { Receipt, FileImage } from 'lucide-react';
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
  ];

  return (
    <div className="flex flex-col gap-8 font-sans">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Apps & Tools</h1>
        <p className="text-gray-500">
          Boost your productivity with these built-in tools for your business.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app) => (
          <Link
            key={app.id}
            href={app.href}
            className="flex flex-col gap-4 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${app.color}`}>
              <app.icon size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{app.name}</h3>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                {app.description}
              </p>
            </div>
            <div className="mt-auto pt-4 flex items-center text-sm font-medium text-gray-900">
              Open Tool →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
