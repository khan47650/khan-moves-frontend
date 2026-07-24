import React from "react";
import {
    expenseCategories,
    money
} from "../../utils/expenseUtils";

const categoryColors = {
    fuel: "text-blue-600",
    congestionUlez: "text-amber-600",
    driverPay: "text-purple-600",
    nightStay: "text-indigo-600",
    repair: "text-orange-600"
};

export default function ExpenseSummary({
    data,
    category
}) {
    const selectedCategory =
        expenseCategories.find(
            item => item.id === category
        );

    const cards =
        category === "all"
            ? [
                {
                    label: "All Expenses",
                    value: data.filteredTotal,
                    color: "text-[#C0392B]"
                },
                {
                    label: "Fuel",
                    value: data.totals.fuel,
                    color: "text-blue-600"
                },
                {
                    label: "Driver Pay",
                    value: data.totals.driverPay,
                    color: "text-purple-600"
                },
                {
                    label: "Repairs",
                    value: data.totals.repair,
                    color: "text-orange-600"
                }
            ]
            : [
                {
                    label:
                        selectedCategory?.label ||
                        "Filtered Expenses",
                    value: data.filteredTotal,
                    color:
                        categoryColors[category] ||
                        "text-[#C0392B]"
                },
                {
                    label: "Filtered Records",
                    value: data.count,
                    color: "text-[#1a1a1a]",
                    isCount: true
                }
            ];

    return (
        <div
            className={`grid gap-4 ${category === "all"
                    ? "sm:grid-cols-2 lg:grid-cols-4"
                    : "sm:grid-cols-2"
                }`}
        >
            {cards.map(card => (
                <div
                    key={card.label}
                    className="rounded-2xl border border-gray-200 bg-white p-5"
                >
                    <p className="mb-2 text-xs font-bold uppercase text-gray-500">
                        {card.label}
                    </p>

                    <p
                        className={`text-3xl font-black ${card.color}`}
                    >
                        {card.isCount
                            ? card.value
                            : `£${money(card.value)}`}
                    </p>
                </div>
            ))}
        </div>
    );
}