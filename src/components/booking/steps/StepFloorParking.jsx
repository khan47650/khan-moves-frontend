import React, { useState, useRef, useEffect } from 'react';
import {
  FiHelpCircle,
  FiChevronDown,
  FiHome,
  FiLayers,
  FiCheckCircle,
  FiXCircle,
  FiChevronsUp,
  FiMapPin,
} from 'react-icons/fi';
import { FaParking } from 'react-icons/fa';

/* ---- Reusable premium dropdown ---- */
function Dropdown({ label, hint, questionIcon: QIcon, options, value, onSelect, accent = 'red' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const accentMap = {
    red: { border: 'border-[#C0392B]', text: 'text-[#C0392B]', bg: 'bg-red-50' },
    yellow: { border: 'border-[#F1C40F]', text: 'text-[#1a1a1a]', bg: 'bg-yellow-50' },
  };
  const a = accentMap[accent];

  const selected = options.find((o) => o.value === value) || null;
  const SelIcon = selected?.icon;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        {QIcon && <QIcon size={16} className={a.text} />}
        <label className="text-sm font-semibold text-[#1a1a1a]">{label}</label>
        {hint && (
          <FiHelpCircle size={15} className="text-gray-400 cursor-help" title={hint} />
        )}
      </div>

      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 bg-white text-left transition hover:shadow-sm focus:outline-none ${open ? a.border : 'border-gray-200 hover:border-gray-300'
            }`}
        >
          {SelIcon && <SelIcon size={18} className={`shrink-0 ${a.text}`} />}
          <span className="grow font-semibold text-sm text-[#1a1a1a]">
            {selected ? selected.label : 'Select…'}
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
                <li key={String(opt.value)}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(opt.value);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-semibold transition ${isSel ? `${a.bg} ${a.text}` : 'text-[#1a1a1a] hover:bg-gray-50'
                      }`}
                  >
                    {Icon && (
                      <Icon size={18} className={`shrink-0 ${isSel ? a.text : 'text-gray-400'}`} />
                    )}
                    <span className="grow">{opt.label}</span>
                    {isSel && <FiCheckCircle size={16} className={`shrink-0 ${a.text}`} />}
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

/* ---- Step ---- */
export default function StepFloorParking({ data, onChange }) {
  const floorOptions = [
    { value: 'ground', label: 'Ground Floor', icon: FiHome },
    { value: '1st', label: '1st Floor', icon: FiLayers },
    { value: '2nd', label: '2nd Floor', icon: FiLayers },
    { value: '3rd', label: '3rd+ Floor', icon: FiLayers },
  ];

  const liftOptions = [
    { value: true, label: 'Yes, there is a lift', icon: FiCheckCircle },
    { value: false, label: 'No lift available', icon: FiXCircle },
  ];

  const parkingOptions = [
    { value: true, label: 'Yes, parking available', icon: FiCheckCircle },
    { value: false, label: 'No parking nearby', icon: FiXCircle },
  ];

  const sides = [
    {
      key: 'pickup',
      title: 'Pickup Location',
      accent: 'red',
      titleClass: 'text-[#C0392B]',
      strip: 'border-t-[#C0392B]',
      parkingHint: 'Close parking where we can load the van',
    },
    {
      key: 'delivery',
      title: 'Delivery Location',
      accent: 'yellow',
      titleClass: 'text-[#F1C40F]',
      strip: 'border-t-[#F1C40F]',
      parkingHint: 'Close parking where we can unload the van',
    },
  ];

  return (
    <div>
      <h3 className="text-xl font-bold text-[#1a1a1a] mb-8">
        Help us understand access at both locations
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sides.map((side) => (
          <div
            key={side.key}
            className={`rounded-xl border-2 border-gray-100 border-t-4 ${side.strip} p-5 bg-white`}
          >
            <div className="flex items-center gap-2 mb-6">
              <FiMapPin size={20} className={side.titleClass} />
              <h4 className={`text-lg font-semibold ${side.titleClass}`}>{side.title}</h4>
            </div>

            <Dropdown
              label="Which floor?"
              questionIcon={FiLayers}
              options={floorOptions}
              value={data[side.key].floorLevel}
              onSelect={(v) => onChange(side.key, 'floorLevel', v)}
              accent={side.accent}
            />

            <Dropdown
              label="Is there a lift?"
              questionIcon={FiChevronsUp}
              options={liftOptions}
              value={data[side.key].hasLift}
              onSelect={(v) => onChange(side.key, 'hasLift', v)}
              accent={side.accent}
            />

            <Dropdown
              label="Parking available?"
              hint={side.parkingHint}
              questionIcon={FaParking}
              options={parkingOptions}
              value={data[side.key].hasParking}
              onSelect={(v) => onChange(side.key, 'hasParking', v)}
              accent={side.accent}
            />
          </div>
        ))}
      </div>

      <div className="mt-10 p-4 bg-amber-50 border-l-4 border-amber-400 rounded">
        <p className="text-sm text-amber-800">
          ℹ️ <strong>Note:</strong> Floor level, lift availability, and parking affect pricing.
          Higher floors and lack of parking may increase the cost.
        </p>
      </div>
    </div>
  );
}