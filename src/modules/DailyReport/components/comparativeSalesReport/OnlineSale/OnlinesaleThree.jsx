import React from 'react';

const OnlineSalesThree = ({ data,getGrowthColor }) => {
    const salesSummary = data?.sales_summary;

    const formatDate = (date) => {
        if (!date) return ''; // Handle null/undefined dates
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            year: '2-digit',
        });
        return formattedDate;
    };


    const local = salesSummary?.data?.find(row => row.category === 'Local');
    const global = salesSummary?.data?.find(row => row.category === 'Global');
    const total = salesSummary?.data?.find(row => row.category === 'Total');

    return (
        <div className="p-4 bg-white mt-4 mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
            <div className="mb-6">
                <table className="w-full border-collapse dark:text-gray-200 dark:bg-bodybg">
                    <thead>
                    <tr className="text-white bg-[#383853]">
                        <th className="bg-blue-300 border border-gray-300 p-2 text-center"></th>
                        <th className="bg-blue-300 border border-gray-300 p-2 text-center">{formatDate(data?.periods?.gregorian?.current?.to_date)}</th>
                        <th className="bg-blue-300 border border-gray-300 p-2 text-center">{formatDate(data?.periods?.gregorian?.comparative?.to_date)}</th>
                        <th className="bg-blue-300 border border-gray-300 p-2 text-center">Growth</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="font-bold border border-gray-400 p-2">Local Sales</td>
                        <td className="border border-gray-300 p-1 text-right text-black dark:text-gray-200 dark:bg-bodybg ">{local?.this_year?.mtd}</td>
                        <td className="border border-gray-300 p-1 text-right text-black dark:text-gray-200 dark:bg-bodybg ">{local?.last_year?.mtd}</td>
                        <td className={`p-1 text-center border border-gray-300 ${getGrowthColor(local?.growth)}`}>
                            {local?.growth}%
                        </td>
                    </tr>
                    <tr>
                        <td className="font-bold border border-gray-400 p-2 ">Global Sales</td>
                        <td className="border border-gray-300 p-1 text-right text-black dark:text-gray-200 dark:bg-bodybg ">{global?.this_year?.mtd}</td>
                        <td className="border border-gray-300 p-1 text-right text-black dark:text-gray-200 dark:bg-bodybg ">{global?.last_year?.mtd}</td>
                        <td className={`p-1 text-center border font-bold border-gray-300  ${getGrowthColor(global?.growth)}`}>
                            {global?.growth}%
                        </td>
                    </tr>
                    <tr className="font-bold bg-[#949eb7] dark:text-gray-200 dark:bg-bodybg text-black">
                        <td className="border border-gray-300 p-1 ">Total</td>
                        <td className="border border-gray-300 p-1 text-right text-black dark:text-gray-200 dark:bg-bodybg ">{total?.this_year?.mtd}</td>
                        <td className="border border-gray-300 p-1 text-right text-black dark:text-gray-200 dark:bg-bodybg ">{total?.last_year?.mtd}</td>
                        <td className={`p-1 text-center border border-gray-300 font-bold text-black ${getGrowthColor(total?.growth)}`}>
                            {total?.growth}%
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OnlineSalesThree;
