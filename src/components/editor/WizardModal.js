'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { 
  X, Check, ChevronRight, ChevronLeft, UploadCloud, 
  Store, User, Instagram, Facebook, Smartphone, 
  CreditCard, Sparkles, Loader2, Package, Plus, Trash2, Phone 
} from 'lucide-react';
import { 
  saveBusinessInfo, 
  saveWizardProduct, 
  savePaymentInfo, 
  generateAIContent, 
  completeOnboarding,
  uploadLogo,
  deleteWizardProduct
} from '@/app/actions/onboardingActions';

export default function WizardModal({ isOpen, onClose, websiteId, initialData, setBusinessData }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Step 1: Business Info State
  const [businessInfo, setBusinessInfo] = useState({
    name: initialData?.websiteData?.name || '',
    ownerName: initialData?.data?.owner_name || '',
    whatsappNumber: initialData?.data?.whatsapp_number || '', // Added
    instagram: initialData?.data?.social_instagram || '',
    facebook: initialData?.data?.social_facebook || '',
    logoUrl: initialData?.data?.logo_url || '',
    logoFile: null
  });

  // Step 2: Products State
  // Initialize with EMPTY array to strictly show only user-added products in this wizard session.
  // We do not want to show template default products here.
  const [products, setProducts] = useState([]); 
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', image: null, imageUrl: '' });
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // Step 3: Payment State
  const [payment, setPayment] = useState({
    mode: 'UPI', // 'UPI' or 'COD'
    upiId: '',
    confirmUpiId: ''
  });

  // Step 4: AI State
  const [aiDescription, setAiDescription] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // --- Handlers ---

  const handleNext = async () => {
    setError('');
    setLoading(true);

    try {
        if (step === 1) {
            // Validate
            if (!businessInfo.name) throw new Error("Business Name is required.");
            if (!businessInfo.whatsappNumber) throw new Error("Contact Number is required."); // Validation
            
            // Upload Logo if new file selected
            let finalLogoUrl = businessInfo.logoUrl;
            if (businessInfo.logoFile) {
                const formData = new FormData();
                formData.append('file', businessInfo.logoFile);
                const { success, url, error } = await uploadLogo(formData);
                if (!success) throw new Error(error || "Logo upload failed");
                finalLogoUrl = url;
            }

            // Save Info
            const { success, error: saveError } = await saveBusinessInfo({
                ...businessInfo,
                logoUrl: finalLogoUrl
            });
            
            if (!success) throw new Error(saveError);

            // Optimistic Update for Editor
            setBusinessData(prev => ({
                ...prev,
                name: businessInfo.name,
                logoText: businessInfo.name,
                logo: finalLogoUrl,
                owner: businessInfo.ownerName,
                whatsappNumber: businessInfo.whatsappNumber,
                footer: {
                    ...prev.footer,
                    socials: [
                        { platform: 'Instagram', url: businessInfo.instagram },
                        { platform: 'Facebook', url: businessInfo.facebook }
                    ]
                }
            }));
        } 
        else if (step === 2) {
            // Products are saved as they are added.
        }
        else if (step === 3) {
            // Validate Payment
            if (payment.mode === 'UPI') {
                if (!payment.upiId) throw new Error("UPI ID is required.");
                if (payment.upiId !== payment.confirmUpiId) throw new Error("UPI IDs do not match.");
            }

            // Save Payment
            const { success, error: payError } = await savePaymentInfo({
                upiId: payment.upiId,
                isCodOnly: payment.mode === 'COD'
            });

            if (!success) throw new Error(payError);

            // Optimistic Update
            setBusinessData(prev => ({
                ...prev,
                payment: {
                    upiId: payment.mode === 'COD' ? '' : payment.upiId,
                    mode: payment.mode
                },
                footer: {
                    ...prev.footer,
                    paymentDisclaimer: payment.mode === 'COD' 
                        ? "Note: Since we cannot redirect users to a payment gateway, you are responsible for collecting payment upon delivery. Please ensure you have a process in place to settle these transactions."
                        : "Please note: Payments are processed directly between you and your customer. We do not facilitate transactions or charge commissions. You are responsible for verifying all payments received."
                }
            }));
        }
        else if (step === 4) {
             await completeOnboarding();
             onClose();
             return;
        }

        setStep(prev => prev + 1);

    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  // --- NEW: Handle Finish Button ---
  const handleFinish = async () => {
      // If AI description is present, generate content first
      if (step === 4 && aiDescription.trim()) {
          setIsAiGenerating(true);
          try {
              const { success, data, error: aiError } = await generateAIContent(aiDescription);
              if (!success) throw new Error(aiError);
              
              setBusinessData(data);
          } catch (err) {
              console.error("AI Generation failed:", err);
              setError(err.message);
              setIsAiGenerating(false);
              return;
          }
      }

      // Mark as complete and close
      await completeOnboarding();
      onClose();
  };

  const handleAddProduct = async () => {
      if (!newProduct.name || !newProduct.price) {
          setError("Name and Price are required.");
          return;
      }
      
      setLoading(true);
      setError('');

      try {
          let finalImageUrl = newProduct.imageUrl;
          if (newProduct.image) {
               const formData = new FormData();
               formData.append('file', newProduct.image);
               const { success, url } = await uploadLogo(formData);
               if (success) finalImageUrl = url;
          }

          const { success, product, error: prodError } = await saveWizardProduct({
              name: newProduct.name,
              price: newProduct.price,
              description: newProduct.description,
              imageUrl: finalImageUrl
          });

          if (!success) throw new Error(prodError);

          const newProdObj = { 
              id: product.id, 
              name: product.name, 
              price: product.price, 
              image: product.image_url,
              description: product.description
          };
          
          const updatedProducts = [...products, newProdObj];
          setProducts(updatedProducts);
          // We update the editor data with ALL products (user added + template defaults? No, usually replace)
          // Actually, if we add products, we usually append them.
          // But here, since we are hiding template defaults in the list, we need to be careful not to delete them from editor view inadvertently if we just set `allProducts` to `updatedProducts`.
          // Ideally, we append to existing `allProducts` in businessData.
          
          setBusinessData(prev => ({ 
              ...prev, 
              allProducts: [...(prev.allProducts || []), newProdObj] 
          }));
          
          setNewProduct({ name: '', price: '', description: '', image: null, imageUrl: '' });
          setIsAddingProduct(false);

      } catch (err) {
          setError(err.message);
      } finally {
          setLoading(false);
      }
  };

  const handleDeleteProduct = async (productId) => {
      if (!confirm("Are you sure you want to delete this product?")) return;
      
      try {
          const { success, error: delError } = await deleteWizardProduct(productId);
          if (!success) throw new Error(delError);

          const updatedProducts = products.filter(p => p.id !== productId);
          setProducts(updatedProducts);
          
          // Also remove from editor preview
          setBusinessData(prev => ({ 
              ...prev, 
              allProducts: (prev.allProducts || []).filter(p => p.id !== productId) 
          }));

      } catch (err) {
          alert("Failed to delete: " + err.message);
      }
  };

  // --- Styles Matches AddOrderWizard.js ---
  
  const renderStep1 = () => (
      <div className="space-y-6 animate-in slide-in-from-right duration-200">
          <div className="flex justify-center mb-6">
               <div className="relative group w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-[#8A63D2] transition-colors cursor-pointer">
                    {businessInfo.logoUrl ? (
                        <img src={businessInfo.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                        <UploadCloud className="text-gray-400" />
                    )}
                    <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                setBusinessInfo(prev => ({ 
                                    ...prev, 
                                    logoFile: file, 
                                    logoUrl: URL.createObjectURL(file) 
                                }));
                            }
                        }}
                    />
               </div>
               <span className="absolute mt-24 text-xs text-gray-500 font-medium uppercase">Upload Logo</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Business Name *</label>
                <input 
                    value={businessInfo.name}
                    onChange={(e) => setBusinessInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#8A63D2] focus:border-[#8A63D2] outline-none transition-all"
                    placeholder="e.g. The Coffee House"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Owner Name</label>
                <input 
                    value={businessInfo.ownerName}
                    onChange={(e) => setBusinessInfo(prev => ({ ...prev, ownerName: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#8A63D2] focus:border-[#8A63D2] outline-none transition-all"
                    placeholder="e.g. John Doe"
                />
            </div>
          </div>

          <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">Contact Phone / WhatsApp *</label>
              <input 
                  value={businessInfo.whatsappNumber}
                  onChange={(e) => setBusinessInfo(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#8A63D2] focus:border-[#8A63D2] outline-none transition-all"
                  placeholder="e.g. +91 98765 43210"
              />
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Instagram URL</label>
                  <input 
                      value={businessInfo.instagram}
                      onChange={(e) => setBusinessInfo(prev => ({ ...prev, instagram: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#8A63D2] focus:border-[#8A63D2] outline-none transition-all"
                      placeholder="e.g. https://instagram.com/mybusiness"
                  />
              </div>
              <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Facebook URL</label>
                  <input 
                      value={businessInfo.facebook}
                      onChange={(e) => setBusinessInfo(prev => ({ ...prev, facebook: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-[#8A63D2] focus:border-[#8A63D2] outline-none transition-all"
                      placeholder="e.g. https://facebook.com/mybusiness"
                  />
              </div>
          </div>
      </div>
  );

  const renderStep2 = () => (
      <div className="space-y-4 animate-in slide-in-from-right duration-200 h-full flex flex-col">
          {!isAddingProduct ? (
              <>
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-700 uppercase">Your Products ({products.length}/10)</h3>
                    <button 
                        onClick={() => setIsAddingProduct(true)}
                        disabled={products.length >= 10}
                        className="text-sm text-[#8A63D2] font-medium hover:underline disabled:opacity-50 flex items-center gap-1"
                    >
                        <Plus size={16} /> Add Product
                    </button>
                </div>
                
                <div className="flex-grow overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-2 bg-gray-50 max-h-[300px]">
                    {products.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 text-sm flex flex-col items-center">
                            <Package size={32} className="mb-2 opacity-50" />
                            No products added yet.
                        </div>
                    ) : (
                        products.map((p) => (
                            <div key={p.id} className="flex items-center gap-3 bg-white p-3 rounded-md shadow-sm border border-gray-100 group relative">
                                <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                    {p.image ? (
                                        <img src={p.image} className="w-full h-full object-cover" />
                                    ) : (
                                        <Package className="w-full h-full p-2 text-gray-300" />
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <div className="font-medium text-sm text-gray-900">{p.name}</div>
                                    <div className="text-xs text-gray-500">${p.price}</div>
                                </div>
                                <button 
                                    onClick={() => handleDeleteProduct(p.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
              </>
          ) : (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4 shadow-sm animate-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <h4 className="font-bold text-sm text-gray-900">New Product Details</h4>
                      <button onClick={() => setIsAddingProduct(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={16}/></button>
                  </div>
                  
                  <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer relative overflow-hidden hover:border-[#8A63D2] hover:bg-brand-50 transition-all shrink-0">
                            {newProduct.imageUrl ? (
                                <img src={newProduct.imageUrl} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center text-gray-400">
                                    <UploadCloud size={20} />
                                    <span className="text-[10px] mt-1">Image</span>
                                </div>
                            )}
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setNewProduct(prev => ({ ...prev, image: file, imageUrl: URL.createObjectURL(file) }));
                                    }
                                }}
                            />
                      </div>
                      <div className="flex-grow space-y-3">
                          <div className="space-y-1">
                              <input 
                                  placeholder="Product Name" 
                                  value={newProduct.name}
                                  onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#8A63D2] focus:border-[#8A63D2] outline-none transition-all"
                              />
                          </div>
                          <div className="space-y-1">
                              <input 
                                  placeholder="Price" 
                                  type="number"
                                  value={newProduct.price}
                                  onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#8A63D2] focus:border-[#8A63D2] outline-none transition-all"
                              />
                          </div>
                      </div>
                  </div>
                  <textarea 
                      placeholder="Description (Optional)" 
                      value={newProduct.description}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full p-3 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#8A63D2] focus:border-[#8A63D2] outline-none resize-none h-20 transition-all"
                  />
                  <div className="flex justify-end pt-2">
                      <button 
                          onClick={handleAddProduct}
                          disabled={loading}
                          className="px-6 py-2 bg-[#8A63D2] text-white text-sm font-bold rounded-lg hover:bg-[#7854bc] disabled:opacity-50 transition-colors shadow-sm"
                      >
                          {loading ? 'Adding...' : 'Add Product'}
                      </button>
                  </div>
              </div>
          )}
      </div>
  );

  const renderStep3 = () => (
      <div className="space-y-6 animate-in slide-in-from-right duration-200">
          <div className="grid grid-cols-2 gap-4">
              <button 
                  onClick={() => {
                      setPayment(prev => ({ ...prev, mode: 'UPI' }));
                      setError(''); // Clear errors on switch
                  }}
                  className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${payment.mode === 'UPI' ? 'border-[#8A63D2] bg-[#8A63D2]/5 text-[#8A63D2] shadow-sm' : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'}`}
              >
                  <Smartphone size={24} />
                  <span className="font-bold text-sm">UPI Payment</span>
              </button>
              <button 
                  onClick={() => {
                      setPayment(prev => ({ ...prev, mode: 'COD' }));
                      setError(''); // Clear errors on switch
                  }}
                  className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${payment.mode === 'COD' ? 'border-[#8A63D2] bg-[#8A63D2]/5 text-[#8A63D2] shadow-sm' : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'}`}
              >
                  <CreditCard size={24} />
                  <span className="font-bold text-sm">Cash on Delivery</span>
              </button>
          </div>

          {payment.mode === 'UPI' ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase">Enter UPI ID</label>
                      <input 
                          value={payment.upiId}
                          onChange={(e) => setPayment(prev => ({ ...prev, upiId: e.target.value }))}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#8A63D2] focus:border-[#8A63D2] outline-none transition-all"
                          placeholder="username@upi"
                      />
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase">Confirm UPI ID</label>
                      <input 
                          value={payment.confirmUpiId}
                          onChange={(e) => setPayment(prev => ({ ...prev, confirmUpiId: e.target.value }))}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#8A63D2] focus:border-[#8A63D2] outline-none transition-all"
                          placeholder="Re-enter username@upi"
                      />
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100 leading-relaxed">
                      <strong>Please note:</strong> Payments are processed directly between you and your customer. We do not facilitate transactions or charge commissions. You are responsible for verifying all payments received.
                  </div>
              </div>
          ) : (
              <div className="p-4 bg-amber-50 text-amber-800 text-sm rounded-lg border border-amber-100 leading-relaxed animate-in fade-in duration-300">
                  <strong>Note:</strong> Since we cannot redirect users to a payment gateway, you are responsible for collecting payment upon delivery. Please ensure you have a process in place to settle these transactions.
              </div>
          )}
      </div>
  );

  // --- NEW: Refined AI Step (Step 4) ---
  const renderStep4 = () => (
      <div className="space-y-4 animate-in slide-in-from-right duration-200 h-full flex flex-col">
          <div className="space-y-1.5 flex-grow">
              <label className="text-xl font-bold text-gray-600 uppercase">Describe your business </label>
              <p  className="text-xs text-gray-500 mt-2"> AI will instantly rewrite your website content to match your brand voice.</p>
              <div className="relative h-full max-h-[250px]">
                <textarea 
                    value={aiDescription}
                    onChange={(e) => setAiDescription(e.target.value)}
                    className="w-full h-full p-4 text-sm border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#8A63D2] focus:border-[#8A63D2] outline-none resize-none transition-all custom-scrollbar bg-gray-50 focus:bg-white"
                    placeholder="e.g. We are a boutique bakery in Paris specializing in gluten-free pastries and artisanal coffee..."
                />
                <div className="absolute bottom-3 right-3 text-[10px] text-gray-400 font-medium">
                    {aiDescription.length} chars
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                  Leave empty to skip. If filled, our AI will instantly rewrite your website content to match your brand voice.
              </p>
          </div>
      </div>
  );

  if (!isOpen) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity animate-in fade-in duration-300" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] md:w-full max-w-lg h-[80vh] md:h-[650px] bg-white rounded-2xl shadow-2xl z-[70] flex flex-col focus:outline-none overflow-hidden font-sans animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white shrink-0 z-10">
            <Dialog.Title className="text-xl font-bold text-gray-900">
                {step === 1 && "Business Profile"}
                {step === 2 && "Add Products"}
                {step === 3 && "Payment Setup"}
                {step === 4 && "AI Content"}
            </Dialog.Title>
            <Dialog.Close asChild>
                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                    <X size={20} />
                </button>
            </Dialog.Close>
          </div>

          {/* Progress Steps */}
          <div className="px-8 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between shrink-0 z-10">
                {[1, 2, 3, 4].map((s) => (
                    <div key={s} className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${step >= s ? 'bg-[#8A63D2] text-white scale-110' : 'bg-gray-200 text-gray-500'}`}>
                            {step > s ? <Check size={16} /> : s}
                        </div>
                        {s < 4 && <div className={`w-8 sm:w-12 h-0.5 transition-colors ${step > s ? 'bg-[#8A63D2]/50' : 'bg-gray-200'}`}></div>}
                    </div>
                ))}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative">
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
              {step === 4 && renderStep4()}
              
              {error && (
                  <div className="mt-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2 animate-in slide-in-from-bottom-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                      {error}
                  </div>
              )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-white flex justify-between items-center shrink-0 z-10">
            {step > 1 ? (
                <button 
                    onClick={() => setStep(prev => prev - 1)}
                    className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                    <ChevronLeft size={16} /> Back
                </button>
            ) : (
                <span /> // Spacer
            )}

            {step < 4 ? (
                <button 
                    onClick={handleNext}
                    disabled={loading || (step === 2 && isAddingProduct)} // Disable next while adding product form is open
                    className="px-8 py-2.5 bg-[#8A63D2] text-white font-bold rounded-xl shadow-lg shadow-brand-200 hover:bg-[#7854bc] transition-all flex items-center gap-2 disabled:opacity-50 disabled:shadow-none"
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                    Next <ChevronRight size={18} />
                </button>
            ) : (
                <button 
                    onClick={handleFinish}
                    disabled={isAiGenerating}
                    className="px-8 py-2.5 bg-[#8A63D2] text-white font-bold rounded-xl shadow-lg shadow-brand-200 hover:bg-[#7854bc] transition-all flex items-center gap-2 disabled:opacity-50 disabled:shadow-none"
                >
                    {isAiGenerating ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                    {aiDescription.trim() ? (isAiGenerating ? 'Generating...' : 'Generate & Finish') : 'Finish'}
                </button>
            )}
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
