import React, { useState, useRef, useEffect } from 'react';
import {
  FiChevronLeft, FiChevronRight, FiUser, FiX,
  FiCheck, FiTag, FiCalendar, FiNavigation
} from 'react-icons/fi';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

// ── Inline map for right panel ────────────────────────────────────────────────
function MiniMap({ pickupLat, pickupLng, deliveryLat, deliveryLng, distance }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [coords, setCoords] = useState([]);

  const pickupIcon = L.divIcon({
    html: `<div style="background:#C0392B;width:24px;height:24px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)"><span style="transform:rotate(45deg);font-size:10px;line-height:1">🚛</span></div>`,
    className: '', iconSize: [24, 24], iconAnchor: [12, 24],
  });
  const deliveryIcon = L.divIcon({
    html: `<div style="background:#27AE60;width:24px;height:24px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)"><span style="transform:rotate(45deg);font-size:10px;line-height:1">🏠</span></div>`,
    className: '', iconSize: [24, 24], iconAnchor: [12, 24],
  });

  useEffect(() => {
    if (!pickupLat || !deliveryLat) return;
    fetch(`https://router.project-osrm.org/route/v1/driving/${pickupLng},${pickupLat};${deliveryLng},${deliveryLat}?overview=full&geometries=geojson`)
      .then(r => r.json())
      .then(json => { if (json.routes?.[0]) setCoords(json.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng])); })
      .catch(() => { });
  }, [pickupLat, deliveryLat]);

  useEffect(() => {
    if (!pickupLat || !deliveryLat || !mapRef.current) return;
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, { zoomControl: false, scrollWheelZoom: false })
        .setView([(pickupLat + deliveryLat) / 2, (pickupLng + deliveryLng) / 2], 9);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OSM', maxZoom: 19 }).addTo(mapInstance.current);
    }
    const map = mapInstance.current;
    map.eachLayer(l => { if (l instanceof L.Marker || l instanceof L.Polyline) map.removeLayer(l); });
    L.marker([pickupLat, pickupLng], { icon: pickupIcon }).addTo(map);
    L.marker([deliveryLat, deliveryLng], { icon: deliveryIcon }).addTo(map);
    if (coords.length > 0) L.polyline(coords, { color: '#2980B9', weight: 4, opacity: 0.85 }).addTo(map);
    else L.polyline([[pickupLat, pickupLng], [deliveryLat, deliveryLng]], { color: '#2980B9', weight: 3, dashArray: '6,5', opacity: 0.7 }).addTo(map);
    map.fitBounds(L.latLngBounds([[pickupLat, pickupLng], [deliveryLat, deliveryLng]]), { padding: [20, 20] });
  }, [pickupLat, pickupLng, deliveryLat, deliveryLng, coords]);

  return (
    <div className="rounded-xl overflow-hidden border border-gray-100" style={{ isolation: 'isolate' }}>
      <div ref={mapRef} style={{ height: '160px', width: '100%' }} className="bg-gray-100" />
      {distance > 0 && (
        <div className="bg-[#F9F8F6] px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <FiNavigation size={12} className="text-[#C0392B]" />
            <span className="text-xs text-gray-500">Driving distance</span>
          </div>
          <span className="text-xs font-black text-[#C0392B]">{distance} miles</span>
        </div>
      )}
    </div>
  );
}

// ── Datepicker popup ──────────────────────────────────────────────────────────
function DatePickerPopup({ onClose, onSelect, todayStr, isPast4PM }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const isDateDisabled = (dateStr) => {
    if (new Date(dateStr) < new Date(todayStr)) return true;
    if (dateStr === todayStr && isPast4PM) return true;
    return false;
  };

  const getDaysInMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const getFirstDay = (d) => new Date(d.getFullYear(), d.getMonth(), 1).getDay();

  const buildDays = () => {
    const offset = getFirstDay(currentMonth) === 0 ? 6 : getFirstDay(currentMonth) - 1;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
              <FiChevronLeft size={15} />
            </button>
            <h4 className="font-bold text-sm text-[#1a1a1a] w-32 text-center">
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h4>
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
              <FiChevronRight size={15} />
            </button>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
            <FiX size={16} />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
            <div key={i} className="text-center text-[9px] font-bold text-gray-400 py-0.5">{d}</div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-0.5">
          {days.map((day, idx) => {
            if (!day) return <div key={`e${idx}`} />;
            const isWeekend = new Date(day.dateStr).getDay() === 0 || new Date(day.dateStr).getDay() === 6;
            return (
              <button key={day.dateStr}
                onClick={() => !day.disabled && onSelect(day.dateStr)}
                disabled={day.disabled}
                className={`flex flex-col items-center justify-center py-2 rounded-lg transition-all duration-150 ${day.disabled
                  ? 'opacity-25 cursor-not-allowed'
                  : 'hover:bg-green-50 hover:text-green-700 text-[#1a1a1a] cursor-pointer'
                  }`}
              >
                <span className="text-xs font-bold leading-tight">{day.date}</span>
                {!day.disabled && (
                  <span className={`text-[8px] leading-tight font-semibold ${isWeekend ? 'text-amber-500' : 'text-gray-400'}`}>
                    £{day.price}
                  </span>
                )}
              </button>
            );
          })}
        </div>

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
    </div>
  );
}

export default function StepDatePrice({ data, onChange, errors, distance = 25, volume = 5000, pickupLat, pickupLng, deliveryLat, deliveryLng }) {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [timePopup, setTimePopup] = useState(null);
  const [closing, setClosing] = useState(false);

  const isFlexible = data.dateType === 'flexible';
  const isFixed = data.dateType === 'specific';
  const todayStr = getUKTodayStr();
  const isPast4PM = getUKHour() >= 16;

  const estimatedPrice = Math.round(distance * 2 + (volume / 1000) * 50);
  const hasCoords = pickupLat && deliveryLat;

  const handleDateSelected = (dateStr) => {
    onChange('date', dateStr);
    onChange('timeSlot', '');
    setDatePickerOpen(false);
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
        <p className="text-gray-500 text-xs mt-0.5">Pick a date — we'll confirm the time</p>
      </div>

      {errors.date && (
        <div className="max-w-7xl mx-auto mb-3 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">{errors.date}</div>
      )}

      {/* ── AnyVan-style layout: narrow left | wider right ── */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 items-start">

        {/* ── LEFT: narrow like AnyVan ── */}
        <div className="w-full lg:w-96 shrink-0 space-y-3">

          {/* Date selector card */}
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <p className="text-sm font-bold text-[#1a1a1a] mb-3">Estimated move date</p>

            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(o => !o)}
                className="w-full flex items-center rounded-xl border border-gray-200 bg-white hover:border-gray-400 transition text-left"
              >
                <div className="flex-1 px-4 py-2.5 text-sm">
                  {isFlexible
                    ? <span className="text-green-600 font-semibold">I'm Flexible with Dates</span>
                    : isFixed && data.date
                      ? <span className="font-semibold text-[#1a1a1a]">{new Date(data.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      : <span className="text-gray-400">Select move date</span>
                  }
                </div>
                <div className="px-3 border-l border-gray-200 bg-gray-50 self-stretch flex items-center justify-center">
                  <FiCalendar size={15} className="text-gray-500" />
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-30 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => {
                      onChange('dateType', 'specific');
                      onChange('date', '');
                      onChange('timeSlot', '');
                      setDropdownOpen(false);
                      setDatePickerOpen(true);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-[#1a1a1a] hover:bg-gray-50 transition border-b border-gray-100"
                  >
                    On a Fixed Date
                    <FiChevronRight size={14} className="text-gray-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onChange('dateType', 'flexible');
                      onChange('date', '');
                      onChange('timeSlot', '');
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-[#1a1a1a] hover:bg-gray-50 transition"
                  >
                    I'm Flexible with Dates
                    <span className="text-[10px] font-black bg-amber-400 text-[#1a1a1a] px-2 py-0.5 rounded-full">Save 20%</span>
                  </button>
                </div>
              )}
            </div>

            {isFlexible && (
              <div className="mt-3 flex items-start gap-2.5 p-3 rounded-xl bg-green-50 border border-green-200">
                <span className="inline-flex items-center gap-1 bg-amber-400 text-[#1a1a1a] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0 mt-0.5">
                  <FiTag size={8} /> Save 20%
                </span>
                <p className="text-xs text-green-700 font-medium leading-snug">We'll pick the best available slot and apply a 20% discount to your booking.</p>
              </div>
            )}

            {isFixed && data.date && data.timeSlot && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-gray-400">Selected:</span>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    {new Date(data.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </span>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    {TIME_SLOTS.find(s => s.value === data.timeSlot)?.label}
                  </span>
                </div>
                <button onClick={() => { onChange('date', ''); onChange('timeSlot', ''); onChange('dateType', ''); }}
                  className="text-gray-400 hover:text-red-500 transition shrink-0">
                  <FiX size={12} />
                </button>
              </div>
            )}
          </div>

          {/* Helper card */}
          <div className="bg-white rounded-2xl p-3" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h4 className="font-bold text-sm text-[#1a1a1a] mb-2 flex items-center gap-2">
              <FiUser size={14} /> Help with loading?
            </h4>
            <div className="space-y-1.5">
              <label className={`flex items-center gap-3 p-2.5 rounded-xl border-2 cursor-pointer transition ${data.helperCount === 0 ? 'border-[#1a1a1a] bg-[#F9F8F6]' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="helpers" checked={data.helperCount === 0} onChange={() => onChange('helperCount', 0)} className="w-4 h-4" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#1a1a1a]">Just the driver</p>
                  <p className="text-xs text-gray-500">You can sleep while we load and unload :)</p>
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full shrink-0">-£50</span>
              </label>
              <label className={`flex items-center gap-3 p-2.5 rounded-xl border-2 cursor-pointer transition ${data.helperCount >= 1 ? 'border-[#1a1a1a] bg-[#F9F8F6]' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="helpers" checked={data.helperCount >= 1} onChange={() => onChange('helperCount', 1)} className="w-4 h-4" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#1a1a1a]">Add a professional helper</p>
                  <p className="text-xs text-gray-500">Expert loader handles everything</p>
                </div>
                <span className="text-xs font-semibold text-[#1a1a1a] bg-amber-100 px-2 py-0.5 rounded-full shrink-0">Recommended</span>
              </label>
            </div>
          </div>
        </div>

        {/* ── RIGHT: price card + map ── */}
        <div className="flex-1 min-w-0 lg:sticky lg:top-20 space-y-3">

          {/* Price card */}
          <div className="bg-white rounded-2xl p-4 border-2 border-[#1a1a1a]" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <p className="text-xs text-gray-500 mb-1">Estimated price</p>
            <p className="text-3xl font-black text-[#1a1a1a] mb-1">
              £{isFlexible ? Math.round(estimatedPrice * 0.8) : estimatedPrice}
            </p>
            {isFlexible && <p className="text-xs text-green-600 font-bold mb-2">20% discount applied!</p>}
            <p className="text-xs text-gray-500">{distance} miles</p>
            {data.timeSlot && data.timeSlot !== 'flexible' && (
              <p className="text-xs font-semibold text-[#1a1a1a] mt-1">{TIME_SLOTS.find(s => s.value === data.timeSlot)?.label}</p>
            )}
            {data.date && (
              <p className="text-xs text-gray-500 mt-0.5">
                {new Date(data.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · £{getDummyPrice(data.date)} base
              </p>
            )}
            <div className="mt-3 pt-3 border-t border-gray-100 flex gap-4">
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

          {/* Map */}
          {hasCoords && (
            <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <MiniMap
                pickupLat={pickupLat} pickupLng={pickupLng}
                deliveryLat={deliveryLat} deliveryLng={deliveryLng}
                distance={distance}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Date picker popup ── */}
      {datePickerOpen && (
        <DatePickerPopup
          onClose={() => setDatePickerOpen(false)}
          onSelect={handleDateSelected}
          todayStr={todayStr}
          isPast4PM={isPast4PM}
        />
      )}

      {/* ── Time slot popup ── */}
      {timePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className={`bg-white rounded-2xl p-5 w-full max-w-xs shadow-2xl transition-all duration-300 ${closing ? 'scale-75 opacity-0' : 'scale-100 opacity-100'}`}>
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-black text-[#1a1a1a] text-sm">Choose a time slot</h4>
              <button onClick={() => { setTimePopup(null); onChange('date', ''); }} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                <FiX size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              {new Date(timePopup).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <div className="space-y-2">
              {TIME_SLOTS.map(slot => {
                const isSelected = data.timeSlot === slot.value;
                return (
                  <label key={slot.value} onClick={() => handleTimeSelect(slot.value)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300 hover:bg-green-50'}`}>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition ${isSelected ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                      {isSelected && <FiCheck size={10} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className="flex-1 text-sm font-semibold text-[#1a1a1a]">{slot.label}</span>
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