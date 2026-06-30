import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiUser, FiX, FiCheck, FiTag } from 'react-icons/fi';

const TIME_SLOTS = [
  { value: 'early', label: '6:00 AM – 6:00 PM', badge: 'Free', badgeColor: 'bg-green-500 text-white', extra: 0 },
  { value: 'morning', label: '8:00 AM – 6:00 PM', badge: 'Free', badgeColor: 'bg-green-500 text-white', extra: 0 },
  { value: 'afternoon', label: '9:00 AM – 4:00 PM', badge: '+£10', badgeColor: 'bg-amber-400 text-[#1a1a1a]', extra: 10 },
  { value: 'flexible', label: "I'm flexible with timing", badge: 'Free', badgeColor: 'bg-green-500 text-white', extra: 0 },
];

function getDummyPrice(dateStr) {
  const day = new Date(dateStr).getDay();
  if (day === 0 || day === 6) return Math.floor(180 + (dateStr.charCodeAt(8) % 5) * 10);
  if (day === 5) return Math.floor(160 + (dateStr.charCodeAt(8) % 5) * 8);
  return Math.floor(120 + (dateStr.charCodeAt(8) % 5) * 8);
}

function getUKHour() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/London' })).getHours();
}
function getUKTodayStr() {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/London' }));
  return d.toISOString().split('T')[0];
}

export default function StepDatePrice({ data, onChange, errors, distance = 25, volume = 5000 }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [timePopup, setTimePopup] = useState(null);
  const [closing, setClosing] = useState(false);

  const isFlexible = data.dateType === 'flexible';
  const todayStr = getUKTodayStr();
  const isPast4PM = getUKHour() >= 16;

  const isDateDisabled = (dateStr) => {
    if (new Date(dateStr) < new Date(todayStr)) return true;
    if (dateStr === todayStr && isPast4PM) return true;
    return false;
  };

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDay = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const buildDays = () => {
    const firstRaw = getFirstDay(currentMonth);
    const offset = firstRaw === 0 ? 6 : firstRaw - 1;
    const total = getDaysInMonth(currentMonth);
    const days = [];
    for (let i = 0; i < offset; i++) days.push(null);
    for (let i = 1; i <= total; i++) {
      const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({ date: i, dateStr, disabled: isDateDisabled(dateStr), price: getDummyPrice(dateStr) });
    }
    return days;
  };

  const days = buildDays();
  const estimatedPrice = Math.round(distance * 2 + (volume / 1000) * 50);

  const handleDateClick = (dateStr, disabled) => {
    if (disabled) return;
    onChange('date', dateStr);
    onChange('timeSlot', '');
    setTimePopup(dateStr);
    setClosing(false);
  };

  const handleTimeSelect = (slotValue) => {
    onChange('timeSlot', slotValue);
    setClosing(true);
    setTimeout(() => { setTimePopup(null); setClosing(false); }, 380);
  };

  return (
    <div className="bg-[#F9F8F6] -mx-4 px-4 py-4">
      <div className="max-w-7xl mx-auto mb-3">
        <h3 className="text-xl md:text-2xl font-bold text-[#1a1a1a]">When should we arrive?</h3>
        <p className="text-gray-500 text-xs mt-0.5">Pick a date that works — we'll confirm the time</p>
      </div>

      {errors.date && (
        <div className="max-w-7xl mx-auto mb-3 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">{errors.date}</div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="lg:col-span-2 space-y-3">

          {/* ── Flexible option ── */}
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <label className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${isFlexible ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <input
                type="checkbox"
                checked={isFlexible}
                onChange={e => { onChange('dateType', e.target.checked ? 'flexible' : 'specific'); onChange('date', ''); onChange('timeSlot', ''); }}
                className="w-4 h-4 mt-0.5 shrink-0 accent-green-500"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-sm text-[#1a1a1a]">I'm flexible with dates</p>
                  <span className="inline-flex items-center gap-1 bg-amber-400 text-[#1a1a1a] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                    <FiTag size={9} /> Save 20%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">We'll pick the best available slot and apply a 20% discount.</p>
              </div>
            </label>
          </div>

          {/* ── Calendar ── */}
          {!isFlexible && (
            <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-sm text-[#1a1a1a]">
                  {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h4>
                <div className="flex gap-1">
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-1.5 hover:bg-gray-100 rounded-lg">
                    <FiChevronLeft size={15} />
                  </button>
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-1.5 hover:bg-gray-100 rounded-lg">
                    <FiChevronRight size={15} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 mb-1">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                  <div key={d} className="text-center text-[10px] font-bold text-gray-400 py-1">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day, idx) => {
                  if (!day) return <div key={`e${idx}`} />;
                  const isSelected = data.date === day.dateStr;
                  const isWeekend = new Date(day.dateStr).getDay() === 0 || new Date(day.dateStr).getDay() === 6;
                  return (
                    <button
                      key={day.dateStr}
                      onClick={() => handleDateClick(day.dateStr, day.disabled)}
                      disabled={day.disabled}
                      className={`relative flex flex-col items-center justify-center py-1.5 rounded-lg transition-all duration-200 border-2 ${day.disabled
                        ? 'text-gray-300 cursor-not-allowed opacity-40 border-transparent'
                        : isSelected
                          ? 'bg-white border-[#1a1a1a] shadow-sm'
                          : 'border-transparent hover:bg-gray-50 hover:border-gray-200 text-[#1a1a1a]'
                        }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                          <FiCheck size={9} className="text-white" strokeWidth={3} />
                        </div>
                      )}
                      <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-[#1a1a1a]' : ''}`}>
                        {day.date}
                      </span>
                      {!day.disabled && (
                        <span className={`text-[9px] leading-tight font-semibold ${isSelected ? 'text-gray-600' : isWeekend ? 'text-amber-500' : 'text-gray-400'
                          }`}>
                          £{day.price}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {data.date && data.timeSlot && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs text-gray-500">Selected:</span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-[#1a1a1a] bg-gray-100 px-2 py-0.5 rounded-full">
                        {new Date(data.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </span>
                      <span className="text-xs font-bold text-[#1a1a1a] bg-gray-100 px-2 py-0.5 rounded-full">
                        {TIME_SLOTS.find(s => s.value === data.timeSlot)?.label}
                      </span>
                      <button onClick={() => { onChange('date', ''); onChange('timeSlot', ''); }} className="text-gray-400 hover:text-red-500 transition">
                        <FiX size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="text-[10px] text-gray-400">Weekend higher</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  <span className="text-[10px] text-gray-400">Weekday from £120</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Helper option (checkboxes now) ── */}
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h4 className="font-bold text-sm text-[#1a1a1a] mb-3 flex items-center gap-2">
              <FiUser size={15} /> Need help with loading?
            </h4>
            <div className="space-y-2">
              <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${data.helperCount === 0 ? 'border-[#1a1a1a] bg-[#F9F8F6]' : 'border-gray-200 hover:border-gray-300'}`}>
                <div
                  onClick={() => onChange('helperCount', 0)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition ${data.helperCount === 0 ? 'bg-[#1a1a1a] border-[#1a1a1a]' : 'bg-white border-gray-300'}`}
                >
                  {data.helperCount === 0 && <FiCheck size={10} className="text-white" strokeWidth={3} />}
                </div>
                <div className="flex-1 min-w-0" onClick={() => onChange('helperCount', 0)}>
                  <p className="font-semibold text-sm text-[#1a1a1a]">Just the driver</p>
                  <p className="text-xs text-gray-500">You can sleep while we load and unload :)</p>
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full shrink-0">-£50</span>
              </label>
              <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${data.helperCount >= 1 ? 'border-[#1a1a1a] bg-[#F9F8F6]' : 'border-gray-200 hover:border-gray-300'}`}>
                <div
                  onClick={() => onChange('helperCount', 1)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition ${data.helperCount >= 1 ? 'bg-[#1a1a1a] border-[#1a1a1a]' : 'bg-white border-gray-300'}`}
                >
                  {data.helperCount >= 1 && <FiCheck size={10} className="text-white" strokeWidth={3} />}
                </div>
                <div className="flex-1 min-w-0" onClick={() => onChange('helperCount', 1)}>
                  <p className="font-semibold text-sm text-[#1a1a1a]">Add a professional helper</p>
                  <p className="text-xs text-gray-500">Expert loader handles everything</p>
                </div>
                <span className="text-xs font-semibold text-[#1a1a1a] bg-amber-100 px-2 py-0.5 rounded-full shrink-0">Recommended</span>
              </label>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Price summary (half height) ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 bg-white rounded-2xl p-3" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="text-xs font-bold text-[#1a1a1a]">Estimated Price</h4>
              <span className="text-[9px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">Estimate</span>
            </div>

            <p className="text-2xl font-black text-[#1a1a1a] leading-none mb-1">
              £{isFlexible ? Math.round(estimatedPrice * 0.8) : estimatedPrice}
            </p>

            {isFlexible && (
              <p className="text-[10px] text-green-600 font-bold mb-1.5">✓ 20% discount applied</p>
            )}

            <div className="space-y-1 text-xs pt-1.5 border-t border-gray-100 mt-1.5">
              <div className="flex justify-between">
                <span className="text-gray-400">Distance</span>
                <span className="font-semibold text-[#1a1a1a]">{distance} mi</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Time</span>
                <span className="font-semibold text-[#1a1a1a] truncate ml-2">{data.timeSlot || 'TBC'}</span>
              </div>
              {data.date && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Date</span>
                  <span className="font-semibold text-[#1a1a1a]">
                    {new Date(data.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Time Slot Popup ── */}
      {timePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className={`bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl transition-all duration-300 ${closing ? 'scale-75 opacity-0' : 'scale-100 opacity-100'}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-black text-[#1a1a1a] text-base">Choose a time slot</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(timePopup).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
              <button onClick={() => { setTimePopup(null); onChange('date', ''); }} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                <FiX size={18} />
              </button>
            </div>

            <div className="space-y-2">
              {TIME_SLOTS.map(slot => {
                const isSelected = data.timeSlot === slot.value;
                return (
                  <label
                    key={slot.value}
                    onClick={() => handleTimeSelect(slot.value)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition ${isSelected ? 'border-[#1a1a1a] bg-gray-50' : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition ${isSelected ? 'bg-[#1a1a1a] border-[#1a1a1a]' : 'border-gray-300'
                      }`}>
                      {isSelected && <FiCheck size={10} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className="flex-1 font-semibold text-sm text-[#1a1a1a]">{slot.label}</span>
                    <span className={`text-xs font-black px-2.5 py-1 rounded-full shrink-0 ${slot.badgeColor}`}>{slot.badge}</span>
                  </label>
                );
              })}
            </div>

            <p className="text-xs text-gray-400 text-center mt-4">Don't worry — we'll confirm before arrival.</p>
          </div>
        </div>
      )}
    </div>
  );
}