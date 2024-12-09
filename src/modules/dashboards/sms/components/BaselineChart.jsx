import ReactApexChart from "react-apexcharts";
import { formatAmountWithCommas } from "@helpers/formatters.js"; // Ensure this is the correct path for the formatter

export const BasiclineChart = ({ data }) => {
    const series = [
        {
            name: 'Total Cost',
            data: data.map(item => item.total_cost || 0),
        },
    ];

    const options = {
        chart: {
            height: 320,
            type: 'line',
        },
        xaxis: {
            categories: data.map(item => item.department),
            labels: { style: { fontSize: '11px', fontWeight: 600 } },
        },
        yaxis: {
            labels: {
                style: { fontSize: '11px', fontWeight: 600 },
                formatter: (value) => formatAmountWithCommas(value), // Format the y-axis values
            },
        },
        colors: ['#845adf'],
        dataLabels: { enabled: false },
        stroke: { curve: 'straight', width: 3 },
        grid: { borderColor: '#f2f5f7' },
    };

    return <ReactApexChart options={options} series={series} type="line" height={320} />;
};
