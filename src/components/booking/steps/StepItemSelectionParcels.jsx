import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronDown, FiMinus, FiPackage, FiPlus, FiSearch, FiX } from "react-icons/fi";
import api from "../../../api/api";

function ItemLoader() {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="relative mb-3 h-10 w-10">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#1a1a1a]" />
            </div>
            <p className="text-sm text-gray-400">Loading categories...</p>
        </div>
    );
}

export default function StepItemSelectionParcels({ items, onChange, error, serviceType }) {
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [openCategoryId, setOpenCategoryId] = useState(null);
    const [loading, setLoading] = useState(true);
    const categoriesRef = useRef(null);

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            setCategories([]);
            setSearchQuery("");
            setOpenCategoryId(null);

            try {
                const res = await api.get("/inventory/services");
                const services = res.data?.data || [];
                const matched = services.find(service => service.slug === serviceType);
                setCategories(matched?.categories || []);
            } catch (err) {
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [serviceType]);

    useEffect(() => {
        const closeDropdown = e => {
            if (categoriesRef.current && !categoriesRef.current.contains(e.target)) {
                setOpenCategoryId(null);
            }
        };

        document.addEventListener("mousedown", closeDropdown);
        return () => document.removeEventListener("mousedown", closeDropdown);
    }, []);

    const allItems = useMemo(() => {
        return categories.flatMap(category =>
            (category.items || [])
                .filter(item => !item.isPaused)
                .map(item => ({
                    ...item,
                    itemId: item._id,
                    categoryId: category._id,
                    categoryName: category.name
                }))
        );
    }, [categories]);

    const searchResults = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return [];

        return allItems.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.categoryName.toLowerCase().includes(query)
        );
    }, [allItems, searchQuery]);

    const sameItem = (selected, source) => {
        const selectedId = selected.itemId || selected._id;
        const sourceId = source.itemId || source._id;

        if (selectedId && sourceId) return selectedId === sourceId;
        return selected.name === source.name;
    };

    const getCount = item =>
        items.find(selected => sameItem(selected, item))?.quantity || 0;

    const handleAdd = item => {
        const existing = items.find(selected => sameItem(selected, item));

        if (existing) {
            onChange(items.map(selected =>
                sameItem(selected, item)
                    ? { ...selected, quantity: selected.quantity + 1 }
                    : selected
            ));
            return;
        }

        onChange([
            ...items,
            {
                itemId: item.itemId || item._id,
                name: item.name,
                volume: item.volume,
                quantity: 1,
                categoryId: item.categoryId,
                categoryName: item.categoryName
            }
        ]);
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
            return;
        }

        onChange(items.filter(selected => !sameItem(selected, item)));
    };

    const removeItem = item => {
        onChange(items.filter(selected => !sameItem(selected, item)));
    };

    const totalItems = items.reduce(
        (total, item) => total + (item.quantity || 0),
        0
    );

    const renderItem = item => {
        const count = getCount(item);

        return (
            <div
                key={item.itemId || item._id}
                className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-0 hover:bg-gray-50"
            >
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-gray-700">{item.name}</p>
                    <p className="mt-0.5 text-[11px] text-gray-400">
                        {item.volume} m³
                    </p>
                </div>

                {count === 0 ? (
                    <button
                        type="button"
                        onClick={() => handleAdd(item)}
                        className="flex shrink-0 items-center gap-1 text-sm font-medium text-[#C0392B] hover:text-red-700"
                    >
                        <FiPlus size={13} />
                        Add
                    </button>
                ) : (
                    <div className="flex shrink-0 items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => handleRemove(item)}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:border-[#C0392B] hover:bg-[#C0392B] hover:text-white"
                        >
                            <FiMinus size={11} />
                        </button>

                        <span className="w-5 text-center text-xs font-bold text-gray-800">
                            {count}
                        </span>

                        <button
                            type="button"
                            onClick={() => handleAdd(item)}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:border-[#C0392B] hover:bg-[#C0392B] hover:text-white"
                        >
                            <FiPlus size={11} />
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-[#F9F8F6] -mx-4 px-4 py-4">
            <div className="max-w-7xl mx-auto mb-3">
                <h3 className="text-xl md:text-2xl font-bold text-[#1a1a1a]">
                    What are you sending?
                </h3>
                <p className="text-gray-500 text-xs mt-0.5">
                    Search or choose a category, then select your parcels.
                </p>
            </div>

            {error && (
                <div className="max-w-7xl mx-auto mb-3 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
                    {error}
                </div>
            )}

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 lg:items-stretch">
                <div className="flex-1 min-w-0">
                    <div
                        className="h-full rounded-2xl border border-gray-200 bg-white p-4 md:p-6"
                        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
                    >
                        <div className="relative">
                            <FiSearch
                                size={24}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C0392B]"
                            />

                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => {
                                    setSearchQuery(e.target.value);
                                    setOpenCategoryId(null);
                                }}
                                placeholder="Search for parcel or box type"
                                className="h-14 w-full rounded-md border border-gray-400 pl-12 pr-11 text-sm outline-none shadow-sm focus:border-[#C0392B]"
                            />

                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                                >
                                    <FiX size={16} />
                                </button>
                            )}
                        </div>

                        {searchQuery && (
                            <div className="relative z-40 mt-2 max-h-72 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl">
                                {searchResults.length > 0 ? (
                                    searchResults.map(item => (
                                        <div key={item.itemId}>
                                            <div className="bg-gray-50 px-4 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                                {item.categoryName}
                                            </div>
                                            {renderItem(item)}
                                        </div>
                                    ))
                                ) : (
                                    <p className="px-4 py-8 text-center text-sm text-gray-400">
                                        No parcels found for “{searchQuery}”
                                    </p>
                                )}
                            </div>
                        )}

                        {!searchQuery && (
                            <>
                                <p className="mt-6 mb-3 text-sm text-gray-700">
                                    Or quickly add from our parcel categories below:
                                </p>

                                {loading ? (
                                    <ItemLoader />
                                ) : categories.length > 0 ? (
                                    <div
                                        ref={categoriesRef}
                                        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
                                    >
                                        {categories.map(category => {
                                            const isOpen = openCategoryId === category._id;

                                            const categoryItems = (category.items || [])
                                                .filter(item => !item.isPaused)
                                                .map(item => ({
                                                    ...item,
                                                    itemId: item._id,
                                                    categoryId: category._id,
                                                    categoryName: category.name
                                                }));

                                            const selectedCount = categoryItems.reduce(
                                                (total, item) => total + getCount(item),
                                                0
                                            );

                                            return (
                                                <div key={category._id} className="relative">
                                                    <button
                                                        type="button"
                                                        onClick={() => setOpenCategoryId(
                                                            isOpen ? null : category._id
                                                        )}
                                                        className={`flex h-13.25 w-full items-center gap-3 rounded-md border px-3 text-left transition ${isOpen
                                                                ? "border-[#C0392B] bg-[#C0392B] text-white"
                                                                : "border-gray-300 bg-white text-gray-800 hover:border-[#C0392B]"
                                                            }`}
                                                    >
                                                        <FiPackage
                                                            size={22}
                                                            className={isOpen
                                                                ? "text-white"
                                                                : "text-[#C0392B]"
                                                            }
                                                        />

                                                        <span className="min-w-0 flex-1 truncate text-sm font-medium">
                                                            {category.name}
                                                        </span>

                                                        {selectedCount > 0 && (
                                                            <span className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold ${isOpen
                                                                    ? "bg-white text-[#C0392B]"
                                                                    : "bg-red-50 text-[#C0392B]"
                                                                }`}>
                                                                {selectedCount}
                                                            </span>
                                                        )}

                                                        <FiChevronDown
                                                            size={17}
                                                            className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""
                                                                }`}
                                                        />
                                                    </button>

                                                    {isOpen && (
                                                        <div className="relative z-30 mt-2 overflow-hidden rounded-md border border-gray-200 bg-white shadow-xl sm:absolute sm:left-0 sm:top-full sm:w-full sm:min-w-70">
                                                            <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-gray-200 bg-white" />

                                                            <div className="relative max-h-64 overflow-y-auto bg-white">
                                                                {categoryItems.length > 0
                                                                    ? categoryItems.map(renderItem)
                                                                    : (
                                                                        <p className="px-4 py-6 text-center text-sm italic text-gray-400">
                                                                            No parcels available.
                                                                        </p>
                                                                    )
                                                                }
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="py-10 text-center">
                                        <FiPackage
                                            size={38}
                                            className="mx-auto mb-3 text-gray-300"
                                        />
                                        <p className="text-sm text-gray-400">
                                            No parcel categories available.
                                        </p>
                                    </div>
                                )}
                            </>
                        )}

                        <p className="mt-6 text-center text-xs text-gray-400">
                            Exact dimensions will be confirmed before pickup.
                        </p>
                    </div>
                </div>

                <div className="flex w-full lg:w-80">
                    <div className="sticky top-20 flex w-full">
                        <div
                            className="flex h-full w-full flex-col rounded-2xl bg-white p-4"
                            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
                        >
                            <div className="mb-3 flex items-center justify-between gap-2">
                                <h4 className="text-sm font-bold text-[#1a1a1a]">
                                    Your parcels
                                </h4>

                                {totalItems > 0 && (
                                    <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
                                        {totalItems} parcel{totalItems !== 1 ? "s" : ""}
                                    </span>
                                )}
                            </div>

                            {items.length > 0 ? (
                                <div className="max-h-96 space-y-1.5 overflow-y-auto pr-1">
                                    {items.map((item, index) => (
                                        <div
                                            key={item.itemId || `${item.name}-${index}`}
                                            className="border-b border-gray-100 py-2 last:border-0"
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm text-gray-700">
                                                        {item.name}
                                                    </p>
                                                    {item.categoryName && (
                                                        <p className="mt-0.5 truncate text-[10px] text-gray-400">
                                                            {item.categoryName}
                                                        </p>
                                                    )}
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => handleRemove(item)}
                                                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-[#C0392B] hover:bg-[#C0392B] hover:text-white"
                                                >
                                                    <FiMinus size={9} />
                                                </button>

                                                <span className="w-4 shrink-0 text-center text-xs font-bold text-[#1a1a1a]">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() => handleAdd(item)}
                                                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-[#C0392B] hover:bg-[#C0392B] hover:text-white"
                                                >
                                                    <FiPlus size={9} />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item)}
                                                    className="ml-0.5 shrink-0 text-gray-300 hover:text-red-500"
                                                >
                                                    <FiX size={11} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex min-h-56 items-center justify-center">
                                    <p className="text-center text-sm text-gray-400">
                                        No parcels yet.<br />
                                        Select from a category.
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