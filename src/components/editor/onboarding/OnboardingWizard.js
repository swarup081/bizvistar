'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2 } from 'lucide-react';
import ProgressBar from './ProgressBar';
import StepIdentity from './steps/StepIdentity';
import StepProducts from './steps/StepProducts';
import StepSocial from './steps/StepSocial';
import StepPayments from './steps/StepPayments';
import { saveOnboardingStep, completeOnboarding, addQuickProducts } from '@/app/actions/onboardingActions';

export default function OnboardingWizard({ websiteId, onComplete, initialStatus }) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with any existing data if available (e.g. from partial fill)
  const [data, setData] = useState(() => ({
    name: initialStatus?.name || '', // Assuming name is stored somewhere or inferred
    owner_name: initialStatus?.owner_name || '',
    business_city: initialStatus?.business_city || '',
    whatsapp_number: initialStatus?.whatsapp_number || '',
    logo_url: initialStatus?.logo_url || null,
    social_instagram: initialStatus?.social_instagram || '',
    social_facebook: initialStatus?.social_facebook || '',
    upi_id: initialStatus?.upi_id || '',
    confirm_upi_id: initialStatus?.upi_id || '', // Initialize with same if exists
  }));

  const [products, setProducts] = useState([]);
  const [errors, setErrors] = useState({});
  const [showExitDialog, setShowExitDialog] = useState(false); // For No-UPI Alert

  const totalSteps = 4;

  const handleUpdate = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!data.name) newErrors.name = 'Business Name is required';
    if (!data.owner_name) newErrors.owner_name = 'Owner Name is required';
    if (!data.business_city) newErrors.business_city = 'City is required';
    if (!data.whatsapp_number || data.whatsapp_number.length !== 10) newErrors.whatsapp_number = 'Valid 10-digit number required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
     // User must add at least 1 product (unless skipping, handled by Skip button)
     if (products.length === 0) {
         // Maybe show a toast or shake animation?
         // For now, standard alert or just block.
         alert("Please add at least one product to continue, or click 'Skip'.");
         return false;
     }
     return true;
  };

  const handleNext = async () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 4) {
        handleFinishAttempt();
        return;
    }

    setIsLoading(true);

    // Save Step Data
    try {
        let payload = {};
        if (step === 1) {
            payload = {
                owner_name: data.owner_name,
                business_city: data.business_city,
                whatsapp_number: data.whatsapp_number,
                logo_url: data.logo_url
                // Note: Business Name usually goes to 'websites' table, handled by sync or separate action?
                // For now, we save to onboarding_data. The Editor should also pick it up.
            };
        } else if (step === 2) {
            // Save Products
            await addQuickProducts(websiteId, products);
            // No payload for onboarding_data table for products
        } else if (step === 3) {
            payload = {
                social_instagram: data.social_instagram,
                social_facebook: data.social_facebook
            };
        }

        if (Object.keys(payload).length > 0) {
            await saveOnboardingStep(websiteId, payload);
        }

        setStep(prev => prev + 1);
    } catch (err) {
        console.error("Step save failed:", err);
        // Continue anyway?
        setStep(prev => prev + 1);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSkip = () => {
    if (step === 4) {
        handleFinishAttempt(true); // Skip means finish without validation
        return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const handleFinishAttempt = (isSkipping = false) => {
      // If Step 4 and UPI is empty/invalid AND not explicitly skipping/catalog mode
      const isValidUpi = data.upi_id && /.+@.+/.test(data.upi_id);
      const isMatch = data.upi_id === data.confirm_upi_id;

      if (!isSkipping) {
          if (!isValidUpi) {
              setShowExitDialog(true);
              return;
          }
          if (!isMatch) {
              alert("UPI IDs do not match.");
              return;
          }
      }

      finalizeOnboarding(isValidUpi ? data.upi_id : null);
  };

  const finalizeOnboarding = async (upiId) => {
      setIsLoading(true);
      try {
          // Save UPI if present
          if (upiId) {
              await saveOnboardingStep(websiteId, { upi_id: upiId });
          }

          // Mark Complete
          await completeOnboarding(websiteId);

          // Emit completion to parent to close modal and update Editor state
          onComplete({
              ...data,
              products: products
          });
      } catch (err) {
          console.error("Finalize failed:", err);
          onComplete(data); // Close anyway
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop with Blur */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-white/60 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-white w-full max-w-lg h-[80vh] max-h-[700px] rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-0">
           <ProgressBar currentStep={step} totalSteps={totalSteps} />
        </div>

        {/* Content Area */}
        <div className="flex-grow px-8 pb-4 overflow-y-auto">
           <AnimatePresence mode='wait'>
             {step === 1 && (
                <StepIdentity key="step1" data={data} onUpdate={handleUpdate} errors={errors} />
             )}
             {step === 2 && (
                <StepProducts
                    key="step2"
                    products={products}
                    onAddProduct={(p) => setProducts([...products, p])}
                    onRemoveProduct={(id) => setProducts(products.filter(p => p.id !== id))}
                />
             )}
             {step === 3 && (
                <StepSocial key="step3" data={data} onUpdate={handleUpdate} />
             )}
             {step === 4 && (
                <StepPayments key="step4" data={data} onUpdate={handleUpdate} />
             )}
           </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="p-6 border-t border-gray-50 bg-white z-10">
           <div className="flex items-center justify-between gap-4">
              <button
                onClick={handleBack}
                disabled={step === 1 || isLoading}
                className={`text-sm font-medium text-gray-500 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors ${step === 1 ? 'invisible' : ''}`}
              >
                Back
              </button>

              <div className="flex items-center gap-3">
                 <button
                    onClick={handleSkip}
                    disabled={isLoading}
                    className="text-sm font-medium text-gray-400 hover:text-gray-600 px-4 py-2 rounded-lg transition-colors"
                 >
                    Skip
                 </button>
                 <button
                    onClick={handleNext}
                    disabled={isLoading}
                    className="bg-[#8A63D2] text-white text-sm font-semibold px-8 py-3 rounded-full hover:bg-[#7854bc] active:scale-95 transition-all shadow-lg shadow-purple-200 flex items-center gap-2"
                 >
                    {isLoading && <Loader2 size={16} className="animate-spin" />}
                    {step === totalSteps ? 'Finish' : 'Next'}
                 </button>
              </div>
           </div>
        </div>

        {/* No-UPI Warning Dialog */}
        {showExitDialog && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center transform scale-100 animate-in zoom-in-95 duration-200">
                    <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-amber-100">
                        <AlertTriangle className="text-amber-600" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Missing UPI ID</h3>
                    <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                        Without a UPI ID, your store will be in <strong className="text-gray-800">'Catalog Mode'</strong> (View Only). Customers won't be able to buy online.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => setShowExitDialog(false)}
                            className="w-full py-3 bg-[#8A63D2] text-white rounded-xl font-semibold shadow-lg shadow-purple-100 hover:shadow-purple-200 transition-all active:scale-95"
                        >
                            Add UPI ID
                        </button>
                        <button
                            onClick={() => finalizeOnboarding(null)}
                            className="w-full py-3 bg-white text-gray-500 rounded-xl font-medium hover:bg-gray-50 hover:text-gray-700 transition-colors"
                        >
                            Continue as Catalog
                        </button>
                    </div>
                </div>
            </div>
        )}

      </motion.div>
    </div>
  );
}
