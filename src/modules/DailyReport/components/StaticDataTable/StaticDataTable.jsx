import React from "react";

const isObject = (val) =>
    val !== null && typeof val === "object" && !Array.isArray(val);

const StaticDataTable = ({ data }) => {
    if (!Array.isArray(data) || data.length === 0) {
        return <p className="p-4 text-gray-500">No data available</p>;
    }

    const firstRow = data[0];

    // Build header meta
    const topHeaders = [];
    const subHeaders = [];

    Object.entries(firstRow).forEach(([key, val]) => {
        if (isObject(val)) {
            const subs = Object.keys(val);
            topHeaders.push({ label: key, colSpan: subs.length, rowSpan: 1 });
            subs.forEach((sub) => subHeaders.push({ parent: key, label: sub }));
        } else {
            topHeaders.push({ label: key, colSpan: 1, rowSpan: 2 });
        }
    });

    // Flatten rows in matching order
    const rows = data.map((row) =>
        Object.entries(row).flatMap(([key, val]) =>
            isObject(val) ? Object.values(val) : [val]
        )
    );

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full table-fixed border-collapse border border-gray-200">
                <thead>
                {/* Top headers */}
                <tr className="bg-gray-800 text-white">
                    {topHeaders.map(({ label, colSpan, rowSpan }, idx) => (
                        <th
                            key={label}
                            colSpan={colSpan}
                            rowSpan={rowSpan}
                            className={`border border-gray-200 px-4 py-1 text-center text-sm font-semibold uppercase whitespace-nowrap ${
                                idx === 0
                                    ? "sticky left-0 z-30 bg-gray-800"
                                    : ""
                            }`}
                        >
                            {label.replace(/_/g, " ")}
                        </th>
                    ))}
                </tr>

                {/* Sub-headers: only nested columns */}
                {subHeaders.length > 0 && (
                    <tr className="bg-gray-700 text-white">
                        {subHeaders.map(({ parent, label }, idx) => (
                            <th
                                key={`${parent}.${label}`}
                                className={`border border-gray-200 px-4 py-1 text-center text-xs font-medium uppercase whitespace-nowrap ${
                                    idx === 0 && topHeaders[0].rowSpan === 2
                                        ? ""
                                        : ""
                                }`}
                            >
                                {label.replace(/_/g, " ")}
                            </th>
                        ))}
                    </tr>
                )}
                </thead>

                <tbody>
                {rows.map((cells, rowIndex) => (
                    <tr
                        key={rowIndex}
                        className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                        {cells.map((cell, colIndex) => (
                            <td
                                key={colIndex}
                                className={`border border-gray-200 px-4 py-1 text-sm text-gray-800 whitespace-nowrap ${
                                    colIndex === 0
                                        ? `sticky left-0 z-10 ${
                                            rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                                        }`
                                        : ""
                                }`}
                            >
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default StaticDataTable;
