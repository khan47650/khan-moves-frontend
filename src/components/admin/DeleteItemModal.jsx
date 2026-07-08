import React from 'react';
import { FiTrash2 } from 'react-icons/fi';

export default function DeleteItemModal({ deleteId, itemName, onCancel, onConfirm }) {
    if (deleteId === null) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
                <div className="px-6 py-6 text-center">
                    <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiTrash2 size={24} className="text-[#C0392B]" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Delete Item?</h3>
                    <p className="text-sm text-gray-500">
                        "<span className="font-semibold text-gray-700">{itemName}</span>" will be permanently removed from this service.
                    </p>
                </div>
                <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2.5 rounded-xl bg-[#C0392B] hover:bg-red-800 text-white text-sm font-semibold transition-all"
                    >
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>
    );
}