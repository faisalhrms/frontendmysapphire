// src/modules/dashboards/equipment/components/EquipmentSiteStats.jsx

import React, { useMemo } from "react";
import ApexChart from "@components/charts/ApexChart.jsx";
import { getFormattedColor } from "@helpers/styles.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const EquipmentSiteStats = ({ equipmentsBySite, statsFetching }) => {
    // Extract site names and equipment counts
    const categories = useMemo(
        () => equipmentsBySite.map(item => item.equipment_site.name),
        [equipmentsBySite]
    );

    const series = useMemo(
        () => [
            {
                name: 'Equipments',
                data: equipmentsBySite.map(item => item.count)
            }
        ],
        [equipmentsBySite]
    );

    // Define an array of existing colorPalette keys to cycle through
    const colorKeys = ["primary", "secondary", "success", "danger", "warning", "info", "gray", "purple", "orange"];

    // Assign colors based on the index, cycling through colorKeys
    const colors = useMemo(() => {
        return categories.map((_, index) => {
            const colorKey = colorKeys[index % colorKeys.length];
            return getFormattedColor(colorKey);
        });
    }, [categories, colorKeys]);

    // Configure chart options
    const chartOptions = useMemo(() => ({
        chart: {
            type: 'bar',
            height: 355,
            toolbar: { show: false },
        },
        xaxis: {
            categories: categories,
            title: {
                text: 'Site',
            },
            labels: {
                rotate: -45, // Rotate labels for better readability
                style: {
                    fontSize: '12px',
                },
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
        grid: {
            show: true,
            borderColor: '#f2f5f7',
        },
        legend: {
            position: 'top'
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val;
                }
            }
        }
    }), [categories, colors]);

    return (
        <div className="box">
            <div className="box-header justify-between">
                <div className="box-title">Equipments by Site</div>
            </div>
            <div className="box-body">
                {statsFetching ? (
                    <LoadingSpinner />
                ) : (
                    <div className="p-6 pb-2">
                        <ApexChart
                            categories={categories}
                            options={chartOptions}
                            series={series}
                            type="bar"
                            height={355}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default EquipmentSiteStats;
