import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { formatDate, money } from "../../utils/expenseUtils";

export default function ExpenseHistoryTable({ expenses, onEdit, onDelete }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="mb-1 text-lg font-bold text-[#1a1a1a]">Expense History Log</h2>
            <p className="mb-6 text-sm text-gray-500">Expense histories</p>
            {expenses.length === 0 ? (
                <p className="py-12 text-center text-sm text-gray-400">No expenses found</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-245 text-sm">
                        <thead className="border-b border-gray-200 bg-gray-50">
                            <tr>
                                {["Date", "Category", "Job", "Driver/Vehicle", "Miles", "Paid", "Notes", "Amount", "Actions"].map((h, i) => (
                                    <th key={h} className={`px-4 py-3 font-semibold text-gray-700 ${i > 6 ? "text-right" : "text-left"}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map(e => (
                                <tr key={e._id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-700">{formatDate(e.expenseDate || e.createdAt)}</td>
                                    <td className="px-4 py-3"><span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-[#C0392B]">{e.categoryLabel}</span></td>
                                    <td className="px-4 py-3 font-semibold text-[#C0392B]">{e.jobRef || e.job?.bookingRef || "General"}</td>
                                    <td className="px-4 py-3 text-gray-700">{e.driverName || e.driver?.name || e.vehicleReg || "—"}</td>
                                    <td className="px-4 py-3 text-gray-700">{Number(e.milesDriven || 0) > 0 ? `${e.milesDriven} miles` : "—"}</td>
                                    <td className="px-4 py-3">
                                        {e.categoryId === "driverPay" ? (
                                            <span className={`rounded-full px-2 py-1 text-xs font-bold ${e.driverPaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                                {e.driverPaid ? "Paid" : "Unpaid"}
                                            </span>
                                        ) : "—"}
                                    </td>
                                    <td className="max-w-55 truncate px-4 py-3 text-gray-600">{e.notes || "—"}</td>
                                    <td className="px-4 py-3 text-right font-black text-red-600">£{money(e.displayAmount)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => onEdit(e)} className="rounded-lg bg-blue-50 p-2 text-blue-700 hover:bg-blue-100"><FiEdit2 size={15} /></button>
                                            <button onClick={() => onDelete(e)} className="rounded-lg bg-red-50 p-2 text-red-700 hover:bg-red-100"><FiTrash2 size={15} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}