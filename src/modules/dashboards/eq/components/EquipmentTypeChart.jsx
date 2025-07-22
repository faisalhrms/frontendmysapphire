import React, { useMemo } from "react";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import ApexChart from "@components/charts/ApexChart.jsx";
import { generateColorPalette } from "@helpers/colorUtils.js";

const EquipmentTypeChart = ({ filters }) => {
    const { data: rawData, isLoading } = useFetchWithFilters("/dashboard/equipment/type-stats/", filters);

    // Ensure `data` is always an array
    const data = useMemo(() => (Array.isArray(rawData) ? rawData : []), [rawData]);

    const { labels, values, colors } = useMemo(() => {
        const filtered = data.filter(item => item.count > 0);

        const labels = filtered.map(item => item.equipment_type?.name || 'N/A');
        const values = filtered.map(item => item.count);
        const colors = generateColorPalette(values.length);

        return { labels, values, colors };
    }, [data]);

    if (isLoading) return <LoadingSpinner />;
    if (!labels.length || !values.length) {
        return (
            <div className="box p-4">
                <div className="box-header mb-2">
                    <div className="box-title">Equipment Count by Type</div>
                </div>
                <div className="text-center py-10 text-gray-500">No equipment type data available</div>
            </div>
        );
    }

    return (
        <div className="box p-4">
            <div className="box-header mb-2">
                <div className="box-title">Equipment Count by Type</div>
            </div>
            <div className="box-body !p-0">
                <div className="p-2">
                    <ApexChart
                        chartType="bar"
                        height={330}
                        columnWidth="35%"
                        baseWidthPerCategory={160}
                        chartWidth={600}
                        labels={labels}
                        categories={labels}
                        colors={colors}
                        series={[{
                            name: "Equipments",
                            data: values,
                        }]}
                        additionalOptions={{
                            legend: { position: 'top' },
                            dataLabels: {
                                enabled: true,
                                formatter: val => val > 0.1 ? `${val.toLocaleString()}` : '',
                                offsetY: -20,
                                style: {
                                    fontSize: '11px',
                                    colors: ['#000']
                                },
                            },
                            plotOptions: {
                                bar: {
                                    dataLabels: {
                                        position: 'top',
                                        hideOverflowingLabels: false
                                    },
                                    borderRadius: 4
                                }
                            },
                            xaxis: {
                                categories: labels,
                                labels: {
                                    rotate: 0, // ✅ no tilt
                                    trim: false,
                                    style: {
                                        fontSize: '10px',
                                        whiteSpace: 'normal', // ✅ allow multiline
                                        wordBreak: 'break-word',
                                        lineHeight: '1.1rem',
                                        maxWidth: 120 // ✅ wrap within 120px
                                    }
                                }
                            },
                            yaxis: {
                                title: {
                                    text: 'Number of Equipments'
                                },
                                tickAmount: 6
                            },
                            chart: {
                                toolbar: {
                                    show: false
                                }
                            },
                            grid: {
                                borderColor: '#f1f1f1',
                                strokeDashArray: 4
                            }
                        }}
                    />

                </div>
            </div>

        </div>
    );
};

export default EquipmentTypeChart;
