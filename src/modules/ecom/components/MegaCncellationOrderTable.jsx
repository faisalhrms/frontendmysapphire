import React from "react";

const MegaCancelledOrdersTable = ({ title, data, totals }) => {
    return (
        <div className="w-3/5 bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-lg font-bold text-black bg-red-800 px-4 py-2 rounded-t">{title}</h2>
            <table className="min-w-full border-collapse border border-gray-400">
                <thead className="bg-gray-200 text-black text-sm">
                <tr>
                    <th className="py-2 px-4 border">Date</th>
                    <th className="py-2 px-4 border">Orders</th>
                    <th className="py-2 px-4 border">Qty</th>
                    <th className="py-2 px-4 border">Value</th>
                </tr>
                </thead>
                <tbody className="text-sm">
                {data.map((row, index) => (
                    <tr key={index} className="border-b">
                        <td className="py-2 px-4 border">{row.date}</td>
                        <td className="py-2 px-4 border">{row.orders}</td>
                        <td className="py-2 px-4 border">{row.qty}</td>
                        <td className="py-2 px-4 border">{row.value}</td>
                    </tr>
                ))}
                </tbody>
                <tfoot>
                <tr className="font-bold text-black bg-gray-200">
                    <td className="py-2 px-4 border">Total</td>
                    <td className="py-2 px-4 border">{totals.orders}</td>
                    <td className="py-2 px-4 border">{totals.qty}</td>
                    <td className="py-2 px-4 border">{totals.value}</td>
                </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default MegaCancelledOrdersTable;
