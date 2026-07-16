import React, { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../../api/api";
import JobExpenseDialog from "../../../components/admin/JobExpenseDialog";

function SectionLoader() {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-4 h-12 w-12">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#C0392B]" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-[#C0392B]/20" />
                </div>
            </div>
            <p className="text-sm font-semibold text-gray-400">Loading expenses...</p>
        </div>
    );
}

const expenseTypes = [
    { id: "fuel", label: "Fuel", bar: "bg-blue-500", badge: "bg-blue-100 text-blue-800" },
    { id: "repair", label: "Repair", bar: "bg-red-500", badge: "bg-red-100 text-red-800" },
    { id: "driverCharges", label: "Driver Charges", bar: "bg-purple-500", badge: "bg-purple-100 text-purple-800" },
    { id: "nightStay", label: "Night Stay", bar: "bg-indigo-500", badge: "bg-indigo-100 text-indigo-800" },
    { id: "meals", label: "Meals", bar: "bg-green-500", badge: "bg-green-100 text-green-800" },
    { id: "other", label: "Other Expenses", bar: "bg-yellow-500", badge: "bg-yellow-100 text-yellow-800" }
];

const periodOptions = [
    { value: "all", label: "All Time" },
    { value: "weekly", label: "Last 7 Days" },
    { value: "last_month", label: "Last Month" },
    { value: "last_year", label: "Last Year" }
];

const formatMoney = (value) => Number(value || 0).toFixed(2);

export default function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [filterType, setFilterType] = useState("all");
    const [period, setPeriod] = useState("all");
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [deleteExpenseItem, setDeleteExpenseItem] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchExpenses();
    }, [filterType, period]);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const response = await api.get("/expenses", {
                params: {
                    type: filterType,
                    period
                }
            });
            setExpenses(response.data?.data || []);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load expenses");
        } finally {
            setLoading(false);
        }
    };

    const expensesByType = useMemo(() => {
        const totals = {};
        expenseTypes.forEach((type) => {
            totals[type.id] = expenses.reduce(
                (sum, expense) => sum + Number(expense[type.id] || 0),
                0
            );
        });
        return totals;
    }, [expenses]);

    const totalExpenses = useMemo(() => {
        return expenses.reduce(
            (sum, expense) => sum + Number(expense.totalExpense || 0),
            0
        );
    }, [expenses]);

    const openAddDialog = () => {
        setEditingExpense(null);
        setDialogOpen(true);
    };

    const openEditDialog = (expense) => {
        setEditingExpense(expense);
        setDialogOpen(true);
    };

    const handleSaved = () => {
        setDialogOpen(false);
        setEditingExpense(null);
        fetchExpenses();
    };

    const handleDelete = async () => {
        if (!deleteExpenseItem) return;
        try {
            setDeleting(true);
            await api.delete(`/expenses/${deleteExpenseItem._id}`);
            toast.success("Expense deleted");
            setDeleteExpenseItem(null);
            fetchExpenses();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete expense");
        } finally {
            setDeleting(false);
        }
    };

    const getExpenseBadges = (expense) => {
        return expenseTypes.filter((type) => Number(expense[type.id] || 0) > 0);
    };

    return (
        <div>
            <h1 className="mb-2 text-3xl font-bold text-[#1a1a1a]">Expense Tracking</h1>
            <p className="mb-8 text-gray-500">Track all business expenses.</p>

            <button
                type="button"
                onClick={openAddDialog}
                className="mb-8 flex items-center gap-2 rounded-lg bg-[#C0392B] px-4 py-2 font-semibold text-white transition hover:bg-red-800"
            >
                <FiPlus size={18} />
                Add Expense
            </button>

            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SummaryCard label="Total Expenses" value={totalExpenses} color="text-red-600" />
                <SummaryCard label="Fuel Cost" value={expensesByType.fuel} color="text-blue-600" />
                <SummaryCard label="Repairs" value={expensesByType.repair} color="text-red-600" />
                <SummaryCard label="Other Expenses" value={expensesByType.other} color="text-yellow-600" />
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="rounded-lg border border-gray-200 bg-white p-6 lg:col-span-2">
                    <h2 className="mb-6 text-lg font-bold text-[#1a1a1a]">Expense Breakdown</h2>
                    <div className="space-y-4">
                        {expenseTypes.map((type) => {
                            const amount = expensesByType[type.id] || 0;
                            const percentage = totalExpenses > 0
                                ? Math.min((amount / totalExpenses) * 100, 100)
                                : 0;

                            return (
                                <div key={type.id}>
                                    <div className="mb-2 flex items-center justify-between gap-3">
                                        <p className="font-semibold text-gray-700">{type.label}</p>
                                        <p className="font-bold text-gray-900">£{formatMoney(amount)}</p>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-500 ${type.bar}`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
                        <h3 className="mb-4 text-lg font-bold text-[#1a1a1a]">Filters</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-gray-600">Expense Type</label>
                                <select
                                    value={filterType}
                                    onChange={(event) => setFilterType(event.target.value)}
                                    className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 outline-none focus:border-[#C0392B]"
                                >
                                    <option value="all">All Types</option>
                                    {expenseTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-gray-600">Time Period</label>
                                <select
                                    value={period}
                                    onChange={(event) => setPeriod(event.target.value)}
                                    className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 outline-none focus:border-[#C0392B]"
                                >
                                    {periodOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-red-200 bg-red-50 p-6">
                        <p className="mb-2 text-xs font-semibold uppercase text-red-600">Filtered Total</p>
                        <p className="text-3xl font-bold text-red-900">£{formatMoney(totalExpenses)}</p>
                        <p className="mt-2 text-xs text-red-600">{expenses.length} transactions</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="mb-6 text-lg font-bold text-[#1a1a1a]">Recent Transactions</h2>

                {loading ? (
                    <SectionLoader />
                ) : expenses.length === 0 ? (
                    <div className="py-12 text-center text-sm text-gray-400">No expenses found</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-212.5 text-sm">
                            <thead className="border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Job</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Types</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Driver</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Notes</th>
                                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Amount</th>
                                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map((expense) => (
                                    <tr key={expense._id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="px-4 py-3 text-gray-700">
                                            {new Date(expense.createdAt).toLocaleDateString("en-GB")}
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-[#C0392B]">
                                            {expense.jobRef || "General Expense"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex max-w-65 flex-wrap gap-1">
                                                {getExpenseBadges(expense).map((type) => (
                                                    <span
                                                        key={type.id}
                                                        className={`rounded-full px-2 py-1 text-[10px] font-semibold ${type.badge}`}
                                                    >
                                                        {type.label}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">
                                            {expense.driverName || "—"}
                                        </td>
                                        <td className="max-w-55 truncate px-4 py-3 text-gray-600">
                                            {expense.notes || "—"}
                                        </td>
                                        <td className="px-4 py-3 text-right font-bold text-red-600">
                                            £{formatMoney(expense.totalExpense)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditDialog(expense)}
                                                    className="rounded-lg bg-blue-50 p-2 text-blue-700 transition hover:bg-blue-100"
                                                >
                                                    <FiEdit2 size={15} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setDeleteExpenseItem(expense)}
                                                    className="rounded-lg bg-red-50 p-2 text-red-700 transition hover:bg-red-100"
                                                >
                                                    <FiTrash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {dialogOpen && (
                <JobExpenseDialog
                    expense={editingExpense}
                    allowGeneralExpense={true}
                    onClose={() => {
                        setDialogOpen(false);
                        setEditingExpense(null);
                    }}
                    onSaved={() => {
                        setDialogOpen(false);
                        setEditingExpense(null);
                        fetchExpenses();
                    }}
                />
            )}

            {deleteExpenseItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="mb-4 flex items-start justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-[#1a1a1a]">Delete Expense?</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Delete {deleteExpenseItem.jobRef || "General Expense"}? This cannot be undone.
                                </p>
                            </div>
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={() => setDeleteExpenseItem(null)}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                            >
                                <FiX size={18} />
                            </button>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={() => setDeleteExpenseItem(null)}
                                className="flex-1 rounded-xl border border-gray-200 py-3 font-semibold text-gray-700 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={handleDelete}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                            >
                                {deleting ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <FiTrash2 size={16} />
                                        Delete
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function SummaryCard({ label, value, color }) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
            <p className="mb-2 text-xs font-semibold uppercase text-gray-500">{label}</p>
            <p className={`text-3xl font-bold ${color}`}>£{formatMoney(value)}</p>
        </div>
    );
}