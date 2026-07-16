import React, { useState, useEffect } from 'react';
import { FiPlus, FiMinus, FiX, FiTruck } from 'react-icons/fi';
import api from '../../../api/api';

function ItemLoader() {
    return (
        <div className="flex flex-col items-center justify-center py-10">
            <div className="relative w-10 h-10 mb-3">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#1a1a1a] animate-spin" />
            </div>
            <p className="text-sm text-gray-400">Loading items...</p>
        </div>
    );
}

export default function StepItemSelectionVehicle({ items, onChange, error, pickup, delivery, serviceType }) {
    const [name, setName] = useState('');
    const [weight, setWeight] = useState('');
    const [notes, setNotes] = useState('');
    const [apiItems, setApiItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                const res = await api.get('/inventory/services');
                const services = res.data?.data || [];
                const matched = services.find(s => s.slug === serviceType);
                if (matched) {
                    setApiItems((matched.items || []).filter(it => !it.isPaused));
                }
            } catch (err) {
                // silent
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, [serviceType]);

    const handleAdd = () => {
        if (!name.trim()) return;
        const existing = items.find(i => i.name === name.trim());
        if (existing) {
            onChange(items.map(i => i.name === name.trim()
                ? { ...i, quantity: i.quantity + 1, weight: weight ? Number(weight) : i.weight, notes: notes.trim() || i.notes }
                : i
            ));
        } else {
            onChange([...items, { name: name.trim(), weight: weight ? Number(weight) : null, notes: notes.trim(), quantity: 1, volume: 200, custom: true }]);
        }
        setName(''); setWeight(''); setNotes('');
    };

    const handleRemove = (itemName) => {
        const ex = items.find(i => i.name === itemName);
        if (ex.quantity > 1) onChange(items.map(i => i.name === itemName ? { ...i, quantity: i.quantity - 1 } : i));
        else onChange(items.filter(i => i.name !== itemName));
    };

    const quickAdd = (partName) => setName(partName);
    const totalItems = items.reduce((s, i) => s + i.quantity, 0);

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
                        {/* Quick add from API items */}
                        {loading ? <ItemLoader /> : (
                            <>
                                <p className="text-xs text-gray-500 mb-2">Quick add from inventory:</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {apiItems.map((p) => (
                                        <button key={p._id} onClick={() => quickAdd(p.name)} className="px-3 py-1.5 text-xs font-medium border border-gray-200 hover:border-[#1a1a1a] rounded-full text-gray-700 hover:text-[#1a1a1a] transition">
                                            {p.name}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}

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

                <div className="lg:col-span-1 flex">
                    <div className="sticky top-20 w-full flex">
                        <div className="bg-white rounded-2xl p-4 flex flex-col w-full h-full" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-base font-bold text-[#1a1a1a]">Your parts</h4>
                                {totalItems > 0 && (
                                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                        {totalItems} item{totalItems !== 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>
                            {items.length > 0 ? (
                                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                                    {items.map((it) => (
                                        <div key={it.name} className="flex items-center gap-1.5 py-1.5 border-b border-gray-100 last:border-0">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-700 truncate">{it.name}</p>
                                                {(it.weight || it.notes) && (
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {it.weight ? `${it.weight} kg` : ''}
                                                        {it.weight && it.notes ? ' • ' : ''}
                                                        {it.notes}
                                                    </p>
                                                )}
                                            </div>
                                            <button onClick={() => handleRemove(it.name)} className="w-5 h-5 rounded-full border border-gray-200 hover:bg-[#1a1a1a] hover:text-white text-gray-400 transition flex items-center justify-center shrink-0"><FiMinus size={9} /></button>
                                            <span className="text-xs font-bold text-[#1a1a1a] w-4 text-center shrink-0">{it.quantity}</span>
                                            <button onClick={() => onChange(items.map(i => i.name === it.name ? { ...i, quantity: i.quantity + 1 } : i))} className="w-5 h-5 rounded-full border border-gray-200 hover:bg-[#1a1a1a] hover:text-white text-gray-400 transition flex items-center justify-center shrink-0"><FiPlus size={9} /></button>
                                            <button onClick={() => onChange(items.filter(i => i.name !== it.name))} className="text-gray-300 hover:text-red-400 transition ml-0.5 shrink-0"><FiX size={11} /></button>
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
                    </div>
                </div>
            </div>
        </div>
    );
}
