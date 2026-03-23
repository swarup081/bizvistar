"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ReceiptText, Printer, Plus, Trash2, Search, ChevronDown, Building2, MapPin, Phone, Mail, Activity } from 'lucide-react';
import { getWebsiteDetails } from '@/app/actions/dashboardActions';
import { getOrdersForBilling } from '@/app/actions/billingActions';
import toast, { Toaster } from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';

export default function BillGeneratorPage() {
    const [website, setWebsite] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Invoice State
    const [businessInfo, setBusinessInfo] = useState({ name: '', address: '', email: '', phone: '' });
    const [invoiceNo, setInvoiceNo] = useState(`INV-${Math.floor(Math.random() * 10000)}`);
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState('');
    const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', email: '', address: '' });
    const [items, setItems] = useState([{ id: 1, name: '', quantity: 1, price: 0 }]);
    const [taxRate, setTaxRate] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [notes, setNotes] = useState('Thank you for your business!');
    
    // UI State
    const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);
    
    const printRef = useRef(null);

    useEffect(() => {
        async function init() {
            try {
                const { success: webSuccess, data: webData } = await getWebsiteDetails();
                let billingProfile = {};
                let userEmail = '';

                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                        userEmail = user.email;
                        const { data: profile } = await supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', user.id)
                            .maybeSingle();

                        if (profile && profile.billing_address) {
                            if (typeof profile.billing_address === 'string') {
                                billingProfile = JSON.parse(profile.billing_address);
                            } else {
                                billingProfile = profile.billing_address;
                            }
                        }
                    }
                } catch (err) {
                    console.error("Error fetching profile for billing", err);
                }

                if (webSuccess && webData) {
                    setWebsite(webData);
                    
                    // Auto-fill business info
                    const wData = webData.website_data || {};

                    const fallbackAddress = billingProfile.address
                        ? `${billingProfile.address}${billingProfile.city ? `, ${billingProfile.city}` : ''}${billingProfile.state ? `, ${billingProfile.state}` : ''}${billingProfile.zipCode ? ` - ${billingProfile.zipCode}` : ''}`
                        : '';

                    setBusinessInfo({
                        name: wData.name || wData.businessName || wData.business?.name || billingProfile.companyName || 'Your Store Name',
                        address: wData.business?.address || fallbackAddress || '',
                        email: wData.contact?.email || billingProfile.email || userEmail || '',
                        phone: wData.whatsappNumber || wData.contact?.phone || wData.contact?.whatsapp || billingProfile.phoneNumber || ''
                    });

                    const { success: ordSuccess, data: ordData } = await getOrdersForBilling(webData.id);
                    if (ordSuccess) setOrders(ordData);
                }
            } catch (e) {
                console.error("Init Error", e);
            } finally {
                setLoading(false);
            }
        }
        init();
    }, []);

    const addItem = () => {
        setItems([...items, { id: Date.now(), name: '', quantity: 1, price: 0 }]);
    };

    const updateItem = (id, field, value) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const removeItem = (id) => {
        if (items.length === 1) return;
        setItems(items.filter(item => item.id !== id));
    };

    const loadOrder = (order) => {
        setInvoiceNo(`INV-ORD-${order.id}`);
        setInvoiceDate(new Date(order.created_at).toISOString().split('T')[0]);
        
        setCustomerInfo({
            name: order.customer?.name || 'Guest',
            phone: order.customer?.shipping_address?.phone || '',
            email: order.customer?.email || '',
            address: order.customer?.shipping_address ? `${order.customer.shipping_address.street}, ${order.customer.shipping_address.city}, ${order.customer.shipping_address.state} ${order.customer.shipping_address.pincode}` : ''
        });

        const newItems = order.items.map((i, index) => ({
            id: index,
            name: i.product?.name || `Product #${i.product_id}`,
            quantity: i.quantity,
            price: Number(i.price)
        }));
        
        // Add delivery cost if it was stored in metadata (if not we just sum up)
        // For simplicity, we just take items
        setItems(newItems.length > 0 ? newItems : [{ id: 1, name: '', quantity: 1, price: 0 }]);
        setIsOrderDropdownOpen(false);
        toast.success(`Loaded Order #${order.id}`);
    };

    const calculateSubtotal = () => items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
    const subtotal = calculateSubtotal();
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount - Number(discount);

    const handlePrint = () => {
        const printContent = printRef.current;
        const originalContents = document.body.innerHTML;

        // Apply print styles directly to document
        const printStyles = document.createElement('style');
        printStyles.innerHTML = `
            @media print {
                body * { visibility: hidden; }
                #printable-invoice, #printable-invoice * { visibility: visible; }
                #printable-invoice { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; box-sizing: border-box; }
                .no-print { display: none !important; }
            }
        `;
        document.head.appendChild(printStyles);

        window.print();

        // Cleanup
        document.head.removeChild(printStyles);
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto pb-20 flex flex-col lg:flex-row gap-8 animate-pulse">
                {/* Skeleton Controls */}
                <div className="w-full lg:w-1/3 space-y-6">
                    <div className="h-10 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>

                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                            <div className="h-10 bg-gray-200 rounded w-full"></div>
                            <div className="h-16 bg-gray-200 rounded w-full"></div>
                        </div>
                    ))}
                </div>

                {/* Skeleton Invoice View */}
                <div className="w-full lg:w-2/3 flex flex-col min-h-[800px]">
                    <div className="flex justify-end mb-4">
                        <div className="h-10 bg-gray-200 rounded w-32"></div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex-grow p-10 space-y-8">
                        <div className="flex justify-between">
                            <div className="space-y-2 w-1/3">
                                <div className="h-8 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="space-y-2 text-right">
                                <div className="h-10 bg-gray-200 rounded w-32 ml-auto"></div>
                                <div className="h-4 bg-gray-200 rounded w-24 ml-auto"></div>
                            </div>
                        </div>
                        <div className="w-1/4 space-y-2">
                             <div className="h-6 bg-gray-200 rounded w-full"></div>
                             <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                             <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="space-y-4">
                             <div className="h-8 bg-gray-200 rounded w-full"></div>
                             <div className="h-8 bg-gray-200 rounded w-full"></div>
                             <div className="h-8 bg-gray-200 rounded w-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const businessData = website?.website_data;

    return (
        <div className="max-w-7xl mx-auto pb-20 flex flex-col lg:flex-row gap-8">
            <Toaster position="top-center" />
            
            {/* LEFT: Generator Controls */}
            <div className="w-full lg:w-1/3 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2 mb-2">
                        <ReceiptText className="text-[#8A63D2]" /> Bill Generator
                    </h1>
                    <p className="text-gray-500">Create, customize, and print invoices.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative">
                    <h2 className="font-semibold text-gray-900 mb-4 flex justify-between items-center">
                        Auto-fill from Order
                        <button 
                            onClick={() => setIsOrderDropdownOpen(!isOrderDropdownOpen)}
                            className="text-[#8A63D2] text-sm hover:underline"
                        >
                            Select Order <ChevronDown size={14} className="inline"/>
                        </button>
                    </h2>
                    
                    {isOrderDropdownOpen && (
                        <div className="absolute top-16 left-0 right-0 z-10 bg-white border border-gray-200 shadow-xl rounded-xl max-h-60 overflow-y-auto">
                            {orders.length === 0 ? (
                                <p className="p-4 text-sm text-gray-500 text-center">No orders found.</p>
                            ) : (
                                orders.map(order => (
                                    <button 
                                        key={order.id} 
                                        onClick={() => loadOrder(order)}
                                        className="w-full text-left px-4 py-3 hover:bg-purple-50 border-b border-gray-100 last:border-0 flex justify-between items-center"
                                    >
                                        <div>
                                            <span className="font-semibold text-gray-900">#{order.id}</span>
                                            <p className="text-xs text-gray-500">{order.customer?.name || 'Guest'} • {new Date(order.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <span className="font-bold text-[#8A63D2]">₹{Number(order.total_amount).toFixed(2)}</span>
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </div>

                
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                    <h2 className="font-semibold text-gray-900 mb-2">Your Business Info</h2>
                    <div className="space-y-3">
                        <input type="text" placeholder="Business Name" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-[#8A63D2] focus:border-[#8A63D2]" value={businessInfo.name} onChange={e=>setBusinessInfo({...businessInfo, name: e.target.value})} />
                        <textarea placeholder="Business Address" rows="2" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-[#8A63D2] focus:border-[#8A63D2] resize-none" value={businessInfo.address} onChange={e=>setBusinessInfo({...businessInfo, address: e.target.value})} />
                        <div className="grid grid-cols-2 gap-3">
                            <input type="email" placeholder="Email" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-[#8A63D2] focus:border-[#8A63D2]" value={businessInfo.email} onChange={e=>setBusinessInfo({...businessInfo, email: e.target.value})} />
                            <input type="tel" placeholder="Phone" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-[#8A63D2] focus:border-[#8A63D2]" value={businessInfo.phone} onChange={e=>setBusinessInfo({...businessInfo, phone: e.target.value})} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">

                    <h2 className="font-semibold text-gray-900 mb-2">Invoice Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Invoice No.</label>
                            <input type="text" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-[#8A63D2] focus:border-[#8A63D2]" value={invoiceNo} onChange={e=>setInvoiceNo(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Date</label>
                            <input type="date" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-[#8A63D2] focus:border-[#8A63D2]" value={invoiceDate} onChange={e=>setInvoiceDate(e.target.value)} />
                        </div>
                    </div>

                    <h2 className="font-semibold text-gray-900 mb-2 mt-6">Customer Details</h2>
                    <div className="space-y-3">
                        <input type="text" placeholder="Customer Name" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-[#8A63D2] focus:border-[#8A63D2]" value={customerInfo.name} onChange={e=>setCustomerInfo({...customerInfo, name: e.target.value})} />
                        <div className="grid grid-cols-2 gap-4">
                            <input type="tel" placeholder="Phone" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-[#8A63D2] focus:border-[#8A63D2]" value={customerInfo.phone} onChange={e=>setCustomerInfo({...customerInfo, phone: e.target.value})} />
                            <input type="email" placeholder="Email" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-[#8A63D2] focus:border-[#8A63D2]" value={customerInfo.email} onChange={e=>setCustomerInfo({...customerInfo, email: e.target.value})} />
                        </div>
                        <textarea placeholder="Billing Address" rows="2" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-[#8A63D2] focus:border-[#8A63D2] resize-none" value={customerInfo.address} onChange={e=>setCustomerInfo({...customerInfo, address: e.target.value})} />
                    </div>

                    <h2 className="font-semibold text-gray-900 mb-2 mt-6">Totals & Notes</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Tax (%)</label>
                            <input type="number" min="0" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-[#8A63D2] focus:border-[#8A63D2]" value={taxRate} onChange={e=>setTaxRate(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Discount (₹)</label>
                            <input type="number" min="0" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-[#8A63D2] focus:border-[#8A63D2]" value={discount} onChange={e=>setDiscount(e.target.value)} />
                        </div>
                    </div>
                    <textarea placeholder="Additional Notes..." rows="2" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-[#8A63D2] focus:border-[#8A63D2] resize-none" value={notes} onChange={e=>setNotes(e.target.value)} />

                </div>
            </div>

            {/* RIGHT: Invoice Preview & Interactive Form */}
            <div className="w-full lg:w-2/3 flex flex-col">
                <div className="flex justify-end mb-4 no-print">
                    <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-[#8A63D2] text-white px-6 py-2.5 rounded-xl font-medium shadow-md hover:bg-[#7a55bd] transition-colors"
                    >
                        <Printer size={18} /> Print Invoice
                    </button>
                </div>
                
                {/* The Invoice Container */}
                <div id="printable-invoice" ref={printRef} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden text-gray-900 text-sm flex-grow">
                    
                    {/* Header */}
                    <div className="p-10 border-b border-gray-100 flex justify-between items-start bg-gray-50">
                        <div className="max-w-[50%]">
                            {businessData?.business?.logo && <img src={businessData.business.logo} alt="Logo" className="max-h-16 mb-4 object-contain" />}
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase mb-1">
                                {businessInfo.name}
                            </h2>
                            {businessInfo.address && <p className="text-gray-500 text-sm max-w-xs whitespace-pre-wrap mt-1 mb-2">{businessInfo.address}</p>}
                            {businessInfo.email && <p className="text-gray-500 flex items-center gap-1"><Mail size={12}/> {businessInfo.email}</p>}
                            {businessInfo.phone && <p className="text-gray-500 flex items-center gap-1"><Phone size={12}/> {businessInfo.phone}</p>}
                        </div>
                        <div className="text-right">
                            <h1 className="text-4xl font-black text-[#8A63D2] tracking-widest uppercase mb-4">INVOICE</h1>
                            <div className="flex gap-4 justify-end">
                                <div className="text-right">
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Invoice No</p>
                                    <p className="font-semibold">{invoiceNo}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Date</p>
                                    <p className="font-semibold">{new Date(invoiceDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bill To */}
                    <div className="px-10 py-8">
                        <div className="inline-block border-l-4 border-[#8A63D2] pl-4">
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Billed To</p>
                            <h3 className="font-bold text-lg">{customerInfo.name || 'Walk-in Customer'}</h3>
                            {customerInfo.phone && <p className="text-gray-600">{customerInfo.phone}</p>}
                            {customerInfo.email && <p className="text-gray-600">{customerInfo.email}</p>}
                            {customerInfo.address && <p className="text-gray-500 mt-1 max-w-xs">{customerInfo.address}</p>}
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="px-10 pb-8">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-y-2 border-gray-200">
                                    <th className="py-3 px-2 font-bold uppercase text-xs tracking-wider text-gray-500">Item Description</th>
                                    <th className="py-3 px-2 font-bold uppercase text-xs tracking-wider text-gray-500 text-center w-24">Qty</th>
                                    <th className="py-3 px-2 font-bold uppercase text-xs tracking-wider text-gray-500 text-right w-32">Rate (₹)</th>
                                    <th className="py-3 px-2 font-bold uppercase text-xs tracking-wider text-gray-500 text-right w-32">Amount (₹)</th>
                                    <th className="w-10 no-print"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {items.map((item, idx) => (
                                    <tr key={item.id} className="group">
                                        <td className="py-3 px-2">
                                            <input 
                                                type="text" 
                                                placeholder="Item Name" 
                                                className="w-full bg-transparent border-0 border-b border-transparent focus:border-gray-300 focus:ring-0 px-0 outline-none"
                                                value={item.name}
                                                onChange={e => updateItem(item.id, 'name', e.target.value)}
                                            />
                                        </td>
                                        <td className="py-3 px-2">
                                            <input 
                                                type="number" 
                                                min="1"
                                                className="w-full bg-transparent border-0 border-b border-transparent focus:border-gray-300 focus:ring-0 px-0 text-center outline-none"
                                                value={item.quantity}
                                                onChange={e => updateItem(item.id, 'quantity', e.target.value)}
                                            />
                                        </td>
                                        <td className="py-3 px-2">
                                            <input 
                                                type="number" 
                                                min="0"
                                                className="w-full bg-transparent border-0 border-b border-transparent focus:border-gray-300 focus:ring-0 px-0 text-right outline-none"
                                                value={item.price}
                                                onChange={e => updateItem(item.id, 'price', e.target.value)}
                                            />
                                        </td>
                                        <td className="py-3 px-2 text-right font-medium">
                                            {(Number(item.price) * Number(item.quantity)).toFixed(2)}
                                        </td>
                                        <td className="py-3 text-right no-print">
                                            <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        <div className="mt-4 no-print">
                            <button onClick={addItem} className="flex items-center gap-1 text-[#8A63D2] font-medium text-sm hover:underline">
                                <Plus size={16} /> Add Line Item
                            </button>
                        </div>
                    </div>

                    {/* Totals Section */}
                    <div className="px-10 pb-10 flex flex-col items-end">
                        <div className="w-full max-w-sm space-y-3 text-sm">
                            <div className="flex justify-between text-gray-500">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
                            </div>
                            {taxRate > 0 && (
                                <div className="flex justify-between text-gray-500">
                                    <span>Tax ({taxRate}%)</span>
                                    <span className="font-medium text-gray-900">+ ₹{taxAmount.toFixed(2)}</span>
                                </div>
                            )}
                            {discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span className="font-medium">- ₹{Number(discount).toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-xl font-black text-gray-900 pt-3 border-t-2 border-gray-200 mt-3">
                                <span>Total Due</span>
                                <span className="text-[#8A63D2]">₹{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Notes */}
                    {notes && (
                        <div className="px-10 py-6 bg-gray-50 border-t border-gray-100 text-gray-500 text-xs text-center">
                            {notes}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
