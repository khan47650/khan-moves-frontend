import React, { useMemo } from 'react';
import { FiCalendar, FiClock, FiUser, FiMail, FiPhone } from 'react-icons/fi';
import { calculatePrice } from '../../../utils/priceCalculator';

export default function StepDatePrice({ data, onChange, errors }) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const isWeekend = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay();
    return day === 5 || day === 6 || day === 0; // Friday, Saturday, Sunday
  };

  const pricing = useMemo(() => {
    return calculatePrice(data);
  }, [data]);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    onChange('date', selectedDate);
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-[#1a1a1a] mb-8">
        When & Who?
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* LEFT SIDE: Date & Time */}
        <div>
          <h4 className="font-semibold text-[#C0392B] mb-6">Moving Date & Time</h4>

          {/* Date */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-[#1a1a1a] mb-2 flex items-center gap-2">
              <FiCalendar size={16} className="text-[#C0392B]" />
              When do you want to move?
            </label>
            <input
              type="date"
              min={minDate}
              value={data.date}
              onChange={handleDateChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C0392B] focus:border-transparent ${errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.date && (
              <p className="text-red-600 text-sm mt-1">{errors.date}</p>
            )}
            {data.date && isWeekend(data.date) && (
              <p className="text-amber-600 text-sm mt-2">
                ⚠️ <strong>Weekend rate:</strong> +15% on prices (higher demand)
              </p>
            )}
          </div>

          {/* Time Slot */}
          <div>
            <label className="block text-sm font-semibold text-[#1a1a1a] mb-3 items-center gap-2">
              <FiClock size={16} className="text-[#C0392B]" />
              Preferred time
            </label>
            <div className="space-y-2">
              {[
                { id: 'morning', label: 'Morning (08:00 - 12:00)', price: '£0' },
                { id: 'afternoon', label: 'Afternoon (12:00 - 17:00)', price: '£0' },
                { id: 'flexible', label: 'Flexible (We\'ll confirm)', price: '-£15' },
              ].map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => onChange('timeSlot', slot.id)}
                  className={`w-full p-4 rounded-lg border-2 transition text-left flex justify-between items-center ${data.timeSlot === slot.id
                    ? 'border-[#C0392B] bg-red-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                >
                  <span
                    className={`font-semibold ${data.timeSlot === slot.id
                      ? 'text-[#C0392B]'
                      : 'text-[#1a1a1a]'
                      }`}
                  >
                    {slot.label}
                  </span>
                  <span className="text-sm text-gray-600">{slot.price}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Customer Details */}
        <div>
          <h4 className="font-semibold text-[#F1C40F] mb-6">Your Details</h4>

          {/* Name */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-[#1a1a1a] mb-2 flex items-center gap-2">
              <FiUser size={16} className="text-[#F1C40F]" />
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={data.customerName}
              onChange={(e) => onChange('customerName', e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C0392B] focus:border-transparent ${errors.customerName ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.customerName && (
              <p className="text-red-600 text-sm mt-1">{errors.customerName}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-[#1a1a1a] mb-2 flex items-center gap-2">
              <FiMail size={16} className="text-[#F1C40F]" />
              Email Address
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              value={data.customerEmail}
              onChange={(e) => onChange('customerEmail', e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C0392B] focus:border-transparent ${errors.customerEmail ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.customerEmail && (
              <p className="text-red-600 text-sm mt-1">{errors.customerEmail}</p>
            )}
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-[#1a1a1a] mb-2 flex items-center gap-2">
              <FiPhone size={16} className="text-[#F1C40F]" />
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="0121 555 6666"
              value={data.customerPhone}
              onChange={(e) => onChange('customerPhone', e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C0392B] focus:border-transparent ${errors.customerPhone ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.customerPhone && (
              <p className="text-red-600 text-sm mt-1">{errors.customerPhone}</p>
            )}
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
              Special Instructions (Optional)
            </label>
            <textarea
              placeholder="e.g., Please handle carefully, I have fragile items... or call 30 mins before arrival"
              value={data.specialInstructions}
              onChange={(e) => onChange('specialInstructions', e.target.value)}
              rows="3"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C0392B] focus:border-transparent resize-none"
            />
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-linear-to-br from-[#F1C40F] to-yellow-200 rounded-lg p-6 mb-6">
        <h4 className="font-bold text-[#1a1a1a] text-lg mb-4">Price Summary</h4>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-[#1a1a1a]">
            <span>Base Price:</span>
            <span className="font-semibold">£{pricing.basePrice}</span>
          </div>

          {data.items.length > 0 && (
            <div className="flex justify-between text-[#1a1a1a]">
              <span>Volume Charge ({((data.items.reduce((sum, i) => sum + (i.volume || 0) * i.quantity, 0)) / 1000).toFixed(1)}m³):</span>
              <span className="font-semibold">£{pricing.volumeCharge}</span>
            </div>
          )}

          {data.pickup.floorLevel !== 'ground' && (
            <div className="flex justify-between text-[#1a1a1a]">
              <span>Floor Level Surcharge:</span>
              <span className="font-semibold">£{pricing.floorSurcharge}</span>
            </div>
          )}

          {!data.pickup.hasParking && (
            <div className="flex justify-between text-[#1a1a1a]">
              <span>No Parking (Pickup):</span>
              <span className="font-semibold">£{pricing.parkingSurcharge}</span>
            </div>
          )}

          {data.date && isWeekend(data.date) && (
            <div className="flex justify-between text-[#1a1a1a]">
              <span>Weekend Rate (+15%):</span>
              <span className="font-semibold">£{pricing.weekendSurcharge}</span>
            </div>
          )}

          {data.timeSlot === 'flexible' && (
            <div className="flex justify-between text-green-700">
              <span>Flexible Time Discount:</span>
              <span className="font-semibold">-£{pricing.flexibleDiscount}</span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t-2 border-[#1a1a1a] border-opacity-20">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-[#1a1a1a]">Total Estimate:</span>
            <span className="text-3xl font-bold text-[#C0392B]">£{pricing.totalPrice}</span>
          </div>
          <p className="text-xs text-[#1a1a1a] text-opacity-70 mt-2">
            💡 Final price may vary based on actual job complexity
          </p>
        </div>
      </div>

      {/* Terms Agreement */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" className="mt-1 w-4 h-4 text-[#C0392B]" required />
          <span className="text-sm text-gray-700">
            I agree to Khan Moves' <a href="/terms" className="text-[#C0392B] font-semibold hover:underline">Terms & Conditions</a> and <a href="#privacy" className="text-[#C0392B] font-semibold hover:underline">Privacy Policy</a>
          </span>
        </label>
      </div>
    </div>
  );
}
