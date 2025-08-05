import React, { useMemo, useState, useCallback } from 'react';
import ApexChart from "@components/charts/ApexChart.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import GraphDataModal from "@modules/dashboards/eq/components/GraphDataModal.jsx";
import { equipmentColumns } from "@modules/dashboards/eq/helpers/equipmentColumns.jsx";
import {colorPalette} from "@helpers/styles.js";

const EquipmentAnalysisCard = ({ filters }) => {
    const { data: rawData, isLoading } = useFetchWithFilters(
        "/dashboard/equipment/monthly-acquisition/",
        filters
    );
    const analysisHeaderColor=colorPalette.red.background

    const [modalOpen, setModalOpen] = useState(false);
    const [modalParams, setModalParams] = useState(null);

    const items = useMemo(() => (Array.isArray(rawData) ? rawData : []), [
        rawData,
    ]);

    const categories = useMemo(
        () =>
            items.map((item) =>
                new Date(item.month).toLocaleString('default', {
                    month: 'short',
                    year: '2-digit',
                })
            ),
        [items]
    );

    const series = useMemo(
        () => [
            {
                name: 'Monthly Acquisitions',
                data: items.map((item) => item.count),
            },
        ],
        [items]
    );

    const handleBarClick = useCallback((_, __, config) => {
        const idx = config.dataPointIndex;
        const item = items[idx];
        if (!item) return;

        setModalParams({
            purchase_date: item.month,          // pass month string
            company_id: filters.company_id,
        });
        setModalOpen(true);
    }, [items, filters.company_id]);

    if (isLoading) return <LoadingSpinner />;
    if (!items.length)
        return (
            <div className="box p-4">
                <div className="box-header mb-1">
                    <div className="box-title text-base font-semibold">
                        Monthly Asset Acquisitions
                    </div>
                </div>
                <div className="text-center py-10 text-gray-500">
                    No monthly acquisition data available
                </div>
            </div>
        );

    return (
        <div className="col-span-6">
            <div className="box">

                <div className={`box-header justify-between ${analysisHeaderColor}`}>
                    <div className="box-title text-base font-semibold text-info">
                        Monthly Asset Acquisitions
                    </div>
                </div>
                <div className="box-body !p-0">
                    <div className="overflow-x-auto">
                        <div className="p-2 min-w-[600px]">
                            <ApexChart
                                chartType="bar"
                                height={370}
                                columnWidth="25%"                        // narrower bars
                                baseWidthPerCategory={160}               // space per bar
                                chartWidth={Math.max(600, categories.length * 160)}
                                labels={categories}
                                categories={categories}
                                colors={['#EF4444']}
                                series={series}
                                additionalOptions={{
                                    chart: {
                                        toolbar: {show: false},
                                        events: {dataPointSelection: handleBarClick},
                                    },
                                    legend: {position: 'top'},
                                    dataLabels: {
                                        enabled: true,
                                        formatter: (v) => (v > 0.1 ? v.toLocaleString() : ''),
                                        offsetY: -20,
                                        style: {
                                            fontSize: '11px',
                                            colors: ['#EF4444']  // ← now purple
                                        },
                                    },
                                    plotOptions: {
                                        bar: {
                                            horizontal: false,
                                            columnWidth: '25%',
                                            borderRadius: 4,
                                            dataLabels: {position: 'top'},
                                        },
                                    },
                                    xaxis: {
                                        categories,
                                        labels: {
                                            rotate: -45,
                                            trim: false,
                                            style: {
                                                fontSize: '12px',
                                                whiteSpace: 'normal',
                                                wordBreak: 'break-word',
                                                lineHeight: '1.1rem',
                                                maxWidth: 100
                                            },
                                        },
                                    },
                                    yaxis: {title: {text: 'Number of Assets'}, tickAmount: 6},
                                    grid: {borderColor: '#f1f1f1', strokeDashArray: 4},
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Drill‑down modal */}
            {modalOpen && (
                <GraphDataModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={`Equipments acquired in ${new Date(
                        modalParams.purchase_date
                    ).toLocaleString('default', {
                        month: 'long',
                        year: 'numeric',
                    })}`}
                    apiEndpoint="/equipments/datatable-by-purchase-month/"
                    queryParams={{
                        purchase_date: modalParams.purchase_date,
                        company_id: modalParams.company_id,
                    }}
                    columns={equipmentColumns}
                    addButton={null}
                />
            )}
        </div>
    );
};

export default EquipmentAnalysisCard;
