// src/modules/dashboards/equipment/components/EquipmentAnalysisCard.jsx

import React, { useMemo } from 'react';
import ApexChart from "@components/charts/ApexChart.jsx";
import { mapSeriesToColors, statusColorMapping } from "@helpers/statusStyles.js";

const EquipmentAnalysisCard = ({ data }) => {
    const categories = useMemo(() => data.map(item => new Date(item.month).toLocaleString('default', { month: 'short' })), [data]);
    const series = useMemo(() => [{
        name: 'Monthly Acquisitions',
        data: data.map(item => item.count)
    }], [data]);

    const colors = useMemo(() => mapSeriesToColors(series, statusColorMapping), [series]);

    const chartOptions = {
        chart: {
            type: 'bar',
            height: 355,
            toolbar: { show: false },
        },
        xaxis: {
            categories: categories,
            title: {
                text: 'Month',
            },
        },
        yaxis: {
            title: {
                text: 'Number of Equipments',
            },
        },
        colors: colors,
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '80%',
            },
        },
        dataLabels: {
            enabled: false,
        },
        grid: { show: true },
        legend: { position: 'top' }
    };

    return (
        <div className="xl:col-span-8 col-span-12">
            <div className="box">
                <div className="box-header justify-between">
                    <div className="box-title">Monthly Asset Acquisitions</div>
                </div>
                <div className="box-body">
                    <ApexChart
                        options={chartOptions}
                        categories={categories}
                        series={series}
                        type="bar"
                        height={410}
                    />
                </div>
            </div>
        </div>
    );
};

export default EquipmentAnalysisCard;
