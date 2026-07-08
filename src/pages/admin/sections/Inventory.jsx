import React, { useState, useMemo } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiPackage, FiChevronDown, FiSearch } from 'react-icons/fi';
import AddItemModal from '../../../components/admin/AddItemModal';
import DeleteItemModal from '../../../components/admin/DeleteItemModal';

const SERVICES = [
    { id: 'home', label: 'Home Removal' },
    { id: 'office', label: 'Office Removal' },
    { id: 'storage', label: 'Storage' },
    { id: 'packing', label: 'Packing Service' },
];

// volume (m³) added to each item
const INITIAL_ITEMS = {
    home: [
        { id: 1, name: 'Sofa (2-seater)', volume: 1.2, basePrice: 25 },
        { id: 2, name: 'Sofa (3-seater)', volume: 1.8, basePrice: 35 },
        { id: 3, name: 'Bed Frame (Single)', volume: 1.0, basePrice: 20 },
        { id: 4, name: 'Bed Frame (Double)', volume: 1.5, basePrice: 28 },
        { id: 5, name: 'Wardrobe (Single)', volume: 1.4, basePrice: 22 },
        { id: 6, name: 'Wardrobe (Double)', volume: 2.2, basePrice: 32 },
        { id: 7, name: 'Dining Table', volume: 1.6, basePrice: 30 },
        { id: 8, name: 'Chest of Drawers', volume: 0.9, basePrice: 18 },
    ],
    office: [
        { id: 1, name: 'Office Desk', volume: 1.1, basePrice: 20 },
        { id: 2, name: 'Filing Cabinet', volume: 0.7, basePrice: 15 },
        { id: 3, name: 'Shelving Unit', volume: 0.8, basePrice: 18 },
        { id: 4, name: 'Office Chair', volume: 0.5, basePrice: 12 },
        { id: 5, name: 'Box (Standard)', volume: 0.1, basePrice: 5 },
    ],
    storage: [
        { id: 1, name: 'Small Unit (25 sq ft)', volume: 2.5, basePrice: 60 },
        { id: 2, name: 'Medium Unit (50 sq ft)', volume: 5.0, basePrice: 110 },
        { id: 3, name: 'Large Unit (100 sq ft)', volume: 10.0, basePrice: 200 },
    ],
    packing: [
        { id: 1, name: 'Small Box', volume: 0.05, basePrice: 3 },
        { id: 2, name: 'Medium Box', volume: 0.1, basePrice: 5 },
        { id: 3, name: 'Large Box', volume: 0.2, basePrice: 8 },
        { id: 4, name: 'Bubble Wrap (Roll)', volume: 0.1, basePrice: 6 },
        { id: 5, name: 'Packing Paper (Pack)', volume: 0.05, basePrice: 4 },
    ],
};

let nextId = 100;

export default function Inventory() {
    const [selectedService, setSelectedService] = useState('home');
    const [items, setItems] = useState(INITIAL_ITEMS);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Add modal state
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');
    const [newItemVolume, setNewItemVolume] = useState('');
    const [addError, setAddError] = useState('');

    // Edit inline state
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editPrice, setEditPrice] = useState('');
    const [editVolume, setEditVolume] = useState('');

    // Delete state
    const [deleteId, setDeleteId] = useState(null);

    // Bulk state
    const [selectedIds, setSelectedIds] = useState([]);
    const [pausedIds, setPausedIds] = useState([]);
    const [showBulkBar, setShowBulkBar] = useState(false);

    const currentItems = items[selectedService] || [];
    const currentService = SERVICES.find(s => s.id === selectedService);

    const filteredItems = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return currentItems;
        return currentItems.filter(it => it.name.toLowerCase().includes(q));
    }, [currentItems, searchQuery]);


    const handleAddItem = () => {
        setAddError('');
        const name = newItemName.trim();
        const volume = parseFloat(newItemVolume);
        if (!name) { setAddError('Item name is required.'); return; }
        if (isNaN(volume) || volume <= 0) { setAddError('Enter a valid volume (m³).'); return; }

        setItems(prev => ({
            ...prev,
            [selectedService]: [...prev[selectedService], { id: nextId++, name, volume }]
        }));
        setNewItemName(''); setNewItemVolume('');
        setShowAddModal(false);
    };

    // ── Edit ──
    const startEdit = (item) => {
        setEditingId(item.id);
        setEditName(item.name);
        setEditVolume(String(item.volume));
        setSelectedIds([]);
    };

    const saveEdit = (id) => {
        const name = editName.trim();
        const volume = parseFloat(editVolume);
        if (!name || isNaN(volume) || volume <= 0) return;
        setItems(prev => ({
            ...prev,
            [selectedService]: prev[selectedService].map(it =>
                it.id === id ? { ...it, name, volume } : it
            )
        }));
        setEditingId(null);
    };

    const cancelEdit = () => setEditingId(null);

    // ── Delete ──
    const handleDelete = () => {
        setItems(prev => ({
            ...prev,
            [selectedService]: prev[selectedService].filter(it => it.id !== deleteId)
        }));
        setDeleteId(null);
    };

    const openAddModal = () => {
        setAddError(''); setNewItemName(''); setNewItemVolume('');
        setShowAddModal(true);
    };

    // ── Bulk helpers ──
    const allFilteredIds = filteredItems.map(i => i.id);
    const allSelected = allFilteredIds.length > 0 && allFilteredIds.every(id => selectedIds.includes(id));

    const toggleSelectAll = () => {
        if (allSelected) setSelectedIds([]);
        else setSelectedIds(allFilteredIds);
    };

    const toggleSelectOne = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const bulkDelete = () => {
        setItems(prev => ({
            ...prev,
            [selectedService]: prev[selectedService].filter(it => !selectedIds.includes(it.id))
        }));
        setSelectedIds([]);
    };

    const bulkPause = () => {
        setPausedIds(prev => {
            const allPaused = selectedIds.every(id => prev.includes(id));
            if (allPaused) return prev.filter(id => !selectedIds.includes(id));
            return [...new Set([...prev, ...selectedIds])];
        });
        setSelectedIds([]);
    };

    const clearSelection = () => setSelectedIds([]);

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
                <p className="text-gray-500 text-sm pl-1 mt-1">Manage items, volumes and base prices per service</p>
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
                        <span className="font-semibold text-gray-800 grow text-left">{currentService?.label}</span>
                        <FiChevronDown
                            size={16}
                            className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                            {SERVICES.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => {
                                        setSelectedService(s.id);
                                        setDropdownOpen(false);
                                        setEditingId(null);
                                        setSearchQuery('');
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${selectedService === s.id
                                        ? 'bg-[#C0392B] text-white font-semibold'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {selectedService === s.id
                                        ? <FiCheck size={14} />
                                        : <span className="w-3.5" />
                                    }
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Add New Service */}
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-[#C0392B]/50 hover:text-[#C0392B] transition-all text-sm font-medium">
                    <FiPlus size={16} />
                    Add New Service
                </button>
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
                        className="flex items-center gap-2 bg-[#C0392B] hover:bg-red-800 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md"
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
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#F1C40F]/20 text-[#F1C40F] text-xs font-semibold transition-colors"
                            >
                                ⏸ {selectedIds.every(id => pausedIds.includes(id)) ? 'Resume' : 'Pause'}
                            </button>
                            <button
                                onClick={bulkDelete}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C0392B]/80 hover:bg-[#C0392B] text-white text-xs font-semibold transition-colors"
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
                            placeholder={`Search ${currentService?.label} items...`}
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

                {/* Mobile Select All — only visible on mobile */}
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

                {/* Column Headers Desktop*/}
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
                {filteredItems.length === 0 ? (
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
                            const isSelected = selectedIds.includes(item.id);
                            const isPaused = pausedIds.includes(item.id);

                            return (
                                <li
                                    key={item.id}
                                    className={`transition-colors ${editingId === item.id
                                        ? 'bg-amber-50/60'
                                        : isSelected
                                            ? 'bg-red-50/40'
                                            : isPaused
                                                ? 'bg-gray-100/80 opacity-60'
                                                : 'hover:bg-gray-50/70'
                                        }`}
                                >
                                    {editingId === item.id ? (
                                        /* ── Edit Mode ── */
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
                                                        onClick={() => saveEdit(item.id)}
                                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors"
                                                    >
                                                        <FiCheck size={14} /> Save
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
                                                {/* Checkbox */}
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleSelectOne(item.id)}
                                                    className="w-4 h-4 rounded border-gray-300 accent-[#C0392B] cursor-pointer"
                                                />
                                                {/* Name */}
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <span className="text-xs text-gray-300 font-mono w-5 text-right shrink-0">{idx + 1}</span>
                                                    <span className={`text-sm font-medium truncate ${isPaused ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                                        {item.name}
                                                    </span>
                                                    {isPaused && (
                                                        <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-200 text-gray-500">PAUSED</span>
                                                    )}
                                                </div>
                                                {/* Volume */}
                                                <div className="flex items-center gap-1">
                                                    <span className="text-sm font-semibold text-gray-700">{item.volume}</span>
                                                    <span className="text-[10px] text-gray-400 font-medium">m³</span>
                                                </div>
                                                {/* Actions */}
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => startEdit(item)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#F1C40F] hover:bg-amber-50 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <FiEdit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteId(item.id)}
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
                                                            onChange={() => toggleSelectOne(item.id)}
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
                                                            onClick={() => setDeleteId(item.id)}
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

            {/* ── Modals ── */}
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
            />

            <DeleteItemModal
                deleteId={deleteId}
                itemName={currentItems.find(i => i.id === deleteId)?.name}
                onCancel={() => setDeleteId(null)}
                onConfirm={handleDelete}
            />

            {/* Dropdown outside click handler */}
            {dropdownOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
            )}
        </div>
    );
}