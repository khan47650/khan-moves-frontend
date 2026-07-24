export const expenseCategories = [
    { id: "fuel", label: "Fuel", field: "fuel" },
    { id: "congestionUlez", label: "Congestion / ULEZ", field: "other" },
    { id: "driverPay", label: "Driver Pay", field: "driverCharges" },
    { id: "nightStay", label: "Night Stay", field: "nightStay" },
    { id: "repair", label: "Repairs", field: "repair" }
];

export const periodOptions = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "last_7_days", label: "Last 7 Days" },
    { value: "this_month", label: "This Month" },
    { value: "this_year", label: "This Year" },
    { value: "all", label: "All Time" },
    { value: "custom", label: "Custom Range" }
];

export const num = v => Number(v || 0);
export const money = v => num(v).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const getId = v => typeof v === "string" ? v : v?._id || "";

const parseDate = v => {
    if (!v) return null;
    const d = typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? new Date(`${v}T12:00:00`) : new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
};

const start = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x };
const end = d => { const x = new Date(d); x.setHours(23, 59, 59, 999); return x };

export const formatDate = v => {
    const d = parseDate(v);
    return d ? d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
};

export const expenseTotal = e =>
    num(e.driverCharges) +
    num(e.nightStay) +
    num(e.fuel) +
    num(e.repair) +
    num(e.other);

export const getCategory = e => {
    if (e.expenseCategory) return e.expenseCategory;
    if (num(e.fuel) > 0) return "fuel";
    if (num(e.driverCharges) > 0) return "driverPay";
    if (num(e.nightStay) > 0) return "nightStay";
    if (num(e.repair) > 0) return "repair";
    if (num(e.other) > 0) return "congestionUlez";
    return "fuel";
};

export const categoryAmount = (e, cat) => {
    const found = expenseCategories.find(x => x.id === cat);
    return found ? num(e[found.field]) : expenseTotal(e);
};

export const getRange = (period, custom = {}) => {
    const now = new Date();
    if (period === "all") return null;
    if (period === "today") return { from: start(now), to: end(now) };
    if (period === "yesterday") { const y = new Date(now); y.setDate(y.getDate() - 1); return { from: start(y), to: end(y) } }
    if (period === "last_7_days") { const s = new Date(now); s.setDate(s.getDate() - 6); return { from: start(s), to: end(now) } }
    if (period === "this_month") return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: end(now) };
    if (period === "this_year") return { from: new Date(now.getFullYear(), 0, 1), to: end(now) };
    if (period === "custom") return { from: custom.from ? start(parseDate(custom.from)) : null, to: custom.to ? end(parseDate(custom.to)) : null };
    return null;
};

const inRange = (date, range) => {
    if (!range) return true;
    if (!date) return false;
    if (range.from && date < range.from) return false;
    if (range.to && date > range.to) return false;
    return true;
};

export const buildExpenseData = ({
    expenses = [],
    category = "all",
    period = "all",
    customRange = {}
}) => {
    const range = getRange(
        period,
        customRange
    );

    // Time filter
    const dateFilteredExpenses = expenses.filter(expense =>
        inRange(
            parseDate(
                expense.expenseDate ||
                expense.createdAt
            ),
            range
        )
    );

    // Exact category filter
    const categoryFilteredExpenses =
        category === "all"
            ? dateFilteredExpenses.filter(
                expense =>
                    expenseTotal(expense) > 0
            )
            : dateFilteredExpenses.filter(
                expense =>
                    getCategory(expense) === category
            );

    const rows = categoryFilteredExpenses.map(
        expense => {
            const categoryId =
                getCategory(expense);

            const categoryObject =
                expenseCategories.find(
                    item =>
                        item.id === categoryId
                );

            return {
                ...expense,
                categoryId,
                categoryLabel:
                    categoryObject?.label ||
                    "Expense",

                // Har row me sirf uski own category amount
                displayAmount:
                    categoryAmount(
                        expense,
                        categoryId
                    )
            };
        }
    );

    /*
     * Totals bhi ab sirf filtered rows se calculate honge.
     * Selected Fuel par Driver Pay / Repair totals include nahi honge.
     */
    const totals = {
        fuel: 0,
        congestionUlez: 0,
        driverPay: 0,
        nightStay: 0,
        repair: 0
    };

    rows.forEach(expense => {
        if (
            Object.prototype.hasOwnProperty.call(
                totals,
                expense.categoryId
            )
        ) {
            totals[expense.categoryId] +=
                num(expense.displayAmount);
        }
    });

    const filteredTotal = rows.reduce(
        (sum, expense) =>
            sum +
            num(expense.displayAmount),
        0
    );

    const chartMap = new Map();

    rows.forEach(expense => {
        const dateKey = formatDate(
            expense.expenseDate ||
            expense.createdAt
        );

        const currentAmount = num(
            chartMap.get(dateKey)
        );

        chartMap.set(
            dateKey,
            currentAmount +
            num(expense.displayAmount)
        );
    });

    return {
        rows,
        totals,
        filteredTotal,
        count: rows.length,
        chart: Array.from(
            chartMap.entries()
        ).map(([date, amount]) => ({
            date,
            amount
        }))
    };
};