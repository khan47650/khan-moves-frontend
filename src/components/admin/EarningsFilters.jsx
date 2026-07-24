import React from "react";
import {
    FiCalendar,
    FiDownload,
    FiFilter
} from "react-icons/fi";
import { PERIODS } from "../../utils/earningsUtils";

export default function EarningsFilters({
    period,
    onPeriodChange,
    customRange,
    onCustomRangeChange,
    onGenerateReport,
    generatingReport
}) {
    const customInvalid =
        period === "custom" &&
        (!customRange.from || !customRange.to);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="w-full sm:w-56">
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
                            Finance Period
                        </label>

                        <div className="relative">
                            <FiFilter
                                size={15}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <select
                                value={period}
                                onChange={event =>
                                    onPeriodChange(
                                        event.target.value
                                    )
                                }
                                className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm font-semibold text-gray-700 outline-none focus:border-[#C0392B]"
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

                    {period === "custom" && (
                        <>
                            <div className="w-full sm:w-44">
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
                                    From Date
                                </label>

                                <div className="relative">
                                    <FiCalendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                                    <input
                                        type="date"
                                        value={customRange.from}
                                        max={customRange.to || undefined}
                                        onChange={event =>
                                            onCustomRangeChange({
                                                ...customRange,
                                                from: event.target.value
                                            })
                                        }
                                        className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#C0392B]"
                                    />
                                </div>
                            </div>

                            <div className="w-full sm:w-44">
                                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
                                    To Date
                                </label>

                                <div className="relative">
                                    <FiCalendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                                    <input
                                        type="date"
                                        value={customRange.to}
                                        min={customRange.from || undefined}
                                        onChange={event =>
                                            onCustomRangeChange({
                                                ...customRange,
                                                to: event.target.value
                                            })
                                        }
                                        className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#C0392B]"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <button
                    type="button"
                    onClick={onGenerateReport}
                    disabled={
                        generatingReport ||
                        customInvalid
                    }
                    className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#C0392B] px-5 py-2.5 text-sm font-bold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {generatingReport ? (
                        <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <FiDownload size={16} />
                            Generate Current View PDF
                        </>
                    )}
                </button>
            </div>

            {customInvalid && (
                <p className="mt-3 text-xs font-medium text-red-600">
                    Select both dates to use the custom range.
                </p>
            )}
        </div>
    );
}