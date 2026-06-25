import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiArrowRight, FiCheck } from 'react-icons/fi';

/* ---------- Neutral Dropdown ---------- */
function Dropdown({ label, options, value, onSelect, placeholder = 'Select floor' }) {
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

  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`w-full flex items-center px-4 py-2.5 rounded-lg border bg-white text-left transition focus:outline-none ${open ? 'border-gray-400' : 'border-gray-200 hover:border-gray-300'
            }`}
        >
          <span className="flex-1 text-sm font-medium text-[#1a1a1a]">
            {selected ? selected.label : placeholder}
          </span>
          <FiChevronDown
            size={18}
            className={`text-gray-500 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''
              }`}
          />
        </button>

        {open && (
          <ul className="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            {options.map((opt) => {
              const isSel = opt.value === value;
              return (
                <li key={String(opt.value)}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(opt.value);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm transition ${isSel ? 'bg-gray-50 text-[#1a1a1a] font-semibold' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <span className="flex-1">{opt.label}</span>
                    {isSel && <FiCheck size={16} className="text-gray-600" />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ---------- Custom Checkbox ---------- */
function Checkbox({ label, checked, onChange }) {
  return (
    <label
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 cursor-pointer select-none group"
    >
      <div
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition shrink-0 ${checked
          ? 'bg-[#1a1a1a] border-[#1a1a1a]'
          : 'bg-white border-gray-300 group-hover:border-gray-400'
          }`}
      >
        {checked && <FiCheck size={14} className="text-white" strokeWidth={3} />}
      </div>
      <span className="text-sm font-medium text-[#1a1a1a]">{label}</span>
    </label>
  );
}

/* ---------- Main Step ---------- */
export default function StepFloorParking({ data, onChange }) {
  const floorOptions = [
    { value: 'basement', label: 'Basement' },
    { value: 'ground', label: 'Ground floor' },
    { value: '1st', label: '1st floor' },
    { value: '2nd', label: '2nd floor' },
    { value: '3rd', label: '3rd floor' },
    { value: '4th+', label: '4th+ floor' },
  ];

  return (
    <div className="bg-[#F9F8F6] -mx-4 px-4 py-4">
      {/* Heading */}
      <div className="max-w-7xl mx-auto mb-3">
        <h3 className="text-xl md:text-2xl font-bold text-[#1a1a1a]">
          Tell us about access at both locations
        </h3>
        <p className="text-gray-500 text-xs mt-0.5">
          A few quick details about floor, lift and parking
        </p>
      </div>

      {/* Card */}
      <div className="max-w-7xl mx-auto">
        <div
          className="bg-white rounded-2xl p-5 md:p-6"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-5 items-start">
            {/* PICKUP */}
            <div>
              <h4 className="text-base font-bold text-[#1a1a1a] mb-3">Pickup details</h4>

              <div className="space-y-3">
                <Dropdown
                  label="Select floor"
                  options={floorOptions}
                  value={data.pickup.floorLevel}
                  onSelect={(v) => onChange('pickup', 'floorLevel', v)}
                />

                <div className="flex flex-col gap-2 pt-1">
                  <Checkbox
                    label="Lift available"
                    checked={data.pickup.hasLift}
                    onChange={(v) => onChange('pickup', 'hasLift', v)}
                  />
                  <Checkbox
                    label="Parking available"
                    checked={data.pickup.hasParking}
                    onChange={(v) => onChange('pickup', 'hasParking', v)}
                  />
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center self-stretch pt-9">
              <div className="w-9 h-9 rounded-full bg-[#F9F8F6] flex items-center justify-center">
                <FiArrowRight size={16} className="text-gray-500" />
              </div>
            </div>
            <div className="flex md:hidden items-center justify-center my-1">
              <div className="w-9 h-9 rounded-full bg-[#F9F8F6] flex items-center justify-center">
                <FiArrowRight size={16} className="text-gray-500 rotate-90" />
              </div>
            </div>

            {/* DELIVERY */}
            <div>
              <h4 className="text-base font-bold text-[#1a1a1a] mb-3">Delivery details</h4>

              <div className="space-y-3">
                <Dropdown
                  label="Select floor"
                  options={floorOptions}
                  value={data.delivery.floorLevel}
                  onSelect={(v) => onChange('delivery', 'floorLevel', v)}
                />

                <div className="flex flex-col gap-2 pt-1">
                  <Checkbox
                    label="Lift available"
                    checked={data.delivery.hasLift}
                    onChange={(v) => onChange('delivery', 'hasLift', v)}
                  />
                  <Checkbox
                    label="Parking available"
                    checked={data.delivery.hasParking}
                    onChange={(v) => onChange('delivery', 'hasParking', v)}
                  />
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-5 text-center">
            Don't worry — these quick checks help us plan a smoother move for you.
          </p>
        </div>
      </div>
    </div>
  );
}