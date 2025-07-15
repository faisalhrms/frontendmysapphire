import React, { useMemo } from "react";
import ApexChart from "@components/charts/ApexChart.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";

const EquipmentDepartmentStats = ({ filters }) => {
    const { data: rawData, isLoading } = useFetchWithFilters("/dashboard/equipment/department-stats/", filters);

    // Ensure `data` is always an array
    const data = useMemo(() => (Array.isArray(rawData) ? rawData : []), [rawData]);

    const filteredData = useMemo(() => data.filter(item => item.count > 0), [data]);

    const categories = useMemo(
        () => filteredData.map(item => item.department?.name || "No Department"),
        [filteredData]
    );

    const values = useMemo(() => filteredData.map(item => item.count), [filteredData]);

    if (isLoading) return <LoadingSpinner />;
    if (!categories.length || !values.length) {
        return (
            <div className="box p-4">
                <div className="box-header mb-1">
                    <div className="box-title text-base font-semibold">Assets by Department</div>
                </div>
                <div className="text-center py-10 text-gray-500">No department data available</div>
            </div>
        );
    }

    return (
        <div className="col-span-6">
            <div className="box">
                <div className="box-header mb-1">
                    <div className="box-title text-base font-semibold">Assets by Department</div>
                </div>
                <div className="box-body !p-0">
                    <div className="p-2 min-w-[600px] overflow-x-auto">
                        <ApexChart
                            columnWidth="30%"
                            chartWidth={categories.length * 160}
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
                                xaxis: {
                                    categories,
                                    title: { text: 'Department' },
                                    labels: {
                                        rotate: -45,
                                        style: { fontSize: '12px' }
                                    }
                                },
                                yaxis: {
                                    title: { text: 'Number of Equipments' },
                                    tickAmount: 5
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
                            labels={categories}
                            height={370}
                            series={[{
                                name: 'Assets',
                                data: values
                            }]}
                            colors={['#3B82F6']} // blue
                            baseWidthPerCategory={2}
                            chartType="bar"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentDepartmentStats;
