export const Basicline = ({ data }) => {
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
            labels: { style: { fontSize: '11px', fontWeight: 600 } },
        },
        colors: ['#845adf'],
        dataLabels: { enabled: false },
        stroke: { curve: 'straight', width: 3 },
        grid: { borderColor: '#f2f5f7' },
    };

    return <ReactApexChart options={options} series={series} type="line" height={320} />;
};

export const Sourcedata = ({ data }) => {
    const series = data.map(item => item.count);
    const options = {
        labels: data.map(item => item.status),
        chart: {
            type: 'donut',
            height: 260,
        },
        plotOptions: {
            pie: { donut: { size: '82%' } },
        },
        dataLabels: { enabled: false },
        colors: ['#845adf', '#23b7e5', '#f5b849'],
    };

    return <ReactApexChart options={options} series={series} type="donut" height={260} />;
};
