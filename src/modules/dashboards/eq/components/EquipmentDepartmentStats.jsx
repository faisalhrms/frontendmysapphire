import React, { useCallback, useMemo, useState } from "react";
import ApexChart from "@components/charts/ApexChart.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import GraphDataModal from "@modules/dashboards/eq/components/GraphDataModal.jsx";
import { equipmentColumns } from "@modules/dashboards/eq/helpers/equipmentColumns.jsx";

const EquipmentDepartmentStats = ({ filters }) => {
    const { data: rawData, isLoading } = useFetchWithFilters("/dashboard/equipment/department-stats/", filters);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalParams, setModalParams] = useState({});

    const data = useMemo(() => (Array.isArray(rawData) ? rawData : []), [rawData]);

    const filteredData = useMemo(() => data.filter(item => item.count > 0), [data]);

    const categories = useMemo(
        () => filteredData.map(item => item.department?.name || "No Department"),
        [filteredData]
    );

    const values = useMemo(() => filteredData.map(item => item.count), [filteredData]);

    const handleBarClick = useCallback((event, chartContext, config) => {
        const index = config.dataPointIndex;
        if (index >= 0 && filteredData[index]) {
            const selected = filteredData[index];
            const selectedDept = selected.department;
            setModalParams({
                department_id: selectedDept?.id,
                department: selectedDept?.name || "No Department",
                company_id: filters.company_id
            });
            setModalOpen(true);
        }
    }, [filteredData, filters.company_id]);

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
        <>
            <div className="col-span-6">
                <div className="box">
                    <div className="box-header mb-1">
                        <div className="box-title text-base font-semibold">Assets by Department</div>
                    </div>
                    <div className="box-body !p-0">
                        <div className="p-2 min-w-[600px] overflow-x-auto">
                            <ApexChart
                                chartType="bar"
                                height={370}
                                columnWidth="20%"
                                baseWidthPerCategory={200}
                                chartWidth={categories.length * 160}
                                labels={categories}
                                categories={categories}
                                colors={['#3B82F6']}
                                series={[{
                                    name: 'Assets',
                                    data: values
                                }]}
                                additionalOptions={{
                                    legend: { position: 'top' },
                                    dataLabels: {
                                        enabled: true,
                                        formatter: val => (val > 0.1 ? `${val.toLocaleString()}` : ''),
                                        offsetY: -20,
                                        style: {
                                            fontSize: '11px',
                                            colors: ['#3B82F6']  // ← now purple
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
                                        categories,
                                        title: { text: 'Department' },
                                        labels: {
                                            rotate: 0,
                                            trim: false,
                                            style: {
                                                fontSize: '12px',
                                                whiteSpace: 'normal',
                                                wordBreak: 'break-word',
                                                lineHeight: '1.1rem',
                                                maxWidth: 150,
                                            }
                                        }
                                    },
                                    yaxis: {
                                        title: { text: 'Number of Equipments' },
                                        tickAmount: 5
                                    },
                                    chart: {
                                        toolbar: {
                                            show: false
                                        },
                                        events: {
                                            dataPointSelection: handleBarClick
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

            <GraphDataModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={`Equipments: ${modalParams?.department || ''}`}
                apiEndpoint="/equipments/datatable/"
                queryParams={{
                    department_id: modalParams?.department_id,
                    company_id: modalParams?.company_id,
                }}
                columns={equipmentColumns}
                addButton={null}
            />
        </>
    );
};

export default EquipmentDepartmentStats;
