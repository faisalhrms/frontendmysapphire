import React, { useMemo, useState, useCallback } from "react";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import ApexChart from "@components/charts/ApexChart.jsx";
import { generateColorPalette } from "@helpers/colorUtils.js";
import GraphDataModal from "@modules/dashboards/eq/components/GraphDataModal.jsx";
import { equipmentColumns } from "@modules/dashboards/eq/helpers/equipmentColumns.jsx";

const EquipmentTypeChart = ({ filters }) => {
    const { data: rawData, isLoading } = useFetchWithFilters("/dashboard/equipment/type-stats/", filters);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalParams, setModalParams] = useState({});
        console.log(modalParams);
    const data = useMemo(() => (Array.isArray(rawData) ? rawData : []), [rawData]);

    const { labels, values, colors, originalData } = useMemo(() => {
        const filtered = data.filter(item => item.count > 0);
        return {
            labels: filtered.map(item => item.equipment_type?.name || 'N/A'),
            values: filtered.map(item => item.count),
            colors: generateColorPalette(filtered.length),
            originalData: filtered
        };
    }, [data]);

    const handleBarClick = useCallback((event, chartContext, config) => {
        const dataIndex = config.dataPointIndex;
        if (dataIndex >= 0 && originalData[dataIndex]) {
            const selectedType = originalData[dataIndex].equipment_type;
            setModalParams({
                equipment_type_id: selectedType?.id,
                equipment_type: selectedType?.name || 'N/A',
                company_id: filters.company_id
            });
            setModalOpen(true);
        }
    }, [originalData, filters]);

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
        <>
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
                                        colors: colors // ← now purple
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
                                        rotate: 0,
                                        trim: false,
                                        style: {
                                            fontSize: '10px',
                                            whiteSpace: 'normal',
                                            wordBreak: 'break-word',
                                            lineHeight: '1.1rem',
                                            maxWidth: 120
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
                                    toolbar: { show: false },
                                    events: {
                                        dataPointSelection: handleBarClick // ✅ add click handler
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

            {/* ✅ Modal for equipment list by type */}
            <GraphDataModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={`Equipments: ${modalParams?.equipment_type || ''}`}
                apiEndpoint="/equipments/datatable/"
                queryParams={{
                    equipment_type_id: modalParams?.equipment_type_id,
                    company_id: modalParams?.company_id,
                }}
                columns={equipmentColumns}
                addButton={null}
            />
        </>
    );
};

export default EquipmentTypeChart;
