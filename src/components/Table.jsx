import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ProgressBar from "@components/ProgressBar";

const statusColors = {
    success: "bg-success/10 text-success",
    warning: "bg-warning-100 text-warning-800",
    red: "bg-danger text-red-800",
    yellow: "bg-warning text-warning-800",
    green: "bg-success text-success-800",
};

const Table = ({ tableConfig, data }) => {
    const { headers = [] } = tableConfig || {};
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState(data || []);

    useEffect(() => {
        const lowercasedFilter = searchTerm.toLowerCase();
        const newFilteredData = (data || []).filter(item =>
            Object.keys(item).some(key =>
                String(item[key]).toLowerCase().includes(lowercasedFilter)
            )
        );
        setFilteredData(newFilteredData);
    }, [searchTerm, data]);

    return (
        <div className="box custom-card">
            <div className="box-header justify-between">
                <div className="box-title">Milestone Status</div>
                <div className="flex flex-wrap gap-2">
                    <input
                        className="ti-form-control form-control-sm"
                        type="text"
                        placeholder="Search Here"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="box-body">
                <div className="overflow-x-auto">
                    <table className="table min-w-full whitespace-nowrap table-hover border table-bordered">
                        <thead>
                        <tr className="border border-inherit border-solid dark:border-defaultborder/10">
                            {headers.map((header, index) => (
                                <th key={index} className="!text-center !text-[0.85rem]">{header.label}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {filteredData.length > 0 && headers.length > 0 ? (
                            filteredData.map((rowData, rowIndex) => (
                                <tr key={rowIndex} className="border border-inherit border-solid !text-center   hover:bg-gray-100">
                                    {headers.map((header, colIndex) => (
                                        <td key={colIndex} className="p-3 text-sm t text-gray-700 !text-center ">
                                            {header.accessor === "actual_progress" || header.accessor === "expected_progress" ? (
                                                <ProgressBar value={rowData[header.accessor]} withStatus={false} />
                                            ) : header.accessor === "overdue_tasks" ? (
                                                <span className="text-danger font-semibold !text-center ">{rowData[header.accessor] || "0"}</span>
                                            ) : header.accessor === "risk_level" ? (
                                                <span className="bg-danger/10 text-danger px-2 py-1 rounded-md font-semibold !text-center ">
                                                    {rowData[header.accessor] || "N/A"}
                                                </span>
                                            ) : (
                                                rowData[header.accessor] || "N/A"
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={headers.length} className="text-center py-4">No data available</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

Table.propTypes = {
    tableConfig: PropTypes.shape({
        headers: PropTypes.array,
    }),
    data: PropTypes.array,
};

Table.defaultProps = {
    tableConfig: {
        headers: [],
    },
    data: [],
};

export default Table;