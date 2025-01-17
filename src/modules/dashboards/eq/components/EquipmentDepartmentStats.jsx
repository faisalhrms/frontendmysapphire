// src/modules/inventory/components/EquipmentDepartmentStats.jsx

import React from "react";
import ApexChart from "@components/charts/ApexChart.jsx";
import { mapSeriesToColors, statusColorMapping } from "@helpers/statusStyles.js";

const EquipmentDepartmentStats = ({ equipmentsByDepartment }) => {
    const categories = equipmentsByDepartment.map(item => item.department.name);
    const series = [{
        name: 'Equipments',
        data: equipmentsByDepartment.map(item => item.count)
    }];

    const colors = mapSeriesToColors(series, statusColorMapping);

    const chartOptions = {
        chart: {
            type: 'bar',
            height: 355,
            toolbar: { show: false },
        },
        xaxis: {
            categories: categories,
            title: {
                text: 'Department',
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
        <div className="box">
            <div className="box-header justify-between">
                <div className="box-title">Equipments by Department</div>
            </div>
            <div className="box-body">
                <ApexChart
                    options={chartOptions}
                    categories={categories}
                    series={series}
                    type="bar"
                    height={355}
                />
            </div>
        </div>
    );
};

export default EquipmentDepartmentStats;
