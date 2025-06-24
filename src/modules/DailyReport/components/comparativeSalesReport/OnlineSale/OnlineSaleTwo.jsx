import React from 'react';

const OnlineSalesTwo = ({ data ,getGrowthColor }) => {

    const formatDate = (date) => {
        if (!date) return '';
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            year: '2-digit',
        });
        return formattedDate;
    };
    return (
        <>
            <p className="text-primary p-2 rounded-lg text-right text-black">
                Amount in Rs.
            </p>

    <div className="p-4 bg-white mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
        <div className="mb-6">
                <table className="w-full border-collapse">
                    <thead  >
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
                            className={item.category === "Total" ? "font-bold bg-[#949eb7] dark:text-gray-200 dark:bg-bodybg text-black" : ""}
                        >
                            <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg   text-black">{item.category}</td>
                            <td className="border border-gray-300 p-1 text-right dark:text-gray-200 dark:bg-bodybg   text-black">{item.local_?.this_year || "-"}</td>
                            <td className="border border-gray-300 p-1 text-right dark:text-gray-200 dark:bg-bodybg   text-black">{item.local_?.last_year || "-"}</td>
                            <td className={`border border-gray-300 p-1 font-bold text-center  ${getGrowthColor(item.local_?.growth)}`}>
                                {item.local_?.growth}%
                            </td>
                            <td className="border border-gray-300 p-1 text-right dark:text-gray-200 dark:bg-bodybg   text-black">{item.global_?.this_year || "-"}</td>
                            <td className="border border-gray-300 p-1 text-right dark:text-gray-200 dark:bg-bodybg   text-black">{item.global_?.last_year || "-"}</td>
                            <td className={`border border-gray-300 p-1 font-bold text-center  ${getGrowthColor(item.global_?.growth)}`}>
                                {item.global_?.growth}%
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
};

export default OnlineSalesTwo;
