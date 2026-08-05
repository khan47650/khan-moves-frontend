import React from "react";
import {
    FiCheck, FiFileText, FiMinus, FiPackage, FiPlus, FiShield, FiTool
} from "react-icons/fi";


export default function StepAdditionalServices({
    data,
    onChange,
    errors,
    basePrice = 0
}) {
    const dismantleTotal = Number(data.dismantleCount) || 0;
    const assemblyTotal = Number(data.assemblyCount) || 0;

    const isHomeMove = [
        "home",
        "home_removal"
    ].includes(data.serviceType);

    const renderCountInput = (
        title,
        field,
    ) => {
        return (
            <div className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="mb-3">
                    <h3 className="font-semibold text-[#1a1a1a]">
                        {title}
                    </h3>
                </div>

                <input
                    type="number"
                    min="0"
                    value={data[field] || ""}
                    onChange={(e) =>
                        onChange(
                            field,
                            Math.max(
                                0,
                                Number(e.target.value) || 0
                            )
                        )
                    }
                    placeholder="e.g. 3"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#C0392B]"
                />
            </div>
        );
    };

    return (
        <div className="-mx-4 px-4 py-4">
            <div className="max-w-7xl mx-auto mb-3">
                <h3 className="text-xl md:text-2xl font-bold text-[#1a1a1a]">
                    Additional services
                </h3>
                <p className="text-gray-500 text-xs mt-0.5">
                    Choose any additional services required for your move.
                </p>
            </div>

            {errors.services && (
                <div className="max-w-7xl mx-auto mb-3 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
                    {errors.services}
                </div>
            )}

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-3">

                    <div
                        className="bg-[#FDFBF8] rounded-2xl p-4"
                        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
                    >
                        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 flex items-center justify-between">

                            <div>

                                <p className="text-sm font-semibold text-[#1a1a1a]">
                                    Free Protection
                                </p>

                                <p className="text-[11px] text-gray-500">
                                    Blankets & bubble wrap included
                                </p>

                            </div>

                            <span className="rounded-full bg-green-600 px-2 py-1 text-[10px] font-bold text-white">
                                INCLUDED
                            </span>

                        </div>

                        <div className="flex items-start gap-2 mb-4">

                            <FiTool
                                size={18}
                                className="mt-0.5 text-[#C0392B] shrink-0"
                            />

                            <div>

                                <h4 className="font-bold text-sm text-[#1a1a1a]">
                                    Dismantling and assembly
                                </h4>

                                <p className="text-xs text-gray-500 mt-0.5">
                                    Enter the number of items requiring dismantling or assembly.
                                </p>

                            </div>

                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                            <div>
                                {renderCountInput(
                                    "Dismantling",
                                    "dismantleCount",
                                )}
                            </div>

                            <div>
                                {renderCountInput(
                                    "Assembly",
                                    "assemblyCount",
                                )}
                            </div>

                        </div>

                    </div>

                    {isHomeMove && (
                        <div
                            className="bg-[#FDFBF8] rounded-2xl p-4"
                            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <FiPackage size={18} className="text-[#C0392B]" />
                                <h4 className="font-bold text-sm text-[#1a1a1a]">
                                    Packing service
                                </h4>
                            </div>

                            <label className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition ${data.packingService
                                ? "border-[#C0392B] bg-red-50"
                                : "border-gray-200 hover:border-gray-300"
                                }`}>
                                <input
                                    type="checkbox"
                                    checked={Boolean(data.packingService)}
                                    onChange={e => onChange(
                                        "packingService",
                                        e.target.checked
                                    )}
                                    className="w-4 h-4 mt-0.5 accent-[#C0392B]"
                                />

                                <div className="flex-1">
                                    <p className="font-bold text-sm text-[#1a1a1a]">
                                        Professional packing
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Our team safely packs your belongings using quality materials.
                                    </p>
                                </div>
                                <span className="font-bold text-sm text-[#C0392B]">
                                    +£20
                                </span>
                            </label>
                        </div>
                    )}

                    <div
                        className="bg-[#FDFBF8] rounded-2xl p-4"
                        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
                    >
                        <div className="flex items-center justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2">
                                <FiFileText size={18} className="text-[#C0392B]" />
                                <h4 className="font-bold text-sm text-[#1a1a1a]">
                                    Special instructions
                                </h4>
                            </div>

                            <span className={`text-[10px] font-semibold ${(data.specialInstructions || "").length >= 450
                                ? "text-red-600"
                                : "text-gray-400"
                                }`}>
                                {(data.specialInstructions || "").length}/450
                            </span>
                        </div>

                        <textarea
                            maxLength={450}
                            placeholder="Add access details, fragile-item notes or anything else our team should know…"
                            value={data.specialInstructions || ""}
                            onChange={e => onChange(
                                "specialInstructions",
                                e.target.value
                            )}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C0392B] resize-none"
                        />

                        <p className="text-[10px] text-gray-400 mt-1.5">
                            Maximum 450 characters.
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div
                        className="sticky top-20 bg-[#FDFBF8] rounded-2xl p-4"
                        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
                    >
                        <h4 className="font-bold text-[#1a1a1a] text-sm mb-4">
                            Add-on summary
                        </h4>

                        <div className="space-y-2 text-xs pb-4 border-b border-gray-100">
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    Dismantling ×{dismantleTotal}
                                </span>
                                <span className="font-semibold">
                                    £{Math.round(dismantleTotal * 20)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    Assembly ×{assemblyTotal}
                                </span>
                                <span className="font-semibold">
                                    £{Math.round(assemblyTotal * 30)}
                                </span>
                            </div>

                            {data.packingService && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Packing service</span>
                                    <span className="font-semibold">£20</span>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    Free protection
                                </span>
                                <span className="font-semibold text-green-600">
                                    Included
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end mt-4">
                            <span className="font-semibold text-sm text-[#1a1a1a]">
                                Estimated total
                            </span>
                            <span className="text-2xl font-black text-[#C0392B]">
                                £{Math.round(Number(basePrice) || 0)}
                            </span>
                        </div>

                        <p className="text-xs text-gray-500 mt-3">
                            The total updates automatically as you enter quantities.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}