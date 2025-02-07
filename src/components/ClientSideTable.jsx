import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import useFullScreen from "@hooks/useFullScreen.js";
import SimpleBar from "simplebar-react";

const ClientSideTable = ({ config = { headers: [] }, data = [], title = 'Table', height = '250px' }) => {
    const { headers } = config;
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState(data);

    const { isFullscreen, handleFullscreenClick } = useFullScreen();
    const containerHeight = isFullscreen ? "calc(100vh - 100px)" : height;

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
        <div className={`box custom-card ${isFullscreen ? 'box-fullscreen' : ''}`}>
            <div className="box-header justify-between">
                <div className="box-title">{title}</div>
                <div className="flex items-center gap-2">
                    <input
                        className="ti-form-control form-control-sm"
                        type="text"
                        placeholder="Search Here"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Link aria-label="anchor" to="#" className="terms-fullscreen" onClick={handleFullscreenClick}>
                        <i className="ri-fullscreen-line"></i>
                    </Link>
                </div>
            </div>
            <SimpleBar style={{ maxHeight: containerHeight }}>
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
                                <tr key={rowIndex}
                                    className="border border-inherit border-solid !text-center hover:bg-gray-100">
                                    {headers.map((header, colIndex) => (
                                        <td key={colIndex} className={`p-3 text-sm text-gray-700 ${header.align || '!text-center'}`}>
                                            {rowData[header.accessor] || "N/A"}
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
            </SimpleBar>
        </div>
    );
};

ClientSideTable.propTypes = {
    config: PropTypes.shape({
        headers: PropTypes.array,
    }),
    data: PropTypes.array,
    title: PropTypes.string,
};

export default React.memo(ClientSideTable);
