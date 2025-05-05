import React, {useState, useMemo, useRef, useEffect} from "react";
import { Link } from "react-router-dom";

import PageHeader from "../../layouts/includes/PageHeader.jsx";

import useFilters from "@hooks/useFilters.js";

import StoreWise from "../components/DailySalesReport/WiseSide.jsx";
import FilterButton from "@components/form/FilterButton.jsx";
import FormInput from "@components/form/FormInput.jsx";
import DailyTargetAchievementOnline from "@modules/DailyReport/components/DailySalesReport/DailyTargetAchievementOnline.jsx";
import OnlineGrossSaleBeforeReturn from "@modules/DailyReport/components/DailySalesReport/ OnlineGrossSaleBeforeReturn.jsx";
import CYVsLYGrowth from "@modules/DailyReport/components/DailySalesReport/CYVsLYGrowth.jsx";
import DailySalesReportStoreWise from "@modules/DailyReport/components/DailySalesReport/DailySalesReportStoreWise.jsx";
import {
    downloadDailySaleReport,
    fetchGrossSaleBeforeReturnData,
    fetchSaleCvVsLyData, fetchSaleMtdLdDataLD, fetchSaleMtdLdDataMT,
    fetchStoreWiseSaleData,
    fetchTargetSaleData
} from "@modules/DailyReport/services/wiseside_services.js";


const DailySaleReportList = () => {
    const [activeTab, setActiveTab] = useState("DailySaleReportList");
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expand, setExpand] = useState(true);

    const [table1, setTable1] = useState({});
    const [table2, setTable2] = useState([]);
    const [table3, setTable3] = useState([]);
    const [table4, setTable4] = useState([]);

    const [table5, setTable5] = useState([]);
    const [table6, setTable6] = useState([]);

    const storeWiseRef = useRef();

    const getTodayDate = () => new Date().toISOString().slice(0, 10);
    const getYesterdayDate = () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().slice(0, 10);
    };

    const { control, handleSubmit, errors, getFilters } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: "date_from", defaultValue: getYesterdayDate() },
                    { name: "date_to", defaultValue: getTodayDate() },
                ],
            }),
            []
        )
    );

    const [filters, setFilters] = useState(getFilters());

    const onSubmit = async (formData) => {
        setLoading(true);
        setTimeout(() => {
            setFilters(formData);
            setLoading(false);
        }, 1000);
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchStoreWiseSaleData(filters?.date_from, filters);
            setTable1(data || {});

            const lastDayResult = await fetchSaleMtdLdDataLD(filters.date_from);
            const mtdResult = await fetchSaleMtdLdDataMT(filters.date_from);

            setTable5(lastDayResult);
            setTable6(mtdResult);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to fetch data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const parseDate = (dateStr) => {
        const [year, month, day] = dateStr.split("-");
        return new Date(year, month - 1, day);
    };

    const formatApiDate = (dayNumber) => {
        const day = dayNumber.toString();
        return `${day}`;
    };

    const [isDownloading, setIsDownloading] = useState(false);

    const downloadPDF = async (filters) => {
        try {
            setIsDownloading(true)
            const pdfData = await downloadDailySaleReport(filters);
            const blob = new Blob([pdfData], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'daily_sale_report.pdf';
            link.click();
        } catch (error) {
            console.error('Error downloading PDF:', error);
        }finally {
            setIsDownloading(false)
        }
    };

    useEffect(() => {
        fetchData();

        if (filters.date_from && filters.date_to) {
            setLoading(true);

            fetchTargetSaleData(filters.date_from, filters)
                .then((apiData) => {
                    const startDate = parseDate(filters.date_from);
                    const endDate = parseDate(filters.date_to);

                    const filtered = apiData.filter((row) => {
                        const rowDate = parseDate(formatApiDate(row.date));
                        return rowDate >= startDate && rowDate <= endDate;
                    });

                    const computed = filtered.map((row) => {
                        const fullPriceOfflineAch = calcAch(row.fullPriceOfflineSale, row.fullPriceOfflineTarget);
                        const discountedOfflineAch = calcAch(row.discountedOfflineSale, row.discountedOfflineTarget);
                        const totalOfflineAch = calcAch(row.totalOfflineSale, row.totalOfflineTarget);

                        const fullPriceOnlineAch = calcAch(row.fullPriceOnlineSale, row.fullPriceOnlineTarget);
                        const discountedOnlineAch = calcAch(row.discountedOnlineSale, row.discountedOnlineTarget);
                        const totalOnlineAch = calcAch(row.totalOnlineSale, row.totalOnlineTarget);

                        const totalAch = calcAch(row.totalSale, row.totalTarget);

                        return {
                            ...row,
                            fullPriceOfflineAch,
                            discountedOfflineAch,
                            totalOfflineAch,
                            fullPriceOnlineAch,
                            discountedOnlineAch,
                            totalOnlineAch,
                            totalAch
                        };
                    });

                    setTable2(computed.length > 0 ? computed : apiData);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    setLoading(false);
                });
        }
        if (filters.date_from && filters.date_to) {
            setLoading(true);

            fetchSaleCvVsLyData(filters.date_from, filters)
                .then((responseData) => {
                    setTable3(responseData);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching sales data:", error);
                    setLoading(false);
                });
        }
        if (filters.date_from && filters.date_to) {
            setLoading(true);
            fetchGrossSaleBeforeReturnData(filters.date_from, filters)
                .then((responseData) => {
                    setTable4(responseData);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                    setLoading(false);
                });
        }
    }, [filters]);



const [donwloadData, setDonwloadData] = useState({});


    return (
        <>
            <PageHeader currentpage="Daily Sales Report"  activepage="Report"
                        mainpage="Daily Sales Report"/>


            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="col-span-12">
                    <div
                        className="bg-white flex flex-col md:flex-row md:items-center md:justify-between px-3 sm:px-4 py-3 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg">
                        <nav className="flex flex-col sm:flex-row sm:space-x-2 overflow-x-auto">
                            {[
                                {tab: "DailySaleReportList", label: "Store Wise"},
                                {tab: "OnlineAndBM", label: "Daily Target Achievement"},
                                {tab: "Return", label: "CY Vs LY Growth"},
                                {tab: "GrossReturn", label: "Online (Gross Sale before Return)"},
                                {tab: "DailySales", label: "Daily Sales Report - Store Wise"},
                            ].map(({tab, label}) => (
                                <Link
                                    key={tab}
                                    to="#"
                                    className={`whitespace-nowrap m-1 border cursor-pointer text-defaulttextcolor dark:text-defaulttextcolor/70 py-2 px-3 text-[0.75rem] font-medium rounded-md ${
                                        activeTab === tab
                                            ? "bg-primary text-white"
                                            : "bg-gray-200 dark:text-gray-200 dark:bg-bodybg"
                                    }`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {label}
                                </Link>
                            ))}
                        </nav>

                        <div className="flex flex-wrap justify-center md:justify-end gap-2 mt-2 md:mt-0">
                            {(activeTab === "DailySaleReportList" || activeTab === "DailySales") && (
                                <button
                                    onClick={() => setExpand(!expand)}
                                    type="button"
                                    className="ti-btn bg-primary text-white font-medium text-sm rounded py-2 px-3"
                                >
                                    <i className={expand ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}></i>
                                    {expand ? "Collapse" : "Expand All"}
                                </button>
                            )}

                            <button
                                type="button"
                                className="ti-btn bg-primary text-white font-medium text-sm rounded py-2 px-3"
                                onClick={() => downloadPDF(filters)}
                                disabled={isDownloading}
                            >
                                <i className={`bi bi-file-earmark-pdf ${isDownloading ? "spin" : ""} text-lg`}></i>
                                {isDownloading ? "" : "PDF"}
                            </button>

                            <button
                                type="button"
                                className="ti-btn bg-primary text-white font-medium text-sm rounded py-2 px-3"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <i className="ri-filter-3-fill inline-block"></i> Filters
                            </button>
                        </div>
                    </div>

                    <div className="text-primary p-2 rounded-lg text-right text-black">
                        <p>Amount in Rs</p>
                    </div>

                    {showFilters && (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div
                                className="bg-white p-3 mt-2 rounded-lg shadow-md flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 dark:text-gray-200 dark:bg-bodybg">
                                <FormInput
                                    type="date"
                                    name="date_from"
                                    control={control}
                                    errors={errors}
                                    defaultValue={filters.date_from}
                                    label={true}
                                />
                                <FilterButton/>
                            </div>
                        </form>
                    )}

                    {activeTab === "DailySaleReportList" && (
                        <StoreWise {...{filters, newData: table1, error, loading, expand, setDonwloadData}} />
                    )}
                    {activeTab === "OnlineAndBM" && (
                        <DailyTargetAchievementOnline data={table2} loading={loading}
                                                      setDonwloadData={setDonwloadData}/>
                    )}
                    {activeTab === "Return" && (
                        <CYVsLYGrowth data={table3} loading={loading} setDonwloadData={setDonwloadData}/>
                    )}
                    {activeTab === "GrossReturn" && (
                        <OnlineGrossSaleBeforeReturn data={table4} loading={loading} setDonwloadData={setDonwloadData}/>
                    )}
                    {activeTab === "DailySales" && (
                        <DailySalesReportStoreWise
                            lastDayData={table5}
                            mtdData={table6}
                            loading={loading}
                            error={error}
                            expand={expand}
                            setDonwloadData={setDonwloadData}
                            filters={filters}
                        />
                    )}
                </div>
            </div>

        </>
    );
};

export default DailySaleReportList;
