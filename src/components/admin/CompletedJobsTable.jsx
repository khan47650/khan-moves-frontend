import React from "react";
import {
    formatDate,
    formatMoney
} from "../../utils/earningsUtils";

export default function CompletedJobsTable({
    jobs,
    periodLabel
}) {
    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Completed Jobs
                    </h2>

                    <p className="text-sm text-gray-500">
                        Every completed job in {periodLabel}.
                    </p>
                </div>

                <p className="text-xs text-gray-400">
                    Revenue − job expenses = job net
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-225 text-sm">
                    <thead className="border-b border-gray-200 bg-gray-50">
                        <tr>
                            {[
                                "Ref",
                                "Customer",
                                "Driver",
                                "Date",
                                "Revenue",
                                "Expenses",
                                "Net",
                                "Result"
                            ].map((heading, index) => (
                                <th
                                    key={heading}
                                    className={`px-4 py-3 font-semibold text-gray-700 ${index >= 4
                                            ? "text-right"
                                            : "text-left"
                                        } ${heading === "Result"
                                            ? "text-center"
                                            : ""
                                        }`}
                                >
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {jobs.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="py-12 text-center text-gray-400"
                                >
                                    No completed jobs found for this period.
                                </td>
                            </tr>
                        ) : (
                            jobs.map(job => {
                                const profitable =
                                    job.net >= 0;

                                return (
                                    <tr
                                        key={job._id}
                                        className="border-b border-gray-100 hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3 font-bold text-[#C0392B]">
                                            {job.bookingRef || "—"}
                                        </td>

                                        <td className="px-4 py-3 text-gray-700">
                                            {job.customer?.name || "—"}
                                        </td>

                                        <td className="px-4 py-3 text-gray-700">
                                            {job.assignedDriver?.name ||
                                                job.assignedDriverName ||
                                                "Unassigned"}
                                        </td>

                                        <td className="px-4 py-3 text-gray-700">
                                            {formatDate(
                                                job.date ||
                                                job.updatedAt ||
                                                job.createdAt
                                            )}
                                        </td>

                                        <td className="px-4 py-3 text-right font-bold text-green-600">
                                            £{formatMoney(job.revenue)}
                                        </td>

                                        <td className="px-4 py-3 text-right font-bold text-orange-600">
                                            £{formatMoney(job.expenses)}
                                        </td>

                                        <td
                                            className={`px-4 py-3 text-right font-black ${profitable
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                                }`}
                                        >
                                            {profitable ? "+" : "-"}£
                                            {formatMoney(
                                                Math.abs(job.net)
                                            )}
                                        </td>

                                        <td className="px-4 py-3 text-center">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-bold ${profitable
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
        </section>
    );
}