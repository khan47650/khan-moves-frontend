import React, { useState, useEffect } from 'react';
import { FiArrowRight, FiLoader } from 'react-icons/fi';
import PostCodeInput from '../../PostCodeInput';
import MapComponent from '../MapComponent';

export default function StepLocation({ data, onChange, errors }) {
  const [distance, setDistance] = useState(null);
  const [time, setTime] = useState(null);
  const [calculating, setCalculating] = useState(false);

  const handlePickupChange = (field, value) =>
    onChange('pickup', { ...data.pickup, [field]: value });

  const handleDeliveryChange = (field, value) =>
    onChange('delivery', { ...data.delivery, [field]: value });

  useEffect(() => {
    if (
      data.pickup.lat &&
      data.pickup.lng &&
      data.delivery.lat &&
      data.delivery.lng
    ) {
      setCalculating(true);
      setTimeout(() => {
        const dist = calculateDistance(
          data.pickup.lat,
          data.pickup.lng,
          data.delivery.lat,
          data.delivery.lng
        );
        const t = Math.round((dist / 50) * 60);
        setDistance(dist);
        setTime(`${t} mins`);
        setCalculating(false);
      }, 500);
    }
  }, [data.pickup.lat, data.delivery.lat]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3959;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  return (
    <div className="bg-[#F9F8F6] -mx-4 px-4 py-4">
      {/* Heading - compact */}
      <div className="max-w-7xl mx-auto mb-3">
        <h3 className="text-xl md:text-2xl font-bold text-[#1a1a1a]">
          Where are you moving from and to?
        </h3>
        <p className="text-gray-500 text-xs mt-0.5">
          Enter the address and postcode for pickup and delivery
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* LEFT: Card with pickup + delivery side by side */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-5 md:p-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-5 items-start">

              {/* ===== PICKUP DETAILS ===== */}
              <div>
                <h4 className="text-base font-bold text-[#1a1a1a] mb-3">Pickup details</h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Full address
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 123 Main Street, Birmingham"
                      value={data.pickup.address}
                      onChange={(e) => handlePickupChange('address', e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg outline-none text-sm font-medium text-[#1a1a1a] placeholder:text-gray-400 placeholder:font-normal bg-white focus:border-gray-400 transition"
                    />
                  </div>

                  <PostCodeInput
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

              {/* ===== CENTER ARROW (desktop) ===== */}
              <div className="hidden md:flex items-center justify-center self-stretch pt-10">
                <div className="w-9 h-9 rounded-full bg-[#F9F8F6] flex items-center justify-center">
                  <FiArrowRight size={16} className="text-gray-500" />
                </div>
              </div>

              {/* Mobile arrow */}
              <div className="flex md:hidden items-center justify-center my-1">
                <div className="w-9 h-9 rounded-full bg-[#F9F8F6] flex items-center justify-center">
                  <FiArrowRight size={16} className="text-gray-500 rotate-90" />
                </div>
              </div>

              {/* ===== DELIVERY DETAILS ===== */}
              <div>
                <h4 className="text-base font-bold text-[#1a1a1a] mb-3">Delivery details</h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Full address
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 456 Park Avenue, London"
                      value={data.delivery.address}
                      onChange={(e) => handleDeliveryChange('address', e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg outline-none text-sm font-medium text-[#1a1a1a] placeholder:text-gray-400 placeholder:font-normal bg-white focus:border-gray-400 transition"
                    />
                  </div>

                  <PostCodeInput
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

            <p className="text-xs text-gray-500 mt-5 text-center">
              Don't worry — you can change these details later if needed.
            </p>
          </div>
        </div>

        {/* RIGHT: Map */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl overflow-hidden h-full" style={{ isolation: 'isolate', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            {calculating ? (
              <div className="h-64 flex items-center justify-center">
                <FiLoader size={26} className="text-gray-400 animate-spin" />
              </div>
            ) : data.pickup.lat && data.delivery.lat ? (
              <MapComponent
                pickupLat={data.pickup.lat}
                pickupLng={data.pickup.lng}
                deliveryLat={data.delivery.lat}
                deliveryLng={data.delivery.lng}
                distance={distance}
                time={time}
              />
            ) : (
              <div className="h-64 flex items-center justify-center p-5">
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#F9F8F6] flex items-center justify-center">
                    <FiArrowRight size={18} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-xs">
                    Enter both postcodes to see your route
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}