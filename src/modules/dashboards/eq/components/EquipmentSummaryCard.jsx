import React, { useMemo, useState, useCallback } from "react";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import { mapSeriesToColors, statusColorMapping } from "@helpers/statusStyles.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import ApexChart from "@components/charts/ApexChart.jsx";
import DonutEquipmentChart from "@modules/dashboards/eq/components/DonutEquipmentChart.jsx";
import GraphDataModal from "@modules/dashboards/eq/components/GraphDataModal.jsx";
import { equipmentColumns } from "@modules/dashboards/eq/helpers/equipmentColumns.jsx";
import {colorPalette} from "@helpers/styles.js";

const EquipmentSummaryCard = ({ filters }) => {
    const { data: rawData, isLoading } = useFetchWithFilters('/dashboard/equipment/summary/', filters);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalParams, setModalParams] = useState({});
    const headerBgColor = colorPalette.green.background;
    const donatBgColor=colorPalette.indigo.background
    const data = useMemo(() => (rawData && typeof rawData === 'object' ? rawData : {}), [rawData]);

    const { labels, values, keys } = useMemo(() => {
        const { total_equipments, ...statusCounts } = data;
        const filteredEntries = Object.entries(statusCounts || {}).filter(([_, value]) => value > 0);

        const keys = filteredEntries.map(([key]) => key);
        const labels = keys.map(key =>
            key === "no_status" ? "N/A" : key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
        );
        const values = filteredEntries.map(([_, value]) => value);

        return { labels, values, keys };
    }, [data]);

    const colors = useMemo(() => mapSeriesToColors(labels, statusColorMapping), [labels]);

    const openModalByIndex = useCallback((index) => {
        if (!keys[index]) return;
        const status = keys[index];
        setModalParams({ status, company_id: filters.company_id });
        setModalOpen(true);
    }, [keys, filters]);

    if (isLoading) return <LoadingSpinner />;
    if (!labels.length || !values.length) {
        return (
            <div className="box p-4">
                <div className="box-header mb-1">
                    <div className="box-title text-base font-semibold">Status Distribution</div>
                </div>
                <div className="text-center py-10 text-gray-500">No equipment status data available</div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-2">
            {/* Bar Chart */}
            <div className="xl:col-span-2 col-span-1 box ">
                <div className={`box-header mb-1 p-2 rounded ${headerBgColor}`}>
                    <div className="box-title text-base font-semibold text-info">
                        Status Distribution (Bar)
                    </div>
                </div>
                <ApexChart
                    chartType="bar"
                    height={330}
                    columnWidth="35%"
                    baseWidthPerCategory={160}
                    chartWidth={600}
                    labels={labels}
                    categories={labels}
                    onPointClick={(e, chartCtx, config) => openModalByIndex(config.dataPointIndex)}
                    colors={["#10B981"]}
                    series={[{name: "Equipments", data: values}]}
                    additionalOptions={{
                        legend: {position: 'top'},
                        dataLabels: {
                            enabled: true,
                            formatter: val => val > 0.1 ? `${val.toLocaleString()}` : '',

                            style: {
                                fontSize: '11px',
                                colors: ['#10B981']// ← now purple
                            },
                            offsetY: -20,
                        },
                        plotOptions: {
                            bar: {
                                dataLabels: {
                                    position: 'top',
                                    hideOverflowingLabels: false,
                                    style: {colors: ['#845adf']}  // keep top-of-bar text purple here as well
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
                            toolbar: {show: false}
                        },
                        grid: {
                            borderColor: '#f1f1f1',
                            strokeDashArray: 4
                        }
                    }}
                />

            </div>

            {/* Donut Chart */}
            <div className="box  flex items-center justify-center">
                <div className="w-full">

                    <div className={`box-header mb-1 p-2 rounded ${donatBgColor}`}>
                        <div className="box-title text-base font-semibold text-info">
                            Status Distribution (Donut)
                        </div>
                    </div>
                    <div className="box-body p-0">
                        <DonutEquipmentChart
                            labels={labels}
                            series={values}
                            colors={colors}
                            height={320}
                            onSliceClick={(_, __, config) => openModalByIndex(config.dataPointIndex)} // Pass the callback here
                        />
                    </div>
                </div>
            </div>

            {/* Shared Modal */}
            <GraphDataModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={`Equipments: ${modalParams.status}`}
                apiEndpoint="/equipments/datatable/"
                queryParams={modalParams}
                columns={equipmentColumns}
                addButton={null}
            />
        </div>
    );
};

export default EquipmentSummaryCard;
