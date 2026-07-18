import React, { useEffect, useMemo, useState } from "react";
import {
    FiBriefcase,
    FiCreditCard,
    FiDollarSign,
    FiFilter,
    FiTrendingDown,
    FiTrendingUp,
    FiDownload
} from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../../api/api";
import { generateEarningsReport } from "../../../utils/generateEarningsReport";

const PERIODS = [
    { value: "all", label: "All Time" },
    { value: "weekly", label: "Last 7 Days" },
    { value: "last_month", label: "Last Month" },
    { value: "last_year", label: "Last Year" }
];

const numberValue = value => Number(value || 0);

const getId = value =>
    typeof value === "string" ? value : value?._id || "";

const formatMoney = value =>
    numberValue(value).toLocaleString("en-GB", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

const getExpenseTotal = expense => {
    const storedTotal = numberValue(expense.totalExpense);

    if (storedTotal > 0) return storedTotal;

    return (
        numberValue(expense.driverCharges) +
        numberValue(expense.nightStay) +
        numberValue(expense.meals) +
        numberValue(expense.fuel) +
        numberValue(expense.repair) +
        numberValue(expense.other)
    );
};

const getJobDate = job => {
    if (job.date) {
        const moveDate = new Date(`${job.date}T12:00:00`);

        if (!Number.isNaN(moveDate.getTime())) {
            return moveDate;
        }
    }

    return new Date(job.updatedAt || job.createdAt);
};

const isInPeriod = (dateValue, period) => {
    if (period === "all") return true;

    const date =
        dateValue instanceof Date
            ? dateValue
            : new Date(dateValue);

    if (Number.isNaN(date.getTime())) return false;

    const now = new Date();

    if (period === "weekly") {
        const start = new Date(now);
        start.setDate(start.getDate() - 7);

        return date >= start && date <= now;
    }

    if (period === "last_month") {
        const start = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            1
        );

        const end = new Date(
            now.getFullYear(),
            now.getMonth(),
            0,
            23,
            59,
            59,
            999
        );

        return date >= start && date <= end;
    }

    if (period === "last_year") {
        const start = new Date(
            now.getFullYear() - 1,
            0,
            1
        );

        const end = new Date(
            now.getFullYear() - 1,
            11,
            31,
            23,
            59,
            59,
            999
        );

        return date >= start && date <= end;
    }

    return true;
};

function SectionLoader() {
    return (
        <div className="flex flex-col items-center justify-center py-24">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-100 border-t-[#C0392B]" />

            <p className="mt-4 text-sm font-semibold text-gray-400">
                Loading earnings...
            </p>
        </div>
    );
}

function StatCard({
    title,
    value,
    description,
    icon: Icon,
    valueClass = "text-[#1a1a1a]",
    iconClass = "bg-gray-100 text-gray-600"
}) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                    {title}
                </p>

                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
                >
                    <Icon size={19} />
                </div>
            </div>

            <p className={`text-3xl font-black ${valueClass}`}>
                {value}
            </p>

            {description && (
                <p className="mt-2 text-xs text-gray-500">
                    {description}
                </p>
            )}
        </div>
    );
}

export default function Earnings() {
    const [period, setPeriod] = useState("all");
    const [completedJobs, setCompletedJobs] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reportPeriod, setReportPeriod] =
        useState("weekly");
    const [generatingReport, setGeneratingReport] =
        useState(false);
    const [drivers, setDrivers] = useState([]);

    useEffect(() => {
        fetchEarnings();
    }, [period]);

    const fetchEarnings = async () => {
        try {
            setLoading(true);

            const [
                jobsResponse,
                expensesResponse,
                driversResponse
            ] = await Promise.all([
                api.get("/jobs", {
                    params: {
                        status: "completed"
                    }
                }),

                api.get("/expenses", {
                    params: {
                        period
                    }
                }),

                api.get("/drivers")
            ]);

            setCompletedJobs(jobsResponse.data?.data || []);
            setExpenses(expensesResponse.data?.data || []);
            setDrivers(driversResponse.data?.data || []);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to load earnings"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReport = async () => {
        try {
            setGeneratingReport(true);

            const [
                jobsResponse,
                expensesResponse,
                driversResponse
            ] = await Promise.all([
                api.get("/jobs", {
                    params: {
                        status: "completed"
                    }
                }),

                api.get("/expenses", {
                    params: {
                        period: reportPeriod
                    }
                }),

                api.get("/drivers")
            ]);

            await generateEarningsReport({
                period: reportPeriod,
                jobs: jobsResponse.data?.data || [],
                expenses: expensesResponse.data?.data || [],
                drivers: driversResponse.data?.data || []
            });

            toast.success(
                "Earnings report generated successfully"
            );
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Failed to generate report"
            );
        } finally {
            setGeneratingReport(false);
        }
    };

    const filteredJobs = useMemo(() => {
        return completedJobs.filter(job =>
            isInPeriod(getJobDate(job), period)
        );
    }, [completedJobs, period]);

    const expensesByJob = useMemo(() => {
        const totals = new Map();

        expenses.forEach(expense => {
            const jobId = getId(expense.job);

            if (!jobId) return;

            totals.set(
                jobId,
                numberValue(totals.get(jobId)) +
                getExpenseTotal(expense)
            );
        });

        return totals;
    }, [expenses]);

    const jobRows = useMemo(() => {
        return filteredJobs.map(job => {
            const revenue = numberValue(job.totalPrice);
            const jobExpenses =
                numberValue(
                    expensesByJob.get(String(job._id))
                );

            return {
                ...job,
                revenue,
                expenses: jobExpenses,
                net: revenue - jobExpenses
            };
        });
    }, [filteredJobs, expensesByJob]);

    const grossRevenue = useMemo(() => {
        return jobRows.reduce(
            (sum, job) => sum + job.revenue,
            0
        );
    }, [jobRows]);

    const totalExpenses = useMemo(() => {
        return expenses.reduce(
            (sum, expense) =>
                sum + getExpenseTotal(expense),
            0
        );
    }, [expenses]);

    const netEarnings =
        grossRevenue - totalExpenses;

    const completedCount = jobRows.length;

    const averageJobValue =
        completedCount > 0
            ? grossRevenue / completedCount
            : 0;

    const averageNetValue =
        completedCount > 0
            ? netEarnings / completedCount
            : 0;

    const profitMargin =
        grossRevenue > 0
            ? (netEarnings / grossRevenue) * 100
            : 0;

    const generalExpenses = useMemo(() => {
        return expenses
            .filter(expense => !getId(expense.job))
            .reduce(
                (sum, expense) =>
                    sum + getExpenseTotal(expense),
                0
            );
    }, [expenses]);

    const earningsByDriver = useMemo(() => {
        if (period === "all") {
            return drivers
                .map(driver => ({
                    key: driver._id,
                    name: driver.name || "Unknown Driver",
                    earnings: numberValue(driver.earnings),
                    jobs: numberValue(driver.totalJobs)
                }))
                .filter(driver =>
                    driver.earnings > 0 || driver.jobs > 0
                )
                .sort((a, b) => b.earnings - a.earnings);
        }

        /*
         * For filtered periods, only driverCharges
         * from filtered expenses count as earnings.
         */
        const driverMap = new Map();

        expenses.forEach(expense => {
            const driverCharges =
                numberValue(expense.driverCharges);

            if (driverCharges <= 0) return;

            const driverId = getId(expense.driver);

            const driverName =
                expense.driver?.name ||
                expense.driverName ||
                "Unknown Driver";

            const key = driverId || driverName;

            if (!driverMap.has(key)) {
                driverMap.set(key, {
                    key,
                    name: driverName,
                    earnings: 0,
                    jobIds: new Set()
                });
            }

            const driver = driverMap.get(key);

            driver.earnings += driverCharges;

            const jobId = getId(expense.job);

            if (jobId) {
                driver.jobIds.add(jobId);
            }
        });

        return Array.from(driverMap.values())
            .map(driver => ({
                key: driver.key,
                name: driver.name,
                earnings: driver.earnings,
                jobs: driver.jobIds.size
            }))
            .sort((a, b) => b.earnings - a.earnings);
    }, [period, drivers, expenses]);

    const maxDriverAmount = useMemo(() => {
        return Math.max(
            ...earningsByDriver.map(driver =>
                driver.earnings
            ),
            1
        );
    }, [earningsByDriver]);

    const highestRevenueJob = useMemo(() => {
        if (!jobRows.length) return null;

        return [...jobRows].sort(
            (a, b) => b.revenue - a.revenue
        )[0];
    }, [jobRows]);

    const lowestRevenueJob = useMemo(() => {
        if (!jobRows.length) return null;

        return [...jobRows].sort(
            (a, b) => a.revenue - b.revenue
        )[0];
    }, [jobRows]);

    const highestPaidDriver =
        earningsByDriver[0] || null;

    const periodLabel =
        PERIODS.find(item => item.value === period)
            ?.label || "All Time";

    const isProfit = netEarnings > 0;
    const isLoss = netEarnings < 0;

    return (
        <div>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="mb-2 text-3xl font-bold text-[#1a1a1a]">
                        Earnings Dashboard
                    </h1>

                    <p className="text-gray-500">
                        Revenue, expenses and net business profit.
                    </p>
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-end">
                    <div className="w-full sm:w-52">
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
                            Earnings Period
                        </label>

                        <div className="relative">
                            <FiFilter
                                size={15}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <select
                                value={period}
                                onChange={event =>
                                    setPeriod(event.target.value)
                                }
                                className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm font-semibold text-gray-700 outline-none transition focus:border-[#C0392B]"
                            >
                                {PERIODS.map(item => (
                                    <option
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="w-full sm:w-48">
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
                            PDF Report Period
                        </label>

                        <select
                            value={reportPeriod}
                            onChange={event => setReportPeriod(event.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 outline-none transition focus:border-[#C0392B]"
                        >
                            <option value="all">All Time</option>
                            <option value="weekly">Last 7 Days</option>
                            <option value="last_month">Last Month</option>
                            <option value="last_year">Last Year</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        onClick={handleGenerateReport}
                        disabled={generatingReport}
                        className="flex min-h-10.5 w-full items-center justify-center gap-2 rounded-xl bg-[#C0392B] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                        {generatingReport ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <FiDownload size={16} />
                                Generate PDF
                            </>
                        )}
                    </button>
                </div>
            </div>

            {loading ? (
                <SectionLoader />
            ) : (
                <>
                    <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard
                            title="Gross Revenue"
                            value={`£${formatMoney(grossRevenue)}`}
                            description={`${completedCount} completed jobs · ${periodLabel}`}
                            icon={FiDollarSign}
                            valueClass="text-[#C0392B]"
                            iconClass="bg-red-50 text-[#C0392B]"
                        />

                        <StatCard
                            title="Total Expenses"
                            value={`£${formatMoney(totalExpenses)}`}
                            description={`All business and job expenses`}
                            icon={FiCreditCard}
                            valueClass="text-orange-600"
                            iconClass="bg-orange-50 text-orange-600"
                        />

                        <StatCard
                            title="Net Earnings"
                            value={`£${formatMoney(netEarnings)}`}
                            description={`Average £${formatMoney(
                                averageNetValue
                            )} per completed job`}
                            icon={
                                isLoss
                                    ? FiTrendingDown
                                    : FiTrendingUp
                            }
                            valueClass={
                                isLoss
                                    ? "text-red-600"
                                    : "text-green-600"
                            }
                            iconClass={
                                isLoss
                                    ? "bg-red-50 text-red-600"
                                    : "bg-green-50 text-green-600"
                            }
                        />

                        <StatCard
                            title={
                                isLoss
                                    ? "Business Loss"
                                    : isProfit
                                        ? "Business Profit"
                                        : "Break Even"
                            }
                            value={
                                grossRevenue > 0
                                    ? `${profitMargin.toFixed(1)}%`
                                    : "0.0%"
                            }
                            description={
                                isLoss
                                    ? `Expenses exceed revenue by £${formatMoney(
                                        Math.abs(netEarnings)
                                    )}`
                                    : isProfit
                                        ? "Profit remaining after deducting all expenses from revenue"
                                        : "Revenue and expenses are equal"
                            }
                            icon={
                                isLoss
                                    ? FiTrendingDown
                                    : FiTrendingUp
                            }
                            valueClass={
                                isLoss
                                    ? "text-red-600"
                                    : isProfit
                                        ? "text-green-600"
                                        : "text-gray-600"
                            }
                            iconClass={
                                isLoss
                                    ? "bg-red-50 text-red-600"
                                    : isProfit
                                        ? "bg-green-50 text-green-600"
                                        : "bg-gray-100 text-gray-600"
                            }
                        />
                    </div>

                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2">
                            <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-[#1a1a1a]">
                                <FiTrendingUp
                                    className="text-[#C0392B]"
                                    size={22}
                                />
                                Driver Earnings
                            </h2>

                            {earningsByDriver.length === 0 ? (
                                <p className="py-10 text-center text-sm text-gray-400">
                                    No driver earnings found.
                                </p>
                            ) : (
                                <div className="space-y-5">
                                    {earningsByDriver.map(driver => {
                                        const width =
                                            driver.earnings /
                                            maxDriverAmount *
                                            100;

                                        return (
                                            <div key={driver.key}>
                                                <div className="mb-2 flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="font-semibold text-gray-700">
                                                            {driver.name}
                                                        </p>

                                                        <p className="text-xs text-gray-400">
                                                            {driver.jobs} completed jobs · Driver charges only
                                                        </p>
                                                    </div>

                                                    <div className="text-right">
                                                        <p className="font-bold text-green-600">
                                                            £{formatMoney(driver.earnings)}
                                                        </p>

                                                        <p className="text-[10px] font-bold uppercase text-gray-400">
                                                            Earnings
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                                                    <div
                                                        className="h-2 rounded-full bg-green-500 transition-all"
                                                        style={{
                                                            width: `${Math.max(width, 2)}%`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-[#1a1a1a]">
                                <FiBriefcase
                                    className="text-blue-600"
                                    size={21}
                                />
                                Quick Stats
                            </h2>

                            <div className="space-y-4">
                                <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                                    <p className="mb-1 text-xs font-semibold uppercase text-green-600">
                                        Highest Revenue Job
                                    </p>

                                    <p className="text-xl font-bold text-green-900">
                                        £
                                        {formatMoney(
                                            highestRevenueJob?.revenue
                                        )}
                                    </p>

                                    <p className="mt-1 text-xs text-green-700">
                                        {highestRevenueJob?.bookingRef ||
                                            "No job"}
                                    </p>
                                </div>

                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                                    <p className="mb-1 text-xs font-semibold uppercase text-blue-600">
                                        Lowest Revenue Job
                                    </p>

                                    <p className="text-xl font-bold text-blue-900">
                                        £
                                        {formatMoney(
                                            lowestRevenueJob?.revenue
                                        )}
                                    </p>

                                    <p className="mt-1 text-xs text-blue-700">
                                        {lowestRevenueJob?.bookingRef ||
                                            "No job"}
                                    </p>
                                </div>

                                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                                    <p className="mb-1 text-xs font-semibold uppercase text-yellow-700">
                                        Highest Paid Driver
                                    </p>

                                    <p className="text-lg font-bold text-yellow-900">
                                        {highestPaidDriver?.name || "No driver"}
                                    </p>

                                    <p className="mt-1 text-xs text-yellow-700">
                                        Earnings £
                                        {formatMoney(
                                            highestPaidDriver?.earnings
                                        )}
                                    </p>
                                </div>

                                {generalExpenses > 0 && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                                        <p className="mb-1 text-xs font-semibold uppercase text-red-600">
                                            General Expenses
                                        </p>

                                        <p className="text-xl font-bold text-red-900">
                                            £
                                            {formatMoney(
                                                generalExpenses
                                            )}
                                        </p>

                                        <p className="mt-1 text-xs text-red-700">
                                            Expenses without a linked job
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
                        <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-lg font-bold text-[#1a1a1a]">
                                Completed Jobs
                            </h2>

                            <p className="text-xs text-gray-500">
                                Revenue − linked job expenses = net earning
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-237.5 text-sm">
                                <thead className="border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                            Ref
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                            Customer
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                            Driver
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                            Date
                                        </th>
                                        <th className="px-4 py-3 text-right font-semibold text-gray-700">
                                            Revenue
                                        </th>
                                        <th className="px-4 py-3 text-right font-semibold text-gray-700">
                                            Expenses
                                        </th>
                                        <th className="px-4 py-3 text-right font-semibold text-gray-700">
                                            Net
                                        </th>
                                        <th className="px-4 py-3 text-center font-semibold text-gray-700">
                                            Result
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {jobRows.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="py-12 text-center text-gray-400"
                                            >
                                                No completed jobs found for this period.
                                            </td>
                                        </tr>
                                    ) : (
                                        jobRows.map(job => {
                                            const profitable =
                                                job.net >= 0;

                                            return (
                                                <tr
                                                    key={job._id}
                                                    className="border-b border-gray-100 transition hover:bg-gray-50"
                                                >
                                                    <td className="px-4 py-3 font-semibold text-[#C0392B]">
                                                        {job.bookingRef ||
                                                            "—"}
                                                    </td>

                                                    <td className="px-4 py-3 text-gray-700">
                                                        {job.customer
                                                            ?.name || "—"}
                                                    </td>

                                                    <td className="px-4 py-3 text-gray-700">
                                                        {job.assignedDriver
                                                            ?.name ||
                                                            job.assignedDriverName ||
                                                            "Unassigned"}
                                                    </td>

                                                    <td className="px-4 py-3 text-gray-700">
                                                        {job.date ||
                                                            new Date(
                                                                job.updatedAt ||
                                                                job.createdAt
                                                            ).toLocaleDateString(
                                                                "en-GB"
                                                            )}
                                                    </td>

                                                    <td className="px-4 py-3 text-right font-bold text-green-600">
                                                        £
                                                        {formatMoney(
                                                            job.revenue
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-3 text-right font-bold text-orange-600">
                                                        £
                                                        {formatMoney(
                                                            job.expenses
                                                        )}
                                                    </td>

                                                    <td
                                                        className={`px-4 py-3 text-right font-black ${profitable
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                            }`}
                                                    >
                                                        {profitable
                                                            ? "+"
                                                            : "-"}
                                                        £
                                                        {formatMoney(
                                                            Math.abs(
                                                                job.net
                                                            )
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-3 text-center">
                                                        <span
                                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${profitable
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-red-100 text-red-700"
                                                                }`}
                                                        >
                                                            {profitable
                                                                ? "PROFIT"
                                                                : "LOSS"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}