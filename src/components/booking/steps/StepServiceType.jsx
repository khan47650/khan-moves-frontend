import React from 'react';
import {
  FiHome,
  FiPackage,
  FiTruck,
  FiCheck,
  FiBox,
  FiLayers,
} from 'react-icons/fi';
import { FaBuilding, FaCouch } from 'react-icons/fa';

export default function StepServiceType({ value, onChange, error }) {
  const services = [
    {
      id: 'home',
      icon: FiHome,
      title: 'Home Removal',
      description: 'Full house moves across the UK',
    },
    {
      id: 'office',
      icon: FaBuilding,
      title: 'Office Move',
      description: 'Business relocation service',
    },
    {
      id: 'furniture',
      icon: FaCouch,
      title: 'Furniture Move',
      description: 'Single items & collections',
    },
    {
      id: 'parcels',
      icon: FiBox,
      title: 'Boxes & Parcels',
      description: 'Safe courier delivery',
    },
    {
      id: 'vehicle',
      icon: FiTruck,
      title: 'Vehicle Parts',
      description: 'Parts & single items',
    },
    {
      id: 'pallets',
      icon: FiLayers,
      title: 'Pallets',
      description: 'Heavy pallet transport',
    },
  ];

  return (
    <div className="bg-[#F9F8F6] -mx-4 px-4 py-4">
      {/* Heading */}
      <div className="max-w-7xl mx-auto mb-3">
        <h3 className="text-xl md:text-2xl font-bold text-[#1a1a1a]">
          What are you moving?
        </h3>
        <p className="text-gray-500 text-xs mt-0.5">
          Pick the service that best matches your move
        </p>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto mb-3 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
          {error}
        </div>
      )}

      {/* Service cards grid */}
      <div className="max-w-7xl mx-auto">
        <div
          className="bg-white rounded-2xl p-4 md:p-6"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {services.map((service) => {
              const Icon = service.icon;
              const isSelected = value === service.id;
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => onChange(service.id)}
                  className={`relative flex items-center gap-3 px-4 py-4 rounded-xl border-2 text-left transition group ${isSelected
                      ? 'border-[#1a1a1a] bg-[#F9F8F6]'
                      : 'border-gray-200 hover:border-gray-400 bg-white'
                    }`}
                >
                  {/* Icon box */}
                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition ${isSelected
                        ? 'bg-[#1a1a1a] text-white'
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                      }`}
                  >
                    <Icon size={20} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0 pr-5">
                    <p className="font-bold text-sm text-[#1a1a1a] leading-tight">
                      {service.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 leading-snug">
                      {service.description}
                    </p>
                  </div>

                  {/* Selected check badge */}
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                      <FiCheck size={12} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-gray-500 mt-5 text-center">
            Don't worry — you can refine the details in the next steps.
          </p>
        </div>
      </div>
    </div>
  );
}