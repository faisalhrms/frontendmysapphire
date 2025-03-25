import React from 'react';

const AClassIslamic = () => {
    return (
        <div className="font-sans text-sm">
            {/* Header */}
            <div className="flex justify-between mb-4">
                <div className="mt-4 font-bold text-danger mb-4 ml-4">
                    Sales Report for A Class (Offline) & Online Channel- Full Price Sales
                </div>
                <div className="mt-4 font-bold text-danger mb-4 ml-4">
                    Like for Like Islamic Days Growth
                </div>
            </div>

            <div className="p-4 bg-white mt-4 mb-4 rounded-lg">
                <div className="mb-6">
                    <table className="w-full border-collapse">
                        <thead>
                        <tr  style={{backgroundColor: "#0b3588", color: "white"}}>
                            <th className="w-1/12"></th>
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
            <div className="p-4 bg-white mt-4 mb-4 rounded-lg">
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
                        <tr>

                            <th className="bg-blue-200  p-2 text-center"></th>
                            <th className="bg-blue-200  p-2 text-center"></th>

                            <th className="bg-blue-200 border border-gray-400 p-2 text-center">Last Day (Wed)</th>
                            <th className="bg-blue-200 border border-gray-400 p-2 text-center">MTD</th>
                            <th className="bg-blue-200 border border-gray-400 p-2 text-center">Last Day (Sat)</th>
                            <th className="bg-blue-200 border border-gray-400 p-2 text-center">MTD</th>
                            <th className="bg-blue-200 border border-gray-400 p-2 text-center">MTD</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr className="bg-gray-200">

                            <td className="font-bold p-2"></td>
                            <td className="font-bold p-2">Total</td>
                            <td className="border border-gray-400 p-2 text-right">128,481,379</td>
                            <td className="border border-gray-400 p-2 text-right">2,397,893,575</td>
                            <td className="border border-gray-400 p-2 text-right">184,014,141</td>
                            <td className="border border-gray-400 p-2 text-right">2,358,550,418</td>
                            <td className="border border-gray-400 p-2 text-right">1.7%</td>
                        </tr>
                        <tr>
                            <td className="font-bold p-2"></td>
                            <td className="font-bold p-2">Offline</td>
                            <td className="border border-gray-400 p-2 text-right">103,004,525</td>
                            <td className="border border-gray-400 p-2 text-right">1,937,630,364</td>
                            <td className="border border-gray-400 p-2 text-right">154,291,541</td>
                            <td className="border border-gray-400 p-2 text-right">1,878,879,210</td>
                            <td className="border border-gray-400 p-2 text-right">3%</td>
                        </tr>
                        <tr>
                            <td className="font-bold p-2"></td>
                            <td className="font-bold p-2">Online</td>
                            <td className="border border-gray-400 p-2 text-right">25,476,854</td>
                            <td className="border border-gray-400 p-2 text-right">460,263,211</td>
                            <td className="border border-gray-400 p-2 text-right">29,722,600</td>
                            <td className="border border-gray-400 p-2 text-right">479,671,208</td>
                            <td className="border border-gray-400 p-2 text-right text-red-600">-4%</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

                {/* Detailed Table */}
                <div className="p-4 bg-white mt-4 mb-4 rounded-lg">
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
                            <th className="bg-white border border-gray-400 p-2 " style={{backgroundColor: 'rgba(30, 58, 138, 0.85)', color: 'white'}}></th>
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
                            <td className="border border-gray-400 p-2 text-right">3%</td>
                            <td className="border border-gray-400 p-2 text-right">366,388,640</td>
                            <td className="border border-gray-400 p-2 text-right">335,709,980</td>
                            <td className="border border-gray-400 p-2 text-right">9%</td>
                        </tr>
                        <tr>
                            <td className="font-bold border border-gray-400 p-2">Stitched Women</td>
                            <td className="border border-gray-400 p-2 text-right">614,439,330</td>
                            <td className="border border-gray-400 p-2 text-right">529,598,500</td>
                            <td className="border border-gray-400 p-2 text-right">16%</td>
                            <td className="border border-gray-400 p-2 text-right">61,660,430</td>
                            <td className="border border-gray-400 p-2 text-right">81,760,280</td>
                            <td className="border border-gray-400 p-2 text-right bg-red-200 text-red-600">-25%</td>
                        </tr>
                        <tr>
                            <td className="font-bold border border-gray-400 p-2">Men's Stitched</td>
                            <td className="border border-gray-400 p-2 text-right">19,514,450</td>
                            <td className="border border-gray-400 p-2 text-right">27,911,400</td>
                            <td className="border border-gray-400 p-2 text-right bg-red-200 text-red-600">-30%</td>
                            <td className="border border-gray-400 p-2 text-right">4,489,940</td>
                            <td className="border border-gray-400 p-2 text-right">6,706,020</td>
                            <td className="border border-gray-400 p-2 text-right bg-red-200 text-red-600">-33%</td>
                        </tr>
                        <tr>
                            <td className="font-bold border border-gray-400 p-2">Men's Unstitched</td>
                            <td className="border border-gray-400 p-2 text-right">35,009,550</td>
                            <td className="border border-gray-400 p-2 text-right">39,069,500</td>
                            <td className="border border-gray-400 p-2 text-right bg-red-200 text-red-600">-10%</td>
                            <td className="border border-gray-400 p-2 text-right">5,972,460</td>
                            <td className="border border-gray-400 p-2 text-right">7,124,870</td>
                            <td className="border border-gray-400 p-2 text-right bg-red-200 text-red-600">-16%</td>
                        </tr>
                        <tr>
                            <td className="font-bold border border-gray-400 p-2">Modest Wear</td>
                            <td className="border border-gray-400 p-2 text-right">48,151,940</td>
                            <td className="border border-gray-400 p-2 text-right">32,737,310</td>
                            <td className="border border-gray-400 p-2 text-right">47%</td>
                            <td className="border border-gray-400 p-2 text-right">9,770,165</td>
                            <td className="border border-gray-400 p-2 text-right">7,450,660</td>
                            <td className="border border-gray-400 p-2 text-right">31%</td>
                        </tr>
                        <tr>
                            <td className="font-bold border border-gray-400 p-2">Women West</td>
                            <td className="border border-gray-400 p-2 text-right">19,895,790</td>
                            <td className="border border-gray-400 p-2 text-right">36,101,440</td>
                            <td className="border border-gray-400 p-2 text-right bg-red-200 text-red-600">-45%</td>
                            <td className="border border-gray-400 p-2 text-right">3,328,640</td>
                            <td className="border border-gray-400 p-2 text-right">9,318,210</td>
                            <td className="border border-gray-400 p-2 text-right bg-red-200 text-red-600">-64%</td>
                        </tr>
                        <tr>
                            <td className="font-bold border border-gray-400 p-2">Bags</td>
                            <td className="border border-gray-400 p-2 text-right">6,230,040</td>
                            <td className="border border-gray-400 p-2 text-right">6,252,390</td>
                            <td className="border border-gray-400 p-2 text-right">0%</td>
                            <td className="border border-gray-400 p-2 text-right">927,154</td>
                            <td className="border border-gray-400 p-2 text-right">2,207,420</td>
                            <td className="border border-gray-400 p-2 text-right bg-red-200 text-red-600">-58%</td>
                        </tr>
                        <tr>
                            <td className="font-bold border border-gray-400 p-2">Footwear</td>
                            <td className="border border-gray-400 p-2 text-right">3,268,350</td>
                            <td className="border border-gray-400 p-2 text-right">4,355,790</td>
                            <td className="border border-gray-400 p-2 text-right bg-red-200 text-red-600">-25%</td>
                            <td className="border border-gray-400 p-2 text-right">637,580</td>
                            <td className="border border-gray-400 p-2 text-right">2,207,750</td>
                            <td className="border border-gray-400 p-2 text-right bg-red-200 text-red-600">-71%</td>
                        </tr>
                        <tr>
                            <td className="font-bold border border-gray-400 p-2">Fragrance</td>
                            <td className="border border-gray-400 p-2 text-right">45,883,310</td>
                            <td className="border border-gray-400 p-2 text-right">43,168,730</td>
                            <td className="border border-gray-400 p-2 text-right">6%</td>
                            <td className="border border-gray-400 p-2 text-right">3,113,790</td>
                            <td className="border border-gray-400 p-2 text-right">3,499,490</td>
                            <td className="border border-gray-400 p-2 text-right bg-red-200 text-red-600">-11%</td>
                        </tr>
                        <tr>
                            <td className="font-bold border border-gray-400 p-2">Home</td>
                            <td className="border border-gray-400 p-2 text-right">7,980</td>
                            <td className="border border-gray-400 p-2 text-right">9,292,950</td>
                            <td className="border border-gray-400 p-2 text-right bg-red-200 text-red-600">-100%</td>
                            <td className="border border-gray-400 p-2 text-right">63,530</td>
                            <td className="border border-gray-400 p-2 text-right">7,994,580</td>
                            <td className="border border-gray-400 p-2 text-right bg-red-200 text-red-600">-99%</td>
                        </tr>
                        <tr>
                            <td className="font-bold border border-gray-400 p-2">Kids Easter Wear</td>
                            <td className="border border-gray-400 p-2 text-right">2,271,680</td>
                            <td className="border border-gray-400 p-2 text-right">29,158,170</td>
                            <td className="border border-gray-400 p-2 text-right bg-red-200 text-red-600">-92%</td>
                            <td className="border border-gray-400 p-2 text-right">2,264,200</td>
                            <td className="border border-gray-400 p-2 text-right">12,586,160</td>
                            <td className="border border-gray-400 p-2 text-right bg-red-200 text-red-600">-82%</td>
                        </tr>
                        <tr>
                            <td className="font-bold border border-gray-400 p-2">Sleepwear</td>
                            <td className="border border-gray-400 p-2 text-right">5,274,910</td>
                            <td className="border border-gray-400 p-2 text-right">6,973,040</td>
                            <td className="border border-gray-400 p-2 text-right bg-red-200 text-red-600">-24%</td>
                            <td className="border border-gray-400 p-2 text-right">1,260,830</td>
                            <td className="border border-gray-400 p-2 text-right">1,777,330</td>
                            <td className="border border-gray-400 p-2 text-right bg-red-200 text-red-600">-29%</td>
                        </tr>
                        <tr>
                            <td className="font-bold border border-gray-400 p-2">Unstitched-To-Stitched</td>
                            <td className="border border-gray-400 p-2 text-right">-</td>
                            <td className="border border-gray-400 p-2 text-right">-</td>
                            <td className="border border-gray-400 p-2 text-right">0%</td>
                            <td className="border border-gray-400 p-2 text-right">259,050</td>
                            <td className="border border-gray-400 p-2 text-right">-</td>
                            <td className="border border-gray-400 p-2 text-right">0%</td>
                        </tr>
                        <tr>
                            <td className="font-bold border border-gray-400 p-2">Cosmetics</td>
                            <td className="border border-gray-400 p-2 text-right">-</td>
                            <td className="border border-gray-400 p-2 text-right">9,372,065</td>
                            <td className="border border-gray-400 p-2 text-right bg-red-200 text-red-600">-100%</td>
                            <td className="border border-gray-400 p-2 text-right">126,802</td>
                            <td className="border border-gray-400 p-2 text-right">1,328,320</td>
                            <td className="border border-gray-400 p-2 text-right bg-red-200 text-red-600">-90%</td>
                        </tr>
                        <tr>
                            <td className="font-bold border border-gray-400 p-2">Others</td>
                            <td className="border border-gray-400 p-2 text-right">2,494,834</td>
                            <td className="border border-gray-400 p-2 text-right">3,408,375</td>
                            <td className="border border-gray-400 p-2 text-right bg-red-200 text-red-600">-27%</td>
                            <td className="border border-gray-400 p-2 text-right">-</td>
                            <td className="border border-gray-400 p-2 text-right">138</td>
                            <td className="border border-gray-400 p-2 text-right bg-red-200 text-red-600">-100%</td>
                        </tr>
                        <tr className="font-bold">
                            <td className="border border-gray-400 p-2 bg-gray-200">Total</td>
                            <td className="border border-gray-400 p-2 text-right bg-gray-100">1,937,630,364</td>
                            <td className="border border-gray-400 p-2 text-right bg-gray-100">1,878,879,210</td>
                            <td className="border border-gray-400 p-2 text-right bg-gray-100">3%</td>
                            <td className="border border-gray-400 p-2 text-right bg-gray-100">460,263,211</td>
                            <td className="border border-gray-400 p-2 text-right bg-gray-100">479,671,208</td>
                            <td className="border border-gray-400 p-2 text-right bg-gray-100 text-red-600">-4%</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                {/* Footer Notes */}
                <div className="mt-4 font-bold text-danger mb-4 ml-4">
                    <p>*Excluding FOL Stores</p>
                    <p>**Unstitched-To-Stitched is part of Stitched Women in B&M</p>
                </div>
            </div>
            );
            };

            export default AClassIslamic;