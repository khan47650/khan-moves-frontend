import React, {
    useEffect,
    useMemo,
    useState
} from "react";
import { toast } from "react-toastify";
import api from "../../../api/api";
import { generateEarningsReport } from "../../../utils/generateEarningsReport";
import {
    buildEarningsData
} from "../../../utils/earningsUtils";
import EarningsFilters from "../../../components/admin/EarningsFilters";
import CompanyFinanceSection from "../../../components/admin/CompanyFinanceSection";
import CompletedJobsTable from "../../../components/admin/CompletedJobsTable";
import DriverEarningsSection from "../../../components/admin/DriverEarningsSection";
import EarningsLoader from "../../../components/admin/EarningsLoader";

export default function Earnings() {
    const [period, setPeriod] =
        useState("all");

    const [customRange, setCustomRange] =
        useState({
            from: "",
            to: ""
        });

    const [jobs, setJobs] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [
        generatingReport,
        setGeneratingReport
    ] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
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
                            period: "all"
                        }
                    }),

                    api.get("/drivers")
                ]);

                setJobs(
                    jobsResponse.data?.data || []
                );

                setExpenses(
                    expensesResponse.data?.data || []
                );

                setDrivers(
                    driversResponse.data?.data || []
                );
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                    "Failed to load earnings"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const data = useMemo(
        () =>
            buildEarningsData({
                jobs,
                expenses,
                drivers,
                period,
                customRange
            }),
        [
            jobs,
            expenses,
            drivers,
            period,
            customRange
        ]
    );

    const handleGenerateReport = async () => {
        if (
            period === "custom" &&
            (!customRange.from || !customRange.to)
        ) {
            toast.error(
                "Select both custom dates"
            );
            return;
        }

        try {
            setGeneratingReport(true);

            /*
             * The report receives the already filtered
             * dashboard data. This keeps its values identical
             * to the current view.
             */
            await generateEarningsReport({
                period: "all",
                periodLabelOverride:
                    data.periodLabel,
                jobs: data.filteredJobs,
                expenses:
                    data.relevantExpenses,
                drivers:
                    data.driverEarnings.map(
                        driver => ({
                            _id: driver.key,
                            name: driver.name,
                            earnings:
                                driver.earnings,
                            totalJobs:
                                driver.jobs
                        })
                    )
            });

            toast.success(
                "Earnings report generated successfully"
            );
        } catch (error) {
            toast.error(
                error.message ||
                "Failed to generate report"
            );
        } finally {
            setGeneratingReport(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[#1a1a1a]">
                    Earnings & Finance Dashboard
                </h1>

                <p className="mt-2 text-gray-500">
                    Review company finances and driver earnings separately.
                </p>
            </div>

            <EarningsFilters
                period={period}
                onPeriodChange={setPeriod}
                customRange={customRange}
                onCustomRangeChange={
                    setCustomRange
                }
                onGenerateReport={
                    handleGenerateReport
                }
                generatingReport={
                    generatingReport
                }
            />

            {loading ? (
                <EarningsLoader />
            ) : (
                <>
                    <CompanyFinanceSection
                        data={data}
                    />

                    <CompletedJobsTable
                        jobs={data.jobRows}
                        periodLabel={
                            data.periodLabel
                        }
                    />

                    <DriverEarningsSection
                        drivers={
                            data.driverEarnings
                        }
                        periodLabel={
                            data.periodLabel
                        }
                    />
                </>
            )}
        </div>
    );
}