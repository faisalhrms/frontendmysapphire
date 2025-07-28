import React, { useMemo, useState, useCallback } from "react";
import ApexChart from "@components/charts/ApexChart.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import GraphDataModal from "@modules/dashboards/eq/components/GraphDataModal.jsx";
import { equipmentColumns } from "@modules/dashboards/eq/helpers/equipmentColumns.jsx";

const EquipmentValueStats = ({ filters }) => {
    const { data: rawData, isLoading } = useFetchWithFilters("/dashboard/equipment/value-stats/", filters);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalParams, setModalParams] = useState({});

    const items = useMemo(() => Array.isArray(rawData) ? rawData : [], [rawData]);

    const typeLabels = useMemo(() => items.map(item => item.equipment_type?.name || 'No Type'), [items]);

    const values = useMemo(() => items.map(item => item.total_value), [items]);

    const handleBarClick = useCallback((event, chartContext, config) => {
        const index = config.dataPointIndex;
        if (index >= 0 && items[index]?.equipment_type) {
            const selectedType = items[index].equipment_type;
            setModalParams({
                equipment_type_id: selectedType.id,
                equipment_type: selectedType.name,
                company_id: filters.company_id
            });
            setModalOpen(true);
        }
    }, [items, filters]);

    if (isLoading) return <LoadingSpinner />;

    if (!items.length) return (
        <div className="box p-4">
            <div className="box-header mb-1">
                <div className="box-title text-base font-semibold">Total Value by Equipment Type</div>
            </div>
            <div className="text-center py-10 text-gray-500">No value data available</div>
        </div>
    );

    return (
        <>
            <div className="col-span-6">
                <div className="box p-3">
                    <div className="box-header mb-1">
                        <div className="box-title text-base font-semibold">Total Value by Equipment Type</div>
                    </div>
                    <div className="box-body !p-0">
                        <div className="p-2 min-w-[600px] overflow-x-auto">
                            <ApexChart
                                chartType="bar"
                                height={400}
                                columnWidth="35%"
                                baseWidthPerCategory={160}
                                chartWidth={Math.max(600, typeLabels.length * 160)}
                                labels={typeLabels}
                                categories={typeLabels}
                                colors={['#10B981']}
                                series={[{
                                    name: 'Total Value',
                                    data: values
                                }]}
                                additionalOptions={{
                                    legend: { position: 'top' },
                                    dataLabels: {
                                        enabled: true,
                                        formatter: val => `₨ ${val.toLocaleString()}`,
                                        offsetY: -20,
                                        style: {
                                            fontSize: '11px',
                                            colors: ['#000']
                                        }
                                    },
                                    plotOptions: {
                                        bar: {
                                            horizontal: false,
                                            columnWidth: '35%',
                                            borderRadius: 4,
                                            dataLabels: {
                                                position: 'top',
                                                hideOverflowingLabels: false
                                            }
                                        }
                                    },
                                    xaxis: {
                                        categories: typeLabels,
                                        title: { text: 'Equipment Type' },
                                        labels: {
                                            rotate: 0,
                                            trim: false,
                                            style: {
                                                fontSize: '12px',
                                                whiteSpace: 'normal',
                                                wordBreak: 'break-word',
                                                lineHeight: '1.1rem',
                                                maxWidth: 120
                                            }
                                        }
                                    },
                                    yaxis: {
                                        title: { text: 'Total Value (PKR)' },
                                        labels: {
                                            formatter: val => `₨${(val / 1_000_000).toFixed(1)}M`
                                        }
                                    },
                                    chart: {
                                        toolbar: { show: false },
                                        events: {
                                            dataPointSelection: handleBarClick // ✅ Click-to-open modal
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
            </div>

            {/* ✅ GraphDataModal for drill-down view */}
            <GraphDataModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={`Equipments: ${modalParams?.equipment_type || ''}`}
                apiEndpoint="/equipments/datatable/"
                queryParams={{
                    equipment_type_id: modalParams?.equipment_type_id,
                    company_id: modalParams?.company_id
                }}
                columns={equipmentColumns}
                addButton={null}
            />
        </>
    );
};

export default EquipmentValueStats;
