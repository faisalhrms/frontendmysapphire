import React from 'react';

const AClassIslamic = ({ data ,getGrowthColor }) => {
console.log(data)
    return (
        <div className="p-4 bg-white mt-4 mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
            <table className="w-full border-collapse">
                <thead>
                <tr className="text-white bg-[#383853]">
                    <th rowSpan="2" className="bg-blue-300 border border-gray-400 p-2">A-Class</th>
                    <th colSpan="3" className="bg-blue-300 border border-gray-400 p-2 text-center">Offline</th>
                    <th colSpan="3" className="bg-blue-300 border border-gray-400 p-2 text-center">Online (Excl. UK)</th>
                </tr>
                <tr className="text-white bg-[#383853]">
                    <th className="bg-blue-200 border border-gray-400 p-2 text-center">{data?.periods?.hijri?.current?.to_date}</th>
                    <th className="bg-blue-200 border border-gray-400 p-2 text-center">{data?.periods?.hijri?.current?.from_date}</th>
                    <th className="bg-blue-200 border border-gray-400 p-2 text-center">Growth</th>
                    <th className="bg-blue-200 border border-gray-400 p-2 text-center">{data?.periods?.hijri?.comparative?.to_date}</th>
                    <th className="bg-blue-200 border border-gray-400 p-2 text-center">{data?.periods?.hijri?.comparative?.from_date}</th>
                    <th className="bg-blue-200 border border-gray-400 p-2 text-center">Growth</th>
                </tr>
                </thead>
                <tbody>
                {data.category_sales.map((item, index) => (
                    <tr key={index}>
                        <td className="font-bold border border-gray-400 p-2">{item.category}</td>
                        <td className="border border-gray-400 p-2 text-right">{item.offline?.this_year ?? '-'}</td>
                        <td className="border border-gray-400 p-2 text-right">{item.offline?.last_year ?? '-'}</td>
                        <td className={`border border-gray-400 p-2 text-right ${getGrowthColor(item.offline?.growth ?? 0)}`}>
                            {item.offline?.growth ?? 0}%
                        </td>
                        <td className="border border-gray-400 p-2 text-right">{item.online?.this_year ?? '-'}</td>
                        <td className="border border-gray-400 p-2 text-right">{item.online?.last_year ?? '-'}</td>
                        <td className={`border border-gray-400 p-2 text-right ${getGrowthColor(item.online?.growth ?? 0)}`}>
                            {item.online?.growth ?? 0}%
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AClassIslamic;
