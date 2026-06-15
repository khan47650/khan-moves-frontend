import React from 'react';
import { FiMapPin, FiArrowDown } from 'react-icons/fi';

export default function StepLocation({ data, onChange, errors }) {
  const handlePickupChange = (field, value) => {
    onChange('pickup', {
      ...data.pickup,
      [field]: value,
    });
  };

  const handleDeliveryChange = (field, value) => {
    onChange('delivery', {
      ...data.delivery,
      [field]: value,
    });
  };

  const ukPostcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;

  return (
    <div>
      <h3 className="text-xl font-bold text-[#1a1a1a] mb-8">
        Where are we picking up and delivering?
      </h3>

      {/* Pickup Location */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <FiMapPin size={20} className="text-[#C0392B]" />
          <h4 className="text-lg font-semibold text-[#1a1a1a]">Pickup Location</h4>
        </div>

        <div className="space-y-4">
          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
              Full Address
            </label>
            <input
              type="text"
              placeholder="e.g., 123 Main Street, Birmingham"
              value={data.pickup.address}
              onChange={(e) => handlePickupChange('address', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C0392B] focus:border-transparent"
            />
          </div>

          {/* Postcode */}
          <div>
            <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
              Postcode
            </label>
            <input
              type="text"
              placeholder="e.g., B1 1AA"
              value={data.pickup.postcode}
              onChange={(e) =>
                handlePickupChange('postcode', e.target.value.toUpperCase())
              }
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C0392B] focus:border-transparent ${errors.pickupPostcode ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.pickupPostcode && (
              <p className="text-red-600 text-sm mt-1">{errors.pickupPostcode}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Format: e.g., B1 1AA, SW1A 1AA</p>
          </div>
        </div>
      </div>

      {/* Arrow Divider */}
      <div className="flex justify-center mb-8">
        <div className="bg-[#F1C40F] rounded-full p-2">
          <FiArrowDown size={24} className="text-[#C0392B]" />
        </div>
      </div>

      {/* Delivery Location */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FiMapPin size={20} className="text-[#F1C40F]" />
          <h4 className="text-lg font-semibold text-[#1a1a1a]">Delivery Location</h4>
        </div>

        <div className="space-y-4">
          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
              Full Address
            </label>
            <input
              type="text"
              placeholder="e.g., 456 Park Avenue, London"
              value={data.delivery.address}
              onChange={(e) => handleDeliveryChange('address', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C0392B] focus:border-transparent"
            />
          </div>

          {/* Postcode */}
          <div>
            <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
              Postcode
            </label>
            <input
              type="text"
              placeholder="e.g., SW1A 1AA"
              value={data.delivery.postcode}
              onChange={(e) =>
                handleDeliveryChange('postcode', e.target.value.toUpperCase())
              }
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C0392B] focus:border-transparent ${errors.deliveryPostcode ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.deliveryPostcode && (
              <p className="text-red-600 text-sm mt-1">{errors.deliveryPostcode}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Format: e.g., SW1A 1AA, B1 1AA</p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-green-50 border-l-4 border-green-400 rounded">
        <p className="text-sm text-green-800">
          ✓ <strong>Pro tip:</strong> UK postcodes help us estimate distance and delivery time more accurately.
        </p>
      </div>
    </div>
  );
}
