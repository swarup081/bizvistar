'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useState, useEffect } from 'react';
import { X, Check, Search, Plus, Trash2, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { submitOrder } from '@/app/actions/orderActions'; // Reuse logic
import StateSelector from '@/components/checkout/StateSelector'; // Reuse State Selector

// Source Options
const SOURCE_OPTIONS = [
    { value: 'social_media', label: 'Social Media (IG/FB)' },
    { value: 'whatsapp', label: 'WhatsApp / DM' },
    { value: 'phone', label: 'Phone Call' },
    { value: 'walk_in', label: 'Walk-in' },
    { value: 'other', label: 'Other (Specify)' }
];

export default function AddOrderWizard({ isOpen, onClose, onOrderAdded, websiteId }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]); // Available products
  const [productSearch, setProductSearch] = useState('');

  // Form State
  const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      phone: '',
      email: '', // Optional for manual? User can add dummy if needed, but we'll try to keep optional.
      address: '',
      city: '',
      state: '',
      zipCode: '',
      sourceType: '',
      sourceOther: '',
      note: ''
  });

  const [cart, setCart] = useState([]); // [{id, name, price, quantity, image_url}]

  // Fetch products on mount
  useEffect(() => {
      if (isOpen && websiteId) {
          const fetchProds = async () => {
              const { data } = await supabase.from('products').select('*').eq('website_id', websiteId);
              if (data) setProducts(data);
          };
          fetchProds();
      }
  }, [isOpen, websiteId]);

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const addToCart = (product) => {
      setCart(prev => {
          const existing = prev.find(p => p.id === product.id);
          if (existing) {
              return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
          }
          return [...prev, { ...product, quantity: 1 }];
      });
  };

  const updateQuantity = (id, delta) => {
      setCart(prev => prev.map(p => {
          if (p.id === id) {
              const newQ = Math.max(1, p.quantity + delta);
              return { ...p, quantity: newQ };
          }
          return p;
      }));
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(p => p.id !== id));

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = async () => {
      setLoading(true);
      try {
          const manualSource = formData.sourceType === 'other' ? formData.sourceOther : SOURCE_OPTIONS.find(s => s.value === formData.sourceType)?.label || 'Manual';

          const result = await submitOrder({
              siteSlug: null, // Manual order, we bypass slug lookup in action if we modify it or handle ID directly?
              // Wait, submitOrder uses slug. I need to pass websiteId or handle manual mode.
              // I'll create a special wrapper or modify submitOrder to take websiteId directly if slug is missing.
              // For now, I'll pass a "manual" flag in customerDetails or similar.
              // Actually, I can fetch the slug from props if available?
              // Better: I'll invoke a NEW action or modify existing.
              // Let's use a Direct DB call here for simplicity since I'm in dashboard (authenticated),
              // OR modify submitOrder. modifying submitOrder is safer for consistency.
              // I'll pass "manual_entry" as a flag.
              // *Correction*: submitOrder requires siteSlug to find website.
              // I should fetch the slug for this websiteId first.
              cartDetails: cart,
              customerDetails: {
                  ...formData,
                  source: manualSource // Pass source to save in metadata/notes
              },
              totalAmount // Redundant, calculated backend
          });

          // WAIT: submitOrder expects siteSlug. I need to get it.
          // I will assume the parent passes slug or I fetch it.
          // Let's fetch it quickly if not passed.

      } catch (e) {
          alert('Error: ' + e.message);
      } finally {
          setLoading(false);
      }
  };

  // Custom Submit Handler to bridge the gap
  const handleFinalSubmit = async () => {
      setLoading(true);
      try {
        // 1. Get Slug
        const { data: web } = await supabase.from('websites').select('site_slug').eq('id', websiteId).single();
        if(!web) throw new Error("Website not found");

        const manualSource = formData.sourceType === 'other' ? formData.sourceOther : SOURCE_OPTIONS.find(s => s.value === formData.sourceType)?.label || 'Manual';

        const result = await submitOrder({
            siteSlug: web.site_slug,
            cartDetails: cart.map(c => ({...c, image: c.image_url})), // Map image_url to image for action compatibility
            customerDetails: {
                ...formData,
                isManual: true,
                manualSource: manualSource
            }
        });

        if (result.success) {
            onOrderAdded();
            onClose();
            // Reset
            setStep(1);
            setCart([]);
            setFormData({ firstName: '', lastName: '', phone: '', address: '', city: '', state: '', zipCode: '', sourceType: '', sourceOther: '' });
        } else {
            alert('Failed: ' + result.error);
        }

      } catch(e) {
          console.error(e);
          alert('Error: ' + e.message);
      } finally {
          setLoading(false);
      }
  };

  if (!isOpen) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-[70] flex flex-col max-h-[90vh] focus:outline-none overflow-hidden font-sans">

            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                <h2 className="text-xl font-bold text-gray-900">Create New Order</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                    <X size={20} />
                </button>
            </div>

            {/* Steps Indicator */}
            <div className="px-8 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s ? 'bg-[#8A63D2] text-white' : 'bg-gray-200 text-gray-500'}`}>
                            {step > s ? <Check size={16} /> : s}
                        </div>
                        <span className={`text-sm font-medium ${step >= s ? 'text-gray-900' : 'text-gray-400'}`}>
                            {s === 1 ? 'Customer' : s === 2 ? 'Products' : 'Review'}
                        </span>
                        {s < 3 && <div className="w-12 h-px bg-gray-200 mx-2 hidden sm:block"></div>}
                    </div>
                ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-8">
                {step === 1 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-200">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">First Name</label>
                                <input value={formData.firstName} onChange={e => updateField('firstName', e.target.value)} className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-[#8A63D2]" placeholder="Jane" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Last Name</label>
                                <input value={formData.lastName} onChange={e => updateField('lastName', e.target.value)} className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-[#8A63D2]" placeholder="Doe" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Phone</label>
                                <input value={formData.phone} onChange={e => updateField('phone', e.target.value)} className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-[#8A63D2]" placeholder="9876543210" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Email (Opt)</label>
                                <input value={formData.email} onChange={e => updateField('email', e.target.value)} className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-[#8A63D2]" placeholder="jane@example.com" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Address</label>
                            <input value={formData.address} onChange={e => updateField('address', e.target.value)} className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-[#8A63D2]" placeholder="Street Address" />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">City</label>
                                <input value={formData.city} onChange={e => updateField('city', e.target.value)} className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-[#8A63D2]" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">State</label>
                                <StateSelector value={formData.state} onChange={val => updateField('state', val)} className="p-2.5 border-gray-200 rounded-lg text-sm" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Zip</label>
                                <input value={formData.zipCode} onChange={e => updateField('zipCode', e.target.value)} className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-[#8A63D2]" />
                            </div>
                        </div>

                        <div className="space-y-1 pt-4 border-t border-gray-100">
                            <label className="text-xs font-bold text-[#8A63D2] uppercase">Order Source</label>
                            <select
                                value={formData.sourceType}
                                onChange={e => updateField('sourceType', e.target.value)}
                                className="w-full p-2.5 border rounded-lg text-sm bg-white outline-none focus:border-[#8A63D2]"
                            >
                                <option value="">Select Source</option>
                                {SOURCE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                            {formData.sourceType === 'other' && (
                                <input
                                    value={formData.sourceOther}
                                    onChange={e => updateField('sourceOther', e.target.value)}
                                    className="w-full p-2.5 mt-2 border rounded-lg text-sm outline-none focus:border-[#8A63D2]"
                                    placeholder="Type source name..."
                                />
                            )}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-200 h-full flex flex-col">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                value={productSearch}
                                onChange={e => setProductSearch(e.target.value)}
                                placeholder="Search products..."
                                className="w-full pl-9 p-3 border rounded-xl text-sm outline-none focus:border-[#8A63D2]"
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto border border-gray-100 rounded-xl bg-gray-50 p-2 space-y-2 min-h-[200px] max-h-[300px]">
                            {products
                                .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                                .map(product => (
                                    <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-gray-100 rounded overflow-hidden">
                                                {product.image_url && <img src={product.image_url} alt="" className="h-full w-full object-cover" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{product.name}</p>
                                                <p className="text-xs text-gray-500">₹{product.price}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => addToCart(product)}
                                            className="p-2 bg-gray-100 hover:bg-[#8A63D2] hover:text-white rounded-lg transition-colors"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                ))}
                        </div>

                        {cart.length > 0 && (
                            <div className="border-t border-gray-100 pt-4">
                                <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Selected Items</h3>
                                <div className="space-y-2 max-h-[150px] overflow-y-auto">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex items-center justify-between text-sm">
                                            <span className="flex-1 truncate pr-2">{item.name}</span>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center border rounded-md">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 hover:bg-gray-100">-</button>
                                                    <span className="px-2 text-xs">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 hover:bg-gray-100">+</button>
                                                </div>
                                                <span className="w-16 text-right font-medium">₹{item.price * item.quantity}</span>
                                                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 text-right font-bold text-lg">Total: ₹{totalAmount}</div>
                            </div>
                        )}
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-200">
                        <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="block text-xs text-gray-500 uppercase">Customer</span>
                                    <span className="font-bold">{formData.firstName} {formData.lastName}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-500 uppercase">Contact</span>
                                    <span>{formData.phone}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="block text-xs text-gray-500 uppercase">Address</span>
                                    <span>{formData.address}, {formData.city}, {formData.state} {formData.zipCode}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-500 uppercase">Source</span>
                                    <span className="text-[#8A63D2] font-medium">
                                        {formData.sourceType === 'other' ? formData.sourceOther : SOURCE_OPTIONS.find(s => s.value === formData.sourceType)?.label}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Order Summary</h3>
                            <div className="space-y-2">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                                        <span>{item.name} x {item.quantity}</span>
                                        <span className="font-medium">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 flex justify-between items-center pt-2 border-t border-gray-100">
                                <span className="font-bold text-gray-900">Total Amount</span>
                                <span className="text-xl font-bold text-[#8A63D2]">₹{totalAmount}</span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Internal Note (Optional)</label>
                            <textarea
                                value={formData.note}
                                onChange={e => updateField('note', e.target.value)}
                                className="w-full p-3 border rounded-xl text-sm outline-none focus:border-[#8A63D2] resize-none"
                                placeholder="Any special instructions..."
                                rows={2}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-100 flex justify-between bg-white">
                <button
                    onClick={() => setStep(s => Math.max(1, s - 1))}
                    disabled={step === 1}
                    className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium disabled:opacity-50 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                    <ChevronLeft size={16} /> Back
                </button>

                {step < 3 ? (
                    <button
                        onClick={() => {
                            if (step === 1) {
                                if (!formData.firstName || !formData.phone || !formData.sourceType) return alert("Please fill required details");
                            }
                            if (step === 2 && cart.length === 0) return alert("Add at least one product");
                            setStep(s => s + 1);
                        }}
                        className="px-6 py-2.5 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                        Next Step <ChevronRight size={16} />
                    </button>
                ) : (
                    <button
                        onClick={handleFinalSubmit}
                        disabled={loading}
                        className="px-8 py-2.5 rounded-xl bg-[#8A63D2] text-white font-bold hover:bg-[#7854bc] transition-colors flex items-center gap-2 shadow-lg shadow-purple-200"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                        Create Order
                    </button>
                )}
            </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
