import React, { useState, useRef, useEffect } from 'react';
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiMail,
  FiPhone,
  FiChevronDown,
  FiSunrise,
  FiSun,
  FiCheckCircle,
  FiMessageSquare,
  FiInfo,
} from 'react-icons/fi';

/* ---- Reusable dropdown (time slot) ---- */
function Dropdown({ options, value, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find((o) => o.value === value) || null;
  const SelIcon = selected?.icon;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 bg-white text-left transition hover:shadow-sm focus:outline-none ${open ? 'border-[#C0392B]' : 'border-gray-200 hover:border-gray-300'
          }`}
      >
        {SelIcon && <SelIcon size={20} className="text-[#C0392B] shrink-0" />}
        <span className="grow">
          <span className="block font-semibold text-sm text-[#1a1a1a]">
            {selected ? selected.label : 'Select a time'}
          </span>
          {selected?.sub && (
            <span className="block text-xs text-gray-500">{selected.sub}</span>
          )}
        </span>
        <FiChevronDown
          size={18}
          className={`text-gray-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''
            }`}
        />
      </button>

      {open && (
        <ul className="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSel = opt.value === value;
            return (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition ${isSel ? 'bg-red-50' : 'hover:bg-gray-50'
                    }`}
                >
                  <Icon size={18} className={`shrink-0 ${isSel ? 'text-[#C0392B]' : 'text-gray-400'}`} />
                  <span className="grow">
                    <span className={`block font-semibold text-sm ${isSel ? 'text-[#C0392B]' : 'text-[#1a1a1a]'}`}>
                      {opt.label}
                    </span>
                    {opt.sub && <span className="block text-xs text-gray-500">{opt.sub}</span>}
                  </span>
                  {isSel && <FiCheckCircle size={16} className="text-[#C0392B] shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ---- Step ---- */
export default function StepDatePrice({ data, onChange, errors }) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const isWeekend = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay();
    return day === 5 || day === 6 || day === 0; // Fri, Sat, Sun
  };

  const timeOptions = [
    { value: 'morning', label: 'Morning', sub: '08:00 - 12:00', icon: FiSunrise },
    { value: 'afternoon', label: 'Afternoon', sub: '12:00 - 17:00', icon: FiSun },
    { value: 'flexible', label: 'Flexible', sub: "We'll confirm the best slot", icon: FiClock },
  ];

  return (
    <div>
      <h3 className="text-xl font-bold text-[#1a1a1a] mb-8">When & Who?</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* LEFT: Date & Time */}
        <div className="rounded-xl border-2 border-gray-100 border-t-4 border-t-[#C0392B] p-5 bg-white">
          <h4 className="font-semibold text-[#C0392B] mb-6">Moving Date &amp; Time</h4>

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
              onChange={(e) => onChange('date', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C0392B] focus:border-transparent ${errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
            {data.date && isWeekend(data.date) && (
              <p className="text-amber-600 text-sm mt-2 flex items-center gap-1">
                <FiInfo size={14} /> Weekends are busier — we recommend booking early.
              </p>
            )}
          </div>

          {/* Time Slot dropdown */}
          <div>
            <label className="text-sm font-semibold text-[#1a1a1a] mb-2 flex items-center gap-2">
              <FiClock size={16} className="text-[#C0392B]" />
              Preferred time
            </label>
            <Dropdown
              options={timeOptions}
              value={data.timeSlot}
              onSelect={(v) => onChange('timeSlot', v)}
            />
          </div>
        </div>

        {/* RIGHT: Customer Details */}
        <div className="rounded-xl border-2 border-gray-100 border-t-4 border-t-[#F1C40F] p-5 bg-white">
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
            <label className="text-sm font-semibold text-[#1a1a1a] mb-2 flex items-center gap-2">
              <FiMessageSquare size={16} className="text-[#F1C40F]" />
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

      {/* Info note */}
      <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded flex items-start gap-2">
        <FiInfo size={18} className="text-blue-500 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-800">
          <strong>What happens next?</strong> Once you submit, our team will review your move
          details and email you a personalised quote shortly — no payment needed now.
        </p>
      </div>

      {/* Terms Agreement */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" className="mt-1 w-4 h-4 text-[#C0392B]" required />
          <span className="text-sm text-gray-700">
            I agree to Khan Moves'{' '}
            <a href="/terms" className="text-[#C0392B] font-semibold hover:underline">
              Terms &amp; Conditions
            </a>{' '}
            and{' '}
            <a href="#privacy" className="text-[#C0392B] font-semibold hover:underline">
              Privacy Policy
            </a>
          </span>
        </label>
      </div>
    </div>
  );
}