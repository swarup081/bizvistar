'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { 
  ChevronDown, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Truck, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Package,
  Eye
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useSearchParams } from 'next/navigation';
import OrderDetailsDrawer from '@/components/dashboard/OrderDetailsDrawer';

// --- Main Content Component (with Suspense logic) ---
function OrdersContent() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [businessName, setBusinessName] = useState('Us');
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get('id');

  const fetchOrders = async () => {
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return; 

    // Fetch website and slug
    const { data: website } = await supabase
        .from('websites')
        .select('id, site_slug')
        .eq('user_id', user.id)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (!website) {
        setLoading(false);
        return;
    }

    // Fetch business name from onboarding
    const { data: onboarding } = await supabase
        .from('onboarding_data')
        .select('owner_name')
        .eq('website_id', website.id)
        .maybeSingle();

    setBusinessName(onboarding?.owner_name || website.site_slug || 'Us');

    try {
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .eq('website_id', website.id)
            .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;
        
        if (!orders || orders.length === 0) {
            setOrders([]);
            setLoading(false);
            return;
        }

        const orderIds = orders.map(o => o.id);
        const customerIds = [...new Set(orders.map(o => o.customer_id).filter(Boolean))];

        const [
            { data: customers },
            { data: deliveries },
            { data: items }
        ] = await Promise.all([
             customerIds.length > 0 ? supabase.from('customers').select('*').in('id', customerIds) : Promise.resolve({ data: [] }),
             supabase.from('deliveries').select('*').in('order_id', orderIds),
             supabase.from('order_items').select('*').in('order_id', orderIds)
        ]);

        const productIds = [...new Set((items || []).map(i => i.product_id))];
        const { data: products } = productIds.length > 0 
            ? await supabase.from('products').select('id, name, image_url').in('id', productIds)
            : { data: [] };

        const customersMap = (customers || []).reduce((acc, c) => ({ ...acc, [c.id]: c }), {});
        const productsMap = (products || []).reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
        
        const deliveriesMap = (deliveries || []).reduce((acc, d) => {
            if (!acc[d.order_id]) acc[d.order_id] = [];
            acc[d.order_id].push(d);
            return acc;
        }, {});

        const itemsMap = (items || []).reduce((acc, i) => {
            if (!acc[i.order_id]) acc[i.order_id] = [];
            acc[i.order_id].push({ ...i, products: productsMap[i.product_id] });
            return acc;
        }, {});

        const merged = orders.map(o => ({
            ...o,
            customers: customersMap[o.customer_id] || { name: 'Unknown', email: '' },
            order_items: itemsMap[o.id] || [],
            deliveries: deliveriesMap[o.id] || [],
            logistics: deliveriesMap[o.id]?.[0] ? {
                provider: deliveriesMap[o.id][0].provider,
                trackingNumber: deliveriesMap[o.id][0].tracking_number,
                date: deliveriesMap[o.id][0].created_at
            } : null
        }));

        setOrders(merged);

        // Handle URL param or re-selection
        if (initialOrderId) {
            const preSelected = merged.find(o => o.id.toString() === initialOrderId);
            if (preSelected) setSelectedOrder(preSelected);
        } else if (selectedOrder) {
            const updatedSelected = merged.find(o => o.id === selectedOrder.id);
            if (updatedSelected) setSelectedOrder(updatedSelected);
        }

    } catch (e) {
        console.error("Orders Fetch Error:", JSON.stringify(e));
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []); // Run on mount

  const getStatusStyle = (status) => {
    const styles = {
        delivered: "bg-green-50 text-green-600 border border-green-100",
        shipped: "bg-blue-50 text-blue-600 border border-blue-100",
        pending: "bg-yellow-50 text-yellow-600 border border-yellow-100",
        canceled: "bg-red-50 text-red-600 border border-red-100",
        paid: "bg-teal-50 text-teal-600 border border-teal-100"
    };
    return styles[status.toLowerCase()] || "bg-gray-50 text-gray-600";
  };

  return (
    <div className="h-full flex flex-col font-sans">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-500 mt-1">Manage and track your customer orders.</p>
        </div>
        <div className="flex gap-3">
             <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search orders..." 
                  className="h-10 w-64 rounded-full border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
             </div>
             <button className="flex h-10 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                Filter
             </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                        <th className="hidden md:table-cell py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="hidden md:table-cell py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {loading ? (
                        <tr><td colSpan="6" className="p-10 text-center text-gray-500">
                            <div className="flex flex-col gap-2 animate-pulse">
                                <div className="h-4 bg-gray-100 rounded w-full"></div>
                                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                            </div>
                        </td></tr>
                    ) : orders.length === 0 ? (
                        <tr><td colSpan="6" className="p-10 text-center text-gray-500">No orders found.</td></tr>
                    ) : (
                        orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="py-4 px-6 font-bold text-gray-900 text-sm">#{order.id}</td>
                                <td className="py-4 px-6 text-sm text-gray-500">
                                    <span className="block">{new Date(order.created_at).toLocaleDateString()}</span>
                                    <span className="text-xs text-gray-400">{new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </td>
                                <td className="hidden md:table-cell py-4 px-6 text-sm font-medium text-gray-900">
                                    {order.customers?.name || 'Guest'}
                                    <div className="text-xs text-gray-400 font-normal">{order.customers?.email}</div>
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${getStatusStyle(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="hidden md:table-cell py-4 px-6 text-sm font-bold text-gray-900">₹{order.total_amount}</td>
                                <td className="py-4 px-6 text-right">
                                    <button 
                                        onClick={() => setSelectedOrder(order)}
                                        className="rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-bold text-purple-600 hover:bg-purple-500 hover:text-white transition-colors"
                                    >
                                        Manage
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>

      <OrderDetailsDrawer
        isOpen={!!selectedOrder} 
        order={selectedOrder} 
        businessName={businessName}
        onClose={() => {
            setSelectedOrder(null);
        }} 
        onUpdate={fetchOrders}
      />
    </div>
  );
}

export default function OrdersPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading orders module...</div>}>
            <OrdersContent />
        </Suspense>
    );
}
