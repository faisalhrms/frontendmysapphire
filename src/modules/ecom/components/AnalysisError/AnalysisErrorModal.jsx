import React, { useState, useMemo } from 'react';
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { useEcom404Error } from "../../hooks/ecomHooks.js";
import AgingDatatable from "../SalesforceDashboard/AgingDatatable.jsx";
import { formatNumberWithCommas } from "../../../../helpers/formatters.js";
import { Link } from "react-router-dom";

const AnalysisErrorModal = React.memo(({ title, date, onClose, filters }) => {
    const { data, isLoading } = useEcom404Error(date);


    const [searchTerm, setSearchTerm] = useState('');


    const filteredData = useMemo(() => {
        if (!searchTerm) return data;
        return data.filter(item => item.error_url.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [data, searchTerm]);

    const columns = [
        {
            Header: "Error Url",
            accessor: "error_url",
            Cell: ({ value }) => (
                <Link
                    to={value}
                    target='_blank'
                    className="text-left break-words hover:text-blue-500"
                    style={{ display: 'block', whiteSpace: 'normal', wordWrap: 'break-word' }}
                    title={value}
                >
                    {value}
                </Link>
            ),
        },
        {
            Header: "Tabs Url",
            accessor: "abs_url",
            Cell: ({ value }) => (
                <Link
                    to={value}
                    target='_blank'
                    className="text-left break-words hover:text-blue-500"
                    style={{ display: 'block', whiteSpace: 'normal', wordWrap: 'break-word' }}
                    title={value}
                >
                    {value}
                </Link>
            ),
        },
        {
            Header: "First Click",
            accessor: "first_click",
            Cell: ({ value }) => (
                <div className="text-left break-words" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                    {value}
                </div>
            ),
        },

        {
            Header: "Total Errors",
            accessor: "total_errors",
            Cell: ({ value }) => <div className="text-center">{formatNumberWithCommas(value)}</div>
        },
    ];

    return (
        <>
            <div id='TaskStatsModal'
                 className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:text-gray-200 dark:bg-bodybg"
                 aria-modal="true"
                 role="dialog"
                 aria-labelledby="milestoneModalTitle">
                <div className="relative w-[1200px] bg-white rounded-lg shadow-lg max-h-[90vh] flex flex-col">
                    <div className="sticky top-0 bg-white z-10 p-4 flex justify-between items-center border-b rounded-lg dark:text-gray-200 dark:bg-bodybg">
                        <h2  className="text-xl font-semibold text-gray-800 dark:text-gray-200 dark:bg-bodybg">{title}</h2>
                        <button
                            onClick={onClose}
                            type="button"
                            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
                            aria-label="Close modal"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="p-4 flex justify-end">
                        <input
                            type="text"
                            placeholder="Search by URL..."
                            className="form-control form-control-sm w-1/4 p-2 border rounded-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="p-4 overflow-x-auto flex-grow dark:text-gray-200 dark:bg-bodybg">
                        {isLoading ? (
                            <div className="flex justify-center items-center flex-grow ">
                                <LoadingSpinner />
                            </div>
                        ) : filteredData && (
                            <AgingDatatable data={filteredData} columns={columns} pageSize={5} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
});

export default React.memo(AnalysisErrorModal);
