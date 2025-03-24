// import React, { useState, useEffect } from 'react';
// import { fetchSaleMtdLdDataLD, fetchSaleMtdLdDataMT } from "../../services/wiseside_services.js";
// import { formatNumberWithCommas } from "@helpers/formatters.js";
// const SalesDataTable  = () => {
//     const [lastDayData, setLastDayData] = useState([]);
//     const [mtdData, setMtdData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const lastDayResult = await fetchSaleMtdLdDataLD('2025-03-19');
//                 const mtdResult = await fetchSaleMtdLdDataMT('2025-03-19');
//
//                 setLastDayData(lastDayResult);
//                 setMtdData(mtdResult);
//                 setLoading(false);
//             } catch (error) {
//                 setError("Error fetching sales data");
//                 setLoading(false);
//                 console.error("Error fetching sales data:", error);
//             }
//         };
//         fetchData();
//     }, []);
//
//     const getRowBgColor = (type, isHeader) => {
//         if (isHeader) {
//             switch (type) {
//                 case "A-Class":
//                 case "North":
//                 case "South":
//                 case "Online":
//                     return "bg-blue-100";
//                 case "Total":
//                     return "bg-blue-200";
//                 default:
//                     return "bg-white";
//             }
//         }
//         return "bg-white";
//     };
//
//     const getTextStyle = (isHeader) => {
//         return isHeader ? "font-bold text-blue-800" : "";
//     };
//
//     const handleData = (value) => {
//         return value ? value : "0";
//     };
//
//     const renderTable = (data,title) => {
//         return (
//             <div className="mt-4 bg-white p-4 shadow-lg">
//                 <h2 className="text-left text-xl font-bold">{title}</h2>
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full bg-white border-collapse">
//                         <thead className="bg-gray-800 text-white">
//                         <tr style={{ backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white" }}>
//                             <th className="py-2 px-4 border border-gray-400 p-2 text-center sticky left-0 z-50 top-0">SaleType (Map)</th>
//                             <th colSpan="2" className="py-2 px-2 border border-gray-400 p-2 text-center">Full Price</th>
//                             <th colSpan="2" className="py-2 px-2 border border-gray-400 p-2 text-center">Discounted</th>
//                             <th colSpan="2" className="py-2 px-2 border border-gray-400 p-2 text-center">Total</th>
//                         </tr>
//                         <tr style={{ backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white" }}>
//                             <th className="py-2 px-4 border border-gray-400 p-2 text-center">Store Name</th>
//                             <th className="py-2 px-4 border border-gray-400 p-2 text-center font-bold">Sale Qty</th>
//                             <th className="py-2 px-4 border border-gray-400 p-2 text-center">Sale Value</th>
//                             <th className="py-2 px-4 border border-gray-400 p-2 text-center">Sale Qty</th>
//                             <th className="py-2 px-4 border border-gray-400 p-2 text-center">Sale Value</th>
//                             <th className="py-2 px-4 border border-gray-400 p-2 text-center">Sale Qty</th>
//                             <th className="py-2 px-4 border border-gray-400 p-2 text-center">Sale Value</th>
//                         </tr>
//                         </thead>
//                         <tbody>
//                         {data?.classifications?.map((classification) => {
//
//                             return (
//                                 <>
//                                     <tr key={classification.classification_name}>
//                                         <td className={`px-2 py-1 border border-gray-300  bg-gray-200 ${getTextStyle(true)}`}>
//                                             {(classification.classification_name)}
//                                         </td>
//
//                                         <td className={`px-4 py-1 border border-gray-300  font-bold bg-gray-200 text-right ` }>
//                                             {formatNumberWithCommas(classification.fullprice_sale_qty)}
//                                         </td>
//                                         <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right`}>
//                                             {formatNumberWithCommas(classification.fullprice_sale_value)}
//                                         </td>
//                                         <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right`}>
//                                             {formatNumberWithCommas(classification.discounted_sale_qty)}
//                                         </td>
//                                         <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right `}>
//                                             {formatNumberWithCommas(classification.discounted_sale_value)}
//                                         </td>
//                                         <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right`}>
//                                             {formatNumberWithCommas(classification.total_sale_qty)}
//                                         </td>
//                                         <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right`}>
//                                             {formatNumberWithCommas(classification.total_sale_value)}
//                                         </td>
//
//
//                                     </tr>
//                                     {classification.regions?.map((region) => (
//                                         <>
//                                             <tr key={region.region}>
//                                                 <td className={`px-6 py-1  border border-gray-300 font-bold bg-gray-200 ${getTextStyle(true)}`}>
//                                                     {region.region}
//                                                 </td>
//
//                                                 <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right `}>
//                                                     {formatNumberWithCommas(region.fullprice_sale_qty)}
//                                                 </td>
//                                                 <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right  `}>
//                                                     {formatNumberWithCommas(region.fullprice_sale_value)}
//                                                 </td>
//                                                 <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right `}>
//                                                     {formatNumberWithCommas(region.discounted_sale_qty)}
//                                                 </td>
//                                                 <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right  `}>
//                                                     {formatNumberWithCommas(region.discounted_sale_value)}
//                                                 </td>
//                                                 <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right `}>
//                                                     {formatNumberWithCommas(region.total_sale_qty)}
//                                                 </td>
//                                                 <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right `}>
//                                                     {formatNumberWithCommas(region.total_sale_value)}
//                                                 </td>
//                                             </tr>
//                                             {region.stores?.map((store) => {
//                                                 return (
//                                                     <tr key={store.store_name}>
//                                                         <td className={`px-8 py-1 border border-gray-300  ${getTextStyle(false)}`}>
//                                                             {(handleData(store.store_name))}
//                                                         </td>
//                                                         <td className="px-4 py-1 text-right border border-gray-300">{formatNumberWithCommas(handleData(store.fullprice_sale_qty))}</td>
//                                                         <td className="px-4 py-1 text-right border border-gray-300">{formatNumberWithCommas(handleData(store.fullprice_sale_value))}</td>
//                                                         <td className="px-4 py-1 text-right border border-gray-300">{formatNumberWithCommas(handleData(store.discounted_sale_qty))}</td>
//                                                         <td className="px-4 py-1 text-right border border-gray-300">{formatNumberWithCommas(handleData(store.discounted_sale_value))}</td>
//                                                         <td className="px-4 py-1 text-right border border-gray-300">{formatNumberWithCommas(handleData(store.total_sale_qty))}</td>
//                                                         <td className="px-4 py-1 text-right border border-gray-300">{formatNumberWithCommas(handleData(store.total_sale_value))}</td>
//                                                     </tr>
//                                                 )
//                                             })}
//                                         </>
//                                     ))}
//
//                                 </>
//                             )
//                         })
//                         }
//
//                         <tr>
//                             <td className={`px-4 py-1 border border-gray-300 bg-gray-200  font-bold ${getTextStyle(true)}`}>
//                                 Total
//                             </td>
//
//                             <td className={`px-4 py-1 border border-gray-300 bg-gray-200 text-right font-bold`}>
//                                 {(data?.overall_fullprice_sale_qty)}
//                             </td>
//                             <td className={`px-4 py-1 border border-gray-300 bg-gray-200 text-right  font-bold`}>
//                                 {formatNumberWithCommas(data?.overall_fullprice_sale_value)}
//                             </td>
//                             <td className={`px-4 py-1 border border-gray-300 bg-gray-200 text-right  font-bold`}>
//                                 {formatNumberWithCommas(data?.overall_discounted_sale_qty)}
//                             </td>
//                             <td className={`px-4 py-1 border border-gray-300 bg-gray-200 text-right  font-bold`}>
//                                 {formatNumberWithCommas(data?.overall_discounted_sale_value)}
//                             </td>
//                             <td className={`px-4 py-1 border border-gray-300 bg-gray-200 text-right   font-bold`}>
//                                 {formatNumberWithCommas(data?.overall_total_sale_qty)}
//                             </td>
//                             <td className={`px-4 py-1 border border-gray-300 bg-gray-200 text-right  font-bold`}>
//                                 {formatNumberWithCommas(data?.overall_total_sale_value)}
//                             </td>
//
//
//                         </tr>
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         );
//     };
//
//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>{error}</div>;
//
//     return (
//         <div className="w-full mt-4 p-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//
//                 {renderTable(lastDayData, "Last Day")}
//                 {renderTable(mtdData, "MTD")}
//
//             </div>
//         </div>
//     );
// };
//
// export default SalesDataTable ;

import React, { useState, useEffect } from 'react';
import { fetchSaleMtdLdDataLD, fetchSaleMtdLdDataMT } from "../../services/wiseside_services.js";
import { formatNumberWithCommas } from "@helpers/formatters.js";

const SalesDataTable = () => {
    const [lastDayData, setLastDayData] = useState([]);
    const [mtdData, setMtdData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const lastDayResult = await fetchSaleMtdLdDataLD('2025-03-19');
                const mtdResult = await fetchSaleMtdLdDataMT('2025-03-19');

                setLastDayData(lastDayResult);
                setMtdData(mtdResult);
                setLoading(false);
            } catch (error) {
                setError("Error fetching sales data");
                setLoading(false);
                console.error("Error fetching sales data:", error);
            }
        };
        fetchData();
    }, []);

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

    const renderTable = (data, title) => {
        return (
            <div className="mt-4 bg-white p-4 shadow-lg">
                <h2 className="text-left text-xl font-bold">{title}</h2>
                <div className="relative overflow-hidden">
                    <div className="overflow-auto max-h-96" style={{maxHeight: "660px"}}>
                        <table className="min-w-full bg-white border-collapse">
                            <thead className="bg-gray-800 text-white sticky top-0  left-0 z-50">
                            <tr style={{backgroundColor: "#0b3588", color: "white"}}>
                                <th className="py-2 px-4 border border-gray-400 text-center  bg-blue-900 sticky left-0 z-50 top-0"
                                    style={{backgroundColor: "#0b3588", color: "white", minWidth: "250px"}}>SaleType
                                    (Map)
                                </th>
                                <th colSpan="2" className="py-2 px-2 border border-gray-400 text-center">Full Price</th>
                                <th colSpan="2" className="py-2 px-2 border border-gray-400 text-center">Discounted</th>
                                <th colSpan="2" className="py-2 px-2 border border-gray-400 text-center">Total</th>
                            </tr>
                            <tr style={{backgroundColor: "#0b3588", color: "white"}}>
                                <th className="py-2 px-4 border border-gray-400 text-center  bg-blue-900 sticky left-0 z-50 top-0"
                                    style={{backgroundColor: "#0b3588", color: "white", minWidth: "250px"}}>Store Name
                                </th>
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
                                return (
                                    <React.Fragment key={classification.classification_name}>
                                        <tr>
                                            <td className={`px-2 py-1 border border-gray-300 bg-gray-200 ${getTextStyle(true)} sticky top-0 left-0 z-10`}>
                                                {(classification.classification_name)}
                                            </td>
                                            <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right`}>
                                                {formatNumberWithCommas(classification.fullprice_sale_qty)}
                                            </td>
                                            <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right`}>
                                                {formatNumberWithCommas(classification.fullprice_sale_value)}
                                            </td>
                                            <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right`}>
                                                {formatNumberWithCommas(classification.discounted_sale_qty)}
                                            </td>
                                            <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right`}>
                                                {formatNumberWithCommas(classification.discounted_sale_value)}
                                            </td>
                                            <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right`}>
                                                {formatNumberWithCommas(classification.total_sale_qty)}
                                            </td>
                                            <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right`}>
                                                {formatNumberWithCommas(classification.total_sale_value)}
                                            </td>
                                        </tr>
                                        {classification.regions?.map((region) => (
                                            <React.Fragment key={region.region}>
                                                <tr>
                                                    <td className={`px-6 py-1 border border-gray-300 font-bold bg-gray-200 ${getTextStyle(true)} sticky left-0 z-10  top-0`}>
                                                        {region.region}
                                                    </td>
                                                    <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right`}>
                                                        {formatNumberWithCommas(region.fullprice_sale_qty)}
                                                    </td>
                                                    <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right`}>
                                                        {formatNumberWithCommas(region.fullprice_sale_value)}
                                                    </td>
                                                    <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right`}>
                                                        {formatNumberWithCommas(region.discounted_sale_qty)}
                                                    </td>
                                                    <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right`}>
                                                        {formatNumberWithCommas(region.discounted_sale_value)}
                                                    </td>
                                                    <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right`}>
                                                        {formatNumberWithCommas(region.total_sale_qty)}
                                                    </td>
                                                    <td className={`px-4 py-1 border border-gray-300 font-bold bg-gray-200 text-right`}>
                                                        {formatNumberWithCommas(region.total_sale_value)}
                                                    </td>
                                                </tr>
                                                {region.stores?.map((store) => {
                                                    return (
                                                        <tr key={store.store_name}>
                                                            <td className={`px-8 py-1 border border-gray-300 ${getTextStyle(false)} sticky left-0 z-10 top-0 bg-white`}>
                                                                {(handleData(store.store_name))}
                                                            </td>
                                                            <td className="px-4 py-1 text-right border border-gray-300">{formatNumberWithCommas(handleData(store.fullprice_sale_qty))}</td>
                                                            <td className="px-4 py-1 text-right border border-gray-300">{formatNumberWithCommas(handleData(store.fullprice_sale_value))}</td>
                                                            <td className="px-4 py-1 text-right border border-gray-300">{formatNumberWithCommas(handleData(store.discounted_sale_qty))}</td>
                                                            <td className="px-4 py-1 text-right border border-gray-300">{formatNumberWithCommas(handleData(store.discounted_sale_value))}</td>
                                                            <td className="px-4 py-1 text-right border border-gray-300">{formatNumberWithCommas(handleData(store.total_sale_qty))}</td>
                                                            <td className="px-4 py-1 text-right border border-gray-300">{formatNumberWithCommas(handleData(store.total_sale_value))}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </React.Fragment>
                                        ))}
                                    </React.Fragment>
                                )
                            })}
                            <tr>
                                <td className={`px-4 py-1 border border-gray-300 bg-gray-200 font-bold ${getTextStyle(true)} sticky left-0 z-10 top-0`}>
                                    Total
                                </td>
                                <td className={`px-4 py-1 border border-gray-300 bg-gray-200 text-right font-bold`}>
                                    {(data?.overall_fullprice_sale_qty)}
                                </td>
                                <td className={`px-4 py-1 border border-gray-300 bg-gray-200 text-right font-bold`}>
                                    {formatNumberWithCommas(data?.overall_fullprice_sale_value)}
                                </td>
                                <td className={`px-4 py-1 border border-gray-300 bg-gray-200 text-right font-bold`}>
                                    {formatNumberWithCommas(data?.overall_discounted_sale_qty)}
                                </td>
                                <td className={`px-4 py-1 border border-gray-300 bg-gray-200 text-right font-bold`}>
                                    {formatNumberWithCommas(data?.overall_discounted_sale_value)}
                                </td>
                                <td className={`px-4 py-1 border border-gray-300 bg-gray-200 text-right font-bold`}>
                                    {formatNumberWithCommas(data?.overall_total_sale_qty)}
                                </td>
                                <td className={`px-4 py-1 border border-gray-300 bg-gray-200 text-right font-bold`}>
                                    {formatNumberWithCommas(data?.overall_total_sale_value)}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-4 text-xs text-danger text-left  mb-4 ml-4 font-bold">
                    <p>*Omni Added in E-Store and Excluded from B&M.
                    </p>
                </div>
            </div>
        );
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="w-full mt-4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 top-0">
                {renderTable(lastDayData, "Last Day")}
                {renderTable(mtdData, "MTD")}
            </div>

        </div>
    );
};

export default SalesDataTable;