import React, {useEffect, useState} from 'react';

const Table = ({ tableConfig}) => {
    const { headers, data } = tableConfig;
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState(data);


    useEffect(() => {
        const lowercasedFilter = searchTerm.toLowerCase();
        const newFilteredData = data.filter(item =>
            Object.keys(item).some(key =>
                String(item[key]).toLowerCase().includes(lowercasedFilter)
            )
        );
        setFilteredData(newFilteredData);
    }, [searchTerm, data]);

    return (
        <div>

            <div className="box-header flex justify-between items-center ">
                <h2 className="box-title text-xl font-semibold">Transaction History</h2>
                <input
                    type="text"
                    placeholder="Search here"
                    className="ti-form-control form-control-sm "
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="box overflow-x-auto">
                <table className="min-w-full  border-b border-defaultborder">
                    <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} scope="col"
                                className="text-left px-6 py-3 text-xs font-semibold text-gray-600 sm:text-sm">
                                {header.label}
                            </th>
                        ))}
                    </tr>
                    </thead>

                    <tbody>
                    {filteredData?.map((rowData, rowIndex) => (
                        <tr key={rowIndex} className="border-b border-defaultborder">
                            {headers.map((header, colIndex) => (
                                <td key={colIndex}
                                    className="px-6 py-4 text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                                    {rowData[header.key] || 'N/A'}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default Table;
