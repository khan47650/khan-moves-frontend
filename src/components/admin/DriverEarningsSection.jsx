import React, { useMemo, useState } from "react";
import {
    FiChevronDown,
    FiTrendingUp,
    FiTruck
} from "react-icons/fi";
import {
    formatDate,
    formatMoney
} from "../../utils/earningsUtils";

export default function DriverEarningsSection({
    drivers,
    periodLabel
}) {
    const [expanded, setExpanded] = useState("");

    const maxEarnings = useMemo(
        () =>
            Math.max(
                ...drivers.map(
                    driver => driver.earnings
                ),
                1
            ),
        [drivers]
    );

    const totalDriverEarnings = drivers.reduce(
        (sum, driver) =>
            sum + driver.earnings,
        0
    );

    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                        <FiTruck size={21} />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Driver Earnings
                        </h2>

                        <p className="text-sm text-gray-500">
                            Driver charges only for {periodLabel}.
                        </p>
                    </div>
                </div>

                <div className="rounded-xl bg-green-50 px-4 py-3 text-right">
                    <p className="text-xs font-bold uppercase text-green-600">
                        Total Driver Earnings
                    </p>

                    <p className="text-xl font-black text-green-800">
                        £{formatMoney(totalDriverEarnings)}
                    </p>
                </div>
            </div>

            {drivers.length === 0 ? (
                <p className="py-12 text-center text-sm text-gray-400">
                    No driver earnings found for this period.
                </p>
            ) : (
                <div className="space-y-3">
                    {drivers.map(driver => {
                        const open =
                            expanded === driver.key;

                        const width =
                            driver.earnings /
                            maxEarnings *
                            100;

                        return (
                            <div
                                key={driver.key}
                                className="overflow-hidden rounded-xl border border-gray-200"
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setExpanded(
                                            open
                                                ? ""
                                                : driver.key
                                        )
                                    }
                                    className="w-full p-4 text-left hover:bg-gray-50"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="font-bold text-gray-800">
                                                {driver.name}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                {driver.jobs} completed jobs · Driver charges only
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <p className="font-black text-green-600">
                                                    £{formatMoney(
                                                        driver.earnings
                                                    )}
                                                </p>

                                                <p className="text-[10px] font-bold uppercase text-gray-400">
                                                    Earned
                                                </p>
                                            </div>

                                            <FiChevronDown
                                                className={`text-gray-400 transition ${open
                                                        ? "rotate-180"
                                                        : ""
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                                        <div
                                            className="h-full rounded-full bg-green-500"
                                            style={{
                                                width: `${Math.max(
                                                    width,
                                                    2
                                                )}%`
                                            }}
                                        />
                                    </div>
                                </button>

                                {open && (
                                    <div className="border-t border-gray-100 bg-gray-50 p-4">
                                        {driver.details.length === 0 ? (
                                            <p className="text-sm text-gray-400">
                                                No individual job breakdown is available.
                                            </p>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full min-w-140 text-sm">
                                                    <thead>
                                                        <tr className="border-b border-gray-200">
                                                            <th className="px-3 py-2 text-left">
                                                                Job ID
                                                            </th>
                                                            <th className="px-3 py-2 text-left">
                                                                Job Date
                                                            </th>
                                                            <th className="px-3 py-2 text-right">
                                                                Driver Earnings
                                                            </th>
                                                            <th className="px-3 py-2 text-center">
                                                                Night Stay
                                                            </th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {driver.details.map(
                                                            detail => (
                                                                <tr
                                                                    key={detail.key}
                                                                    className="border-b border-gray-100"
                                                                >
                                                                    <td className="px-3 py-2 font-semibold text-[#C0392B]">
                                                                        {detail.jobRef}
                                                                    </td>

                                                                    <td className="px-3 py-2 text-gray-600">
                                                                        {formatDate(
                                                                            detail.date
                                                                        )}
                                                                    </td>

                                                                    <td className="px-3 py-2 text-right font-bold text-green-600">
                                                                        £
                                                                        {formatMoney(
                                                                            detail.earnings
                                                                        )}
                                                                    </td>

                                                                    <td className="px-3 py-2 text-center">
                                                                        <span
                                                                            className={`rounded-full px-2 py-1 text-xs font-bold ${detail.nightStay
                                                                                    ? "bg-blue-100 text-blue-700"
                                                                                    : "bg-gray-200 text-gray-600"
                                                                                }`}
                                                                        >
                                                                            {detail.nightStay
                                                                                ? "Yes"
                                                                                : "No"}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}