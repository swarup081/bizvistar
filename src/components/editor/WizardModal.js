'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useState, useRef, useEffect } from 'react';
import {
  X, Check, ChevronRight, ChevronLeft, UploadCloud,
  Store, User, Instagram, Facebook, Smartphone,
  CreditCard, Sparkles, Loader2, Package, Plus, Trash2
} from 'lucide-react';
import {
  saveBusinessInfo,
  saveWizardProduct,
  savePaymentInfo,
  generateAIContent,
  completeOnboarding,
  uploadLogo,
  getOnboardingStatus
} from '@/app/actions/onboardingActions';

export default function WizardModal({ isOpen, onClose, websiteId, initialData, setBusinessData }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Business Info State
  const [businessInfo, setBusinessInfo] = useState({
    name: initialData?.websiteData?.name || '',
    ownerName: initialData?.data?.owner_name || '',
    instagram: initialData?.data?.social_instagram || '',
    facebook: initialData?.data?.social_facebook || '',
    logoUrl: initialData?.data?.logo_url || '',
    logoFile: null
  });

  // Step 2: Products State
  const [products, setProducts] = useState(initialData?.websiteData?.allProducts || []);
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
                owner: businessInfo.ownerName, // Custom field for future use
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
            // Products are saved as they are added. Just move next.
            // Maybe check if at least 1 product? No, optional.
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
             // AI Step logic is separate (Generate vs Skip)
             // If clicking "Finish" here (or Skip), we complete.
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

  const handleAddProduct = async () => {
      if (!newProduct.name || !newProduct.price) {
          setError("Name and Price are required.");
          return;
      }

      setLoading(true);
      setError('');

      try {
          // Upload Image if present
          let finalImageUrl = newProduct.imageUrl;
          if (newProduct.image) {
               const formData = new FormData();
               formData.append('file', newProduct.image);
               const { success, url } = await uploadLogo(formData); // Reuse uploadLogo for product images for now
               if (success) finalImageUrl = url;
          }

          const { success, error: prodError } = await saveWizardProduct({
              name: newProduct.name,
              price: newProduct.price,
              description: newProduct.description,
              imageUrl: finalImageUrl
          });

          if (!success) throw new Error(prodError);

          // Update Local List & Editor
          const newProdObj = {
              id: Date.now(),
              name: newProduct.name,
              price: newProduct.price,
              image: finalImageUrl,
              description: newProduct.description
          };

          const updatedProducts = [...products, newProdObj];
          setProducts(updatedProducts);
          setBusinessData(prev => ({ ...prev, allProducts: updatedProducts }));

          // Reset Form
          setNewProduct({ name: '', price: '', description: '', image: null, imageUrl: '' });
          setIsAddingProduct(false);

      } catch (err) {
          setError(err.message);
      } finally {
          setLoading(false);
      }
  };

  const handleGenerateAI = async () => {
      if (!aiDescription) {
          setError("Please enter a description.");
          return;
      }
      setIsAiGenerating(true);
      try {
          const { success, data, error: aiError } = await generateAIContent(aiDescription);
          if (!success) throw new Error(aiError);

          setBusinessData(data); // Apply changes to editor
          await completeOnboarding();
          onClose(); // Close wizard after AI generation success
      } catch (err) {
          setError(err.message);
      } finally {
          setIsAiGenerating(false);
      }
  };

  // --- Render Steps ---

  const renderStep1 = () => (
      <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
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
               <span className="absolute mt-24 text-xs text-gray-500">Upload Logo</span>
          </div>

          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
              <div className="relative">
                  <Store className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                      value={businessInfo.name}
                      onChange={(e) => setBusinessInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A63D2] focus:border-transparent outline-none"
                      placeholder="My Awesome Shop"
                  />
              </div>
          </div>

          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
              <div className="relative">
                  <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                      value={businessInfo.ownerName}
                      onChange={(e) => setBusinessInfo(prev => ({ ...prev, ownerName: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A63D2] focus:border-transparent outline-none"
                      placeholder="John Doe"
                  />
              </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                  <div className="relative">
                      <Instagram className="absolute left-3 top-2.5 text-gray-400" size={18} />
                      <input
                          value={businessInfo.instagram}
                          onChange={(e) => setBusinessInfo(prev => ({ ...prev, instagram: e.target.value }))}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A63D2] focus:border-transparent outline-none"
                          placeholder="https://instagram.com/..."
                      />
                  </div>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                  <div className="relative">
                      <Facebook className="absolute left-3 top-2.5 text-gray-400" size={18} />
                      <input
                          value={businessInfo.facebook}
                          onChange={(e) => setBusinessInfo(prev => ({ ...prev, facebook: e.target.value }))}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A63D2] focus:border-transparent outline-none"
                          placeholder="https://facebook.com/..."
                      />
                  </div>
              </div>
          </div>
      </div>
  );

  const renderStep2 = () => (
      <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col">
          {!isAddingProduct ? (
              <>
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-700">Your Products ({products.length}/10)</h3>
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
                        <div className="text-center py-8 text-gray-400 text-sm">No products added yet.</div>
                    ) : (
                        products.map((p, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-md shadow-sm border border-gray-100">
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
                            </div>
                        ))
                    )}
                </div>
              </>
          ) : (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                  <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-sm">New Product</h4>
                      <button onClick={() => setIsAddingProduct(false)} className="text-gray-400 hover:text-gray-600"><X size={16}/></button>
                  </div>

                  <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white border border-gray-300 rounded-lg flex items-center justify-center cursor-pointer relative overflow-hidden hover:border-[#8A63D2]">
                            {newProduct.imageUrl ? (
                                <img src={newProduct.imageUrl} className="w-full h-full object-cover" />
                            ) : (
                                <UploadCloud size={20} className="text-gray-400" />
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
                      <div className="flex-grow space-y-2">
                          <input
                              placeholder="Product Name"
                              value={newProduct.name}
                              onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full p-2 text-sm border border-gray-300 rounded focus:border-[#8A63D2] outline-none"
                          />
                          <input
                              placeholder="Price"
                              type="number"
                              value={newProduct.price}
                              onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                              className="w-full p-2 text-sm border border-gray-300 rounded focus:border-[#8A63D2] outline-none"
                          />
                      </div>
                  </div>
                  <textarea
                      placeholder="Description (Optional)"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full p-2 text-sm border border-gray-300 rounded focus:border-[#8A63D2] outline-none resize-none h-20"
                  />
                  <div className="flex justify-end">
                      <button
                          onClick={handleAddProduct}
                          disabled={loading}
                          className="px-4 py-1.5 bg-[#8A63D2] text-white text-sm rounded hover:bg-[#7854bc] disabled:opacity-50"
                      >
                          {loading ? 'Adding...' : 'Add'}
                      </button>
                  </div>
              </div>
          )}
      </div>
  );

  const renderStep3 = () => (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="grid grid-cols-2 gap-4">
              <button
                  onClick={() => setPayment(prev => ({ ...prev, mode: 'UPI' }))}
                  className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${payment.mode === 'UPI' ? 'border-[#8A63D2] bg-[#8A63D2]/5 text-[#8A63D2]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
              >
                  <Smartphone size={24} />
                  <span className="font-medium text-sm">UPI Payment</span>
              </button>
              <button
                  onClick={() => setPayment(prev => ({ ...prev, mode: 'COD' }))}
                  className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${payment.mode === 'COD' ? 'border-[#8A63D2] bg-[#8A63D2]/5 text-[#8A63D2]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
              >
                  <CreditCard size={24} />
                  <span className="font-medium text-sm">Cash on Delivery</span>
              </button>
          </div>

          {payment.mode === 'UPI' ? (
              <div className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Enter UPI ID</label>
                      <input
                          value={payment.upiId}
                          onChange={(e) => setPayment(prev => ({ ...prev, upiId: e.target.value }))}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A63D2] focus:border-transparent outline-none"
                          placeholder="username@upi"
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm UPI ID</label>
                      <input
                          value={payment.confirmUpiId}
                          onChange={(e) => setPayment(prev => ({ ...prev, confirmUpiId: e.target.value }))}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A63D2] focus:border-transparent outline-none"
                          placeholder="Re-enter username@upi"
                      />
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100">
                      <strong>Please note:</strong> Payments are processed directly between you and your customer. We do not facilitate transactions or charge commissions. You are responsible for verifying all payments received.
                  </div>
              </div>
          ) : (
              <div className="p-4 bg-amber-50 text-amber-800 text-sm rounded-lg border border-amber-100">
                  <strong>Note:</strong> Since we cannot redirect users to a payment gateway, you are responsible for collecting payment upon delivery. Please ensure you have a process in place to settle these transactions.
              </div>
          )}
      </div>
  );

  const renderStep4 = () => (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-purple-200">
              <Sparkles className="text-white" size={32} />
          </div>

          <div>
              <h3 className="text-xl font-bold text-gray-900">AI Content Magic</h3>
              <p className="text-gray-500 text-sm mt-2">
                  Describe your business, and our AI will instantly rewrite your website content to match your brand voice.
              </p>
          </div>

          <textarea
              value={aiDescription}
              onChange={(e) => setAiDescription(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8A63D2] focus:border-transparent outline-none resize-none min-h-[120px]"
              placeholder="e.g. We are a boutique bakery in Paris specializing in gluten-free pastries and artisanal coffee..."
          />

          <button
              onClick={handleGenerateAI}
              disabled={isAiGenerating}
              className="w-full py-3 bg-gradient-to-r from-[#8A63D2] to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
              {isAiGenerating ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
              {isAiGenerating ? 'Generating Magic...' : 'Generate Content'}
          </button>
      </div>
  );

  if (!isOpen) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-md z-[90] animate-in fade-in duration-300" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-lg bg-white rounded-3xl shadow-2xl z-[100] overflow-hidden flex flex-col max-h-[90vh]">

          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
            <div>
                <h2 className="text-lg font-bold text-gray-900">
                    {step === 1 && "Let's get started"}
                    {step === 2 && "Add your products"}
                    {step === 3 && "Setup Payments"}
                    {step === 4 && "Final Polish"}
                </h2>
                <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i <= step ? 'w-6 bg-[#8A63D2]' : 'w-2 bg-gray-200'}`} />
                    ))}
                </div>
            </div>
            {/* Optional Close Button */}
            <Dialog.Close asChild>
                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                    <X size={20} />
                </button>
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
              {step === 4 && renderStep4()}

              {error && (
                  <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      {error}
                  </div>
              )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
            {step > 1 ? (
                <button
                    onClick={() => setStep(prev => prev - 1)}
                    className="text-gray-500 hover:text-gray-800 font-medium text-sm flex items-center gap-1"
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
                    className="px-6 py-2.5 bg-[#8A63D2] text-white font-bold rounded-xl shadow-lg shadow-purple-200 hover:bg-[#7854bc] transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                    Next <ChevronRight size={18} />
                </button>
            ) : (
                <button
                    onClick={() => { completeOnboarding(); onClose(); }}
                    className="px-6 py-2.5 text-gray-500 font-medium hover:text-gray-800 transition-colors"
                >
                    Skip / Finish
                </button>
            )}
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
