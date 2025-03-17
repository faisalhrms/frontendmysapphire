import React from "react";
import ApexChart from "@components/charts/ApexChart.jsx";
import { mapSeriesToColors, statusColorMapping } from "@helpers/statusStyles.js";

const EquipmentDepartmentStats = ({ equipmentsByDepartment }) => {
    // Handle null departments and filter out invalid entries
    const validData = equipmentsByDepartment.filter(item => item.count > 0);

    const categories = validData.map(item =>
        item.department?.name || 'No Department'
    );

    const series = [{
        name: 'Assets',
        data: validData.map(item => item.count)
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
            title: { text: 'Department' },
            labels: {
                rotate: -45,
                style: { fontSize: '12px' }
            }
        },
        yaxis: {
            title: { text: 'Number of Equipments' },
            tickAmount: 5
        },
        colors: colors,
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '70%',
                borderRadius: 4
            }
        },
        dataLabels: { enabled: false },
        grid: {
            borderColor: '#f1f1f1',
            strokeDashArray: 4
        }
    };

    return (
        <div className="box">
            <div className="box-header justify-between">
                <div className="box-title">Assets by Department</div>
            </div>
            <div className="box-body">
                <ApexChart
                    options={chartOptions}
                    categories={categories}
                    series={series}
                    type="bar"
                    height={355}
                    baseWidthPerCategory={190} // Reduced from 400 for better mobile view
                />
            </div>
        </div>
    );
};

export default EquipmentDepartmentStats;