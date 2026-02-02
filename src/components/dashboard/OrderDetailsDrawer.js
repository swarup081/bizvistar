'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X, Truck, CheckCircle, Package, FileText, MessageCircle, MapPin, User, Calendar, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function OrderDetailsDrawer({ order, isOpen, onClose, onUpdate, businessName = 'Us' }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [trackingInput, setTrackingInput] = useState('');
  const [providerInput, setProviderInput] = useState('');

  if (!order) return null;

  const handleStatusUpdate = async (newStatus) => {
    // Custom confirmation
    if(!window.confirm(`Are you sure you want to mark this order as ${newStatus}?`)) return;

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
  const customerName = order.customers?.name || 'Customer';
  const customerPhone = order.shipping_address?.phone || order.customers?.shipping_address?.phone;

  // WhatsApp Message Construction
  const constructWhatsAppLink = () => {
      if (!customerPhone) return '#';

      const message = `Hey ${customerName}, thank you for ordering from ${businessName}.
Your order #${order.id} is currently ${order.status}.
${logistics ? `It has been shipped via ${logistics.provider} (Tracking: ${logistics.trackingNumber}).` : ''}
We will keep you updated!`;

      return `https://wa.me/${customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity" />
        <Dialog.Content
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white/95 backdrop-blur-md shadow-2xl p-0 flex flex-col transform transition-transform duration-300 ease-in-out border-l border-white/20"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white/50">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        Order #{order.id}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${getStatusStyle(order.status)}`}>
                            {order.status}
                        </span>
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(order.created_at).toLocaleString()}
                    </p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">

                {/* 1. Customer Details */}
                <section>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <User size={14} /> Customer Details
                    </h3>
                    <div className="bg-white/60 p-4 rounded-xl border border-gray-100 shadow-sm">
                        <p className="font-bold text-gray-900 text-base">{customerName}</p>
                        <p className="text-sm text-gray-600 mt-1">{order.customers?.email}</p>
                        <p className="text-sm text-gray-600">{customerPhone || 'No Phone'}</p>
                    </div>
                </section>

                {/* 2. Shipping Address */}
                <section>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <MapPin size={14} /> Shipping Address
                    </h3>
                    <div className="bg-white/60 p-4 rounded-xl border border-gray-100 shadow-sm text-sm text-gray-700 leading-relaxed">
                        {(order.shipping_address || order.customers?.shipping_address) ? (
                            (() => {
                                const addr = order.shipping_address || order.customers.shipping_address;
                                if (typeof addr !== 'object') return <p>Invalid address format</p>;
                                return (
                                    <>
                                        <p className="font-medium">{addr.address}</p>
                                        <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                                        <p className="mt-2 text-gray-500 text-xs">Phone: {addr.phone}</p>
                                    </>
                                );
                            })()
                        ) : <p className="italic text-gray-400">No address details provided.</p>}
                    </div>
                </section>

                {/* 3. Logistics */}
                <section>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Truck size={14} /> Logistics
                    </h3>
                    {logistics ? (
                        <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-100 text-sm">
                            <p className="font-bold text-blue-900">Shipped via {logistics.provider}</p>
                            <p className="text-blue-700 font-mono mt-1 text-xs">Tracking: {logistics.trackingNumber}</p>
                            <p className="text-blue-600/70 text-xs mt-2">{new Date(logistics.date).toLocaleDateString()}</p>
                        </div>
                    ) : (
                        <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100">
                             <h4 className="text-sm font-semibold text-gray-700 mb-3">Add Tracking Info</h4>
                             <form onSubmit={handleAddLogistics} className="space-y-3">
                                <input
                                    placeholder="Provider (e.g. FedEx)"
                                    className="w-full text-sm p-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-purple-500/20 outline-none"
                                    value={providerInput}
                                    onChange={e => setProviderInput(e.target.value)}
                                    required
                                />
                                <input
                                    placeholder="Tracking Number"
                                    className="w-full text-sm p-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-purple-500/20 outline-none"
                                    value={trackingInput}
                                    onChange={e => setTrackingInput(e.target.value)}
                                    required
                                />
                                <button
                                    disabled={isUpdating}
                                    className="w-full bg-black text-white text-sm font-medium py-2.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                                >
                                    Save Logistics
                                </button>
                            </form>
                        </div>
                    )}
                </section>

                {/* 4. Order Items */}
                <section>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Package size={14} /> Items
                    </h3>
                    <div className="space-y-3">
                        {order.order_items.map((item, idx) => (
                            <div key={idx} className="flex gap-4 items-start bg-white/60 p-3 rounded-xl border border-gray-100 shadow-sm">
                                <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                     {item.products?.image_url ? (
                                         <img src={item.products.image_url} alt="" className="h-full w-full object-cover"/>
                                     ) : (
                                         <div className="h-full w-full flex items-center justify-center text-gray-300"><Package size={20}/></div>
                                     )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 text-sm truncate">{item.products?.name || 'Unknown Product'}</p>
                                    <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity} × ₹{item.price}</p>
                                </div>
                                <div className="font-bold text-gray-900 text-sm whitespace-nowrap">
                                    ₹{item.quantity * item.price}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-100">
                        <span className="text-gray-500 text-sm font-medium">Total Amount</span>
                        <span className="text-xl font-bold text-gray-900 flex items-center">
                             ₹{order.total_amount}
                        </span>
                    </div>
                </section>

                {/* 5. Actions */}
                <section className="pb-20"> {/* Padding for floating button */}
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {order.status === 'pending' && (
                            <button
                                onClick={() => handleStatusUpdate('paid')}
                                disabled={isUpdating}
                                className="flex items-center justify-center gap-2 bg-green-50 text-green-700 border border-green-200 py-2.5 rounded-lg font-bold text-sm hover:bg-green-100 transition-colors"
                            >
                                <CheckCircle size={16} /> Mark Paid
                            </button>
                        )}
                        {order.status !== 'delivered' && order.status !== 'canceled' && (
                            <button
                                onClick={() => handleStatusUpdate('delivered')}
                                disabled={isUpdating}
                                className="flex items-center justify-center gap-2 bg-purple-50 text-purple-700 border border-purple-200 py-2.5 rounded-lg font-bold text-sm hover:bg-purple-100 transition-colors"
                            >
                                <Package size={16} /> Mark Delivered
                            </button>
                        )}
                        <button
                            onClick={() => alert("Billing App coming soon!")}
                            className="flex items-center justify-center gap-2 bg-gray-50 text-gray-700 border border-gray-200 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors"
                        >
                            <FileText size={16} /> Bill
                        </button>
                         {order.status !== 'canceled' && (
                            <button
                                onClick={() => handleStatusUpdate('canceled')}
                                disabled={isUpdating}
                                className="flex items-center justify-center gap-2 bg-red-50 text-red-700 border border-red-200 py-2.5 rounded-lg font-bold text-sm hover:bg-red-100 transition-colors"
                            >
                                <X size={16} /> Cancel
                            </button>
                        )}
                    </div>
                </section>
            </div>

            {/* Bottom: WhatsApp Button */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200">
                {customerPhone ? (
                     <a
                        href={constructWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-bold py-3 rounded-xl hover:bg-[#128C7E] transition-colors shadow-lg shadow-green-500/20"
                     >
                         <MessageCircle size={20} />
                         Contact via WhatsApp
                     </a>
                ) : (
                    <button disabled className="w-full bg-gray-300 text-gray-500 font-bold py-3 rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
                         <MessageCircle size={20} /> No Phone Number
                    </button>
                )}
            </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const getStatusStyle = (status) => {
    const styles = {
        delivered: "bg-green-100 text-green-700",
        shipped: "bg-blue-100 text-blue-700",
        pending: "bg-yellow-100 text-yellow-700",
        canceled: "bg-red-100 text-red-700",
        paid: "bg-teal-100 text-teal-700"
    };
    return styles[status.toLowerCase()] || "bg-gray-100 text-gray-700";
};
