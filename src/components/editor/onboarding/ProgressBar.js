'use client';

import { motion } from 'framer-motion';

export default function ProgressBar({ currentStep, totalSteps }) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-xs font-semibold text-[#8A63D2]">
          {Math.round(progress)}% Completed
        </span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#8A63D2]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
