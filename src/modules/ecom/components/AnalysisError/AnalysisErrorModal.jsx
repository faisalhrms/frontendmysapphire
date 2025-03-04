import React from 'react';
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import {useEcom404Error} from "../../hooks/ecomHooks.js";
import AgingDatatable from "../SalesforceDashboard/AgingDatatable.jsx";
import {formatNumberWithCommas, toTitleCase} from "../../../../helpers/formatters.js";
import {Link} from "react-router-dom";

const AnalysisErrorModal = React.memo(({ date, onClose, filters }) => {

    const { data, isLoading } = useEcom404Error(date);
    const columns = [
        {
            Header: "Error Url",
            accessor: "error_url",
            Cell: ({ value }) => <Link to={value} target='_blank' className="text-left">{value}</Link>,
        },
        { Header: "Total Errors", accessor: "total_errors",
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
                <div className="relative bg-white dark:bg-gray-800 w-full h-full mx-auto">
                    <div className="flex justify-end p-4">
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
                    <div className="flex flex-col h-full p-4">
                        {isLoading ? (
                            <div className="flex justify-center items-center flex-grow">
                                <LoadingSpinner/>
                            </div>
                        ) : data &&  (
                            <AgingDatatable data={data} columns={columns}  pageSize={15} />
                    )}
                    </div>
                </div>
            </div>

        </>
    );
});
export default React.memo(AnalysisErrorModal);
