import React from 'react';

const Unstitiched = ({ data, title, color }) => {
    const getGrowthColor = (growth) => {
        return growth < 0 ? 'text-red' : 'text-emerald-600';
    };

    return (
        <div className="w-full bg-white overflow-x-auto overflow-y-auto" style={{ maxHeight: '650px' }}>
            <div className="min-w-full  border border-gray-400">
                <table className="w-full border-collapse table-auto">
                    <thead>
                    <tr>
                        <th
                            className={`text-left font-bold p-2 border border-gray-400 ${color}`}
                            colSpan={19}
                        >
                            {title || ''}
                        </th>
                    </tr>
                    {data?.thead?.length <= 0 ? (
                        <tr>
                            <th colSpan={19} className="text-center p-4 sticky top-0 z-40 bg-white">
                                No Data
                            </th>
                        </tr>
                    ) : (
                        <>
                            <tr className="text-white bg-[#383853] border border-gray-300">
                                <th
                                    className="border border-gray-400 p-2 font-medium bg-[#383853] sticky top-0 z-10"
                                >
                                    Full Price
                                </th>
                                {data?.thead?.map((thead, idx) => (
                                    <th
                                        key={idx}
                                        className="border border-gray-400 p-2 font-medium bg-[#383853] sticky top-0 z-20"
                                        colSpan={3}
                                    >
                                        {thead.season}
                                    </th>
                                ))}
                            </tr>
                            <tr className="text-white bg-[#383853]">
                                <th
                                    className="border border-gray-300 p-1 text-center sticky top-[38px] z-20 bg-[#383853]"
                                >
                                    Dates
                                </th>
                                {data?.thead?.map((thead, idx) => (
                                    <React.Fragment key={idx}>
                                        <th className="border border-gray-400 p-1 text-center">CY</th>
                                        <th className="border border-gray-400 p-1 text-center">LY</th>
                                        <th className="border border-gray-400 p-1 text-center">Growth%</th>
                                    </React.Fragment>
                                ))}
                            </tr>
                        </>
                    )}
                    </thead>

                    <tbody>
                    {data?.tbody?.map((row, rowIndex) => {
                        const seasons = Object.keys(row).filter((key) => key !== 'date');
                        const isLastRow = rowIndex === data.tbody.length - 1;

                        return (
                            <tr
                                className={`text-sm ${isLastRow ? 'text-white bg-[#4d5875]' : ''}`}
                                key={rowIndex}
                                style={
                                    isLastRow
                                        ? { position: 'sticky', bottom: 0, backgroundColor: '#4d5875', zIndex: 5 }
                                        : {}
                                }
                            >
                                <td
                                    className="border border-gray-400 p-2 text-center sticky left-0 text-black"
                                >
                                    {row.date}
                                </td>
                                {seasons.map((season) => {
                                    const { cy_sale, ly_sale, growth } = row[season];
                                    return (
                                        <React.Fragment key={season}>
                                            <td
                                                className={`border border-gray-400 text-right ${isLastRow ? 'text-white bg-[#4d5875]' : ''}`}
                                            >
                                                {cy_sale}
                                            </td>
                                            <td
                                                className={`border border-gray-400 text-right ${isLastRow ? 'text-white bg-[#4d5875]' : ''}`}
                                            >
                                                {ly_sale}
                                            </td>
                                            <td
                                                className={`border border-gray-400 font-bold text-center ${getGrowthColor(growth)} ${isLastRow ? 'text-white bg-[#4d5875]' : ''}`}
                                            >
                                                {growth}
                                            </td>
                                        </React.Fragment>
                                    );
                                })}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Unstitiched;
