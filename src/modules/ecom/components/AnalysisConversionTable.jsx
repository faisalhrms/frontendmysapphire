import React, { useState } from "react";

const SourceCodeTable = () => {
    const [filter, setFilter] = useState("ACTIVE");
    const [sortOrder, setSortOrder] = useState("desc");

    const data = [
        { group: "organic", site: "Site-Sapphire-Site", activations: 2000816, orders: 8557, merchandiseTotal: "PKR63,520,024", avgPerUsage: "PKR32", avgPerOrder: "PKR7,423", itemsPerOrder: 2.03, conversion: "0.43%" },
        { group: "googleAds", site: "Site-Sapphire-Site", activations: 671732, orders: 4343, merchandiseTotal: "PKR22,139,112", avgPerUsage: "PKR32", avgPerOrder: "PKR6,492", itemsPerOrder: 1.82, conversion: "0.65%" },
        { group: "metaAds", site: "Site-Sapphire-Site", activations: 1061541, orders: 4046, merchandiseTotal: "PKR25,597,957", avgPerUsage: "PKR24", avgPerOrder: "PKR6,339", itemsPerOrder: 1.69, conversion: "0.38%" },
        { group: "emerge", site: "Site-Sapphire-Site", activations: 31812, orders: 91, merchandiseTotal: "PKR629,181", avgPerUsage: "PKR20", avgPerOrder: "PKR7,057", itemsPerOrder: 2.09, conversion: "0.29%" },
        { group: "tikTok", site: "Site-Sapphire-Site", activations: 712, orders: 2, merchandiseTotal: "PKR65,850", avgPerUsage: "PKR8", avgPerOrder: "PKR2,925", itemsPerOrder: 1.50, conversion: "0.28%" }
    ];

    const sortedData = [...data].sort((a, b) => {
        return sortOrder === "asc" ? a.orders - b.orders : b.orders - a.orders;
    });

    return (
        <div className="p-4 bg-white shadow-lg rounded-lg mb-6 ">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Conversion of Source Codes</h2>
                {/*<button*/}
                {/*    onClick={() => setFilter(filter === "ACTIVE" ? "INACTIVE" : "ACTIVE")}*/}
                {/*    className="border px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition"*/}
                {/*>*/}
                {/*    {filter}*/}
                {/*</button>*/}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border border-gray-200">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="border p-2 text-center">Group</th>
                        <th className="border p-2 text-center">Site</th>
                        <th className="border p-2 text-center">Activation</th>
                        <th className="border p-2 text-center cursor-pointer" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                            Orders {sortOrder === "asc" ? "" : ""}
                        </th>
                        <th className="border p-2 text-center">Merchandise Total</th>
                        <th className="border p-2 text-center">Avg Merchandise Total Per Using</th>
                        <th className="border p-2 text-center">Avg Merchandise Total Per Order</th>
                        <th className="border p-2 text-center">Teams Per Order</th>
                        <th className="border p-2 text-center">Order Conversion</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedData.map((row, index) => (
                        <tr key={index} className="border hover:bg-gray-50">
                            <td className="border p-2 text-start">{row.group}</td>
                            <td className="border p-2 text-right whitespace-nowrap">{row.site}</td>
                            <td className="border p-2 text-right">{row.activations.toLocaleString()}</td>
                            <td className="border p-2 text-right">{row.orders.toLocaleString()}</td>
                            <td className="border p-2 text-right">{row.merchandiseTotal}</td>
                            <td className="border p-2 text-right">{row.avgPerUsage}</td>
                            <td className="border p-2 text-right">{row.avgPerOrder}</td>
                            <td className="border p-2 text-right">{row.itemsPerOrder}</td>
                            <td className="border p-2 text-right">{row.conversion}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SourceCodeTable;


