import LoadingSpinner from "@components/LoadingSpinner.jsx";
import React from "react";
import { formatNumberWithCommas } from "@helpers/formatters.js";

const TopSellingReport = ({ data, isLoading, isActive }) => {
    if (!isActive) {
        return null;
    }

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            <div className="p-4 bg-white mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
                <div className="mb-6 overflow-auto  max-h-[800px]">
                    <table className="w-full border-collapse">
                        <thead
                            style={{
                                backgroundColor: "#383853",
                                color: "white",
                                position: "sticky",
                                top: 0,
                                zIndex: 10
                            }}
                        >
                        <tr className="text-white">


                            <th
                                className="bg-blue-200 border border-gray-300 p-2 text-center sticky left-0 z-30 top-0 bg-[#383853]"
                                style={{
                                    width: '120px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                Date
                            </th>

                            <th className="bg-blue-200 border border-gray-300 p-2 text-center  "
                                style={{
                                    width: '120px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>Hour
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center "
                                style={{
                                    width: '120px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>Minutes
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center" style={{
                                width: '120px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>Product 1
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center" style={{
                                width: '100px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>Qty 1
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center" style={{
                                width: '120px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>Revenue 1
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center" style={{
                                width: '120px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>Product 2
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center" style={{
                                width: '100px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>Qty 2
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center" style={{
                                width: '120px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>Revenue 2
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center" style={{
                                width: '120px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>Product 3
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center" style={{
                                width: '100px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>Qty 3
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center" style={{
                                width: '120px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>Revenue 3
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center" style={{
                                width: '120px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>Product 4
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center" style={{
                                width: '100px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>Qty 4
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center" style={{
                                width: '120px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>Revenue 4
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center" style={{
                                width: '120px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>Product 5
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center" style={{
                                width: '100px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>Qty 5
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center" style={{
                                width: '120px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>Revenue 5
                            </th>
                        </tr>

                        </thead>
                        <tbody>
                        {data &&
                            data.length > 0 &&
                            data?.map((item, index) => (
                                <React.Fragment key={`source-${index}`}>
                                    <tr
                                        className={`dark:text-gray-200 dark:bg-bodybg text-black ${
                                            item.hour === "Total" ? "bg-[#949eb7] font-bold" : ""
                                        }`}
                                    >
                                        <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-center text-black sticky  left-0  z-35   bg-white ">
                                            {item.creation_date}
                                        </td>
                                        <td className="border border-gray-300 p-2 text-center dark:text-gray-200 dark:bg-bodybg text-black">
                                            {item.hour}
                                        </td>
                                        <td className="border border-gray-300 p-2 text-center dark:text-gray-200 dark:bg-bodybg text-black ">
                                            {item.minute_chunk}
                                        </td>
                                        <td className="border border-gray-300 p-2 text-center dark:text-gray-200 dark:bg-bodybg text-black bg-warning/10">
                                            {item.product_1}
                                        </td>
                                        <td className="border border-gray-300 p-2 text-center dark:text-gray-200 dark:bg-bodybg text-black bg-warning/10">
                                            {item.qty_1}
                                        </td>
                                        <td className="border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black font-bold bg-warning/10">
                                            {formatNumberWithCommas(item.revenue_1)}
                                        </td>
                                        <td className="border border-gray-300 p-2 text-center dark:text-gray-200 dark:bg-bodybg text-black">
                                            {item.product_2}
                                        </td>
                                        <td className="border border-gray-300 p-2 text-center dark:text-gray-200 dark:bg-bodybg text-black">
                                            {item.qty_2}
                                        </td>
                                        <td className="border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black font-bold">
                                            {formatNumberWithCommas(item.revenue_2)}
                                        </td>
                                        <td className="border border-gray-300 p-2 text-center dark:text-gray-200 dark:bg-bodybg text-black  bg-warning/10">
                                            {item.product_3}
                                        </td>
                                        <td className="border border-gray-300 p-2 text-center dark:text-gray-200 dark:bg-bodybg text-black  bg-warning/10">
                                            {item.qty_3}
                                        </td>
                                        <td className="border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black font-bold  bg-warning/10">
                                            {formatNumberWithCommas(item.revenue_3)}
                                        </td>
                                        <td className="border border-gray-300 p-2 text-center dark:text-gray-200 dark:bg-bodybg text-black ">
                                            {item.product_4}
                                        </td>
                                        <td className="border border-gray-300 p-2 text-center dark:text-gray-200 dark:bg-bodybg text-black">
                                            {item.qty_4}
                                        </td>
                                        <td className="border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black font-bold">
                                            {formatNumberWithCommas(item.revenue_4)}
                                        </td>
                                        <td className="border border-gray-300 p-2 text-center dark:text-gray-200 dark:bg-bodybg text-black  bg-warning/10">
                                            {item.product_5}
                                        </td>
                                        <td className="border border-gray-300 p-2 text-center dark:text-gray-200 dark:bg-bodybg text-black  bg-warning/10">
                                            {item.qty_5}
                                        </td>
                                        <td className="border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black font-bold bg-warning/10">
                                            {formatNumberWithCommas(item.revenue_5)}
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default TopSellingReport;
