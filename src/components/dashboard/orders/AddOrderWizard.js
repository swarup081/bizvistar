'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useState, useEffect, useRef, useMemo } from 'react';
import { X, Check, Search, Plus, Trash2, ChevronRight, ChevronLeft, Loader2, User, MapPin, ChevronDown, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { submitOrder } from '@/app/actions/orderActions'; 
import StateSelector from '@/components/checkout/StateSelector'; 

// Source Options
const SOURCE_OPTIONS = [
    { value: 'social_media', label: 'Social Media' },
    { value: 'website', label: 'Website' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'phone', label: 'Phone Call' },
    { value: 'walk_in', label: 'Walk-in' },
    { value: 'other', label: 'Other' }
];

// Reusable Dropdown Selector (Source)
function SourceSelector({ value, onChange, error }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef(null);

    const filteredOptions = useMemo(() => {
        if (!search) return SOURCE_OPTIONS;
        return SOURCE_OPTIONS.filter(opt =>
            opt.label.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const handleSelect = (val) => {
        onChange(val);
        setIsOpen(false);
        setSearch('');
    };

    const displayLabel = SOURCE_OPTIONS.find(s => s.value === value)?.label || "Select Source";

    return (
        <div className="relative" ref={dropdownRef}>
             <div
                className={`w-full p-3 border rounded-md bg-white cursor-pointer flex justify-between items-center ${error ? 'border-red-500' : 'border-gray-300'} focus-within:ring-1 focus-within:ring-purple-500`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={value ? 'text-gray-900' : 'text-gray-500 text-sm'}>
                    {displayLabel}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-gray-100 flex items-center gap-2">
                         <Search className="w-4 h-4 text-gray-400" />
                         <input
                            type="text"
                            className="w-full text-sm outline-none text-gray-700"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                         />
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <div
                                    key={opt.value}
                                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 flex justify-between items-center"
                                    onClick={() => handleSelect(opt.value)}
                                >
                                    {opt.label}
                                    {value === opt.value && <Check className="w-4 h-4 text-purple-600" />}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-2 text-sm text-gray-500">No sources found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AddOrderWizard({ isOpen, onClose, onOrderAdded, websiteId }) {
  const [step, setStep] = useState(1);
  const [subStep1, setSubStep1] = useState(1); // 1: Personal, 2: Address
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]); 
  const [productSearch, setProductSearch] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

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
      if (isOpen && websiteId) {
          const fetchProds = async () => {
              const { data } = await supabase.from('products').select('*').eq('website_id', websiteId);
              if (data) setProducts(data);
          };
          fetchProds();
      }
  }, [isOpen, websiteId]);

  const updateField = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (fieldErrors[field]) {
          setFieldErrors(prev => ({ ...prev, [field]: null }));
      }
  };

  const addToCart = (product) => {
      setCart(prev => {
          const existing = prev.find(p => p.id === product.id);
          // Check stock before adding
          const currentQty = existing ? existing.quantity : 0;
          const maxStock = product.stock === -1 ? Infinity : product.stock;

          if (currentQty + 1 > maxStock) {
              alert("Cannot add more items. Out of stock.");
              return prev;
          }

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
              const maxStock = product?.stock === -1 ? Infinity : (product?.stock || 0);

              const newQ = p.quantity + delta;

              if (newQ > maxStock) {
                  // Optionally show toast/alert
                  return p;
              }

              const finalQ = Math.max(1, newQ);
              return { ...p, quantity: finalQ };
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

  const handleNext = () => {
      const errors = {};
      if (step === 1) {
          if (subStep1 === 1) {
              if (!formData.firstName.trim()) errors.firstName = "First name is required";
              if (!formData.lastName.trim()) errors.lastName = "Last name is required";
              if (!formData.phone.trim()) errors.phone = "Phone number is required";

              const phoneRegex = /^\d{10}$/;
              if (formData.phone.trim() && !phoneRegex.test(formData.phone.trim())) {
                  errors.phone = "Phone number must be exactly 10 digits";
              }

              if (Object.keys(errors).length > 0) {
                  setFieldErrors(errors);
                  return;
              }
              setSubStep1(2);
          } else {
              if (!formData.address.trim()) errors.address = "Address is required";
              if (!formData.city.trim()) errors.city = "City is required";
              if (!formData.state.trim()) errors.state = "State is required";
              if (!formData.zipCode.trim()) errors.zipCode = "Zip Code is required";
              if (!formData.sourceType) errors.sourceType = "Please select an Order Source";

              const zipRegex = /^\d{6}$/;
              if (formData.zipCode.trim() && !zipRegex.test(formData.zipCode.trim())) {
                   errors.zipCode = "ZIP code must be exactly 6 digits";
              }

              if (Object.keys(errors).length > 0) {
                  setFieldErrors(errors);
                  return;
              }
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

  const displayProducts = productSearch 
      ? products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase())) 
      : [];

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] md:w-full max-w-lg h-[80vh] md:h-[600px] bg-white rounded-2xl shadow-2xl z-[70] flex flex-col focus:outline-none overflow-hidden font-sans">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white shrink-0 z-10">
                <Dialog.Title className="text-xl font-bold text-gray-900">Create New Order</Dialog.Title>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Steps - INCREASED SPACING (gap-4 sm:gap-6) */}
            <div className="px-8 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between shrink-0 z-10">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-4 sm:gap-6">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${step >= s ? 'bg-[#8A63D2] text-white' : 'bg-gray-200 text-gray-500'}`}>
                            {step > s ? <Check size={16} /> : s}
                        </div>
                        <span className={`text-sm font-medium whitespace-nowrap ${step >= s ? 'text-gray-900' : 'text-gray-400'}`}>
                            {s === 1 ? 'Customer' : s === 2 ? 'Products' : 'Review'}
                        </span>
                        {s < 3 && <div className="w-8 h-px bg-gray-200 hidden sm:block"></div>}
                    </div>
                ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative">
                
                {/* STEP 1 */}
                {step === 1 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-200">
                        {subStep1 === 1 ? (
                            <div className="space-y-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><User size={18}/></div>
                                    <h3 className="font-bold text-gray-900">Personal Details</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase">First Name</label>
                                        <input
                                            value={formData.firstName}
                                            onChange={e => updateField('firstName', e.target.value)}
                                            className={`w-full p-3 border rounded-md text-sm outline-none transition-all ${fieldErrors.firstName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-1 focus:ring-purple-500'}`}
                                            placeholder="Jane"
                                            autoFocus
                                        />
                                        {fieldErrors.firstName && <p className="text-xs text-red-500">{fieldErrors.firstName}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Last Name</label>
                                        <input
                                            value={formData.lastName}
                                            onChange={e => updateField('lastName', e.target.value)}
                                            className={`w-full p-3 border rounded-md text-sm outline-none transition-all ${fieldErrors.lastName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-1 focus:ring-purple-500'}`}
                                            placeholder="Doe"
                                        />
                                        {fieldErrors.lastName && <p className="text-xs text-red-500">{fieldErrors.lastName}</p>}
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                                    <input
                                        value={formData.phone}
                                        onChange={e => updateField('phone', e.target.value)}
                                        className={`w-full p-3 border rounded-md text-sm outline-none transition-all ${fieldErrors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-1 focus:ring-purple-500'}`}
                                        placeholder="9876543210"
                                    />
                                    {fieldErrors.phone && <p className="text-xs text-red-500">{fieldErrors.phone}</p>}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><MapPin size={18}/></div>
                                    <h3 className="font-bold text-gray-900">Address & Source</h3>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Address</label>
                                    <input
                                        value={formData.address}
                                        onChange={e => updateField('address', e.target.value)}
                                        className={`w-full p-3 border rounded-md text-sm outline-none transition-all ${fieldErrors.address ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-1 focus:ring-purple-500'}`}
                                        placeholder="Street Address"
                                        autoFocus
                                    />
                                    {fieldErrors.address && <p className="text-xs text-red-500">{fieldErrors.address}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase">City</label>
                                        <input
                                            value={formData.city}
                                            onChange={e => updateField('city', e.target.value)}
                                            className={`w-full p-3 border rounded-md text-sm outline-none transition-all ${fieldErrors.city ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-1 focus:ring-purple-500'}`}
                                        />
                                        {fieldErrors.city && <p className="text-xs text-red-500">{fieldErrors.city}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase">State</label>
                                        <StateSelector
                                            value={formData.state}
                                            onChange={val => updateField('state', val)}
                                            error={!!fieldErrors.state}
                                        />
                                        {fieldErrors.state && <p className="text-xs text-red-500">{fieldErrors.state}</p>}
                                    </div>
                                </div>
                                
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Zip Code</label>
                                    <input
                                        value={formData.zipCode}
                                        onChange={e => updateField('zipCode', e.target.value)}
                                        className={`w-full p-3 border rounded-md text-sm outline-none transition-all ${fieldErrors.zipCode ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-1 focus:ring-purple-500'}`}
                                    />
                                    {fieldErrors.zipCode && <p className="text-xs text-red-500">{fieldErrors.zipCode}</p>}
                                </div>

                                <div className="space-y-1.5 pt-4 border-t border-gray-100">
                                    <label className="text-xs font-bold text-[#8A63D2] uppercase">Order Source</label>
                                    <SourceSelector
                                        value={formData.sourceType}
                                        onChange={val => updateField('sourceType', val)}
                                        error={!!fieldErrors.sourceType}
                                    />
                                    {fieldErrors.sourceType && <p className="text-xs text-red-500">{fieldErrors.sourceType}</p>}
                                    {formData.sourceType === 'other' && (
                                        <input 
                                            value={formData.sourceOther} 
                                            onChange={e => updateField('sourceOther', e.target.value)} 
                                            className="w-full p-3 mt-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                                            placeholder="Type source name..." 
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* STEP 2: PRODUCTS (Overlay UI) */}
                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-200 h-full flex flex-col relative">
                        <div className="relative shrink-0 z-50">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input 
                                value={productSearch}
                                onChange={e => setProductSearch(e.target.value)}
                                placeholder="Search products..."
                                className="w-full pl-9 p-3 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                            />

                            {/* Autocomplete Overlay */}
                            {productSearch && (
                                <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-[300px] overflow-y-auto z-[60] custom-scrollbar">
                                    {displayProducts.length > 0 ? (
                                        <div className="p-2 grid grid-cols-1 gap-1">
                                            {displayProducts.map(product => {
                                                const isOutOfStock = product.stock !== -1 && product.stock <= 0;
                                                return (
                                                    <div
                                                        key={product.id}
                                                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors border-b border-gray-50 last:border-0 ${isOutOfStock ? 'opacity-60 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50 cursor-pointer'}`}
                                                        onClick={() => !isOutOfStock && addToCart(product)}
                                                    >
                                                        <div className="h-10 w-10 bg-gray-100 rounded-md overflow-hidden shrink-0">
                                                            {product.image_url && <img src={product.image_url} alt="" className="h-full w-full object-cover" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                                                {isOutOfStock && (
                                                                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-red-100 text-red-600 text-[10px] font-bold">
                                                                        <AlertTriangle size={10} /> Out of Stock
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-gray-500">₹{product.price}</p>
                                                        </div>
                                                        <button
                                                            disabled={isOutOfStock}
                                                            className={`p-1.5 rounded-lg transition-colors ${isOutOfStock ? 'bg-gray-200 text-gray-400' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'}`}
                                                        >
                                                            <Plus size={16} />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-gray-500 text-sm">No products found</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Cart Area (Static) */}
                        <div className="flex-1 overflow-y-auto">
                            {cart.length > 0 ? (
                                <div className="pt-2">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Cart ({cart.length})</h3>
                                    <div className="space-y-2">
                                        {cart.map(item => (
                                            <div key={item.id} className="flex items-center justify-between text-sm bg-white p-2 rounded-lg border border-gray-100">
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
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm opacity-60">
                                    <Search className="w-8 h-8 mb-2 opacity-50" />
                                    <p>Search products above to add to order</p>
                                </div>
                            )}
                        </div>
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
                                    <span className="text-[#8A63D2] font-bold bg-purple-50 px-2 py-0.5 rounded text-xs inline-block border border-purple-100">
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
                                className="w-full p-3 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-purple-500 resize-none transition-all"
                                placeholder="Any special instructions..."
                                rows={2}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-100 flex justify-between bg-white shrink-0 z-10">
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
