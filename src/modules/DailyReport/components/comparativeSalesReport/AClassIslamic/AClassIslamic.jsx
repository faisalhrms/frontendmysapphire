import React from 'react';

const AClassIslamic = () => {
    const getGrowthColor = (growth) => {
        return growth < 0 ? 'text-danger' : 'text-success';
    };

    return (
        <div className="font-sans text-sm">

            <div className="p-4 bg-white mt-4 mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
                <div className="mb-6">
                    <table className="w-full border-collapse">
                        <thead>
                        <tr>
                            <th className="bg-blue-300 border border-gray-400 p-2"></th>
                            <th className="bg-blue-300 border border-gray-400 p-2 text-center">Current Period</th>
                            <th className="bg-blue-300 border border-gray-400 p-2 text-center">Comparative Period</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="font-bold p-2 border border-gray-400">From</td>
                            <td className="border border-gray-400 p-2 text-center">01-Feb-25</td>
                            <td className="border border-gray-400 p-2 text-center">01-Feb-24</td>
                        </tr>
                        <tr>
                            <td className="font-bold p-2 border border-gray-400">To</td>
                            <td className="border border-gray-400 p-2 text-center">26-Feb-25</td>
                            <td className="border border-gray-400 p-2 text-center">26-Feb-24</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary Table */}
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

            {/* Detailed Table */}
            <div className="p-4 bg-white mt-4 mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
                <table className="w-full border-collapse">
                    <thead>
                    <tr style={{backgroundColor: '#0b3588', color: 'white'}}>
                        <th rowSpan="2" className="bg-blue-300 border border-gray-400 p-2">A-Class</th>
                        <th colSpan="7" className="bg-blue-300 border border-gray-400 p-2 text-center">Full Price
                        </th>
                    </tr>
                    <tr style={{backgroundColor: '#0b3588', color: 'white'}}>
                        <th colSpan="3" className="bg-blue-300 border border-gray-400 p-2 text-center">Offline</th>
                        <th colSpan="3" className="bg-blue-300 border border-gray-400 p-2 text-center">Online (Excl.
                            UK)
                        </th>
                    </tr>
                    <tr style={{backgroundColor: '#0b3588', color: 'white'}}>
                        <th className="bg-white p-2" style={{backgroundColor: 'rgba(30, 58, 138, 0.85)', color: 'white'}}></th>
                        <th className="bg-blue-200 border border-gray-400 p-2 text-center">Shaban - 25</th>
                        <th className="bg-blue-200 border border-gray-400 p-2 text-center">Shaban - 24</th>
                        <th className="bg-blue-200 border border-gray-400 p-2 text-center">Growth</th>
                        <th className="bg-blue-200 border border-gray-400 p-2 text-center">Shaban - 25</th>
                        <th className="bg-blue-200 border border-gray-400 p-2 text-center">Shaban - 24</th>
                        <th className="bg-blue-200 border border-gray-400 p-2 text-center">Growth</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="font-bold border border-gray-400 p-2">Unstitched Women</td>
                        <td className="border border-gray-400 p-2 text-right">1,135,188,200</td>
                        <td className="border border-gray-400 p-2 text-right">1,101,479,550</td>
                        <td className={`border border-gray-400 p-2 text-right ${getGrowthColor(3)}`}>3%</td>
                        <td className="border border-gray-400 p-2 text-right">366,388,640</td>
                        <td className="border border-gray-400 p-2 text-right">335,709,980</td>
                        <td className={`border border-gray-400 p-2 text-right ${getGrowthColor(9)}`}>9%</td>
                    </tr>
                    <tr>
                        <td className="font-bold border border-gray-400 p-2">Stitched Women</td>
                        <td className="border border-gray-400 p-2 text-right">614,439,330</td>
                        <td className="border border-gray-400 p-2 text-right">529,598,500</td>
                        <td className={`border border-gray-400 p-2 text-right ${getGrowthColor(16)}`}>16%</td>
                        <td className="border border-gray-400 p-2 text-right">61,660,430</td>
                        <td className="border border-gray-400 p-2 text-right">81,760,280</td>
                        <td className={`border border-gray-400 p-2 text-right ${getGrowthColor(-25)}`}>-25%</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AClassIslamic;
