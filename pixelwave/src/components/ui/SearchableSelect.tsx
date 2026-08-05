import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function SearchableSelect({ options, value, onChange, placeholder = 'Select an option...', required = false }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
    opt.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* Hidden input to handle 'required' validation if needed */}
      <input type="text" className="hidden" value={value} required={required} readOnly />
      
      <div 
        className="flex justify-between items-center border-2 border-black p-2 bg-white cursor-pointer hover:bg-gray-50 focus:bg-gray-100 outline-none"
        onClick={() => { setIsOpen(!isOpen); setSearchTerm(''); }}
      >
        <span className={selectedOption ? 'text-black' : 'text-gray-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={20} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border-2 border-black shadow-[4px_4px_0_0_#000] overflow-hidden flex flex-col">
          <div className="p-2 border-b-2 border-black">
            <input 
              type="text" 
              className="w-full border-2 border-black p-1 outline-none focus:bg-gray-100 text-sm"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <ul className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <li 
                  key={opt.value}
                  className="p-2 hover:bg-[var(--color-pw-hot-pink)] hover:text-white cursor-pointer border-b border-gray-200 last:border-b-0 text-sm font-bold"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                >
                  {opt.label}
                  <div className="text-xs font-normal opacity-70 truncate">{opt.value}</div>
                </li>
              ))
            ) : (
              <li className="p-4 text-center text-gray-500 text-sm">No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
