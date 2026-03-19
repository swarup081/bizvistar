'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X, AlertCircle } from 'lucide-react';

export default function ErrorDialog({ isOpen, onClose, title, message, primaryActionLabel, onPrimaryAction }) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-w-[90vw] w-full max-h-[85vh] translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white p-6 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-50 sm:max-w-[425px]">
          
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                 <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            
            <Dialog.Title className="text-xl font-bold text-gray-900 m-0">
              {title}
            </Dialog.Title>
            
            <Dialog.Description className="text-sm text-gray-600 leading-normal">
              {message}
            </Dialog.Description>

            <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
                {onPrimaryAction && (
                    <button 
                        onClick={onPrimaryAction}
                        className="flex-1 inline-flex h-[40px] items-center justify-center rounded-lg bg-brand-600 px-4 font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                    >
                        {primaryActionLabel || 'Confirm'}
                    </button>
                )}
                <Dialog.Close asChild>
                    <button 
                        className="flex-1 inline-flex h-[40px] items-center justify-center rounded-lg border border-gray-300 bg-white px-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                    >
                        Close
                    </button>
                </Dialog.Close>
            </div>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-3 right-3 inline-flex h-6 w-6 appearance-none items-center justify-center rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
