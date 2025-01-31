import React from "react";
import CancellationTable from "@modules/ecom/components/ CancellationTable.jsx";
import PerformanceRationsTable from "@modules/ecom/components/PerformanceRationsTable.jsx";

const PerformanceRatios = () => {
    const cancellationHeaders = ["Count", "%", "Count", "%"];

    const cancellationData = [
        { name: "Last 7 Days", cyCount: 14, cyPercentage: "0.10%", lyCount: 17, lyPercentage: "0.14%" },
        { name: "MTD", cyCount: 834, cyPercentage: "0.28%", lyCount: 163, lyPercentage: "0.34%" },
        { name: "Last Month", cyCount: 405, cyPercentage: "0.48%", lyCount: 2521, lyPercentage: "1.27%" },
        { name: "YTD", cyCount: 3193, cyPercentage: "0.33%", lyCount: 5704, lyPercentage: "0.86%" },
    ];

    const returnPerformanceColumns = [
        "Return", "%", "Return", "%", "Return", "%", "Return", "%"
    ];

    const returnPerformanceData = [
        { courier: "CallCourierN", last7DaysReturn: 8, last7DaysPercentage: "0.2%", mtdReturn: 7715, mtdPercentage: "7.2%", lastMonthReturn: 5324, lastMonthPercentage: "17.8%", ytdReturn: 49802, ytdPercentage: "13.3%" },
        { courier: "FastEx", last7DaysReturn: 1736, last7DaysPercentage: "15.8%", mtdReturn: 1736, mtdPercentage: "15.8%", lastMonthReturn: 993, lastMonthPercentage: "17.5%", ytdReturn: 10185, ytdPercentage: "17.0%" },
        { courier: "LCS", last7DaysReturn: 2583, last7DaysPercentage: "14.5%", mtdReturn: 2583, mtdPercentage: "14.5%", lastMonthReturn: 946, lastMonthPercentage: "17.6%", ytdReturn: 12493, ytdPercentage: "17.1%" },
        { courier: "M&P", last7DaysReturn: 0, last7DaysPercentage: "-", mtdReturn: "-", mtdPercentage: "-", lastMonthReturn: "-", lastMonthPercentage: "-", ytdReturn: 760, ytdPercentage: "19.8%" },
        { courier: "SWYFT", last7DaysReturn: 1, last7DaysPercentage: "0.3%", mtdReturn: 7073, mtdPercentage: "15.3%", lastMonthReturn: 4269, lastMonthPercentage: "18.4%", ytdReturn: 31406, ytdPercentage: "15.8%" },
        { courier: "TCS", last7DaysReturn: 5618, last7DaysPercentage: "4.7%", mtdReturn: 5618, mtdPercentage: "4.7%", lastMonthReturn: 4129, lastMonthPercentage: "18.3%", ytdReturn: 27393, ytdPercentage: "10.9%" },
        { courier: "TPL", last7DaysReturn: 23, last7DaysPercentage: "3.3%", mtdReturn: 2501, mtdPercentage: "16.8%", lastMonthReturn: 2743, lastMonthPercentage: "18.6%", ytdReturn: 18499, ytdPercentage: "16.5%" },
    ];

    const totals = [
        "Total",
        returnPerformanceData.reduce((sum, row) => sum + row.last7DaysReturn, 0),
        `${(returnPerformanceData.reduce((sum, row) => sum + row.last7DaysReturn, 0) / returnPerformanceData.length).toFixed(1)}%`,
        returnPerformanceData.reduce((sum, row) => sum + row.mtdReturn, 0),
        `${(returnPerformanceData.reduce((sum, row) => sum + row.mtdReturn, 0) / returnPerformanceData.length).toFixed(1)}%`,
        returnPerformanceData.reduce((sum, row) => sum + row.lastMonthReturn, 0),
        `${(returnPerformanceData.reduce((sum, row) => sum + row.lastMonthReturn, 0) / returnPerformanceData.length).toFixed(1)}%`,
        returnPerformanceData.reduce((sum, row) => sum + row.ytdReturn, 0),
        `${(returnPerformanceData.reduce((sum, row) => sum + row.ytdReturn, 0) / returnPerformanceData.length).toFixed(1)}%`
    ];

    return (
        <>
        <div className="flex flex-wrap md:flex-nowrap gap-6 p-4">
            <PerformanceRationsTable title="Return by Courier" columns={returnPerformanceColumns} data={returnPerformanceData} totals={totals} />
            <CancellationTable title=" Cancellation before Pick-up" headers={cancellationHeaders} data={cancellationData} />
        </div>

    </>

    );
};

export default PerformanceRatios;
