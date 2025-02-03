import React from "react";

const MegaReturnPercentageTable = ({ title, data, total }) => {
    return (
        <div className="w-3/5   bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-lg font-bold text-black bg-red-800 px-4 py-2 rounded-t">{title}</h2>
            <table className="min-w-full border-collapse border border-gray-400">
                <thead className="bg-gray-200 text-black text-sm">
                <tr>
                    <th className="py-2 px-4 border">Courier</th>
                    <th className="py-2 px-4 border">Return</th>
                    <th className="py-2 px-4 border">% Return</th>
                </tr>
                </thead>
                <tbody className="text-sm">
                {data.map((row, index) => (
                    <tr key={index} className="border-b">
                        <td className="py-2 px-4 border">{row.courier}</td>
                        <td className="py-2 px-4 border">{row.return}</td>
                        <td
                            className={`py-2 px-4 border ${row.percentage.includes('%') && parseFloat(row.percentage) < 10 ? 'text-red-600 font-bold' : ''}`}
                        >
                            {row.percentage}
                        </td>
                    </tr>
                ))}
                </tbody>
                <tfoot>
                <tr className="bg-gray-200 text-black font-bold">
                    <td className="py-2 px-4 border">Total</td>
                    <td className="py-2 px-4 border">{total.return}</td>
                    <td className="py-2 px-4 border">{total.percentage}</td>
                </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default MegaReturnPercentageTable;
