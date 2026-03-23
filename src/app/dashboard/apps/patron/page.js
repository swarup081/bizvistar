"use client";

import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Star, Phone, Mail, Activity, MapPin, ChevronDown } from 'lucide-react';
import { getWebsiteDetails } from '@/app/actions/dashboardActions';
import { getCustomersWithMetrics } from '@/app/actions/patronActions';

export default function PatronAppPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, vip, repeat

  useEffect(() => {
    async function init() {
      try {
        const { success: webSuccess, data: website } = await getWebsiteDetails();
        if (webSuccess && website) {
          const { success: custSuccess, data: custData } = await getCustomersWithMetrics(website.id);
          if (custSuccess) {
            setCustomers(custData);
          }
        }
      } catch (e) {
        console.error("Failed to init Patron", e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (c.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.shipping_address?.phone || '').includes(searchTerm);
      
    if (!matchesSearch) return false;
    
    if (filterType === 'vip') return c.total_spend >= 5000; // Arbitrary VIP threshold
    if (filterType === 'repeat') return c.order_count >= 3;
    
    return true;
  });

  const totalRevenue = customers.reduce((sum, c) => sum + c.total_spend, 0);
  const repeatCustomersCount = customers.filter(c => c.order_count >= 2).length;
  const vipCount = customers.filter(c => c.total_spend >= 5000).length;

  if (loading) return <div className="p-8 flex justify-center"><Activity className="animate-spin text-gray-400" /></div>;

  return (
    <div className="max-w-7xl mx-auto pb-20">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Users className="text-[#8A63D2]" /> Patron CRM
          </h1>
          <p className="text-gray-500 mt-2">Track repeat buyers, VIPs, and total customer spend.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <Users size={24} />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Star size={24} />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">VIP Customers (₹5000+)</p>
                <p className="text-2xl font-bold text-gray-900">{vipCount}</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                <Activity size={24} />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">Repeat Buyers (2+ orders)</p>
                <p className="text-2xl font-bold text-gray-900">{repeatCustomersCount}</p>
            </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Search by name, email, or phone..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8A63D2] outline-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filterType === 'all' ? 'bg-[#8A63D2] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
                All
            </button>
            <button 
                onClick={() => setFilterType('repeat')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filterType === 'repeat' ? 'bg-[#8A63D2] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
                Repeat (3+)
            </button>
            <button 
                onClick={() => setFilterType('vip')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filterType === 'vip' ? 'bg-[#8A63D2] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
                VIP (₹5000+)
            </button>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filteredCustomers.length === 0 ? (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                <Users size={48} className="text-gray-300 mb-4" />
                <p>No customers found matching your criteria.</p>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                            <th className="p-4 font-medium">Customer</th>
                            <th className="p-4 font-medium">Contact</th>
                            <th className="p-4 font-medium text-right">Orders</th>
                            <th className="p-4 font-medium text-right">Total Spend</th>
                            <th className="p-4 font-medium text-right">AOV</th>
                            <th className="p-4 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredCustomers.map(customer => {
                            const isVip = customer.total_spend >= 5000;
                            const isRepeat = customer.order_count >= 3;
                            
                            return (
                            <tr key={customer.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold uppercase text-lg shrink-0">
                                            {customer.name ? customer.name.charAt(0) : 'G'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 group-hover:text-[#8A63D2] transition-colors">{customer.name || 'Guest'}</p>
                                            {customer.shipping_address?.city && (
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <MapPin size={10} /> {customer.shipping_address.city}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-600 space-y-1">
                                    {customer.email && <div className="flex items-center gap-2"><Mail size={14} className="text-gray-400"/> {customer.email}</div>}
                                    {customer.shipping_address?.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone size={14} className="text-gray-400"/> 
                                            <a href={`https://wa.me/${customer.shipping_address.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="hover:text-green-600 hover:underline">
                                                {customer.shipping_address.phone}
                                            </a>
                                        </div>
                                    )}
                                </td>
                                <td className="p-4 text-right font-medium text-gray-900">
                                    {customer.order_count}
                                </td>
                                <td className="p-4 text-right font-bold text-gray-900">
                                    ₹{customer.total_spend.toFixed(2)}
                                </td>
                                <td className="p-4 text-right text-sm text-gray-500">
                                    ₹{customer.aov.toFixed(2)}
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-1">
                                        {isVip && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-yellow-100 text-yellow-800">
                                                VIP
                                            </span>
                                        )}
                                        {isRepeat && !isVip && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-purple-100 text-purple-800">
                                                Repeat
                                            </span>
                                        )}
                                        {!isVip && !isRepeat && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                                                Standard
                                            </span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>
        )}
      </div>

    </div>
  );
}
