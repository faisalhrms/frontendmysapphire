import React, { useEffect, useState } from "react";
import ApexChart from "@components/charts/ApexChart.jsx";
import { fetch404ErrorSummary } from "../../services/Analysis_services.jsx"
import AnalysisErrorModal from "./AnalysisErrorModal.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const EquipmentDepartmentStats = ({ chartData,loading,dateFrom, dateTo }) => {

    const [error, setError] = useState(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);



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
            <div className="box dark:text-gray-200 dark:bg-bodybg">
                <div className="box-header justify-between">
                    <div className="box-title">404 Errors By Date</div>
                </div>
                <div className="box-body">
                    {loading ? (
                        <div className="text-center text-gray-500"><LoadingSpinner/></div>
                    ) : error ? (
                        <div className="text-center text-red-500">{error}</div>
                    ) : chartData?.series?.length > 0 ? (
                        <ApexChart
                            categories={chartData?.categories}
                            series={chartData?.series}
                            type="bar"
                            height={355}
                            onPointClick={handlePointClick}
                            baseWidthPerCategory={20}
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

