'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X, Truck, CheckCircle, Package, FileText, MessageCircle, MapPin, User, Calendar, AlertCircle, StickyNote, Globe } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- Confirmation Modal ---
function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, type = 'normal' }) {
    if (!isOpen) return null;
    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 z-[70] border border-white/20 focus:outline-none animate-in fade-in zoom-in duration-200">
                     <Dialog.Title className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                         {type === 'danger' ? <AlertCircle className="text-red-500" size={20}/> : <CheckCircle className="text-purple-600" size={20}/>}
                         {title}
                     </Dialog.Title>
                     <Dialog.Description className="text-sm text-gray-600 mb-6 leading-relaxed">
                         {message}
                     </Dialog.Description>
                     <div className="flex gap-3 justify-end">
                         <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                             Cancel
                         </button>
                         <button
                             onClick={onConfirm}
                             className={`px-5 py-2 text-sm font-bold text-white rounded-xl shadow-lg transition-transform active:scale-95 ${type === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-black hover:bg-gray-800'}`}
                         >
                             Confirm
                         </button>
                     </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export default function OrderDetailsDrawer({ order, isOpen, onClose, onUpdate, businessName = 'Us' }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [trackingInput, setTrackingInput] = useState('');
  const [providerInput, setProviderInput] = useState('');

  // Confirmation State
  const [confirmState, setConfirmState] = useState({ isOpen: false, action: null, title: '', message: '', type: 'normal' });

  if (!order) return null;

  const triggerStatusUpdate = (status) => {
      let title = `Mark as ${status.charAt(0).toUpperCase() + status.slice(1)}?`;
      let message = `Are you sure you want to update the order status to ${status}? This action will notify the customer.`;
      let type = 'normal';

      if (status === 'canceled') {
          title = 'Cancel Order?';
          message = 'Are you sure you want to cancel this order? This action cannot be undone.';
          type = 'danger';
      }

      setConfirmState({
          isOpen: true,
          action: () => executeStatusUpdate(status),
          title,
          message,
          type
      });
  };

  const executeStatusUpdate = async (newStatus) => {
    setConfirmState({ ...confirmState, isOpen: false });
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

        onUpdate();
    } catch(e) {
        alert('Error: ' + e.message);
    } finally {
        setIsUpdating(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // --- Header ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(businessName.toUpperCase(), 14, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Generated by BizVistar Platform", 14, 26);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("TAX INVOICE", pageWidth - 14, 20, { align: 'right' });

    // --- Separator ---
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 32, pageWidth - 14, 32);

    // --- Order Details Section ---
    const startY = 45;

    // Left Column: Bill To
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO:", 14, startY);

    doc.setFont("helvetica", "normal");
    doc.text(order.customers?.name || "Guest", 14, startY + 6);
    doc.text(order.customers?.email || "", 14, startY + 11);

    const addr = order.shipping_address || order.customers?.shipping_address;
    if (addr && typeof addr === 'object') {
        doc.text(addr.address || '', 14, startY + 16);
        doc.text(`${addr.city || ''}, ${addr.state || ''} ${addr.zipCode || ''}`, 14, startY + 21);
        if(addr.phone) doc.text(`Ph: ${addr.phone}`, 14, startY + 26);
    }

    // Right Column: Invoice Details
    const rightColX = pageWidth - 60;

    doc.setFont("helvetica", "bold");
    doc.text("Invoice Details:", rightColX, startY);

    doc.setFont("helvetica", "normal");
    doc.text(`Order ID: #${order.id}`, rightColX, startY + 6);
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, rightColX, startY + 11);
    doc.text(`Time: ${new Date(order.created_at).toLocaleTimeString()}`, rightColX, startY + 16);
    doc.text(`Status: ${order.status.toUpperCase()}`, rightColX, startY + 21);
    doc.text(`Payment: ${order.source === 'pos' ? 'Cash/POS' : 'Online/COD'}`, rightColX, startY + 26);

    // --- Table ---
    const tableColumn = ["Item", "Qty", "Unit Price", "Total"];
    const tableRows = [];

    order.order_items.forEach(item => {
        const itemData = [
            item.products?.name || "Product",
            item.quantity,
            `Rs. ${item.price}`,
            `Rs. ${(item.quantity * item.price).toFixed(2)}`
        ];
        tableRows.push(itemData);
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: startY + 40,
        theme: 'grid',
        headStyles: { fillColor: [40, 40, 40], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 4, valign: 'middle' },
        columnStyles: {
            0: { cellWidth: 'auto' }, // Item
            1: { cellWidth: 20, halign: 'center' }, // Qty
            2: { cellWidth: 30, halign: 'right' }, // Price
            3: { cellWidth: 30, halign: 'right' }  // Total
        }
    });

    // --- Totals ---
    const finalY = doc.lastAutoTable.finalY + 10;
    const totalsX = pageWidth - 14;

    doc.setFont("helvetica", "normal");
    doc.text(`Subtotal:`, totalsX - 40, finalY);
    doc.text(`Rs. ${order.total_amount}`, totalsX, finalY, { align: 'right' });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Grand Total:`, totalsX - 40, finalY + 8);
    doc.text(`Rs. ${order.total_amount}`, totalsX, finalY + 8, { align: 'right' });

    // --- Footer ---
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for your business!", pageWidth / 2, finalY + 30, { align: 'center' });

    // Powered By
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    doc.text("Powered by BizVistar", pageWidth / 2, pageHeight - 10, { align: 'center' });

    doc.save(`Invoice_${order.id}_${businessName}.pdf`);
  };

  const logistics = order.logistics;
  const customerName = order.customers?.name || 'Customer';

  // Extract customer details
  const addr = order.shipping_address || order.customers?.shipping_address || {};
  const customerPhone = addr.phone || addr.phoneNumber || order.customers?.phone;
  const customerNote = addr.note || order.customers?.note; // Get Note
  const manualSource = addr.manualSource || order.manualSource; // Get Source

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
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white/95 backdrop-blur-md shadow-2xl p-0 flex flex-col transform transition-transform duration-300 ease-in-out border-l border-white/20 focus:outline-none"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                <div>
                    <Dialog.Title className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        Order #{order.id}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${getStatusStyle(order.status)}`}>
                            {order.status}
                        </span>
                    </Dialog.Title>
                    <div className="flex flex-col gap-1 mt-1">
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(order.created_at).toLocaleString()}
                        </p>
                        {/* Display Source here */}
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Globe size={12} />
                            Source: <span className="font-medium text-gray-600">{manualSource || 'Website'}</span>
                        </p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">

                {/* 1. Customer & Address Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Customer */}
                    <section className="bg-white/40 p-3 rounded-xl border border-gray-100/50">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <User size={12} /> Customer
                        </h3>
                        <div className="text-xs">
                            <p className="font-bold text-gray-900 truncate">{customerName}</p>
                            <p className="text-gray-500 mt-0.5 truncate">{order.customers?.email}</p>
                            <p className="text-gray-500 mt-0.5">{customerPhone || 'No Phone'}</p>
                        </div>
                    </section>

                    {/* Address */}
                    <section className="bg-white/40 p-3 rounded-xl border border-gray-100/50">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <MapPin size={12} /> Address
                        </h3>
                        <div className="text-xs text-gray-700 leading-snug">
                            {addr && addr.address ? (
                                <>
                                    <p className="font-medium truncate">{addr.address}</p>
                                    <p>{addr.city}, {addr.state}</p>
                                    <p>{addr.zipCode}</p>
                                </>
                            ) : <p className="italic text-gray-400">No address.</p>}
                        </div>
                    </section>
                </div>

                {/* 2. Logistics */}
                <section>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Truck size={14} /> Logistics
                    </h3>
                    {logistics ? (
                        <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 text-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-blue-900">{logistics.provider}</p>
                                    <p className="text-blue-700 font-mono mt-0.5 text-xs">{logistics.trackingNumber}</p>
                                </div>
                                <span className="text-[10px] text-blue-500 bg-white/50 px-2 py-1 rounded-full">{new Date(logistics.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="p-3 rounded-xl border border-gray-100 bg-gray-50/30">
                             <form onSubmit={handleAddLogistics} className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        placeholder="Provider (FedEx)"
                                        className="w-full text-xs p-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-black/5 outline-none transition-all"
                                        value={providerInput}
                                        onChange={e => setProviderInput(e.target.value)}
                                        required
                                    />
                                    <input
                                        placeholder="Tracking No."
                                        className="w-full text-xs p-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-black/5 outline-none transition-all"
                                        value={trackingInput}
                                        onChange={e => setTrackingInput(e.target.value)}
                                        required
                                    />
                                </div>
                                <button
                                    disabled={isUpdating}
                                    className="w-full bg-black text-white text-xs font-bold py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 shadow-sm"
                                >
                                    Save Logistics
                                </button>
                            </form>
                        </div>
                    )}
                </section>

                {/* 3. Note (New Section) */}
                {customerNote && (
                    <section className="bg-yellow-50/50 p-3 rounded-xl border border-yellow-100">
                        <h3 className="text-[10px] font-bold text-yellow-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <StickyNote size={12} /> Note from Customer
                        </h3>
                        <p className="text-xs text-gray-700 italic">
                            "{customerNote}"
                        </p>
                    </section>
                )}

                {/* 4. Order Items */}
                <section>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Package size={14} /> Items
                    </h3>
                    <div className="space-y-3">
                        {order.order_items.map((item, idx) => (
                            <div key={idx} className="flex gap-3 items-center group bg-white/40 p-2 rounded-lg border border-transparent hover:border-gray-100 transition-colors">
                                <div className="h-10 w-10 bg-white rounded-md overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm">
                                     {item.products?.image_url ? (
                                         <img src={item.products.image_url} alt="" className="h-full w-full object-cover"/>
                                     ) : (
                                         <div className="h-full w-full flex items-center justify-center text-gray-300"><Package size={14}/></div>
                                     )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 text-sm truncate">{item.products?.name || 'Unknown Product'}</p>
                                    <p className="text-xs text-gray-500">{item.quantity} x ₹{item.price}</p>
                                </div>
                                <div className="font-bold text-gray-900 text-sm whitespace-nowrap">
                                    ₹{item.quantity * item.price}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-100">
                        <span className="text-gray-500 text-sm font-medium">Total Amount</span>
                        <span className="text-lg font-bold text-gray-900 flex items-center">
                             ₹{order.total_amount}
                        </span>
                    </div>
                </section>

                {/* 5. Actions */}
                <section className="pb-24">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {order.status === 'pending' && (
                            <button
                                onClick={() => triggerStatusUpdate('paid')}
                                disabled={isUpdating}
                                className="flex items-center justify-center gap-2 bg-green-50 text-green-700 border border-green-200 py-2.5 rounded-xl font-bold text-xs hover:bg-green-100 transition-colors"
                            >
                                <CheckCircle size={14} /> Mark Paid
                            </button>
                        )}
                        {order.status !== 'delivered' && order.status !== 'canceled' && (
                            <button
                                onClick={() => triggerStatusUpdate('delivered')}
                                disabled={isUpdating}
                                className="flex items-center justify-center gap-2 bg-purple-50 text-purple-700 border border-purple-200 py-2.5 rounded-xl font-bold text-xs hover:bg-purple-100 transition-colors"
                            >
                                <Package size={14} /> Mark Delivered
                            </button>
                        )}
                        <button
                            onClick={generatePDF}
                            className="flex items-center justify-center gap-2 bg-gray-50 text-gray-700 border border-gray-200 py-2.5 rounded-xl font-bold text-xs hover:bg-gray-100 transition-colors"
                        >
                            <FileText size={14} /> Bill PDF
                        </button>
                         {order.status !== 'canceled' && (
                            <button
                                onClick={() => triggerStatusUpdate('canceled')}
                                disabled={isUpdating}
                                className="flex items-center justify-center gap-2 bg-red-50 text-red-700 border border-red-200 py-2.5 rounded-xl font-bold text-xs hover:bg-red-100 transition-colors"
                            >
                                <X size={14} /> Cancel
                            </button>
                        )}
                    </div>
                </section>
            </div>

            {/* Bottom: WhatsApp Button */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100">
                {customerPhone ? (
                     <a
                        href={constructWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-bold py-3.5 rounded-2xl hover:bg-[#128C7E] transition-all shadow-lg shadow-green-500/20 active:scale-95"
                     >
                         <MessageCircle size={20} />
                         Contact via WhatsApp
                     </a>
                ) : (
                    <button disabled className="w-full bg-gray-100 text-gray-400 font-bold py-3.5 rounded-2xl cursor-not-allowed flex items-center justify-center gap-2">
                         <MessageCircle size={20} /> No Phone Number
                    </button>
                )}
            </div>

            {/* Render Confirmation Modal inside Portal scope */}
            <ConfirmationModal
                isOpen={confirmState.isOpen}
                onClose={() => setConfirmState({ ...confirmState, isOpen: false })}
                onConfirm={confirmState.action}
                title={confirmState.title}
                message={confirmState.message}
                type={confirmState.type}
            />

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
