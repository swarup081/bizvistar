'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useState, useEffect } from 'react';
import { X, CheckCircle2, ChevronRight } from 'lucide-react';
import BusinessInfoStep from './steps/BusinessInfoStep';
import ProductsStep from './steps/ProductsStep';
import PaymentStep from './steps/PaymentStep';
import AIContentStep from './steps/AIContentStep';
import { saveOnboardingStep1, saveOnboardingStep3, completeOnboarding } from '@/app/actions/onboardingActions';

const steps = [
  { id: 1, title: 'Business Info' },
  { id: 2, title: 'Products' },
  { id: 3, title: 'Payment' },
  { id: 4, title: 'AI Content' },
];

export default function WizardModal({ isOpen, onClose, initialData = {}, websiteId, onDataUpdate }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1 Handler
  const handleStep1 = async (formData) => {
      setLoading(true);
      const res = await saveOnboardingStep1(websiteId, formData);
      setLoading(false);

      if (res.success) {
          if (onDataUpdate) onDataUpdate(res.businessData); // Update editor live
          setCurrentStep(2);
      } else {
          alert("Error saving business info: " + res.error);
      }
  };

  // Step 2 Handler (Products are saved individually inside the step)
  const handleStep2 = () => {
      setCurrentStep(3);
  };

  // Step 3 Handler
  const handleStep3 = async (formData) => {
      setLoading(true);
      const res = await saveOnboardingStep3(websiteId, formData);
      setLoading(false);

      if (res.success) {
          if (onDataUpdate) onDataUpdate(res.businessData);
          setCurrentStep(4);
      } else {
          alert("Error saving payment info: " + res.error);
      }
  };

  // Step 4 Handler
  const handleStep4 = async (newBusinessData) => {
      setLoading(true);

      // Mark onboarding as complete
      const res = await completeOnboarding(websiteId);
      setLoading(false);

      if (res.success) {
          if (newBusinessData && onDataUpdate) {
              onDataUpdate(newBusinessData); // Update editor live with AI content
          }
          onClose();
      } else {
          alert("Error completing onboarding: " + res.error);
      }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={() => {}}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99990] animate-in fade-in duration-300" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] md:w-[600px] max-h-[90vh] bg-white rounded-3xl shadow-2xl z-[99991] flex flex-col focus:outline-none overflow-hidden font-sans border border-gray-100">

          {/* Progress Bar */}
          <div className="h-2 bg-gray-100 w-full flex">
              <div
                className="h-full bg-[#8A63D2] transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
              {currentStep === 1 && <BusinessInfoStep initialData={initialData} onNext={handleStep1} loading={loading} />}
              {currentStep === 2 && <ProductsStep websiteId={websiteId} onNext={handleStep2} loading={loading} />}
              {currentStep === 3 && <PaymentStep onNext={handleStep3} loading={loading} />}
              {currentStep === 4 && <AIContentStep websiteId={websiteId} onComplete={handleStep4} loading={loading} />}
          </div>

          {/* Steps Indicator (Footer) */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center gap-2">
              {steps.map((s) => (
                  <div
                    key={s.id}
                    className={`h-2 w-2 rounded-full transition-all ${
                        s.id === currentStep ? 'bg-[#8A63D2] w-6' :
                        s.id < currentStep ? 'bg-[#8A63D2] opacity-50' : 'bg-gray-300'
                    }`}
                  />
              ))}
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
