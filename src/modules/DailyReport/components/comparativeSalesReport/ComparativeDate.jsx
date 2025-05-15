import React, { useState } from "react";
import FilterButton from "@components/form/FilterButton.jsx";
import FilterClearButton from "@components/form/FilterClearButton.jsx";

import {
    downloadOfflineStorePerformance
} from "@modules/DailyReport/services/wiseside_services.js";
import ReactFlatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import getComparativeReportDates from "@modules/DailyReport/views/utils.js";
import {CalendarIcon} from "@heroicons/react/16/solid/index.js";

const ComparativeDate = ({ control, errors, clearFilter, filters, hideOnlyComparativePeriod = false }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const downloadPDF = async () => {
        try {
            setIsDownloading(true);
            const pdfData = await downloadOfflineStorePerformance(filters);
            const blob = new Blob([pdfData], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'download/offline-store-performance';
            link.click();
        } catch (error) {
            console.error('Error downloading PDF:', error);
        } finally {
            setIsDownloading(false);
        }
    };


const date = getComparativeReportDates();

    const [dateRange, setDateRange] = useState({
        startDate: date?.startOfMonth,
        endDate: date?.today,
    });

    const [dateRange2, setDateRange2] = useState({
        startDate: date?.startOfPrevYear,
        endDate: date?.formattedPrevYearYesterday,
    });

    return (
        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
                <div className="box custom-box">
                    <div className="box-body p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="flex-1">
                                    <div className="w-full">
                                        <label className="block text-sm font-medium text-black mb-1 dark:text-gray-200 dark:bg-bodybg">
                                            Current Period
                                        </label>
                                        <div className="relative w-full">
                                            <CalendarIcon
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-5 h-5 pointer-events-none dark:text-gray-200 dark:bg-bodybg"
                                            />
                                            <ReactFlatpickr
                                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md dark:text-gray-200 dark:bg-bodybg"
                                                placeholder="Date Range"
                                                value={[dateRange?.startDate, dateRange?.endDate]}
                                                onChange={(date) => {
                                                    setDateRange({startDate: date?.[0], endDate: date?.[1]});
                                                }}
                                                options={{
                                                    mode: 'range',
                                                    dateFormat: 'Y-m-d',
                                                    showMonths: 2,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {!hideOnlyComparativePeriod && (
                                    <>
                                        <div className=" flex-1">

                                            <div className="w-full">
                                                <label className="block text-sm font-medium text-black mb-1 dark:text-gray-200 dark:bg-bodybg">
                                                    Comparative Period
                                                </label>
                                                <div className="relative w-full">
                                                    <CalendarIcon
                                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-5 h-5 pointer-events-none dark:text-gray-200 dark:bg-bodybg"
                                                    />
                                                    <ReactFlatpickr
                                                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-200 dark:bg-bodybg"
                                                        placeholder="Select Date Range"
                                                        value={[dateRange2?.startDate, dateRange2?.endDate]}
                                                        onChange={(date) =>
                                                            setDateRange2({
                                                                startDate: date?.[0],
                                                                endDate: date?.[1],
                                                            })
                                                        }
                                                        options={{
                                                            mode: 'range',
                                                            dateFormat: 'Y-m-d',
                                                            showMonths: 2,
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                        </div>

                                    </>
                                )}
                            </div>
                        <div className="flex items-center gap-4 mt-6">
                            <FilterButton />
                            <FilterClearButton onClick={clearFilter}/>

                                <button
                                    type="button"
                                    className="ti-btn ti-btn-success !mb-0"
                                    onClick={downloadPDF}
                                    disabled={isDownloading}
                                >
                                    <i className={`bi bi-file-earmark-pdf ${isDownloading ? "spin" : ""}`}></i>
                                </button>
                        </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ComparativeDate);


