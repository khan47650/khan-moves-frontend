import React from 'react';
import { FiPlus, FiMinus, FiX, FiPackage } from 'react-icons/fi';
import { BsBoxSeam, BsBox, BsBoxes } from 'react-icons/bs';

const PARCEL_SIZES = [
    { name: 'Envelope / Document', dim: 'Up to A4', icon: FiPackage, volume: 5 },
    { name: 'Small Parcel', dim: 'Up to 30 × 30 × 30 cm', icon: BsBox, volume: 30 },
    { name: 'Medium Parcel', dim: 'Up to 50 × 50 × 50 cm', icon: BsBoxSeam, volume: 100 },
    { name: 'Large Parcel', dim: 'Up to 70 × 70 × 70 cm', icon: BsBoxes, volume: 250 },
    { name: 'Extra Large Parcel', dim: 'Up to 100 × 100 × 100 cm', icon: BsBoxes, volume: 500 },
    { name: 'Suitcase / Luggage', dim: 'Standard size', icon: FiPackage, volume: 150 },
];

export default function StepItemSelectionParcels({ items, onChange, error, pickup, delivery }) {
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
    const getCount = (n) => items.find(i => i.name === n)?.quantity || 0;
    const totalItems = items.reduce((s, i) => s + i.quantity, 0);

    return (
        <div className="bg-[#F9F8F6] -mx-4 px-4 py-4">
            <div className="max-w-7xl mx-auto mb-3">
                <h3 className="text-xl md:text-2xl font-bold text-[#1a1a1a]">What are you sending?</h3>
                <p className="text-gray-500 text-xs mt-0.5">Pick the size that best matches your parcels</p>
            </div>
            {error && <div className="max-w-7xl mx-auto mb-3 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">{error}</div>}

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl p-4 md:p-5" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {PARCEL_SIZES.map((p) => {
                                const Icon = p.icon;
                                const count = getCount(p.name);
                                return (
                                    <div key={p.name} onClick={() => handleAdd(p)} className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition cursor-pointer ${count > 0 ? 'border-[#1a1a1a] bg-[#F9F8F6]' : 'border-gray-200 bg-white'}`}>
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${count > 0 ? 'bg-[#1a1a1a] text-white' : 'bg-gray-100 text-gray-600'}`}>
                                            <Icon size={22} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm text-[#1a1a1a]">{p.name}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{p.dim}</p>
                                        </div>
                                        {count === 0 ? (
                                            <button onClick={(e) => {
                                                e.stopPropagation();
                                                handleAdd(p);
                                            }} className="w-9 h-9 rounded-full border border-gray-300 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white text-gray-600 transition flex items-center justify-center shrink-0">
                                                <FiPlus size={18} />
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <button onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemove(p.name);
                                                }} className="w-7 h-7 rounded-full border border-gray-300 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white text-gray-600 transition flex items-center justify-center"><FiMinus size={14} /></button>
                                                <span className="w-7 text-center text-sm font-bold text-[#1a1a1a]">{count}</span>
                                                <button onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAdd(p);
                                                }} className="w-7 h-7 rounded-full border border-gray-300 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white text-gray-600 transition flex items-center justify-center"><FiPlus size={14} /></button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <p className="text-xs text-gray-500 mt-5 text-center">Don't worry — we'll confirm exact dimensions before pickup.</p>
                    </div>
                </div>
                <div className="lg:col-span-1 flex">
                    <div className="sticky top-20 w-full flex">
                        <div
                            className="bg-white rounded-2xl p-4 flex flex-col w-full h-full"
                            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-base font-bold text-[#1a1a1a]">
                                    Your parcels
                                </h4>

                                {totalItems > 0 && (
                                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                        {totalItems} parcel{totalItems !== 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>

                            {items.length > 0 ? (
                                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                                    {items.map((it) => (
                                        <div
                                            key={it.name}
                                            className="flex items-center gap-1.5 py-1.5 border-b border-gray-100 last:border-0"
                                        >
                                            <span className="text-sm text-gray-700 flex-1 truncate">
                                                {it.name}
                                            </span>

                                            <button
                                                onClick={() => handleRemove(it.name)}
                                                className="w-5 h-5 rounded-full border border-gray-200 hover:bg-[#1a1a1a] hover:text-white text-gray-400 transition flex items-center justify-center shrink-0"
                                            >
                                                <FiMinus size={9} />
                                            </button>

                                            <span className="text-xs font-bold text-[#1a1a1a] w-4 text-center shrink-0">
                                                {it.quantity}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    handleAdd({
                                                        name: it.name,
                                                        volume: it.volume,
                                                    })
                                                }
                                                className="w-5 h-5 rounded-full border border-gray-200 hover:bg-[#1a1a1a] hover:text-white text-gray-400 transition flex items-center justify-center shrink-0"
                                            >
                                                <FiPlus size={9} />
                                            </button>

                                            <button
                                                onClick={() => onChange(items.filter(i => i.name !== it.name))}
                                                className="text-gray-300 hover:text-red-400 transition ml-0.5 shrink-0"
                                            >
                                                <FiX size={11} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm">
                                    No parcels yet. Pick a size above.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}