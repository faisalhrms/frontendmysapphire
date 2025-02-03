

import React from "react";

const CancellationTable = ({ title, headers, data }) => {
    return (
        <div className="w-full bg-white p-4 shadow-md rounded-lg dark:bg-bodybg">

            <h2 className="text-lg font-bold text-black dark:bg-bodybg  px-4 py-2 rounded-t">{title}</h2>


            <table className="min-w-full border-gray-400  dark:border-gray-400">

                <thead className=" text-black text-sm bg-gray-200 bg-gray-200 dark:bg-bodybg dark:border-gray-400">
                <tr>
                    <th rowSpan="2" className="py-2 px-4 border border-gray-400">Name</th>
                    <th colSpan="2" className="py-2 px-4 border border-gray-400">CY</th>
                    <th colSpan="2" className="py-2 px-4 border border-gray-400">LY</th>
                </tr>
                <tr>
                    {headers.map((header, index) => (
                        <th key={index} className="py-2 px-4  border-gray-400">{header}</th>
                    ))}
                </tr>
                </thead>


                <tbody className="text-black text-sm">
                {data.length > 0 ? (
                    data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-gray-400 dark:border-gray-400">
                            {Object.values(row).map((cell, cellIndex) => (
                                <td key={cellIndex} className="py-2 px-4 border border-gray-400 text-center">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={headers.length + 1} className="py-4 px-4 text-left text-gray-400">
                            No Data Available
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default CancellationTable;
