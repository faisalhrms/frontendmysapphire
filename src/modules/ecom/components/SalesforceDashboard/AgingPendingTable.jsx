import React from "react";
import PropTypes from "prop-types";

const AgingPendingTable = ({ title, headers, data, totals }) => {
    return (
        <div className="w-full bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-sm font-bold text-black px-4 py-2 rounded-t bg-yellow-300">{title}</h2>

            <div className="overflow-x-auto">

                <table className="min-w-full border-collapse border border-gray-400">
                    <thead className="bg-gray-200 text-black text-sm">
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} className="text-xs font-bold py-2 border border-gray-400">{header}</th>
                        ))}
                    </tr>
                    </thead>

                    <tbody className="text-sm">
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-b">
                            {Object.entries(row).map(([key, cell], cellIndex) => (
                                <td
                                    key={cellIndex}
                                    className={`py-2 px-4 border border-gray-400 ${
                                        key === "accessor" ? "text-left" : "text-right"
                                    }`}
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                    <tr className="font-bold text-black bg-gray-200">
                        {totals.map((total, index) => (
                            <td key={index} className="py-2 px-4 border border-gray-400 text-right">
                                {total}
                            </td>
                        ))}
                    </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

AgingPendingTable.propTypes = {
    title: PropTypes.string.isRequired,
    headers: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    totals: PropTypes.array.isRequired,
};

export default AgingPendingTable;
