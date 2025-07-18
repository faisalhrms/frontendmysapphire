import React, {useMemo, useState} from "react";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import { mapSeriesToColors, statusColorMapping } from "@helpers/statusStyles.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import ApexChart from "@components/charts/ApexChart.jsx";
import DonutEquipmentChart from "@modules/dashboards/eq/components/DonutEquipmentChart.jsx";
import GraphDataModal from "@modules/dashboards/eq/components/GraphDataModal.jsx";
import {equipmentColumns} from "@modules/dashboards/eq/helpers/equipmentColumns.jsx";


const EquipmentSummaryCard = ({ filters }) => {
    const { data: rawData, isLoading } = useFetchWithFilters('/dashboard/equipment/summary/', filters);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalParams, setModalParams] = useState({});
    const data = useMemo(() => (rawData && typeof rawData === 'object' ? rawData : {}), [rawData]);

    const { labels, values } = useMemo(() => {
        const { total_equipments, ...statusCounts } = data;
        const filteredEntries = Object.entries(statusCounts || {}).filter(([_, value]) => value > 0);

        const labels = filteredEntries.map(([key]) =>
            key === "no_status"
                ? "N/A"
                : key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
        );

        const values = filteredEntries.map(([_, value]) => value);

        return { labels, values };
    }, [data]);

    const colors = useMemo(() => {
        return mapSeriesToColors(labels, statusColorMapping);
    }, [labels]);

    const handleBarClick = (e, chartCtx, cfg) => {
        const idx = cfg.dataPointIndex;
        const statusKey = Object.keys(data).filter(k => k!=="total_equipments")[idx];
        // open modal: filter by status
        setModalParams({ status: statusKey });
        setModalOpen(true);
    };
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
            {/* Bar Chart - spans 2 columns */}
            {/* Bar Chart - spans 2 columns */}
            <div className="xl:col-span-2 col-span-1 box p-3">
                <div className="box-header mb-1">
                    <div className="box-title text-base font-semibold">Status Distribution (Bar)</div>
                </div>
                <div className="box-body !p-0">
                    <div className="p-2">
                        <ApexChart
                            chartType="bar"
                            height={330}
                            columnWidth="35%"               // 🔧 increased gap between bars
                            baseWidthPerCategory={160}      // 🔧 enables scroll if needed
                            chartWidth={600}                // 🔧 maintain same visual width
                            labels={labels}
                            categories={labels}
                            onPointClick={handleBarClick}
                            colors={colors}
                            series={[{
                                name: "Equipments",
                                data: values
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
                                        borderRadius: 4              // ✅ consistent rounded bars
                                    }
                                },
                                xaxis: {
                                    categories: labels,
                                    labels: {
                                        rotate: 0,                   // ✅ no tilt
                                        trim: false,
                                        style: {
                                            fontSize: '10px',
                                            whiteSpace: 'normal',     // ✅ wrap text
                                            wordBreak: 'break-word',
                                            lineHeight: '1.1rem',
                                            maxWidth: 120             // ✅ label constraint
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


            {/* Pie Chart */}
            <div className="box p-3 flex items-center justify-center">
                <div className="w-full">
                    <div className="box-header mb-1">
                        <div className="box-title text-base font-semibold">Status Distribution (Pie)</div>
                    </div>
                    <div className="box-body p-0">
                        <DonutEquipmentChart
                            labels={labels}
                            series={values}
                            colors={colors}
                            height={320}
                        />
                    </div>
                </div>
            </div>
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
