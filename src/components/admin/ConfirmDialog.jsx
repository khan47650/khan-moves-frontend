import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

export default function ConfirmDialog({
    open, title, message, warning, loading, onCancel, onConfirm
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="px-6 py-6 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
                        <FiAlertTriangle size={26} className="text-[#C0392B]" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
                    <p className="text-sm leading-6 text-gray-500">{message}</p>
                    {warning && (
                        <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-xs font-semibold text-[#C0392B]">
                            {warning}
                        </p>
                    )}
                </div>
                <div className="flex gap-3 px-6 pb-6">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#C0392B] py-2.5 text-sm font-bold text-white hover:bg-red-800 disabled:opacity-60"
                    >
                        {loading && (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        )}
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>
    );
}