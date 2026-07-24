import React, { useEffect, useMemo, useState } from "react";
import {
    FiAlertTriangle, FiBox, FiCheck, FiChevronDown, FiEdit2, FiLayers,
    FiPackage, FiPauseCircle, FiPlayCircle, FiPlus, FiSearch, FiTrash2, FiX
} from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../../api/api";
import InventoryFormModal from "../../../components/admin/InventoryFormModal";
import ConfirmDialog from "../../../components/admin/ConfirmDialog";

const flattenItems = service => {
    if (!service?.categories) return [];
    return service.categories.flatMap(category =>
        (category.items || []).map(item => ({
            ...item,
            categoryId: category._id,
            categoryName: category.name
        }))
    );
};

const cleanItem = item => {
    const { categoryId, categoryName, ...rest } = item;
    return rest;
};

function InventoryLoader() {
    return (
        <div className="flex flex-col items-center justify-center py-32">
            <div className="relative mb-5 h-16 w-16">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#C0392B]" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-3 w-3 animate-pulse rounded-full bg-[#C0392B]/20" />
                </div>
            </div>
            <p className="text-sm font-semibold tracking-wide text-gray-400">Loading Inventory...</p>
            <p className="mt-1 text-xs text-gray-300">Fetching services, categories and items</p>
        </div>
    );
}

export default function Inventory() {
    const [services, setServices] = useState([]);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState("all");
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [modal, setModal] = useState(null);
    const [modalError, setModalError] = useState("");
    const [confirm, setConfirm] = useState(null);

    const currentService = services.find(service => service._id === selectedServiceId) || null;
    const categories = currentService?.categories || [];
    const currentItems = useMemo(() => flattenItems(currentService), [currentService]);
    const pausedItems = useMemo(() => currentItems.filter(item => item.isPaused), [currentItems]);

    const filteredItems = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return currentItems.filter(item => {
            const categoryMatch = selectedCategoryId === "all" || item.categoryId === selectedCategoryId;
            const searchMatch = !query ||
                item.name.toLowerCase().includes(query) ||
                item.categoryName.toLowerCase().includes(query);

            return categoryMatch && searchMatch;
        });
    }, [currentItems, selectedCategoryId, searchQuery]);

    const allFilteredIds = filteredItems.map(item => item._id);
    const allSelected = allFilteredIds.length > 0 && allFilteredIds.every(id => selectedIds.includes(id));
    const selectedItems = currentItems.filter(item => selectedIds.includes(item._id));
    const selectedAllPaused = selectedItems.length > 0 && selectedItems.every(item => item.isPaused);

    useEffect(() => {
        const loadServices = async () => {
            try {
                const res = await api.get("/inventory/services");
                const data = res.data.data || [];
                setServices(data);
                setSelectedServiceId(data[0]?._id || null);
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to load inventory.");
            } finally {
                setPageLoading(false);
            }
        };

        loadServices();
    }, []);

    const updateCurrentService = updater => {
        setServices(prev => prev.map(service =>
            service._id === selectedServiceId ? updater(service) : service
        ));
    };

    const resetView = () => {
        setSelectedCategoryId("all");
        setSelectedIds([]);
        setSearchQuery("");
    };

    const selectService = id => {
        setSelectedServiceId(id);
        setDropdownOpen(false);
        resetView();
    };

    const selectCategory = id => {
        setSelectedCategoryId(id);
        setSelectedIds([]);
    };

    const openModal = (type, mode, data = null) => {
        setModalError("");
        setModal({ type, mode, data });
    };

    const closeModal = () => {
        if (actionLoading) return;
        setModal(null);
        setModalError("");
    };

    const handleFormSubmit = async values => {
        if (!modal) return;
        setActionLoading(true);
        setModalError("");

        try {
            if (modal.type === "service" && modal.mode === "add") {
                const res = await api.post("/inventory/services", values);
                const service = res.data.data;

                setServices(prev => [...prev, service]);
                setSelectedServiceId(service._id);
                resetView();
                toast.success(`"${service.label}" service added.`);
            }

            if (modal.type === "service" && modal.mode === "edit") {
                const res = await api.put(`/inventory/services/${modal.data._id}`, values);
                const updated = res.data.data;

                setServices(prev => prev.map(service =>
                    service._id === updated._id ? updated : service
                ));
                toast.success("Service updated.");
            }

            if (modal.type === "category" && modal.mode === "add") {
                const res = await api.post(
                    `/inventory/services/${selectedServiceId}/categories`,
                    values
                );
                const category = res.data.data;

                updateCurrentService(service => ({
                    ...service,
                    categories: [...(service.categories || []), category]
                }));
                setSelectedCategoryId(category._id);
                setSelectedIds([]);
                toast.success(`"${category.name}" category added.`);
            }

            if (modal.type === "category" && modal.mode === "edit") {
                const res = await api.put(
                    `/inventory/services/${selectedServiceId}/categories/${modal.data._id}`,
                    values
                );
                const updated = res.data.data;

                updateCurrentService(service => ({
                    ...service,
                    categories: service.categories.map(category =>
                        category._id === updated._id
                            ? { ...category, ...updated }
                            : category
                    )
                }));
                toast.success("Category updated.");
            }

            if (modal.type === "item" && modal.mode === "add") {
                const res = await api.post(
                    `/inventory/services/${selectedServiceId}/items`,
                    values
                );
                const added = res.data.data;
                const categoryId = String(added.categoryId);
                const item = cleanItem(added);

                updateCurrentService(service => ({
                    ...service,
                    categories: service.categories.map(category =>
                        category._id === categoryId
                            ? { ...category, items: [...(category.items || []), item] }
                            : category
                    )
                }));
                toast.success(`"${item.name}" added.`);
            }

            if (modal.type === "item" && modal.mode === "edit") {
                const res = await api.put(
                    `/inventory/services/${selectedServiceId}/items/${modal.data._id}`,
                    values
                );
                const updated = res.data.data;
                const targetCategoryId = String(updated.categoryId);
                const item = cleanItem(updated);

                updateCurrentService(service => ({
                    ...service,
                    categories: service.categories.map(category => {
                        const remaining = (category.items || []).filter(existing => existing._id !== item._id);

                        return category._id === targetCategoryId
                            ? { ...category, items: [...remaining, item] }
                            : { ...category, items: remaining };
                    })
                }));
                toast.success("Item updated.");
            }

            setModal(null);
        } catch (err) {
            setModalError(err.response?.data?.message || "Something went wrong.");
        } finally {
            setActionLoading(false);
        }
    };

    const askDeleteService = service => {
        setDropdownOpen(false);
        setConfirm({
            type: "service",
            id: service._id,
            title: "Delete Service?",
            message: `You are about to delete "${service.label}".`,
            warning: "All categories and items inside this service will also be permanently deleted."
        });
    };

    const askDeleteCategory = category => {
        setConfirm({
            type: "category",
            id: category._id,
            title: "Delete Category?",
            message: `You are about to delete "${category.name}".`,
            warning: "All items inside this category will also be permanently deleted."
        });
    };

    const askDeleteItem = item => {
        setConfirm({
            type: "item",
            id: item._id,
            title: "Delete Item?",
            message: `You are about to delete "${item.name}".`,
            warning: "This action cannot be undone."
        });
    };

    const handleDelete = async () => {
        if (!confirm) return;
        setActionLoading(true);

        try {
            if (confirm.type === "service") {
                await api.delete(`/inventory/services/${confirm.id}`);

                const remaining = services.filter(service => service._id !== confirm.id);
                setServices(remaining);

                if (selectedServiceId === confirm.id) {
                    setSelectedServiceId(remaining[0]?._id || null);
                    resetView();
                }

                toast.success("Service deleted.");
            }

            if (confirm.type === "category") {
                await api.delete(
                    `/inventory/services/${selectedServiceId}/categories/${confirm.id}`
                );

                updateCurrentService(service => ({
                    ...service,
                    categories: service.categories.filter(category => category._id !== confirm.id)
                }));

                if (selectedCategoryId === confirm.id) setSelectedCategoryId("all");
                setSelectedIds([]);
                toast.success("Category deleted.");
            }

            if (confirm.type === "item") {
                await api.delete(
                    `/inventory/services/${selectedServiceId}/items/${confirm.id}`
                );

                updateCurrentService(service => ({
                    ...service,
                    categories: service.categories.map(category => ({
                        ...category,
                        items: (category.items || []).filter(item => item._id !== confirm.id)
                    }))
                }));

                setSelectedIds(prev => prev.filter(id => id !== confirm.id));
                toast.success("Item deleted.");
            }

            setConfirm(null);
        } catch (err) {
            toast.error(err.response?.data?.message || "Delete failed.");
        } finally {
            setActionLoading(false);
        }
    };

    const togglePauseItem = async item => {
        setActionLoading(true);

        try {
            const res = await api.patch(
                `/inventory/services/${selectedServiceId}/items/${item._id}/pause`
            );
            const updated = res.data.data;

            updateCurrentService(service => ({
                ...service,
                categories: service.categories.map(category => ({
                    ...category,
                    items: (category.items || []).map(existing =>
                        existing._id === item._id
                            ? { ...existing, isPaused: updated.isPaused }
                            : existing
                    )
                }))
            }));

            toast.success(updated.isPaused ? "Item paused." : "Item resumed.");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update item.");
        } finally {
            setActionLoading(false);
        }
    };

    const toggleSelectOne = id => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (allSelected) {
            setSelectedIds(prev => prev.filter(id => !allFilteredIds.includes(id)));
            return;
        }

        setSelectedIds(prev => [...new Set([...prev, ...allFilteredIds])]);
    };

    const bulkPause = async () => {
        if (!selectedIds.length) return;

        const pause = !selectedAllPaused;
        setActionLoading(true);

        try {
            await api.patch(
                `/inventory/services/${selectedServiceId}/items/bulk-pause`,
                { itemIds: selectedIds, pause }
            );

            updateCurrentService(service => ({
                ...service,
                categories: service.categories.map(category => ({
                    ...category,
                    items: (category.items || []).map(item =>
                        selectedIds.includes(item._id)
                            ? { ...item, isPaused: pause }
                            : item
                    )
                }))
            }));

            toast.success(`${selectedIds.length} item(s) ${pause ? "paused" : "resumed"}.`);
            setSelectedIds([]);
        } catch (err) {
            toast.error(err.response?.data?.message || "Bulk action failed.");
        } finally {
            setActionLoading(false);
        }
    };

    const bulkDelete = async () => {
        if (!selectedIds.length) return;
        setActionLoading(true);

        try {
            await api.delete(
                `/inventory/services/${selectedServiceId}/items/bulk-delete`,
                { data: { itemIds: selectedIds } }
            );

            updateCurrentService(service => ({
                ...service,
                categories: service.categories.map(category => ({
                    ...category,
                    items: (category.items || []).filter(item => !selectedIds.includes(item._id))
                }))
            }));

            toast.success(`${selectedIds.length} item(s) deleted.`);
            setSelectedIds([]);
        } catch (err) {
            toast.error(err.response?.data?.message || "Bulk delete failed.");
        } finally {
            setActionLoading(false);
        }
    };

    const resumeAll = async () => {
        const ids = pausedItems.map(item => item._id);
        if (!ids.length) return;

        setActionLoading(true);

        try {
            await api.patch(
                `/inventory/services/${selectedServiceId}/items/bulk-pause`,
                { itemIds: ids, pause: false }
            );

            updateCurrentService(service => ({
                ...service,
                categories: service.categories.map(category => ({
                    ...category,
                    items: (category.items || []).map(item =>
                        ids.includes(item._id) ? { ...item, isPaused: false } : item
                    )
                }))
            }));

            toast.success("All paused items resumed.");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to resume items.");
        } finally {
            setActionLoading(false);
        }
    };

    if (pageLoading) return <InventoryLoader />;

    return (
        <div className="mx-auto max-w-6xl">
            <div className="mb-8">
                <div className="mb-1 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C0392B]/10">
                        <FiPackage size={20} className="text-[#C0392B]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
                        <p className="mt-0.5 text-sm text-gray-500">
                            Manage services, categories and inventory items
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="relative z-50">
                    <button
                        onClick={() => setDropdownOpen(prev => !prev)}
                        className="flex min-w-60 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 transition hover:border-[#C0392B]/40 focus:outline-none focus:ring-2 focus:ring-[#C0392B]/20"
                    >
                        <span className="h-2 w-2 shrink-0 rounded-full bg-[#C0392B]" />
                        <span className="grow text-left text-sm font-semibold text-gray-800">
                            {currentService?.label || "Select Service"}
                        </span>
                        <FiChevronDown
                            size={16}
                            className={`text-gray-400 transition ${dropdownOpen ? "rotate-180" : ""}`}
                        />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute left-0 top-full mt-2 min-w-65 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                            {services.map(service => (
                                <div
                                    key={service._id}
                                    className={`flex items-center gap-2 px-3 py-2.5 ${selectedServiceId === service._id
                                            ? "bg-[#C0392B] text-white"
                                            : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    <button
                                        onClick={() => selectService(service._id)}
                                        className="flex flex-1 items-center gap-2 text-left text-sm font-medium"
                                    >
                                        {selectedServiceId === service._id
                                            ? <FiCheck size={13} />
                                            : <span className="w-3.25" />
                                        }
                                        <span className="truncate">{service.label}</span>
                                    </button>

                                    <button
                                        onClick={() => openModal("service", "edit", service)}
                                        className={`flex h-7 w-7 items-center justify-center rounded-lg ${selectedServiceId === service._id
                                                ? "text-white/80 hover:bg-white/20"
                                                : "text-gray-400 hover:bg-amber-50 hover:text-amber-500"
                                            }`}
                                    >
                                        <FiEdit2 size={12} />
                                    </button>

                                    <button
                                        onClick={() => askDeleteService(service)}
                                        className={`flex h-7 w-7 items-center justify-center rounded-lg ${selectedServiceId === service._id
                                                ? "text-white/80 hover:bg-white/20"
                                                : "text-gray-400 hover:bg-red-50 hover:text-[#C0392B]"
                                            }`}
                                    >
                                        <FiTrash2 size={12} />
                                    </button>
                                </div>
                            ))}

                            <div className="border-t border-gray-100 p-2">
                                <button
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        openModal("service", "add");
                                    }}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#C0392B] hover:bg-red-50"
                                >
                                    <FiPlus size={14} />
                                    Add New Service
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="rounded-lg bg-gray-100 px-3 py-1.5 font-semibold text-gray-600">
                        {categories.length} Categories
                    </span>
                    <span className="rounded-lg bg-gray-100 px-3 py-1.5 font-semibold text-gray-600">
                        {currentItems.length} Items
                    </span>
                    {pausedItems.length > 0 && (
                        <span className="rounded-lg bg-amber-100 px-3 py-1.5 font-semibold text-amber-600">
                            {pausedItems.length} Paused
                        </span>
                    )}
                </div>
            </div>

            {currentService && (
                <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/60 px-5 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C0392B]/10">
                                <FiLayers size={17} className="text-[#C0392B]" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-gray-800">Service Categories</h2>
                                <p className="text-xs text-gray-400">Organize items inside categories</p>
                            </div>
                        </div>

                        <button
                            onClick={() => openModal("category", "add")}
                            disabled={actionLoading}
                            className="flex items-center gap-2 rounded-xl border border-[#C0392B]/20 bg-red-50 px-4 py-2 text-xs font-bold text-[#C0392B] hover:bg-red-100 disabled:opacity-50"
                        >
                            <FiPlus size={14} />
                            Add Category
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 p-4">
                        <button
                            onClick={() => selectCategory("all")}
                            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${selectedCategoryId === "all"
                                    ? "border-[#C0392B] bg-[#C0392B] text-white"
                                    : "border-gray-200 bg-white text-gray-600 hover:border-[#C0392B]/40"
                                }`}
                        >
                            All Items
                            <span className={`ml-2 rounded-md px-1.5 py-0.5 text-[10px] ${selectedCategoryId === "all" ? "bg-white/20" : "bg-gray-100"
                                }`}>
                                {currentItems.length}
                            </span>
                        </button>

                        {categories.map(category => (
                            <div
                                key={category._id}
                                className={`flex items-center overflow-hidden rounded-xl border transition ${selectedCategoryId === category._id
                                        ? "border-[#C0392B] bg-[#C0392B] text-white"
                                        : "border-gray-200 bg-white text-gray-600 hover:border-[#C0392B]/40"
                                    }`}
                            >
                                <button
                                    onClick={() => selectCategory(category._id)}
                                    className="px-4 py-2 text-sm font-semibold"
                                >
                                    {category.name}
                                    <span className={`ml-2 rounded-md px-1.5 py-0.5 text-[10px] ${selectedCategoryId === category._id
                                            ? "bg-white/20"
                                            : "bg-gray-100"
                                        }`}>
                                        {category.items?.length || 0}
                                    </span>
                                </button>

                                <div className={`flex border-l ${selectedCategoryId === category._id
                                        ? "border-white/20"
                                        : "border-gray-100"
                                    }`}>
                                    <button
                                        onClick={() => openModal("category", "edit", category)}
                                        className={`flex h-9 w-8 items-center justify-center ${selectedCategoryId === category._id
                                                ? "hover:bg-white/20"
                                                : "text-gray-400 hover:bg-amber-50 hover:text-amber-500"
                                            }`}
                                    >
                                        <FiEdit2 size={11} />
                                    </button>
                                    <button
                                        onClick={() => askDeleteCategory(category)}
                                        className={`flex h-9 w-8 items-center justify-center ${selectedCategoryId === category._id
                                                ? "hover:bg-white/20"
                                                : "text-gray-400 hover:bg-red-50 hover:text-[#C0392B]"
                                            }`}
                                    >
                                        <FiTrash2 size={11} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!currentService ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
                    <FiPackage size={42} className="mx-auto mb-3 text-gray-300" />
                    <h3 className="font-bold text-gray-700">No service available</h3>
                    <p className="mt-1 text-sm text-gray-400">Create your first service to start inventory.</p>
                    <button
                        onClick={() => openModal("service", "add")}
                        className="mx-auto mt-5 flex items-center gap-2 rounded-xl bg-[#C0392B] px-5 py-2.5 text-sm font-bold text-white"
                    >
                        <FiPlus />
                        Add Service
                    </button>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/60 px-6 py-4">
                        <div>
                            <h2 className="font-bold text-gray-800">
                                {selectedCategoryId === "all"
                                    ? `${currentService.label} Items`
                                    : `${categories.find(category => category._id === selectedCategoryId)?.name || ""} Items`
                                }
                            </h2>
                            <p className="mt-0.5 text-xs text-gray-400">
                                {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""} listed
                            </p>
                        </div>

                        <button
                            onClick={() => openModal("item", "add")}
                            disabled={actionLoading || categories.length === 0}
                            title={categories.length === 0 ? "Add a category first" : ""}
                            className="flex items-center gap-2 rounded-xl bg-[#C0392B] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <FiPlus size={15} />
                            Add New Item
                        </button>
                    </div>

                    {categories.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <FiLayers size={42} className="mb-3 text-gray-300" />
                            <h3 className="font-bold text-gray-700">Create a category first</h3>
                            <p className="mt-1 text-sm text-gray-400">
                                Items must be saved inside a service category.
                            </p>
                            <button
                                onClick={() => openModal("category", "add")}
                                className="mt-5 flex items-center gap-2 rounded-xl bg-[#C0392B] px-5 py-2.5 text-sm font-bold text-white"
                            >
                                <FiPlus />
                                Add Category
                            </button>
                        </div>
                    ) : (
                        <>
                            {selectedIds.length > 0 && (
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 bg-[#1a1a1a] px-6 py-3 text-white">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-semibold">
                                            {selectedIds.length} item{selectedIds.length !== 1 ? "s" : ""} selected
                                        </span>
                                        <button
                                            onClick={() => setSelectedIds([])}
                                            className="text-xs text-gray-400 underline underline-offset-2 hover:text-white"
                                        >
                                            Clear
                                        </button>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={bulkPause}
                                            disabled={actionLoading}
                                            className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-400/20 disabled:opacity-50"
                                        >
                                            {selectedAllPaused
                                                ? <FiPlayCircle size={13} />
                                                : <FiPauseCircle size={13} />
                                            }
                                            {selectedAllPaused ? "Resume" : "Pause"}
                                        </button>

                                        <button
                                            onClick={bulkDelete}
                                            disabled={actionLoading}
                                            className="flex items-center gap-1.5 rounded-lg bg-[#C0392B] px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                                        >
                                            <FiTrash2 size={13} />
                                            Delete Selected
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="border-b border-gray-100 px-6 py-3">
                                <div className="relative">
                                    <FiSearch
                                        size={15}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        value={searchQuery}
                                        onChange={e => {
                                            setSearchQuery(e.target.value);
                                            setSelectedIds([]);
                                        }}
                                        placeholder="Search item or category..."
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]/20"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => {
                                                setSearchQuery("");
                                                setSelectedIds([]);
                                            }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                                        >
                                            <FiX size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {filteredItems.length > 0 && (
                                <div className="flex items-center gap-2.5 border-b border-gray-100 bg-gray-50/60 px-4 py-2.5 md:hidden">
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={toggleSelectAll}
                                        className="h-4 w-4 cursor-pointer accent-[#C0392B]"
                                    />
                                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        {allSelected ? "Deselect All" : "Select All"}
                                    </span>
                                </div>
                            )}

                            <div className="hidden grid-cols-[40px_1fr_180px_100px_150px] gap-3 border-b border-gray-100 bg-gray-50 px-6 py-3 md:grid">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={toggleSelectAll}
                                    className="h-4 w-4 cursor-pointer accent-[#C0392B]"
                                />
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Item Name
                                </span>
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Category
                                </span>
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Volume
                                </span>
                                <span className="text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Actions
                                </span>
                            </div>

                            {filteredItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                                    <FiBox size={42} className="mb-3 opacity-30" />
                                    <p className="font-semibold text-gray-500">
                                        {searchQuery ? `No results for "${searchQuery}"` : "No items in this category"}
                                    </p>
                                    <p className="mt-1 text-sm">
                                        {searchQuery ? "Try another search term" : "Click Add New Item to get started"}
                                    </p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-100">
                                    {filteredItems.map((item, index) => {
                                        const isSelected = selectedIds.includes(item._id);

                                        return (
                                            <li
                                                key={item._id}
                                                className={`transition ${isSelected
                                                        ? "bg-red-50/50"
                                                        : item.isPaused
                                                            ? "bg-gray-100/80 opacity-65"
                                                            : "hover:bg-gray-50/70"
                                                    }`}
                                            >
                                                <div className="hidden grid-cols-[40px_1fr_180px_100px_150px] items-center gap-3 px-6 py-4 md:grid">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleSelectOne(item._id)}
                                                        className="h-4 w-4 cursor-pointer accent-[#C0392B]"
                                                    />

                                                    <div className="flex min-w-0 items-center gap-3">
                                                        <span className="w-5 shrink-0 text-right font-mono text-xs text-gray-300">
                                                            {index + 1}
                                                        </span>
                                                        <div className="min-w-0">
                                                            <p className={`truncate text-sm font-semibold ${item.isPaused
                                                                    ? "text-gray-400 line-through"
                                                                    : "text-gray-800"
                                                                }`}>
                                                                {item.name}
                                                            </p>
                                                            {item.isPaused && (
                                                                <span className="mt-1 inline-block rounded bg-gray-200 px-1.5 py-0.5 text-[9px] font-bold text-gray-500">
                                                                    PAUSED
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <span className="w-fit rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                                                        {item.categoryName}
                                                    </span>

                                                    <div>
                                                        <span className="text-sm font-bold text-gray-700">
                                                            {item.volume}
                                                        </span>
                                                        <span className="ml-1 text-[10px] font-medium text-gray-400">
                                                            m³
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-end gap-1.5">
                                                        <button
                                                            onClick={() => togglePauseItem(item)}
                                                            disabled={actionLoading}
                                                            title={item.isPaused ? "Resume" : "Pause"}
                                                            className={`flex h-8 w-8 items-center justify-center rounded-lg transition disabled:opacity-50 ${item.isPaused
                                                                    ? "text-emerald-500 hover:bg-emerald-50"
                                                                    : "text-gray-400 hover:bg-amber-50 hover:text-amber-500"
                                                                }`}
                                                        >
                                                            {item.isPaused
                                                                ? <FiPlayCircle size={15} />
                                                                : <FiPauseCircle size={15} />
                                                            }
                                                        </button>

                                                        <button
                                                            onClick={() => openModal("item", "edit", item)}
                                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-amber-50 hover:text-amber-500"
                                                            title="Edit"
                                                        >
                                                            <FiEdit2 size={14} />
                                                        </button>

                                                        <button
                                                            onClick={() => askDeleteItem(item)}
                                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-[#C0392B]"
                                                            title="Delete"
                                                        >
                                                            <FiTrash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="px-4 py-4 md:hidden">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex min-w-0 items-start gap-2.5">
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={() => toggleSelectOne(item._id)}
                                                                className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[#C0392B]"
                                                            />

                                                            <div className="min-w-0">
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <p className={`text-sm font-bold ${item.isPaused
                                                                            ? "text-gray-400 line-through"
                                                                            : "text-gray-800"
                                                                        }`}>
                                                                        {item.name}
                                                                    </p>

                                                                    {item.isPaused && (
                                                                        <span className="rounded bg-gray-200 px-1.5 py-0.5 text-[9px] font-bold text-gray-500">
                                                                            PAUSED
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                                                    <span className="rounded-lg bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
                                                                        {item.categoryName}
                                                                    </span>
                                                                    <span className="rounded-lg bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
                                                                        {item.volume} m³
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex shrink-0 gap-1">
                                                            <button
                                                                onClick={() => togglePauseItem(item)}
                                                                disabled={actionLoading}
                                                                className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.isPaused
                                                                        ? "text-emerald-500 hover:bg-emerald-50"
                                                                        : "text-gray-400 hover:bg-amber-50 hover:text-amber-500"
                                                                    }`}
                                                            >
                                                                {item.isPaused
                                                                    ? <FiPlayCircle size={14} />
                                                                    : <FiPauseCircle size={14} />
                                                                }
                                                            </button>
                                                            <button
                                                                onClick={() => openModal("item", "edit", item)}
                                                                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-amber-50 hover:text-amber-500"
                                                            >
                                                                <FiEdit2 size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => askDeleteItem(item)}
                                                                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-[#C0392B]"
                                                            >
                                                                <FiTrash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </>
                    )}
                </div>
            )}

            {pausedItems.length > 0 && (
                <div className="mt-6 overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 bg-amber-50/60 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100">
                                <FiPauseCircle size={17} className="text-amber-600" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-gray-800">Paused Items</h2>
                                <p className="mt-0.5 text-xs text-amber-600">
                                    {pausedItems.length} item{pausedItems.length !== 1 ? "s" : ""} currently paused
                                </p>
                            </div>
                        </div>

                        {pausedItems.length > 1 && (
                            <button
                                onClick={resumeAll}
                                disabled={actionLoading}
                                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-600 disabled:opacity-50"
                            >
                                <FiPlayCircle size={14} />
                                Resume All
                            </button>
                        )}
                    </div>

                    <ul className="divide-y divide-amber-50">
                        {pausedItems.map(item => (
                            <li
                                key={item._id}
                                className="flex items-center justify-between gap-3 px-6 py-3.5 hover:bg-amber-50/40"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-gray-500 line-through">
                                        {item.name}
                                    </p>
                                    <div className="mt-1 flex flex-wrap items-center gap-2">
                                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-600">
                                            {item.categoryName}
                                        </span>
                                        <span className="text-xs text-gray-400">{item.volume} m³</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => togglePauseItem(item)}
                                    disabled={actionLoading}
                                    className="flex shrink-0 items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-100 disabled:opacity-50"
                                >
                                    <FiPlayCircle size={12} />
                                    Resume
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <InventoryFormModal
                open={Boolean(modal)}
                type={modal?.type}
                mode={modal?.mode}
                initialData={modal?.data}
                categories={categories}
                loading={actionLoading}
                error={modalError}
                onClose={closeModal}
                onSubmit={handleFormSubmit}
            />

            <ConfirmDialog
                open={Boolean(confirm)}
                title={confirm?.title}
                message={confirm?.message}
                warning={confirm?.warning}
                loading={actionLoading}
                onCancel={() => !actionLoading && setConfirm(null)}
                onConfirm={handleDelete}
            />

            {dropdownOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                />
            )}
        </div>
    );
}