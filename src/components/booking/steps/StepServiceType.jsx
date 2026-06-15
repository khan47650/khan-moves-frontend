import React from 'react';
import {
  FiHome,
  FiPackage,
  FiTruck,
  FiCheckCircle,
} from 'react-icons/fi';
import { FaBuilding, FaCouch } from "react-icons/fa";

export default function StepServiceType({ value, onChange, error }) {
  const services = [
    {
      id: 'home',
      icon: FiHome,
      title: 'Home Removal',
      description: 'Full house moves across UK',
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
      icon: FiPackage,
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
      icon: FiPackage,
      title: 'Pallets',
      description: 'Heavy pallet transport',
    },
  ];

  return (
    <div>
      <h3 className="text-xl font-bold text-[#1a1a1a] mb-6">
        What are you moving?
      </h3>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => {
          const Icon = service.icon;
          const isSelected = value === service.id;

          return (
            <button
              key={service.id}
              onClick={() => onChange(service.id)}
              className={`p-5 rounded-lg border-2 transition text-left flex flex-col items-start ${isSelected
                ? 'border-[#C0392B] bg-red-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
            >
              <Icon
                size={24}
                className={isSelected ? 'text-[#C0392B]' : 'text-gray-400'}
              />
              <h4
                className={`font-semibold text-base mt-3 ${isSelected ? 'text-[#C0392B]' : 'text-[#1a1a1a]'
                  }`}
              >
                {service.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1">{service.description}</p>
              {isSelected && (
                <FiCheckCircle size={20} className="ml-auto text-[#C0392B] mt-4" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> You can select items from multiple categories in the next steps, so don't worry about choosing the perfect service right now.
        </p>
      </div>
    </div>
  );
}
