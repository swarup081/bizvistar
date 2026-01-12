import { ChevronDown, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function CustomStateSelect({ value, onChange, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredStates = INDIAN_STATES.filter(state =>
    state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full p-3 flex justify-between items-center
          border rounded-md bg-white cursor-pointer transition-all
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${isOpen ? 'ring-1 ring-purple-500 border-purple-500' : 'hover:border-purple-400'}
        `}
      >
        <span className={value ? "text-gray-900" : "text-gray-500"}>
          {value || "Select State"}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-hidden flex flex-col"
          >
            {/* Search Input */}
            <div className="p-2 border-b border-gray-100">
               <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 text-sm bg-gray-50 rounded-md outline-none focus:ring-1 focus:ring-purple-200"
                  autoFocus
               />
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1 p-1">
              {filteredStates.length > 0 ? (
                filteredStates.map((state) => (
                  <div
                    key={state}
                    onClick={() => {
                      onChange(state);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className="flex justify-between items-center px-3 py-2 hover:bg-purple-50 rounded-md cursor-pointer text-gray-700 text-sm transition-colors"
                  >
                    {state}
                    {value === state && <Check className="w-4 h-4 text-purple-600" />}
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-400 text-sm">
                  No state found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
