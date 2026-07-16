import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

export default function DeleteJobDialog({
    open,
    title,
    message,
    loading,
    onCancel,
    onConfirm,
}) {

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">

            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">

                <div className="px-6 py-6 text-center">

                    <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                        <FiAlertTriangle size={26} className="text-[#C0392B]" />
                    </div>

                    <h3 className="font-bold text-gray-900 text-lg mb-2">
                        {title}
                    </h3>

                    <p className="text-sm text-gray-500">
                        {message}
                    </p>

                    <p className="text-xs text-[#C0392B] font-medium bg-red-50 rounded-xl px-4 py-2.5 mt-4">
                        ⚠️ This action cannot be undone.
                    </p>

                </div>

                <div className="flex gap-3 px-6 pb-6">

                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl bg-[#C0392B] hover:bg-red-800 text-white text-sm font-bold flex items-center justify-center gap-2"
                    >

                        {loading &&
                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        }

                        {loading ? "Deleting..." : "Yes, Delete"}

                    </button>

                </div>

            </div>

        </div>
    );
}