import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
    FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiPackage, FiChevronDown,
    FiSearch, FiSettings, FiAlertTriangle, FiPlayCircle
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../../api/api';
import AddItemModal from '../../../components/admin/AddItemModal';
import DeleteItemModal from '../../../components/admin/DeleteItemModal';

function InventoryLoader() {
    return (
        <div className="flex flex-col items-center justify-center py-32">
            <div className="relative w-16 h-16 mb-5">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#C0392B] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-[#C0392B]/20 animate-pulse" />
                </div>
            </div>
            <p className="text-sm font-semibold text-gray-400 tracking-wide">Loading Inventory...</p>
            <p className="text-xs text-gray-300 mt-1">Fetching services & items</p>
        </div>
    );
}
function SkeletonRow() {
    return (
        <div className="hidden md:grid grid-cols-[40px_1fr_120px_100px] gap-3 items-center px-6 py-4 animate-pulse">
            <div className="w-4 h-4 rounded bg-gray-100" />
            <div className="h-3.5 bg-gray-100 rounded-lg w-3/4" />
            <div className="h-3.5 bg-gray-100 rounded-lg w-1/2" />
            <div className="flex justify-end gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray-100" />
                <div className="w-8 h-8 rounded-lg bg-gray-100" />
            </div>
        </div>
    );
}

export default function Inventory() {
    // ── Core state ──
    const [services, setServices] = useState([]);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // ── Loading state ──
    const [pageLoading, setPageLoading] = useState(true);
    const [itemsLoading, setItemsLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // ── Service modal state ──
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [serviceModalMode, setServiceModalMode] = useState('add');
    const [serviceModalLabel, setServiceModalLabel] = useState('');
    const [serviceModalError, setServiceModalError] = useState('');
    const [editingServiceId, setEditingServiceId] = useState(null);
    const [deleteServiceId, setDeleteServiceId] = useState(null);

    // ── Add item modal state ──
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemVolume, setNewItemVolume] = useState('');
    const [addError, setAddError] = useState('');

    // ── Inline edit state ──
    const [editingItemId, setEditingItemId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editVolume, setEditVolume] = useState('');

    // ── Delete item state ──
    const [deleteId, setDeleteId] = useState(null);

    // ── Bulk state ──
    const [selectedIds, setSelectedIds] = useState([]);

    // ── Derived values ──
    const currentService = services.find(s => s._id === selectedServiceId) || null;
    const currentItems = currentService?.items || [];

    const pausedItems = useMemo(() =>
        currentItems.filter(it => it.isPaused),
        [currentItems]
    );

    const filteredItems = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return currentItems;
        return currentItems.filter(it => it.name.toLowerCase().includes(q));
    }, [currentItems, searchQuery]);

    const allFilteredIds = filteredItems.map(i => i._id);
    const allSelected = allFilteredIds.length > 0 && allFilteredIds.every(id => selectedIds.includes(id));
    const pausedIds = currentItems.filter(it => it.isPaused).map(it => it._id);

    // ── Fetch all services on mount ─────────────────────────────────────────
    useEffect(() => {
        const fetchServices = async () => {
            setPageLoading(true);
            try {
                const res = await api.get('/inventory/services');
                const data = res.data.data;
                setServices(data);
                if (data.length > 0) setSelectedServiceId(data[0]._id);
            } catch (err) {
                toast.error('Failed to load inventory.');
            } finally {
                setPageLoading(false);
            }
        };
        fetchServices();
    }, []);

    // ────────────────────────────────────────────────────────────────────────
    // SERVICE HANDLERS
    // ────────────────────────────────────────────────────────────────────────
    const openAddService = () => {
        setServiceModalMode('add');
        setServiceModalLabel('');
        setServiceModalError('');
        setShowServiceModal(true);
    };

    const openEditService = (svc) => {
        setServiceModalMode('edit');
        setEditingServiceId(svc._id);
        setServiceModalLabel(svc.label);
        setServiceModalError('');
        setShowServiceModal(true);
        setDropdownOpen(false);
    };

    const handleServiceModalSave = async () => {
        const label = serviceModalLabel.trim();
        if (!label) { setServiceModalError('Service name is required.'); return; }

        setActionLoading(true);
        try {
            if (serviceModalMode === 'add') {
                const res = await api.post('/inventory/services', { label });
                setServices(prev => [...prev, res.data.data]);
                setSelectedServiceId(res.data.data._id);
                toast.success(`"${label}" service added.`);
            } else {
                const res = await api.put(`/inventory/services/${editingServiceId}`, { label });
                setServices(prev =>
                    prev.map(s => s._id === editingServiceId ? res.data.data : s)
                );
                toast.success('Service updated.');
            }
            setShowServiceModal(false);
        } catch (err) {
            const msg = err.response?.data?.message || 'Something went wrong.';
            setServiceModalError(msg);
        } finally {
            setActionLoading(false);
        }
    };

    const confirmDeleteService = async () => {
        setActionLoading(true);
        try {
            await api.delete(`/inventory/services/${deleteServiceId}`);
            const remaining = services.filter(s => s._id !== deleteServiceId);
            setServices(remaining);
            if (selectedServiceId === deleteServiceId) {
                setSelectedServiceId(remaining[0]?._id || null);
            }
            toast.success('Service deleted.');
            setDeleteServiceId(null);
        } catch (err) {
            toast.error('Failed to delete service.');
        } finally {
            setActionLoading(false);
        }
    };

    // ────────────────────────────────────────────────────────────────────────
    // ITEM HANDLERS
    // ────────────────────────────────────────────────────────────────────────

    const openAddModal = () => {
        setAddError('');
        setNewItemName('');
        setNewItemVolume('');
        setShowAddModal(true);
    };

    const handleAddItem = async () => {
        setAddError('');
        const name = newItemName.trim();
        const volume = parseFloat(newItemVolume);
        if (!name) { setAddError('Item name is required.'); return; }
        if (isNaN(volume) || volume <= 0) { setAddError('Enter a valid volume (m³).'); return; }

        setActionLoading(true);
        try {
            const res = await api.post(`/inventory/services/${selectedServiceId}/items`, { name, volume });
            const newItem = res.data.data;
            setServices(prev => prev.map(s =>
                s._id === selectedServiceId
                    ? { ...s, items: [...s.items, newItem] }
                    : s
            ));
            setNewItemName('');
            setNewItemVolume('');
            setShowAddModal(false);
            toast.success(`"${name}" added.`);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to add item.';
            setAddError(msg);
        } finally {
            setActionLoading(false);
        }
    };

    // ── Inline edit ──
    const startEdit = (item) => {
        setEditingItemId(item._id);
        setEditName(item.name);
        setEditVolume(String(item.volume));
        setSelectedIds([]);
    };

    const saveEdit = async (itemId) => {
        const name = editName.trim();
        const volume = parseFloat(editVolume);
        if (!name || isNaN(volume) || volume <= 0) return;

        setActionLoading(true);
        try {
            const res = await api.put(
                `/inventory/services/${selectedServiceId}/items/${itemId}`,
                { name, volume }
            );
            const updated = res.data.data;
            setServices(prev => prev.map(s =>
                s._id === selectedServiceId
                    ? { ...s, items: s.items.map(it => it._id === itemId ? { ...it, ...updated } : it) }
                    : s
            ));
            setEditingItemId(null);
            toast.success('Item updated.');
        } catch (err) {
            toast.error('Failed to update item.');
        } finally {
            setActionLoading(false);
        }
    };

    const cancelEdit = () => setEditingItemId(null);

    // ── Delete item ──
    const handleDelete = async () => {
        setActionLoading(true);
        try {
            await api.delete(`/inventory/services/${selectedServiceId}/items/${deleteId}`);
            setServices(prev => prev.map(s =>
                s._id === selectedServiceId
                    ? { ...s, items: s.items.filter(it => it._id !== deleteId) }
                    : s
            ));
            toast.success('Item deleted.');
            setDeleteId(null);
        } catch (err) {
            toast.error('Failed to delete item.');
        } finally {
            setActionLoading(false);
        }
    };

    // ── Bulk handlers ──
    const toggleSelectAll = () => {
        if (allSelected) setSelectedIds([]);
        else setSelectedIds(allFilteredIds);
    };

    const toggleSelectOne = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const bulkDelete = async () => {
        setActionLoading(true);
        try {
            await api.delete(`/inventory/services/${selectedServiceId}/items/bulk-delete`, {
                data: { itemIds: selectedIds },
            });
            setServices(prev => prev.map(s =>
                s._id === selectedServiceId
                    ? { ...s, items: s.items.filter(it => !selectedIds.includes(it._id)) }
                    : s
            ));
            toast.success(`${selectedIds.length} item(s) deleted.`);
            setSelectedIds([]);
        } catch (err) {
            toast.error('Bulk delete failed.');
        } finally {
            setActionLoading(false);
        }
    };

    const bulkPause = async () => {
        const allPaused = selectedIds.every(id => pausedIds.includes(id));
        const pause = !allPaused;

        setActionLoading(true);
        try {
            await api.patch(`/inventory/services/${selectedServiceId}/items/bulk-pause`, {
                itemIds: selectedIds,
                pause,
            });
            setServices(prev => prev.map(s =>
                s._id === selectedServiceId
                    ? {
                        ...s, items: s.items.map(it =>
                            selectedIds.includes(it._id) ? { ...it, isPaused: pause } : it
                        )
                    }
                    : s
            ));
            toast.success(`${selectedIds.length} item(s) ${pause ? 'paused' : 'resumed'}.`);
            setSelectedIds([]);
        } catch (err) {
            toast.error('Bulk pause failed.');
        } finally {
            setActionLoading(false);
        }
    };

    const clearSelection = () => setSelectedIds([]);

    // ── Resume handlers ──
    const resumeOne = async (itemId) => {
        setActionLoading(true);
        try {
            await api.patch(`/inventory/services/${selectedServiceId}/items/${itemId}/pause`);
            setServices(prev => prev.map(s =>
                s._id === selectedServiceId
                    ? { ...s, items: s.items.map(it => it._id === itemId ? { ...it, isPaused: false } : it) }
                    : s
            ));
            toast.success('Item resumed.');
        } catch (err) {
            toast.error('Failed to resume item.');
        } finally {
            setActionLoading(false);
        }
    };

    const resumeAll = async () => {
        const ids = pausedItems.map(it => it._id);
        setActionLoading(true);
        try {
            await api.patch(`/inventory/services/${selectedServiceId}/items/bulk-pause`, {
                itemIds: ids,
                pause: false,
            });
            setServices(prev => prev.map(s =>
                s._id === selectedServiceId
                    ? { ...s, items: s.items.map(it => ids.includes(it._id) ? { ...it, isPaused: false } : it) }
                    : s
            ));
            toast.success('All items resumed.');
        } catch (err) {
            toast.error('Failed to resume all items.');
        } finally {
            setActionLoading(false);
        }
    };

    // ────────────────────────────────────────────────────────────────────────
    // RENDER
    // ────────────────────────────────────────────────────────────────────────

    if (pageLoading) return <InventoryLoader />;

    return (
        <div className="max-w-4xl mx-auto">

            {/* ── Page Header ── */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-[#C0392B]/10 flex items-center justify-center">
                        <FiPackage size={20} className="text-[#C0392B]" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
                </div>
                <p className="text-gray-500 text-sm pl-1 mt-1">Manage items and volumes per service</p>
            </div>

            {/* ── Service Selector Bar ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6 flex items-center justify-between gap-4 flex-wrap">

                {/* Custom Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(p => !p)}
                        className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 min-w-55 hover:border-[#C0392B]/40 transition-all focus:outline-none focus:ring-2 focus:ring-[#C0392B]/20"
                    >
                        <div className="w-2 h-2 rounded-full bg-[#C0392B] shrink-0" />
                        <span className="font-semibold text-gray-800 grow text-left">
                            {currentService?.label || 'Select Service'}
                        </span>
                        <FiChevronDown
                            size={16}
                            className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden" style={{ minWidth: '220px' }}>
                            {services.map(s => (
                                <div
                                    key={s._id}
                                    className={`flex items-center gap-2 px-3 py-2.5 transition-colors ${selectedServiceId === s._id ? 'bg-[#C0392B] text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <button
                                        onClick={() => {
                                            setSelectedServiceId(s._id);
                                            setDropdownOpen(false);
                                            setEditingItemId(null);
                                            setSearchQuery('');
                                            setSelectedIds([]);
                                        }}
                                        className="flex items-center gap-2 flex-1 text-left text-sm font-medium"
                                    >
                                        {selectedServiceId === s._id ? <FiCheck size={13} /> : <span className="w-3.5" />}
                                        {s.label}
                                    </button>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); openEditService(s); }}
                                            className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors ${selectedServiceId === s._id ? 'hover:bg-white/20 text-white/80' : 'hover:bg-amber-50 text-gray-400 hover:text-amber-500'}`}
                                            title="Edit service"
                                        >
                                            <FiEdit2 size={11} />
                                        </button>
                                        {services.length > 1 && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setDeleteServiceId(s._id); setDropdownOpen(false); }}
                                                className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors ${selectedServiceId === s._id ? 'hover:bg-white/20 text-white/80' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'}`}
                                                title="Delete service"
                                            >
                                                <FiTrash2 size={11} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div className="border-t border-gray-100 p-2">
                                <button
                                    onClick={() => { setDropdownOpen(false); openAddService(); }}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#C0392B] font-semibold hover:bg-red-50 transition-colors"
                                >
                                    <FiPlus size={14} /> Add New Service
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Items count badge */}
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <FiPackage size={14} />
                    <span><span className="font-semibold text-gray-700">{currentItems.length}</span> items</span>
                    {pausedItems.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 text-xs font-semibold">
                            {pausedItems.length} paused
                        </span>
                    )}
                </div>
            </div>

            {/* ── Items Card ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                {/* Card Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex-wrap gap-3">
                    <div>
                        <h2 className="font-bold text-gray-800 text-base">{currentService?.label} Items</h2>
                        <p className="text-xs text-gray-400 mt-0.5">{currentItems.length} items listed</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        disabled={actionLoading || !selectedServiceId}
                        className="flex items-center gap-2 bg-[#C0392B] hover:bg-red-800 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md"
                    >
                        <FiPlus size={15} />
                        Add New Item
                    </button>
                </div>

                {/* Bulk Action Bar */}
                {selectedIds.length > 0 && (
                    <div className="flex items-center justify-between px-6 py-3 bg-[#1a1a1a] text-white border-b border-gray-800">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold">{selectedIds.length} item{selectedIds.length > 1 ? 's' : ''} selected</span>
                            <button onClick={clearSelection} className="text-xs text-gray-400 hover:text-white transition-colors underline underline-offset-2">
                                Clear
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={bulkPause}
                                disabled={actionLoading}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#F1C40F]/20 text-[#F1C40F] text-xs font-semibold transition-colors disabled:opacity-50"
                            >
                                ⏸ {selectedIds.every(id => pausedIds.includes(id)) ? 'Resume' : 'Pause'}
                            </button>
                            <button
                                onClick={bulkDelete}
                                disabled={actionLoading}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C0392B]/80 hover:bg-[#C0392B] text-white text-xs font-semibold transition-colors disabled:opacity-50"
                            >
                                🗑 Delete Selected
                            </button>
                        </div>
                    </div>
                )}

                {/* Search Bar */}
                <div className="px-6 py-3 border-b border-gray-100 bg-white">
                    <div className="relative">
                        <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder={`Search ${currentService?.label || ''} items...`}
                            className="w-full pl-9 pr-9 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#C0392B]/20 focus:border-[#C0392B] transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <FiX size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Select All */}
                {filteredItems.length > 0 && (
                    <div className="md:hidden flex items-center gap-2.5 px-4 py-2.5 border-b border-gray-100 bg-gray-50/60">
                        <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={toggleSelectAll}
                            className="w-4 h-4 rounded border-gray-300 accent-[#C0392B] cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            {allSelected ? 'Deselect All' : 'Select All'}
                        </span>
                    </div>
                )}

                {/* Column Headers Desktop */}
                <div className="hidden md:grid grid-cols-[40px_1fr_120px_100px] gap-3 px-6 py-3 bg-gray-50 border-b border-gray-100">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={toggleSelectAll}
                            className="w-4 h-4 rounded border-gray-300 accent-[#C0392B] cursor-pointer"
                        />
                    </span>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Item Name</span>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Volume</span>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</span>
                </div>

                {/* Items List */}
                {itemsLoading ? (
                    <><SkeletonRow /><SkeletonRow /><SkeletonRow /></>
                ) : filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <FiPackage size={40} className="mb-3 opacity-30" />
                        <p className="font-medium">
                            {searchQuery ? `No results for "${searchQuery}"` : 'No items yet'}
                        </p>
                        <p className="text-sm">
                            {searchQuery ? 'Try a different search term' : 'Click "Add New Item" to get started'}
                        </p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {filteredItems.map((item, idx) => {
                            const isSelected = selectedIds.includes(item._id);
                            const isPaused = item.isPaused;

                            return (
                                <li
                                    key={item._id}
                                    className={`transition-colors ${editingItemId === item._id
                                        ? 'bg-amber-50/60'
                                        : isSelected
                                            ? 'bg-red-50/40'
                                            : isPaused
                                                ? 'bg-gray-100/80 opacity-60'
                                                : 'hover:bg-gray-50/70'
                                        }`}
                                >
                                    {editingItemId === item._id ? (
                                        <div className="px-4 py-4 flex flex-col gap-3">
                                            <input
                                                value={editName}
                                                onChange={e => setEditName(e.target.value)}
                                                placeholder="Item name"
                                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#C0392B]/30 focus:border-[#C0392B]"
                                                autoFocus
                                            />
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="relative">
                                                    <input
                                                        value={editVolume}
                                                        onChange={e => setEditVolume(e.target.value)}
                                                        type="number"
                                                        min="0"
                                                        step="0.1"
                                                        placeholder="m³"
                                                        className="border border-gray-300 rounded-lg px-2 pr-7 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#C0392B]/30 focus:border-[#C0392B]"
                                                    />
                                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] font-semibold">m³</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => saveEdit(item._id)}
                                                        disabled={actionLoading}
                                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
                                                    >
                                                        {actionLoading
                                                            ? <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                            : <FiCheck size={14} />
                                                        }
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-600 text-sm font-semibold transition-colors"
                                                    >
                                                        <FiX size={14} /> Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {/* DESKTOP ROW */}
                                            <div className="hidden md:grid grid-cols-[40px_1fr_120px_100px] gap-3 items-center px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleSelectOne(item._id)}
                                                    className="w-4 h-4 rounded border-gray-300 accent-[#C0392B] cursor-pointer"
                                                />
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <span className="text-xs text-gray-300 font-mono w-5 text-right shrink-0">{idx + 1}</span>
                                                    <span className={`text-sm font-medium truncate ${isPaused ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                                        {item.name}
                                                    </span>
                                                    {isPaused && (
                                                        <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-200 text-gray-500">PAUSED</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-sm font-semibold text-gray-700">{item.volume}</span>
                                                    <span className="text-[10px] text-gray-400 font-medium">m³</span>
                                                </div>
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => startEdit(item)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#F1C40F] hover:bg-amber-50 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <FiEdit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteId(item._id)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#C0392B] hover:bg-red-50 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <FiTrash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* MOBILE CARD */}
                                            <div className="md:hidden px-4 py-3">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => toggleSelectOne(item._id)}
                                                            className="w-4 h-4 rounded border-gray-300 accent-[#C0392B] cursor-pointer shrink-0"
                                                        />
                                                        <span className="text-xs text-gray-300 font-mono shrink-0">{idx + 1}</span>
                                                        <span className={`text-sm font-semibold leading-tight ${isPaused ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                                            {item.name}
                                                        </span>
                                                        {isPaused && (
                                                            <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-200 text-gray-500">PAUSED</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <button
                                                            onClick={() => startEdit(item)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#F1C40F] hover:bg-amber-50 transition-colors"
                                                        >
                                                            <FiEdit2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteId(item._id)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#C0392B] hover:bg-red-50 transition-colors"
                                                        >
                                                            <FiTrash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 pl-6">
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 text-xs font-semibold text-gray-600">
                                                        {item.volume} <span className="font-normal text-gray-400">m³</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {/* ── Paused Items Panel ── */}
            {pausedItems.length > 0 && (
                <div className="mt-6 bg-white rounded-2xl shadow-sm border border-amber-200 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-amber-100 bg-amber-50/60">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
                                <span className="text-base">⏸</span>
                            </div>
                            <div>
                                <h2 className="font-bold text-gray-800 text-sm">Paused Items</h2>
                                <p className="text-xs text-amber-500 mt-0.5">
                                    {pausedItems.length} item{pausedItems.length > 1 ? 's' : ''} currently paused in {currentService?.label}
                                </p>
                            </div>
                        </div>
                        {pausedItems.length > 1 && (
                            <button
                                onClick={resumeAll}
                                disabled={actionLoading}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white text-xs font-bold transition-all shadow-sm"
                            >
                                <FiPlayCircle size={14} />
                                Resume All
                            </button>
                        )}
                    </div>
                    <ul className="divide-y divide-amber-50">
                        {pausedItems.map((item, idx) => (
                            <li key={item._id} className="flex items-center justify-between px-6 py-3.5 hover:bg-amber-50/40 transition-colors">
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="text-xs text-gray-300 font-mono w-4 text-right shrink-0">{idx + 1}</span>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-500 line-through truncate">{item.name}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-600">PAUSED</span>
                                            <span className="text-xs text-gray-400">{item.volume} m³</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => resumeOne(item._id)}
                                    disabled={actionLoading}
                                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 disabled:opacity-60 text-emerald-600 text-xs font-bold transition-colors border border-emerald-200"
                                >
                                    <FiPlayCircle size={12} />
                                    Resume
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* ── Item Modals ── */}
            <AddItemModal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddItem}
                serviceName={currentService?.label}
                newItemName={newItemName}
                setNewItemName={setNewItemName}
                newItemVolume={newItemVolume}
                setNewItemVolume={setNewItemVolume}
                addError={addError}
                loading={actionLoading}
            />

            <DeleteItemModal
                deleteId={deleteId}
                itemName={currentItems.find(i => i._id === deleteId)?.name}
                onCancel={() => setDeleteId(null)}
                onConfirm={handleDelete}
                loading={actionLoading}
            />

            {/* ── Service Add/Edit Modal ── */}
            {showServiceModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-[#C0392B]/10 flex items-center justify-center">
                                    <FiSettings size={15} className="text-[#C0392B]" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-base">
                                    {serviceModalMode === 'add' ? 'Add New Service' : 'Edit Service'}
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowServiceModal(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                <FiX size={16} />
                            </button>
                        </div>
                        <div className="px-6 py-5">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Service Name</label>
                            <input
                                value={serviceModalLabel}
                                onChange={e => { setServiceModalLabel(e.target.value); setServiceModalError(''); }}
                                onKeyDown={e => e.key === 'Enter' && handleServiceModalSave()}
                                placeholder="e.g. Piano Moving"
                                autoFocus
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0392B]/20 focus:border-[#C0392B] transition-all"
                            />
                            {serviceModalError && (
                                <p className="mt-2 text-xs text-[#C0392B] flex items-center gap-1.5">
                                    <FiAlertTriangle size={11} /> {serviceModalError}
                                </p>
                            )}
                        </div>
                        <div className="flex gap-3 px-6 pb-6">
                            <button
                                onClick={() => setShowServiceModal(false)}
                                disabled={actionLoading}
                                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-60"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleServiceModalSave}
                                disabled={actionLoading}
                                className="flex-1 py-2.5 rounded-xl bg-[#C0392B] hover:bg-red-800 disabled:opacity-60 text-white text-sm font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
                            >
                                {actionLoading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                                {serviceModalMode === 'add' ? 'Add Service' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Service Delete Confirm Modal ── */}
            {deleteServiceId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
                        <div className="px-6 py-6 text-center">
                            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                                <FiAlertTriangle size={26} className="text-[#C0392B]" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg mb-1">Delete Service?</h3>
                            <p className="text-sm text-gray-500 mb-1">
                                You're about to delete{' '}
                                <span className="font-semibold text-gray-800">
                                    "{services.find(s => s._id === deleteServiceId)?.label}"
                                </span>.
                            </p>
                            <p className="text-xs text-[#C0392B] font-medium bg-red-50 rounded-xl px-4 py-2.5 mt-3">
                                ⚠️ All items in this service will also be permanently deleted.
                            </p>
                        </div>
                        <div className="flex gap-3 px-6 pb-6">
                            <button
                                onClick={() => setDeleteServiceId(null)}
                                disabled={actionLoading}
                                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-60"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteService}
                                disabled={actionLoading}
                                className="flex-1 py-2.5 rounded-xl bg-[#C0392B] hover:bg-red-800 disabled:opacity-60 text-white text-sm font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
                            >
                                {actionLoading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Dropdown outside click handler */}
            {dropdownOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
            )}
        </div>
    );
}
