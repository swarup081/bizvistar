import { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function StateSelector({ value, onChange, error }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef(null);

    // Filter states
    const filteredStates = useMemo(() => {
        if (!search) return INDIAN_STATES;
        return INDIAN_STATES.filter(state =>
            state.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    // Handle clicking outside to close
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const handleSelect = (state) => {
        onChange(state);
        setIsOpen(false);
        setSearch('');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                className={`w-full p-3 border rounded-md bg-white cursor-pointer flex justify-between items-center ${error ? 'border-red-500' : 'border-gray-300'} focus-within:ring-1 focus-within:ring-purple-500`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={value ? 'text-gray-900' : 'text-gray-500'}>
                    {value || "Select State"}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-hidden flex flex-col">
                    {/* Search Input */}
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

                    {/* List */}
                    <div className="overflow-y-auto flex-1">
                        {filteredStates.length > 0 ? (
                            filteredStates.map((state) => (
                                <div
                                    key={state}
                                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 flex justify-between items-center"
                                    onClick={() => handleSelect(state)}
                                >
                                    {state}
                                    {value === state && <Check className="w-4 h-4 text-purple-600" />}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-2 text-sm text-gray-500">No states found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
