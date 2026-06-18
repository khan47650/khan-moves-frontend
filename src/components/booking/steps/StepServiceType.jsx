import React, { useState, useRef, useEffect } from 'react';
import {
  FiHome,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiChevronDown,
} from 'react-icons/fi';
import { FaBuilding, FaCouch } from 'react-icons/fa';

export default function StepServiceType({ value, onChange, error }) {
  const services = [
    { id: 'home', icon: FiHome, title: 'Home Removal', description: 'Full house moves across UK' },
    { id: 'office', icon: FaBuilding, title: 'Office Move', description: 'Business relocation service' },
    { id: 'furniture', icon: FaCouch, title: 'Furniture Move', description: 'Single items & collections' },
    { id: 'parcels', icon: FiPackage, title: 'Boxes & Parcels', description: 'Safe courier delivery' },
    { id: 'vehicle', icon: FiTruck, title: 'Vehicle Parts', description: 'Parts & single items' },
    { id: 'pallets', icon: FiPackage, title: 'Pallets', description: 'Heavy pallet transport' },
  ];

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // bahar click karne par band
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = services.find((s) => s.id === value) || null;
  const SelectedIcon = selected?.icon;

  const handleSelect = (id) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-[#1a1a1a] mb-6">What are you moving?</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Service type</label>

      <div className="relative" ref={ref}>
        {/* Trigger / selected value */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 bg-white text-left transition focus:outline-none ${open || selected ? 'border-[#C0392B]' : 'border-gray-200 hover:border-gray-300'
            } ${error ? 'border-red-400' : ''}`}
        >
          {SelectedIcon ? (
            <SelectedIcon size={22} className="text-[#C0392B] shrink-0" />
          ) : (
            <FiPackage size={22} className="text-gray-300 shrink-0" />
          )}

          <span className="grow min-w-0">
            {selected ? (
              <>
                <span className="block font-semibold text-sm text-[#1a1a1a]">
                  {selected.title}
                </span>
                <span className="block text-xs text-gray-500 truncate">
                  {selected.description}
                </span>
              </>
            ) : (
              <span className="text-sm text-gray-400">Select what you're moving…</span>
            )}
          </span>

          <FiChevronDown
            size={20}
            className={`text-gray-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''
              }`}
          />
        </button>

        {/* Dropdown list */}
        {open && (
          <ul className="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden max-h-80 overflow-y-auto">
            {services.map((service) => {
              const Icon = service.icon;
              const isSelected = value === service.id;
              return (
                <li key={service.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(service.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition ${isSelected ? 'bg-red-50' : 'hover:bg-gray-50'
                      }`}
                  >
                    <Icon
                      size={20}
                      className={`shrink-0 ${isSelected ? 'text-[#C0392B]' : 'text-gray-400'}`}
                    />
                    <span className="grow min-w-0">
                      <span
                        className={`block font-semibold text-sm ${isSelected ? 'text-[#C0392B]' : 'text-[#1a1a1a]'
                          }`}
                      >
                        {service.title}
                      </span>
                      <span className="block text-xs text-gray-500">{service.description}</span>
                    </span>
                    {isSelected && (
                      <FiCheckCircle size={18} className="text-[#C0392B] shrink-0" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> You can select items from multiple categories in the next steps,
          so don't worry about choosing the perfect service right now.
        </p>
      </div>
    </div>
  );
}