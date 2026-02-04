'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useState, useEffect } from 'react';
import { X, Check, Search, Plus, Trash2, ChevronRight, ChevronLeft, Loader2, User, MapPin, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { submitOrder } from '@/app/actions/orderActions'; 
import StyledInput from '@/components/ui/StyledInput';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { cn } from '@/lib/utils';

// Source Options
const SOURCE_OPTIONS = [
    { value: 'social_media', label: 'Social Media' },
    { value: 'website', label: 'Website' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'phone', label: 'Phone Call' },
    { value: 'walk_in', label: 'Walk-in' },
    { value: 'other', label: 'Other' }
];

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function AddOrderWizard({ isOpen, onClose, onOrderAdded, websiteId, initialProducts }) {
  const [step, setStep] = useState(1);
  const [subStep1, setSubStep1] = useState(1); // 1: Personal, 2: Address
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]); 
  const [productSearch, setProductSearch] = useState('');
  const [outOfStockAlert, setOutOfStockAlert] = useState(null); // { id: productId, message: string }

  // Form State
  const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      sourceType: '',
      sourceOther: '',
      note: ''
  });

  const [cart, setCart] = useState([]); 

  useEffect(() => {
      if (isOpen) {
          if (initialProducts) {
              setProducts(initialProducts);
          } else if (websiteId) {
              const fetchProds = async () => {
                  const { data } = await supabase.from('products').select('*').eq('website_id', websiteId);
                  if (data) setProducts(data);
              };
              fetchProds();
          }
      }
  }, [isOpen, websiteId, initialProducts]);

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const addToCart = (product) => {
      // Check for Out of Stock
      if (product.stock !== -1 && product.stock <= 0) {
          setOutOfStockAlert({ id: product.id, message: "This product cannot be added since it is out of stock." });
          // Clear alert after 3 seconds
          setTimeout(() => setOutOfStockAlert(null), 3000);
          return;
      }

      // Check if adding exceeds stock (if managing stock strictly in cart too)
      const currentInCart = cart.find(p => p.id === product.id)?.quantity || 0;
      if (product.stock !== -1 && currentInCart + 1 > product.stock) {
           setOutOfStockAlert({ id: product.id, message: `Only ${product.stock} items available in stock.` });
           setTimeout(() => setOutOfStockAlert(null), 3000);
           return;
      }

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
              const product = products.find(prod => prod.id === id);
              const newQ = p.quantity + delta;

              // Validate max stock
              if (delta > 0 && product && product.stock !== -1 && newQ > product.stock) {
                   // Optional: could show alert here too, but simple blocking is usually enough for +/- buttons
                   return p;
              }

              return { ...p, quantity: Math.max(1, newQ) };
          }
          return p;
      }));
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(p => p.id !== id));

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleFinalSubmit = async () => {
      setLoading(true);
      try {
        const { data: web } = await supabase.from('websites').select('site_slug').eq('id', websiteId).single();
        if(!web) throw new Error("Website not found");

        const manualSource = formData.sourceType === 'other' ? formData.sourceOther : SOURCE_OPTIONS.find(s => s.value === formData.sourceType)?.label || 'Manual';

        const result = await submitOrder({
            siteSlug: web.site_slug,
            cartDetails: cart.map(c => ({...c, image: c.image_url})),
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
            setSubStep1(1);
            setCart([]);
            setFormData({ firstName: '', lastName: '', phone: '', address: '', city: '', state: '', zipCode: '', sourceType: '', sourceOther: '', note: '' });
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

  // Helper for sub-step navigation
  const handleNext = () => {
      if (step === 1) {
          if (subStep1 === 1) {
              if (!formData.firstName || !formData.phone) return alert("Please fill required details");
              setSubStep1(2);
          } else {
              // Address validation optional? Let's require at least source
              if (!formData.sourceType) return alert("Please select an Order Source");
              setStep(2);
          }
      } else if (step === 2) {
          if (cart.length === 0) return alert("Add at least one product");
          setStep(3);
      }
  };

  const handleBack = () => {
      if (step === 3) setStep(2);
      else if (step === 2) setStep(1);
      else if (step === 1) {
          if (subStep1 === 2) setSubStep1(1);
      }
  };

  if (!isOpen) return null;

  // Products to Display - ONLY SHOW IF SEARCHED
  const displayProducts = productSearch 
      ? products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase())) 
      : [];

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] md:w-full max-w-lg bg-white rounded-2xl shadow-2xl z-[70] flex flex-col max-h-[90vh] focus:outline-none overflow-hidden font-sans">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
                <h2 className="text-xl font-bold text-gray-900">Create New Order</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Steps Indicator */}
            <div className="px-8 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between sticky top-[76px] z-10 shrink-0">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s ? 'bg-[#8A63D2] text-white' : 'bg-gray-200 text-gray-500'}`}>
                            {step > s ? <Check size={16} /> : s}
                        </div>
                        <span className={`text-sm font-medium ${step >= s ? 'text-gray-900' : 'text-gray-400'}`}>
                            {s === 1 ? 'Customer' : s === 2 ? 'Products' : 'Review'}
                        </span>
                        {s < 3 && <div className="w-8 h-px bg-gray-200 mx-1 hidden sm:block"></div>}
                    </div>
                ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                
                {/* STEP 1: CUSTOMER */}
                {step === 1 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-200">
                        {subStep1 === 1 ? (
                            // Sub-step 1.1: Personal
                            <div className="space-y-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><User size={18}/></div>
                                    <h3 className="font-bold text-gray-900">Personal Details</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase">First Name</label>
                                        <StyledInput
                                            value={formData.firstName}
                                            onChange={e => updateField('firstName', e.target.value)}
                                            placeholder="Jane"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Last Name</label>
                                        <StyledInput
                                            value={formData.lastName}
                                            onChange={e => updateField('lastName', e.target.value)}
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                                    <StyledInput
                                        value={formData.phone}
                                        onChange={e => updateField('phone', e.target.value)}
                                        placeholder="9876543210"
                                    />
                                </div>
                            </div>
                        ) : (
                            // Sub-step 1.2: Address & Source
                            <div className="space-y-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><MapPin size={18}/></div>
                                    <h3 className="font-bold text-gray-900">Address & Source</h3>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Address</label>
                                    <StyledInput
                                        value={formData.address}
                                        onChange={e => updateField('address', e.target.value)}
                                        placeholder="Street Address"
                                        autoFocus
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase">City</label>
                                        <StyledInput
                                            value={formData.city}
                                            onChange={e => updateField('city', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase">State</label>
                                        <SearchableSelect
                                            options={INDIAN_STATES}
                                            value={formData.state}
                                            onChange={val => updateField('state', val)}
                                            placeholder="Select State"
                                            searchPlaceholder="Search state..."
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Zip Code</label>
                                    <StyledInput
                                        value={formData.zipCode}
                                        onChange={e => updateField('zipCode', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-3 pt-4 border-t border-gray-100">
                                    <label className="text-xs font-bold text-[#8A63D2] uppercase">Order Source</label>
                                    <SearchableSelect
                                        options={SOURCE_OPTIONS}
                                        value={formData.sourceType}
                                        onChange={val => updateField('sourceType', val)}
                                        placeholder="Select Source..."
                                        searchPlaceholder="Search sources..."
                                    />

                                    {formData.sourceType === 'other' && (
                                        <StyledInput
                                            value={formData.sourceOther} 
                                            onChange={e => updateField('sourceOther', e.target.value)} 
                                            className="mt-2 animate-in fade-in slide-in-from-top-2"
                                            placeholder="Specify source..."
                                            autoFocus
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* STEP 2: PRODUCTS */}
                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-200 h-full flex flex-col relative">

                        {/* Out of Stock Alert Overlay */}
                        {outOfStockAlert && (
                            <div className="absolute top-16 left-0 right-0 z-20 mx-auto w-[90%] md:w-[80%] bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                                <AlertCircle className="shrink-0 w-5 h-5 text-red-600" />
                                <span className="text-sm font-medium">{outOfStockAlert.message}</span>
                            </div>
                        )}

                        <div className="relative shrink-0 z-10">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <StyledInput
                                value={productSearch}
                                onChange={e => setProductSearch(e.target.value)}
                                placeholder="Search products to add..."
                                className="pl-9"
                                autoFocus
                            />
                        </div>
                        
                        <div className="flex-1 overflow-y-auto border border-gray-100 rounded-xl bg-gray-50/50 p-2 min-h-0 custom-scrollbar relative">
                            {displayProducts.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3 pb-2">
                                    {displayProducts.map(product => {
                                        const isOutOfStock = product.stock !== -1 && product.stock <= 0;
                                        return (
                                            <div key={product.id} className={cn(
                                                "flex flex-col p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 transition-all group relative",
                                                isOutOfStock ? "opacity-75" : "hover:border-purple-200 hover:shadow-md"
                                            )}>
                                                {isOutOfStock && (
                                                    <div className="absolute inset-0 bg-white/40 z-10 flex items-center justify-center rounded-xl pointer-events-none">
                                                        <span className="bg-black/70 text-white text-[10px] px-2 py-1 rounded-full font-bold">OUT OF STOCK</span>
                                                    </div>
                                                )}

                                                <div className="h-20 w-full bg-gray-100 rounded-lg overflow-hidden mb-2 relative">
                                                    {product.image_url ? (
                                                        <img src={product.image_url} alt="" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-gray-300 bg-gray-50">
                                                            <div className="w-8 h-8 rounded-full border-2 border-gray-200" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className="text-xs font-bold text-gray-900 line-clamp-1">{product.name}</p>
                                                </div>
                                                <div className="mt-auto flex items-center justify-between">
                                                    <p className="text-xs text-gray-500 font-medium">₹{product.price}</p>
                                                    <button
                                                        onClick={() => addToCart(product)}
                                                        className={cn(
                                                            "p-1.5 rounded-lg transition-colors",
                                                            isOutOfStock
                                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                                : "bg-gray-50 text-gray-600 hover:bg-[#8A63D2] hover:text-white"
                                                        )}
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm p-4 text-center">
                                    {productSearch ? (
                                        <p>No products found for "{productSearch}"</p>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 opacity-50">
                                            <Search className="w-8 h-8" />
                                            <p>Search for a product to add it to the order.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="border-t border-gray-100 pt-4 shrink-0">
                                <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Cart ({cart.length})</h3>
                                <div className="space-y-2 max-h-[120px] overflow-y-auto custom-scrollbar pr-1">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded-lg">
                                            <span className="flex-1 truncate pr-2 font-medium">{item.name}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center bg-white border border-gray-200 rounded-md shadow-sm">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-0.5 hover:bg-gray-50 text-gray-500">-</button>
                                                    <span className="px-1 text-xs font-medium w-4 text-center">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-0.5 hover:bg-gray-50 text-gray-500">+</button>
                                                </div>
                                                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 flex justify-between items-center bg-purple-50 p-3 rounded-xl border border-purple-100">
                                    <span className="text-purple-900 font-medium text-sm">Total Amount</span>
                                    <span className="text-lg font-bold text-[#8A63D2]">₹{totalAmount}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* STEP 3: REVIEW */}
                {step === 3 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-200">
                        <div className="bg-gray-50 p-4 rounded-xl space-y-4 border border-gray-100">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="block text-xs text-gray-500 uppercase mb-0.5">Customer</span>
                                    <span className="font-bold text-gray-900">{formData.firstName} {formData.lastName}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-500 uppercase mb-0.5">Contact</span>
                                    <span className="text-gray-900">{formData.phone}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="block text-xs text-gray-500 uppercase mb-0.5">Address</span>
                                    <span className="text-gray-900">{formData.address}, {formData.city}, {formData.state} {formData.zipCode}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-500 uppercase mb-0.5">Source</span>
                                    <span className="text-gray-900 font-medium">
                                        {formData.sourceType === 'other' ? formData.sourceOther : SOURCE_OPTIONS.find(s => s.value === formData.sourceType)?.label}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Items</h3>
                            <div className="space-y-2 border border-gray-100 rounded-xl overflow-hidden">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between text-sm p-3 bg-white border-b border-gray-50 last:border-0">
                                        <span className="text-gray-700">{item.name} <span className="text-gray-400">x {item.quantity}</span></span>
                                        <span className="font-medium text-gray-900">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 flex justify-between items-center pt-2">
                                <span className="font-bold text-gray-900 text-lg">Total Payble</span>
                                <span className="text-2xl font-bold text-[#8A63D2]">₹{totalAmount}</span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Note (Optional)</label>
                            <textarea 
                                value={formData.note}
                                onChange={e => updateField('note', e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#8A63D2] resize-none transition-colors"
                                placeholder="Any special instructions..."
                                rows={2}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-100 flex justify-between bg-white sticky bottom-0 z-10 shrink-0">
                <button 
                    onClick={handleBack}
                    disabled={step === 1 && subStep1 === 1}
                    className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium disabled:opacity-50 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                    <ChevronLeft size={16} /> Back
                </button>
                
                {step < 3 ? (
                    <button 
                        onClick={handleNext}
                        className="px-6 py-2.5 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                        {step === 1 && subStep1 === 1 ? 'Next: Address' : 'Next Step'} <ChevronRight size={16} />
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
