import React, { useState } from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiSunrise,
  FiSun,
  FiUser,
  FiClock,
} from 'react-icons/fi';
import MapComponent from '../MapComponent';

export default function StepDatePrice({
  data,
  onChange,
  errors,
  distance = 25,
  volume = 5000,
  pickupLat = 52.509,
  pickupLng = -1.885,
  deliveryLat = 51.5074,
  deliveryLng = -0.1278,
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const isFlexibleDate = data.dateType === 'flexible';

  const timeOptions = [
    { value: 'morning', label: 'Morning', sub: '08:00 - 12:00', icon: FiSunrise },
    { value: 'afternoon', label: 'Afternoon', sub: '12:00 - 17:00', icon: FiSun },
    { value: 'flexible', label: 'Flexible', sub: "We'll confirm the best slot", icon: FiClock },
  ];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getDummyPrice = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay();
    // Weekend more expensive
    if (day === 0 || day === 5 || day === 6) {
      return Math.round(Math.random() * 50 + 200);
    }
    return Math.round(Math.random() * 50 + 150);
  };

  const isDatePast = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(dateString);
    return checkDate < today;
  };

  const days = [];
  const firstDay = getFirstDayOfMonth(currentMonth);
  const daysInMonth = getDaysInMonth(currentMonth);

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
    const dateString = date.toISOString().split('T')[0];
    const isPast = isDatePast(dateString);
    days.push({ date: i, dateString, isPast, price: getDummyPrice(dateString) });
  }

  const estimatedPrice = Math.round(distance * 2 + (volume / 1000) * 50);

  return (
    <div className="bg-[#F9F8F6] -mx-4 px-4 py-4">
      {/* Heading */}
      <div className="max-w-7xl mx-auto mb-3">
        <h3 className="text-xl md:text-2xl font-bold text-[#1a1a1a]">
          When & how much?
        </h3>
        <p className="text-gray-500 text-xs mt-0.5">
          Pick a time slot that works for you
        </p>
      </div>

      {errors.date && (
        <div className="max-w-7xl mx-auto mb-3 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
          {errors.date}
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ===== LEFT: Options ===== */}
        <div className="lg:col-span-2 space-y-3">

          {/* Flexible Date Checkbox */}
          <div
            className="bg-white rounded-2xl p-4"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
          >
            <label className="flex items-start gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-gray-400 cursor-pointer transition">
              <input
                type="checkbox"
                checked={isFlexibleDate}
                onChange={(e) => onChange('dateType', e.target.checked ? 'flexible' : 'specific')}
                className="w-4 h-4 mt-1 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-[#1a1a1a]">I'm flexible with dates</p>
                <p className="text-xs text-gray-500 mt-0.5">We'll suggest the best available slots</p>
              </div>
            </label>
          </div>

          {/* Calendar - Show if NOT flexible */}
          {!isFlexibleDate && (
            <div
              className="bg-white rounded-2xl p-4"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-sm text-[#1a1a1a]">
                  {currentMonth.toLocaleString('default', { month: 'short', year: 'numeric' })}
                </h4>
                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      setCurrentMonth(
                        new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
                      )
                    }
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                  >
                    <FiChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentMonth(
                        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
                      )
                    }
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                  >
                    <FiChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-0.5 mb-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day) => (
                  <div key={day} className="text-center text-xs font-bold text-gray-500 py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-0.5">
                {days.map((day, idx) => {
                  if (!day) {
                    return <div key={`empty-${idx}`} />;
                  }

                  const isSelected = data.date === day.dateString;
                  const canSelect = !day.isPast;

                  return (
                    <button
                      key={day.dateString}
                      onClick={() => canSelect && onChange('date', day.dateString)}
                      disabled={!canSelect}
                      className={`aspect-square flex flex-col items-center justify-center rounded-lg border text-center transition ${!canSelect
                          ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                          : isSelected
                            ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
                            : 'border-gray-200 hover:border-gray-400 bg-white text-[#1a1a1a] cursor-pointer'
                        }`}
                    >
                      <div className="text-xs font-bold leading-tight">{day.date}</div>
                      <div className={`text-[9px] font-semibold leading-tight ${!canSelect ? 'text-gray-300' : isSelected ? 'text-gray-200' : 'text-gray-500'
                        }`}>
                        £{day.price}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Time Slots - Only show if NOT flexible */}
          {!isFlexibleDate && (
            <div
              className="bg-white rounded-2xl p-4"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
            >
              <h4 className="font-bold text-sm text-[#1a1a1a] mb-3">When should we arrive?</h4>

              <div className="space-y-2">
                {timeOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = data.timeSlot === option.value;

                  return (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${isSelected
                          ? 'border-[#1a1a1a] bg-[#F9F8F6]'
                          : 'border-gray-200 hover:border-gray-400 bg-white'
                        }`}
                    >
                      <input
                        type="radio"
                        name="timeSlot"
                        value={option.value}
                        checked={isSelected}
                        onChange={(e) => onChange('timeSlot', e.target.value)}
                        className="w-4 h-4 shrink-0"
                      />
                      <Icon size={16} className="text-gray-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[#1a1a1a]">{option.label}</p>
                        <p className="text-xs text-gray-500">{option.sub}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Helpers */}
          <div
            className="bg-white rounded-2xl p-4"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
          >
            <h4 className="font-bold text-sm text-[#1a1a1a] mb-3 flex items-center gap-2">
              <FiUser size={16} />
              Help with loading?
            </h4>

            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-gray-400 cursor-pointer transition">
                <input
                  type="radio"
                  name="helpers"
                  value="driver"
                  checked={data.helperCount === 0}
                  onChange={() => onChange('helperCount', 0)}
                  className="w-4 h-4 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#1a1a1a]">Just the driver</p>
                  <p className="text-xs text-gray-500">You'll help load</p>
                </div>
                <span className="text-xs font-semibold text-gray-600 shrink-0">-£50</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-gray-400 cursor-pointer transition">
                <input
                  type="radio"
                  name="helpers"
                  value="helper"
                  checked={data.helperCount >= 1}
                  onChange={() => onChange('helperCount', 1)}
                  className="w-4 h-4 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#1a1a1a]">Add a professional helper</p>
                  <p className="text-xs text-gray-500">Expert loader included</p>
                </div>
                <span className="text-xs font-semibold text-[#1a1a1a] shrink-0">Recommended</span>
              </label>
            </div>
          </div>
        </div>

        {/* ===== RIGHT: Map & Summary ===== */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-3">
            {/* Map */}
            <div
              className="bg-white rounded-2xl overflow-hidden"
              style={{
                isolation: 'isolate',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              }}
            >
              <MapComponent
                pickupLat={pickupLat}
                pickupLng={pickupLng}
                deliveryLat={deliveryLat}
                deliveryLng={deliveryLng}
                distance={distance}
                time="119 mins"
              />
            </div>

            {/* Estimated Price */}
            <div
              className="bg-white rounded-2xl p-4 border-2 border-[#1a1a1a]"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
            >
              <p className="text-xs text-gray-600 mb-1">Estimated price</p>
              <p className="text-3xl font-bold text-[#1a1a1a] mb-2">
                £{estimatedPrice}
              </p>
              <p className="text-xs text-gray-500">
                {distance} miles • {data.timeSlot || 'Time TBA'}
              </p>
            </div>

            {/* Info */}
            <div className="rounded-lg p-3">
              <p className="text-xs text-gray-600">
                Next step: Add any extra services you need.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}