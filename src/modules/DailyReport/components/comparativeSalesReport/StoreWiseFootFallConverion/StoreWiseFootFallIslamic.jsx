
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

    const currentPeriodGregorian = data.dates?.gregorian?.current;
    const comparativePeriodGregorian = data.dates?.gregorian?.comparative;
    const currentPeriodHijri = data.dates?.hijri?.current;
    const comparativePeriodHijri = data.dates?.hijri?.comparative;

    const formatToDayMonthYear = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const formatDateHeader = (gregorianPeriod, hijriPeriod) => {
        if (gregorianPeriod && hijriPeriod) {
            const fromDayMonthYear = formatToDayMonthYear(gregorianPeriod.from_date);
            const toDayMonthYear = formatToDayMonthYear(gregorianPeriod.to_date);
            return (
                <div>
                    <div>{fromDayMonthYear} to {toDayMonthYear}</div>
                    <div className="text-xs text-gray-300 mt-1">
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

    return (
        <div className="bg-white p-4 dark:text-gray-200 dark:bg-bodybg mb-4">
            <div
                className="relative border border-gray-400"
                style={{
                    maxHeight: '650px',
                    overflowY: 'auto',
                    overflowX: 'auto'
                }}
            >
                <table className="min-w-max border-collapse border border-gray-300 text-xs">
                    <thead className="sticky top-0 bg-gray-800 text-white z-50">
                    <tr className="text-white bg-[#383853]">
                        <th rowSpan={2} className="sticky left-0 bg-[#383853] border border-gray-300 px-2 py-3 text-left font-medium  min-w-[100px]">
                            LFL Status
                        </th>
                        <th rowSpan={2} className="sticky left-[100px] bg-[#383853] border border-gray-300 px-2 py-3 text-center font-medium  min-w-[120px]">
                            Region
                        </th>
                        <th rowSpan={2} className="sticky left-[220px] bg-[#383853] border border-gray-300 px-2 py-3 text-center font-medium whitespace-nowrap  min-w-[200px]">
                            Store Name
                        </th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium" colSpan="5">
                            <div className="text-xs text-gray-300">
                                {formatDateHeader(currentPeriodGregorian, currentPeriodHijri)}
                            </div>
                        </th>
                        <th className="border border-gray-300 px-2 py-3 text-center font-medium" colSpan="5">
                            <div className="text-xs text-gray-300">
                                {formatDateHeader(comparativePeriodGregorian, comparativePeriodHijri)}
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
                    {regularRows.map((row, index) => (
                        <tr key={index} className="text-black font-medium bg-white dark:text-gray-200 dark:bg-bodybg whitespace-nowrap">
                            <td className="sticky left-0 bg-white dark:bg-bodybg border border-gray-300 px-2 py-3 z-20">
                                {row.lfl_status}
                            </td>
                            <td className="sticky left-[100px] bg-white dark:bg-bodybg border border-gray-300 px-2 py-3 z-20">
                                {row.region || ''}
                            </td>
                            <td className="sticky left-[220px] bg-white dark:bg-bodybg border border-gray-300 px-2 py-3 whitespace-nowrap z-20">
                                {row.store_name}
                            </td>
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
                        <tr className="bg-gray-400 font-medium text-black whitespace-nowrap sticky bottom-[40px] z-20">
                            <td className="sticky left-0 bg-gray-400 border border-gray-300 px-2 py-3 z-20">Total LFL</td>
                            <td className="sticky left-[100px] bg-gray-400 border border-gray-300 px-2 py-3 z-20"></td>
                            <td className="sticky left-[220px] bg-gray-400 border border-gray-300 px-2 py-3 whitespace-nowrap z-20"></td>
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
                        <tr className="bg-[#949eb7] font-medium text-black whitespace-nowrap sticky bottom-0 z-30">
                            <td className="sticky left-0 bg-[#949eb7] border border-gray-300 px-2 py-3 z-20">Total Network</td>
                            <td className="sticky left-[100px] bg-[#949eb7] border border-gray-300 px-2 py-3 z-20"></td>
                            <td className="sticky left-[220px] bg-[#949eb7] border border-gray-300 px-2 py-3 whitespace-nowrap z-20"></td>
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