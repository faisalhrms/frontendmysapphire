import React from "react";

const AgingTable = ({ title, data, totals }) => {
    return (
        <div className="w-3/5 bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-lg font-bold text-black  px-2 py-2 rounded-t">{title}</h2>


            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-400">
                    <thead className="bg-gray-200 text-black text-sm">
                    <tr>
                        <th className="py-2 px-2 border">Courier</th>
                        <th className="py-2 px-2 border">0 - 7 Days (Normal)</th>
                        <th className="py-2 px-2 border">8 - 15 Days</th>
                        <th className="py-2 px-2 border">16 - 25 Days</th>
                        <th className="py-2 px-2 border">Total</th>
                    </tr>
                    </thead>
                    <tbody className="text-sm">
                    {data.map((row, index) => (
                        <tr key={index} className="border-b">
                            <td className="py-2 px-2 border">{row.courier}</td>
                            <td className="py-2 px-2 border">{row["0-7Days"]}</td>
                            <td className="py-2 px-2 border">{row["8-15Days"]}</td>
                            <td className="py-2 px-2 border">{row["16-25Days"]}</td>
                            <td className="py-2 px-2 border">{row.total}</td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                    <tr className="font-bold text-black bg-gray-200">
                        <td className="py-2 px-2 border">Total</td>
                        <td className="py-2 px-2 border">{totals["0-7Days"]}</td>
                        <td className="py-2 px-2 border">{totals["8-15Days"]}</td>
                        <td className="py-2 px-2 border">{totals["16-25Days"]}</td>
                        <td className="py-2 px-2 border">{totals.total}</td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default AgingTable;
