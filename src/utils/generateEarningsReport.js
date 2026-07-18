import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

const COMPANY = {
    name: "Khan Moves Limited",
    subtitle: "UK Moving Service",
    phone: "07424 153126",
    email: "khanmovesuk@gmail.com",
    address:
        "265 Golden Hillock Road, Sparkbrook, Birmingham, England, B11 2PH",
    logo: "/Khan_Logo_transparent.png"
};

const PERIOD_LABELS = {
    all: "All Time",
    weekly: "Last 7 Days",
    last_month: "Last Month",
    last_year: "Last Year"
};

const COLORS = {
    red: [192, 57, 43],
    dark: [26, 26, 26],
    gray: [107, 114, 128],
    lightGray: [247, 247, 247],
    border: [225, 225, 225],
    green: [22, 163, 74],
    greenBg: [236, 253, 245],
    orange: [234, 88, 12],
    redDark: [220, 38, 38],
    redBg: [254, 242, 242],
    white: [255, 255, 255]
};

const numberValue = value => Number(value || 0);

const getId = value =>
    typeof value === "string" ? value : value?._id || "";

const formatMoney = value =>
    numberValue(value).toLocaleString("en-GB", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

const formatDate = value => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

const getExpenseTotal = expense => {
    const savedTotal = numberValue(expense.totalExpense);

    if (savedTotal > 0) {
        return savedTotal;
    }

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

    if (Number.isNaN(date.getTime())) {
        return false;
    }

    const now = new Date();

    if (period === "weekly") {
        const start = new Date(now);
        start.setDate(start.getDate() - 7);
        start.setHours(0, 0, 0, 0);

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

const loadImage = async url => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Logo could not be loaded");
    }

    const blob = await response.blob();

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const drawSummaryCard = ({
    doc,
    x,
    y,
    width,
    title,
    value,
    valueColor
}) => {
    doc.setFillColor(...COLORS.lightGray);
    doc.roundedRect(x, y, width, 22, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.gray);
    doc.text(title.toUpperCase(), x + 4, y + 7);

    doc.setFontSize(13);
    doc.setTextColor(...valueColor);
    doc.text(value, x + 4, y + 17);
};

const drawQuickCard = ({
    doc,
    x,
    y,
    width,
    title,
    value,
    subtitle = ""
}) => {
    doc.setDrawColor(...COLORS.border);
    doc.setFillColor(...COLORS.white);
    doc.roundedRect(x, y, width, 20, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(...COLORS.gray);
    doc.text(title.toUpperCase(), x + 4, y + 6);

    doc.setFontSize(10);
    doc.setTextColor(...COLORS.dark);
    doc.text(value, x + 4, y + 13);

    if (subtitle) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(6);
        doc.setTextColor(...COLORS.gray);
        doc.text(subtitle, x + 4, y + 17);
    }
};

const drawMainHeader = async ({
    doc,
    pageWidth,
    periodLabel,
    generatedDate
}) => {
    doc.setFillColor(...COLORS.red);
    doc.rect(0, 0, pageWidth, 39, "F");

    /*
     * White circular background like the invoice logo.
     */
    doc.setFillColor(...COLORS.white);
    doc.circle(27, 19.5, 14, "F");

    try {
        const logo = await loadImage(COMPANY.logo);

        doc.addImage(
            logo,
            "PNG",
            17.5,
            10,
            19,
            19
        );
    } catch {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...COLORS.red);
        doc.text("KHAN", 27, 18, {
            align: "center"
        });
        doc.text("MOVES", 27, 23, {
            align: "center"
        });
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...COLORS.white);
    doc.text(COMPANY.name, 46, 16);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(255, 220, 220);
    doc.text(COMPANY.subtitle, 46, 23);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(25);
    doc.setTextColor(...COLORS.white);
    doc.text("EARNINGS REPORT", pageWidth - 13, 18, {
        align: "right"
    });

    doc.setFontSize(7.5);
    doc.setTextColor(255, 220, 220);
    doc.text(periodLabel, pageWidth - 13, 27, {
        align: "right"
    });

    doc.text(
        `Generated: ${generatedDate}`,
        pageWidth - 13,
        33,
        { align: "right" }
    );
};

const drawContinuationHeader = ({
    doc,
    pageWidth,
    periodLabel
}) => {
    doc.setFillColor(...COLORS.red);
    doc.rect(0, 0, pageWidth, 14, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.white);
    doc.text(COMPANY.name, 13, 9);

    doc.setFont("helvetica", "normal");
    doc.text(
        `Earnings Report - ${periodLabel}`,
        pageWidth - 13,
        9,
        { align: "right" }
    );
};

const drawSectionTitle = ({
    doc,
    title,
    y
}) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.dark);
    doc.text(title, 13, y);

    doc.setDrawColor(...COLORS.red);
    doc.setLineWidth(0.7);
    doc.line(13, y + 2.5, 44, y + 2.5);
};

const drawFooter = ({
    doc,
    pageWidth,
    pageHeight
}) => {
    const totalPages = doc.getNumberOfPages();

    for (let page = 1; page <= totalPages; page += 1) {
        doc.setPage(page);

        doc.setDrawColor(...COLORS.border);
        doc.setLineWidth(0.3);
        doc.line(
            13,
            pageHeight - 17,
            pageWidth - 13,
            pageHeight - 17
        );

        doc.setFont("helvetica", "normal");
        doc.setFontSize(6.5);
        doc.setTextColor(...COLORS.gray);

        doc.text(
            COMPANY.address,
            pageWidth / 2,
            pageHeight - 11,
            { align: "center" }
        );

        doc.text(
            `${COMPANY.phone} · ${COMPANY.email}`,
            pageWidth / 2,
            pageHeight - 7,
            { align: "center" }
        );

        doc.text(
            `Page ${page} of ${totalPages}`,
            pageWidth - 13,
            pageHeight - 7,
            { align: "right" }
        );
    }
};

export const generateEarningsReport = async ({
    period,
    jobs,
    expenses,
    drivers = []
}) => {
    const periodLabel =
        PERIOD_LABELS[period] || "Selected Period";

    const filteredJobs = jobs.filter(job =>
        isInPeriod(getJobDate(job), period)
    );

    const expensesByJob = new Map();

    expenses.forEach(expense => {
        const jobId = getId(expense.job);

        if (!jobId) return;

        const key = String(jobId);

        expensesByJob.set(
            key,
            numberValue(expensesByJob.get(key)) +
            getExpenseTotal(expense)
        );
    });

    const jobRows = filteredJobs.map(job => {
        const revenue = numberValue(job.totalPrice);

        const jobExpenses = numberValue(
            expensesByJob.get(String(job._id))
        );

        return {
            id: job._id,
            ref: job.bookingRef || "—",
            customer: job.customer?.name || "—",
            driver:
                job.assignedDriver?.name ||
                job.assignedDriverName ||
                "Unassigned",
            driverId:
                getId(job.assignedDriver) ||
                job.assignedDriverName ||
                "unassigned",
            date: job.date
                ? formatDate(`${job.date}T12:00:00`)
                : formatDate(
                    job.updatedAt || job.createdAt
                ),
            revenue,
            expenses: jobExpenses,
            net: revenue - jobExpenses
        };
    });

    const grossRevenue = jobRows.reduce(
        (sum, job) => sum + job.revenue,
        0
    );

    const totalExpenses = expenses.reduce(
        (sum, expense) =>
            sum + getExpenseTotal(expense),
        0
    );

    const netEarnings =
        grossRevenue - totalExpenses;

    const completedCount = jobRows.length;

    const averageRevenue =
        completedCount > 0
            ? grossRevenue / completedCount
            : 0;

    const averageNet =
        completedCount > 0
            ? netEarnings / completedCount
            : 0;

    const profitMargin =
        grossRevenue > 0
            ? (netEarnings / grossRevenue) * 100
            : 0;

    const generalExpenses = expenses
        .filter(expense => !getId(expense.job))
        .reduce(
            (sum, expense) =>
                sum + getExpenseTotal(expense),
            0
        );

    const expenseCategories = [
        {
            name: "Driver Charges",
            amount: expenses.reduce(
                (sum, item) =>
                    sum + numberValue(item.driverCharges),
                0
            )
        },
        {
            name: "Night Stay",
            amount: expenses.reduce(
                (sum, item) =>
                    sum + numberValue(item.nightStay),
                0
            )
        },
        {
            name: "Meals",
            amount: expenses.reduce(
                (sum, item) =>
                    sum + numberValue(item.meals),
                0
            )
        },
        {
            name: "Fuel",
            amount: expenses.reduce(
                (sum, item) =>
                    sum + numberValue(item.fuel),
                0
            )
        },
        {
            name: "Repairs",
            amount: expenses.reduce(
                (sum, item) =>
                    sum + numberValue(item.repair),
                0
            )
        },
        {
            name: "Other",
            amount: expenses.reduce(
                (sum, item) =>
                    sum + numberValue(item.other),
                0
            )
        }
    ];

    let driverRows = [];

    if (period === "all") {
        /*
         * All-time driver earnings come directly
         * from the Driver collection.
         */
        driverRows = drivers
            .map(driver => ({
                key: driver._id,
                name: driver.name || "Unknown Driver",
                jobs: numberValue(driver.totalJobs),
                earnings: numberValue(driver.earnings)
            }))
            .filter(driver =>
                driver.earnings > 0 || driver.jobs > 0
            )
            .sort((a, b) => b.earnings - a.earnings);
    } else {
        /*
         * Filtered reports use only driverCharges
         * from expenses in the selected period.
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

        driverRows = Array.from(driverMap.values())
            .map(driver => ({
                key: driver.key,
                name: driver.name,
                jobs: driver.jobIds.size,
                earnings: driver.earnings
            }))
            .sort((a, b) => b.earnings - a.earnings);
    }

    const highestRevenueJob =
        jobRows.length > 0
            ? [...jobRows].sort(
                (a, b) => b.revenue - a.revenue
            )[0]
            : null;

    const lowestRevenueJob =
        jobRows.length > 0
            ? [...jobRows].sort(
                (a, b) => a.revenue - b.revenue
            )[0]
            : null;

    const highestPaidDriver =
        driverRows[0] || null;

    const isProfit = netEarnings >= 0;

    const generatedDate =
        new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    doc.setProperties({
        title: `${COMPANY.name} Earnings Report`,
        subject: `${periodLabel} earnings report`,
        author: COMPANY.name
    });

    const pageWidth =
        doc.internal.pageSize.getWidth();

    const pageHeight =
        doc.internal.pageSize.getHeight();

    await drawMainHeader({
        doc,
        pageWidth,
        periodLabel,
        generatedDate
    });

    /*
     * Report information line.
     */
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.red);
    doc.text("Report Period:", 13, 48);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.dark);
    doc.text(periodLabel, 34, 48);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.dark);
    doc.text(
        "Completed Jobs:",
        pageWidth - 45,
        48,
        { align: "right" }
    );

    doc.setFont("helvetica", "normal");
    doc.text(
        String(completedCount),
        pageWidth - 13,
        48,
        { align: "right" }
    );

    doc.setDrawColor(...COLORS.border);
    doc.line(13, 53, pageWidth - 13, 53);

    /*
     * Main summary.
     */
    const cardY = 59;
    const gap = 3;
    const cardWidth =
        (pageWidth - 26 - gap * 3) / 4;

    drawSummaryCard({
        doc,
        x: 13,
        y: cardY,
        width: cardWidth,
        title: "Gross Revenue",
        value: `£${formatMoney(grossRevenue)}`,
        valueColor: COLORS.red
    });

    drawSummaryCard({
        doc,
        x: 13 + cardWidth + gap,
        y: cardY,
        width: cardWidth,
        title: "Total Expenses",
        value: `£${formatMoney(totalExpenses)}`,
        valueColor: COLORS.orange
    });

    drawSummaryCard({
        doc,
        x: 13 + (cardWidth + gap) * 2,
        y: cardY,
        width: cardWidth,
        title: "Net Earnings",
        value: `${netEarnings < 0 ? "-" : ""
            }£${formatMoney(Math.abs(netEarnings))}`,
        valueColor:
            isProfit
                ? COLORS.green
                : COLORS.redDark
    });

    drawSummaryCard({
        doc,
        x: 13 + (cardWidth + gap) * 3,
        y: cardY,
        width: cardWidth,
        title: "Profit Margin",
        value: `${profitMargin.toFixed(1)}%`,
        valueColor:
            isProfit
                ? COLORS.green
                : COLORS.redDark
    });

    /*
     * Profit or loss banner.
     */
    doc.setFillColor(
        ...(isProfit
            ? COLORS.greenBg
            : COLORS.redBg)
    );

    doc.roundedRect(
        13,
        87,
        pageWidth - 26,
        17,
        2,
        2,
        "F"
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);

    doc.setTextColor(
        ...(isProfit
            ? COLORS.green
            : COLORS.redDark)
    );

    doc.text(
        isProfit
            ? `BUSINESS PROFIT: £${formatMoney(
                netEarnings
            )}`
            : `BUSINESS LOSS: £${formatMoney(
                Math.abs(netEarnings)
            )}`,
        18,
        94
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.gray);

    doc.text(
        `Average net per job: £${formatMoney(
            averageNet
        )} | General expenses: £${formatMoney(
            generalExpenses
        )}`,
        18,
        100
    );

    /*
     * Quick statistics.
     */
    drawSectionTitle({
        doc,
        title: "Quick Statistics",
        y: 114
    });

    const quickY = 120;
    const quickWidth =
        (pageWidth - 26 - gap * 3) / 4;

    drawQuickCard({
        doc,
        x: 13,
        y: quickY,
        width: quickWidth,
        title: "Average Job Revenue",
        value: `£${formatMoney(averageRevenue)}`,
        subtitle: `${completedCount} completed jobs`
    });

    drawQuickCard({
        doc,
        x: 13 + quickWidth + gap,
        y: quickY,
        width: quickWidth,
        title: "Highest Revenue Job",
        value: `£${formatMoney(
            highestRevenueJob?.revenue
        )}`,
        subtitle:
            highestRevenueJob?.ref || "No job"
    });

    drawQuickCard({
        doc,
        x: 13 + (quickWidth + gap) * 2,
        y: quickY,
        width: quickWidth,
        title: "Lowest Revenue Job",
        value: `£${formatMoney(
            lowestRevenueJob?.revenue
        )}`,
        subtitle:
            lowestRevenueJob?.ref || "No job"
    });

    drawQuickCard({
        doc,
        x: 13 + (quickWidth + gap) * 3,
        y: quickY,
        width: quickWidth,
        title: "Highest Paid Driver",
        value:
            highestPaidDriver?.name ||
            "No driver",
        subtitle:
            highestPaidDriver
                ? `Earnings £${formatMoney(
                    highestPaidDriver.earnings
                )}`
                : ""
    });

    const continuationHook = data => {
        const currentPage =
            doc.internal.getCurrentPageInfo()
                .pageNumber;

        if (currentPage > 1) {
            drawContinuationHeader({
                doc,
                pageWidth,
                periodLabel
            });
        }
    };

    /*
     * Driver earnings table.
     */
    drawSectionTitle({
        doc,
        title: "Driver Earnings",
        y: 151
    });

    autoTable(doc, {
        startY: 157,
        margin: {
            left: 13,
            right: 13,
            top: 21,
            bottom: 23
        },

        columns: [
            {
                header: "Driver",
                dataKey: "name"
            },
            {
                header: "Completed Jobs",
                dataKey: "jobs"
            },
            {
                header: "Driver Earnings",
                dataKey: "earningsText"
            },
            {
                header: "Earning Source",
                dataKey: "source"
            }
        ],

        body:
            driverRows.length > 0
                ? driverRows.map(driver => ({
                    name: driver.name,
                    jobs: driver.jobs,
                    earningsText:
                        `£${formatMoney(
                            driver.earnings
                        )}`,
                    source: "Driver Charges"
                }))
                : [{
                    name: "No driver earnings found",
                    jobs: "",
                    earningsText: "",
                    source: ""
                }],

        theme: "grid",

        styles: {
            font: "helvetica",
            fontSize: 7.5,
            cellPadding: 2.5,
            lineColor: COLORS.border,
            lineWidth: 0.2,
            textColor: COLORS.dark
        },

        headStyles: {
            fillColor: COLORS.red,
            textColor: COLORS.white,
            fontStyle: "bold"
        },

        alternateRowStyles: {
            fillColor: [249, 250, 251]
        },

        columnStyles: {
            name: {
                cellWidth: 65
            },
            jobs: {
                cellWidth: 35,
                halign: "center"
            },
            earningsText: {
                cellWidth: 43,
                halign: "right",
                fontStyle: "bold",
                textColor: COLORS.green
            },
            source: {
                cellWidth: 35,
                halign: "center"
            }
        },

        willDrawPage: continuationHook
    });

    let currentY =
        doc.lastAutoTable.finalY + 10;

    const ensureSpace = requiredHeight => {
        if (
            currentY + requiredHeight >
            pageHeight - 24
        ) {
            doc.addPage();

            drawContinuationHeader({
                doc,
                pageWidth,
                periodLabel
            });

            currentY = 24;
        }
    };

    /*
     * Expense category breakdown.
     */
    ensureSpace(62);

    drawSectionTitle({
        doc,
        title: "Expense Breakdown",
        y: currentY
    });

    autoTable(doc, {
        startY: currentY + 6,

        margin: {
            left: 13,
            right: 13,
            top: 21,
            bottom: 23
        },

        columns: [
            {
                header: "Expense Category",
                dataKey: "category"
            },
            {
                header: "Amount",
                dataKey: "amount"
            },
            {
                header: "Share of Expenses",
                dataKey: "percentage"
            }
        ],

        body: expenseCategories.map(category => ({
            category: category.name,
            amount:
                `£${formatMoney(category.amount)}`,
            percentage:
                totalExpenses > 0
                    ? `${(
                        category.amount /
                        totalExpenses *
                        100
                    ).toFixed(1)}%`
                    : "0.0%"
        })),

        theme: "grid",

        styles: {
            font: "helvetica",
            fontSize: 7.5,
            cellPadding: 2.5,
            lineColor: COLORS.border,
            lineWidth: 0.2
        },

        headStyles: {
            fillColor: COLORS.red,
            textColor: COLORS.white,
            fontStyle: "bold"
        },

        alternateRowStyles: {
            fillColor: [249, 250, 251]
        },

        columnStyles: {
            category: {
                cellWidth: 90
            },
            amount: {
                cellWidth: 45,
                halign: "right",
                fontStyle: "bold"
            },
            percentage: {
                cellWidth: 43,
                halign: "right"
            }
        },

        willDrawPage: continuationHook
    });

    currentY =
        doc.lastAutoTable.finalY + 10;

    /*
     * Completed jobs detailed report.
     */
    ensureSpace(40);

    drawSectionTitle({
        doc,
        title: "Completed Jobs",
        y: currentY
    });

    autoTable(doc, {
        startY: currentY + 6,

        margin: {
            left: 13,
            right: 13,
            top: 21,
            bottom: 23
        },

        columns: [
            { header: "Ref", dataKey: "ref" },
            { header: "Customer", dataKey: "customer" },
            { header: "Driver", dataKey: "driver" },
            { header: "Date", dataKey: "date" },
            { header: "Revenue", dataKey: "revenueText" },
            { header: "Expenses", dataKey: "expensesText" },
            { header: "Net", dataKey: "netText" },
            { header: "Result", dataKey: "result" }
        ],

        body:
            jobRows.length > 0
                ? jobRows.map(job => ({
                    ref: job.ref,
                    customer: job.customer,
                    driver: job.driver,
                    date: job.date,
                    revenueText:
                        `£${formatMoney(job.revenue)}`,
                    expensesText:
                        `£${formatMoney(job.expenses)}`,
                    netText:
                        `${job.net < 0 ? "-" : "+"
                        }£${formatMoney(
                            Math.abs(job.net)
                        )}`,
                    result:
                        job.net >= 0
                            ? "PROFIT"
                            : "LOSS",
                    netValue: job.net
                }))
                : [{
                    ref: "No completed jobs found",
                    customer: "",
                    driver: "",
                    date: "",
                    revenueText: "",
                    expensesText: "",
                    netText: "",
                    result: "",
                    netValue: 0
                }],

        theme: "grid",

        styles: {
            font: "helvetica",
            fontSize: 6.2,
            cellPadding: 2,
            lineColor: COLORS.border,
            lineWidth: 0.2,
            overflow: "linebreak",
            valign: "middle"
        },

        headStyles: {
            fillColor: COLORS.red,
            textColor: COLORS.white,
            fontStyle: "bold"
        },

        alternateRowStyles: {
            fillColor: [249, 250, 251]
        },

        columnStyles: {
            ref: {
                cellWidth: 21,
                textColor: COLORS.red,
                fontStyle: "bold"
            },
            customer: { cellWidth: 28 },
            driver: { cellWidth: 25 },
            date: { cellWidth: 22 },
            revenueText: {
                cellWidth: 21,
                halign: "right"
            },
            expensesText: {
                cellWidth: 21,
                halign: "right"
            },
            netText: {
                cellWidth: 22,
                halign: "right"
            },
            result: {
                cellWidth: 18,
                halign: "center"
            }
        },

        didParseCell: data => {
            if (
                data.section === "body" &&
                ["netText", "result"].includes(
                    data.column.dataKey
                )
            ) {
                const net =
                    numberValue(
                        data.row.raw?.netValue
                    );

                data.cell.styles.fontStyle = "bold";
                data.cell.styles.textColor =
                    net >= 0
                        ? COLORS.green
                        : COLORS.redDark;
            }
        },

        willDrawPage: continuationHook
    });

    drawFooter({
        doc,
        pageWidth,
        pageHeight
    });

    const safePeriod = periodLabel
        .replace(/\s+/g, "-")
        .toLowerCase();

    const dateStamp = new Date()
        .toISOString()
        .slice(0, 10);

    doc.save(
        `Khan-Moves-Earnings-${safePeriod}-${dateStamp}.pdf`
    );
};