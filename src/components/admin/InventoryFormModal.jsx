import React, { useEffect, useState } from "react";
import { FiAlertTriangle, FiBox, FiLayers, FiPackage, FiX } from "react-icons/fi";

const config = {
    service: {
        addTitle: "Add New Service",
        editTitle: "Edit Service",
        label: "Service Name",
        placeholder: "e.g. House Moving",
        Icon: FiPackage
    },
    category: {
        addTitle: "Add New Category",
        editTitle: "Edit Category",
        label: "Category Name",
        placeholder: "e.g. Living Room",
        Icon: FiLayers
    },
    item: {
        addTitle: "Add New Item",
        editTitle: "Edit Item",
        Icon: FiBox
    }
};

export default function InventoryFormModal({
    open, type, mode, initialData, categories = [], loading, error, onClose, onSubmit
}) {
    const [name, setName] = useState("");
    const [volume, setVolume] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [localError, setLocalError] = useState("");

    useEffect(() => {
        if (!open) return;
        setLocalError("");
        setName(type === "service" ? initialData?.label || "" : initialData?.name || "");
        setVolume(type === "item" ? String(initialData?.volume || "") : "");
        setCategoryId(type === "item" ? (initialData?.categoryId || categories[0]?._id || "") : "");
    }, [open, type, initialData, categories]);

    if (!open) return null;

    const current = config[type];
    const Icon = current.Icon;
    const title = mode === "add" ? current.addTitle : current.editTitle;

    const submit = e => {
        e.preventDefault();
        const trimmedName = name.trim();

        if (!trimmedName) {
            setLocalError(`${type === "service" ? "Service" : type === "category" ? "Category" : "Item"} name is required.`);
            return;
        }

        if (type === "item") {
            const parsedVolume = Number(volume);

            if (!categoryId) {
                setLocalError("Please select a category.");
                return;
            }

            if (!Number.isFinite(parsedVolume) || parsedVolume <= 0) {
                setLocalError("Enter a valid volume (m³).");
                return;
            }

            onSubmit({ name: trimmedName, volume: parsedVolume, categoryId });
            return;
        }

        onSubmit(type === "service" ? { label: trimmedName } : { name: trimmedName });
    };

    return (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
            <form onSubmit={submit} className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C0392B]/10">
                            <Icon size={17} className="text-[#C0392B]" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">{title}</h3>
                            <p className="text-xs text-gray-400">
                                {type === "item" ? "Select its category and volume" : `Manage inventory ${type}`}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                    >
                        <FiX size={17} />
                    </button>
                </div>

                <div className="space-y-4 px-6 py-5">
                    {type === "item" && (
                        <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Category
                            </label>
                            <select
                                value={categoryId}
                                onChange={e => {
                                    setCategoryId(e.target.value);
                                    setLocalError("");
                                }}
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]/20"
                            >
                                <option value="">Select category</option>
                                {categories.map(category => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                            {type === "item" ? "Item Name" : current.label}
                        </label>
                        <input
                            value={name}
                            onChange={e => {
                                setName(e.target.value);
                                setLocalError("");
                            }}
                            placeholder={type === "item" ? "e.g. Three Seater Sofa" : current.placeholder}
                            autoFocus
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]/20"
                        />
                    </div>

                    {type === "item" && (
                        <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Volume
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={volume}
                                    onChange={e => {
                                        setVolume(e.target.value);
                                        setLocalError("");
                                    }}
                                    placeholder="0.00"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]/20"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                                    m³
                                </span>
                            </div>
                        </div>
                    )}

                    {(localError || error) && (
                        <div className="flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-xs font-medium text-[#C0392B]">
                            <FiAlertTriangle size={14} className="mt-0.5 shrink-0" />
                            <span>{localError || error}</span>
                        </div>
                    )}
                </div>

                <div className="flex gap-3 px-6 pb-6">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#C0392B] py-2.5 text-sm font-bold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading && (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        )}
                        {mode === "add" ? `Add ${type === "item" ? "Item" : type === "category" ? "Category" : "Service"}` : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}