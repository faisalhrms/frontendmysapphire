import React from 'react';
import {formatDate} from "@helpers/dateTime.js";
const CurrentPeriodTable = ({ data}) => {
    return (
        <>
            <p className="text-primary p-2 rounded-lg text-right text-black">
                Amount in Rs.
            </p>

    <div className="p-4 bg-white  mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
        <div className="mb-6 dark:text-gray-200 dark:bg-bodybg">
                <table className="w-full border-collapse dark:text-gray-200 dark:bg-bodybg">
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
                        <td className="border border-gray-400 p-2 text-center">{formatDate(data?.periods?.gregorian?.current?.from_date)}</td>
                        <td className="border border-gray-400 p-2 text-center">{formatDate(data?.periods?.gregorian?.comparative?.from_date)}</td>
                    </tr>
                    <tr>
                        <td className="font-bold p-2 border border-gray-400">To</td>
                        <td className="border border-gray-400 p-2 text-center">{formatDate(data?.periods?.gregorian?.current?.to_date)}</td>
                        <td className="border border-gray-400 p-2 text-center">{formatDate(data?.periods?.gregorian?.comparative?.to_date)}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
};

export default CurrentPeriodTable;
