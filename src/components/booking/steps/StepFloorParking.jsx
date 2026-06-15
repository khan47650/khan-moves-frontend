import React from 'react';
import { FiHelpCircle } from 'react-icons/fi';

export default function StepFloorParking({ data, onChange }) {
  const floorOptions = [
    { value: 'ground', label: 'Ground Floor', icon: '🏢' },
    { value: '1st', label: '1st Floor', icon: '📍' },
    { value: '2nd', label: '2nd Floor', icon: '📍' },
    { value: '3rd', label: '3rd+ Floor', icon: '📍' },
  ];

  return (
    <div>
      <h3 className="text-xl font-bold text-[#1a1a1a] mb-8">
        Help us understand access at both locations
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* PICKUP SIDE */}
        <div>
          <h4 className="text-lg font-semibold text-[#C0392B] mb-6">
            Pickup Location
          </h4>

          {/* Floor Level */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-[#1a1a1a] mb-4">
              Which floor?
            </label>
            <div className="space-y-3">
              {floorOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    onChange('pickup', 'floorLevel', option.value)
                  }
                  className={`w-full p-4 rounded-lg border-2 transition text-left font-semibold ${data.pickup.floorLevel === option.value
                      ? 'border-[#C0392B] bg-red-50 text-[#C0392B]'
                      : 'border-gray-200 bg-white hover:border-gray-300 text-[#1a1a1a]'
                    }`}
                >
                  <span className="mr-2">{option.icon}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lift */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-[#1a1a1a] mb-4">
              Is there a lift?
            </label>
            <div className="space-y-3">
              {[
                { value: true, label: 'Yes, there is a lift' },
                { value: false, label: 'No lift available' },
              ].map((option) => (
                <button
                  key={String(option.value)}
                  onClick={() =>
                    onChange('pickup', 'hasLift', option.value)
                  }
                  className={`w-full p-4 rounded-lg border-2 transition text-left font-semibold ${data.pickup.hasLift === option.value
                      ? 'border-[#C0392B] bg-red-50 text-[#C0392B]'
                      : 'border-gray-200 bg-white hover:border-gray-300 text-[#1a1a1a]'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Parking */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <label className="text-sm font-semibold text-[#1a1a1a]">
                Parking available?
              </label>
              <FiHelpCircle
                size={16}
                className="text-gray-400 cursor-help"
                title="Close parking where we can load the van"
              />
            </div>
            <div className="space-y-3">
              {[
                { value: true, label: 'Yes, parking available' },
                { value: false, label: 'No parking nearby' },
              ].map((option) => (
                <button
                  key={String(option.value)}
                  onClick={() =>
                    onChange('pickup', 'hasParking', option.value)
                  }
                  className={`w-full p-4 rounded-lg border-2 transition text-left font-semibold ${data.pickup.hasParking === option.value
                      ? 'border-[#C0392B] bg-red-50 text-[#C0392B]'
                      : 'border-gray-200 bg-white hover:border-gray-300 text-[#1a1a1a]'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* DELIVERY SIDE */}
        <div>
          <h4 className="text-lg font-semibold text-[#F1C40F] mb-6">
            Delivery Location
          </h4>

          {/* Floor Level */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-[#1a1a1a] mb-4">
              Which floor?
            </label>
            <div className="space-y-3">
              {floorOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    onChange('delivery', 'floorLevel', option.value)
                  }
                  className={`w-full p-4 rounded-lg border-2 transition text-left font-semibold ${data.delivery.floorLevel === option.value
                      ? 'border-[#F1C40F] bg-yellow-50 text-[#1a1a1a]'
                      : 'border-gray-200 bg-white hover:border-gray-300 text-[#1a1a1a]'
                    }`}
                >
                  <span className="mr-2">{option.icon}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lift */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-[#1a1a1a] mb-4">
              Is there a lift?
            </label>
            <div className="space-y-3">
              {[
                { value: true, label: 'Yes, there is a lift' },
                { value: false, label: 'No lift available' },
              ].map((option) => (
                <button
                  key={String(option.value)}
                  onClick={() =>
                    onChange('delivery', 'hasLift', option.value)
                  }
                  className={`w-full p-4 rounded-lg border-2 transition text-left font-semibold ${data.delivery.hasLift === option.value
                      ? 'border-[#F1C40F] bg-yellow-50 text-[#1a1a1a]'
                      : 'border-gray-200 bg-white hover:border-gray-300 text-[#1a1a1a]'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Parking */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <label className="text-sm font-semibold text-[#1a1a1a]">
                Parking available?
              </label>
              <FiHelpCircle
                size={16}
                className="text-gray-400 cursor-help"
                title="Close parking where we can unload the van"
              />
            </div>
            <div className="space-y-3">
              {[
                { value: true, label: 'Yes, parking available' },
                { value: false, label: 'No parking nearby' },
              ].map((option) => (
                <button
                  key={String(option.value)}
                  onClick={() =>
                    onChange('delivery', 'hasParking', option.value)
                  }
                  className={`w-full p-4 rounded-lg border-2 transition text-left font-semibold ${data.delivery.hasParking === option.value
                      ? 'border-[#F1C40F] bg-yellow-50 text-[#1a1a1a]'
                      : 'border-gray-200 bg-white hover:border-gray-300 text-[#1a1a1a]'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 p-4 bg-amber-50 border-l-4 border-amber-400 rounded">
        <p className="text-sm text-amber-800">
          ℹ️ <strong>Note:</strong> Floor level, lift availability, and parking affect pricing. Higher floors and lack of parking may increase the cost.
        </p>
      </div>
    </div>
  );
}
