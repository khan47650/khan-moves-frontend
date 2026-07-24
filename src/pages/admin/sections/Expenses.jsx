import React, { useEffect, useMemo, useState } from "react";
import { FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../../api/api";
import JobExpenseDialog from "../../../components/admin/JobExpenseDialog";
import ExpenseFilters from "../../../components/admin/ExpenseFilters";
import ExpenseSummary from "../../../components/admin/ExpenseSummary";
import ExpenseChart from "../../../components/admin/ExpenseChart";
import ExpenseHistoryTable from "../../../components/admin/ExpenseHistoryTable";
import { buildExpenseData } from "../../../utils/expenseUtils";

function Loader() { return <div className="flex flex-col items-center justify-center py-20"><div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-100 border-t-[#C0392B]" /><p className="mt-4 text-sm font-semibold text-gray-400">Loading expenses...</p></div> }

export default function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [category, setCategory] = useState("all");
    const [period, setPeriod] = useState("all");
    const [customRange, setCustomRange] = useState({ from: "", to: "" });
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchExpenses();
    }, [category]);

    const fetchExpenses = async () => {
        try {
            setLoading(true);

            const res = await api.get("/expenses", {
                params: {
                    period: "all",
                    type: category
                }
            });

            setExpenses(res.data?.data || []);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to load expenses"
            );
        } finally {
            setLoading(false);
        }
    };

    const data = useMemo(() => buildExpenseData({ expenses, category, period, customRange }), [expenses, category, period, customRange]);

    const openAdd = () => { setEditing(null); setDialogOpen(true) };
    const openEdit = e => { setEditing(e); setDialogOpen(true) };
    const saved = () => { setDialogOpen(false); setEditing(null); fetchExpenses() };

    const remove = async () => {
        if (!deleteItem) return;
        try {
            setDeleting(true);
            await api.delete(`/expenses/${deleteItem._id}`);
            toast.success("Expense deleted");
            setDeleteItem(null);
            fetchExpenses();
        } catch (e) { toast.error(e.response?.data?.message || "Failed to delete expense") }
        finally { setDeleting(false) }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#1a1a1a]">Expenses Panel</h1>
                    <p className="mt-2 text-gray-500">Clean expense history for fuel, driver pay, night stay, repairs and congestion/ULEZ.</p>
                </div>
                <button onClick={openAdd} className="flex items-center justify-center gap-2 rounded-xl bg-[#C0392B] px-5 py-3 font-bold text-white hover:bg-red-800"><FiPlus />Add Expense</button>
            </div>

            <ExpenseFilters category={category} setCategory={setCategory} period={period} setPeriod={setPeriod} customRange={customRange} setCustomRange={setCustomRange} />

            {loading ? <Loader /> : <>
                <ExpenseSummary
                    data={data}
                    category={category}
                />
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2"><ExpenseChart rows={data.chart} /></div>
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                        <p className="mb-2 text-xs font-bold uppercase text-red-600">Filtered Records</p>
                        <p className="text-4xl font-black text-red-900">{data.count}</p>
                        <p className="mt-2 text-sm text-red-700">History logs matching selected filters.</p>
                    </div>
                </div>
                <ExpenseHistoryTable expenses={data.rows} onEdit={openEdit} onDelete={setDeleteItem} />
            </>}

            {dialogOpen && <JobExpenseDialog expense={editing} onClose={() => { setDialogOpen(false); setEditing(null) }} onSaved={saved} />}

            {deleteItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="mb-4 flex items-start justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-[#1a1a1a]">Delete Expense?</h3>
                                <p className="mt-1 text-sm text-gray-500">Delete {deleteItem.jobRef || deleteItem.categoryLabel || "expense"}? This cannot be undone.</p>
                            </div>
                            <button disabled={deleting} onClick={() => setDeleteItem(null)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><FiX /></button>
                        </div>
                        <div className="flex gap-3">
                            <button disabled={deleting} onClick={() => setDeleteItem(null)} className="flex-1 rounded-xl border border-gray-200 py-3 font-semibold text-gray-700 disabled:opacity-50">Cancel</button>
                            <button disabled={deleting} onClick={remove} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60">{deleting ? "Deleting..." : <><FiTrash2 />Delete</>}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}