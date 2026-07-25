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
    today: "Today",
    yesterday: "Yesterday",
    last_7_days: "Last 7 Days",
    this_month: "This Month",
    this_year: "This Year",
    all: "All Time",
    custom: "Custom Date Range"
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
    amber: [180, 83, 9],
    redDark: [220, 38, 38],
    redBg: [254, 242, 242],
    white: [255, 255, 255]
};

const numberValue = value =>
    Number(value || 0);

const getId = value =>
    typeof value === "string"
        ? value
        : value?._id || "";

const formatMoney = value =>
    numberValue(value).toLocaleString(
        "en-GB",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

const formatDate = value => {
    if (!value) return "—";

    const date =
        typeof value === "string" &&
            /^\d{4}-\d{2}-\d{2}$/.test(value)
            ? new Date(`${value}T12:00:00`)
            : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
};

const getExpenseTotal = expense => {
    const calculatedTotal =
        numberValue(expense.driverCharges) +
        numberValue(expense.nightStay) +
        numberValue(expense.meals) +
        numberValue(expense.fuel) +
        numberValue(expense.repair) +
        numberValue(expense.other);

    if (calculatedTotal > 0) {
        return calculatedTotal;
    }

    return numberValue(
        expense.totalExpense
    );
};

const DAY_MS =
    24 * 60 * 60 * 1000;

const getDriverPeriodTotals = details => {
    const now = Date.now();

    return (details || []).reduce(
        (totals, detail) => {
            const paymentDate = new Date(
                detail.paidAt ||
                detail.createdAt ||
                detail.date ||
                0
            );

            if (
                Number.isNaN(
                    paymentDate.getTime()
                )
            ) {
                return totals;
            }

            const age =
                now -
                paymentDate.getTime();

            if (age < 0) {
                return totals;
            }

            const amount =
                numberValue(
                    detail.earnings
                );

            /*
             * Exclusive buckets:
             *
             * Today:       0–24 hours
             * Last 7 Days: 24 hours–7 days
             * Last Month:  7–30 days
             */
            if (age < DAY_MS) {
                totals.today += amount;
            } else if (
                age < DAY_MS * 7
            ) {
                totals.week += amount;
            } else if (
                age < DAY_MS * 30
            ) {
                totals.month += amount;
            }

            return totals;
        },
        {
            today: 0,
            week: 0,
            month: 0
        }
    );
};


const loadImage = async url => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            "Logo could not be loaded"
        );
    }

    const blob = await response.blob();

    return new Promise(
        (resolve, reject) => {
            const reader = new FileReader();

            reader.onloadend = () =>
                resolve(reader.result);

            reader.onerror = reject;

            reader.readAsDataURL(blob);
        }
    );
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
    doc.setFillColor(
        ...COLORS.lightGray
    );

    doc.roundedRect(
        x,
        y,
        width,
        22,
        2,
        2,
        "F"
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.gray);

    doc.text(
        title.toUpperCase(),
        x + 4,
        y + 7
    );

    doc.setFontSize(12);
    doc.setTextColor(...valueColor);

    doc.text(
        value,
        x + 4,
        y + 17
    );
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

    doc.roundedRect(
        x,
        y,
        width,
        20,
        2,
        2,
        "FD"
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(...COLORS.gray);

    doc.text(
        title.toUpperCase(),
        x + 4,
        y + 6
    );

    doc.setFontSize(10);
    doc.setTextColor(...COLORS.dark);

    doc.text(
        value,
        x + 4,
        y + 13
    );

    if (subtitle) {
        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.setFontSize(6);
        doc.setTextColor(...COLORS.gray);

        doc.text(
            subtitle,
            x + 4,
            y + 17
        );
    }
};

const drawMainHeader = async ({
    doc,
    pageWidth,
    periodLabel,
    generatedDate
}) => {
    doc.setFillColor(...COLORS.red);

    doc.rect(
        0,
        0,
        pageWidth,
        39,
        "F"
    );

    doc.setFillColor(...COLORS.white);
    doc.circle(27, 19.5, 14, "F");

    try {
        const logo = await loadImage(
            COMPANY.logo
        );

        doc.addImage(
            logo,
            "PNG",
            17.5,
            10,
            19,
            19
        );
    } catch {
        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.setFontSize(8);
        doc.setTextColor(...COLORS.red);

        doc.text(
            "KHAN",
            27,
            18,
            {
                align: "center"
            }
        );

        doc.text(
            "MOVES",
            27,
            23,
            {
                align: "center"
            }
        );
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...COLORS.white);

    doc.text(
        COMPANY.name,
        46,
        16
    );

    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.setFontSize(8);
    doc.setTextColor(255, 220, 220);

    doc.text(
        COMPANY.subtitle,
        46,
        23
    );

    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.setFontSize(25);
    doc.setTextColor(...COLORS.white);

    doc.text(
        "EARNINGS REPORT",
        pageWidth - 13,
        18,
        {
            align: "right"
        }
    );

    doc.setFontSize(7.5);
    doc.setTextColor(255, 220, 220);

    doc.text(
        periodLabel,
        pageWidth - 13,
        27,
        {
            align: "right"
        }
    );

    doc.text(
        `Generated: ${generatedDate}`,
        pageWidth - 13,
        33,
        {
            align: "right"
        }
    );
};

const drawContinuationHeader = ({
    doc,
    pageWidth,
    periodLabel
}) => {
    doc.setFillColor(...COLORS.red);

    doc.rect(
        0,
        0,
        pageWidth,
        14,
        "F"
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.white);

    doc.text(
        COMPANY.name,
        13,
        9
    );

    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.text(
        `Earnings Report - ${periodLabel}`,
        pageWidth - 13,
        9,
        {
            align: "right"
        }
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

    doc.line(
        13,
        y + 2.5,
        44,
        y + 2.5
    );
};

const drawFooter = ({
    doc,
    pageWidth,
    pageHeight
}) => {
    const totalPages =
        doc.getNumberOfPages();

    for (
        let page = 1;
        page <= totalPages;
        page += 1
    ) {
        doc.setPage(page);

        doc.setDrawColor(...COLORS.border);
        doc.setLineWidth(0.3);

        doc.line(
            13,
            pageHeight - 17,
            pageWidth - 13,
            pageHeight - 17
        );

        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.setFontSize(6.5);
        doc.setTextColor(...COLORS.gray);

        doc.text(
            COMPANY.address,
            pageWidth / 2,
            pageHeight - 11,
            {
                align: "center"
            }
        );

        doc.text(
            `${COMPANY.phone} · ${COMPANY.email}`,
            pageWidth / 2,
            pageHeight - 7,
            {
                align: "center"
            }
        );

        doc.text(
            `Page ${page} of ${totalPages}`,
            pageWidth - 13,
            pageHeight - 7,
            {
                align: "right"
            }
        );
    }
};

export const generateEarningsReport = async ({
    period,
    periodLabel:
    suppliedPeriodLabel,
    jobs = [],
    expenses = [],
    driverEarnings = [],
    summary = {}
}) => {
    const periodLabel =
        suppliedPeriodLabel ||
        PERIOD_LABELS[period] ||
        "Selected Period";

    /*
     * Jobs already filtered and calculated
     * by earningsUtils.
     */
    const expensesByJob = new Map();

    expenses.forEach(expense => {
        const jobId = getId(expense.job);

        if (!jobId) return;

        const key = String(jobId);

        expensesByJob.set(
            key,
            numberValue(
                expensesByJob.get(key)
            ) +
            getExpenseTotal(expense)
        );
    });

    const jobRows = jobs.map(job => {
        const revenue =
            job.revenue !== undefined
                ? numberValue(job.revenue)
                : numberValue(job.totalPrice);

        const expenseTotal =
            job.expenses !== undefined
                ? numberValue(job.expenses)
                : numberValue(
                    expensesByJob.get(
                        String(job._id)
                    )
                );

        const net =
            job.net !== undefined
                ? numberValue(job.net)
                : revenue - expenseTotal;

        return {
            id: job._id,
            ref:
                job.bookingRef ||
                job.ref ||
                "—",

            customer:
                job.customer?.name ||
                job.customer ||
                "—",

            driver:
                job.assignedDriver?.name ||
                job.assignedDriverName ||
                "Unassigned",

            date: formatDate(
                job.date ||
                job.completedAt ||
                job.updatedAt ||
                job.createdAt
            ),

            revenue,
            expenses: expenseTotal,
            net
        };
    });

    const calculatedGrossRevenue =
        jobRows.reduce(
            (total, job) =>
                total + job.revenue,
            0
        );

    const calculatedTotalExpenses =
        expenses.reduce(
            (total, expense) =>
                total +
                getExpenseTotal(expense),
            0
        );

    const calculatedJobExpenses =
        expenses
            .filter(expense =>
                Boolean(
                    getId(expense.job)
                )
            )
            .reduce(
                (total, expense) =>
                    total +
                    getExpenseTotal(expense),
                0
            );

    const calculatedNetEarnings =
        calculatedGrossRevenue -
        calculatedJobExpenses;

    const calculatedBusinessProfit =
        calculatedGrossRevenue -
        calculatedTotalExpenses;

    const grossRevenue =
        summary.grossRevenue !== undefined
            ? numberValue(
                summary.grossRevenue
            )
            : calculatedGrossRevenue;

    const totalExpenses =
        summary.totalExpenses !== undefined
            ? numberValue(
                summary.totalExpenses
            )
            : calculatedTotalExpenses;

    const netEarnings =
        summary.netEarnings !== undefined
            ? numberValue(
                summary.netEarnings
            )
            : calculatedNetEarnings;

    const businessProfit =
        summary.businessProfit !== undefined
            ? numberValue(
                summary.businessProfit
            )
            : calculatedBusinessProfit;

    const completedCount =
        summary.completedCount !== undefined
            ? numberValue(
                summary.completedCount
            )
            : jobRows.length;

    const profitMargin =
        summary.profitMargin !== undefined
            ? numberValue(
                summary.profitMargin
            )
            : grossRevenue > 0
                ? businessProfit /
                grossRevenue *
                100
                : 0;

    const calculatedHighestJob =
        jobRows.length > 0
            ? [...jobRows].sort(
                (first, second) =>
                    second.revenue -
                    first.revenue
            )[0]
            : null;

    const calculatedLowestJob =
        jobRows.length > 0
            ? [...jobRows].sort(
                (first, second) =>
                    first.revenue -
                    second.revenue
            )[0]
            : null;

    const highestRevenueJob =
        summary.highestRevenueJob ||
        calculatedHighestJob;

    const lowestRevenueJob =
        summary.lowestRevenueJob ||
        calculatedLowestJob;

    const getJobRevenue = job =>
        numberValue(
            job?.revenue ??
            job?.totalPrice
        );

    const getJobReference = job =>
        job?.bookingRef ||
        job?.ref ||
        "No completed job";

    const isProfit =
        businessProfit >= 0;

    /*
     * Meals removed.
     * Other renamed to Congestion / ULEZ.
     */
    const expenseCategories = [
        {
            name: "Driver Charges",
            amount: expenses.reduce(
                (total, item) =>
                    total +
                    numberValue(
                        item.driverCharges
                    ),
                0
            )
        },
        {
            name: "Night Stay",
            amount: expenses.reduce(
                (total, item) =>
                    total +
                    numberValue(
                        item.nightStay
                    ),
                0
            )
        },
        {
            name: "Fuel",
            amount: expenses.reduce(
                (total, item) =>
                    total +
                    numberValue(
                        item.fuel
                    ),
                0
            )
        },
        {
            name: "Repairs",
            amount: expenses.reduce(
                (total, item) =>
                    total +
                    numberValue(
                        item.repair
                    ),
                0
            )
        },
        {
            name:
                "Congestion / ULEZ Charges",
            amount: expenses.reduce(
                (total, item) =>
                    total +
                    numberValue(
                        item.other
                    ),
                0
            )
        }
    ];

    const driverSummaryRows =
        driverEarnings.map(driver => {
            const totals =
                getDriverPeriodTotals(
                    driver.details || []
                );

            return {
                name:
                    driver.name ||
                    "Unknown Driver",

                jobs:
                    numberValue(
                        driver.jobs
                    ),

                earnings:
                    numberValue(
                        driver.earnings
                    ),

                today: totals.today,
                week: totals.week,
                month: totals.month
            };
        });

    const generatedDate =
        new Date().toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    doc.setProperties({
        title:
            `${COMPANY.name} Earnings Report`,
        subject:
            `${periodLabel} earnings report`,
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

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.red);

    doc.text(
        "Report Period:",
        13,
        48
    );

    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.setTextColor(...COLORS.dark);

    doc.text(
        periodLabel,
        34,
        48
    );

    doc.setFont("helvetica", "bold");

    doc.text(
        "Completed Jobs:",
        pageWidth - 45,
        48,
        {
            align: "right"
        }
    );

    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.text(
        String(completedCount),
        pageWidth - 13,
        48,
        {
            align: "right"
        }
    );

    doc.setDrawColor(...COLORS.border);

    doc.line(
        13,
        53,
        pageWidth - 13,
        53
    );

    /*
     * Company Finance Summary
     */
    const cardY = 59;
    const gap = 3;

    const cardWidth =
        (
            pageWidth -
            26 -
            gap * 3
        ) / 4;

    drawSummaryCard({
        doc,
        x: 13,
        y: cardY,
        width: cardWidth,
        title: "Gross Revenue",
        value:
            `£${formatMoney(
                grossRevenue
            )}`,
        valueColor: COLORS.red
    });

    drawSummaryCard({
        doc,
        x:
            13 +
            cardWidth +
            gap,
        y: cardY,
        width: cardWidth,
        title: "Total Expenses",
        value:
            `£${formatMoney(
                totalExpenses
            )}`,
        valueColor: COLORS.orange
    });

    drawSummaryCard({
        doc,
        x:
            13 +
            (
                cardWidth +
                gap
            ) * 2,
        y: cardY,
        width: cardWidth,
        title: "Net Earnings",
        value:
            `${netEarnings < 0 ? "-" : ""}£${formatMoney(
                Math.abs(
                    netEarnings
                )
            )}`,
        valueColor:
            netEarnings >= 0
                ? COLORS.green
                : COLORS.redDark
    });

    drawSummaryCard({
        doc,
        x:
            13 +
            (
                cardWidth +
                gap
            ) * 3,
        y: cardY,
        width: cardWidth,
        title: "Business Profit",
        value:
            `${businessProfit < 0 ? "-" : ""}£${formatMoney(
                Math.abs(
                    businessProfit
                )
            )}`,
        valueColor:
            isProfit
                ? COLORS.green
                : COLORS.redDark
    });

    /*
     * Always Business Profit label.
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
        `BUSINESS PROFIT: ${businessProfit < 0
            ? "-"
            : ""
        }£${formatMoney(
            Math.abs(
                businessProfit
            )
        )}`,
        18,
        94
    );

    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.setFontSize(7);
    doc.setTextColor(...COLORS.gray);

    doc.text(
        `Profit margin: ${profitMargin.toFixed(
            1
        )}%`,
        18,
        100
    );

    /*
     * Quick Stats:
     * only Highest and Lowest Revenue Job.
     */
    drawSectionTitle({
        doc,
        title: "Quick Statistics",
        y: 114
    });

    const quickY = 120;

    const quickWidth =
        (
            pageWidth -
            26 -
            gap
        ) / 2;

    drawQuickCard({
        doc,
        x: 13,
        y: quickY,
        width: quickWidth,
        title:
            "Highest Revenue Job",
        value:
            `£${formatMoney(
                getJobRevenue(
                    highestRevenueJob
                )
            )}`,
        subtitle:
            getJobReference(
                highestRevenueJob
            )
    });

    drawQuickCard({
        doc,
        x:
            13 +
            quickWidth +
            gap,
        y: quickY,
        width: quickWidth,
        title:
            "Lowest Revenue Job",
        value:
            `£${formatMoney(
                getJobRevenue(
                    lowestRevenueJob
                )
            )}`,
        subtitle:
            getJobReference(
                lowestRevenueJob
            )
    });

    const continuationHook = () => {
        const currentPage =
            doc.internal
                .getCurrentPageInfo()
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
     * Completed Jobs immediately
     * under Quick Statistics.
     */
    drawSectionTitle({
        doc,
        title: "Completed Jobs",
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
                header: "Ref",
                dataKey: "ref"
            },
            {
                header: "Customer",
                dataKey: "customer"
            },
            {
                header: "Driver",
                dataKey: "driver"
            },
            {
                header: "Date",
                dataKey: "date"
            },
            {
                header: "Revenue",
                dataKey: "revenueText"
            },
            {
                header: "Expenses",
                dataKey: "expensesText"
            },
            {
                header: "Net",
                dataKey: "netText"
            },
            {
                header: "Result",
                dataKey: "result"
            }
        ],

        body:
            jobRows.length > 0
                ? jobRows.map(job => ({
                    ref: job.ref,
                    customer:
                        job.customer,
                    driver:
                        job.driver,
                    date: job.date,

                    revenueText:
                        `£${formatMoney(
                            job.revenue
                        )}`,

                    expensesText:
                        `£${formatMoney(
                            job.expenses
                        )}`,

                    netText:
                        `${job.net < 0
                            ? "-"
                            : "+"
                        }£${formatMoney(
                            Math.abs(
                                job.net
                            )
                        )}`,

                    result:
                        job.net >= 0
                            ? "PROFIT"
                            : "LOSS",

                    netValue:
                        job.net
                }))
                : [{
                    ref:
                        "No completed jobs found",
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
            lineColor:
                COLORS.border,
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
            fillColor:
                [249, 250, 251]
        },

        columnStyles: {
            ref: {
                cellWidth: 21,
                textColor:
                    COLORS.red,
                fontStyle: "bold"
            },
            customer: {
                cellWidth: 28
            },
            driver: {
                cellWidth: 25
            },
            date: {
                cellWidth: 22
            },
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

        didParseCell: tableData => {
            if (
                tableData.section ===
                "body" &&
                [
                    "netText",
                    "result"
                ].includes(
                    tableData.column
                        .dataKey
                )
            ) {
                const net =
                    numberValue(
                        tableData.row
                            .raw?.netValue
                    );

                tableData.cell.styles
                    .fontStyle =
                    "bold";

                tableData.cell.styles
                    .textColor =
                    net >= 0
                        ? COLORS.green
                        : COLORS.redDark;
            }
        },

        willDrawPage:
            continuationHook
    });

    let currentY =
        doc.lastAutoTable.finalY +
        10;

    const ensureSpace = height => {
        if (
            currentY + height >
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
     * Driver summary.
     */
    ensureSpace(45);

    drawSectionTitle({
        doc,
        title:
            "Driver Earnings Summary",
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
                header: "Driver",
                dataKey: "name"
            },
            {
                header: "Jobs",
                dataKey: "jobs"
            },
            {
                header: "Total Earned",
                dataKey: "total"
            },
            {
                header: "Today",
                dataKey: "today"
            },
            {
                header: "Last 7 Days",
                dataKey: "week"
            },
            {
                header: "Last Month",
                dataKey: "month"
            }
        ],

        body:
            driverSummaryRows.length > 0
                ? driverSummaryRows.map(
                    driver => ({
                        name:
                            driver.name,
                        jobs:
                            driver.jobs,
                        total:
                            `£${formatMoney(
                                driver.earnings
                            )}`,
                        today:
                            `£${formatMoney(
                                driver.today
                            )}`,
                        week:
                            `£${formatMoney(
                                driver.week
                            )}`,
                        month:
                            `£${formatMoney(
                                driver.month
                            )}`
                    })
                )
                : [{
                    name:
                        "No driver earnings found",
                    jobs: "",
                    total: "",
                    today: "",
                    week: "",
                    month: ""
                }],

        theme: "grid",

        styles: {
            font: "helvetica",
            fontSize: 7,
            cellPadding: 2.3,
            lineColor:
                COLORS.border,
            lineWidth: 0.2
        },

        headStyles: {
            fillColor: COLORS.red,
            textColor: COLORS.white,
            fontStyle: "bold"
        },

        alternateRowStyles: {
            fillColor:
                [249, 250, 251]
        },

        columnStyles: {
            name: {
                cellWidth: 39
            },
            jobs: {
                cellWidth: 18,
                halign: "center"
            },
            total: {
                cellWidth: 30,
                halign: "right",
                fontStyle: "bold",
                textColor:
                    COLORS.green
            },
            today: {
                cellWidth: 29,
                halign: "right"
            },
            week: {
                cellWidth: 31,
                halign: "right"
            },
            month: {
                cellWidth: 31,
                halign: "right"
            }
        },

        willDrawPage:
            continuationHook
    });

    currentY =
        doc.lastAutoTable.finalY +
        10;
    /*
     * Expense Breakdown last.
     */
    ensureSpace(55);

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
                header:
                    "Expense Category",
                dataKey: "category"
            },
            {
                header: "Amount",
                dataKey: "amount"
            },
            {
                header:
                    "Share of Expenses",
                dataKey: "percentage"
            }
        ],

        body:
            expenseCategories.map(
                category => ({
                    category:
                        category.name,

                    amount:
                        `£${formatMoney(
                            category.amount
                        )}`,

                    percentage:
                        totalExpenses > 0
                            ? `${(
                                category.amount /
                                totalExpenses *
                                100
                            ).toFixed(
                                1
                            )}%`
                            : "0.0%"
                })
            ),

        theme: "grid",

        styles: {
            font: "helvetica",
            fontSize: 7.5,
            cellPadding: 2.5,
            lineColor:
                COLORS.border,
            lineWidth: 0.2
        },

        headStyles: {
            fillColor: COLORS.red,
            textColor: COLORS.white,
            fontStyle: "bold"
        },

        alternateRowStyles: {
            fillColor:
                [249, 250, 251]
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

        willDrawPage:
            continuationHook
    });

    drawFooter({
        doc,
        pageWidth,
        pageHeight
    });

    const safePeriod =
        periodLabel
            .replace(
                /[^a-zA-Z0-9]+/g,
                "-"
            )
            .replace(
                /^-|-$/g,
                ""
            )
            .toLowerCase();

    const dateStamp =
        new Date()
            .toISOString()
            .slice(0, 10);

    doc.save(
        `Khan-Moves-Earnings-${safePeriod}-${dateStamp}.pdf`
    );
};