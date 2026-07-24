export const PERIODS = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "last_7_days", label: "Last 7 Days" },
    { value: "this_month", label: "This Month" },
    { value: "this_year", label: "This Year" },
    { value: "all", label: "All Time" },
    { value: "custom", label: "Custom Date Range" }
];

export const numberValue = value => Number(value || 0);

export const getId = value =>
    typeof value === "string"
        ? value
        : value?._id || "";

export const formatMoney = value =>
    numberValue(value).toLocaleString("en-GB", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

const parseDate = value => {
    if (!value) return null;

    const date =
        typeof value === "string" &&
            /^\d{4}-\d{2}-\d{2}$/.test(value)
            ? new Date(`${value}T12:00:00`)
            : new Date(value);

    return Number.isNaN(date.getTime())
        ? null
        : date;
};

const startOfDay = value => {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
};

const endOfDay = value => {
    const date = new Date(value);
    date.setHours(23, 59, 59, 999);
    return date;
};

export const formatDate = value => {
    const date = parseDate(value);

    return date
        ? date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
        : "—";
};

export const getExpenseTotal = expense => {
    const storedTotal = numberValue(
        expense.totalExpense
    );

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

export const getJobDate = job =>
    parseDate(
        job.date ||
        job.updatedAt ||
        job.createdAt
    );

const getExpenseDate = expense =>
    parseDate(
        expense.createdAt ||
        expense.updatedAt
    );

export const getDateRange = (
    period,
    customRange = {}
) => {
    if (period === "all") return null;

    const now = new Date();

    if (period === "today") {
        return {
            start: startOfDay(now),
            end: endOfDay(now)
        };
    }

    if (period === "yesterday") {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);

        return {
            start: startOfDay(yesterday),
            end: endOfDay(yesterday)
        };
    }

    if (period === "last_7_days") {
        const start = new Date(now);
        start.setDate(now.getDate() - 6);

        return {
            start: startOfDay(start),
            end: endOfDay(now)
        };
    }

    if (period === "this_month") {
        return {
            start: new Date(
                now.getFullYear(),
                now.getMonth(),
                1
            ),
            end: endOfDay(now)
        };
    }

    if (period === "this_year") {
        return {
            start: new Date(
                now.getFullYear(),
                0,
                1
            ),
            end: endOfDay(now)
        };
    }

    if (period === "custom") {
        const start = parseDate(customRange.from);
        const end = parseDate(customRange.to);

        return {
            start: start
                ? startOfDay(start)
                : null,
            end: end
                ? endOfDay(end)
                : null
        };
    }

    return null;
};

const isWithinRange = (date, range) => {
    if (!range) return true;
    if (!date) return false;

    if (range.start && date < range.start) {
        return false;
    }

    if (range.end && date > range.end) {
        return false;
    }

    return true;
};

export const getPeriodLabel = (
    period,
    customRange
) => {
    if (
        period === "custom" &&
        customRange.from &&
        customRange.to
    ) {
        return `${formatDate(
            customRange.from
        )} - ${formatDate(customRange.to)}`;
    }

    return (
        PERIODS.find(item => item.value === period)
            ?.label || "All Time"
    );
};

const createDriverBreakdown = ({
    expenses,
    jobsMap
}) => {
    const map = new Map();

    expenses.forEach(expense => {
        const earnings = numberValue(
            expense.driverCharges
        );

        if (earnings <= 0) return;

        const driverId = getId(expense.driver);

        const driverName =
            expense.driver?.name ||
            expense.driverName ||
            "Unknown Driver";

        const key =
            driverId ||
            `name:${driverName.toLowerCase()}`;

        if (!map.has(key)) {
            map.set(key, {
                key,
                name: driverName,
                earnings: 0,
                jobIds: new Set(),
                details: new Map()
            });
        }

        const driver = map.get(key);
        const jobId = getId(expense.job);
        const job = jobsMap.get(jobId);

        driver.earnings += earnings;

        if (jobId) {
            driver.jobIds.add(jobId);
        }

        const detailKey =
            jobId ||
            `expense:${expense._id}`;

        if (!driver.details.has(detailKey)) {
            driver.details.set(detailKey, {
                key: detailKey,
                jobRef:
                    expense.job?.bookingRef ||
                    job?.bookingRef ||
                    expense.jobRef ||
                    "General",
                date:
                    expense.job?.date ||
                    job?.date ||
                    expense.createdAt,
                earnings: 0,
                nightStay: false
            });
        }

        const detail =
            driver.details.get(detailKey);

        detail.earnings += earnings;
        detail.nightStay =
            detail.nightStay ||
            numberValue(expense.nightStay) > 0;
    });

    return map;
};

export const buildEarningsData = ({
    jobs = [],
    expenses = [],
    drivers = [],
    period = "all",
    customRange = {}
}) => {
    const range = getDateRange(
        period,
        customRange
    );

    const filteredJobs = jobs.filter(job =>
        isWithinRange(getJobDate(job), range)
    );

    const filteredJobIds = new Set(
        filteredJobs.map(job => String(job._id))
    );

    const jobsMap = new Map(
        jobs.map(job => [
            String(job._id),
            job
        ])
    );

    /*
     * All expenses linked to selected jobs are used,
     * regardless of when the expense was entered.
     */
    const linkedExpenses = expenses.filter(expense => {
        const jobId = getId(expense.job);

        return (
            jobId &&
            filteredJobIds.has(String(jobId))
        );
    });

    /*
     * Unlinked company expenses are filtered
     * using their own creation date.
     */
    const generalExpenseRows = expenses.filter(expense => {
        if (getId(expense.job)) return false;

        return isWithinRange(
            getExpenseDate(expense),
            range
        );
    });

    const relevantExpenses = [
        ...linkedExpenses,
        ...generalExpenseRows
    ];

    const expensesByJob = new Map();

    linkedExpenses.forEach(expense => {
        const jobId = String(
            getId(expense.job)
        );

        expensesByJob.set(
            jobId,
            numberValue(expensesByJob.get(jobId)) +
            getExpenseTotal(expense)
        );
    });

    const jobRows = filteredJobs.map(job => {
        const revenue = numberValue(
            job.totalPrice
        );

        const jobExpenses = numberValue(
            expensesByJob.get(String(job._id))
        );

        return {
            ...job,
            revenue,
            expenses: jobExpenses,
            net: revenue - jobExpenses
        };
    });

    const grossRevenue = jobRows.reduce(
        (sum, job) => sum + job.revenue,
        0
    );

    const jobExpenses = linkedExpenses.reduce(
        (sum, expense) =>
            sum + getExpenseTotal(expense),
        0
    );

    const generalExpenses =
        generalExpenseRows.reduce(
            (sum, expense) =>
                sum + getExpenseTotal(expense),
            0
        );

    const totalExpenses =
        jobExpenses + generalExpenses;

    /*
     * Net earnings are after direct job expenses.
     * Business profit also deducts general expenses.
     */
    const netEarnings =
        grossRevenue - jobExpenses;

    const businessProfit =
        netEarnings - generalExpenses;

    const profitMargin =
        grossRevenue > 0
            ? businessProfit / grossRevenue * 100
            : 0;

    const driverBreakdown =
        createDriverBreakdown({
            expenses: relevantExpenses,
            jobsMap
        });

    let driverEarnings = [];

    if (period === "all") {
        const usedKeys = new Set();

        driverEarnings = drivers.map(driver => {
            const idKey = String(driver._id);

            const nameKey =
                `name:${String(
                    driver.name || ""
                ).toLowerCase()}`;

            const breakdown =
                driverBreakdown.get(idKey) ||
                driverBreakdown.get(nameKey);

            if (breakdown) {
                usedKeys.add(breakdown.key);
            }

            return {
                key: idKey,
                name:
                    driver.name ||
                    "Unknown Driver",
                earnings: numberValue(
                    driver.earnings
                ),
                jobs: numberValue(
                    driver.totalJobs
                ),
                details: breakdown
                    ? Array.from(
                        breakdown.details.values()
                    )
                    : []
            };
        });

        driverBreakdown.forEach(driver => {
            if (usedKeys.has(driver.key)) return;

            driverEarnings.push({
                key: driver.key,
                name: driver.name,
                earnings: driver.earnings,
                jobs: driver.jobIds.size,
                details: Array.from(
                    driver.details.values()
                )
            });
        });
    } else {
        driverEarnings = Array.from(
            driverBreakdown.values()
        ).map(driver => ({
            key: driver.key,
            name: driver.name,
            earnings: driver.earnings,
            jobs: driver.jobIds.size,
            details: Array.from(
                driver.details.values()
            )
        }));
    }

    driverEarnings = driverEarnings
        .filter(driver =>
            driver.earnings > 0 ||
            driver.jobs > 0
        )
        .map(driver => ({
            ...driver,
            details: [...driver.details].sort(
                (a, b) =>
                    new Date(b.date || 0) -
                    new Date(a.date || 0)
            )
        }))
        .sort(
            (a, b) =>
                b.earnings - a.earnings
        );

    const highestRevenueJob =
        jobRows.length > 0
            ? [...jobRows].sort(
                (a, b) =>
                    b.revenue - a.revenue
            )[0]
            : null;

    const lowestRevenueJob =
        jobRows.length > 0
            ? [...jobRows].sort(
                (a, b) =>
                    a.revenue - b.revenue
            )[0]
            : null;

    return {
        periodLabel: getPeriodLabel(
            period,
            customRange
        ),
        filteredJobs,
        relevantExpenses,
        jobRows,
        driverEarnings,
        grossRevenue,
        jobExpenses,
        generalExpenses,
        totalExpenses,
        netEarnings,
        businessProfit,
        profitMargin,
        completedCount: jobRows.length,
        highestRevenueJob,
        lowestRevenueJob
    };
};