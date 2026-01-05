"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Trash2, Printer, Save, Loader2 } from 'lucide-react';
import { createQuickInvoiceOrder, searchProducts, getShopDetails } from '../../../actions/posActions';
import jsPDF from 'jspdf';
import Link from 'next/link';

export default function QuickInvoicePage() {
  // State
  const [items, setItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Business Details (for Invoice)
  const [businessDetails, setBusinessDetails] = useState({
    name: 'My Shop',
    address: '',
    logo: ''
  });

  // Load business details on mount
  useEffect(() => {
    async function loadDetails() {
      // 1. Try Local Storage
      const cached = localStorage.getItem('biz_invoice_settings');
      if (cached) {
        setBusinessDetails(JSON.parse(cached));
      } else {
        // 2. Try Server
        const data = await getShopDetails();
        if (data && data.website_data) {
           // Extract useful info
           // Assuming website_data has some structure, usually templates vary.
           // We'll default to site slug or generic.
           setBusinessDetails(prev => ({
               ...prev,
               name: data.website_data.name || data.site_slug || 'My Shop',
           }));
        }
      }
    }
    loadDetails();
  }, []);

  // Search Logic
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchTerm.length > 1) {
        const results = await searchProducts(searchTerm);
        setSearchResults(results);
        setShowResults(true);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const addToCart = (product) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) {
        return prev.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        stock: product.stock
      }];
    });
    setSearchTerm('');
    setShowResults(false);
  };

  const updateQuantity = (id, delta) => {
    setItems(prev => prev.map(item => {
      if (item.productId === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.productId !== id));
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // PDF Generation
  const generatePDF = (orderNumber) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(20);
    doc.text(businessDetails.name || "Invoice", 20, 20);

    doc.setFontSize(10);
    doc.text(businessDetails.address || "", 20, 30);

    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 20, 20, { align: 'right' });
    doc.text(`Order #${orderNumber || 'DRAFT'}`, pageWidth - 20, 26, { align: 'right' });

    // Customer
    doc.line(20, 40, pageWidth - 20, 40);
    doc.setFontSize(12);
    doc.text("Bill To:", 20, 50);
    doc.setFontSize(10);
    doc.text(customerName || "Walk-in Customer", 20, 56);
    if (customerAddress) doc.text(customerAddress, 20, 62);

    // Table Header
    let y = 80;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, y - 5, pageWidth - 40, 8, 'F');
    doc.font = "helvetica";
    doc.setFont(undefined, 'bold');
    doc.text("Item", 25, y);
    doc.text("Qty", 120, y);
    doc.text("Price", 145, y);
    doc.text("Total", 170, y);

    // Items
    y += 10;
    doc.setFont(undefined, 'normal');
    items.forEach(item => {
        doc.text(item.name.substring(0, 40), 25, y);
        doc.text(String(item.quantity), 120, y);
        doc.text(`$${item.price.toFixed(2)}`, 145, y);
        doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 170, y);
        y += 8;
    });

    // Total
    y += 5;
    doc.line(20, y, pageWidth - 20, y);
    y += 10;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Total: $${totalAmount.toFixed(2)}`, pageWidth - 25, y, { align: 'right' });

    // Footer
    doc.setFontSize(8);
    doc.setFont(undefined, 'italic');
    doc.setTextColor(150);
    doc.text("Powered by BizVistar", pageWidth / 2, pageWidth - 10, { align: 'center' });

    doc.save(`Invoice_${orderNumber || 'Draft'}.pdf`);
  };

  const handleSaveAndPrint = async () => {
    if (items.length === 0) return alert("Please add items first.");
    if (!customerName) return alert("Please enter customer name.");

    setIsSaving(true);

    // 1. Save to DB
    const res = await createQuickInvoiceOrder({
        customerName,
        customerEmail,
        customerAddress,
        items,
        totalAmount
    });

    if (res.success) {
        // 2. Generate PDF
        generatePDF(res.orderNumber);

        // 3. Reset
        setItems([]);
        setCustomerName('');
        alert("Order saved and Invoice generated!");
    } else {
        alert("Error saving order: " + res.error);
    }

    setIsSaving(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Left: Input & Cart */}
        <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-4">Customer Details</h2>
                <div className="space-y-4">
                    <input
                       className="w-full p-2 border rounded-lg"
                       placeholder="Customer Name *"
                       value={customerName}
                       onChange={e => setCustomerName(e.target.value)}
                    />
                    <input
                       className="w-full p-2 border rounded-lg"
                       placeholder="Email (Optional)"
                       value={customerEmail}
                       onChange={e => setCustomerEmail(e.target.value)}
                    />
                     <textarea
                       className="w-full p-2 border rounded-lg"
                       placeholder="Billing/Shipping Address (Optional)"
                       value={customerAddress}
                       onChange={e => setCustomerAddress(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1 relative">
                 <h2 className="text-lg font-bold mb-4">Add Items</h2>

                 {/* Search */}
                 <div className="relative mb-6">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                        className="w-full pl-10 p-2.5 border rounded-lg bg-gray-50 focus:bg-white transition-colors"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    {showResults && (
                        <div className="absolute top-full left-0 right-0 bg-white shadow-xl rounded-lg mt-1 border border-gray-100 z-10 max-h-60 overflow-y-auto">
                            {searchResults.length > 0 ? searchResults.map(p => (
                                <div
                                  key={p.id}
                                  onClick={() => addToCart(p)}
                                  className="p-3 hover:bg-purple-50 cursor-pointer flex justify-between items-center border-b border-gray-50 last:border-0"
                                >
                                    <span className="font-medium">{p.name}</span>
                                    <span className="text-sm text-gray-500">${p.price}</span>
                                </div>
                            )) : (
                                <div className="p-3 text-gray-400 text-sm">No products found</div>
                            )}
                        </div>
                    )}
                 </div>

                 {/* Cart List */}
                 <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                     {items.length === 0 && (
                         <div className="text-center py-10 text-gray-400 italic">
                             Cart is empty
                         </div>
                     )}
                     {items.map(item => (
                         <div key={item.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                             <div>
                                 <div className="font-medium text-sm">{item.name}</div>
                                 <div className="text-xs text-gray-500">${item.price} each</div>
                             </div>
                             <div className="flex items-center gap-3">
                                 <div className="flex items-center bg-white rounded-md border border-gray-200">
                                     <button onClick={() => updateQuantity(item.productId, -1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100">-</button>
                                     <span className="w-8 text-center text-sm">{item.quantity}</span>
                                     <button onClick={() => updateQuantity(item.productId, 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100">+</button>
                                 </div>
                                 <div className="font-bold w-16 text-right">${(item.price * item.quantity).toFixed(2)}</div>
                                 <button onClick={() => removeItem(item.productId)} className="text-red-400 hover:text-red-600">
                                     <Trash2 size={16} />
                                 </button>
                             </div>
                         </div>
                     ))}
                 </div>

                 {/* Total */}
                 <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-xl font-bold">
                     <span>Total</span>
                     <span>${totalAmount.toFixed(2)}</span>
                 </div>
            </div>
        </div>

        {/* Right: Preview & Settings */}
        <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-4">Invoice Settings</h2>
                <div className="space-y-4 text-sm">
                    <input
                       className="w-full p-2 border rounded-lg"
                       placeholder="Shop Name"
                       value={businessDetails.name}
                       onChange={e => {
                           const newVal = { ...businessDetails, name: e.target.value };
                           setBusinessDetails(newVal);
                           localStorage.setItem('biz_invoice_settings', JSON.stringify(newVal));
                       }}
                    />
                     <textarea
                       className="w-full p-2 border rounded-lg"
                       placeholder="Shop Address & Phone"
                       rows={3}
                       value={businessDetails.address}
                       onChange={e => {
                           const newVal = { ...businessDetails, address: e.target.value };
                           setBusinessDetails(newVal);
                           localStorage.setItem('biz_invoice_settings', JSON.stringify(newVal));
                       }}
                    />
                </div>
            </div>

            {/* Live Preview (Simple representation) */}
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 shadow-inner flex-1 flex flex-col items-center justify-center text-center opacity-80 select-none">
                <FileTextPreview businessDetails={businessDetails} items={items} total={totalAmount} customerName={customerName} />
            </div>

            <button
                onClick={handleSaveAndPrint}
                disabled={isSaving || items.length === 0}
                className="w-full py-4 bg-[#8A63D2] hover:bg-[#7750bf] text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSaving ? <Loader2 className="animate-spin" /> : <Printer />}
                Generate & Save Invoice
            </button>
        </div>
    </div>
  );
}

// Simple CSS Preview Component
function FileTextPreview({ businessDetails, items, total, customerName }) {
    return (
        <div className="bg-white w-full max-w-sm p-6 shadow-md text-left text-xs text-gray-600 relative overflow-hidden h-[300px]">
             <div className="absolute top-0 left-0 w-full h-2 bg-purple-500"></div>
             <div className="font-bold text-lg text-gray-800 mb-1">{businessDetails.name || 'Shop Name'}</div>
             <div className="mb-4 whitespace-pre-wrap">{businessDetails.address || 'Address...'}</div>

             <div className="border-b pb-2 mb-2">
                 <div className="font-bold">Bill To:</div>
                 <div>{customerName || 'Customer Name'}</div>
             </div>

             <div className="space-y-1 mb-4">
                 {items.slice(0, 3).map((item, i) => (
                     <div key={i} className="flex justify-between">
                         <span>{item.name}</span>
                         <span>${item.price}</span>
                     </div>
                 ))}
                 {items.length > 3 && <div className="italic text-gray-400">...and {items.length - 3} more</div>}
             </div>

             <div className="border-t pt-2 flex justify-between font-bold text-base text-gray-900 mt-auto">
                 <span>Total</span>
                 <span>${total.toFixed(2)}</span>
             </div>

             <div className="absolute bottom-2 left-0 w-full text-center text-[8px] text-gray-400">
                 Powered by BizVistar
             </div>
        </div>
    );
}
