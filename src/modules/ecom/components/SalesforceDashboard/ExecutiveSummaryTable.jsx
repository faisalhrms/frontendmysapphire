import React from "react";
import PropTypes from "prop-types";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const ExecutiveSummaryTable = ({ title, data, totals, isLoading }) => {
    return (
        <div className="w-3/5 bg-white p-4 shadow-md rounded-lg mb-6 dark:text-gray-200 dark:bg-bodybg ">
            <h2  className="text-sm font-bold  px-4 py-2 dark:text-gray-200 dark:bg-bodybg bg-[#383853] text-white ">{title}</h2>

            <table className="min-w-full border border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                <tbody className="text-black text-sm dark:text-gray-200 dark:bg-bodybg">
                {isLoading ? (
                    <tr >
                        <td colSpan={2} className="py-4 px-4 text-center dark:text-gray-200 dark:bg-bodybg ">
                            <LoadingSpinner />
                        </td>
                    </tr>
                ) : data.length > 0 ? (
                    data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-b border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                            {Object.entries(row).map(([key, cell], cellIndex) => (
                                <td
                                    key={cellIndex}
                                    className={`py-2 px-4 border border-gray-200 dark:text-gray-200 dark:bg-bodybg ${
                                        key === "accessor" ? "text-right" : "text-left"
                                    }`}
                                >
                                    {typeof cell === "object" ? cell : cell}
                                </td>
                            ))}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={2} className="py-4 px-4 text-left text-gray-400 dark:text-gray-200 dark:bg-bodybg">
                            No Data Available
                        </td>
                    </tr>
                )}

                {totals.length > 0 && (
                    <tr className="bg-gray-200 text-black font-bold dark:text-gray-200 dark:bg-bodybg ">
                        {totals.map((total, index) => (
                            <td key={index} className={`py-2 px-4 border border-gray-200 dark:text-gray-200 dark:bg-bodybg ${
                                index !== 0 ? "text-right" : "text-left"
                            }`}>
                                {total}
                            </td>
                        ))}
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

ExecutiveSummaryTable.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    totals: PropTypes.array.isRequired,
    isLoading: PropTypes.bool
};

export default ExecutiveSummaryTable;
