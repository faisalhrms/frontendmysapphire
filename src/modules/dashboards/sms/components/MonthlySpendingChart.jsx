import React from "react";
import ReactApexChart from "react-apexcharts";
import { useMonthlySpend } from "@modules/dashboards/sms/hooks/subscriptionHook.js";
import dayjs from "dayjs";

const MonthlySpendingChart = () => {
    const { monthlySpend, loading } = useMonthlySpend();

    if (loading) {
        return <p className="text-center py-4">Loading Monthly Spending...</p>;
    }


    const categories = monthlySpend.map(item =>
        dayjs(item.month, "YYYY-MM").format("MMM")
    );
    const values = monthlySpend.map(item => item.total_spend);

    const chartData = {
        series: [
            {
                name: "Monthly Spending",
                data: values,
            },
        ],
        categories,
    };

    return (
        <div className="xl:col-span-8 col-span-12">
            <div className="box">
                <div className="box-body overflow-hidden">
                    <div className="leads-source-chart">
                        <ReactApexChart
                            options={{
                                chart: {
                                    type: "line",
                                    height: 350,
                                    toolbar: { show: false },
                                },
                                stroke: {
                                    curve: "smooth",
                                    width: 6,
                                    colors: ["#6ab04c"],
                                },
                                xaxis: {
                                    categories: chartData.categories,
                                },
                                yaxis: {
                                    min: 0,
                                    forceNiceScale: true,
                                    labels: {
                                        formatter: (val) =>
                                            val >= 1000
                                                ? `${(val / 1000).toFixed(1)}k`
                                                : val.toFixed(0),
                                    },
                                },
                                grid: {
                                    borderColor: "#e0e0e0",
                                    strokeDashArray: 0,
                                },
                                markers: {
                                    size: 4,
                                    colors: ["#6ab04c"],
                                    strokeColors: "#fff",
                                    strokeWidth: 2,
                                    hover: {
                                        size: 6,
                                    },
                                },
                                dataLabels: {
                                    enabled: false,
                                },
                                colors: ["#6ab04c"],
                            }}
                            series={chartData.series}
                            type="line"
                            height={350}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthlySpendingChart;
