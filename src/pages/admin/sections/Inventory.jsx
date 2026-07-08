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

// Tier pricing helper
function getTierInfo(volume) {
    if (volume <= 3.0) return { label: 'Tier 1', rate: 0.90, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' };
    if (volume <= 7.0) return { label: 'Tier 2', rate: 1.10, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' };
    if (volume <= 12.0) return { label: 'Tier 3', rate: 1.30, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' };
    return { label: 'Tier 4', rate: 1.50, color: 'text-[#C0392B]', bg: 'bg-red-50', border: 'border-red-100' };
}

function calcTierPrice(volume) {
    const units = Math.round(volume * 10); // units of 0.1 m³
    const { rate } = getTierInfo(volume);
    return parseFloat((units * rate).toFixed(2));
}

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

    const currentItems = items[selectedService] || [];
    const currentService = SERVICES.find(s => s.id === selectedService);

    const filteredItems = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return currentItems;
        return currentItems.filter(it => it.name.toLowerCase().includes(q));
    }, [currentItems, searchQuery]);

    // ── Add ──
    const handleAddItem = () => {
        setAddError('');
        const name = newItemName.trim();
        const price = parseFloat(newItemPrice);
        const volume = parseFloat(newItemVolume);
        if (!name) { setAddError('Item name is required.'); return; }
        if (isNaN(volume) || volume <= 0) { setAddError('Enter a valid volume (m³).'); return; }
        if (isNaN(price) || price < 0) { setAddError('Enter a valid base price.'); return; }

        setItems(prev => ({
            ...prev,
            [selectedService]: [...prev[selectedService], { id: nextId++, name, volume, basePrice: price }]
        }));
        setNewItemName(''); setNewItemPrice(''); setNewItemVolume('');
        setShowAddModal(false);
    };

    // ── Edit ──
    const startEdit = (item) => {
        setEditingId(item.id);
        setEditName(item.name);
        setEditPrice(String(item.basePrice));
        setEditVolume(String(item.volume));
    };

    const saveEdit = (id) => {
        const name = editName.trim();
        const price = parseFloat(editPrice);
        const volume = parseFloat(editVolume);
        if (!name || isNaN(price) || price < 0 || isNaN(volume) || volume <= 0) return;
        setItems(prev => ({
            ...prev,
            [selectedService]: prev[selectedService].map(it =>
                it.id === id ? { ...it, name, basePrice: price, volume } : it
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
        setAddError(''); setNewItemName(''); setNewItemPrice(''); setNewItemVolume('');
        setShowAddModal(true);
    };

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

                {/* Column Headers */}
                <div className="hidden md:grid grid-cols-[1fr_90px_110px_130px_100px] gap-3 px-6 py-3 bg-gray-50 border-b border-gray-100">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Item Name</span>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Volume</span>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tier</span>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Base Price</span>
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
                            const tier = getTierInfo(item.volume);
                            const tierPrice = calcTierPrice(item.volume);

                            return (
                                <li
                                    key={item.id}
                                    className={`transition-colors ${editingId === item.id ? 'bg-amber-50/60' : 'hover:bg-gray-50/70'}`}
                                >
                                    {editingId === item.id ? (
                                        /* ── Edit Mode ── */
                                        <div className="px-4 py-4 flex flex-col gap-3">
                                            {/* Row 1: Name */}
                                            <input
                                                value={editName}
                                                onChange={e => setEditName(e.target.value)}
                                                placeholder="Item name"
                                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#C0392B]/30 focus:border-[#C0392B]"
                                                autoFocus
                                            />
                                            {/* Row 2: Volume + Tier preview + Price */}
                                            <div className="grid grid-cols-3 gap-2">
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
                                                <div className="flex items-center justify-center">
                                                    {(() => {
                                                        const ev = parseFloat(editVolume);
                                                        if (isNaN(ev) || ev <= 0) return <span className="text-xs text-gray-300">—</span>;
                                                        const et = getTierInfo(ev);
                                                        return (
                                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold border ${et.color} ${et.bg} ${et.border}`}>
                                                                {et.label}
                                                            </span>
                                                        );
                                                    })()}
                                                </div>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">£</span>
                                                    <input
                                                        value={editPrice}
                                                        onChange={e => setEditPrice(e.target.value)}
                                                        type="number"
                                                        min="0"
                                                        placeholder="0.00"
                                                        className="border border-gray-300 rounded-lg pl-7 pr-2 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#C0392B]/30 focus:border-[#C0392B]"
                                                    />
                                                </div>
                                            </div>
                                            {/* Row 3: Save / Cancel */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => saveEdit(item.id)}
                                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors"
                                                >
                                                    <FiCheck size={14} /> Save
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-600 text-sm font-semibold transition-colors"
                                                >
                                                    <FiX size={14} /> Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {/* DESKTOP ROW — hidden on mobile */}
                                            <div className="hidden sm:grid grid-cols-[1fr_90px_110px_130px_100px] gap-3 items-center px-6 py-4">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <span className="text-xs text-gray-300 font-mono w-5 text-right shrink-0">{idx + 1}</span>
                                                    <span className="text-sm font-medium text-gray-800 truncate">{item.name}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-sm font-semibold text-gray-700">{item.volume}</span>
                                                    <span className="text-[10px] text-gray-400 font-medium">m³</span>
                                                </div>
                                                <div>
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${tier.color} ${tier.bg} ${tier.border}`}>
                                                        {tier.label}
                                                        <span className="opacity-70 font-normal">· £{tier.rate}/0.1m³</span>
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-0.5">
                                                        <span className="text-xs text-gray-400 font-medium">£</span>
                                                        <span className="text-sm font-bold text-gray-700">{tierPrice.toFixed(2)}</span>
                                                    </div>
                                                    <span className="text-[10px] text-gray-400">base: £{item.basePrice.toFixed(2)}</span>
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
                                                        onClick={() => setDeleteId(item.id)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#C0392B] hover:bg-red-50 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <FiTrash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* MOBILE CARD — hidden on desktop */}
                                            <div className="sm:hidden px-4 py-3">
                                                {/* Top row: number + name + action buttons */}
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <span className="text-xs text-gray-300 font-mono shrink-0">{idx + 1}</span>
                                                        <span className="text-sm font-semibold text-gray-800 leading-tight">{item.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 shrink-0">
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
                                                {/* Bottom row: volume + tier + price chips */}
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 text-xs font-semibold text-gray-600">
                                                        {item.volume} <span className="font-normal text-gray-400">m³</span>
                                                    </span>
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-bold border ${tier.color} ${tier.bg} ${tier.border}`}>
                                                        {tier.label} · £{tier.rate}/0.1m³
                                                    </span>
                                                    <span className="inline-flex items-center gap-0.5 px-2 py-1 rounded-lg bg-gray-50 border border-gray-200 text-xs">
                                                        <span className="text-gray-400 text-[10px]">£</span>
                                                        <span className="font-bold text-gray-700">{tierPrice.toFixed(2)}</span>
                                                        <span className="text-gray-400 text-[10px] ml-1">base £{item.basePrice.toFixed(2)}</span>
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
                newItemPrice={newItemPrice}
                setNewItemPrice={setNewItemPrice}
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