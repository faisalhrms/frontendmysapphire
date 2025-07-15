import React, { useMemo } from "react";
import ApexChart from "@components/charts/ApexChart.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";

const EquipmentValueStats = ({ filters }) => {
    const { data: rawData, isLoading } = useFetchWithFilters("/dashboard/equipment/value-stats/", filters);

    // ✅ Ensure safe array usage
    const items = useMemo(() => {
        return Array.isArray(rawData) ? rawData : [];
    }, [rawData]);

    const typeLabels = useMemo(() => {
        return items.map(item => item.equipment_type?.name || 'No Type');
    }, [items]);

    const values = useMemo(() => {
        return items.map(item => item.total_value);
    }, [items]);

    if (isLoading) return <LoadingSpinner />;
    if (!items.length) return  <div className="box p-4">
        <div className="box-header mb-1">
            <div className="box-title text-base font-semibold">Total Value by Equipment Type</div>
        </div>
        <div className="text-center py-10 text-gray-500">No value data available</div>
    </div>


    return (
        <div className="col-span-6">
            <div className="box p-3">
                <div className="box-header mb-1">
                    <div className="box-title text-base font-semibold">Total Value by Equipment Type</div>
                </div>
                <div className="box-body !p-0">
                    <div className="p-2 min-w-[600px] overflow-x-auto">
                        <ApexChart
                            columnWidth="30%"
                            chartWidth={Math.max(600, typeLabels.length * 160)}
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
                                        columnWidth: '30%',
                                        borderRadius: 4,
                                        dataLabels: { position: 'top' }
                                    }
                                },
                                xaxis: {
                                    categories: typeLabels,
                                    title: { text: 'Equipment Type' },
                                    labels: { rotate: -45, style: { fontSize: '12px' } }
                                },
                                yaxis: {
                                    title: { text: 'Total Value (PKR)' },
                                    labels: {
                                        formatter: val => `₨${(val / 1_000_000).toFixed(1)}M`
                                    }
                                },
                                chart: { toolbar: { show: false } },
                                grid: {
                                    borderColor: '#f1f1f1',
                                    strokeDashArray: 4
                                }
                            }}
                            labels={typeLabels}
                            height={400}
                            series={[{
                                name: 'Total Value',
                                data: values
                            }]}
                            colors={['#10B981']} // Green
                            baseWidthPerCategory={2}
                            chartType="bar"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentValueStats;
