import React, { useMemo } from "react";
import ApexChart from "@components/charts/ApexChart.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";

const EquipmentSiteStats = ({ filters }) => {
    const { data: items, isLoading } = useFetchWithFilters("/dashboard/equipment/site-stats/", filters);

    const siteLabels = useMemo(() => {
        if (!Array.isArray(items)) return [];
        return items.map(item => item.equipment_site?.name || 'No Site');
    }, [items]);

    const siteCounts = useMemo(() => {
        if (!Array.isArray(items)) return [];
        return items.map(item => item.count);
    }, [items]);

    if (isLoading) return <LoadingSpinner />;
    if (!Array.isArray(items) || !items.length) return<div className="box p-4">
        <div className="box-header mb-1">
            <div className="box-title text-base font-semibold">Assets by Site</div>
        </div>
        <div className="text-center py-10 text-gray-500">No site data available</div>
    </div>


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
                            columnWidth="35%" // ✅ wider spacing
                            baseWidthPerCategory={160} // ✅ enables scroll for long lists
                            chartWidth={Math.max(600, siteLabels.length * 160)} // ✅ dynamic chart width
                            labels={siteLabels}
                            categories={siteLabels}
                            colors={['#FACC15']} // yellow
                            series={[{
                                name: 'Assets',
                                data: siteCounts
                            }]}
                            additionalOptions={{
                                legend: {position: 'top'},
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
                                        columnWidth: '35%', // ✅ match gap
                                        borderRadius: 4,
                                        dataLabels: {
                                            position: 'top',
                                            hideOverflowingLabels: false
                                        }
                                    }
                                },
                                xaxis: {
                                    categories: siteLabels,
                                    title: {text: 'Sites'},
                                    labels: {
                                        rotate: 0, // ✅ straight, no angle
                                        trim: false,
                                        style: {
                                            fontSize: '12px',
                                            whiteSpace: 'normal',
                                            wordBreak: 'break-word',
                                            lineHeight: '1.1rem',
                                            maxWidth: 120 // ✅ wrap properly
                                        }
                                    }
                                },
                                yaxis: {
                                    title: {text: 'Number of Equipments'},
                                    tickAmount: 6
                                },
                                chart: {toolbar: {show: false}},
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

    );
};

export default EquipmentSiteStats;
