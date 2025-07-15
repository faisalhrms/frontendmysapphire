import React, { useMemo } from 'react';
import ApexChart from "@components/charts/ApexChart.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";

const EquipmentAnalysisCard = ({ filters }) => {
    const { data: rawData, isLoading } = useFetchWithFilters("/dashboard/equipment/monthly-acquisition/", filters);

    const items = useMemo(() => {
        return Array.isArray(rawData) ? rawData : [];
    }, [rawData]);

    const categories = useMemo(() => {
        return items.map(item =>
            new Date(item.month).toLocaleString('default', { month: 'short', year: '2-digit' })
        );
    }, [items]);

    const series = useMemo(() => [{
        name: 'Monthly Acquisitions',
        data: items.map(item => item.count),
    }], [items]);

    if (isLoading) return <LoadingSpinner />;
    if (!items.length) return <div className="box p-4">
        <div className="box-header mb-1">
            <div className="box-title text-base font-semibold">Monthly Asset Acquisitions</div>
        </div>
        <div className="text-center py-10 text-gray-500">No monthly acquisition data available</div>
    </div>


    return (
        <div className="col-span-6">
            <div className="box">
                <div className="box-header justify-between">
                    <div className="box-title">Monthly Asset Acquisitions</div>
                </div>
                <div className="box-body !p-0">
                    <div className="overflow-x-auto">
                        <div className="p-2 min-w-[600px]">
                            <ApexChart
                                chartType="bar"
                                height={370}
                                chartWidth={categories.length * 160}
                                labels={categories}
                                baseWidthPerCategory={2}
                                series={series}
                                colors={['#EF4444']}
                                columnWidth="30%"

                                additionalOptions={{
                                    legend: { position: 'top' },

                                    dataLabels: {
                                        enabled: true,
                                        formatter: val => (val > 0.1 ? `${val.toLocaleString()}` : ''),
                                        offsetY: -20,
                                        style: {
                                            fontSize: '11px',
                                            colors: ['#000']
                                        },
                                    },
                                    plotOptions: {
                                        bar: {
                                            horizontal: false,
                                            columnWidth: '30%',
                                            borderRadius: 4,
                                            dataLabels: {
                                                position: 'top',
                                                hideOverflowingLabels: false
                                            }
                                        }
                                    },
                                    chart: {
                                        toolbar: {
                                            show: false
                                        }
                                    },
                                    xaxis: {
                                        categories,
                                        title: { text: 'Month' },
                                        labels: {
                                            rotate: -45,
                                            style: { fontSize: '12px' }
                                        }
                                    },
                                    yaxis: {
                                        title: { text: 'Number of Equipments' },
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
        </div>
    );
};

export default EquipmentAnalysisCard;
