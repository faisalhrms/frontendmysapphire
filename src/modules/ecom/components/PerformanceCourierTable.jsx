import React from "react";

const PerformanceCourierTable = ({ title, data, totals }) => {
    return (

        <div className="w-full  bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-lg font-bold text-black px-4 py-2 rounded-t">{title}</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-400">
                    <thead className="bg-gray-200 text-black text-sm">
                    <tr>
                        <th className="py-2 px-4 border">Courier Name</th>
                        <th className="py-2 px-4 border">Last Day</th>
                        <th className="py-2 px-4 border">Last 7 Days</th>
                        <th className="py-2 px-4 border">MTD</th>
                        <th className="py-2 px-4 border">Last Month</th>
                        <th className="py-2 px-4 border">YTD</th>
                    </tr>
                    </thead>
                    <tbody className="text-sm">
                    {data.map((row, index) => (
                        <tr key={index} className="border-b">
                            <td className="py-2 px-4 border">{row.courierName}</td>
                            <td className="py-2 px-4 border">{row.lastDay}</td>
                            <td className="py-2 px-4 border">{row.last7Days}</td>
                            <td className="py-2 px-4 border">{row.mtd}</td>
                            <td className="py-2 px-4 border">{row.lastMonth}</td>
                            <td className="py-2 px-4 border">{row.ytd}</td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                    <tr className="font-bold text-black bg-gray-200">
                        <td className="py-2 px-4 border">Total</td>
                        <td className="py-2 px-4 border">{totals.lastDay}</td>
                        <td className="py-2 px-4 border">{totals.last7Days}</td>
                        <td className="py-2 px-4 border">{totals.mtd}</td>
                        <td className="py-2 px-4 border">{totals.lastMonth}</td>
                        <td className="py-2 px-4 border">{totals.ytd}</td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default PerformanceCourierTable;
