import React, { useState, useEffect } from 'react';
import { fetchSaleMtdLdDataLD, fetchSaleMtdLdDataMT } from "../../services/wiseside_services.js";
import { formatNumberWithCommas } from "@helpers/formatters.js";

const SalesDataTable = ({ filters , expand }) => {
    const [lastDayData, setLastDayData] = useState([]);
    const [mtdData, setMtdData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log(filters?.date_from)

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0'); // Ensure day is always two digits
        const month = date.toLocaleString('en-GB', { month: 'short' }); // Get month in short form
        const year = date.getFullYear(); // Get the full year

        return `${day}-${month}-${year}`;
    };

    const [openRowsLastDay, setOpenRowsLastDay] = useState({
        "A-Class": true,
        FOL:true,
        North: true,
        South: true,
        Central: true,
    });

    const [openRowsMTD, setOpenRowsMTD] = useState({
        "A-Class": true,
        North: true,
        South: true,
        Central: true,
        FOL:true,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (filters.date_from && filters.date_to) {
                    setLoading(true);

                    const lastDayResult = await fetchSaleMtdLdDataLD(filters.date_from);
                    const mtdResult = await fetchSaleMtdLdDataMT(filters.date_from);

                    setLastDayData(lastDayResult);
                    setMtdData(mtdResult);
                    setLoading(false);
                }
            } catch (error) {
                setError("Error fetching sales data");
                setLoading(false);
                console.error("Error fetching sales data:", error);
            }
        };

        fetchData();
    }, [filters.date_from, filters.date_to]);

    const getRowBgColor = (type, isHeader) => {
        if (isHeader) {
            switch (type) {
                case "A-Class":
                case "North":
                case "South":
                case "Online":
                    return "bg-blue-100";
                case "Total":
                    return "bg-blue-200";
                default:
                    return "bg-white";
            }
        }
        return "bg-white";
    };

    const getTextStyle = (isHeader) => {
        return isHeader ? "font-bold text-blue-800" : "";
    };

    const handleData = (value) => {
        return value ? value : "0";
    };

    const handleRowToggle = (region, table) => {
        if (table === "lastDay") {
            console.log(region);
            setOpenRowsLastDay((prev) => ({
                ...prev,
                [region]: !prev[region],
            }));
        } else if (table === "mtd") {
            setOpenRowsMTD((prev) => ({
                ...prev,
                [region]: !prev[region],
            }));
        }
    };

    useEffect(() => {
        if(expand){
            setOpenRowsLastDay({
                "A-Class": true,
                FOL:true,
                North: true,
                South: true,
                Central: true,
            });

            setOpenRowsMTD({
                "A-Class": true,
                FOL:true,
                North: true,
                South: true,
                Central: true,
            })
        }else{
            setOpenRowsLastDay({
                "A-Class": false,
                FOL:false,
                North: false,
                South: false,
                Central: false,
            });

            setOpenRowsMTD({
                "A-Class": false,
                FOL:false,
                North: false,
                South: false,
                Central: false,
            })
        }
    },[expand])



    const renderTable = (data, title, tableType) => {
        const openRows = tableType === "lastDay" ? openRowsLastDay : openRowsMTD;
        return (
            <div className="mt-4 bg-white p-4 shadow-lg dark:text-gray-200 dark:bg-bodybg">
                <h2 className="text-left text-xl font-bold dark:text-gray-200 dark:bg-bodybg">{title}</h2>
                <div className="relative overflow-hidden dark:text-gray-200 dark:bg-bodybg ">
                    <div className="overflow-auto max-h-96 dark:text-gray-200 dark:bg-bodybg" style={{ maxHeight: "660px" }}>
                        <table className="min-w-full bg-white border-collapse dark:text-gray-200 dark:bg-bodybg">
                            <thead className="bg-gray-800 text-white sticky top-0 left-0 z-50">
                            <tr style={{ backgroundColor: "#0b3588", color: "white" }}>
                                <th className="py-2 px-4 border border-gray-400 text-center bg-blue-900 sticky left-0 z-50 top-0"
                                    style={{ backgroundColor: "#0b3588", color: "white", minWidth: "250px" }}>
                                    SaleType (Map)
                                </th>
                                <th colSpan="2" className="py-2 px-2 border border-gray-400 text-center">Full Price</th>
                                <th colSpan="2" className="py-2 px-2 border border-gray-400 text-center">Discounted</th>
                                <th colSpan="2" className="py-2 px-2 border border-gray-400 text-center">Total</th>
                            </tr>
                            <tr style={{ backgroundColor: "#0b3588", color: "white" }}>
                                <th className="py-2 px-4 border border-gray-400 text-center font-bold">Store Name</th>
                                <th className="py-2 px-4 border border-gray-400 text-center font-bold">Sale Qty</th>
                                <th className="py-2 px-4 border border-gray-400 text-center">Sale Value</th>
                                <th className="py-2 px-4 border border-gray-400 text-center">Sale Qty</th>
                                <th className="py-2 px-4 border border-gray-400 text-center">Sale Value</th>
                                <th className="py-2 px-4 border border-gray-400 text-center">Sale Qty</th>
                                <th className="py-2 px-4 border border-gray-400 text-center">Sale Value</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data?.classifications?.map((classification) => {
                                const rw = classification.classification_name;
                                return (
                                    <React.Fragment key={classification.classification_name}>
                                        <tr>
                                            <td
                                                className={`px-2 py-1 border border-gray-300 bg-gray-200 dark:text-gray-200 dark:bg-bodybg ${getTextStyle(true)} sticky top-0 left-0 z-10`}
                                                onClick={() => handleRowToggle(classification.classification_name, tableType)} // Added onClick handler
                                                style={{cursor: 'pointer'}} // Added cursor to indicate interactivity
                                            >
                                                {openRows[classification.classification_name] ? "▼" : "►"} {/* Change based on row state */}
                                                {classification.classification_name}
                                            </td>
                                            <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right dark:text-gray-200 dark:bg-bodybg`}>
                                                {formatNumberWithCommas(classification.fullprice_sale_qty)}
                                            </td>
                                            <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right dark:text-gray-200 dark:bg-bodybg`}>
                                                {formatNumberWithCommas(classification.fullprice_sale_value)}
                                            </td>
                                            <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right dark:text-gray-200 dark:bg-bodybg`}>
                                                {formatNumberWithCommas(classification.discounted_sale_qty)}
                                            </td>
                                            <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right dark:text-gray-200 dark:bg-bodybg`}>
                                                {formatNumberWithCommas(classification.discounted_sale_value)}
                                            </td>
                                            <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right dark:text-gray-200 dark:bg-bodybg`}>
                                                {formatNumberWithCommas(classification.total_sale_qty)}
                                            </td>
                                            <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right dark:text-gray-200 dark:bg-bodybg`}>
                                                {formatNumberWithCommas(classification.total_sale_value)}
                                            </td>
                                        </tr>
                                        {openRows[classification.classification_name]&&classification.regions?.map((region) => (
                                            <React.Fragment key={region.region}>
                                                <tr onClick={() => handleRowToggle(region.region, tableType)}
                                                    style={{cursor: 'pointer'}}>
                                                    <td className={`px-6 py-1 border border-gray-300 font-bold bg-gray-200 dark:text-gray-200 dark:bg-bodybg ${getTextStyle(true)} sticky left-0 z-10 top-0`}>
                                                        {openRows[region.region] ? "▼" : "►"} {region.region}
                                                    </td>

                                                    <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right dark:text-gray-200 dark:bg-bodybg`}>
                                                        {formatNumberWithCommas(region.fullprice_sale_qty)}
                                                    </td>
                                                    <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right dark:text-gray-200 dark:bg-bodybg`}>
                                                        {formatNumberWithCommas(region.fullprice_sale_value)}
                                                    </td>
                                                    <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right dark:text-gray-200 dark:bg-bodybg`}>
                                                        {formatNumberWithCommas(region.discounted_sale_qty)}
                                                    </td>
                                                    <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right dark:text-gray-200 dark:bg-bodybg`}>
                                                        {formatNumberWithCommas(region.discounted_sale_value)}
                                                    </td>
                                                    <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right dark:text-gray-200 dark:bg-bodybg`}>
                                                        {formatNumberWithCommas(region.total_sale_qty)}
                                                    </td>
                                                    <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right dark:text-gray-200 dark:bg-bodybg`}>
                                                        {formatNumberWithCommas(region.total_sale_value)}
                                                    </td>
                                                </tr>
                                                {openRows[region.region] && region.stores?.map((store) => {
                                                    return (
                                                        <tr key={store.store_name}>
                                                            <td className={`px-8 py-1 border border-gray-300 ${getTextStyle(false)} sticky left-0 z-10 top-0 bg-white dark:text-gray-200 dark:bg-bodybg`}>
                                                                {(handleData(store.store_name))}
                                                            </td>
                                                            <td className="px-4 py-1 text-right border border-gray-300 dark:text-gray-200 dark:bg-bodybg">{formatNumberWithCommas(handleData(store.fullprice_sale_qty))}</td>
                                                            <td className="px-4 py-1 text-right border border-gray-300 dark:text-gray-200 dark:bg-bodybg">{formatNumberWithCommas(handleData(store.fullprice_sale_value))}</td>
                                                            <td className="px-4 py-1 text-right border border-gray-300 dark:text-gray-200 dark:bg-bodybg">{formatNumberWithCommas(handleData(store.discounted_sale_qty))}</td>
                                                            <td className="px-4 py-1 text-right border border-gray-300 dark:text-gray-200 dark:bg-bodybg">{formatNumberWithCommas(handleData(store.discounted_sale_value))}</td>
                                                            <td className="px-4 py-1 text-right border border-gray-300 dark:text-gray-200 dark:bg-bodybg">{formatNumberWithCommas(handleData(store.total_sale_qty))}</td>
                                                            <td className="px-4 py-1 text-right border border-gray-300 dark:text-gray-200 dark:bg-bodybg">{formatNumberWithCommas(handleData(store.total_sale_value))}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </React.Fragment>
                                        ))}
                                    </React.Fragment>
                                );
                            })}
                            <tr>
                                <td className={`px-4 py-1 border border-gray-300 bg-gray-200 font-bold dark:text-gray-200 dark:bg-bodybg ${getTextStyle(true)} sticky left-0 z-10 top-0`}>
                                    Total
                                </td>
                                <td className={`px-4 py-1 border border-gray-300 bg-gray-200 text-right font-bold dark:text-gray-200 dark:bg-bodybg`}>
                                    {(data?.overall_fullprice_sale_qty)}
                                </td>
                                <td className={`px-4 py-1 border border-gray-300 bg-gray-200 text-right font-bold dark:text-gray-200 dark:bg-bodybg`}>
                                    {formatNumberWithCommas(data?.overall_fullprice_sale_value)}
                                </td>
                                <td className={`px-4 py-1 border border-gray-300 bg-gray-200 text-right font-bold dark:text-gray-200 dark:bg-bodybg`}>
                                    {formatNumberWithCommas(data?.overall_discounted_sale_qty)}
                                </td>
                                <td className={`px-4 py-1 border border-gray-300 bg-gray-200 text-right font-bold dark:text-gray-200 dark:bg-bodybg`}>
                                    {formatNumberWithCommas(data?.overall_discounted_sale_value)}
                                </td>
                                <td className={`px-4 py-1 border border-gray-300 bg-gray-200 text-right font-bold dark:text-gray-200 dark:bg-bodybg`}>
                                    {formatNumberWithCommas(data?.overall_total_sale_qty)}
                                </td>
                                <td className={`px-4 py-1 border border-gray-300 bg-gray-200 text-right font-bold dark:text-gray-200 dark:bg-bodybg`}>
                                    {formatNumberWithCommas(data?.overall_total_sale_value)}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-4 text-xs text-danger text-left mb-4 ml-4 font-bold dark:text-gray-200 dark:bg-bodybg">
                    <p>*Omni Added in E-Store and Excluded from B&M.</p>
                </div>
            </div>
        );
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="w-full  p-4 dark:text-gray-200 dark:bg-bodybg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 top-0 dark:text-gray-200 dark:bg-bodybg">
                {renderTable(lastDayData, `Last Day  (${formatDate(filters?.date_from)})`, "lastDay")}
                {renderTable(mtdData, "MTD", "mtd")}
            </div>
        </div>
    );
};

export default SalesDataTable;
