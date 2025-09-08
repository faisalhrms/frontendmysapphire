import ReactApexChart from "react-apexcharts";

export const PieChart = ({ data }) => {
    const series = data?.map(item => item.count);

    const options = {
        labels: data?.map(item => item.status),
        chart: {
            type: "pie",
            height: 300,
            events: {
                mounted: (chart) => {
                    chart.windowResizeHandler();
                },
            },
        },
        plotOptions: {
            pie: {
                expandOnClick: false,
                dataLabels: {
                    offset: -10,
                },
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => `${val.toFixed(1)}%`,
            style: {
                fontSize: "18px",
                fontWeight: 600,
                colors: ["#495057"],
                textShadow: "none",
            },
            dropShadow: {
                enabled: false,
            },
        },
        legend: {
            show: true,
            position: "bottom",
            labels: {
                colors: "#495057",
                useSeriesColors: true,
            },
            markers: {
                width: 12,
                height: 12,
                radius: 6,
            },
            itemMargin: {
                horizontal: 10,
                vertical: 5,
            },
        },
        stroke: {
            show: true,
            colors: ["#fff"],
            width: 1,
        },
        colors: [
            "rgb(132, 90, 223)",
            "rgb(35, 183, 229)",
            "rgb(245, 184, 73)",
            "rgb(34, 197, 94)",
            "rgb(239, 68, 68)",
        ],
    };

    return (
        <div>
            <ReactApexChart
                options={options}
                series={series}
                type="pie"
                height={300}
            />
        </div>
    );
};
