import React from "react";
import PropTypes from "prop-types";

const formatNumber = (value) => {
    if (typeof value === "number") {
        return value.toLocaleString();
    }
    if (typeof value === "string" && !isNaN(value)) {
        return Number(value).toLocaleString();
    }
    return value;
};

const ExecutiveSummaryTable = ({ title, data, totals }) => {
    return (
        <div className="w-3/5 bg-white p-4 shadow-md rounded-lg mb-6">
            <h2 className="text-sm font-bold text-black px-4 py-2 bg-gray-200">{title}</h2>

            <table className="min-w-full border border-gray-200">
                <tbody className="text-black text-sm">
                {data.length > 0 ? (
                    data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-b border-gray-200">
                            {Object.entries(row).map(([key, cell], cellIndex) => (
                                <td
                                    key={cellIndex}
                                    className={`py-2 px-4 border border-gray-200 ${
                                        key === "accessor" ? "text-right" : "text-left"
                                    }`}
                                >
                                    {typeof cell === "object" ? cell : formatNumber(cell)}
                                </td>
                            ))}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={2} className="py-4 px-4 text-left text-gray-400">
                            No Data Available
                        </td>
                    </tr>
                )}

                {totals.length > 0 && (
                    <tr className="bg-gray-200 text-black font-bold">
                        {totals.map((total, index) => (
                            <td key={index} className="py-2 px-4 border border-gray-400 text-left">
                                {formatNumber(total)}
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
};

export default ExecutiveSummaryTable;
