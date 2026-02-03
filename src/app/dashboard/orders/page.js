'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
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
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useSearchParams } from 'next/navigation';
import OrderDetailsDrawer from '@/components/dashboard/OrderDetailsDrawer';
import AddOrderWizard from '@/components/dashboard/orders/AddOrderWizard'; // Import Wizard
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

// --- Main Content Component (with Suspense logic) ---
function OrdersContent() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [businessName, setBusinessName] = useState('Us');
  const [websiteId, setWebsiteId] = useState(null);
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false); // Add Order State

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default

  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get('id');

  // Set Items per page based on screen size (Client Side)
  useEffect(() => {
      const handleResize = () => {
          // Mobile: Show fewer items to avoid scrolling
          if (window.innerWidth < 768) {
              setItemsPerPage(7);
          } else {
              setItemsPerPage(10);
          }
      };

      handleResize(); // Init
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);

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

    setWebsiteId(website.id); // Set ID for Wizard

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
            } : null,
            // Extract Source from Customer Shipping Address Note/Field if manual
            manualSource: o.customers?.shipping_address?.manualSource || null
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

  // --- Filtering & Searching Logic ---
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
        // 1. Search Query
        const query = searchQuery.toLowerCase();
        const matchesSearch =
            order.id.toString().includes(query) ||
            order.customers?.name?.toLowerCase().includes(query) ||
            order.customers?.email?.toLowerCase().includes(query);

        // 2. Status Filter
        const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = useMemo(() => {
      const start = (currentPage - 1) * itemsPerPage;
      return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const handlePageChange = (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
          setCurrentPage(newPage);
      }
  };

  // Reset page on search/filter
  useEffect(() => {
      setCurrentPage(1);
  }, [searchQuery, statusFilter]);


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

      {/* Header Section: Consolidated for Mobile & Desktop */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-8 px-4 md:px-0 pt-4 md:pt-0 shrink-0">

        {/* Mobile Header Layout: Two Rows */}
        <div className="flex md:hidden flex-col w-full gap-3 px-4 pt-4">
             {/* Row 1: Title (Left) and Add Order Button (Right) */}
             <div className="flex items-center justify-between w-full">
                 <h1 className="text-xl font-bold text-gray-900 shrink-0">Orders</h1>

                 {/* Add Order Button (Black, Small Icon) */}
                 <button
                    onClick={() => setIsAddOrderOpen(true)}
                    className="h-[36px] w-[36px] shrink-0 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 transition-all shadow-sm"
                    title="Add Manual Order"
                >
                    <Plus size={16} />
                </button>
             </div>

             {/* Row 2: Search (Grow) and Filter (Fixed) */}
             <div className="flex items-center gap-2 w-full">
                 <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-9 w-full rounded-full border border-gray-200 bg-white pl-8 pr-3 text-sm outline-none focus:border-[#8A63D2] focus:ring-1 focus:ring-[#8A63D2] transition-all shadow-sm"
                    />
                 </div>

                 <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <button className={`h-[36px] w-[36px] shrink-0 flex items-center justify-center rounded-full transition-all shadow-sm ${statusFilter !== 'all' ? 'bg-[#8A63D2] text-white' : 'bg-[#EEE5FF] text-[#8A63D2] hover:bg-[#dcd0f5]'}`}>
                            <Filter size={16} />
                        </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                        <DropdownMenu.Content className="min-w-[150px] bg-white rounded-xl shadow-xl border border-gray-100 p-1 z-50 animate-in fade-in zoom-in-95 duration-100" align="end">
                            {['all', 'pending', 'paid', 'shipped', 'delivered', 'canceled'].map((status) => (
                                <DropdownMenu.Item
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg cursor-pointer outline-none ${statusFilter === status ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <span className="capitalize">{status}</span>
                                    {statusFilter === status && <CheckCircle size={14} />}
                                </DropdownMenu.Item>
                            ))}
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
             </div>
        </div>

        {/* Desktop Layout (Hidden on Mobile) */}
        <div className="hidden md:flex items-center justify-between w-full">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                <p className="text-gray-500 mt-1 text-sm md:text-base">Manage and track your customer orders.</p>
            </div>

            <div className="flex items-center gap-3">
                 <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-sm"
                    />
                </div>

                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <button className={`flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition-all shadow-sm ${statusFilter !== 'all' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                            <Filter className="h-4 w-4" />
                            {statusFilter === 'all' ? 'Filter' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                            <ChevronDown className="h-3 w-3 opacity-50" />
                        </button>
                    </DropdownMenu.Trigger>
                     <DropdownMenu.Portal>
                        <DropdownMenu.Content className="min-w-[150px] bg-white rounded-xl shadow-xl border border-gray-100 p-1 z-50 animate-in fade-in zoom-in-95 duration-100" align="end">
                            {['all', 'pending', 'paid', 'shipped', 'delivered', 'canceled'].map((status) => (
                                <DropdownMenu.Item
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg cursor-pointer outline-none ${statusFilter === status ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <span className="capitalize">{status}</span>
                                    {statusFilter === status && <CheckCircle size={14} />}
                                </DropdownMenu.Item>
                            ))}
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>

                {/* Add Order Button (Desktop) */}
                <button
                    onClick={() => setIsAddOrderOpen(true)}
                    className="h-10 px-4 flex items-center justify-center gap-2 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition-all shadow-sm"
                >
                    <Plus size={18} />
                    Add Order
                </button>
            </div>
        </div>

      </div>

      {/* Table Container */}
      <div className="bg-white md:rounded-2xl shadow-sm md:border border-gray-200 overflow-hidden flex flex-col -mx-4 md:mx-0 border-y border-gray-100 md:border-0">
        <div className="w-full">
            <table className="w-full text-left border-collapse table-auto">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="hidden md:table-cell py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                        <th className="py-4 pl-4 md:px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Date & Time</th>
                        <th className="py-4 px-2 md:px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                        <th className="py-4 px-2 md:px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="hidden md:table-cell py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                        <th className="hidden md:table-cell py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Source</th>
                        <th className="py-4 pr-4 md:px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {loading ? (
                        [1, 2, 3, 4, 5].map((i) => (
                            <tr key={i}>
                                <td colSpan="7" className="p-4 md:px-6">
                                    <div className="h-12 w-full bg-gray-100 rounded-xl animate-pulse"></div>
                                </td>
                            </tr>
                        ))
                    ) : currentOrders.length === 0 ? (
                        <tr><td colSpan="7" className="p-12 text-center text-gray-500">
                            <div className="flex flex-col items-center justify-center gap-2">
                                <Search className="text-gray-300 h-8 w-8" />
                                <p>No orders found matching your filters.</p>
                                {(searchQuery || statusFilter !== 'all') && (
                                    <button
                                        onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                                        className="text-sm text-purple-600 font-bold hover:underline"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        </td></tr>
                    ) : (
                        currentOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group text-[11px] md:text-sm">
                                <td className="hidden md:table-cell py-4 px-6 font-bold text-gray-900 text-sm align-middle">
                                    #{order.id}
                                </td>
                                <td className="py-4 pl-4 md:px-6 text-gray-500 align-middle">
                                    <span className="block font-medium text-gray-900 md:text-gray-500">{new Date(order.created_at).toLocaleDateString('en-GB')}</span>
                                    <span className="text-[10px] md:text-xs text-gray-400 block">{new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </td>
                                <td className="py-4 px-2 md:px-6 font-medium text-gray-900 align-middle">
                                    {order.customers?.name || 'Guest'}
                                </td>
                                <td className="py-4 px-2 md:px-6 align-middle">
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] md:text-xs font-bold ${getStatusStyle(order.status)} whitespace-nowrap`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="hidden md:table-cell py-4 px-6 text-sm font-bold text-gray-900 align-middle">₹{order.total_amount}</td>

                                {/* Manual Source Display */}
                                <td className="hidden md:table-cell py-4 px-6 text-sm align-middle">
                                    {order.manualSource ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                            {order.manualSource}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 text-xs">Website</span>
                                    )}
                                </td>

                                <td className="py-4 pr-4 md:px-6 text-right align-middle">
                                    <button 
                                        onClick={() => setSelectedOrder(order)}
                                        className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 md:px-4 text-[10px] md:text-xs font-bold text-purple-600 hover:bg-purple-500 hover:text-white transition-colors"
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

      {/* Pagination Footer */}
      {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 bg-white/50 border-t border-gray-100 rounded-b-2xl md:rounded-b-2xl -mx-4 md:mx-0">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                  <ChevronLeft size={16} />
                  Prev
              </button>

              <span className="text-sm font-medium text-gray-600">
                  Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                  Next
                  <ChevronRight size={16} />
              </button>
          </div>
      )}

      <OrderDetailsDrawer
        isOpen={!!selectedOrder} 
        order={selectedOrder} 
        businessName={businessName}
        onClose={() => {
            setSelectedOrder(null);
        }} 
        onUpdate={fetchOrders}
      />

      <AddOrderWizard
        isOpen={isAddOrderOpen}
        onClose={() => setIsAddOrderOpen(false)}
        onOrderAdded={fetchOrders}
        websiteId={websiteId}
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
