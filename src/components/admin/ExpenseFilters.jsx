import React from "react";
import { FiCalendar, FiFilter } from "react-icons/fi";
import { expenseCategories, periodOptions } from "../../utils/expenseUtils";

export default function ExpenseFilters({ category, setCategory, period, setPeriod, customRange, setCustomRange }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="mb-4 text-lg font-bold text-[#1a1a1a]">Filters</h3>
            <div className="grid gap-4 md:grid-cols-4">
                <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase text-gray-500">Category</label>
                    <div className="relative">
                        <FiFilter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 outline-none focus:border-[#C0392B]">
                            <option value="all">All Categories</option>
                            {expenseCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase text-gray-500">Time Period</label>
                    <select value={period} onChange={e => setPeriod(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-[#C0392B]">
                        {periodOptions.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                </div>
                {period === "custom" && <>
                    <DateBox label="From" value={customRange.from} onChange={v => setCustomRange({ ...customRange, from: v })} />
                    <DateBox label="To" value={customRange.to} onChange={v => setCustomRange({ ...customRange, to: v })} />
                </>}
            </div>
        </div>
    );
}

function DateBox({ label, value, onChange }) {
    return (
        <div>
            <label className="mb-1.5 block text-xs font-bold uppercase text-gray-500">{label}</label>
            <div className="relative">
                <FiCalendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="date" value={value} onChange={e => onChange(e.target.value)} className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 outline-none focus:border-[#C0392B]" />
            </div>
        </div>
    );
}