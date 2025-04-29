import React from "react";

const StaticDataTable = ({ data }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full table-fixed border-collapse border border-gray-200">
                <thead className="sticky top-0 z-10 text-white text-xs sm:text-sm" style={{ backgroundColor: '#141E60' }}>
                <tr>
                    <th
                        rowSpan={2}
                        className="border border-gray-400 p-2 sticky left-0 z-20 bg-[#141E60] whitespace-nowrap"
                        style={{ minWidth: '100px' }}
                    >
                        Store Name
                    </th>
                    <th colSpan={3} className="border border-gray-400 py-2 px-2 text-center whitespace-nowrap">
                        Current Year FY2025
                    </th>
                    <th
                        rowSpan={2}
                        className="border border-gray-400 py-2 px-2 text-center whitespace-nowrap"
                    >
                        FP % of Total
                    </th>
                    <th
                        rowSpan={2}
                        className="border border-gray-400 py-2 px-2 text-center whitespace-nowrap"
                    >
                        GP %
                    </th>
                    <th colSpan={3} className="border border-gray-400 py-2 px-2 text-center whitespace-nowrap">
                        Gross Profit Rs
                    </th>
                    <th colSpan={2} className="border border-gray-400 py-2 px-2 text-center whitespace-nowrap">
                        FP Growth from LY
                    </th>
                    <th colSpan={2} className="border border-gray-400 py-2 px-2 text-center whitespace-nowrap">
                        Total Growth from LY
                    </th>
                    <th colSpan={4} className="border border-gray-400 py-2 px-2 text-center whitespace-nowrap">
                        Traffic Growth
                    </th>
                </tr>

                <tr style={{ backgroundColor: '#0B3588' }}>
                    <th className="border border-gray-400 py-2 px-2 text-center whitespace-nowrap">Full Price</th>
                    <th className="border border-gray-400 py-2 px-2 text-center whitespace-nowrap">Discounted</th>
                    <th className="border border-gray-400 py-2 px-2 text-center whitespace-nowrap">Total</th>

                    <th className="border border-gray-400 py-2 px-2 text-center whitespace-nowrap">CY</th>
                    <th className="border border-gray-400 py-2 px-2 text-center whitespace-nowrap">LY</th>
                    <th className="border border-gray-400 py-2 px-2 text-center whitespace-nowrap">Growth</th>

                    <th className="border border-gray-400 py-2 px-2 text-center whitespace-nowrap">Qty</th>
                    <th className="border border-gray-400 py-2 px-2 text-center whitespace-nowrap">Value</th>

                    <th className="border border-gray-400 py-2 px-2 text-center whitespace-nowrap">Qty</th>
                    <th className="border border-gray-400 py-2 px-2 text-center whitespace-nowrap">Value</th>

                    <th className="border border-gray-400 py-2 px-2 text-center whitespace-nowrap">Footfall CY</th>
                    <th className="border border-gray-400 py-2 px-2 text-center whitespace-nowrap">Conv %</th>
                    <th className="border border-gray-400 py-2 px-2 text-center whitespace-nowrap">FF Growth</th>
                    <th className="border border-gray-400 py-2 px-2 text-center whitespace-nowrap">Conv % Growth</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row, index) => {
                    const isLFL = row.store_name.includes("LFL");
                    const defaultBg = index % 2 === 0 ? 'bg-gray-300' : 'bg-white';
                    const rowClass = isLFL ? 'bg-[#0b3588] text-white' : '';
                    const stickyBg = isLFL ? 'bg-[#0b3588] text-white' : defaultBg;
                    return (
                        <tr key={index} className={rowClass}>
                            <td className={`border border-gray-400 p-2 sticky left-0 z-20 whitespace-nowrap ${stickyBg}`}>{row.store_name}</td>
                            <td className={`border border-gray-400 p-2 text-right whitespace-nowrap ${stickyBg}`}>{row.cy_fp_sales}</td>
                            <td className={`border border-gray-400 p-2 text-right whitespace-nowrap ${stickyBg}`}>{row.cy_disc_sales}</td>
                            <td className={`border border-gray-400 p-2 text-right whitespace-nowrap ${stickyBg}`}>{row.cy_total_sales}</td>
                            <td className={`border border-gray-400 p-2 text-center whitespace-nowrap ${stickyBg}`}>{row.fp_percent_of_total}%</td>
                            <td className={`border border-gray-400 p-2 text-center whitespace-nowrap ${stickyBg}`}>{row.gp_percent}%</td>
                            <td className={`border border-gray-400 p-2 text-right whitespace-nowrap ${stickyBg}`}>{row.gp_cy}</td>
                            <td className={`border border-gray-400 p-2 text-right whitespace-nowrap ${stickyBg}`}>{row.gp_ly}</td>
                            <td className={`border border-gray-400 p-2 text-center whitespace-nowrap ${stickyBg}`}>{row.gp_percent_growth}%</td>
                            <td className={`border border-gray-400 p-2 text-center whitespace-nowrap ${stickyBg}`}>{row.fp_ly_percent_qty}%</td>
                            <td className={`border border-gray-400 p-2 text-center whitespace-nowrap ${stickyBg}`}>{row.fp_ly_percent_value}%</td>
                            <td className={`border border-gray-400 p-2 text-center whitespace-nowrap ${stickyBg}`}>{row.total_percent_growth_ly_qty}%</td>
                            <td className={`border border-gray-400 p-2 text-center whitespace-nowrap ${stickyBg}`}>{row.total_percent_growth_ly_value}%</td>
                            <td className={`border border-gray-400 p-2 text-right whitespace-nowrap ${stickyBg}`}>{row.tg_ff_cy}</td>
                            <td className={`border border-gray-400 p-2 text-center whitespace-nowrap ${stickyBg}`}>{row.tg_ff_conv}%</td>
                            <td className={`border border-gray-400 p-2 text-center whitespace-nowrap ${stickyBg}`}>{row.tg_ff_growth}</td>
                            <td className={`border border-gray-400 p-2 text-center whitespace-nowrap ${stickyBg}`}>{row.tg_ff_conv_growth}%</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default StaticDataTable;
