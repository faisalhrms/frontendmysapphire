import React, { useMemo, useState } from "react";
import ApexChart from "@components/charts/ApexChart.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import GraphDataModal from "@modules/dashboards/eq/components/GraphDataModal.jsx";
import { equipmentColumns } from "@modules/dashboards/eq/helpers/equipmentColumns.jsx"; // ✅ reuse columns

const EquipmentSiteStats = ({ filters }) => {
    const { data: items, isLoading } = useFetchWithFilters("/dashboard/equipment/site-stats/", filters);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalParams, setModalParams] = useState(null);

    const siteLabels = useMemo(() => {
        if (!Array.isArray(items)) return [];
        return items.map(item => item.equipment_site?.name || 'No Site');
    }, [items]);

    const siteCounts = useMemo(() => {
        if (!Array.isArray(items)) return [];
        return items.map(item => item.count);
    }, [items]);

    const handleBarClick = (event, chartContext, config) => {
        const index = config.dataPointIndex;
        const item = Array.isArray(items) ? items[index] : null;
        const site = item?.equipment_site;

        // Safely set modal params
        setModalParams({
            equipment_site_id: site?.id,
            site: site?.name || "No Site",
            company_id: filters?.company_id || null
        });
        setModalOpen(true);
    };

    if (isLoading) return <LoadingSpinner />;

    if (!Array.isArray(items) || !items.length) {
        return (
            <div className="box p-4">
                <div className="box-header mb-1">
                    <div className="box-title text-base font-semibold">Assets by Site</div>
                </div>
                <div className="text-center py-10 text-gray-500">No site data available</div>
            </div>
        );
    }

    return (
        <div className="col-span-6">
            <div className="box p-3">
                <div className="box-header mb-1">
                    <div className="box-title text-base font-semibold">Assets by Site</div>
                </div>
                <div className="box-body !p-0">
                    <div className="p-2 min-w-[600px] overflow-x-auto">
                        <ApexChart
                            chartType="bar"
                            height={400}
                            columnWidth="35%"
                            baseWidthPerCategory={160}
                            chartWidth={Math.max(600, siteLabels.length * 160)}
                            labels={siteLabels}
                            categories={siteLabels}
                            colors={['#FACC15']}
                            series={[{
                                name: 'Assets',
                                data: siteCounts
                            }]}
                            additionalOptions={{
                                chart: {
                                    toolbar: { show: false },
                                    events: {
                                        dataPointSelection: handleBarClick
                                    }
                                },
                                legend: { position: 'top' },
                                dataLabels: {
                                    enabled: true,
                                    formatter: val => val > 0 ? `${val.toLocaleString()}` : '',
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
                                    categories: siteLabels,
                                    title: { text: 'Sites' },
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
                                    title: { text: 'Number of Equipments' },
                                    tickAmount: 6
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

            {/* Graph Modal */}
            {modalOpen && (
                <GraphDataModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={`Equipments: ${modalParams?.site || ''}`}
                    apiEndpoint="/equipments/datatable/"
                    queryParams={{
                        equipment_site_id: modalParams?.equipment_site_id,
                        company_id: modalParams?.company_id,
                    }}
                    columns={equipmentColumns}
                    addButton={null}
                />
            )}
        </div>
    );
};

export default EquipmentSiteStats;
