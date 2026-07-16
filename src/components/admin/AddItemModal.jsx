import React from 'react';
import { FiX, FiPlus } from 'react-icons/fi';

export default function AddItemModal({ show, onClose, onAdd, serviceName, newItemName, setNewItemName, newItemVolume, setNewItemVolume, addError, loading }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-y-auto max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Add New Item</h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Adding to: <span className="font-semibold text-[#C0392B]">{serviceName}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
                    >
                        <FiX size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-6 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Item Name
                        </label>
                        <input
                            value={newItemName}
                            onChange={e => setNewItemName(e.target.value)}
                            placeholder="e.g. King Size Bed"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0392B]/30 focus:border-[#C0392B] transition-all"
                            autoFocus
                            onKeyDown={e => e.key === 'Enter' && onAdd()}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Volume (m³)
                        </label>
                        <div className="relative">
                            <input
                                value={newItemVolume}
                                onChange={e => setNewItemVolume(e.target.value)}
                                type="number"
                                min="0"
                                step="0.1"
                                placeholder="e.g. 1.5"
                                className="w-full border border-gray-200 rounded-xl px-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0392B]/30 focus:border-[#C0392B] transition-all"
                                onKeyDown={e => e.key === 'Enter' && onAdd()}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold">m³</span>
                        </div>
                    </div>

                    {addError && (
                        <p className="text-xs text-[#C0392B] bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                            {addError}
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onAdd}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl bg-[#C0392B] hover:bg-red-800 disabled:opacity-60 text-white text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                        {loading
                            ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            : <FiPlus size={15} />
                        }
                        {loading ? 'Adding...' : 'Add Item'}
                    </button>
                </div>
            </div>
        </div>
    );
}