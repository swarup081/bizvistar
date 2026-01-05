"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Trash2, Printer, Save, Loader2, Package } from 'lucide-react';
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

  // Product Grid State
  const [searchTerm, setSearchTerm] = useState('');
  const [availableProducts, setAvailableProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Business Details (for Invoice)
  const [businessDetails, setBusinessDetails] = useState({
    name: 'My Shop',
    address: '',
    logo: ''
  });

  // Load business details & products on mount
  useEffect(() => {
    async function loadData() {
      // 1. Load Products (Initial list)
      const products = await searchProducts('');
      setAvailableProducts(products);
      setFilteredProducts(products);

      // 2. Load Details
      const cached = localStorage.getItem('biz_invoice_settings');
      if (cached) {
        setBusinessDetails(JSON.parse(cached));
      } else {
        const data = await getShopDetails();
        if (data && data.website_data) {
           setBusinessDetails(prev => ({
               ...prev,
               name: data.website_data.name || data.site_slug || 'My Shop',
           }));
        }
      }
    }
    loadData();
  }, []);

  // Filter Logic
  useEffect(() => {
    if (searchTerm.trim() === '') {
        setFilteredProducts(availableProducts);
    } else {
        setFilteredProducts(availableProducts.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    }
  }, [searchTerm, availableProducts]);

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
        stock: product.stock,
        image: product.image_url
      }];
    });
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
        generatePDF(res.orderNumber);
        setItems([]);
        setCustomerName('');
        alert("Order saved and Invoice generated!");
    } else {
        alert("Error saving order: " + res.error);
    }
    setIsSaving(false);
  };

  return (
    <div className="h-full flex gap-6 overflow-hidden">
        {/* Left: Product Grid (3 columns) */}
        <div className="flex-1 flex flex-col gap-6 h-full overflow-hidden">
             {/* Header & Search */}
             <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white/20">
                 <h1 className="text-xl font-bold text-gray-800 whitespace-nowrap">POS Lite</h1>
                 <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        className="w-full pl-10 p-2.5 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-purple-100"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                 </div>
             </div>

             {/* Grid */}
             <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 pb-20">
                 {filteredProducts.map(p => (
                     <div
                        key={p.id}
                        onClick={() => addToCart(p)}
                        className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-lg transition-all cursor-pointer border border-transparent hover:border-purple-200 group flex flex-col gap-2"
                     >
                         <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative">
                             {p.image_url ? (
                                 <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url(${p.image_url})` }}></div>
                             ) : (
                                 <div className="w-full h-full flex items-center justify-center text-gray-300">
                                     <Package size={32} />
                                 </div>
                             )}
                             <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-gray-900 shadow-sm">
                                 ${p.price}
                             </div>
                         </div>
                         <div>
                             <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{p.name}</h3>
                             <p className="text-xs text-gray-500">{p.stock === -1 ? 'Unlimited' : `${p.stock} in stock`}</p>
                         </div>
                     </div>
                 ))}
             </div>
        </div>

        {/* Right: Cart & Form (Fixed Width) */}
        <div className="w-[400px] flex flex-col gap-4 h-full bg-white/90 backdrop-blur-xl border-l border-white/50 shadow-2xl p-6 rounded-l-3xl -mr-10 pr-14 overflow-y-auto">

            <h2 className="font-bold text-lg text-gray-800">Current Order</h2>

            {/* Customer Form */}
            <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <input
                   className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-white"
                   placeholder="Customer Name *"
                   value={customerName}
                   onChange={e => setCustomerName(e.target.value)}
                />
                 <input
                   className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-white"
                   placeholder="Email (Optional)"
                   value={customerEmail}
                   onChange={e => setCustomerEmail(e.target.value)}
                />
                 <textarea
                   className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-white resize-none"
                   placeholder="Billing Address (Optional)"
                   rows={2}
                   value={customerAddress}
                   onChange={e => setCustomerAddress(e.target.value)}
                />
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto space-y-3 min-h-[200px]">
                {items.length === 0 && (
                     <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2 opacity-50">
                         <Package size={40} />
                         <span className="text-sm">No items added</span>
                     </div>
                )}
                {items.map(item => (
                    <div key={item.productId} className="flex gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-50 group">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }}></div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-sm text-gray-800 truncate">{item.name}</h4>
                                <button onClick={() => removeItem(item.productId)} className="text-gray-300 hover:text-red-500 transition-colors">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <div className="text-xs text-gray-500">${item.price}</div>
                                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-1">
                                    <button onClick={() => updateQuantity(item.productId, -1)} className="p-1 hover:bg-gray-200 rounded text-xs">-</button>
                                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.productId, 1)} className="p-1 hover:bg-gray-200 rounded text-xs">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Actions */}
            <div className="mt-auto space-y-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center text-xl font-black text-gray-800">
                    <span>Total</span>
                    <span>${totalAmount.toFixed(2)}</span>
                </div>

                <button
                    onClick={handleSaveAndPrint}
                    disabled={isSaving || items.length === 0}
                    className="w-full py-4 bg-[#8A63D2] hover:bg-[#7750bf] text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                >
                    {isSaving ? <Loader2 className="animate-spin" /> : <Printer />}
                    Generate Invoice
                </button>

                {/* Invoice Settings Toggle (Simplified) */}
                <details className="text-xs text-gray-400 cursor-pointer">
                    <summary className="list-none hover:text-gray-600">Edit Shop Details</summary>
                    <div className="mt-2 space-y-2">
                         <input
                           className="w-full p-2 border rounded"
                           value={businessDetails.name}
                           onChange={e => {
                               const v = {...businessDetails, name: e.target.value};
                               setBusinessDetails(v);
                               localStorage.setItem('biz_invoice_settings', JSON.stringify(v));
                           }}
                           placeholder="Shop Name"
                        />
                         <input
                           className="w-full p-2 border rounded"
                           value={businessDetails.address}
                           onChange={e => {
                               const v = {...businessDetails, address: e.target.value};
                               setBusinessDetails(v);
                               localStorage.setItem('biz_invoice_settings', JSON.stringify(v));
                           }}
                           placeholder="Address"
                        />
                    </div>
                </details>
            </div>
        </div>
    </div>
  );
}
