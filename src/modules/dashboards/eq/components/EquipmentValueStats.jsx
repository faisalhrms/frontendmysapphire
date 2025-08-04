import React, { useMemo, useState, useCallback } from "react";
import ApexChart from "@components/charts/ApexChart.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import GraphDataModal from "@modules/dashboards/eq/components/GraphDataModal.jsx";
import { equipmentColumns } from "@modules/dashboards/eq/helpers/equipmentColumns.jsx";
import {colorPalette} from "@helpers/styles.js";

const EquipmentValueStats = ({ filters }) => {
    const { data: rawData, isLoading } = useFetchWithFilters(
        "/dashboard/equipment/value-stats/",
        filters
    );

    const [modalOpen, setModalOpen] = useState(false);
    const [modalParams, setModalParams] = useState({});
    const ValueHeaderColor=colorPalette.success.background
    const items = useMemo(() => (Array.isArray(rawData) ? rawData : []), [
        rawData,
    ]);
    const typeLabels = useMemo(
        () => items.map((i) => i.equipment_type?.name || "No Type"),
        [items]
    );
    const values = useMemo(() => items.map((i) => i.total_value), [items]);

    const handleBarClick = useCallback(
        (e, ctx, cfg) => {
            const idx = cfg.dataPointIndex;
            const sel = items[idx]?.equipment_type;
            if (!sel) return;
            setModalParams({
                equipment_type_id: sel.id,
                equipment_type: sel.name,
                company_id: filters.company_id,
            });
            setModalOpen(true);
        },
        [items, filters.company_id]
    );

    if (isLoading) return <LoadingSpinner />;
    if (!items.length)
        return (
            <div className="box p-4">
                <div className="box-header mb-1">
                    <div className="box-title text-base font-semibold">
                        Total Value by Equipment Type
                    </div>
                </div>
                <div className="text-center py-10 text-gray-500">
                    No value data available
                </div>
            </div>
        );

    return (
        <>
            <div className="col-span-6">
                <div className="box">

                    <div className={`box-header mb-1 ${ValueHeaderColor}`}>
                        <div className="box-title text-base font-semibold text-info">
                            Total Value by Equipment Type
                        </div>
                    </div>
                    <div className="box-body !p-0">
                        <div className="p-2 min-w-[600px] overflow-x-auto">
                            <ApexChart
                                chartType="bar"
                                height={400}
                                columnWidth="20%"                   // narrower bars
                                baseWidthPerCategory={200}          // more room per bar
                                chartWidth={Math.max(600, typeLabels.length * 200)}
                                labels={typeLabels}
                                categories={typeLabels}
                                colors={["#10B981"]}
                                series={[{name: "Total Value", data: values}]}
                                additionalOptions={{
                                    legend: {position: "top"},
                                    dataLabels: {
                                        enabled: true,
                                        formatter: (v) => `₨ ${v.toLocaleString()}`,
                                        offsetY: -20,
                                        style: {
                                            fontSize: '11px',
                                            colors: ['#10B981']  // ← now purple
                                        },
                                    },
                                    plotOptions: {
                                        bar: {
                                            horizontal: false,
                                            columnWidth: "20%",
                                            borderRadius: 4,
                                            dataLabels: {
                                                position: 'top',
                                                hideOverflowingLabels: false
                                            }
                                        }
                                    },
                                    xaxis: {
                                        categories: typeLabels,
                                        labels: {
                                            rotate: 0,
                                            trim: false,
                                            style: {
                                                fontSize: "12px",
                                                whiteSpace: "normal",
                                                wordBreak: "break-word",
                                                lineHeight: "1.1rem",
                                                maxWidth: 150, // allow wrapping
                                            },
                                        },
                                    },
                                    yaxis: {
                                        title: {text: "Total Value (PKR)"},
                                        labels: {
                                            formatter: (v) => `₨${(v / 1_000_000).toFixed(1)}M`,
                                        },
                                    },
                                    chart: {
                                        toolbar: {show: false},
                                        events: {dataPointSelection: handleBarClick},
                                    },
                                    grid: {
                                        borderColor: "#f1f1f1",
                                        strokeDashArray: 4,
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <GraphDataModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={`Equipments: ${modalParams.equipment_type || ""}`}
                apiEndpoint="/equipments/datatable/"
                queryParams={{
                    equipment_type_id: modalParams.equipment_type_id,
                    company_id: modalParams.company_id,
                }}
                columns={equipmentColumns}
                addButton={null}
            />
        </>
    );
};

export default EquipmentValueStats;
