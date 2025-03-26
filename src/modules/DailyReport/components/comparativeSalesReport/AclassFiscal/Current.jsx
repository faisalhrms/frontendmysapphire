import React from 'react';
import { formatNumberWithCommas } from "@helpers/formatters.js";

const Current = () => {


    return (
        <div className="p-4 bg-white mt-4 mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
            <div className="mb-6 dark:text-gray-200 dark:bg-bodybg">
                <table className="w-full border-collapse dark:text-gray-200 dark:bg-bodybg">
                    <thead>
                    <tr style={{backgroundColor: "#0b3588", color: "white"}}>
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

    );
};

export default Current;
