import React from 'react';
import { formatToDayMonthYear } from "@helpers/dateTime.js";

const StoreWiseFootFallFiscal = ({ data }) => {

    const formatDateHeader = (gregorianPeriod, hijriPeriod) => {
        if (gregorianPeriod && hijriPeriod) {
            const fromDayMonthYear = formatToDayMonthYear(gregorianPeriod.from_date);
            const toDayMonthYear = formatToDayMonthYear(gregorianPeriod.to_date);
            return (
                <div>
                    <div>{fromDayMonthYear} to {toDayMonthYear}</div>
                    <div className="text-xs text-gray-300">
                        ({hijriPeriod.from_date} to {hijriPeriod.to_date})
                    </div>
                </div>
            );
        } else if (gregorianPeriod) {
            const fromDayMonthYear = formatToDayMonthYear(gregorianPeriod.from_date);
            const toDayMonthYear = formatToDayMonthYear(gregorianPeriod.to_date);
            return `${fromDayMonthYear} to ${toDayMonthYear}`;
        } else if (hijriPeriod) {
            return `${hijriPeriod.from_date} to ${hijriPeriod.to_date}`;
        }
        return 'Period';
    };

    const getCellColor = (value) => {
        if (typeof value === 'number') {
            if (value > 0) return 'text-emerald-600';
            if (value < 0) return 'text-red';
        }
        return '';
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
    const currentPeriodGregorian = data.dates?.gregorian?.current;
    const comparativePeriodGregorian = data.dates?.gregorian?.comparative;
    const currentPeriodHijri = data.dates?.hijri?.current;
    const comparativePeriodHijri = data.dates?.hijri?.comparative;

    return (
        <div className="bg-white p-4 dark:text-gray-200 dark:bg-bodybg mb-4">
            <div className="overflow-x-auto overflow-y-auto border border-gray-400"
                 style={{ maxHeight: '650px' }}>
                <table className="min-w-max border-collapse border border-gray-300 text-xs">
                    <thead className="sticky top-0 bg-gray-800 text-white z-50">
                    <tr className="text-white bg-[#383853]"
                        style={{position: 'sticky', top: 0, zIndex: 10}}>
                        <th rowSpan={2}
                            className="sticky left-0 bg-[#383853] border border-gray-300 px-2 py-3 text-left font-medium  min-w-[100px]">
                            LFL Status
                        </th>
                        <th rowSpan={2}
                            className="sticky left-[100px] bg-[#383853] border border-gray-300 px-2 py-3 text-center font-medium  min-w-[120px]">
                            Region
                        </th>
                        <th rowSpan={2}
                            className="sticky left-[220px] bg-[#383853] border border-gray-300 px-2 py-3 text-center font-medium whitespace-nowrap  min-w-[200px]">
                            Store Name
                        </th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium" colSpan="5">
                            <div className="text-xs text-gray-300 ">
                                {formatDateHeader(currentPeriodGregorian)}
                            </div>
                        </th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium" colSpan="5">
                            <div className="text-xs text-gray-300 ">
                                {formatDateHeader(comparativePeriodGregorian)}
                            </div>
                        </th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium" colSpan="5">
                            Growth
                        </th>
                    </tr>
                    <tr className="bg-[#4d5875] text-white">
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium min-w-[80px]">Qty</th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium min-w-[100px]">Sale Value</th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium min-w-[80px]">Invoice</th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium min-w-[80px]">FF</th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium min-w-[80px]">Conv%</th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium min-w-[80px]">Qty</th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium min-w-[100px]">Sale Value</th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium min-w-[80px]">Invoice</th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium min-w-[80px]">FF</th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium min-w-[80px]">Conv%</th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium min-w-[80px]">Qty</th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium min-w-[100px]">Sale Value</th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium min-w-[80px]">Invoice</th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium min-w-[80px]">FF</th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium min-w-[80px]">Conv%</th>
                    </tr>
                    </thead>

                    <tbody>
                    {regularRows.map((row) => (
                        <tr
                            key={row.store_name || `row-${row.lfl_status}-${row.region}`}
                            className="text-black font-medium bg-white dark:text-gray-200 dark:bg-bodybg whitespace-nowrap"
                        >
                            <td className="sticky left-0 bg-white dark:bg-bodybg border border-gray-300 px-2 py-3 z-20">{row.lfl_status}</td>
                            <td className="sticky left-[100px] bg-white dark:bg-bodybg border border-gray-300 px-2 py-3 z-20">{row.region || ''}</td>
                            <td className="sticky left-[220px] bg-white dark:bg-bodybg border border-gray-300 px-2 py-3 whitespace-nowrap z-20">
                                {row.store_name ? row.store_name : 'N/A'}
                            </td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{row.qty_cy?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{row.sales_value_cy?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{row.invoice_cy?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{row.ff_cy?.toLocaleString() || '-'}</td>
                            <td className={`border border-gray-300 px-2 py-3 text-right font-medium ${getCellColor(row.conv_percentage_cy)}`}>
                                {row.conv_percentage_cy ? `${row.conv_percentage_cy.toFixed(2)}%` : ''}
                            </td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{row.qty_ly?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{row.sales_value_ly?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{row.invoice_ly?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{row.ff_ly?.toLocaleString() || '-'}</td>
                            <td className={`border border-gray-300 px-2 py-3 text-right font-medium ${getCellColor(row.conv_percentage_ly)}`}>
                                {row.conv_percentage_ly ? `${row.conv_percentage_ly.toFixed(2)}%` : ''}
                            </td>
                            <td className={`border border-gray-300 px-2 py-3 text-right font-medium ${getCellColor(row.qty_growth)}`}>
                                {row.qty_growth ? `${row.qty_growth.toFixed(2)}%` : ''}
                            </td>
                            <td className={`border border-gray-300 px-2 py-3 text-right font-medium ${getCellColor(row.sales_value_growth)}`}>
                                {row.sales_value_growth ? `${row.sales_value_growth.toFixed(2)}%` : ''}
                            </td>
                            <td className={`border border-gray-300 px-2 py-3 text-right font-medium ${getCellColor(row.invoice_growth)}`}>
                                {row.invoice_growth ? `${row.invoice_growth.toFixed(2)}%` : ''}
                            </td>
                            <td className={`border border-gray-300 px-2 py-3 text-right font-medium ${getCellColor(row.ff_growth)}`}>
                                {row.ff_growth ? `${row.ff_growth.toFixed(2)}%` : ''}
                            </td>
                            <td className={`border border-gray-300 px-2 py-3 text-right font-medium ${getCellColor(row.conv_percentage_growth)}`}>
                                {row.conv_percentage_growth ? `${row.conv_percentage_growth.toFixed(2)}%` : ''}
                            </td>
                        </tr>
                    ))}

                    {totalLflRow && (
                        <tr className="bg-gray-400 font-medium text-black whitespace-nowrap sticky bottom-[40px] z-20">
                            <td className="sticky left-0 bg-gray-400 border border-gray-300 px-2 py-3 z-20">Total LFL</td>
                            <td className="sticky left-[100px] bg-gray-400 border border-gray-300 px-2 py-3 z-20"></td>
                            <td className="sticky left-[220px] bg-gray-400 border border-gray-300 px-2 py-3 whitespace-nowrap z-20"></td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalLflRow.qty_cy?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalLflRow.sales_value_cy?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalLflRow.invoice_cy?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalLflRow.ff_cy?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalLflRow.conv_percentage_cy ? `${totalLflRow.conv_percentage_cy.toFixed(2)}%` : ''}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalLflRow.qty_ly?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalLflRow.sales_value_ly?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalLflRow.invoice_ly?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalLflRow.ff_ly?.toLocaleString() || '-'}</td>
                            <td className={`border border-gray-300 px-2 py-3 text-right font-medium ${getCellColor(totalLflRow.conv_percentage_ly)}`}>
                                {totalLflRow.conv_percentage_ly ? `${totalLflRow.conv_percentage_ly.toFixed(2)}%` : ''}
                            </td>
                            <td className={`border border-gray-300 px-2 py-3 text-right font-medium ${getCellColor(totalLflRow.qty_growth)}`}>
                                {totalLflRow.qty_growth ? `${totalLflRow.qty_growth.toFixed(2)}%` : ''}
                            </td>
                            <td className={`border border-gray-300 px-2 py-3 text-right font-medium ${getCellColor(totalLflRow.sales_value_growth)}`}>
                                {totalLflRow.sales_value_growth ? `${totalLflRow.sales_value_growth.toFixed(2)}%` : ''}
                            </td>
                            <td className={`border border-gray-300 px-2 py-3 text-right font-medium ${getCellColor(totalLflRow.invoice_growth)}`}>
                                {totalLflRow.invoice_growth ? `${totalLflRow.invoice_growth.toFixed(2)}%` : ''}
                            </td>
                            <td className={`border border-gray-300 px-2 py-3 text-right font-medium ${getCellColor(totalLflRow.ff_growth)}`}>
                                {totalLflRow.ff_growth ? `${totalLflRow.ff_growth.toFixed(2)}%` : ''}
                            </td>
                            <td className={`border border-gray-300 px-2 py-3 text-right font-medium ${getCellColor(totalLflRow.conv_percentage_growth)}`}>
                                {totalLflRow.conv_percentage_growth ? `${totalLflRow.conv_percentage_growth.toFixed(2)}%` : ''}
                            </td>
                        </tr>
                    )}

                    {totalNetworkRow && (
                        <tr className="bg-[#949eb7] font-medium text-black whitespace-nowrap sticky bottom-0 z-30">
                            <td className="sticky left-0 bg-[#949eb7] border border-gray-300 px-2 py-3 z-20">Total Network</td>
                            <td className="sticky left-[100px] bg-[#949eb7] border border-gray-300 px-2 py-3 z-20"></td>
                            <td className="sticky left-[220px] bg-[#949eb7] border border-gray-300 px-2 py-3 whitespace-nowrap z-20"></td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalNetworkRow.qty_cy?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalNetworkRow.sales_value_cy?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalNetworkRow.invoice_cy?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalNetworkRow.ff_cy?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalNetworkRow.conv_percentage_cy ? `${totalNetworkRow.conv_percentage_cy.toFixed(2)}%` : ''}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalNetworkRow.qty_ly?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalNetworkRow.sales_value_ly?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalNetworkRow.invoice_ly?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalNetworkRow.ff_ly?.toLocaleString() || '-'}</td>
                            <td className="border border-gray-300 px-2 py-3 text-right">{totalNetworkRow.conv_percentage_ly ? `${totalNetworkRow.conv_percentage_ly.toFixed(2)}%` : ''}</td>
                            <td className={`border border-gray-300 px-2 py-3 text-right font-medium ${getCellColor(totalNetworkRow.qty_growth)}`}>
                                {totalNetworkRow.qty_growth ? `${totalNetworkRow.qty_growth.toFixed(2)}%` : ''}
                            </td>
                            <td className={`border border-gray-300 px-2 py-3 text-right font-medium ${getCellColor(totalNetworkRow.sales_value_growth)}`}>
                                {totalNetworkRow.sales_value_growth ? `${totalNetworkRow.sales_value_growth.toFixed(2)}%` : ''}
                            </td>
                            <td className={`border border-gray-300 px-2 py-3 text-right font-medium ${getCellColor(totalNetworkRow.invoice_growth)}`}>
                                {totalNetworkRow.invoice_growth ? `${totalNetworkRow.invoice_growth.toFixed(2)}%` : ''}
                            </td>
                            <td className={`border border-gray-300 px-2 py-3 text-right font-medium ${getCellColor(totalNetworkRow.ff_growth)}`}>
                                {totalNetworkRow.ff_growth ? `${totalNetworkRow.ff_growth.toFixed(2)}%` : ''}
                            </td>
                            <td className={`border border-gray-300 px-2 py-3 text-right font-medium ${getCellColor(totalNetworkRow.conv_percentage_growth)}`}>
                                {totalNetworkRow.conv_percentage_growth ? `${totalNetworkRow.conv_percentage_growth.toFixed(2)}%` : ''}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StoreWiseFootFallFiscal;