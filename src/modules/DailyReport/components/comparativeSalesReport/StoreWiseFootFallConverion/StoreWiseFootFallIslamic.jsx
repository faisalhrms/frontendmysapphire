import React from 'react';

const SalesDataTable = ({ data }) => {
    const formatNumber = (num) => {
        if (typeof num === 'string' && num.includes(',')) {
            return num;
        }
        if (typeof num === 'number') {
            return num.toLocaleString();
        }
        return num || '-';
    };

    if (!data || !data.rows) {
        return (
            <div className="bg-white p-4 dark:text-gray-200 dark:bg-bodybg mb-4">
                <div className="flex justify-center items-center h-32">
                    <div className="text-lg">No data available</div>
                </div>
            </div>
        );
    }

    const regularRows = data.rows.filter(row =>
        row.lfl_status !== 'Total LFL' && row.lfl_status !== 'Total Network (Inc. NS)'
    );

    const totalLflRow = data.rows.find(row => row.lfl_status === 'Total LFL');
    const totalNetworkRow = data.rows.find(row => row.lfl_status === 'Total Network (Inc. NS)');

    const currentPeriod = data.dates?.hijri?.current || data.dates?.gregorian?.current;
    const comparativePeriod = data.dates?.hijri?.comparative || data.dates?.gregorian?.comparative;

    const isHijriDates = data.dates?.hijri?.current ? true : false;
    const dateLabel = isHijriDates ? 'Hijri' : 'Gregorian';

    return (
        <div className="bg-white p-4 dark:text-gray-200 dark:bg-bodybg mb-4">
            <div className="overflow-x-auto overflow-y-auto border border-gray-400"
                 style={{ maxHeight: '650px' }}>
                <table className="min-w-max border-collapse border border-gray-300 text-xs">
                    <thead className="sticky top-0 bg-gray-800 text-white">
                    <tr   className="text-white bg-[#383853]"
                          style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                        <th rowSpan={2} className="border border-gray-300 px-2 py-3 text-left font-medium">LFL Status</th>
                        <th rowSpan={2} className="border border-gray-300 px-2 py-3 text-center font-medium">Region</th>
                        <th rowSpan={2} className="border border-gray-300 px-2 py-3 text-center font-medium whitespace-nowrap">Store Name</th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium" colSpan="5">
                            {currentPeriod ? `${currentPeriod.from_date} to ${currentPeriod.to_date}` : 'Current Period'}
                            {isHijriDates && <div className="text-xs text-gray-300 mt-1"></div>}
                        </th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium" colSpan="5">
                            {comparativePeriod ? `${comparativePeriod.from_date} to ${comparativePeriod.to_date}` : 'Comparative Period'}
                            {isHijriDates && <div className="text-xs text-gray-300 mt-1"></div>}
                        </th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium" colSpan="5">
                            Growth
                        </th>
                    </tr>
                    <tr className="bg-[#4d5875] text-white " style={{ position: 'sticky', top: '38px', zIndex: 10 }}>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium">Qty</th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium">Sale Value</th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium">Invoice</th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium">FF</th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium">Conv%</th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium">Qty</th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium">Sale Value</th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium">Invoice</th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium">FF</th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium">Conv%</th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium">Qty</th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium">Sale Value</th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium">Invoice</th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium">FF</th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium">Conv%</th>
                    </tr>
                    </thead>

                    <tbody>
                    {regularRows.map((row, index) => (
                        <tr key={index} className="text-black font-medium bg-white dark:text-gray-200 dark:bg-bodybg whitespace-nowrap">
                            <td className="border border-gray-300 px-2 py-3">{row.lfl_status}</td>
                            <td className="border border-gray-300 px-2 py-3">{row.region || ''}</td>
                            <td className="border border-gray-300 px-2 py-3 whitespace-nowrap">{row.store_name}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">-</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{formatNumber(row.sales_value_cy)}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{formatNumber(row.invoice_cy)}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{formatNumber(row.ff_cy)}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{row.conv_percentage_cy || ''}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">-</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{formatNumber(row.sales_value_ly)}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{formatNumber(row.invoice_ly)}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{formatNumber(row.ff_ly)}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{row.conv_percentage_ly || ''}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">-</td>
                            <td className="border border-gray-300 px-2 py-3 text-right font-medium">
                                {row.sales_value_growth || ''}
                            </td>
                            <td className="border border-gray-300 px-2 py-3 text-right font-medium">
                                {row.invoice_growth || ''}
                            </td>
                            <td className="border border-gray-300 px-2 py-3 text-right font-medium">
                                {row.ff_growth || ''}
                            </td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{row.conv_percentage_growth || ''}</td>
                        </tr>
                    ))}

                    {totalLflRow && (
                        <tr className="bg-gray-400 font-medium text-black whitespace-nowrap" style={{ position: 'sticky', bottom: 43, zIndex: 5 } }>
                            <td className="border border-gray-300 px-2 py-3">Total LFL</td>
                            <td className="border border-gray-300 px-2 py-3"></td>
                            <td className="border border-gray-300 px-2 py-3 whitespace-nowrap"></td>
                            <td className="border border-gray-300 px-2 py-3 text-right">-</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{formatNumber(totalLflRow.sales_value_cy)}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{formatNumber(totalLflRow.invoice_cy)}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{formatNumber(totalLflRow.ff_cy)}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalLflRow.conv_percentage_cy || ''}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">-</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{formatNumber(totalLflRow.sales_value_ly)}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{formatNumber(totalLflRow.invoice_ly)}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{formatNumber(totalLflRow.ff_ly)}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalLflRow.conv_percentage_ly || ''}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">-</td>
                            <td className="border border-gray-300 px-2 py-3 text-right font-medium">
                                {totalLflRow.sales_value_growth || ''}
                            </td>
                            <td className="border border-gray-300 px-2 py-3 text-right font-medium">
                                {totalLflRow.invoice_growth || ''}
                            </td>
                            <td className="border border-gray-300 px-2 py-3 text-right font-medium">
                                {totalLflRow.ff_growth || ''}
                            </td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalLflRow.conv_percentage_growth || ''}</td>
                        </tr>
                    )}

                    {totalNetworkRow && (
                        <tr className="bg-[#949eb7] font-medium text-black whitespace-nowrap" style={{ position: 'sticky', bottom: 0, backgroundColor: '#949eb7', zIndex: 10 }}>
                            <td className="border border-gray-300 px-2 py-3">Total Network</td>
                            <td className="border border-gray-300 px-2 py-3"></td>
                            <td className="border border-gray-300 px-2 py-3 whitespace-nowrap"></td>
                            <td className="border border-gray-300 px-2 py-3 text-right">-</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{formatNumber(totalNetworkRow.sales_value_cy)}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{formatNumber(totalNetworkRow.invoice_cy)}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{formatNumber(totalNetworkRow.ff_cy)}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalNetworkRow.conv_percentage_cy || ''}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">-</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{formatNumber(totalNetworkRow.sales_value_ly)}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{formatNumber(totalNetworkRow.invoice_ly)}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{formatNumber(totalNetworkRow.ff_ly)}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalNetworkRow.conv_percentage_ly || ''}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">-</td>
                            <td className="border border-gray-300 px-2 py-3 text-right font-medium">
                                {totalNetworkRow.sales_value_growth || ''}
                            </td>
                            <td className="border border-gray-300 px-2 py-3 text-right font-medium">
                                {totalNetworkRow.invoice_growth || ''}
                            </td>
                            <td className="border border-gray-300 px-2 py-3 text-right font-medium">
                                {totalNetworkRow.ff_growth || ''}
                            </td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalNetworkRow.conv_percentage_growth || ''}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesDataTable;