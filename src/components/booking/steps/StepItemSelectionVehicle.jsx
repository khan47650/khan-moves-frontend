import React, { useState } from 'react';
import { FiPlus, FiX, FiTruck } from 'react-icons/fi';
import MapComponent from '../MapComponent';

const COMMON_PARTS = [
    'Engine', 'Gearbox / Transmission', 'Wheels & Tyres (set)', 'Bonnet / Hood',
    'Bumper', 'Door', 'Bonnet', 'Exhaust System', 'Seat (single)', 'Dashboard',
];

export default function StepItemSelectionVehicle({ items, onChange, error, pickup, delivery }) {
    const [name, setName] = useState('');
    const [weight, setWeight] = useState('');
    const [notes, setNotes] = useState('');

    const handleAdd = () => {
        if (!name.trim()) return;
        onChange([...items, {
            name: name.trim(),
            weight: weight ? Number(weight) : null,
            notes: notes.trim(),
            quantity: 1,
            volume: 200,
            custom: true,
        }]);
        setName(''); setWeight(''); setNotes('');
    };

    const handleRemove = (idx) => onChange(items.filter((_, i) => i !== idx));
    const quickAdd = (partName) => setName(partName);

    return (
        <div className="bg-[#F9F8F6] -mx-4 px-4 py-4">
            <div className="max-w-7xl mx-auto mb-3">
                <h3 className="text-xl md:text-2xl font-bold text-[#1a1a1a]">What parts are you moving?</h3>
                <p className="text-gray-500 text-xs mt-0.5">Add each part with details so we can plan the right transport</p>
            </div>
            {error && <div className="max-w-7xl mx-auto mb-3 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">{error}</div>}

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl p-4 md:p-5" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                        {/* Quick add chips */}
                        <p className="text-xs text-gray-500 mb-2">Quick add common parts:</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {COMMON_PARTS.map((p) => (
                                <button key={p} onClick={() => quickAdd(p)} className="px-3 py-1.5 text-xs font-medium border border-gray-200 hover:border-[#1a1a1a] rounded-full text-gray-700 hover:text-[#1a1a1a] transition">
                                    {p}
                                </button>
                            ))}
                        </div>

                        {/* Form */}
                        <div className="space-y-3 border-t border-gray-100 pt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">Part name *</label>
                                <input type="text" placeholder="e.g., Engine, Door, Tyres" value={name} onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg outline-none text-sm focus:border-gray-400 transition" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Approx. weight (kg)</label>
                                    <input type="number" placeholder="e.g., 50" value={weight} onChange={(e) => setWeight(e.target.value)}
                                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg outline-none text-sm focus:border-gray-400 transition" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Notes (optional)</label>
                                    <input type="text" placeholder="e.g., Fragile, packed" value={notes} onChange={(e) => setNotes(e.target.value)}
                                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg outline-none text-sm focus:border-gray-400 transition" />
                                </div>
                            </div>
                            <button onClick={handleAdd} disabled={!name.trim()}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1a1a1a] text-white rounded-lg hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition text-sm font-semibold">
                                <FiPlus size={16} /> Add part to move
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 mt-4 text-center">Don't worry — our team will confirm details before pickup.</p>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-20 space-y-3">
                        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-base font-bold text-[#1a1a1a]">Your parts</h4>
                                {items.length > 0 && <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{items.length} item{items.length !== 1 ? 's' : ''}</span>}
                            </div>
                            {items.length > 0 ? (
                                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                                    {items.map((it, idx) => (
                                        <div key={idx} className="flex items-start justify-between gap-2 py-1.5 border-b border-gray-100 last:border-0">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-[#1a1a1a] truncate">{it.name}</p>
                                                {(it.weight || it.notes) && (
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {it.weight ? `${it.weight} kg` : ''}{it.weight && it.notes ? ' · ' : ''}{it.notes}
                                                    </p>
                                                )}
                                            </div>
                                            <button onClick={() => handleRemove(idx)} className="text-gray-400 hover:text-red-500 transition shrink-0 mt-0.5">
                                                <FiX size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <FiTruck size={28} className="text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-400 text-sm">No parts added yet</p>
                                </div>
                            )}
                        </div>
                        <div className="bg-white rounded-2xl overflow-hidden" style={{ isolation: 'isolate', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                            <MapComponent pickupLat={pickup?.lat || 52.509} pickupLng={pickup?.lng || -1.885} deliveryLat={delivery?.lat || 51.5074} deliveryLng={delivery?.lng || -0.1278} distance={99} time="119 mins" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}