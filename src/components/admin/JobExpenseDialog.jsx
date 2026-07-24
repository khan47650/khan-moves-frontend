import React, { useEffect, useMemo, useState } from "react";
import {
    FiCheck,
    FiChevronDown,
    FiDollarSign,
    FiX
} from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../api/api";
import {
    expenseCategories,
    getCategory,
    getId,
    money,
    num
} from "../../utils/expenseUtils";

const today = () => new Date().toISOString().slice(0, 10);

const emptyForm = {
    expenseScope: "job",
    expenseCategory: "fuel",
    jobId: "",
    driverId: "",
    vehicleId: "",
    amount: "",
    milesDriven: "",
    driverPaid: false,
    expenseDate: today(),
    notes: ""
};

const scopeOptions = [
    {
        value: "job",
        label: "Job Expense"
    },
    {
        value: "driver",
        label: "Driver Expense"
    },
    {
        value: "general",
        label: "General Expense"
    }
];

const scopeCategories = {
    job: [
        "fuel",
        "driverPay",
        "nightStay",
        "repair",
        "congestionUlez"
    ],
    driver: [
        "driverPay",
        "nightStay"
    ],
    general: [
        "fuel",
        "repair",
        "congestionUlez"
    ]
};

const getExpenseAmount = expense => {
    const category = getCategory(expense);

    if (category === "fuel") {
        return num(expense.fuel);
    }

    if (category === "driverPay") {
        return num(expense.driverCharges);
    }

    if (category === "nightStay") {
        return num(expense.nightStay);
    }

    if (category === "repair") {
        return num(expense.repair);
    }

    return num(expense.other);
};

export default function JobExpenseDialog({
    expense,
    onClose,
    onSaved
}) {
    const editing = Boolean(expense?._id);

    const [form, setForm] = useState(emptyForm);
    const [jobs, setJobs] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [saving, setSaving] = useState(false);

    const updateForm = (field, value) => {
        setForm(current => ({
            ...current,
            [field]: value
        }));
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (!expense) {
            setForm({
                ...emptyForm,
                expenseDate: today()
            });
            return;
        }

        const category = getCategory(expense);

        const scope =
            expense.expenseScope ||
            (expense.job
                ? "job"
                : expense.driver
                    ? "driver"
                    : "general");

        setForm({
            expenseScope: scope,
            expenseCategory: category,
            jobId: getId(expense.job),
            driverId: getId(expense.driver),
            vehicleId: getId(expense.vehicle),
            amount: String(getExpenseAmount(expense) || ""),
            milesDriven: String(
                expense.milesDriven || ""
            ),
            driverPaid: Boolean(expense.driverPaid),
            expenseDate: expense.expenseDate
                ? new Date(expense.expenseDate)
                    .toISOString()
                    .slice(0, 10)
                : new Date(
                    expense.createdAt || Date.now()
                ).toISOString().slice(0, 10),
            notes: expense.notes || ""
        });
    }, [expense]);

    const loadData = async () => {
        try {
            setLoadingData(true);

            const [jobsResult, driversResult, vehiclesResult] =
                await Promise.allSettled([
                    api.get("/jobs"),
                    api.get("/drivers"),
                    api.get("/vehicles")
                ]);

            if (jobsResult.status === "fulfilled") {
                setJobs(
                    jobsResult.value.data?.data || []
                );
            }

            if (driversResult.status === "fulfilled") {
                setDrivers(
                    driversResult.value.data?.data || []
                );
            }

            if (vehiclesResult.status === "fulfilled") {
                setVehicles(
                    vehiclesResult.value.data?.data || []
                );
            }
        } finally {
            setLoadingData(false);
        }
    };

    const availableCategories = useMemo(() => {
        const allowed =
            scopeCategories[form.expenseScope] ||
            scopeCategories.job;

        return expenseCategories.filter(category =>
            allowed.includes(category.id)
        );
    }, [form.expenseScope]);

    const selectedCategory = expenseCategories.find(
        category => category.id === form.expenseCategory
    );

    const selectedJob = jobs.find(
        job => job._id === form.jobId
    );

    const needsDriver = [
        "driverPay",
        "nightStay"
    ].includes(form.expenseCategory);

    const needsVehicle = [
        "fuel",
        "repair",
        "congestionUlez"
    ].includes(form.expenseCategory);

    useEffect(() => {
        const valid = availableCategories.some(
            category =>
                category.id === form.expenseCategory
        );

        if (!valid && availableCategories.length > 0) {
            setForm(current => ({
                ...current,
                expenseCategory:
                    availableCategories[0].id,
                driverId: "",
                vehicleId: "",
                milesDriven: "",
                driverPaid: false,
                amount: ""
            }));
        }
    }, [
        form.expenseScope,
        availableCategories,
        form.expenseCategory
    ]);

    const handleScopeChange = value => {
        const firstCategory =
            scopeCategories[value]?.[0] || "fuel";

        setForm(current => ({
            ...current,
            expenseScope: value,
            expenseCategory: firstCategory,
            jobId: "",
            driverId: "",
            vehicleId: "",
            milesDriven: "",
            driverPaid: false,
            amount: ""
        }));
    };

    const handleCategoryChange = value => {
        setForm(current => ({
            ...current,
            expenseCategory: value,
            driverId: "",
            vehicleId: "",
            milesDriven: "",
            driverPaid: false,
            amount: ""
        }));
    };

    const handleJobChange = jobId => {
        const job = jobs.find(
            item => item._id === jobId
        );

        setForm(current => ({
            ...current,
            jobId,
            driverId:
                getId(job?.assignedDriver) ||
                current.driverId,
            vehicleId:
                getId(job?.assignedVehicle) ||
                current.vehicleId
        }));
    };

    const save = async () => {
        const amount = num(form.amount);
        const milesDriven = num(form.milesDriven);

        if (!form.expenseCategory) {
            toast.error("Select an expense category");
            return;
        }

        if (!form.expenseDate) {
            toast.error("Select expense date");
            return;
        }

        if (amount <= 0) {
            toast.error("Enter a valid expense amount");
            return;
        }

        if (
            form.expenseScope === "job" &&
            !form.jobId
        ) {
            toast.error("Select a job");
            return;
        }

        if (needsDriver && !form.driverId) {
            toast.error("Select a driver");
            return;
        }

        if (needsVehicle && !form.vehicleId) {
            toast.error("Select a vehicle");
            return;
        }

        if (
            form.expenseCategory === "fuel" &&
            milesDriven <= 0
        ) {
            toast.error(
                "Enter miles driven for fuel expense"
            );
            return;
        }

        const payload = {
            expenseScope: form.expenseScope,
            expenseCategory:
                form.expenseCategory,

            jobId:
                form.expenseScope === "job"
                    ? form.jobId
                    : null,

            driverId:
                needsDriver
                    ? form.driverId
                    : null,

            vehicleId:
                needsVehicle
                    ? form.vehicleId
                    : null,

            amount,
            milesDriven:
                form.expenseCategory === "fuel"
                    ? milesDriven
                    : 0,

            driverPaid:
                form.expenseCategory === "driverPay"
                    ? form.driverPaid
                    : false,

            expenseDate: form.expenseDate,
            notes: form.notes.trim()
        };

        try {
            setSaving(true);

            if (editing) {
                await api.patch(
                    `/expenses/${expense._id}`,
                    payload
                );
            } else {
                await api.post(
                    "/expenses",
                    payload
                );
            }

            toast.success(
                editing
                    ? "Expense updated"
                    : "Expense added"
            );

            onSaved();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to save expense"
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
                type="button"
                aria-label="Close expense dialog"
                onClick={onClose}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            <div className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                <div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-100 bg-white p-5">
                    <div>
                        <h3 className="text-xl font-bold text-[#1a1a1a]">
                            {editing
                                ? "Edit Expense"
                                : "Add Expense"}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Select a category and enter only
                            the relevant details.
                        </p>
                    </div>

                    <button
                        type="button"
                        disabled={saving}
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                    >
                        <FiX size={19} />
                    </button>
                </div>

                <div className="space-y-5 p-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Select
                            label="Expense Type"
                            value={form.expenseScope}
                            onChange={handleScopeChange}
                            options={scopeOptions}
                            placeholder="Select expense type"
                        />

                        <Select
                            label="Category"
                            value={form.expenseCategory}
                            onChange={handleCategoryChange}
                            options={availableCategories.map(
                                category => ({
                                    value: category.id,
                                    label: category.label
                                })
                            )}
                            placeholder="Select category"
                        />
                    </div>

                    {form.expenseScope === "job" && (
                        <Select
                            label="Job"
                            value={form.jobId}
                            onChange={handleJobChange}
                            options={jobs.map(job => ({
                                value: job._id,
                                label:
                                    `${job.bookingRef} — ` +
                                    `${job.customer?.name || "Customer"}`
                            }))}
                            placeholder={
                                loadingData
                                    ? "Loading jobs..."
                                    : "Select job"
                            }
                        />
                    )}

                    {selectedJob && (
                        <div className="grid gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm sm:grid-cols-2">
                            <div>
                                <p className="text-xs font-bold uppercase text-gray-400">
                                    Customer
                                </p>
                                <p className="font-semibold text-gray-700">
                                    {selectedJob.customer?.name ||
                                        "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-bold uppercase text-gray-400">
                                    Assigned Vehicle
                                </p>
                                <p className="font-semibold text-gray-700">
                                    {selectedJob.assignedVehicleReg ||
                                        "Not assigned"}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Input
                            label="Expense Date"
                            type="date"
                            value={form.expenseDate}
                            onChange={value =>
                                updateForm(
                                    "expenseDate",
                                    value
                                )
                            }
                        />

                        <MoneyInput
                            label={`${selectedCategory?.label || "Expense"} Amount`}
                            value={form.amount}
                            onChange={value =>
                                updateForm("amount", value)
                            }
                        />
                    </div>

                    {needsDriver && (
                        <Select
                            label="Driver"
                            value={form.driverId}
                            onChange={value =>
                                updateForm(
                                    "driverId",
                                    value
                                )
                            }
                            options={drivers.map(driver => ({
                                value: driver._id,
                                label:
                                    `${driver.name}` +
                                    `${driver.phone
                                        ? ` — ${driver.phone}`
                                        : ""}`
                            }))}
                            placeholder="Select driver"
                        />
                    )}

                    {needsVehicle && (
                        <Select
                            label="Vehicle"
                            value={form.vehicleId}
                            onChange={value =>
                                updateForm(
                                    "vehicleId",
                                    value
                                )
                            }
                            options={vehicles.map(vehicle => ({
                                value: vehicle._id,
                                label:
                                    `${vehicle.regNumber}` +
                                    `${vehicle.makeModel
                                        ? ` — ${vehicle.makeModel}`
                                        : ""}`
                            }))}
                            placeholder="Select vehicle"
                        />
                    )}

                    {form.expenseCategory === "fuel" && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                            <Input
                                label="Miles Driven"
                                type="number"
                                min="0"
                                step="0.1"
                                value={form.milesDriven}
                                onChange={value =>
                                    updateForm(
                                        "milesDriven",
                                        value
                                    )
                                }
                                placeholder="Enter miles driven"
                            />

                            <p className="mt-2 text-xs text-amber-700">
                                Fuel expense must be linked
                                to a vehicle and its driven
                                mileage.
                            </p>
                        </div>
                    )}

                    {form.expenseCategory ===
                        "driverPay" && (
                            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
                                <div>
                                    <p className="text-sm font-bold text-gray-700">
                                        Payment Status
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Record whether this driver
                                        payment has been paid.
                                    </p>
                                </div>

                                <input
                                    type="checkbox"
                                    checked={form.driverPaid}
                                    onChange={event =>
                                        updateForm(
                                            "driverPaid",
                                            event.target.checked
                                        )
                                    }
                                    className="h-5 w-5 accent-[#C0392B]"
                                />
                            </label>
                        )}

                    <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase text-gray-500">
                            Notes
                        </label>

                        <textarea
                            rows={3}
                            maxLength={450}
                            value={form.notes}
                            onChange={event =>
                                updateForm(
                                    "notes",
                                    event.target.value
                                )
                            }
                            placeholder={
                                form.expenseCategory ===
                                    "congestionUlez"
                                    ? "Enter congestion zone, ULEZ or location details..."
                                    : form.expenseCategory ===
                                        "repair"
                                        ? "Enter repair work details..."
                                        : "Optional notes..."
                            }
                            className="w-full resize-none rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#C0392B]"
                        />

                        <p className="mt-1 text-right text-[10px] text-gray-400">
                            {form.notes.length}/450
                        </p>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-[#1a1a1a] p-4">
                        <div>
                            <p className="text-xs uppercase text-gray-400">
                                Expense Total
                            </p>

                            <p className="text-sm font-semibold text-white">
                                {selectedCategory?.label ||
                                    "Expense"}
                            </p>
                        </div>

                        <strong className="text-2xl text-[#F1C40F]">
                            £{money(form.amount)}
                        </strong>
                    </div>

                    <button
                        type="button"
                        disabled={saving}
                        onClick={save}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C0392B] py-3 font-bold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <FiCheck />
                                {editing
                                    ? "Update Expense"
                                    : "Save Expense"}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

function Input({
    label,
    value,
    onChange,
    type = "text",
    placeholder = "",
    min,
    step
}) {
    return (
        <div>
            <label className="mb-1.5 block text-xs font-bold uppercase text-gray-500">
                {label}
            </label>

            <input
                type={type}
                min={min}
                step={step}
                value={value}
                onChange={event =>
                    onChange(event.target.value)
                }
                placeholder={placeholder}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#C0392B]"
            />
        </div>
    );
}

function MoneyInput({
    label,
    value,
    onChange
}) {
    return (
        <div>
            <label className="mb-1.5 block text-xs font-bold uppercase text-gray-500">
                {label}
            </label>

            <div className="relative">
                <FiDollarSign className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={value}
                    onChange={event =>
                        onChange(event.target.value)
                    }
                    placeholder="0.00"
                    className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#C0392B]"
                />
            </div>
        </div>
    );
}

function Select({
    label,
    value,
    onChange,
    options,
    placeholder
}) {
    return (
        <div>
            <label className="mb-1.5 block text-xs font-bold uppercase text-gray-500">
                {label}
            </label>

            <div className="relative">
                <select
                    value={value}
                    onChange={event =>
                        onChange(event.target.value)
                    }
                    className="w-full appearance-none rounded-xl border border-gray-200 px-3 py-2.5 pr-10 text-sm outline-none focus:border-[#C0392B]"
                >
                    <option value="">
                        {placeholder}
                    </option>

                    {options.map(option => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
        </div>
    );
}