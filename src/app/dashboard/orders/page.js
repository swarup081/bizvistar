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
import * as Dialog from '@radix-ui/react-dialog';
import { useSearchParams } from 'next/navigation';

// --- Order Details Modal Component ---
function OrderDetailsModal({ order, isOpen, onClose, onUpdate }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [trackingInput, setTrackingInput] = useState('');
  const [providerInput, setProviderInput] = useState('');

  if (!order) return null;

  const handleStatusUpdate = async (newStatus) => {
    if(!confirm(`Are you sure you want to mark this order as ${newStatus}?`)) return;
    setIsUpdating(true);
    try {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', order.id);
            
        if (error) throw error;
        
        onUpdate(); 
        onClose();
    } catch (e) {
        alert('Failed to update: ' + e.message);
    } finally {
        setIsUpdating(false);
    }
  };

  const handleAddLogistics = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
        const { error: deliveryError } = await supabase
            .from('deliveries')
            .insert({
                order_id: order.id,
                provider: providerInput,
                tracking_number: trackingInput,
                status: 'shipped'
            });

        if (deliveryError) throw deliveryError;

        const { error: orderError } = await supabase
            .from('orders')
            .update({ status: 'shipped' })
            .eq('id', order.id);

        if (orderError) throw orderError;

        alert('Logistics added!');
        onUpdate();
    } catch(e) {
        alert('Error: ' + e.message);
    } finally {
        setIsUpdating(false);
    }
  };

  const logistics = order.logistics; 

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50 font-sans">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-6 border-b pb-4">
                <div>
                    <Dialog.Title className="text-2xl font-bold text-gray-900">Order #{order.id}</Dialog.Title>
                    <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${getStatusStyle(order.status)}`}>
                        {order.status}
                    </span>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                        <XCircle size={24} className="text-gray-400" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Col: Items & Logistics */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Items</h3>
                        <div className="space-y-3">
                            {order.order_items.map((item, idx) => (
                                <div key={idx} className="flex gap-3 items-center bg-gray-50 p-2 rounded-lg">
                                    <div className="h-12 w-12 bg-gray-200 rounded overflow-hidden">
                                         {item.products?.image_url && <img src={item.products.image_url} alt="" className="h-full w-full object-cover"/>}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm">{item.products?.name || 'Unknown Product'}</p>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                                    </div>
                                    <div className="ml-auto font-bold text-gray-900 text-sm">
                                        ₹{item.quantity * item.price}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 flex justify-between border-t pt-2 font-bold text-gray-900">
                            <span>Total</span>
                            <span>₹{order.total_amount}</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                            <Truck size={16} /> Logistics
                        </h3>
                        {logistics ? (
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm">
                                <p className="font-bold text-blue-800">Shipped via {logistics.provider}</p>
                                <p className="text-blue-600 font-mono mt-1">Tracking: {logistics.trackingNumber}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleAddLogistics} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <input 
                                        placeholder="Provider (e.g. FedEx)" 
                                        className="text-sm p-2 border rounded"
                                        value={providerInput}
                                        onChange={e => setProviderInput(e.target.value)}
                                        required
                                    />
                                    <input 
                                        placeholder="Tracking Number" 
                                        className="text-sm p-2 border rounded"
                                        value={trackingInput}
                                        onChange={e => setTrackingInput(e.target.value)}
                                        required
                                    />
                                </div>
                                <button disabled={isUpdating} className="w-full bg-blue-600 text-white text-xs font-bold py-2 rounded hover:bg-blue-700">
                                    Add Logistics Info
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Right Col: Customer & Actions */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Customer</h3>
                        <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                            <p className="font-bold text-gray-900">{order.customers?.name}</p>
                            <p className="text-gray-600">{order.customers?.email}</p>
                            <div className="border-t border-gray-200 my-2 pt-2 text-gray-500">
                                <p className="font-medium text-xs text-gray-400 uppercase mb-1">Shipping Address</p>
                                {(order.shipping_address || order.customers?.shipping_address) ? (
                                    (() => {
                                        const addr = order.shipping_address || order.customers.shipping_address;
                                        if (typeof addr !== 'object') return <p>Invalid address format</p>;
                                        return (
                                            <>
                                                <p>{addr.address}</p>
                                                <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                                                <p>Phone: {addr.phone}</p>
                                            </>
                                        );
                                    })()
                                ) : <p>No address details</p>}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Actions</h3>
                        <div className="space-y-2">
                            {order.status === 'pending' && (
                                <button 
                                    onClick={() => handleStatusUpdate('paid')}
                                    disabled={isUpdating}
                                    className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-green-700"
                                >
                                    <CheckCircle size={16} /> Mark as Paid
                                </button>
                            )}
                             {order.status !== 'delivered' && order.status !== 'canceled' && (
                                <button 
                                    onClick={() => handleStatusUpdate('delivered')}
                                    disabled={isUpdating}
                                    className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-purple-700"
                                >
                                    <Package size={16} /> Mark as Delivered
                                </button>
                            )}
                             <button 
                                onClick={() => alert("Billing App coming soon!")}
                                className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-lg font-bold text-sm hover:bg-gray-200"
                            >
                                <FileText size={16} /> Generate Bill
                            </button>
                             {order.status !== 'canceled' && (
                                <button 
                                    onClick={() => handleStatusUpdate('canceled')}
                                    disabled={isUpdating}
                                    className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2 rounded-lg font-bold text-sm hover:bg-red-50 mt-4"
                                >
                                    Cancel Order
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

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

// --- Main Content Component (with Suspense logic) ---
function OrdersContent() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get('id');

  const fetchOrders = async () => {
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return; 

    const { data: website } = await supabase
        .from('websites')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

    if (!website) {
        setLoading(false);
        return;
    }

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

  return (
    <div className="h-full flex flex-col font-sans">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-500 mt-1">Manage and track your customer orders.</p>
        </div>
        <div className="flex gap-3">
             <div className="relative">
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
                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {loading ? (
                        <tr><td colSpan="6" className="p-10 text-center text-gray-500">Loading orders...</td></tr>
                    ) : orders.length === 0 ? (
                        <tr><td colSpan="6" className="p-10 text-center text-gray-500">No orders found.</td></tr>
                    ) : (
                        orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="py-4 px-6 font-bold text-gray-900 text-sm">#{order.id}</td>
                                <td className="py-4 px-6 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                                <td className="py-4 px-6 text-sm font-medium text-gray-900">
                                    {order.customers?.name || 'Guest'}
                                    <div className="text-xs text-gray-400 font-normal">{order.customers?.email}</div>
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${getStatusStyle(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-sm font-bold text-gray-900">₹{order.total_amount}</td>
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

      <OrderDetailsModal 
        isOpen={!!selectedOrder} 
        order={selectedOrder} 
        onClose={() => {
            setSelectedOrder(null);
            // Optionally remove query param on close to clean URL
            // router.replace('/dashboard/orders'); 
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
