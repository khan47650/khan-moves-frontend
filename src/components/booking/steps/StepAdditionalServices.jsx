import React, { useState } from 'react';
import { FiShield, FiTool, FiFileText, FiPlus, FiMinus, FiPackage } from 'react-icons/fi';

export default function StepAdditionalServices({ data, onChange, errors, basePrice = 346 }) {
    const [assemblyItemText, setAssemblyItemText] = useState('');
    const [dismantleItemText, setDismantleItemText] = useState('');

    const handleDismantleChange = (delta) => onChange('dismantleCount', Math.max(0, data.dismantleCount + delta));
    const handleAssemblyChange = (delta) => onChange('assemblyCount', Math.max(0, data.assemblyCount + delta));

    const isHomeMove = data.serviceType === 'home';

    const servicesCost = {
        dismantle: data.dismantleCount * 20,
        assembly: data.assemblyCount * 30,
        packing: data.packingService ? 49 : 0,
    };
    const totalServices = Object.values(servicesCost).reduce((a, b) => a + b, 0);
    const totalPrice = basePrice + totalServices;

    return (
        <div className="bg-[#F9F8F6] -mx-4 px-4 py-4">
            <div className="max-w-7xl mx-auto mb-3">
                <h3 className="text-xl md:text-2xl font-bold text-[#1a1a1a]">Additional services</h3>
                <p className="text-gray-500 text-xs mt-0.5">Optional add-ons to make your move easier</p>
            </div>

            {errors.services && (
                <div className="max-w-7xl mx-auto mb-3 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">{errors.services}</div>
            )}

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-3">

                    {/* ── Free Protection ── */}
                    <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                        <div className="flex items-center gap-2 mb-3">
                            <FiShield size={18} className="text-gray-700" />
                            <h4 className="font-bold text-sm text-[#1a1a1a]">Protection included</h4>
                        </div>
                        <div className="p-3.5 border border-green-200 bg-green-50 rounded-xl flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h5 className="font-bold text-sm text-[#1a1a1a]">Free Protection</h5>
                                    <span className="text-[10px] font-bold bg-green-500 text-white px-2 py-0.5 rounded-full">Included</span>
                                </div>
                                <p className="text-xs text-gray-600">
                                    We use protective blankets and bubble wraps on all items — included in every move at no extra cost.
                                </p>
                            </div>
                            <FiShield size={22} className="text-green-500 shrink-0 mt-0.5" />
                        </div>
                    </div>

                    {/* ── Dismantling & Reassembly ── */}
                    <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                        <div className="flex items-center gap-2 mb-3">
                            <FiTool size={18} className="text-gray-700" />
                            <h4 className="font-bold text-sm text-[#1a1a1a]">Dismantling & Reassembly</h4>
                        </div>
                        <p className="text-xs text-gray-500 mb-4">Need help with bulky items like beds or wardrobes?</p>

                        {/* Dismantle */}
                        <div className="mb-4 pb-4 border-b border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="font-semibold text-sm text-[#1a1a1a]">Dismantle</p>
                                    <p className="text-xs text-gray-500">Per item · £20 each</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleDismantleChange(-1)} className="w-8 h-8 rounded-full border border-gray-300 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white text-gray-600 transition flex items-center justify-center">
                                        <FiMinus size={14} />
                                    </button>
                                    <span className="w-6 text-center font-bold text-sm">{data.dismantleCount}</span>
                                    <button onClick={() => handleDismantleChange(1)} className="w-8 h-8 rounded-full border border-gray-300 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white text-gray-600 transition flex items-center justify-center">
                                        <FiPlus size={14} />
                                    </button>
                                </div>
                            </div>
                            {data.dismantleCount > 0 && (
                                <input
                                    type="text"
                                    maxLength={20}
                                    placeholder="Which items? (e.g. bed, wardrobe)"
                                    value={dismantleItemText}
                                    onChange={e => setDismantleItemText(e.target.value)}
                                    className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-gray-400 transition"
                                />
                            )}
                        </div>

                        {/* Assembly */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="font-semibold text-sm text-[#1a1a1a]">Assembly</p>
                                    <p className="text-xs text-gray-500">Per item · £30 each</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleAssemblyChange(-1)} className="w-8 h-8 rounded-full border border-gray-300 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white text-gray-600 transition flex items-center justify-center">
                                        <FiMinus size={14} />
                                    </button>
                                    <span className="w-6 text-center font-bold text-sm">{data.assemblyCount}</span>
                                    <button onClick={() => handleAssemblyChange(1)} className="w-8 h-8 rounded-full border border-gray-300 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white text-gray-600 transition flex items-center justify-center">
                                        <FiPlus size={14} />
                                    </button>
                                </div>
                            </div>
                            {data.assemblyCount > 0 && (
                                <input
                                    type="text"
                                    maxLength={20}
                                    placeholder="Which items? (e.g. bed, wardrobe)"
                                    value={assemblyItemText}
                                    onChange={e => setAssemblyItemText(e.target.value)}
                                    className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-gray-400 transition"
                                />
                            )}
                        </div>
                    </div>

                    {/* ── Packing Service (Home Move only) ── */}
                    {isHomeMove && (
                        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                            <div className="flex items-center gap-2 mb-3">
                                <FiPackage size={18} className="text-gray-700" />
                                <h4 className="font-bold text-sm text-[#1a1a1a]">Packing service</h4>
                            </div>
                            <label className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition ${data.packingService ? 'border-[#1a1a1a] bg-[#F9F8F6]' : 'border-gray-200 hover:border-gray-300'}`}>
                                <input
                                    type="checkbox"
                                    checked={!!data.packingService}
                                    onChange={e => onChange('packingService', e.target.checked)}
                                    className="w-4 h-4 mt-0.5 shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm text-[#1a1a1a]">Professional packing</p>
                                    <p className="text-xs text-gray-500 mt-1">Our team packs your belongings safely using quality materials. Ideal for fragile items.</p>
                                </div>
                                <span className="font-bold text-sm text-[#1a1a1a] shrink-0">+£49</span>
                            </label>
                        </div>
                    )}

                    {/* ── Special instructions ── */}
                    <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                        <div className="flex items-center gap-2 mb-3">
                            <FiFileText size={18} className="text-gray-700" />
                            <h4 className="font-bold text-sm text-[#1a1a1a]">Special requirements or notes?</h4>
                        </div>
                        <textarea
                            placeholder="e.g. Parking available, sofa comes apart, narrow entrance…"
                            value={data.specialInstructions}
                            onChange={e => onChange('specialInstructions', e.target.value)}
                            rows="3"
                            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400 transition resize-none placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* ── RIGHT: Price breakdown ── */}
                <div className="lg:col-span-1">
                    <div className="sticky top-20 bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
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
                            {servicesCost.packing > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Packing service</span>
                                    <span className="font-semibold text-[#1a1a1a]">+£{servicesCost.packing}</span>
                                </div>
                            )}
                            <div className="flex justify-between pt-1">
                                <span className="text-gray-600">Free Protection</span>
                                <span className="font-semibold text-green-600">Included</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="font-semibold text-[#1a1a1a] text-sm">Total</span>
                            <span className="text-2xl font-black text-[#1a1a1a]">£{totalPrice}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">Next: Review and confirm your booking.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
