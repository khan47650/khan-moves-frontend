import React from 'react';
import { FiMapPin, FiArrowRight } from 'react-icons/fi';
import PostcodeInput from '../../PostcodeInput';

export default function StepLocation({ data, onChange, errors }) {
  const handlePickupChange = (field, value) =>
    onChange('pickup', { ...data.pickup, [field]: value });

  const handleDeliveryChange = (field, value) =>
    onChange('delivery', { ...data.delivery, [field]: value });

  return (
    <div>
      <h3 className="text-xl font-bold text-[#1a1a1a] mb-8">
        Where are we picking up and delivering?
      </h3>

      {/* Two-column layout: Pickup (left) ↔ Delivery (right) */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-stretch">
        {/* Pickup Location */}
        <div className="rounded-xl border-2 border-gray-100 border-t-4 border-t-[#C0392B] p-5 bg-white">
          <div className="flex items-center gap-2 mb-5">
            <FiMapPin size={20} className="text-[#C0392B]" />
            <h4 className="text-lg font-semibold text-[#1a1a1a]">Pickup Location</h4>
          </div>

          <div className="space-y-4">
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

            <PostcodeInput
              label="Postcode"
              value={data.pickup.postcode}
              onChange={(pc) => handlePickupChange('postcode', pc)}
              onResolved={(d) =>
                onChange('pickup', {
                  ...data.pickup,
                  postcode: d.postcode,
                  town: d.district,
                  region: d.region,
                  lat: d.lat,
                  lng: d.lng,
                })
              }
              placeholder="e.g., B1 1AA"
              error={errors.pickupPostcode}
            />
          </div>
        </div>

        {/* Connector arrow (desktop par beech me, mobile par hidden) */}
        <div className="hidden md:flex items-center justify-center">
          <div className="bg-[#F1C40F] rounded-full p-2">
            <FiArrowRight size={24} className="text-[#C0392B]" />
          </div>
        </div>

        {/* Delivery Location */}
        <div className="rounded-xl border-2 border-gray-100 border-t-4 border-t-[#F1C40F] p-5 bg-white">
          <div className="flex items-center gap-2 mb-5">
            <FiMapPin size={20} className="text-[#F1C40F]" />
            <h4 className="text-lg font-semibold text-[#1a1a1a]">Delivery Location</h4>
          </div>

          <div className="space-y-4">
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

            <PostcodeInput
              label="Postcode"
              value={data.delivery.postcode}
              onChange={(pc) => handleDeliveryChange('postcode', pc)}
              onResolved={(d) =>
                onChange('delivery', {
                  ...data.delivery,
                  postcode: d.postcode,
                  town: d.district,
                  region: d.region,
                  lat: d.lat,
                  lng: d.lng,
                })
              }
              placeholder="e.g., SW1A 1AA"
              error={errors.deliveryPostcode}
            />
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