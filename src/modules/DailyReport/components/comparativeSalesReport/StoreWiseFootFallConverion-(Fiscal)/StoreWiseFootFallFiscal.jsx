import React from 'react';

const StoreWiseFootFallFiscal = ({ data }) => {
    const getCellColor = (value, isSaleValue = false) => {
        if (typeof value === 'number') {
            if (isSaleValue) {
                return '';
            }
            if (value > 0) return 'text-emerald-600';
            if (value < 0) return 'text-red-600';
        }
        return '';
    };



    if (!data || !data.rows) {
        console.log('No data or rows available:', data);
        return (
            <div className="bg-white p-4 dark:text-gray-200 dark:bg-bodybg mb-4">
                <div className="flex justify-center items-center h-32">
                    <div className="text-lg">No data available</div>
                </div>
            </div>
        );
    }

    console.log('Data rows:', data.rows);

    const regularRows = data.rows.filter(row =>
        row.lfl_status !== 'Total LFL' && row.lfl_status !== 'Total Network (Inc. NS)'
    );

    const totalLflRow = data.rows.find(row => row.lfl_status === 'Total LFL');
    const totalNetworkRow = data.rows.find(row => row.lfl_status === 'Total Network (Inc. NS)');

    const currentPeriod = data.dates?.gregorian?.current;
    const comparativePeriod = data.dates?.gregorian?.comparative;

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
                        <th rowSpan={2} className="border border-gray-300 px-2 py-3 text-center font-medium min-w-[150px]">Store Name</th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium" colSpan="5">
                            {currentPeriod ? `${currentPeriod.from_date} to ${currentPeriod.to_date}` : 'Current Period'}
                        </th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium" colSpan="5">
                            {comparativePeriod ? `${comparativePeriod.from_date} to ${comparativePeriod.to_date}` : 'Comparative Period'}
                        </th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium" colSpan="5">
                            Growth
                        </th>
                    </tr>
                    <tr className="bg-[#4d5875] text-white" style={{ position: 'sticky', top: '38px', zIndex: 10 }}>
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
                    {regularRows.map((row) => (
                        <tr key={row.store_name || `row-${row.lfl_status}-${row.region}`} className="text-black font-medium bg-white dark:text-gray-200 dark:bg-bodybg whitespace-nowrap">
                            <td className="border border-gray-300 px-2 py-3">{row.lfl_status}</td>
                            <td className="border border-gray-300 px-2 py-3">{row.region || ''}</td>
                            <td className="border border-gray-300 px-2 py-3 min-w-[150px] whitespace-normal">
                                {row.store_name ? row.store_name : 'N/A'}
                            </td>
                            <td className="border border-gray-300 px-2 py-3 text-right">-</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{row.sales_value_cy?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{row.invoice_cy?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{row.ff_cy?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{row.conv_percentage_cy ? `${row.conv_percentage_cy.toFixed(2)}%` : ''}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">-</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{row.sales_value_ly?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{row.invoice_ly?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{row.ff_ly?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{row.conv_percentage_ly ? `${row.conv_percentage_ly.toFixed(2)}%` : ''}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">-</td>
                            <td className={`border border-gray-300 px-2 py-3 text-right font-medium ${getCellColor(row.sales_value_growth, true)}`}>
                                {row.sales_value_growth}
                            </td>
                            <td className={`border border-gray-300 px-2 py-3 text-right font-medium ${getCellColor(row.invoice_growth)}`}>
                                {row.invoice_growth}
                            </td>
                            <td className={`border border-gray-300 px-2 py-3 text-right font-medium ${getCellColor(row.ff_growth)}`}>
                                {row.ff_growth}
                            </td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{row.conv_percentage_growth}</td>
                        </tr>
                    ))}

                    {totalLflRow && (
                        <tr className="bg-gray-400 font-medium text-black whitespace-nowrap" style={{ position: 'sticky', bottom: 43,  zIndex: 5 }}>
                            <td className="border border-gray-300 px-2 py-3">Total LFL</td>
                            <td className="border border-gray-300 px-2 py-3"></td>
                            <td className="border border-gray-300 px-2 py-3"></td>
                            <td className="border border-gray-300 px-2 py-3 text-right">-</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalLflRow.sales_value_cy?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalLflRow.invoice_cy?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalLflRow.ff_cy?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalLflRow.conv_percentage_cy ? `${totalLflRow.conv_percentage_cy.toFixed(2)}%` : ''}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">-</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalLflRow.sales_value_ly?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalLflRow.invoice_ly?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalLflRow.ff_ly?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalLflRow.conv_percentage_ly ? `${totalLflRow.conv_percentage_ly.toFixed(2)}%` : ''}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">-</td>
                            <td className={`border border-gray-300 px-2 py-3 text-right font-medium ${getCellColor(totalLflRow.sales_value_growth, true)}`}>
                                {totalLflRow.sales_value_growth}
                            </td>
                            <td className={`border border-gray-300 px-2 py-3 text-right font-medium ${getCellColor(totalLflRow.invoice_growth)}`}>
                                {totalLflRow.invoice_growth}
                            </td>
                            <td className={`border border-gray-300 px-2 py-3 text-right font-medium ${getCellColor(totalLflRow.ff_growth)}`}>
                                {totalLflRow.ff_growth}
                            </td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalLflRow.conv_percentage_growth}</td>
                        </tr>
                    )}

                    {totalNetworkRow && (
                        <tr className="bg-[#949eb7] font-medium text-black whitespace-nowrap"  style={{ position: 'sticky', bottom: 0, backgroundColor: '#949eb7', zIndex: 5 }}>
                            <td className="border border-gray-300 px-2 py-3">Total Network</td>
                            <td className="border border-gray-300 px-2 py-3"></td>
                            <td className="border border-gray-300 px-2 py-3"></td>
                            <td className="border border-gray-300 px-2 py-3 text-right">-</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalNetworkRow.sales_value_cy?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalNetworkRow.invoice_cy?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalNetworkRow.ff_cy?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalNetworkRow.conv_percentage_cy ? `${totalNetworkRow.conv_percentage_cy.toFixed(2)}%` : ''}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">-</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalNetworkRow.sales_value_ly?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalNetworkRow.invoice_ly?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalNetworkRow.ff_ly?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalNetworkRow.conv_percentage_ly ? `${totalNetworkRow.conv_percentage_ly.toFixed(2)}%` : ''}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">-</td>
                            <td className={`border border-gray-300 px-2 py-3 text-right font-medium ${getCellColor(totalNetworkRow.sales_value_growth, true)}`}>
                                {totalNetworkRow.sales_value_growth}
                            </td>
                            <td className={`border border-gray-300 px-2 py-3 text-right font-medium ${getCellColor(totalNetworkRow.invoice_growth)}`}>
                                {totalNetworkRow.invoice_growth}
                            </td>
                            <td className={`border border-gray-300 px-2 py-3 text-right font-medium ${getCellColor(totalNetworkRow.ff_growth)}`}>
                                {totalNetworkRow.ff_growth}
                            </td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalNetworkRow.conv_percentage_growth}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StoreWiseFootFallFiscal;