import React from 'react';

const Unstitiched = ({ data, title, color }) => {
    const getGrowthColor = (growth) => {
        return growth < 0 ? 'text-red-600' : 'text-emerald-600';
    };

    return (

        <div
            className="w-full bg-white overflow-y-auto"
            style={{ maxHeight: '650px' }}
        >

            <div className="min-w-full">
                <table className="w-full border-collapse">
                    <thead>
                    <tr>
                        <th
                            className={`font-medium text-center p-2 border border-gray-300 ${color}`}
                            colSpan={19}
                            style={{
                                position: 'sticky',
                                top: 0,
                                backgroundColor: 'white',
                                zIndex: 50,
                            }}
                        >
                            {title || ''}
                        </th>
                    </tr>
                    {data?.thead?.length <= 0 ? (
                        <tr>
                            <th
                                colSpan={19}
                                className="text-center p-4"
                                style={{ backgroundColor: 'white', position: 'sticky', top: 40, zIndex: 40 }}
                            >
                                No Data
                            </th>
                        </tr>
                    ) : (
                        <>
                            <tr
                                className="text-white bg-[#383853]"
                                style={{ position: 'sticky', top: 40, zIndex: 45 }}
                            >
                                <th
                                    className="border border-gray-300 p-2 font-medium bg-[#383853]"
                                    rowSpan={2}

                                >
                                    Full Price
                                </th>
                                {data?.thead?.map((thead, idx) => (
                                    <th
                                        key={idx}
                                        className="border border-gray-300 p-2 font-medium bg-[#383853]"
                                        colSpan={3}

                                    >
                                        {thead.season}
                                    </th>
                                ))}
                            </tr>
                            <tr
                                className="text-white bg-[#383853]"
                                style={{ position: 'sticky', top: 72, zIndex: 45 }}
                            >
                                {data?.thead?.map((thead, idx) => (
                                    <React.Fragment key={idx}>
                                        <th className="border border-gray-300 p-1 text-center">CY</th>
                                        <th className="border border-gray-300 p-1 text-center">LY</th>
                                        <th className="border border-gray-300 p-1 text-center">Growth%</th>
                                    </React.Fragment>
                                ))}
                            </tr>
                            <tr
                                className="text-white bg-[#4d5875]"
                                style={{ position: 'sticky', top: 96, zIndex: 44 }}
                            >
                                <th
                                    className="border border-gray-300 p-2 font-medium bg-[#4d5875]"

                                >
                                    Dates
                                </th>
                                {data?.thead?.map((thead, idx) => (
                                    <React.Fragment key={idx}>
                                        <th
                                            className="border border-gray-300 p-1 text-right bg-[#4d5875]"

                                        >
                                            {thead?.cy_launches.length > 0 && (
                                                <select className="form-control form-control-sm border">
                                                    {thead.cy_launches.map((cy_launch, i) => (
                                                        <option key={i}>{cy_launch}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </th>
                                        <th
                                            className="border border-gray-300 p-1 text-right bg-[#4d5875]"

                                        >
                                            {thead?.ly_launches.length > 0 && (
                                                <select className="form-control form-control-sm border">
                                                    {thead.ly_launches.map((ly_launch, i) => (
                                                        <option key={i}>{ly_launch}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </th>
                                        <th
                                            className="border border-gray-300 p-1 text-center bg-[#4d5875]"
                                         
                                        ></th>
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
                                className={`bg-blue-100 text-xs ${
                                    isLastRow ? 'text-white bg-[#4d5875]' : ''
                                }`}
                                key={rowIndex}
                                style={
                                    isLastRow
                                        ? { position: 'sticky', bottom: 0, zIndex: 40 }
                                        : {}
                                }
                            >
                                <td className="border border-gray-300 p-1 text-center">
                                    {row.date}
                                </td>
                                {seasons.map((season) => {
                                    const { cy_sale, ly_sale, growth } = row[season];
                                    return (
                                        <React.Fragment key={season}>
                                            <td
                                                className={`border border-gray-400 text-black dark:text-gray-200 dark:bg-bodybg text-right ${
                                                    isLastRow ? 'text-white bg-[#4d5875]' : ''
                                                }`}
                                            >
                                                {cy_sale}
                                            </td>
                                            <td
                                                className={`border border-gray-400 text-black dark:text-gray-200 dark:bg-bodybg text-right ${
                                                    isLastRow ? 'text-white bg-[#4d5875]' : ''
                                                }`}
                                            >
                                                {ly_sale}
                                            </td>
                                            <td
                                                className={`border border-gray-400 text-black dark:text-gray-200 dark:bg-bodybg text-center ${
                                                    getGrowthColor(growth)
                                                } ${isLastRow ? 'text-white bg-[#4d5875]' : ''}`}
                                            >
                                                {growth}%
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
