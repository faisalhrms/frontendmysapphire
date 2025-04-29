import React from "react";

const StaticDataTable =({ data })=>{
    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full table-fixed border-collapse border border-gray-200">
                    <thead className="sticky top-0 z-10 text-white text-xs sm:text-sm"
                           style={{backgroundColor: '#0b3588'}}>
                    {/* Group Headers */}
                    <tr>
                        <th
                            rowSpan={2}
                            className="border border-gray-400 p-2 sticky left-0 z-10"
                            style={{minWidth: '100px'}}
                        >
                            Store Name
                        </th>
                        <th
                            colSpan={3}
                            className="border border-gray-400 py-2 px-2 text-center"
                        >
                            Current Year FY2025
                        </th>
                        <th rowSpan={2}
                            className="border border-gray-400 py-2 px-2 text-center">FP % of Total
                        </th>
                        <th rowSpan={2}
                            className="border border-gray-400 py-2 px-2 text-center">GP %
                        </th>
                        <th
                            colSpan={3}
                            className="border border-gray-400 py-2 px-2 text-center"
                        >
                            Gross Profit Rs
                        </th>

                        <th
                            colSpan={2}
                            className="border border-gray-400 py-2 px-2 text-center"
                        >
                            FP Growth from LY
                        </th>
                        <th
                            colSpan={2}
                            className="border border-gray-400 py-2 px-2 text-center"
                        >
                            Total Growth from LY
                        </th>
                        <th
                            colSpan={4}
                            className="border border-gray-400 py-2 px-2 text-center"
                        >
                            Traffic Growth
                        </th>
                    </tr>

                    {/* Sub-headers */}
                    <tr>
                        {/* Current Year */}
                        <th className="border border-gray-400 py-2 px-2 text-center">Full Price</th>
                        <th className="border border-gray-400 py-2 px-2 text-center">Discounted</th>
                        <th className="border border-gray-400 py-2 px-2 text-center">Total</th>

                        {/* Gross Profit */}

                        <th className="border border-gray-400 py-2 px-2 text-center">CY</th>
                        <th className="border border-gray-400 py-2 px-2 text-center">LY</th>
                        <th className="border border-gray-400 py-2 px-2 text-center">Growth</th>
                        {/* FP Growth */}
                        <th className="border border-gray-400 py-2 px-2 text-center">Qty</th>
                        <th className="border border-gray-400 py-2 px-2 text-center">Value</th>
                        {/* Total Growth */}
                        <th className="border border-gray-400 py-2 px-2 text-center">Qty</th>
                        <th className="border border-gray-400 py-2 px-2 text-center">Value</th>
                        {/* Traffic Growth */}
                        <th className="border border-gray-400 py-2 px-2 text-center">Footfall CY</th>
                        <th className="border border-gray-400 py-2 px-2 text-center">Conv %</th>
                        <th className="border border-gray-400 py-2 px-2 text-center">FF Growth</th>
                        <th className="border border-gray-400 py-2 px-2 text-center">Conv % Growth</th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((row, index) =>
                                <tr key={index}>
                                    <td>{ row.store_name }</td>
                                    <td>{ row.cy_fp_sales }</td>
                                    <td>{ row.cy_disc_sales }</td>
                                    <td>{ row.cy_total_sales }</td>
                                    <td>{ row.fp_percent_of_total }</td>
                                    <td>{ row.gp_percent }</td>
                                    <td>{ row.gp_cy }</td>
                                    <td>{ row.gp_ly }</td>
                                    <td>{ row.gp_percent_growth }</td>
                                    <td>{ row.fp_ly_percent_qty }</td>
                                    <td>{ row.fp_ly_percent_value }</td>
                                    <td>{ row.total_percent_growth_ly_qty }</td>
                                    <td>{ row.total_percent_growth_ly_value }</td>
                                    <td>{ row.tg_ff_cy }</td>
                                    <td>{ row.tg_ff_conv }</td>
                                    <td>{ row.tg_ff_growth }</td>
                                    <td>{ row.tg_ff_conv_growth }</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>


        </>
    )
}
export default StaticDataTable;