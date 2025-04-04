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
        return growth < 0 ? 'text-danger' : 'text-success';
    };

    return (
        <div className="p-4 bg-white mt-4 mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
            <div className="mb-6">
                <table className="w-full border-collapse">
                    <thead>
                    <tr style={{backgroundColor: '#0b3588', color: 'white'}}>
                        <th colSpan="7" className="bg-blue-300 border border-gray-400 p-2 text-center">Full Price
                        </th>
                    </tr>
                    <tr style={{backgroundColor: '#0b3588', color: 'white'}}>
                        <th colSpan="2" className="bg-blue-300 border border-gray-400 p-2 text-center">
                        </th>
                        <th colSpan="2" className="bg-blue-300 border border-gray-400 p-2 text-center">Current
                            Year
                        </th>
                        <th colSpan="2" className="bg-blue-300 border border-gray-400 p-2 text-center">Last Year
                        </th>
                        <th className="bg-blue-300 border border-gray-400 p-2 text-center">Growth</th>
                    </tr>
                    <tr className="border border-gray-400" style={{backgroundColor: '#0b3588', color: 'white'}}>
                        <th className="bg-blue-200 p-2 text-center"></th>
                        <th className="bg-blue-200 p-2 text-center"></th>
                        <th className="bg-blue-200 border border-gray-400 p-2 text-center">Last Day (Wed)</th>
                        <th className="bg-blue-200 border border-gray-400 p-2 text-center">MTD</th>
                        <th className="bg-blue-200 border border-gray-400 p-2 text-center">Last Day (Sat)</th>
                        <th className="bg-blue-200 border border-gray-400 p-2 text-center">MTD</th>
                        <th className="bg-blue-200 border border-gray-400 p-2 text-center">MTD</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr className="bg-gray-200 border border-gray-400 dark:text-gray-200 dark:bg-bodybg">
                        <td className="font-bold p-2"></td>
                        <td className="font-bold p-2">Total</td>
                        <td className="border border-gray-400 p-2 text-right">128,481,379</td>
                        <td className="border border-gray-400 p-2 text-right">2,397,893,575</td>
                        <td className="border border-gray-400 p-2 text-right">184,014,141</td>
                        <td className="border border-gray-400 p-2 text-right">2,358,550,418</td>
                        <td className={`border border-gray-400 p-2 text-right ${getGrowthColor(1.7)}`}>1.7%</td>
                    </tr>
                    <tr className="border border-gray-400">
                        <td className="font-bold p-2 "></td>
                        <td className="font-bold p-2 ">Offline</td>
                        <td className="border border-gray-400 p-2 text-right">103,004,525</td>
                        <td className="border border-gray-400 p-2 text-right">1,937,630,364</td>
                        <td className="border border-gray-400 p-2 text-right">154,291,541</td>
                        <td className="border border-gray-400 p-2 text-right">1,878,879,210</td>
                        <td className={`border border-gray-400 p-2 text-right ${getGrowthColor(3)}`}>3%</td>
                    </tr>
                    <tr className="border border-gray-400">
                        <td className="font-bold p-2"></td>
                        <td className="font-bold p-2">Online</td>
                        <td className="border border-gray-400 p-2 text-right">25,476,854</td>
                        <td className="border border-gray-400 p-2 text-right">460,263,211</td>
                        <td className="border border-gray-400 p-2 text-right">29,722,600</td>
                        <td className="border border-gray-400 p-2 text-right">479,671,208</td>
                        <td className={`border border-gray-400 p-2 text-right ${getGrowthColor(-4)}`}>-4%</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClassonlineFiscal;
