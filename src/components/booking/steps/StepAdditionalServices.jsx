import React from "react";
import {
    FiCheck, FiFileText, FiMinus, FiPackage, FiPlus, FiShield, FiTool
} from "react-icons/fi";

const getItemKey = item => item.itemId || item.name;

export default function StepAdditionalServices({
    data,
    onChange,
    errors,
    basePrice = 0
}) {
    const selectedItems = data.items || [];
    const dismantleItems = data.dismantleItems || [];
    const assemblyItems = data.assemblyItems || [];

    const getSelectedQuantity = (list, item) => {
        const key = getItemKey(item);

        return list.find(selected =>
            getItemKey(selected) === key
        )?.quantity || 0;
    };

    const updateAddOnItem = (field, item, delta) => {
        const currentList = data[field] || [];
        const key = getItemKey(item);
        const existing = currentList.find(selected =>
            getItemKey(selected) === key
        );

        const maxQuantity = Math.max(1, Number(item.quantity) || 1);
        const nextQuantity = Math.min(
            maxQuantity,
            Math.max(0, (existing?.quantity || 0) + delta)
        );

        let nextList;

        if (nextQuantity === 0) {
            nextList = currentList.filter(selected =>
                getItemKey(selected) !== key
            );
        } else if (existing) {
            nextList = currentList.map(selected =>
                getItemKey(selected) === key
                    ? { ...selected, quantity: nextQuantity }
                    : selected
            );
        } else {
            nextList = [
                ...currentList,
                {
                    itemId: item.itemId || null,
                    name: item.name,
                    categoryName: item.categoryName || "",
                    quantity: nextQuantity
                }
            ];
        }

        const count = nextList.reduce(
            (total, selected) => total + (selected.quantity || 0),
            0
        );

        onChange(field, nextList);

        if (field === "dismantleItems") {
            onChange("dismantleCount", count);
        } else {
            onChange("assemblyCount", count);
        }
    };

    const dismantleTotal = dismantleItems.reduce(
        (total, item) => total + (item.quantity || 0),
        0
    );

    const assemblyTotal = assemblyItems.reduce(
        (total, item) => total + (item.quantity || 0),
        0
    );

    const isHomeMove = [
        "home",
        "home_removal"
    ].includes(data.serviceType);

    const renderItemSelector = (field, title, price, description) => {
        const selectedList = field === "dismantleItems"
            ? dismantleItems
            : assemblyItems;

        return (
            <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                        <p className="font-semibold text-sm text-[#1a1a1a]">
                            {title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {description} · £{price} per selected item
                        </p>
                    </div>

                    <span className="text-xs font-bold bg-red-50 text-[#C0392B] px-2.5 py-1 rounded-full">
                        {field === "dismantleItems"
                            ? dismantleTotal
                            : assemblyTotal
                        } selected
                    </span>
                </div>

                {selectedItems.length > 0 ? (
                    <div className="space-y-2">
                        {selectedItems.map((item, index) => {
                            const quantity = getSelectedQuantity(selectedList, item);
                            const maxQuantity = Math.max(1, Number(item.quantity) || 1);

                            return (
                                <div
                                    key={item.itemId || `${item.name}-${index}`}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition ${quantity > 0
                                            ? "border-[#C0392B] bg-red-50"
                                            : "border-gray-200 bg-white"
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${quantity > 0
                                            ? "bg-[#C0392B] text-white"
                                            : "bg-gray-100 text-gray-400"
                                        }`}>
                                        {quantity > 0
                                            ? <FiCheck size={14} />
                                            : <FiPackage size={14} />
                                        }
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-[#1a1a1a] truncate">
                                            {item.name}
                                        </p>

                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                            Available quantity: {maxQuantity}
                                            {item.categoryName
                                                ? ` · ${item.categoryName}`
                                                : ""
                                            }
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => updateAddOnItem(field, item, -1)}
                                            disabled={quantity === 0}
                                            className="w-7 h-7 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center hover:bg-[#C0392B] hover:border-[#C0392B] hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                                        >
                                            <FiMinus size={12} />
                                        </button>

                                        <span className="w-5 text-center text-sm font-bold text-[#1a1a1a]">
                                            {quantity}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => updateAddOnItem(field, item, 1)}
                                            disabled={quantity >= maxQuantity}
                                            className="w-7 h-7 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center hover:bg-[#C0392B] hover:border-[#C0392B] hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                                        >
                                            <FiPlus size={12} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-4 border border-dashed border-gray-300 rounded-xl text-center">
                        <p className="text-xs text-gray-400">
                            No booking items are available for selection.
                        </p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-[#F9F8F6] -mx-4 px-4 py-4">
            <div className="max-w-7xl mx-auto mb-3">
                <h3 className="text-xl md:text-2xl font-bold text-[#1a1a1a]">
                    Additional services
                </h3>
                <p className="text-gray-500 text-xs mt-0.5">
                    Select optional help for the exact items already added to your move.
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
                        className="bg-white rounded-2xl p-4"
                        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <FiShield size={18} className="text-green-600" />
                            <h4 className="font-bold text-sm text-[#1a1a1a]">
                                Protection included
                            </h4>
                        </div>

                        <div className="p-3.5 border border-green-200 bg-green-50 rounded-xl flex items-start justify-between gap-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h5 className="font-bold text-sm text-[#1a1a1a]">
                                        Free protection
                                    </h5>
                                    <span className="text-[10px] font-bold bg-green-500 text-white px-2 py-0.5 rounded-full">
                                        Included
                                    </span>
                                </div>

                                <p className="text-xs text-gray-600">
                                    Protective blankets and bubble wrap are included with every move.
                                </p>
                            </div>

                            <FiShield size={22} className="text-green-500 shrink-0" />
                        </div>
                    </div>

                    <div
                        className="bg-white rounded-2xl p-4"
                        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <FiTool size={18} className="text-[#C0392B]" />
                            <div>
                                <h4 className="font-bold text-sm text-[#1a1a1a]">
                                    Dismantling and assembly
                                </h4>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Choose directly from the items already in your booking.
                                </p>
                            </div>
                        </div>

                        <div className="pb-5 mb-5 border-b border-gray-100">
                            {renderItemSelector(
                                "dismantleItems",
                                "Dismantling",
                                20,
                                "We dismantle selected items before loading"
                            )}
                        </div>

                        {renderItemSelector(
                            "assemblyItems",
                            "Assembly",
                            30,
                            "We assemble selected items at delivery"
                        )}
                    </div>

                    {isHomeMove && (
                        <div
                            className="bg-white rounded-2xl p-4"
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
                                    +£49
                                </span>
                            </label>
                        </div>
                    )}

                    <div
                        className="bg-white rounded-2xl p-4"
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
                            rows={4}
                            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#C0392B] resize-none"
                        />

                        <p className="text-[10px] text-gray-400 mt-1.5">
                            Maximum 450 characters.
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div
                        className="sticky top-20 bg-white rounded-2xl p-4"
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
                                    £{dismantleTotal * 20}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    Assembly ×{assemblyTotal}
                                </span>
                                <span className="font-semibold">
                                    £{assemblyTotal * 30}
                                </span>
                            </div>

                            {data.packingService && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Packing service
                                    </span>
                                    <span className="font-semibold">
                                        £49
                                    </span>
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
                                Updated total
                            </span>
                            <span className="text-2xl font-black text-[#C0392B]">
                                £{basePrice}
                            </span>
                        </div>

                        <p className="text-xs text-gray-500 mt-3">
                            The total updates automatically when an add-on item is selected.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}