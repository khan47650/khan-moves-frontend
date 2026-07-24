import React from "react";

export default function EarningsLoader() {
    return (
        <div className="flex flex-col items-center justify-center py-24">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-100 border-t-[#C0392B]" />

            <p className="mt-4 text-sm font-semibold text-gray-400">
                Loading earnings...
            </p>
        </div>
    );
}