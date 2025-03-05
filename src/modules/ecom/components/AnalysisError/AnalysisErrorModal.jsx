import React from 'react';
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { useEcom404Error } from "../../hooks/ecomHooks.js";
import AgingDatatable from "../SalesforceDashboard/AgingDatatable.jsx";
import { formatNumberWithCommas } from "../../../../helpers/formatters.js";
import { Link } from "react-router-dom";

const AnalysisErrorModal = React.memo(({ title, date, onClose, filters }) => {
    const { data, isLoading } = useEcom404Error(date);
    const columns = [
        {
            Header: "Error Url",
            accessor: "error_url",
            Cell: ({ value }) => <Link to={value} target='_blank' className="text-left">{value}</Link>,
        },
        {
            Header: "Total Errors",
            accessor: "total_errors",
            Cell: ({ value }) => <div className="text-right">{formatNumberWithCommas(value)}</div>
        },
    ];

    return (
        <>
            <div id='TaskStatsModal'
                 className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                 aria-modal="true"
                 role="dialog"
                 aria-labelledby="milestoneModalTitle">
                <div className="relative w-[1200px] bg-white rounded-lg shadow-lg max-h-[90vh] flex flex-col">


                    <div className="sticky top-0 bg-white z-10 p-4 flex justify-between items-center border-b rounded-lg ">
                        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
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


                    <div className="p-4 overflow-y-auto flex-grow">
                        {isLoading ? (
                            <div className="flex justify-center items-center flex-grow">
                                <LoadingSpinner />
                            </div>
                        ) : data && (
                            <AgingDatatable data={data} columns={columns} pageSize={10} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
});

export default React.memo(AnalysisErrorModal);
