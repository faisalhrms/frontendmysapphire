import React from 'react';

const OnlineSalesGlobal = () => {
    const getGrowthColor = (growth) => {
        return growth.startsWith('-') ? 'text-danger' : 'text-success';
    };

    return (
        <div className="p-4 bg-white mt-4 mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
            <div className="mb-6">
                <table className="w-full border-collapse dark:text-gray-200 dark:bg-bodybg">
                    <thead>
                    <tr className="text-white bg-[#383853]">
                        <th className="bg-blue-300 border border-gray-300 p-2 text-center"></th>
                        <th className="bg-blue-300 border border-gray-300 p-2 text-center">Feb-25</th>
                        <th className="bg-blue-300 border border-gray-300 p-2 text-center">Feb-24</th>
                        <th className="bg-blue-300 border border-gray-300 p-2 text-center">Growth</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="font-bold border border-gray-400 p-2">Local Sales</td>
                        <td className="border border-gray-300 p-1 text-right">434,812,611</td>
                        <td className="border border-gray-300 p-1 text-right">393,254,868</td>
                    </tr>
                    <tr>
                        <td className="font-bold border border-gray-400 p-2">Global Sales</td>
                        <td className="border border-gray-300 p-1 text-right">25,450,600</td>
                        <td className="border border-gray-300 p-1 text-right">18,330,400</td>
                    </tr>
                    <tr className="font-bold bg-gray-200 dark:text-gray-200 dark:bg-bodybg">
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
