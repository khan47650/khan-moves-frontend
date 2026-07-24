import React from "react";
import { money } from "../../utils/expenseUtils";

export default function ExpenseChart({ rows }) {
    const max = Math.max(...rows.map(r => r.amount), 1);
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-bold text-[#1a1a1a]">Daily Expense Graph</h2>
            {rows.length === 0 ? (
                <p className="py-10 text-center text-sm text-gray-400">No graph data found.</p>
            ) : (
                <div className="space-y-3">
                    {rows.map(r => {
                        const width = Math.max((r.amount / max) * 100, 2);
                        return (
                            <div key={r.date}>
                                <div className="mb-1 flex justify-between text-sm">
                                    <span className="font-semibold text-gray-700">{r.date}</span>
                                    <span className="font-bold text-red-600">£{money(r.amount)}</span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                    <div className="h-full rounded-full bg-[#C0392B]" style={{ width: `${width}%` }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}