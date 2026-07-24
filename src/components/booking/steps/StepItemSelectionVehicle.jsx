import React, { useEffect, useMemo, useState } from "react";
import { FiMinus, FiPlus, FiTruck, FiX } from "react-icons/fi";
import api from "../../../api/api";

function ItemLoader() {
    return (
        <div className="flex flex-col items-center justify-center py-10">
            <div className="relative w-10 h-10 mb-3">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#1a1a1a] animate-spin" />
            </div>
            <p className="text-sm text-gray-400">Loading categories...</p>
        </div>
    );
}

export default function StepItemSelectionVehicle({
    items, onChange, error, serviceType
}) {
    const [name, setName] = useState("");
    const [weight, setWeight] = useState("");
    const [notes, setNotes] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            setCategories([]);
            setSelectedCategoryId("");
            setSelectedInventoryItem(null);

            try {
                const res = await api.get("/inventory/services");
                const services = res.data?.data || [];
                const matched = services.find(service => service.slug === serviceType);
                const serviceCategories = matched?.categories || [];

                setCategories(serviceCategories);
                setSelectedCategoryId(serviceCategories[0]?._id || "");
            } catch (err) {
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [serviceType]);

    const selectedCategory = useMemo(
        () => categories.find(category => category._id === selectedCategoryId) || null,
        [categories, selectedCategoryId]
    );

    const categoryItems = useMemo(
        () => (selectedCategory?.items || []).filter(item => !item.isPaused),
        [selectedCategory]
    );

    const sameItem = (selected, source) => {
        const selectedId = selected.itemId || selected._id;
        const sourceId = source.itemId || source._id;

        if (selectedId && sourceId) return selectedId === sourceId;
        return selected.name.toLowerCase() === source.name.toLowerCase();
    };

    const handleNameChange = value => {
        setName(value);

        if (
            selectedInventoryItem &&
            value.trim() !== selectedInventoryItem.name
        ) {
            setSelectedInventoryItem(null);
        }
    };

    const quickAdd = item => {
        setName(item.name);
        setSelectedInventoryItem({
            ...item,
            itemId: item._id,
            categoryId: selectedCategory?._id,
            categoryName: selectedCategory?.name
        });
    };

    const handleAdd = () => {
        const itemName = name.trim();
        if (!itemName) return;

        const source = selectedInventoryItem || {
            name: itemName,
            custom: true
        };

        const existing = items.find(item => sameItem(item, source));

        if (existing) {
            onChange(items.map(item =>
                sameItem(item, source)
                    ? {
                        ...item,
                        quantity: item.quantity + 1,
                        weight: weight ? Number(weight) : item.weight,
                        notes: notes.trim() || item.notes
                    }
                    : item
            ));
        } else {
            onChange([
                ...items,
                {
                    itemId: selectedInventoryItem?.itemId,
                    name: itemName,
                    volume: selectedInventoryItem?.volume || 200,
                    categoryId: selectedInventoryItem?.categoryId,
                    categoryName: selectedInventoryItem?.categoryName,
                    weight: weight ? Number(weight) : null,
                    notes: notes.trim(),
                    quantity: 1,
                    custom: !selectedInventoryItem
                }
            ]);
        }

        setName("");
        setWeight("");
        setNotes("");
        setSelectedInventoryItem(null);
    };

    const handleRemove = item => {
        const existing = items.find(selected => sameItem(selected, item));
        if (!existing) return;

        if (existing.quantity > 1) {
            onChange(items.map(selected =>
                sameItem(selected, item)
                    ? { ...selected, quantity: selected.quantity - 1 }
                    : selected
            ));
        } else {
            onChange(items.filter(selected => !sameItem(selected, item)));
        }
    };

    const handleIncrease = item => {
        onChange(items.map(selected =>
            sameItem(selected, item)
                ? { ...selected, quantity: selected.quantity + 1 }
                : selected
        ));
    };

    const removeItem = item => {
        onChange(items.filter(selected => !sameItem(selected, item)));
    };

    const totalItems = items.reduce(
        (total, item) => total + (item.quantity || 0),
        0
    );

    return (
        <div className="bg-[#F9F8F6] -mx-4 px-4 py-4">
            <div className="max-w-7xl mx-auto mb-3">
                <h3 className="text-xl md:text-2xl font-bold text-[#1a1a1a]">
                    What parts are you moving?
                </h3>
                <p className="text-gray-500 text-xs mt-0.5">
                    Pick a category and add each part with its details.
                </p>
            </div>

            {error && (
                <div className="max-w-7xl mx-auto mb-3 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
                    {error}
                </div>
            )}

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <div
                        className="bg-white rounded-2xl overflow-hidden"
                        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                    >
                        {loading ? (
                            <ItemLoader />
                        ) : categories.length === 0 ? (
                            <div className="py-12 text-center">
                                <FiTruck
                                    size={36}
                                    className="mx-auto mb-3 text-gray-300"
                                />
                                <p className="text-sm text-gray-400">
                                    No categories available.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Categories */}
                                <div className="overflow-x-auto border-b border-gray-200 scrollbar-thin">
                                    <div className="flex min-w-max">
                                        {categories.map(category => {
                                            const isSelected =
                                                selectedCategoryId === category._id;

                                            const activeCount = (category.items || [])
                                                .filter(item => !item.isPaused)
                                                .length;

                                            return (
                                                <button
                                                    key={category._id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedCategoryId(category._id);
                                                        setSelectedInventoryItem(null);
                                                    }}
                                                    className={`relative min-w-37.5 md:min-w-43.75 px-4 py-4 border-r border-gray-200 text-center transition ${isSelected
                                                            ? "bg-red-50 text-[#C0392B]"
                                                            : "bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                                                        }`}
                                                >
                                                    <FiTruck
                                                        size={19}
                                                        className={`mx-auto mb-2 ${isSelected
                                                                ? "text-[#C0392B]"
                                                                : "text-gray-300"
                                                            }`}
                                                    />

                                                    <p className="text-sm font-semibold whitespace-nowrap">
                                                        {category.name}
                                                    </p>

                                                    <p className={`text-[10px] mt-1 ${isSelected
                                                            ? "text-[#C0392B]/70"
                                                            : "text-gray-400"
                                                        }`}>
                                                        {activeCount} part{activeCount !== 1 ? "s" : ""}
                                                    </p>

                                                    {isSelected && (
                                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C0392B]" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="p-4 md:p-5">
                                    {/* Category items */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between gap-3 mb-2">
                                            <div>
                                                <p className="text-sm font-bold text-[#1a1a1a]">
                                                    {selectedCategory?.name}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    Select a part to fill the form
                                                </p>
                                            </div>
                                        </div>

                                        {categoryItems.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {categoryItems.map(item => {
                                                    const isActive =
                                                        selectedInventoryItem?.itemId === item._id;

                                                    return (
                                                        <button
                                                            key={item._id}
                                                            type="button"
                                                            onClick={() => quickAdd(item)}
                                                            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition ${isActive
                                                                    ? "border-[#C0392B] bg-[#C0392B] text-white"
                                                                    : "border-gray-200 text-gray-700 hover:border-[#C0392B] hover:text-[#C0392B]"
                                                                }`}
                                                        >
                                                            {item.name}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-400 italic">
                                                No parts available in this category.
                                            </p>
                                        )}
                                    </div>

                                    {/* Form */}
                                    <div className="space-y-3 border-t border-gray-100 pt-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                                Part name *
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Engine, Door, Tyres"
                                                value={name}
                                                onChange={e => handleNameChange(e.target.value)}
                                                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg outline-none text-sm focus:border-[#C0392B] transition"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                                    Approx. weight (kg)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    placeholder="e.g. 50"
                                                    value={weight}
                                                    onChange={e => setWeight(e.target.value)}
                                                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg outline-none text-sm focus:border-[#C0392B] transition"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                                    Notes (optional)
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Fragile, packed"
                                                    value={notes}
                                                    onChange={e => setNotes(e.target.value)}
                                                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg outline-none text-sm focus:border-[#C0392B] transition"
                                                />
                                            </div>
                                        </div>

                                        {selectedInventoryItem && (
                                            <div className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50 px-3 py-2">
                                                <div>
                                                    <p className="text-xs font-semibold text-[#C0392B]">
                                                        Inventory part selected
                                                    </p>
                                                    <p className="text-[11px] text-gray-500 mt-0.5">
                                                        {selectedInventoryItem.categoryName} · {selectedInventoryItem.volume} m³
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedInventoryItem(null);
                                                        setName("");
                                                    }}
                                                    className="text-gray-400 hover:text-[#C0392B]"
                                                >
                                                    <FiX size={14} />
                                                </button>
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            onClick={handleAdd}
                                            disabled={!name.trim()}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#C0392B] text-white rounded-lg hover:bg-red-800 disabled:opacity-40 disabled:cursor-not-allowed transition text-sm font-semibold"
                                        >
                                            <FiPlus size={16} />
                                            Add part to move
                                        </button>
                                    </div>

                                    <p className="text-xs text-gray-500 mt-4 text-center">
                                        Our team will confirm all details before pickup.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Summary */}
                <div className="lg:col-span-1 flex">
                    <div className="sticky top-20 w-full flex">
                        <div
                            className="bg-white rounded-2xl p-4 flex flex-col w-full h-full"
                            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-base font-bold text-[#1a1a1a]">
                                    Your parts
                                </h4>

                                {totalItems > 0 && (
                                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                        {totalItems} item{totalItems !== 1 ? "s" : ""}
                                    </span>
                                )}
                            </div>

                            {items.length > 0 ? (
                                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                                    {items.map((item, index) => (
                                        <div
                                            key={item.itemId || `${item.name}-${index}`}
                                            className="flex items-center gap-1.5 py-2 border-b border-gray-100 last:border-0"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-700 truncate">
                                                    {item.name}
                                                </p>

                                                {(item.categoryName || item.weight || item.notes) && (
                                                    <p className="text-[10px] text-gray-400 truncate mt-0.5">
                                                        {item.categoryName || ""}
                                                        {item.categoryName && item.weight ? " · " : ""}
                                                        {item.weight ? `${item.weight} kg` : ""}
                                                        {(item.categoryName || item.weight) && item.notes ? " · " : ""}
                                                        {item.notes || ""}
                                                    </p>
                                                )}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleRemove(item)}
                                                className="w-5 h-5 rounded-full border border-gray-200 hover:border-[#C0392B] hover:bg-[#C0392B] hover:text-white text-gray-400 transition flex items-center justify-center shrink-0"
                                            >
                                                <FiMinus size={9} />
                                            </button>

                                            <span className="text-xs font-bold text-[#1a1a1a] w-4 text-center shrink-0">
                                                {item.quantity}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => handleIncrease(item)}
                                                className="w-5 h-5 rounded-full border border-gray-200 hover:border-[#C0392B] hover:bg-[#C0392B] hover:text-white text-gray-400 transition flex items-center justify-center shrink-0"
                                            >
                                                <FiPlus size={9} />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => removeItem(item)}
                                                className="text-gray-300 hover:text-red-500 transition ml-0.5 shrink-0"
                                            >
                                                <FiX size={11} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <FiTruck
                                        size={28}
                                        className="text-gray-300 mx-auto mb-2"
                                    />
                                    <p className="text-gray-400 text-sm">
                                        No parts added yet
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}