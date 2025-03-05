import React, { useEffect, useState } from "react";
import ApexChart from "@components/charts/ApexChart.jsx";
import { fetch404ErrorSummary } from "../../services/Analysis_services.jsx"
import AnalysisErrorModal from "./AnalysisErrorModal.jsx";

const EquipmentDepartmentStats = ({ dateFrom, dateTo }) => {
    const [chartData, setChartData] = useState({ categories: [], series: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetch404ErrorSummary({ date_from: dateFrom, date_to: dateTo });
                if (data?.categories?.length && data?.series?.length) {
                    setChartData({
                        categories: data.categories,
                        series: data.series,
                    });
                } else {
                    setChartData({ categories: [], series: [] });
                }
            } catch (err) {
                setError("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [dateFrom, dateTo]);

    const handlePointClick = (event, chartContext, config) => {
        const { dataPointIndex } = config;
        const selectedDate = chartData?.categories?.[dataPointIndex];
        setSelectedDate(selectedDate);
        setIsErrorModalOpen(true);
    };

    const closeErrorModal = () => {
        setIsErrorModalOpen(false);
        setSelectedDate(null);
    };

    return (
        <>
            <div className="box">
                <div className="box-header justify-between">
                    <div className="box-title">404 Errors By Date</div>
                </div>
                <div className="box-body">
                    {loading ? (
                        <div className="text-center text-gray-500">Loading...</div>
                    ) : error ? (
                        <div className="text-center text-red-500">{error}</div>
                    ) : chartData.series.length > 0 ? (
                        <ApexChart
                            categories={chartData.categories}
                            series={chartData.series}
                            type="bar"
                            height={355}
                            onPointClick={handlePointClick}
                        />
                    ) : (
                        <div className="text-center text-gray-500">No data available</div>
                    )}
                </div>
            </div>
            {isErrorModalOpen && selectedDate && (
                <AnalysisErrorModal
                    // title={`Error Report - ${new Date().toLocaleDateString()}`}
                    title="404 Error Report"
                    onClose={closeErrorModal}
                    date={selectedDate}
                />
            )}
        </>
    );
};

export default EquipmentDepartmentStats;

