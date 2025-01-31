import React from "react";

const PerformanceRationsTable = ({ title, columns, data, totals }) => {
    return (
        <div className="w-full bg-white p-4 shadow-md rounded-lg">

            <h2 className="text-lg font-bold text-black bg-red-800 px-4 py-2 rounded-t">{title}</h2>


            <table className="min-w-full border border-gray-200">

                <thead className="bg-gray-200 text-black text-sm">
                <tr>
                    <th rowSpan="2" className="py-2 px-4 border border-gray-400">Courier</th>
                    <th colSpan="2" className="py-2 px-4 border border-gray-400">Last 7 Days</th>
                    <th colSpan="2" className="py-2 px-4 border border-gray-400">MTD</th>
                    <th colSpan="2" className="py-2 px-4 border border-gray-400">Last Month</th>
                    <th colSpan="2" className="py-2 px-4 border border-gray-400">YTD</th>
                </tr>
                <tr>
                    {columns.map((col, index) => (
                        <th key={index} className="py-2 px-4 border border-gray-400">{col}</th>
                    ))}
                </tr>
                </thead>


                <tbody className="text-black text-sm">
                {data.map((row, index) => (
                    <tr key={index} className="border-b ">
                        {Object.values(row).map((cell, cellIndex) => (
                            <td
                                key={cellIndex}
                                className={`py-2 px-4 border border-gray-400 text-center ${
                                    typeof cell === 'string' && cell.includes('%') ? 'text-red-600 font-bold' : ''
                                }`}
                            >
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>


                {totals && (
                    <tfoot>
                    <tr className=" text-black bg-gray-200  font-bold">
                        {totals.map((total, index) => (
                            <td key={index} className="py-2 px-4 border border-gray-400 text-center">
                                {total}
                            </td>
                        ))}
                    </tr>
                    </tfoot>
                )}
            </table>
        </div>
    );
};

export default PerformanceRationsTable;
