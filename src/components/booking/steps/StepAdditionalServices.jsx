import React, { useState } from 'react';
import {
    FiShield,
    FiTool,
    FiFileText,
    FiPlus,
    FiMinus,
} from 'react-icons/fi';

export default function StepAdditionalServices({ data, onChange, errors, basePrice = 346 }) {
    const [showProtectionModal, setShowProtectionModal] = useState(false);
    const [goodsValue, setGoodsValue] = useState(data.protectionGoodsValue || '1000');

    const handleDismantleChange = (delta) => {
        onChange('dismantleCount', Math.max(0, data.dismantleCount + delta));
    };

    const handleAssemblyChange = (delta) => {
        onChange('assemblyCount', Math.max(0, data.assemblyCount + delta));
    };

    const protectionCost = data.protectionPlus
        ? Math.round((parseInt(goodsValue) / 100) * 2.4)
        : 0;

    const servicesCost = {
        dismantle: data.dismantleCount * 20,
        assembly: data.assemblyCount * 30,
        protection: protectionCost,
    };

    const totalServices = Object.values(servicesCost).reduce((a, b) => a + b, 0);
    const totalPrice = basePrice + totalServices;

    return (
        <div className="bg-[#F9F8F6] -mx-4 px-4 py-4">
            {/* Heading */}
            <div className="max-w-7xl mx-auto mb-3">
                <h3 className="text-xl md:text-2xl font-bold text-[#1a1a1a]">
                    Additional services
                </h3>
                <p className="text-gray-500 text-xs mt-0.5">
                    Optional add-ons to make your move easier
                </p>
            </div>

            {errors.services && (
                <div className="max-w-7xl mx-auto mb-3 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
                    {errors.services}
                </div>
            )}

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* LEFT: Services */}
                <div className="lg:col-span-2 space-y-3">

                    {/* Coverage Options */}
                    <div
                        className="bg-white rounded-2xl p-4"
                        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <FiShield size={18} className="text-gray-700" />
                            <h4 className="font-bold text-sm text-[#1a1a1a]">Coverage options</h4>
                        </div>

                        {/* Complimentary Cover */}
                        <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 mb-3">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <h5 className="font-bold text-sm text-[#1a1a1a]">Complimentary Cover</h5>
                                    <p className="text-xs text-gray-600 mt-1">
                                        Included in every move. Covers loss, fire and theft up to £20,000.
                                    </p>
                                </div>
                                <span className="text-xs font-bold bg-gray-200 text-gray-700 px-2 py-1 rounded-full shrink-0">
                                    Included
                                </span>
                            </div>
                        </div>

                        {/* Protection+ */}
                        <div
                            className={`p-3 border-2 rounded-lg transition ${data.protectionPlus
                                    ? 'border-[#1a1a1a] bg-[#F9F8F6]'
                                    : 'border-gray-200 bg-white'
                                }`}
                        >
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.protectionPlus}
                                    onChange={(e) => {
                                        onChange('protectionPlus', e.target.checked);
                                        if (e.target.checked) setShowProtectionModal(true);
                                    }}
                                    className="w-4 h-4 mt-0.5 shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h5 className="font-bold text-sm text-[#1a1a1a]">Protection+</h5>
                                        <span className="text-xs font-bold bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                                            Recommended
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600">
                                        Enhanced damage protection up to the value of your goods.
                                    </p>
                                    {data.protectionPlus && (
                                        <p className="text-xs font-semibold text-[#1a1a1a] mt-1.5">
                                            Goods value: £{goodsValue}
                                        </p>
                                    )}
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="font-bold text-[#1a1a1a] text-sm">£{protectionCost}</div>
                                    {data.protectionPlus && (
                                        <button
                                            type="button"
                                            onClick={() => setShowProtectionModal(true)}
                                            className="text-xs text-gray-600 hover:text-[#1a1a1a] mt-1"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Dismantling & Reassembly */}
                    <div
                        className="bg-white rounded-2xl p-4"
                        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <FiTool size={18} className="text-gray-700" />
                            <h4 className="font-bold text-sm text-[#1a1a1a]">Dismantling & Reassembly</h4>
                        </div>

                        <p className="text-xs text-gray-600 mb-4">
                            Need help with bulky items? Add dismantle and/or assembly services.
                        </p>

                        {/* Dismantle */}
                        <div className="mb-4 pb-4 border-b border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="font-semibold text-sm text-[#1a1a1a]">Dismantle</p>
                                    <p className="text-xs text-gray-600">Per item</p>
                                </div>
                                <p className="font-bold text-sm text-gray-700">+£20</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => handleDismantleChange(-1)}
                                    className="w-8 h-8 rounded-full border border-gray-300 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white text-gray-600 transition flex items-center justify-center"
                                >
                                    <FiMinus size={14} />
                                </button>
                                <span className="w-8 text-center font-bold text-sm text-[#1a1a1a]">
                                    {data.dismantleCount}
                                </span>
                                <button
                                    onClick={() => handleDismantleChange(1)}
                                    className="w-8 h-8 rounded-full border border-gray-300 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white text-gray-600 transition flex items-center justify-center"
                                >
                                    <FiPlus size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Assembly */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="font-semibold text-sm text-[#1a1a1a]">Assembly</p>
                                    <p className="text-xs text-gray-600">Per item</p>
                                </div>
                                <p className="font-bold text-sm text-gray-700">+£30</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => handleAssemblyChange(-1)}
                                    className="w-8 h-8 rounded-full border border-gray-300 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white text-gray-600 transition flex items-center justify-center"
                                >
                                    <FiMinus size={14} />
                                </button>
                                <span className="w-8 text-center font-bold text-sm text-[#1a1a1a]">
                                    {data.assemblyCount}
                                </span>
                                <button
                                    onClick={() => handleAssemblyChange(1)}
                                    className="w-8 h-8 rounded-full border border-gray-300 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white text-gray-600 transition flex items-center justify-center"
                                >
                                    <FiPlus size={14} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Special Requirements */}
                    <div
                        className="bg-white rounded-2xl p-4"
                        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <FiFileText size={18} className="text-gray-700" />
                            <h4 className="font-bold text-sm text-[#1a1a1a]">Special requirements or notes?</h4>
                        </div>

                        <textarea
                            placeholder="E.g. Parking available, sofa comes apart, narrow entrance, etc."
                            value={data.specialInstructions}
                            onChange={(e) => onChange('specialInstructions', e.target.value)}
                            rows="4"
                            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 text-sm resize-none placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* RIGHT: Summary */}
                <div className="lg:col-span-1">
                    <div className="sticky top-20 bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                        <h4 className="font-bold text-[#1a1a1a] text-sm mb-3">Price breakdown</h4>

                        <div className="space-y-2 text-xs mb-4 pb-4 border-b border-gray-100">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Base price</span>
                                <span className="font-semibold text-[#1a1a1a]">£{basePrice}</span>
                            </div>

                            {servicesCost.dismantle > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Dismantle (×{data.dismantleCount})</span>
                                    <span className="font-semibold text-[#1a1a1a]">+£{servicesCost.dismantle}</span>
                                </div>
                            )}

                            {servicesCost.assembly > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Assembly (×{data.assemblyCount})</span>
                                    <span className="font-semibold text-[#1a1a1a]">+£{servicesCost.assembly}</span>
                                </div>
                            )}

                            {servicesCost.protection > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Protection+</span>
                                    <span className="font-semibold text-[#1a1a1a]">+£{servicesCost.protection}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-end mb-3">
                            <span className="font-semibold text-[#1a1a1a] text-sm">Total price</span>
                            <span className="text-2xl font-bold text-[#1a1a1a]">£{totalPrice}</span>
                        </div>

                        <div className="bg-transparent rounded-lg p-2.5">
                            <p className="text-xs text-gray-600">
                                Next: Review your booking and confirm.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Protection Modal */}
            {showProtectionModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-2 flex items-center gap-2">
                            <FiShield size={20} className="text-gray-700" />
                            Protection+
                        </h3>

                        <p className="text-sm text-gray-600 mb-4">
                            Protect the full value of your items. £2.40 per £100 of goods value.
                        </p>

                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Goods value</label>
                            <div className="flex items-center gap-2">
                                <span className="text-base font-semibold text-gray-700">£</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="100"
                                    value={goodsValue}
                                    onChange={(e) => setGoodsValue(e.target.value)}
                                    className="grow px-3.5 py-2.5 border border-gray-200 rounded-lg outline-none text-sm focus:border-gray-400 transition"
                                />
                            </div>
                            <div className="text-right mt-2 text-sm text-gray-700">
                                <strong>Cost: £{Math.round((parseInt(goodsValue) / 100) * 2.4)}</strong>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    onChange('protectionGoodsValue', parseInt(goodsValue));
                                    setShowProtectionModal(false);
                                }}
                                className="grow bg-[#1a1a1a] text-white font-bold py-2.5 rounded-lg hover:bg-black transition text-sm"
                            >
                                Add Protection+
                            </button>
                            <button
                                onClick={() => setShowProtectionModal(false)}
                                className="grow border border-gray-300 text-gray-700 font-bold py-2.5 rounded-lg hover:border-gray-400 transition text-sm"
                            >
                                Skip
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}