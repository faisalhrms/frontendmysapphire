import React, {useEffect, useState} from "react";
import FilterButton from "@components/form/FilterButton.jsx";
import FilterClearButton from "@components/form/FilterClearButton.jsx";

import {
    downloadOfflineStorePerformance
} from "@modules/DailyReport/services/wiseside_services.js";
import ReactFlatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import getComparativeReportDates from "@modules/DailyReport/views/utils.js";
import { CalendarIcon } from "@heroicons/react/16/solid/index.js";

const ComparativeDate = ({ control, errors, clearFilter, filters, hideOnlyComparativePeriod = false , onApplyFilters ,getFilters ,setFilterValue  }) => {
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


    const toDateObj = (d) => (d ? (d instanceof Date ? d : new Date(d)) : null);

    const [dateRange, setDateRange] = useState({
        startDate: toDateObj(date?.startOfMonth),
        endDate: toDateObj(date?.today),
    });

    const [dateRange2, setDateRange2] = useState({
        startDate: toDateObj(date?.startOfPrevYear),
        endDate: toDateObj(date?.formattedPrevYearYesterday),
    });

    // When dateRange changes, update corresponding filters using setFilterValue
    useEffect(() => {
        if (setFilterValue) {
            setFilterValue('from_cy', dateRange.startDate ? formatDate(dateRange.startDate) : null);
            setFilterValue('to_cy', dateRange.endDate ? formatDate(dateRange.endDate) : null);
        }
    }, [dateRange, setFilterValue]);

    useEffect(() => {
        if (setFilterValue) {
            setFilterValue('from_ly', dateRange2.startDate ? formatDate(dateRange2.startDate) : null);
            setFilterValue('to_ly', dateRange2.endDate ? formatDate(dateRange2.endDate) : null);
        }
    }, [dateRange2, setFilterValue]);

    // Format date helper: YYYY-MM-DD
    const formatDate = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


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
                                                className="pl-10 pr-4 py-2 w-full border border-gray-300  rounded-md dark:text-gray-200 dark:bg-bodybg"
                                                placeholder="Date Range"
                                                value={[dateRange?.startDate, dateRange?.endDate]}
                                                onChange={(dates) => {
                                                    setDateRange({
                                                        startDate: dates?.[0] || null,
                                                        endDate: dates?.[1] || null,
                                                    });
                                                }}
                                                options={{
                                                    mode: 'range',
                                                    dateFormat: 'j-M-Y', // format like 1-May-2024
                                                    showMonths: 2,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {!hideOnlyComparativePeriod && (
                                    <div className="flex-1">
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
                                                    onChange={(dates) =>
                                                        setDateRange2({
                                                            startDate: dates?.[0] || null,
                                                            endDate: dates?.[1] || null,
                                                        })
                                                    }
                                                    options={{
                                                        mode: 'range',
                                                        dateFormat: 'j-M-Y', // format like 1-May-2024
                                                        showMonths: 2,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-4 mt-6">
                                <FilterButton  />
                                <FilterClearButton onClick={clearFilter} />
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
