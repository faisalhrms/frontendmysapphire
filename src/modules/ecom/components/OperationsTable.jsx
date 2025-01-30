import React from "react";

const Table = ({ title, columns, data }) => {
    const footerTotals = columns.reduce((acc, col) => {
        acc[col] = data.reduce((sum, row) => sum + (row[col] || 0), 0);
        return acc;
    }, {});

    return (
        <div className="p-2">
            <h5 className="font-bold text-left text-black dark:text-gray-200 dark:bg-bodybg py-2">{title}</h5>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-400">
                    <thead>
                    <tr className="text-black dark:text-gray-200 dark:bg-gray-800">
                        {columns.map((col, index) => (
                            <th key={index} className="border border-gray-400 bg-white dark:bg-bodybg px-6 py-3 text-center">
                                {col}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="text-center p-4">
                                No Data Available
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-100 text-left">
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className="border border-gray-400 dark:text-gray-200 dark:bg-bodybg px-4 py-2 text-left">
                                        {row[col] || ""}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                    </tbody>
                    <tfoot>
                    <tr className="font-bold text-left bg-gray-200 dark:text-gray-200 dark:bg-bodybg">
                        {columns.map((col, index) => (
                            <td key={index} className="border border-gray-400 px-4 py-2">
                                {index === 0 ? "Total" : footerTotals[col] || ""}
                            </td>
                        ))}
                    </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default Table;
