import ReactApexChart from "react-apexcharts";

export const DonatChart = ({ data }) => {
    console.log(`data from donat`,data);
    const series = data.map(item => item.count); // The values for the chart
    const options = {
        labels: data.map(item => item.status), // Labels for the chart
        chart: {
            type: 'donut',
            height: 260,
            events: {
                mounted: (chart) => {
                    chart.windowResizeHandler(); // Ensures responsiveness
                }
            },
        },
        plotOptions: {
            pie: {
                expandOnClick: false,
                donut: {
                    size: '82%',
                    labels: {
                        show: false, // Matches the style of Sourcedata
                        name: {
                            show: true,
                            fontSize: '20px',
                            color: '#495057',
                            offsetY: -4,
                        },
                        value: {
                            show: true,
                            fontSize: '18px',
                            color: undefined,
                            offsetY: 8,
                            formatter: function (val) {
                                return `${val}%`; // Add % symbol
                            },
                        },
                    },
                },
            },
        },
        dataLabels: { enabled: false },
        legend: {
            show: true, // Re-enable legend
            position: "bottom", // Position legend at the bottom
            labels: {
                colors: "#495057",
                useSeriesColors: true, // Matches legend colors to chart segments
            },
            markers: {
                width: 12, // Adjust marker (dot) size
                height: 12,
                radius: 6, // Make markers rounded
            },
            itemMargin: {
                horizontal: 10,
                vertical: 5,
            },
        },
        stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'round',
            colors: ["#fff"],
            width: 0,
            dashArray: 0,
        },
        colors: ['rgb(132, 90, 223)', 'rgb(35, 183, 229)', 'rgb(245, 184, 73)'], // Use consistent colors
    };

    return (
        <div>
            <ReactApexChart options={options} series={series} type="donut" height={260} />
        </div>
    );
};
