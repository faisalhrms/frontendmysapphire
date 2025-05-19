import React from 'react';

const Unstitiched = ({data,title , color}) => {
    const getGrowthColor = (growth) => {
        return growth < 0 ? 'text-red' : 'text-emerald-600';
    };
    return (
        <div className="w-full overflow-x-auto bg-white">
            <table className="w-full border-collapse">
                <thead>
                <tr>
                    <th className={`font-medium text-center p-2 border border-gray-300 ${color}`}
                        colSpan={19}>
                        {title || ''}
                    </th>
                </tr>
                {data?.thead?.length <= 0 ? <div className='flex justify-center align-middle h-1/2'>No Data</div> :
                    (<>
                        <tr className="text-white bg-[#383853]">
                            <th className="border border-gray-300 p-2 font-medium" rowSpan={2}>Full Price</th>
                            {
                                data?.thead?.map((thead) => (
                                    <th className="border border-gray-300 p-2 font-medium"
                                        colSpan={3}>{thead.season}</th>
                                ))
                            }
                        </tr>
                        <tr className="text-white bg-[#383853]">
                            {
                                data?.thead?.map((thead) => (
                                    <>
                                        <th className="border border-gray-300 p-1 text-center">CY</th>
                                        <th className="border border-gray-300 p-1 text-center">LY</th>
                                        <th className="border border-gray-300 p-1 text-center">Growth%</th>
                                    </>
                                ))
                            }
                        </tr>
                        <tr className="text-white bg-[#4d5875]">
                            <th className="border border-gray-300 p-2 font-medium">Dates</th>
                            {
                                data?.thead?.map((thead) => (
                                    <>
                                        <th className="border border-gray-300 p-1 text-right">
                                            {
                                                thead?.cy_launches.length > 0 &&
                                                <select
                                                    className="form-control form-control-sm border"
                                                >
                                                    {
                                                        thead?.cy_launches?.map((cy_launch) => (
                                                            <option>{cy_launch}</option>
                                                        ))
                                                    }
                                                </select>
                                            }
                                        </th>
                                        <th className="border border-gray-300 p-1 text-right">
                                            {
                                                thead?.ly_launches.length > 0 &&
                                                <select
                                                    className="form-control form-control-sm border"
                                                >
                                                    {
                                                        thead?.ly_launches?.map((ly_launch) => (
                                                            <option>{ly_launch}</option>
                                                        ))
                                                    }
                                                </select>
                                            }
                                        </th>
                                        <th className="border border-gray-300 p-1 text-center"></th>
                                    </>
                                ))
                            }
                        </tr>
                    </>)}

                </thead>


                <tbody>
                {data?.tbody?.map((row, rowIndex) => {
                    const seasons = Object.keys(row).filter(key => key !== 'date');
                    const isLastRow = rowIndex === data.tbody.length - 1;  // check if last row

                    return (
                        <tr className="bg-blue-100 text-xs" key={rowIndex}>
                            <td className={`border border-gray-300 p-1 text-center ${isLastRow ? 'text-white bg-[#4d5875]' : ''}`}>{row.date}</td>
                            {seasons.map(season => {
                                const {cy_sale, ly_sale, growth} = row[season];
                                return (
                                    <React.Fragment key={season}>
                                        <td className={`border  border-gray-400 text-black dark:text-gray-200 dark:bg-bodybg text-right ${isLastRow ? 'text-white bg-[#4d5875]' : ''}`}>{cy_sale}</td>
                                        <td className={`border  border-gray-400 text-black dark:text-gray-200 dark:bg-bodybg text-right ${isLastRow ? 'text-white bg-[#4d5875]' : ''}`}>{ly_sale}</td>
                                        <td className={`border  border-gray-400 text-black dark:text-gray-200 dark:bg-bodybg  text-center ${getGrowthColor(growth)} ${isLastRow ? 'text-white bg-[#4d5875]' : ''}`}>
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
    );
};

export default Unstitiched;
