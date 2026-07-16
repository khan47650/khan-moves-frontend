import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiMinus, FiX } from 'react-icons/fi';
import api from '../../../api/api';

const UNIT_OPTIONS_DIM = ['cm', 'm', 'in', 'ft', 'mm'];
const UNIT_OPTIONS_WEIGHT = ['kg', 'lbs'];

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

export default function StepItemSelectionFurniture({ items, onChange, error, serviceType }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showCustomModal, setShowCustomModal] = useState(false);
    const [custom, setCustom] = useState({ name: '', length: '', width: '', height: '', dimUnit: 'cm', weight: '', weightUnit: 'kg' });
    const [apiItems, setApiItems] = useState([]);
    const [loadingItems, setLoadingItems] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            setLoadingItems(true);
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
                setLoadingItems(false);
            }
        };
        fetchItems();
    }, [serviceType]);

    const handleAdd = it => {
        const ex = items.find(i => i.name === it.name);
        if (ex) onChange(items.map(i => i.name === it.name ? { ...i, quantity: i.quantity + 1 } : i));
        else onChange([...items, { name: it.name, volume: it.volume, quantity: 1 }]);
    };

    const handleRemove = name => {
        const ex = items.find(i => i.name === name);
        if (ex && ex.quantity > 1) onChange(items.map(i => i.name === name ? { ...i, quantity: i.quantity - 1 } : i));
        else onChange(items.filter(i => i.name !== name));
    };

    const handleAddCustom = () => {
        if (!custom.name.trim()) return;
        handleAdd({ name: custom.name.trim(), volume: 100, custom: true, dimensions: custom });
        setCustom({ name: '', length: '', width: '', height: '', dimUnit: 'cm', weight: '', weightUnit: 'kg' });
        setShowCustomModal(false);
    };

    const searchResults = searchQuery ? apiItems.filter(it => it.name.toLowerCase().includes(searchQuery.toLowerCase())) : [];
    const totalItems = items.reduce((s, i) => s + i.quantity, 0);

    return (
        <div className="bg-[#F9F8F6] -mx-4 px-4 py-4">
            <div className="max-w-7xl mx-auto mb-3">
                <h3 className="text-xl md:text-2xl font-bold text-[#1a1a1a]">What are you moving?</h3>
                <p className="text-gray-500 text-xs mt-0.5">Search or pick from categories — add as many as you need.</p>
            </div>
            {error && <div className="max-w-7xl mx-auto mb-3 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">{error}</div>}

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 lg:items-stretch">

                {/* Left: search + items */}
                <div className="flex-1">
                    <div className="bg-white rounded-2xl p-4 md:p-5 h-full" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                        <div className="relative mb-3">
                            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                            <input type="text" placeholder="Search items e.g. Sofa, Bed…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400 transition" />
                        </div>

                        {loadingItems ? <ItemLoader /> : searchQuery ? (
                            <div className="max-h-72 overflow-y-auto">
                                {searchResults.length > 0 ? searchResults.map((it, idx) => {
                                    const count = items.find(i => i.name === it.name)?.quantity || 0;
                                    return (
                                        <div key={it._id || idx} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                                            <div className="flex-1 pr-3 cursor-pointer" onClick={() => handleAdd(it)}>
                                                <p className="text-sm font-medium text-[#1a1a1a]">{it.name}</p>
                                                <p className="text-xs text-gray-400">{it.volume} m³</p>
                                            </div>
                                            {count === 0 ? (
                                                <button onClick={() => handleAdd(it)} className="w-8 h-8 rounded-full border border-gray-300 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white text-gray-500 transition flex items-center justify-center"><FiPlus size={16} /></button>
                                            ) : (
                                                <div className="flex items-center gap-1.5">
                                                    <button onClick={() => handleRemove(it.name)} className="w-7 h-7 rounded-full border border-gray-300 hover:bg-[#1a1a1a] hover:text-white text-gray-600 transition flex items-center justify-center"><FiMinus size={14} /></button>
                                                    <span className="w-6 text-center text-sm font-semibold">{count}</span>
                                                    <button onClick={() => handleAdd(it)} className="w-7 h-7 rounded-full border border-gray-300 hover:bg-[#1a1a1a] hover:text-white text-gray-600 transition flex items-center justify-center"><FiPlus size={14} /></button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }) : (
                                    <div className="text-center py-6">
                                        <p className="text-gray-400 text-sm mb-3">No items found for "{searchQuery}"</p>
                                        <button onClick={() => { setCustom(c => ({ ...c, name: searchQuery })); setShowCustomModal(true); }}
                                            className="text-sm font-semibold text-[#1a1a1a] underline">+ Add "{searchQuery}" as custom item</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="max-h-72 overflow-y-auto pr-1">
                                    {apiItems.map((it, idx) => {
                                        const count = items.find(i => i.name === it.name)?.quantity || 0;
                                        return (
                                            <div key={it._id || idx} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                                                <div className="flex-1 pr-3">
                                                    <p className="text-sm font-medium text-[#1a1a1a]">{it.name}</p>
                                                    <p className="text-xs text-gray-400">{it.volume} m³</p>
                                                </div>
                                                {count === 0 ? (
                                                    <button onClick={() => handleAdd(it)} className="w-8 h-8 rounded-full border border-gray-300 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white text-gray-500 transition flex items-center justify-center"><FiPlus size={16} /></button>
                                                ) : (
                                                    <div className="flex items-center gap-1.5">
                                                        <button onClick={() => handleRemove(it.name)} className="w-7 h-7 rounded-full border border-gray-300 hover:bg-[#1a1a1a] hover:text-white text-gray-600 transition flex items-center justify-center"><FiMinus size={14} /></button>
                                                        <span className="w-6 text-center text-sm font-semibold">{count}</span>
                                                        <button onClick={() => handleAdd(it)} className="w-7 h-7 rounded-full border border-gray-300 hover:bg-[#1a1a1a] hover:text-white text-gray-600 transition flex items-center justify-center"><FiPlus size={14} /></button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <button onClick={() => setShowCustomModal(true)}
                                    className="mt-3 w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-gray-300 hover:border-[#1a1a1a] bg-white text-left transition">
                                    <FiPlus size={16} className="text-gray-600" />
                                    <span className="text-sm font-medium text-[#1a1a1a]">Add your own item</span>
                                </button>
                            </>
                        )}
                        <p className="text-xs text-gray-400 mt-4 text-center">Don't worry — you can edit your list any time before or after booking.</p>
                    </div>
                </div>

                {/* Right: summary */}
                <div className="w-full lg:w-80 flex">
                    <div className="sticky top-20 w-full flex">
                        <div className="bg-white rounded-2xl p-4 flex flex-col w-full h-full" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-bold text-[#1a1a1a]">Your move summary</h4>
                                {totalItems > 0 && (
                                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                        {totalItems} item{totalItems !== 1 ? "s" : ""}
                                    </span>
                                )}
                            </div>

                            {items.length > 0 ? (
                                <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                                    {items.map((it) => (
                                        <div key={it.name} className="flex items-center gap-1.5 py-1.5 border-b border-gray-100 last:border-0">
                                            <span className="text-sm text-gray-700 flex-1 truncate">{it.name}</span>
                                            <button onClick={() => handleRemove(it.name)} className="w-5 h-5 rounded-full border border-gray-200 hover:bg-[#1a1a1a] hover:text-white text-gray-400 transition flex items-center justify-center shrink-0"><FiMinus size={9} /></button>
                                            <span className="text-xs font-bold text-[#1a1a1a] w-4 text-center shrink-0">{it.quantity}</span>
                                            <button onClick={() => handleAdd(it)} className="w-5 h-5 rounded-full border border-gray-200 hover:bg-[#1a1a1a] hover:text-white text-gray-400 transition flex items-center justify-center shrink-0"><FiPlus size={9} /></button>
                                            <button onClick={() => onChange(items.filter((i) => i.name !== it.name))} className="text-gray-300 hover:text-red-400 transition ml-0.5 shrink-0"><FiX size={11} /></button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm">Nothing here yet. Add items above.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom item modal */}
            {showCustomModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowCustomModal(false)}>
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-bold text-[#1a1a1a]">Add a custom item</h4>
                            <button onClick={() => setShowCustomModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><FiX size={18} /></button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Item name *</label>
                                <input type="text" autoFocus placeholder="e.g. Piano, Treadmill" value={custom.name}
                                    onChange={e => setCustom(c => ({ ...c, name: e.target.value }))}
                                    onKeyDown={e => e.key === 'Enter' && handleAddCustom()}
                                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Estimated dimensions</label>
                                <div className="grid grid-cols-4 gap-2">
                                    <input type="number" placeholder="L" value={custom.length} onChange={e => setCustom(c => ({ ...c, length: e.target.value }))} className="col-span-1 px-2 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400 text-center" />
                                    <input type="number" placeholder="W" value={custom.width} onChange={e => setCustom(c => ({ ...c, width: e.target.value }))} className="col-span-1 px-2 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400 text-center" />
                                    <input type="number" placeholder="H" value={custom.height} onChange={e => setCustom(c => ({ ...c, height: e.target.value }))} className="col-span-1 px-2 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400 text-center" />
                                    <select value={custom.dimUnit} onChange={e => setCustom(c => ({ ...c, dimUnit: e.target.value }))} className="col-span-1 px-2 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400">
                                        {UNIT_OPTIONS_DIM.map(u => <option key={u}>{u}</option>)}
                                    </select>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Length · Width · Height</p>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Estimated weight</label>
                                <div className="flex gap-2">
                                    <input type="number" placeholder="Weight" value={custom.weight} onChange={e => setCustom(c => ({ ...c, weight: e.target.value }))} className="flex-1 px-3.5 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400" />
                                    <select value={custom.weightUnit} onChange={e => setCustom(c => ({ ...c, weightUnit: e.target.value }))} className="px-2 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400">
                                        {UNIT_OPTIONS_WEIGHT.map(u => <option key={u}>{u}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-5">
                            <button onClick={() => setShowCustomModal(false)} className="flex-1 px-4 py-2.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancel</button>
                            <button onClick={handleAddCustom} disabled={!custom.name.trim()} className="flex-1 px-4 py-2.5 text-sm bg-[#1a1a1a] text-white rounded-lg hover:bg-black disabled:opacity-50 transition font-semibold">Add to move</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
