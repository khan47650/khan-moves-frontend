import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiMinus, FiX } from 'react-icons/fi';
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

export default function StepItemSelectionOffice({ items, onChange, error, pickup, delivery, serviceType }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showCustomModal, setShowCustomModal] = useState(false);
    const [customName, setCustomName] = useState('');
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

    const handleAdd = (it) => {
        const ex = items.find(i => i.name === it.name);
        if (ex) onChange(items.map(i => i.name === it.name ? { ...i, quantity: i.quantity + 1 } : i));
        else onChange([...items, { name: it.name, volume: it.volume, quantity: 1 }]);
    };

    const handleRemove = (name) => {
        const ex = items.find(i => i.name === name);
        if (ex && ex.quantity > 1) onChange(items.map(i => i.name === name ? { ...i, quantity: i.quantity - 1 } : i));
        else onChange(items.filter(i => i.name !== name));
    };

    const handleAddCustom = () => {
        if (!customName.trim()) return;
        handleAdd({ name: customName.trim(), volume: 100, custom: true });
        setCustomName('');
        setShowCustomModal(false);
    };

    const searchResults = searchQuery
        ? apiItems.filter(it => it.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    const totalItems = items.reduce((s, i) => s + i.quantity, 0);

    return (
        <div className="bg-[#F9F8F6] -mx-4 px-4 py-4">
            <div className="max-w-7xl mx-auto mb-3">
                <h3 className="text-xl md:text-2xl font-bold text-[#1a1a1a]">What are you moving from the office?</h3>
                <p className="text-gray-500 text-xs mt-0.5">Search or pick categories — add desks, chairs, equipment and more</p>
            </div>
            {error && <div className="max-w-7xl mx-auto mb-3 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">{error}</div>}

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl p-4 md:p-5" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                        <div className="relative mb-3">
                            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                            <input type="text" placeholder="Search for your item(s) e.g. Desk" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none placeholder:text-gray-400 focus:border-gray-400 transition" />
                        </div>

                        {loadingItems ? <ItemLoader /> : searchQuery ? (
                            <div className="max-h-75 overflow-y-auto">
                                {searchResults.length > 0 ? searchResults.map((it, idx) => {
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
                                                    <button onClick={() => handleRemove(it.name)} className="w-7 h-7 rounded-full border border-gray-300 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white text-gray-600 transition flex items-center justify-center"><FiMinus size={14} /></button>
                                                    <span className="w-7 text-center text-sm font-semibold">{count}</span>
                                                    <button onClick={() => handleAdd(it)} className="w-7 h-7 rounded-full border border-gray-300 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white text-gray-600 transition flex items-center justify-center"><FiPlus size={14} /></button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }) : (
                                    <div className="text-center py-6">
                                        <p className="text-gray-400 text-sm mb-3">No items found for "{searchQuery}"</p>
                                        <button onClick={() => { setCustomName(searchQuery); setShowCustomModal(true); }} className="text-sm font-semibold text-[#1a1a1a] underline">+ Add "{searchQuery}" as custom item</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="max-h-75 overflow-y-auto">
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
                                                        <button onClick={() => handleRemove(it.name)} className="w-7 h-7 rounded-full border border-gray-300 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white text-gray-600 transition flex items-center justify-center"><FiMinus size={14} /></button>
                                                        <span className="w-7 text-center text-sm font-semibold">{count}</span>
                                                        <button onClick={() => handleAdd(it)} className="w-7 h-7 rounded-full border border-gray-300 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white text-gray-600 transition flex items-center justify-center"><FiPlus size={14} /></button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <button onClick={() => setShowCustomModal(true)} className="mt-3 w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-gray-300 hover:border-[#1a1a1a] bg-white text-left transition">
                                    <FiPlus size={18} className="text-gray-600" />
                                    <span className="text-sm font-medium text-[#1a1a1a]">Add your own item</span>
                                </button>
                            </>
                        )}
                        <p className="text-xs text-gray-500 mt-4 text-center">Don't worry — you can edit your list any time before booking.</p>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-20 bg-white rounded-2xl p-4 md:p-5 h-full" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-base font-bold text-[#1a1a1a]">Your move summary</h4>
                            {totalItems > 0 && (
                                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                    {totalItems} item{totalItems !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>

                        {items.length > 0 ? (
                            <div className="space-y-1.5 max-h-105 overflow-y-auto pr-1">
                                {items.map((it) => (
                                    <div key={it.name} className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0">
                                        <span className="text-sm text-gray-700 flex-1 truncate">{it.name}</span>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <button onClick={() => handleRemove(it.name)} className="w-5 h-5 rounded-full border border-gray-300 hover:bg-[#1a1a1a] hover:text-white text-gray-500 transition flex items-center justify-center"><FiMinus size={10} /></button>
                                            <span className="w-5 text-center text-xs font-bold text-[#1a1a1a]">{it.quantity}</span>
                                            <button onClick={() => handleAdd(it)} className="w-5 h-5 rounded-full border border-gray-300 hover:bg-[#1a1a1a] hover:text-white text-gray-500 transition flex items-center justify-center"><FiPlus size={10} /></button>
                                            <button onClick={() => onChange(items.filter(i => i.name !== it.name))} className="ml-1 text-gray-300 hover:text-red-500 transition"><FiX size={12} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-56">
                                <p className="text-gray-400 text-sm text-center">Nothing here yet.<br />Add items to see them listed.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showCustomModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowCustomModal(false)}>
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <h4 className="text-lg font-bold text-[#1a1a1a] mb-3">Add a custom item</h4>
                        <p className="text-xs text-gray-500 mb-4">Anything specific to your office that's not listed.</p>
                        <input type="text" autoFocus placeholder="e.g., 3D Printer, Whiteboard, Server" value={customName}
                            onChange={(e) => setCustomName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
                            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg outline-none text-sm focus:border-gray-400 mb-4" />
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => { setShowCustomModal(false); setCustomName(''); }} className="px-4 py-2 text-sm text-gray-600 hover:text-[#1a1a1a]">Cancel</button>
                            <button onClick={handleAddCustom} disabled={!customName.trim()} className="px-4 py-2 text-sm bg-[#1a1a1a] text-white rounded-lg hover:bg-black disabled:opacity-50 transition">Add to move</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
