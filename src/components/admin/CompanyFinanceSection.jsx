import React from "react";
import {
    FiBriefcase,
    FiCreditCard,
    FiDollarSign,
    FiTrendingDown,
    FiTrendingUp
} from "react-icons/fi";
import { formatMoney } from "../../utils/earningsUtils";

function StatCard({
    title,
    value,
    description,
    icon: Icon,
    valueClass,
    iconClass
}) {
    return (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
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

            <p className="mt-2 text-xs text-gray-500">
                {description}
            </p>
        </div>
    );
}

function RevenueJobCard({
    title,
    job,
    className
}) {
    return (
        <div className={`rounded-xl border p-4 ${className}`}>
            <p className="text-xs font-bold uppercase">
                {title}
            </p>

            <p className="mt-2 text-2xl font-black">
                £{formatMoney(job?.revenue)}
            </p>

            <p className="mt-1 text-xs">
                {job?.bookingRef || "No completed job"}
            </p>
        </div>
    );
}

export default function CompanyFinanceSection({
    data
}) {
    const profit = data.businessProfit >= 0;

    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#C0392B]">
                    <FiBriefcase size={21} />
                </div>

                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Company Finance
                    </h2>

                    <p className="text-sm text-gray-500">
                        Revenue, business expenses and profit for {data.periodLabel}.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Gross Revenue"
                    value={`£${formatMoney(
                        data.grossRevenue
                    )}`}
                    description={`${data.completedCount} completed jobs`}
                    icon={FiDollarSign}
                    valueClass="text-[#C0392B]"
                    iconClass="bg-red-100 text-[#C0392B]"
                />

                <StatCard
                    title="Total Expenses"
                    value={`£${formatMoney(
                        data.totalExpenses
                    )}`}
                    description={`£${formatMoney(
                        data.jobExpenses
                    )} job expenses · £${formatMoney(
                        data.generalExpenses
                    )} general`}
                    icon={FiCreditCard}
                    valueClass="text-orange-600"
                    iconClass="bg-orange-100 text-orange-600"
                />

                <StatCard
                    title="Net Earnings"
                    value={`£${formatMoney(
                        data.netEarnings
                    )}`}
                    description="Revenue after direct job expenses"
                    icon={
                        data.netEarnings >= 0
                            ? FiTrendingUp
                            : FiTrendingDown
                    }
                    valueClass={
                        data.netEarnings >= 0
                            ? "text-green-600"
                            : "text-red-600"
                    }
                    iconClass={
                        data.netEarnings >= 0
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                    }
                />

                <StatCard
                    title="Business Profit"
                    value={`${profit ? "" : "-"}£${formatMoney(
                        Math.abs(data.businessProfit)
                    )}`}
                    description={
                        profit
                            ? `${data.profitMargin.toFixed(
                                1
                            )}% profit margin`
                            : `Operating loss of £${formatMoney(
                                Math.abs(data.businessProfit)
                            )}`
                    }
                    icon={
                        profit
                            ? FiTrendingUp
                            : FiTrendingDown
                    }
                    valueClass={
                        profit
                            ? "text-green-600"
                            : "text-red-600"
                    }
                    iconClass={
                        profit
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                    }
                />
            </div>

            <div className="mt-7">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-500">
                    Quick Stats
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                    <RevenueJobCard
                        title="Highest Revenue Job"
                        job={data.highestRevenueJob}
                        className="border-green-200 bg-green-50 text-green-800"
                    />

                    <RevenueJobCard
                        title="Lowest Revenue Job"
                        job={data.lowestRevenueJob}
                        className="border-blue-200 bg-blue-50 text-blue-800"
                    />
                </div>
            </div>
        </section>
    );
}