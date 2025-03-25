import React from 'react';

const OnlineSalesGlobal = () => {
    const getGrowthColor = (growth) => {
        return growth.startsWith('-') ? 'text-danger' : 'text-success';
    };

    return (
        <div className="p-4 font-sans">
            <div className="p-4 bg-white mt-4 mb-4 rounded-lg">
                <table className="w-full border-collapse bg-white mb-4">
                    <thead>
                    <tr>
                        <th className="w-1/4" style={{backgroundColor: '#0b3588', color: 'white'}}></th>
                        <th className="bg-blue-300 border border-gray-300 p-2 text-center"
                            style={{backgroundColor: '#0b3588', color: 'white'}}>Current Period
                        </th>
                        <th className="bg-blue-300 border border-gray-300 p-2 text-center"
                            style={{backgroundColor: '#0b3588', color: 'white'}}>Comparative Period
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="font-bold p-2 border border-gray-400">From</td>
                        <td className="border border-gray-300 p-2 text-center">01-Feb-25</td>
                        <td className="border border-gray-300 p-2 text-center">01-Feb-24</td>
                    </tr>
                    <tr>
                        <td className="font-bold p-2 border border-gray-400">To</td>
                        <td className="border border-gray-300 p-2 text-center">26-Feb-25</td>
                        <td className="border border-gray-300 p-2 text-center">26-Feb-24</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div className="p-4 bg-white mt-4 mb-4 rounded-lg">
                <table className="w-full border-collapse mb-6 bg-white">
                    <thead>
                    <tr style={{backgroundColor: '#0b3588', color: 'white'}}>
                        <th className="bg-blue-300 border border-gray-300 p-2 text-center" rowSpan="2">A-Class</th>
                        <th className="bg-blue-300 border border-gray-300 p-2 text-center" colSpan="3">Local</th>
                        <th className="bg-blue-300 border border-gray-300 p-2 text-center" colSpan="3">Global (Excl. UK)</th>
                    </tr>
                    <tr style={{backgroundColor: '#0b3588', color: 'white'}}>
                        <th className="bg-blue-200 border border-gray-300 p-2 text-center">Feb-25</th>
                        <th className="bg-blue-200 border border-gray-300 p-2 text-center">Feb-24</th>
                        <th className="bg-blue-200 border border-gray-300 p-2 text-center">Growth</th>
                        <th className="bg-blue-200 border border-gray-300 p-2 text-center">Feb-25</th>
                        <th className="bg-blue-200 border border-gray-300 p-2 text-center">Feb-24</th>
                        <th className="bg-blue-200 border border-gray-300 p-2 text-center">Growth</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="border border-gray-300 p-1 font-medium">Unstitched Women</td>
                        <td className="border border-gray-300 p-1 text-right">363,386,760</td>
                        <td className="border border-gray-300 p-1 text-right">276,410,990</td>
                        <td className={`border border-gray-300 p-1 text-center ${getGrowthColor("31%")}`}>31%</td>
                        <td className="border border-gray-300 p-1 text-right">3,001,880</td>
                        <td className="border border-gray-300 p-1 text-right">1,692,150</td>
                        <td className={`border border-gray-300 p-1 text-center ${getGrowthColor("77%")}`}>77%</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 p-1 font-medium">Stitched Women</td>
                        <td className="border border-gray-300 p-1 text-right">44,943,870</td>
                        <td className="border border-gray-300 p-1 text-right">60,285,930</td>
                        <td className={`border border-gray-300 p-1 text-center ${getGrowthColor("-25%")}`}>-25%</td>
                        <td className="border border-gray-300 p-1 text-right">16,716,560</td>
                        <td className="border border-gray-300 p-1 text-right">10,224,250</td>
                        <td className={`border border-gray-300 p-1 text-center ${getGrowthColor("63%")}`}>63%</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 p-1 font-medium">Men's Stitched</td>
                        <td className="border border-gray-300 p-1 text-right">2,000,460</td>
                        <td className="border border-gray-300 p-1 text-right">4,680,360</td>
                        <td className={`border border-gray-300 p-1 text-center ${getGrowthColor("-57%")}`}>-57%</td>
                        <td className="border border-gray-300 p-1 text-right">2,489,480</td>
                        <td className="border border-gray-300 p-1 text-right">2,037,340</td>
                        <td className={`border border-gray-300 p-1 text-center ${getGrowthColor("22%")}`}>22%</td>
                    </tr>
                    <tr className="font-bold">
                        <td className="border border-gray-300 p-1 text-left">Total</td>
                        <td className="border border-gray-300 p-1 text-right">434,812,611</td>
                        <td className="border border-gray-300 p-1 text-right">393,254,868</td>
                        <td className={`border border-gray-300 p-1 text-center ${getGrowthColor("-11%")}`}>-11%</td>
                        <td className="border border-gray-300 p-1 text-right">25,450,600</td>
                        <td className="border border-gray-300 p-1 text-right">18,330,400</td>
                        <td className={`border border-gray-300 p-1 text-center ${getGrowthColor("39%")}`}>39%</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div className="p-4 bg-white mt-4 mb-4 rounded-lg">
                <table className="w-full border-collapse mb-4 bg-white">
                    <thead>
                    <tr style={{backgroundColor: '#0b3588', color: 'white'}}>
                        <th className="bg-blue-300 border border-gray-300 p-2 text-center"></th>
                        <th className="bg-blue-300 border border-gray-300 p-2 text-center">Feb-25</th>
                        <th className="bg-blue-300 border border-gray-300 p-2 text-center">Feb-24</th>
                        <th className="bg-blue-300 border border-gray-300 p-2 text-center">Growth</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="border border-gray-300 p-1 font-medium">Local Sales</td>
                        <td className="border border-gray-300 p-1 text-right">434,812,611</td>
                        <td className="border border-gray-300 p-1 text-right">393,254,868</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 p-1 font-medium">Global Sales</td>
                        <td className="border border-gray-300 p-1 text-right">25,450,600</td>
                        <td className="border border-gray-300 p-1 text-right">18,330,400</td>
                    </tr>
                    <tr className="font-bold">
                        <td className="border border-gray-300 p-1">Total</td>
                        <td className="border border-gray-300 p-1 text-right">460,263,211</td>
                        <td className="border border-gray-300 p-1 text-right">411,585,268</td>
                        <td className={`p-1 text-center border border-gray-300 ${getGrowthColor("12%")}`}>12%</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OnlineSalesGlobal;
