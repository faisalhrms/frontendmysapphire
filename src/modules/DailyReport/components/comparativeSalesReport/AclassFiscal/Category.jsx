import React from 'react';

const CategoryTable = ({ data,getGrowthColor }) => {
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
                <th className="py-2 px-2 border border-gray-400 p-2 text-center font-bold sticky left-16 z-50">Feb</th>
                <th className="py-2 px-4 border border-gray-400 p-2 text-center">Feb</th>
                <th className="py-2 px-4 border border-gray-400 p-2 text-center">Growth%</th>
                <th className="py-2 px-2 border border-gray-400 p-2 text-center font-bold sticky left-16 z-50">Feb</th>
                <th className="py-2 px-4 border border-gray-400 p-2 text-center">Feb</th>
                <th className="py-2 px-4 border border-gray-400 p-2 text-center">Growth%</th>
            </tr>
            </thead>
            <tbody>
            {data?.category_sales?.map((row, index) => (
                <tr>
                    <td className="font-bold border border-gray-400 p-2 ">{row?.category}</td>
                    <td className="border border-gray-400 p-2 text-right">{row?.offline?.this_year}</td>
                    <td className="border border-gray-400 p-2 text-right">{row?.offline?.last_year}</td>
                    <td className={`border border-gray-400 p-2 text-right ${getGrowthColor(row?.offline?.growth)}`}>{row?.offline?.growth}%</td>
                    <td className="border border-gray-400 p-2 text-right">{row?.online?.this_year}</td>
                    <td className="border border-gray-400 p-2 text-right">{row?.online?.last_year}</td>
                    <td className={`border border-gray-400 p-2 text-right ${getGrowthColor(row?.online?.growth)}`}>{row?.online?.growth}%</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
    )
};

export default CategoryTable;