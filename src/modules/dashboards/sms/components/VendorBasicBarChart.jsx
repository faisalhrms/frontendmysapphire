import { useState } from "react";
import ReactApexChart from "react-apexcharts";

export const VendorBasicBarChart = ({ data }) => {
    const [search, setSearch] = useState("");


    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const series = [
        {
            name: "Subscription Count",
            data: filteredData.map(item => item.subscription_count || item.total_cost || 0),
        },
    ];

    const vendorColors = [
        "#4A90E2",
        "#F5A623",
        "#7B68EE",
        "#F8E71C",
        "#E74C3C",
        "#2ECC71",
        "#9B59B6",
    ];

    const options = {
        chart: {
            height: 320,
            type: "bar",
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "50%",
                borderRadius: 4,
                distributed: true,
                dataLabels: { position: "top" },
            },
        },
        dataLabels: {
            enabled: true,
            position: "top",
            offsetY: -20,
            style: {
                fontSize: "13px",
                fontWeight: "bold",
                colors: vendorColors,
            },
        },
        xaxis: {
            categories: filteredData.map(item => item.name),
            labels: {
                rotate: 0,
                trim: false,
                style: {
                    fontSize: "12px",
                    fontWeight: 400,
                    letterSpacing: 1,
                    lineHeight: 1.8,
                    whiteSpace: "normal",
                },
                formatter: val =>
                    val.length > 15 ? val.match(/.{1,15}/g).join("\n") : val,
            },
        },
        yaxis: {
            min: 0,
            max: 8,
            tickAmount: 5,
            labels: {
                style: { fontSize: "12px", fontWeight: 400 },
                formatter: val => Math.floor(val),
            },
            title: { style: { fontSize: "13px", fontWeight: 400 } },
        },

        colors: vendorColors,
        legend: { show: false },
        grid: {
            borderColor: "#f2f5f7",
            strokeDashArray: 3,
            padding: {
                top: 30,
                bottom: 80,
            },
        },
        title: {
            align: "left",
            style: { fontSize: "12px", fontWeight: 600, color: "#333" },
        },
        tooltip: { y: { formatter: val => val + " subscriptions" } },
    };

    const chartWidth = Math.max(filteredData.length * 160, 700);

    return (
        <div className="box overflow-hidden h-full flex flex-col shadow-xl">
            <div className="box-header bg-warning/10 flex items-center justify-between">
                <div className="box-title dark:text-white">
                    Subscription Count by Vendor
                </div>
                <input
                    type="text"
                    placeholder="Search vendor..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="ti-form-control form-control-sm"
                />
            </div>

            <div className="box-body">
                <div style={{ overflowX: "auto", width: "100%" }}>
                    <div style={{ minWidth: chartWidth }}>
                        <ReactApexChart
                            options={options}
                            series={series}
                            type="bar"
                            height={320}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
