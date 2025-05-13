import React from 'react';

const OnlineSalesTwo = ({ data ,getGrowthColor }) => {

    const formatDate = (date) => {
        if (!date) return ''; // Handle null/undefined dates
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            year: '2-digit',
        });
        return formattedDate;
    };
    return (
        <div className="p-4 bg-white mt-4 mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
            <div className="mb-6">
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="text-white bg-[#383853]">
                        <th className="bg-blue-300 border border-gray-300 p-2 text-center" rowSpan="2">Category</th>
                        <th className="bg-blue-300 border border-gray-300 p-2 text-center" colSpan="3">Local</th>
                        <th className="bg-blue-300 border border-gray-300 p-2 text-center" colSpan="3">Global (Excl. UK)</th>
                    </tr>
                    <tr className="text-white bg-[#4d5875]">
                        <th className="bg-blue-200 border border-gray-300 p-2 text-center">{formatDate(data?.periods?.gregorian?.current?.to_date)}</th>
                        <th className="bg-blue-200 border border-gray-300 p-2 text-center">{formatDate(data?.periods?.gregorian?.comparative?.to_date)}</th>
                        <th className="bg-blue-200 border border-gray-300 p-2 text-center">Growth</th>
                        <th className="bg-blue-200 border border-gray-300 p-2 text-center">{formatDate(data?.periods?.gregorian?.current?.from_date)}</th>
                        <th className="bg-blue-200 border border-gray-300 p-2 text-center">{formatDate(data?.periods?.gregorian?.comparative?.from_date)}</th>
                        <th className="bg-blue-200 border border-gray-300 p-2 text-center">Growth</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data?.category_sales?.map((item, idx) => (
                        <tr
                            key={idx}
                            className={item.category === "Total" ? "font-bold bg-gray-200 dark:text-gray-200 dark:bg-bodybg" : ""}
                        >
                            <td className="border border-gray-400 p-2">{item.category}</td>
                            <td className="border border-gray-300 p-1 text-right">{item.local_?.this_year || "-"}</td>
                            <td className="border border-gray-300 p-1 text-right">{item.local_?.last_year || "-"}</td>
                            <td className={`border border-gray-300 p-1 text-center ${getGrowthColor(item.local_?.growth)}`}>
                                {item.local_?.growth}%
                            </td>
                            <td className="border border-gray-300 p-1 text-right">{item.global_?.this_year || "-"}</td>
                            <td className="border border-gray-300 p-1 text-right">{item.global_?.last_year || "-"}</td>
                            <td className={`border border-gray-300 p-1 text-center ${getGrowthColor(item.global_?.growth)}`}>
                                {item.global_?.growth}%
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OnlineSalesTwo;
