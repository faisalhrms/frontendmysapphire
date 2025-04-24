import React, { useState, useEffect } from 'react';
import { fetchSaleMtdLdDataLD, fetchSaleMtdLdDataMT } from "../../services/wiseside_services.js";
import { formatNumberWithCommas } from "@helpers/formatters.js";

const SalesDataTable = ({ lastDayData , mtdData , loading , error , expand , filters }) => {
    // const [lastDayData, setLastDayData] = useState([]);
    // const [mtdData, setMtdData] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('en-GB', { month: 'short' });
        const year = date.getFullYear();

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

    const formatNumberWithCommas = (num) => {
        if (num === 0 || num == null) return "-";
        return num.toLocaleString();
    };

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
                <h2 className="text-left text-lg md:text-xl font-bold mb-4 dark:text-gray-200">{title}</h2>

                <div className="relative overflow-hidden">
                    <div className="overflow-x-auto">
                        <div className="max-h-[660px] overflow-y-auto">
                            <table
                                className="min-w-[800px] md:min-w-full border-collapse bg-white dark:text-gray-200 dark:bg-bodybg text-xs md:text-sm">
                                <thead className="sticky top-0 z-50">
                                <tr style={{backgroundColor: "#0b3588", color: "white"}}>
                                    <th className="py-2 px-2 border border-gray-400 text-center sticky left-0 z-50 bg-blue-900 w-[120px] md:w-[200px]">
                                        SaleType (Map)
                                    </th>
                                    <th colSpan="2" className="py-2 px-2 border border-gray-400 text-center">Full
                                        Price
                                    </th>
                                    <th colSpan="2"
                                        className="py-2 px-2 border border-gray-400 text-center">Discounted
                                    </th>
                                    <th colSpan="2" className="py-2 px-2 border border-gray-400 text-center">Total</th>
                                </tr>
                                <tr style={{backgroundColor: "#0b3588", color: "white"}}>
                                    <th className="py-2 px-2 border border-gray-400 text-center font-bold w-[120px] md:w-[200px]">Store
                                        Name
                                    </th>
                                    <th className="py-2 px-2 border border-gray-400 text-center font-bold">Sale Qty</th>
                                    <th className="py-2 px-2 border border-gray-400 text-center">Sale Value</th>
                                    <th className="py-2 px-2 border border-gray-400 text-center">Sale Qty</th>
                                    <th className="py-2 px-2 border border-gray-400 text-center">Sale Value</th>
                                    <th className="py-2 px-2 border border-gray-400 text-center">Sale Qty</th>
                                    <th className="py-2 px-2 border border-gray-400 text-center">Sale Value</th>
                                </tr>
                                </thead>
                                <tbody>
                                {data?.classifications?.map((classification) => (
                                    <React.Fragment key={classification.classification_name}>
                                        {/* Classification Row */}
                                        <tr>
                                            <td
                                                className={`px-2 py-1 border border-gray-300 bg-gray-200 sticky top-0 left-0 z-10 w-[120px] md:w-[200px] whitespace-nowrap ${getTextStyle(true)} cursor-pointer`}
                                                onClick={() => handleRowToggle(classification.classification_name, tableType)}
                                            >
                                                {openRows[classification.classification_name] ? "▼" : "►"} {classification.classification_name}
                                            </td>
                                            <td className="px-2 py-1 border text-right font-bold bg-gray-200">{formatNumberWithCommas(classification.fullprice_sale_qty)}</td>
                                            <td className="px-2 py-1 border text-right font-bold bg-gray-200">{formatNumberWithCommas(classification.fullprice_sale_value)}</td>
                                            <td className="px-2 py-1 border text-right font-bold bg-gray-200">{formatNumberWithCommas(classification.discounted_sale_qty)}</td>
                                            <td className="px-2 py-1 border text-right font-bold bg-gray-200">{formatNumberWithCommas(classification.discounted_sale_value)}</td>
                                            <td className="px-2 py-1 border text-right font-bold bg-gray-200">{formatNumberWithCommas(classification.total_sale_qty)}</td>
                                            <td className="px-2 py-1 border text-right font-bold bg-gray-200">{formatNumberWithCommas(classification.total_sale_value)}</td>
                                        </tr>

                                        {/* Region Rows */}
                                        {openRows[classification.classification_name] &&
                                            classification.regions?.map((region) => (
                                                <React.Fragment key={region.region}>
                                                    <tr onClick={() => handleRowToggle(region.region, tableType)}
                                                        className="cursor-pointer">
                                                        <td className={`px-4 py-1 border bg-gray-100 sticky left-0 z-10 w-[120px] md:w-[200px] whitespace-nowrap ${getTextStyle(true)}`}>
                                                            {openRows[region.region] ? "▼" : "►"} {region.region}
                                                        </td>
                                                        <td className="px-2 py-1 border text-right font-bold bg-gray-100">{formatNumberWithCommas(region.fullprice_sale_qty)}</td>
                                                        <td className="px-2 py-1 border text-right font-bold bg-gray-100">{formatNumberWithCommas(region.fullprice_sale_value)}</td>
                                                        <td className="px-2 py-1 border text-right font-bold bg-gray-100">{formatNumberWithCommas(region.discounted_sale_qty)}</td>
                                                        <td className="px-2 py-1 border text-right font-bold bg-gray-100">{formatNumberWithCommas(region.discounted_sale_value)}</td>
                                                        <td className="px-2 py-1 border text-right font-bold bg-gray-100">{formatNumberWithCommas(region.total_sale_qty)}</td>
                                                        <td className="px-2 py-1 border text-right font-bold bg-gray-100">{formatNumberWithCommas(region.total_sale_value)}</td>
                                                    </tr>

                                                    {/* Store Rows */}
                                                    {openRows[region.region] &&
                                                        region.stores?.map((store) => (
                                                            <tr key={store.store_name}>
                                                                <td className="px-2 py-1 border sticky left-0 z-10 bg-white w-[120px] md:w-[200px] whitespace-nowrap">
                                                                    {handleData(store.store_name)}
                                                                </td>
                                                                <td className="px-2 py-1 border text-right">{formatNumberWithCommas(handleData(store.fullprice_sale_qty))}</td>
                                                                <td className="px-2 py-1 border text-right">{formatNumberWithCommas(handleData(store.fullprice_sale_value))}</td>
                                                                <td className="px-2 py-1 border text-right">{formatNumberWithCommas(handleData(store.discounted_sale_qty))}</td>
                                                                <td className="px-2 py-1 border text-right">{formatNumberWithCommas(handleData(store.discounted_sale_value))}</td>
                                                                <td className="px-2 py-1 border text-right">{formatNumberWithCommas(handleData(store.total_sale_qty))}</td>
                                                                <td className="px-2 py-1 border text-right">{formatNumberWithCommas(handleData(store.total_sale_value))}</td>
                                                            </tr>
                                                        ))}
                                                </React.Fragment>
                                            ))}
                                    </React.Fragment>
                                ))}

                                {/* Total Row */}
                                <tr>
                                    <td className="px-2 py-1 border font-bold sticky left-0 bg-gray-200 w-[120px] md:w-[200px] whitespace-nowrap">{`Total`}</td>
                                    <td className="px-2 py-1 border text-right font-bold bg-gray-200">{formatNumberWithCommas(data?.overall_fullprice_sale_qty)}</td>
                                    <td className="px-2 py-1 border text-right font-bold bg-gray-200">{formatNumberWithCommas(data?.overall_fullprice_sale_value)}</td>
                                    <td className="px-2 py-1 border text-right font-bold bg-gray-200">{formatNumberWithCommas(data?.overall_discounted_sale_qty)}</td>
                                    <td className="px-2 py-1 border text-right font-bold bg-gray-200">{formatNumberWithCommas(data?.overall_discounted_sale_value)}</td>
                                    <td className="px-2 py-1 border text-right font-bold bg-gray-200">{formatNumberWithCommas(data?.overall_total_sale_qty)}</td>
                                    <td className="px-2 py-1 border text-right font-bold bg-gray-200">{formatNumberWithCommas(data?.overall_total_sale_value)}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="mt-4 text-xs text-danger font-bold ml-2 dark:text-gray-200">
                    <p>*Omni Added in E-Store and Excluded from B&M.</p>
                </div>
            </div>


        );
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="w-full px-2 sm:px-4 py-4 dark:text-gray-200 dark:bg-bodybg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 dark:text-gray-200 dark:bg-bodybg">
                {renderTable(lastDayData, `Last Day (${formatDate(filters?.date_from)})`, "lastDay")}
                {renderTable(mtdData, "MTD", "mtd")}
            </div>
        </div>


    );
};

export default SalesDataTable;
