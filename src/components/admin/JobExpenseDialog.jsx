import React, { useEffect, useState } from "react";
import { FiCheck, FiDollarSign, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../api/api";


const emptyForm = {
    driverCharges: "",
    nightStay: "",
    meals: "",
    fuel: "",
    repair: "",
    other: "",
    notes: ""
};


const Field = ({ label, field, value, onChange }) => (
    <div className="flex items-center gap-3">
        <label className="w-40 shrink-0 text-sm text-gray-600">
            {label}
        </label>

        <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                £
            </span>

            <input
                type="number"
                value={value}
                onChange={(e) => onChange(field, e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-7 pr-3 outline-none focus:border-[#C0392B]"
            />
        </div>
    </div>
);


export default function JobExpenseDialog({
    expense,
    onClose,
    onSaved
}) {


    const [form, setForm] = useState(emptyForm);
    const [jobs, setJobs] = useState([]);
    const [drivers, setDrivers] = useState([]);

    const [jobId, setJobId] = useState("");
    const [driverId, setDriverId] = useState("");

    const [saving, setSaving] = useState(false);


    const edit = Boolean(expense?._id);



    useEffect(() => {

        loadData();

        if (expense) {

            setForm({
                driverCharges: expense.driverCharges || "",
                nightStay: expense.nightStay || "",
                meals: expense.meals || "",
                fuel: expense.fuel || "",
                repair: expense.repair || "",
                other: expense.other || "",
                notes: expense.notes || ""
            });

            setJobId(expense.job?._id || expense.job || "");
            setDriverId(expense.driver?._id || expense.driver || "");

        }

    }, []);



    const loadData = async () => {

        try {

            const [jobsRes, driversRes] = await Promise.all([
                api.get("/jobs"),
                api.get("/drivers")
            ]);


            setJobs(jobsRes.data.data || []);
            setDrivers(driversRes.data.data || []);


        } catch {

            toast.error("Failed loading data");

        }

    };



    const set = (field, value) => {
        setForm(prev => ({
            ...prev,
            [field]: value
        }));
    };



    const total =
        Number(form.driverCharges || 0) +
        Number(form.nightStay || 0) +
        Number(form.meals || 0) +
        Number(form.fuel || 0) +
        Number(form.repair || 0) +
        Number(form.other || 0);



    const save = async () => {


        if (total <= 0) {
            toast.error("Add expense amount");
            return;
        }


        try {

            setSaving(true);


            if (edit) {

                await api.patch(
                    `/expenses/${expense._id}`,
                    form
                );

                toast.success("Expense updated");


            } else {


                await api.post("/expenses", {

                    jobId: jobId || null,
                    driverId: driverId || null,

                    ...form

                });


                toast.success("Expense added");


            }


            onSaved();


        } catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Failed"
            );

        } finally {

            setSaving(false);

        }

    };



    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />


            <div className="relative bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">


                <div className="flex justify-between mb-5">

                    <div>

                        <h3 className="text-lg font-bold">
                            {edit ? "Edit Expense" : "Add Expense"}
                        </h3>

                    </div>


                    <button onClick={onClose}>
                        <FiX />
                    </button>

                </div>



                <select
                    value={jobId}
                    onChange={e => setJobId(e.target.value)}
                    className="w-full mb-3 border rounded-lg p-2.5"
                >

                    <option value="">
                        General Expense (No Job)
                    </option>

                    {
                        jobs.map(j =>
                            <option key={j._id} value={j._id}>
                                {j.bookingRef}
                            </option>
                        )
                    }

                </select>



                <select
                    value={driverId}
                    onChange={e => setDriverId(e.target.value)}
                    className="w-full mb-4 border rounded-lg p-2.5"
                >

                    <option value="">
                        No Driver
                    </option>

                    {
                        drivers.map(d =>
                            <option key={d._id} value={d._id}>
                                {d.name}
                            </option>
                        )
                    }

                </select>



                <div className="space-y-3">

                    <Field label="Driver Charges" field="driverCharges" value={form.driverCharges} onChange={set} />
                    <Field label="Night Stay" field="nightStay" value={form.nightStay} onChange={set} />
                    <Field label="Meals" field="meals" value={form.meals} onChange={set} />
                    <Field label="Fuel" field="fuel" value={form.fuel} onChange={set} />
                    <Field label="Repair" field="repair" value={form.repair} onChange={set} />
                    <Field label="Other" field="other" value={form.other} onChange={set} />

                </div>



                <textarea
                    value={form.notes}
                    onChange={e => set("notes", e.target.value)}
                    placeholder="Notes"
                    className="w-full mt-4 border rounded-lg p-3"
                />



                <div className="mt-5 bg-black rounded-xl p-4 flex justify-between">

                    <span className="text-gray-300">
                        Total
                    </span>

                    <strong className="text-yellow-400">
                        £{total.toFixed(2)}
                    </strong>

                </div>



                <button
                    disabled={saving}
                    onClick={save}
                    className="mt-5 w-full bg-[#C0392B] text-white rounded-xl py-3 font-bold flex justify-center gap-2"
                >

                    {
                        saving ?
                            "Saving..."
                            :
                            <>
                                <FiCheck />
                                Save Expense
                            </>
                    }

                </button>

            </div>

        </div>

    );


}