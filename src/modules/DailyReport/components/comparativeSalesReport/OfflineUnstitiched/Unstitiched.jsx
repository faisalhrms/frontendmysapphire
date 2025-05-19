import React from 'react';

const Unstitiched = ({data}) => {
    return (
        <div className="w-full overflow-x-auto bg-white">
            <table className="w-full border-collapse">
                <thead>
                <tr>
                    <th className="bg-black text-white font-medium text-center p-2 border border-gray-300"
                        colSpan={19}>
                        Unstitched Women
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr className="bg-blue-100">
                    <th className="border border-gray-300 p-2 font-medium" rowSpan={2}>Full Price</th>
                    {
                        data?.thead?.map((thead) => (
                            <th className="border border-gray-300 p-2 font-medium" colSpan={3}>{thead.season}</th>
                        ))
                    }
                </tr>
                <tr className="bg-blue-100">
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
                <tr className="bg-blue-100">
                    <th className="border border-gray-300 p-2 font-medium">Dates</th>
                    {
                        data?.thead?.map((thead) => (
                            <>
                                <th className="border border-gray-300 p-1 text-center">
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
                                <th className="border border-gray-300 p-1 text-center">
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

                {/* Row 3 - Dates */}

                {data?.tbody?.map((row, index) => (
                    <tr className="bg-blue-100 text-xs" key={index}>
                        <td className="border border-gray-300 p-1">{row.date}</td>
                        {Object.keys(row).filter(key => key !== 'date').map(season => {
                            const {cy_sale, ly_sale, growth} = row[season];
                            return (
                                <>
                                    <td className="border border-gray-300 p-1">{cy_sale}</td>
                                    <td className="border border-gray-300 p-1">{ly_sale}</td>
                                    <td className="border border-gray-300 p-1">{growth}%</td>
                                </>
                            );
                        })}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Unstitiched;
