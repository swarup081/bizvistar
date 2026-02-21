'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { X } from 'lucide-react';
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
      const result = await saveOnboardingStep1(websiteId, formData);
      setLoading(false);

      if (result.success) {
          if (onDataUpdate) onDataUpdate(result.businessData);
          setCurrentStep(2);
      } else {
          alert("Failed to save business info: " + result.error);
      }
  };

  // Step 2 Handler (Products are saved individually inside the step)
  const handleStep2 = () => {
      setCurrentStep(3);
  };

  // Step 3 Handler
  const handleStep3 = async (formData) => {
      setLoading(true);
      const result = await saveOnboardingStep3(websiteId, formData);
      setLoading(false);

      if (result.success) {
          if (onDataUpdate) onDataUpdate(result.businessData);
          setCurrentStep(4);
      } else {
          alert("Failed to save payment info: " + result.error);
      }
  };

  // Step 4 Handler
  const handleStep4 = async (newBusinessData) => {
      setLoading(true);
      // If AI generated new data, update the editor
      if (newBusinessData && onDataUpdate) {
          onDataUpdate(newBusinessData);
      }

      // Mark as complete
      const result = await completeOnboarding(websiteId);
      setLoading(false);

      if (result.success) {
          onClose();
      } else {
          alert("Failed to complete onboarding: " + result.error);
      }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={() => {}}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99990] animate-in fade-in duration-300" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] md:w-full max-w-lg h-[80vh] md:h-[600px] bg-white rounded-2xl shadow-2xl z-[99991] flex flex-col focus:outline-none overflow-hidden font-sans border border-gray-100">

          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white shrink-0 z-10">
            <div>
                <h2 className="text-xl font-bold text-gray-900">
                    {steps.find(s => s.id === currentStep)?.title}
                </h2>
                <p className="text-xs text-gray-500 mt-1">Step {currentStep} of {steps.length}</p>
            </div>
            {/* Progress Bar (Mini) */}
            <div className="flex gap-1">
                {steps.map((s) => (
                    <div
                        key={s.id}
                        className={`h-1.5 w-6 rounded-full transition-all ${
                            s.id === currentStep ? 'bg-[#8A63D2]' :
                            s.id < currentStep ? 'bg-purple-200' : 'bg-gray-100'
                        }`}
                    />
                ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-white">
              {currentStep === 1 && <BusinessInfoStep initialData={initialData} onNext={handleStep1} loading={loading} />}
              {currentStep === 2 && <ProductsStep websiteId={websiteId} onNext={handleStep2} loading={loading} onDataUpdate={onDataUpdate} />}
              {currentStep === 3 && <PaymentStep onNext={handleStep3} loading={loading} />}
              {currentStep === 4 && <AIContentStep websiteId={websiteId} onComplete={handleStep4} loading={loading} />}
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
