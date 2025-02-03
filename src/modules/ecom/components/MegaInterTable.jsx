import React from "react";

const MegaInterTable = ({ title, headers, data, totals }) => {
    return (
        <div className="w-3/5 bg-white p-4 shadow-md rounded-lg mb-6">

            <h2 className="text-lg font-bold text-black bg-red-800 px-4 py-2 rounded-t">{title}</h2>


            <table className="min-w-full border border-gray-200">

                <thead className="bg-gray-200 text-black text-sm">
                <tr>
                    {headers.map((header, index) => (
                        <th key={index} className="py-2 px-4 border border-gray-400">{header}</th>
                    ))}
                </tr>
                </thead>


                <tbody className="text-gray-200 text-sm">
                {data.length > 0 ? (
                    data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-b border-gray-200">
                            {Object.values(row).map((cell, cellIndex) => (
                                <td key={cellIndex} className="py-2 px-4 border border-gray-200 text-black text-left">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={headers.length + 1} className="py-4 px-4 text-left text-black text-gray-400">
                            No Data Available
                        </td>
                    </tr>
                )}


                <tr className="bg-gray-200 text-black font-bold">
                    {totals.map((total, index) => (
                        <td key={index} className="py-2 px-4 border text-black border-gray-400 text-left">
                            {total}
                        </td>
                    ))}
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default MegaInterTable;
