import React from 'react';
import { formatNumberWithCommas } from "@helpers/formatters.js";

const ClassonlineFiscal = () => {
    const data = {
        currentYear: {
            lastDay: 128481379,
            mtd: 2397893575,
        },
        lastYear: {
            lastDay: 69236966,
            mtd: 1821757709,
        },
        growth: {
            lastDayGrowth: '31.63%',
            mtdGrowth: '37%',
        },
    };

    const getGrowthColor = (growth) => {
        return growth.startsWith('-') ? 'text-danger' : 'text-success';
    };

    return (
        <div className="p-6 bg-white mt-4  rounded-lg dark:text-gray-200 dark:bg-bodybg">
            <div className="overflow-x-auto border border-gray-400">
                <table className="min-w-full table-auto border-collapse">
                    <thead style={{ backgroundColor: '#0b3588', color: 'white' }}>
                    <tr>
                        <th colSpan="6" className="py-2 px-2 border border-gray-400 p-2 text-center sticky left-16 z-50">Full Price</th>
                    </tr>
                    <tr>
                        <th colSpan="2" className="py-2 px-2 border border-gray-400 p-2 text-center">Current Year</th>
                        <th colSpan="2" className="py-2 px-2 border border-gray-400 p-2 text-center">Last Year</th>
                        <th colSpan="1" className="py-2 px-2 border border-gray-400 p-2 text-center">Growth</th>
                    </tr>
                    <tr>
                        <th className="py-2 px-2 border border-gray-400 p-2 text-center font-bold sticky left-16 z-50">Last Day (Wed)</th>
                        <th className="py-2 px-4 border border-gray-400 p-2 text-center">MTD</th>
                        <th className="py-2 px-4 border border-gray-400 p-2 text-center">Last Day (Mon)</th>
                        <th className="py-2 px-2 border border-gray-400 p-2 text-center font-bold sticky left-16 z-50">MTD</th>
                        <th className="py-2 px-2 border border-gray-400 p-2 text-center font-bold sticky left-16 z-50">MTD</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="py-2 px-4 text-right border border-gray-400">{formatNumberWithCommas(data.currentYear.lastDay)}</td>
                        <td className="py-2 px-4 text-right border border-gray-400">{formatNumberWithCommas(data.currentYear.mtd)}</td>
                        <td className="py-2 px-4 text-right border border-gray-400">{formatNumberWithCommas(data.lastYear.lastDay)}</td>
                        <td className="py-2 px-4 text-right border border-gray-400">{formatNumberWithCommas(data.lastYear.mtd)}</td>
                        <td className={`py-2 px-4 text-right border border-gray-400 ${getGrowthColor(data.growth.lastDayGrowth)}`}>{data.growth.lastDayGrowth}</td>
                    </tr>
                    <tr>
                        <td className="py-2 px-4 text-right border border-gray-400">{formatNumberWithCommas(data.currentYear.lastDay)}</td>
                        <td className="py-2 px-4 text-right border border-gray-400">{formatNumberWithCommas(data.currentYear.mtd)}</td>
                        <td className="py-2 px-4 text-right border border-gray-400">{formatNumberWithCommas(data.lastYear.lastDay)}</td>
                        <td className="py-2 px-4 text-right border border-gray-400">{formatNumberWithCommas(data.lastYear.mtd)}</td>
                        <td className={`py-2 px-4 text-right border border-gray-400 ${getGrowthColor(data.growth.mtdGrowth)}`}>{data.growth.mtdGrowth}</td>
                    </tr>

                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClassonlineFiscal;
