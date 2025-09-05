import ReactApexChart from "react-apexcharts";

export const VendorBasicBarChart = ({ data }) => {
    const series = [
        {
            name: "Subscription Count",
            data: data.map(item => item.subscription_count || item.total_cost || 0),
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
                columnWidth: "60%",
                endingShape: "rounded",
                distributed: true,
                dataLabels: { position: "top" },
            },
        },
        dataLabels: {
            enabled: true,
            position: "top",
            style: { fontSize: "12px", fontWeight: "bold", colors: ["#000"] },
            offsetY: -27,
        },
        xaxis: {
            categories: data.map(item => item.name),
            labels: {
                style: { fontSize: "11px", fontWeight: 600 },
                rotate: 0,
                trim: false,
                formatter: val => (val.length > 15 ? val.replace(/(.{15})/g, "$1\n") : val),
            },
        },
        yaxis: {
            labels: { style: { fontSize: "11px", fontWeight: 600 }, formatter: val => Math.floor(val) },
            title: { style: { fontSize: "12px", fontWeight: 600 } },
        },
        colors: vendorColors,
        legend: { show: false },
        grid: { borderColor: "#f2f5f7", strokeDashArray: 3, padding: { top: 30, bottom: 40 } },
        title: { align: "left", style: { fontSize: "16px", fontWeight: 600, color: "#333" } },
        tooltip: { y: { formatter: val => val + " subscriptions" } },
    };

    const chartWidth = Math.max(data.length * 100, 600);

    return (
        <div style={{overflowX: "auto", width: "100%"}}>
            <div style={{minWidth: chartWidth}}>
                <ReactApexChart options={options} series={series} type="bar" height={320}/>
            </div>
        </div>
    );
};
