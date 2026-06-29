import React, { useState, useEffect, useRef } from 'react';
import { FiArrowRight, FiLoader, FiNavigation, FiCheck, FiLayers } from 'react-icons/fi';
import { FaChevronDown } from 'react-icons/fa';
import PostCodeInput from '../../PostCodeInput';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const FLOOR_OPTIONS = [
  { value: 'basement', label: 'Basement' },
  { value: 'ground', label: 'Ground floor' },
  { value: '1st', label: '1st floor' },
  { value: '2nd', label: '2nd floor' },
  { value: '3rd', label: '3rd floor' },
  { value: '4th+', label: '4th+ floor' },
];

function FloorDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const selected = FLOOR_OPTIONS.find(o => o.value === value) || FLOOR_OPTIONS[1];
  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm font-medium text-[#1a1a1a] hover:border-gray-400 transition" style={{ height: '38px' }}>
        <span className="flex items-center gap-2">
          <FiLayers size={13} className="text-gray-400" />
          {selected.label}
        </span>
        <FaChevronDown size={10} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {FLOOR_OPTIONS.map(opt => (
            <li key={opt.value}>
              <button type="button" onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left transition ${value === opt.value ? 'bg-gray-50 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
                {opt.label}
                {value === opt.value && <FiCheck size={11} className="text-green-600" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none group" onClick={() => onChange(!checked)}>
      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition shrink-0 ${checked ? 'bg-[#1a1a1a] border-[#1a1a1a]' : 'bg-white border-gray-300 group-hover:border-gray-400'}`}>
        {checked && <FiCheck size={9} className="text-white" strokeWidth={3} />}
      </div>
      <span className="text-sm text-gray-600">{label}</span>
    </label>
  );
}

function RouteMap({ pickupLat, pickupLng, deliveryLat, deliveryLng, distance, time, routeCoords }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  const pickupIcon = L.divIcon({
    html: `<div style="background:#C0392B;width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35)"><span style="transform:rotate(45deg);font-size:13px;line-height:1">🚛</span></div>`,
    className: '', iconSize: [30, 30], iconAnchor: [15, 30],
  });
  const deliveryIcon = L.divIcon({
    html: `<div style="background:#27AE60;width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35)"><span style="transform:rotate(45deg);font-size:13px;line-height:1">🏠</span></div>`,
    className: '', iconSize: [30, 30], iconAnchor: [15, 30],
  });

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
    if (routeCoords && routeCoords.length > 0) {
      L.polyline(routeCoords, { color: '#2980B9', weight: 5, opacity: 0.85 }).addTo(map);
    } else {
      L.polyline([[pickupLat, pickupLng], [deliveryLat, deliveryLng]], { color: '#2980B9', weight: 4, dashArray: '8,6', opacity: 0.7 }).addTo(map);
    }
    map.fitBounds(L.latLngBounds([[pickupLat, pickupLng], [deliveryLat, deliveryLng]]), { padding: [30, 30] });
  }, [pickupLat, pickupLng, deliveryLat, deliveryLng, routeCoords]);

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100" style={{ isolation: 'isolate', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      <div ref={mapRef} style={{ height: '220px', width: '100%' }} className="bg-gray-100" />
      <div className="bg-white px-3 py-2.5 flex items-center justify-between border-t border-gray-100 shrink-0">
        <div className="flex items-center gap-1.5">
          <FiNavigation size={13} className="text-[#C0392B]" />
          <span className="text-xs text-gray-500">Driving distance</span>
        </div>
        <div>
          <span className="font-black text-[#C0392B]">{distance} mi</span>
          {time && <span className="text-xs text-gray-400 ml-2">· {time}</span>}
        </div>
      </div>
    </div>
  );
}

function LocationCard({ title, dotColor, data, postcodeError, onAddressChange, onResolved, floorValue, onFloorChange, hasLift, onLiftChange, hasParking, onParkingChange }) {
  const isGround = floorValue === 'ground' || floorValue === 'basement';
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: dotColor }} />
        <span className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">{title}</span>
      </div>

      <div className="mb-2">
        <input type="text" placeholder="Full address"
          value={data.address} onChange={e => onAddressChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400 transition placeholder:text-gray-400"
          style={{ height: '38px' }} />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <PostCodeInput label="" value={data.postcode} onChange={() => { }}
          onResolved={onResolved} placeholder="Postcode" error={postcodeError} />
        <FloorDropdown value={floorValue} onChange={onFloorChange} />
      </div>

      <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
        {!isGround && <Checkbox label="Lift available" checked={hasLift} onChange={onLiftChange} />}
        <Checkbox label="Parking" checked={hasParking} onChange={onParkingChange} />
      </div>
    </div>
  );
}

export default function StepLocation({ data, onChange, errors }) {
  const [distance, setDistance] = useState(null);
  const [time, setTime] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [routeCoords, setRouteCoords] = useState([]);

  useEffect(() => {
    const { lat: pLat, lng: pLng } = data.pickup;
    const { lat: dLat, lng: dLng } = data.delivery;
    if (!pLat || !pLng || !dLat || !dLng) return;
    setCalculating(true);
    fetch(`https://router.project-osrm.org/route/v1/driving/${pLng},${pLat};${dLng},${dLat}?overview=full&geometries=geojson`)
      .then(r => r.json())
      .then(json => {
        if (json.routes?.[0]) {
          const route = json.routes[0];
          const miles = Math.round(route.distance * 0.000621371);
          const mins = Math.round(route.duration / 60);
          setDistance(miles); setTime(`${mins} mins`);
          onChange('distance', miles);
          setRouteCoords(route.geometry.coordinates.map(([lng, lat]) => [lat, lng]));
        }
      })
      .catch(() => {
        const R = 3959;
        const dLat2 = (dLat - pLat) * Math.PI / 180, dLon2 = (dLng - pLng) * Math.PI / 180;
        const a = Math.sin(dLat2 / 2) ** 2 + Math.cos(pLat * Math.PI / 180) * Math.cos(dLat * Math.PI / 180) * Math.sin(dLon2 / 2) ** 2;
        const d = Math.round(2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
        setDistance(d); setTime(`${Math.round(d / 0.5)} mins`); onChange('distance', d);
      })
      .finally(() => setCalculating(false));
  }, [data.pickup.lat, data.delivery.lat]);

  const bothReady = data.pickup.lat && data.delivery.lat;

  return (
    <div className="bg-[#F9F8F6] -mx-4 px-4 py-4">
      <div className="max-w-7xl mx-auto mb-3">
        <h3 className="text-xl md:text-2xl font-bold text-[#1a1a1a]">Where are you moving from and to?</h3>
        <p className="text-gray-500 text-xs mt-0.5">Enter address, postcode and access details</p>
      </div>

      {/* ── Outer row: [locations card LEFT] [map card RIGHT] ── */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-stretch">

        {/* LEFT: locations card — pickup + arrow + delivery */}
        <div className="flex-1 min-w-0 bg-white rounded-2xl p-4 md:p-5" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div className="flex flex-col sm:flex-row gap-4">

            <LocationCard
              title="Pickup" dotColor="#C0392B"
              data={data.pickup} postcodeError={errors.pickupPostcode}
              onAddressChange={addr => onChange('pickup', { ...data.pickup, address: addr })}
              onResolved={d => onChange('pickup', { ...data.pickup, postcode: d.postcode, town: d.district, region: d.region, lat: d.lat, lng: d.lng })}
              floorValue={data.pickupFloor?.floorLevel || 'ground'}
              onFloorChange={v => onChange('pickupFloor', { ...data.pickupFloor, floorLevel: v })}
              hasLift={data.pickupFloor?.hasLift ?? true}
              onLiftChange={v => onChange('pickupFloor', { ...data.pickupFloor, hasLift: v })}
              hasParking={data.pickupFloor?.hasParking ?? true}
              onParkingChange={v => onChange('pickupFloor', { ...data.pickupFloor, hasParking: v })}
            />

            {/* Arrow divider */}
            <div className="hidden sm:flex flex-col items-center justify-center shrink-0">
              <div className="w-px flex-1 bg-gray-100" />
              <div className="w-7 h-7 rounded-full bg-[#F9F8F6] border border-gray-200 flex items-center justify-center my-2 shrink-0">
                <FiArrowRight size={12} className="text-gray-400" />
              </div>
              <div className="w-px flex-1 bg-gray-100" />
            </div>
            <div className="sm:hidden flex justify-center">
              <div className="w-7 h-7 rounded-full bg-[#F9F8F6] border border-gray-200 flex items-center justify-center">
                <FiArrowRight size={12} className="text-gray-400 rotate-90" />
              </div>
            </div>

            <LocationCard
              title="Delivery" dotColor="#27AE60"
              data={data.delivery} postcodeError={errors.deliveryPostcode}
              onAddressChange={addr => onChange('delivery', { ...data.delivery, address: addr })}
              onResolved={d => onChange('delivery', { ...data.delivery, postcode: d.postcode, town: d.district, region: d.region, lat: d.lat, lng: d.lng })}
              floorValue={data.deliveryFloor?.floorLevel || 'ground'}
              onFloorChange={v => onChange('deliveryFloor', { ...data.deliveryFloor, floorLevel: v })}
              hasLift={data.deliveryFloor?.hasLift ?? true}
              onLiftChange={v => onChange('deliveryFloor', { ...data.deliveryFloor, hasLift: v })}
              hasParking={data.deliveryFloor?.hasParking ?? true}
              onParkingChange={v => onChange('deliveryFloor', { ...data.deliveryFloor, hasParking: v })}
            />
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">Don't worry — you can change these later if needed.</p>
        </div>

        {/* RIGHT: map card — separate, same height as locations card */}
        <div className="w-full md:w-72 lg:w-80 shrink-0" style={{ minHeight: '220px' }}>
          {calculating ? (
            <div className="h-full bg-white rounded-2xl flex flex-col items-center justify-center gap-2" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)', minHeight: '220px' }}>
              <FiLoader size={20} className="text-gray-400 animate-spin" />
              <span className="text-xs text-gray-400">Calculating route…</span>
            </div>
          ) : bothReady ? (
            <RouteMap
              pickupLat={data.pickup.lat} pickupLng={data.pickup.lng}
              deliveryLat={data.delivery.lat} deliveryLng={data.delivery.lng}
              distance={distance} time={time} routeCoords={routeCoords}
            />
          ) : (
            <div className="h-full bg-white rounded-2xl flex flex-col items-center justify-center gap-2 p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)', minHeight: '220px' }}>
              <FiNavigation size={24} className="text-gray-300" />
              <p className="text-xs text-gray-400 text-center">Enter both postcodes<br />to see your route</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}