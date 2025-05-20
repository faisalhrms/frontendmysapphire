import React from 'react';

const Unstitiched = ({ data, title, color }) => {
    const getGrowthColor = (growth) => {
        return growth < 0 ? 'text-red' : 'text-emerald-600';
    };

    return (
        <div className="p-6 bg-white mt-1 rounded-lg dark:text-gray-200 dark:bg-bodybg mb-6">
            <div className="w-full bg-white overflow-x-auto overflow-y-auto dark:text-gray-200 dark:bg-bodybg "
                 style={{maxHeight: '650px'}}>
                <div className="min-w-full  border border-gray-400">
                    <table className="w-full border-collapse table-auto">
                        <thead>
                        <tr
                            style={{position: 'sticky', top: 2, zIndex: 10, backgroundColor: '#383853'}}
                        >
                            <th
                                className={`text-sm text-white bg-[#383853] text-center p-2 border border-gray-300 ${color}`}
                                colSpan={19}
                                style={{borderCollapse: 'separate'}}
                            >
                                {title || ''}
                            </th>
                        </tr>

                        {data?.thead?.length <= 0 ? (
                            <div className="flex justify-center align-middle h-1/2">No Data</div>
                        ) : (
                            <>
                                <tr
                                    className="text-white bg-[#383853]"
                                    style={{position: 'sticky', top: '40px', zIndex: 9, backgroundColor: '#383853'}}
                                >
                                    <th
                                        className="border border-gray-300 p-2 font-medium"
                                        rowSpan={2}
                                        style={{backgroundColor: '#383853'}}
                                    >
                                        Full Price
                                    </th>
                                    {data?.thead?.map((thead) => (
                                        <th
                                            key={thead.season}
                                            className="border border-gray-300 p-2 text-sm"
                                            colSpan={3}
                                            style={{backgroundColor: '#383853'}}
                                        >
                                            {thead.season}
                                        </th>
                                    ))}
                                </tr>
                                <tr
                                    className="text-white bg-[#4d5875]"
                                    style={{position: 'sticky', top: '78px', zIndex: 8}}
                                >
                                    {data?.thead?.map((thead) => (
                                        <React.Fragment key={thead.season + '-subheaders'}>
                                            <th className="border border-gray-300 p-1 text-center">CY</th>
                                            <th className="border border-gray-300 p-1 text-center">LY</th>
                                            <th className="border border-gray-300 p-1 text-center">Growth%</th>
                                        </React.Fragment>
                                    ))}
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 p-2 text-sm bg-[#f2f4f5]">Dates</th>
                                    {data?.thead?.map((thead, idx) => (
                                        <React.Fragment key={'dates-' + idx}>
                                            <th className="border border-gray-300 p-1 text-right bg-[#f2f4f5]">
                                                {thead?.cy_launches.length > 0 && (
                                                    <select className="form-control form-control-sm border">
                                                        {thead?.cy_launches?.map((cy_launch, i) => (
                                                            <option key={i}>{cy_launch}</option>
                                                        ))}
                                                    </select>
                                                )}
                                            </th>
                                            <th className="border border-gray-300 p-1 text-right bg-[#f2f4f5]">
                                                {thead?.ly_launches.length > 0 && (
                                                    <select className="form-control form-control-sm border">
                                                        {thead?.ly_launches?.map((ly_launch, i) => (
                                                            <option key={i}>{ly_launch}</option>
                                                        ))}
                                                    </select>
                                                )}
                                            </th>
                                            <th className="border border-gray-300 p-1 text-center bg-[#f2f4f5]"></th>
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
                                    className={`text-sm ${isLastRow ? 'text-black bg-[#949eb7] font-bold' : ''}`}
                                    key={rowIndex}
                                    style={
                                        isLastRow
                                            ? {position: 'sticky', bottom: 0, zIndex: 5}
                                            : {}
                                    }
                                >
                                    <td
                                        className="border border-gray-400 p-2 text-center sticky font-bold left-0"
                                    >
                                        {row.date}
                                    </td>
                                    {seasons.map((season) => {
                                        const {cy_sale, ly_sale, growth} = row[season];
                                        return (
                                            <React.Fragment key={season}>
                                                <td
                                                    className={`border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-right ${isLastRow ? 'text-black font-bold ' : ''}`}
                                                >
                                                    {cy_sale}
                                                </td>
                                                <td
                                                    className={`border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-right ${isLastRow ? 'text-black font-bold ' : ''}`}
                                                >
                                                    {ly_sale}
                                                </td>
                                                <td
                                                    className={`border border-gray-400 font-bold text-center ${
                                                        (growth === 0 || growth === null || growth === undefined) ? 'dark:text-gray-200 dark:bg-bodybg ' : getGrowthColor(growth, isLastRow)
                                                    } ${isLastRow ? '' : ''}`}
                                                >
                                                    {(growth === 0 || growth === null || growth === undefined) ? '-' : `${growth}%`}
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
        </div>
            );
            };

export default Unstitiched;
