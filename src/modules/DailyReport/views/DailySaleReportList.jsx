import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import PageHeader from "../../layouts/includes/PageHeader.jsx";
import useFilters from "@hooks/useFilters.js";
import FormInput from "@components/form/FormInput.jsx";
import FilterButton from "@components/form/FilterButton.jsx";
import IconTabs from "@components/IconTabs.jsx";

import StoreWise from "../components/DailySalesReport/WiseSide.jsx";
import DailyTargetAchievementOnline from "@modules/DailyReport/components/DailySalesReport/DailyTargetAchievementOnline.jsx";
import OnlineGrossSaleBeforeReturn from "@modules/DailyReport/components/DailySalesReport/ OnlineGrossSaleBeforeReturn.jsx";
import CYVsLYGrowth from "@modules/DailyReport/components/DailySalesReport/CYVsLYGrowth.jsx";
import DailySalesReportStoreWise from "@modules/DailyReport/components/DailySalesReport/DailySalesReportStoreWise.jsx";

import {
    fetchStoreWiseSaleData,
    fetchTargetSaleData,
    downloadDailySaleReport,
    fetchSaleMtdLdDataLD,
    fetchSaleMtdLdDataMT,
    fetchSaleCvVsLyData,
    fetchGrossSaleBeforeReturnData
} from "@modules/DailyReport/services/wiseside_services.js";

import LoadingSpinner from "@components/LoadingSpinner.jsx";

const DailySaleReportList = () => {
    const [activeTab, setActiveTab] = useState("storeWise");
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expand, setExpand] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const [donwloadData, setDonwloadData] = useState({});

    const [table1, setTable1] = useState({});
    const [table2, setTable2] = useState([]);
    const [table3, setTable3] = useState([]);
    const [table4, setTable4] = useState([]);
    const [table5, setTable5] = useState([]);
    const [table6, setTable6] = useState([]);

    const getTodayDate = () => new Date().toISOString().slice(0, 10);
    const getYesterdayDate = () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().slice(0, 10);
    };

    const { control, handleSubmit, errors, getFilters } = useFilters(
        useMemo(() => ({
            initialFilters: [
                { name: "date_from", defaultValue: getYesterdayDate() },
                { name: "date_to", defaultValue: getTodayDate() },
            ]
        }), [])
    );
    const [filters, setFilters] = useState(getFilters());

    const onSubmit = useCallback((formData) => {
        setFilters(formData);
    }, []);

    const downloadPDF = async (filters) => {
        try {
            setIsDownloading(true);
            const pdfData = await downloadDailySaleReport(filters);
            const blob = new Blob([pdfData], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'daily_sale_report.pdf';
            link.click();
        } catch (error) {
            console.error('Error downloading PDF:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    const parseDate = (dateStr) => {
        const [year, month, day] = dateStr.split("-");
        return new Date(year, month - 1, day);
    };
    const formatApiDate = (dayNumber) => dayNumber.toString();
    const calcAch = (sale, target) => target === 0 ? 0 : ((sale / target) * 100).toFixed(2);

    useEffect(() => {
        if (!filters.date_from || !filters.date_to) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [storeData, lastDayData, mtdData] = await Promise.all([
                    fetchStoreWiseSaleData(filters.date_from, filters),
                    fetchSaleMtdLdDataLD(filters.date_from),
                    fetchSaleMtdLdDataMT(filters.date_from)
                ]);
                setTable1(storeData || {});
                setTable5(lastDayData);
                setTable6(mtdData);
            } catch (err) {
                console.error("Error fetching store-wise/mtd/ld data:", err);
                setError("Failed to fetch data. Please try again.");
            }

            try {
                const targetData = await fetchTargetSaleData(filters.date_from, filters);
                const startDate = parseDate(filters.date_from);
                const endDate = parseDate(filters.date_to);
                const filtered = targetData.filter(row => {
                    const rowDate = parseDate(formatApiDate(row.date));
                    return rowDate >= startDate && rowDate <= endDate;
                });

                const computed = filtered.map(row => ({
                    ...row,
                    fullPriceOfflineAch: calcAch(row.fullPriceOfflineSale, row.fullPriceOfflineTarget),
                    discountedOfflineAch: calcAch(row.discountedOfflineSale, row.discountedOfflineTarget),
                    totalOfflineAch: calcAch(row.totalOfflineSale, row.totalOfflineTarget),
                    fullPriceOnlineAch: calcAch(row.fullPriceOnlineSale, row.fullPriceOnlineTarget),
                    discountedOnlineAch: calcAch(row.discountedOnlineSale, row.discountedOnlineTarget),
                    totalOnlineAch: calcAch(row.totalOnlineSale, row.totalOnlineTarget),
                    totalAch: calcAch(row.totalSale, row.totalTarget)
                }));

                setTable2(computed.length > 0 ? computed : targetData);
            } catch (error) {
                console.error("Error fetching target data:", error);
            }

            try {
                const lyData = await fetchSaleCvVsLyData(filters.date_from, filters);
                setTable3(lyData);
            } catch (error) {
                console.error("Error fetching LY data:", error);
            }

            try {
                const grossReturn = await fetchGrossSaleBeforeReturnData(filters.date_from, filters);
                setTable4(grossReturn);
            } catch (error) {
                console.error("Error fetching gross return data:", error);
            }

            setLoading(false);
        };

        fetchData();
    }, [filters]);

    const tabs = [
        {
            id: "storeWise",
            label: "Store Wise",
            icon: <i className="bx bx-store"></i>,
            content: loading ? <LoadingSpinner /> : (
                <StoreWise
                    {...{
                        filters,
                        newData: table1,
                        error,
                        loading,
                        expand,
                        setDonwloadData,
                    }}
                />
            ),
        },
        {
            id: "dailyTarget",
            label: "Daily Target Achievement",
            icon: <i className="bx bx-bullseye"></i>,
            content: loading ? <LoadingSpinner /> : (
                <DailyTargetAchievementOnline
                    data={table2}
                    loading={loading}
                    setDonwloadData={setDonwloadData}
                />
            ),
        },
        {
            id: "cyVsLy",
            label: "CY Vs LY Growth",
            icon: <i className="bx bx-bar-chart-alt-2"></i>,
            content: loading ? <LoadingSpinner /> : (
                <CYVsLYGrowth
                    data={table3}
                    loading={loading}
                    setDonwloadData={setDonwloadData}
                />
            ),
        },
        {
            id: "grossReturn",
            label: "Online (Gross Sale before Return)",
            icon: <i className="bx bx-money-withdraw"></i>,
            content: loading ? <LoadingSpinner /> : (
                <OnlineGrossSaleBeforeReturn
                    data={table4}
                    loading={loading}
                    setDonwloadData={setDonwloadData}
                />
            ),
        },
        {
            id: "dailySales",
            label: "Daily Sales - Store Wise",
            icon: <i className="bx bx-analyse"></i>,
            content: loading ? <LoadingSpinner /> : (
                <DailySalesReportStoreWise
                    lastDayData={table5}
                    mtdData={table6}
                    loading={loading}
                    error={error}
                    expand={expand}
                    setDonwloadData={setDonwloadData}
                    filters={filters}
                />
            ),
        },
    ];


    return (
        <>
            <PageHeader currentpage="Daily Sales Report" activepage="Report" mainpage="Daily Sales Report"/>

            <form onSubmit={handleSubmit(onSubmit)}
                  className="bg-white p-3 mt-2 rounded-lg shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">

                <div className="flex items-center gap-4 flex-1">
                    <FormInput
                        type="date"
                        name="date_from"
                        control={control}
                        errors={errors}
                        defaultValue={filters.date_from}
                        label={false} // match the screenshot style
                        className="w-[200px]" // adjust width if needed
                    />
                </div>

                {/* Right side: Action buttons */}
                <div className="flex items-center gap-2">
                    {(activeTab === "storeWise" || activeTab === "dailySales") && (
                        <button
                            type="button"
                            onClick={() => setExpand(!expand)}
                            className="ti-btn ti-btn-primary !mb-0 items-center gap-1"
                        >
                            <i className={expand ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}></i>
                            <span className="text-sm font-medium">
        {expand ? "Collapse" : "Expand All"}
    </span>
                        </button>

                    )}

                    <FilterButton className="ti-btn ti-btn-primary !mb-0" iconOnly/>


                    <button
                        type="button"
                        onClick={() => downloadPDF(filters)}
                        disabled={isDownloading}
                        className="ti-btn ti-btn-success !mb-0"
                    >
                        <i className={`bi bi-file-earmark-pdf ${isDownloading ? "spin" : ""}`}></i>
                    </button>
                </div>
            </form>


            <div className="text-primary p-2 rounded-lg text-right text-black">
                <p>Amount in Rs</p>
            </div>

            <IconTabs tabs={tabs} onTabChange={setActiveTab}/>
        </>
    );
};

export default DailySaleReportList;




