import React from 'react';

const CategoryTable = ({ data,getGrowthColor }) => {
    const formatDate = (date) => {
        if (!date) return '';
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            year: '2-digit',
        });
        return formattedDate;
    };
    return (

    <div className="p-4 bg-white mt-4 mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
        <table className="w-full border-collapse">
            <thead>
            <tr className="text-white bg-[#383853]">
                <th rowSpan="2" className="border border-gray-400 p-2 font-bold sticky left-0 z-50">A Class</th>
                <th colSpan="6"
                    className="py-2 px-2 border border-gray-400 p-2 text-center sticky left-16 z-50">Full Price
                </th>
            </tr>
            <tr className="text-white bg-[#383853]">
                <th colSpan="3" className="py-2 px-2 border border-gray-400 p-2 text-center">Offline</th>
                <th colSpan="3" className="py-2 px-2 border border-gray-400 p-2 text-center">Online</th>
            </tr>
            <tr className="text-white bg-[#4d5875]">
                <th className="py-2 px-4 border border-gray-400 p-2 text-center sticky left-0 z-50"></th>
                <th className="bg-blue-200 border border-gray-300 p-2 text-center">{formatDate(data?.periods?.gregorian?.current?.to_date)}</th>
                <th className="bg-blue-200 border border-gray-300 p-2 text-center">{formatDate(data?.periods?.gregorian?.comparative?.to_date)}</th>
                <th className="py-2 px-4 border border-gray-400 p-2 text-center">Growth%</th>
                <th className="bg-blue-200 border border-gray-300 p-2 text-center">{formatDate(data?.periods?.gregorian?.current?.to_date)}</th>
                <th className="bg-blue-200 border border-gray-300 p-2 text-center">{formatDate(data?.periods?.gregorian?.comparative?.to_date)}</th>
                <th className="py-2 px-4 border border-gray-400 p-2 text-center">Growth%</th>
            </tr>
            </thead>
            <tbody>
            {data?.category_sales?.map((row, index) => (
                <tr
                    key={index}
                    className={row.category === "Total" ? "font-bold  bg-[#949eb7] dark:text-gray-200 dark:bg-bodybg text-black" : ""}>
                <td className=" border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg   text-black">{row?.category}</td>
                    <td className="border border-gray-400 p-2 text-right dark:text-gray-200 dark:bg-bodybg   text-black">{row?.offline?.this_year}</td>
                    <td className="border border-gray-400 p-2 text-right dark:text-gray-200 dark:bg-bodybg   text-black">{row?.offline?.last_year}</td>
                    <td className={`border border-gray-400 p-2 font-bold dark:text-gray-200 dark:bg-bodybg  text-black text-center ${getGrowthColor(row?.offline?.growth)}`}>{row?.offline?.growth}%</td>
                    <td className="border border-gray-400 p-2 text-right dark:text-gray-200 dark:bg-bodybg  text-black">{row?.online?.this_year}</td>
                    <td className="border border-gray-400 p-2 text-right  dark:text-gray-200 dark:bg-bodybg  text-black">{row?.online?.last_year}</td>
                    <td className={`border border-gray-400 font-bold p-2 text-center dark:text-gray-200 dark:bg-bodybg  text-black ${getGrowthColor(row?.online?.growth)}`}>{row?.online?.growth}%</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
    )
};

export default CategoryTable;