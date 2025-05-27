
import React from 'react';

const Unstitiched = ({ data, title, color }) => {
    const getGrowthColor = (growth) => {
        return growth < 0 ? 'text-red' : 'text-emerald-600';
    };

    return (
        <>
            <p className="text-primary p-2 rounded-lg text-right text-black">
                Amount in Rs.
            </p>

            <div className="p-6 bg-white mt-1 rounded-lg dark:text-gray-200 dark:bg-bodybg mb-6">
                <div
                    className="w-full bg-white overflow-x-auto overflow-y-auto dark:text-gray-200 dark:bg-bodybg border-2 border-blue-500 rounded-lg"
                    style={{ maxHeight: '650px' }}
                >
                    <div className="min-w-full">
                        <table className="w-full border-collapse table-auto">
                            <thead>
                            <tr
                                style={{
                                    position: 'sticky',
                                    top: 2,
                                    zIndex: 10,
                                    backgroundColor: '#383853',
                                }}
                            >
                                <th
                                    className={`text-sm text-white bg-[#383853]  text-center p-2 border-2 border-blue-400 ${color}`}
                                    colSpan={19}
                                    style={{ borderCollapse: 'separate' }}
                                >
                                    {title || ''}
                                </th>
                            </tr>

                            {data?.thead?.length <= 0 ? (
                                <tr>
                                    <td
                                        colSpan={19}
                                        className="flex justify-center align-middle h-1/2 p-4 text-center"
                                    >
                                        No Data
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    <tr
                                        className="text-white bg-[#383853]"
                                        style={{
                                            position: 'sticky',
                                            top: '40px',
                                            zIndex: 9,
                                            backgroundColor: '#383853',
                                        }}
                                    >
                                        <th
                                            className="border-2 border-blue-400 p-2 font-medium sticky left-0 bg-[#383853] z-30"
                                            rowSpan={2}
                                            style={{ minWidth: '120px' }}
                                        >
                                            Full Price
                                        </th>
                                        {data?.thead?.map((thead) => (
                                            <th
                                                key={thead.season}
                                                className="border-2 border-blue-400 p-2 text-sm"
                                                colSpan={3}
                                                style={{ backgroundColor: '#383853' }}
                                            >
                                                {thead.season}
                                            </th>
                                        ))}
                                    </tr>
                                    <tr
                                        className="text-white bg-[#4d5875]"
                                        style={{
                                            position: 'sticky',
                                            top: '78px',
                                           zIndex: 8,
                                            backgroundColor: '#4d5875'
                                        }}
                                    >
                                        {data?.thead?.map((thead) => (
                                            <React.Fragment key={thead.season + '-subheaders'}>
                                                <th className="border-2 border-blue-400 p-1 text-center min-w-[200px]">
                                                    CY
                                                </th>
                                                <th className="border-2 border-blue-400 p-1 text-center min-w-[200px]">
                                                    LY
                                                </th>
                                                <th className="border-2 border-blue-400 p-1 text-center min-w-[200px]">
                                                    Growth%
                                                </th>
                                            </React.Fragment>
                                        ))}
                                    </tr>
                                    <tr
                                        style={{
                                            // position: 'sticky',
                                            // top: '122px',
                                            // zIndex: 22,
                                            // backgroundColor: 'white'
                                        }}
                                    >
                                        <th className="border-2 border-blue-400 p-2 text-center sticky font-bold left-0 bg-white z-35 min-w-[120px]">
                                            Dates
                                        </th>
                                        {data?.thead?.map((thead, idx) => (
                                            <React.Fragment key={'dates-' + idx}>
                                                <th className="border border-400 p-1 text-right bg-white">
                                                    {thead?.cy_launches.length > 0 && (
                                                        <select
                                                            className="form-control form-control-sm border-2 border-blue-300 rounded">
                                                            {thead?.cy_launches?.map((cy_launch, i) => (
                                                                <option key={i}>{cy_launch}</option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </th>
                                                <th className="border-2 border-blue-400 p-1 text-right bg-white">
                                                    {thead?.ly_launches.length > 0 && (
                                                        <select
                                                            className="form-control form-control-sm border-2 border-blue-300 rounded">
                                                            {thead?.ly_launches?.map((ly_launch, i) => (
                                                                <option key={i}>{ly_launch}</option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </th>
                                                <th className="border-2 border-blue-400 p-1 text-center bg-white"></th>
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
                                const isTotalRow = isLastRow;

                                return (
                                    <tr
                                        className={`text-sm ${
                                            isTotalRow ? 'text-black bg-[#949eb7] font-bold' : ''
                                        }`}
                                        key={rowIndex}
                                        style={
                                            isTotalRow
                                                ? { position: 'sticky', bottom: 0, zIndex: 25, backgroundColor: '#949eb7' }
                                                : { zIndex: 1 }
                                        }
                                    >
                                        <td
                                            className={`border-2 border-blue-400 p-2 text-center sticky font-bold left-0 ${
                                                isTotalRow ? 'bg-[#949eb7]' : 'bg-white'
                                            } z-35 min-w-[120px]`}
                                        >
                                            {row.date}
                                        </td>
                                        {seasons.map((season) => {
                                            const { cy_sale, ly_sale, growth } = row[season];
                                            return (
                                                <React.Fragment key={season}>
                                                    <td
                                                        className={`border-2 border-blue-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-right ${
                                                            isTotalRow ? 'text-black font-bold bg-[#949eb7]' : 'bg-white'
                                                        }`}
                                                    >
                                                        {cy_sale}
                                                    </td>
                                                    <td
                                                        className={`border-2 border-blue-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-right ${
                                                            isTotalRow ? 'text-black font-bold bg-[#949eb7]' : 'bg-white'
                                                        }`}
                                                    >
                                                        {ly_sale}
                                                    </td>
                                                    <td
                                                        className={`border-2 border-blue-400 p-2 text-center font-bold ${
                                                            growth === 0 || growth === null || growth === undefined
                                                                ? 'dark:text-gray-200 dark:bg-bodybg'
                                                                : getGrowthColor(growth)
                                                        } ${isTotalRow ? 'text-black bg-[#949eb7]' : 'bg-white'}`}
                                                    >
                                                        {growth === 0 || growth === null || growth === undefined
                                                            ? '-'
                                                            : `${growth}%`}
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
        </>
    );
};

export default Unstitiched;