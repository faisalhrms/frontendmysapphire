// import React, { useEffect, useState } from "react";
// import ExecutiveSummaryTable from "./ExecutiveSummaryTable.jsx";
// import LoadingSpinner from "@components/LoadingSpinner.jsx";
// import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
// import { formatNumberWithCommas } from "@helpers/formatters.js";
// import Model from "./Model.jsx";
// import EcomDatatable from "@modules/ecom/components/EcomSalesForce/EcomDatatable.jsx";
//
// const OrdersFulfillmentSummary = ({ filters, dateFrom, dateTo }) => {
//     const validDateFrom =
//         dateFrom || new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0];
//     const validDateTo = dateTo || new Date().toISOString().split("T")[0];
//
//
//     const [showModal, setShowModal] = useState(false);
//     const [isModalLoading, setModalLoading] = useState(false);
//     const [modalType, setModalType] = useState(null);
//     const [apiData, setApiData] = useState(null);
//
//     const { data, isLoading } = useFetchWithFilters(
//         "/salesforce/fetch_executive_summary/",
//         filters,
//         validDateFrom,
//         validDateTo
//     );
//
//     const { summary = {}, fulfilment_data = [] } = data || {};
//
//     useEffect(() => {
//         if (data) {
//             console.log("📦 Orders Fulfillment Summary Data:", data);
//         }
//     }, [data]);
//
//     const openModal = (type) => {
//         setModalType(type);
//         setShowModal(true);
//         setModalLoading(true);
//         setModalLoading(false);
//     };
//
//     const renderRow = (label, value, bold = false) => ({
//         label: <span className={`dark:text-gray-200 dark:bg-bodybg ${bold ? "font-bold" : ""}`}>{label}</span>,
//         accessor: <span className="dark:text-gray-200 dark:bg-bodybg">
//               <span
//                   className="text-gray-800 hover:underline hover:font-bold dark:text-gray-200 dark:bg-bodybg">{formatNumberWithCommas(value)}</span>
//            </span>,
//     });
//
//     const fulfillmentData = isLoading
//         ? [{label: <LoadingSpinner/>, accessor: ""}]
//         : [
//             renderRow("Total Parcels to Fulfill", summary.total_fo_to_fulfil),
//             ...fulfilment_data.map((item) => {
//                 const handleClick = () => openModal(item.status);
//
//                 return {
//                     label: (
//                         <div
//                             onClick={handleClick}
//                             style={{ cursor: "pointer", display: "inline-block", width: "100%" }}
//                             title={`Click to open modal for ${item.status}`}
//                         >
//                             {item.status}
//                         </div>
//                     ),
//                     accessor: (
//                         <div
//                             onClick={handleClick}
//                             style={{cursor: "pointer", display: "inline-block", width: "100%", textAlign: "right"}}
//                             title={`Click to open modal for ${item.status}`}
//                         >
//                              <span
//                                  className="text-gray-800 hover:underline hover:font-bold dark:text-gray-200 dark:bg-bodybg">
//                                  {formatNumberWithCommas(item.value)}
//                         </span>
//
//                         </div>
//                     ),
//                 };
//             }),
//             renderRow("Reconciliation", summary.reconciliation, true),
//         ];
//
//     return (
//         <>
//             <ExecutiveSummaryTable
//                 title="Orders Fulfillment Summary"
//                 data={fulfillmentData}
//                 totals={[]}
//                 isLoading={isLoading}
//             />
//
//             {showModal && (
//                 <Model modalType={modalType} loading={isModalLoading} onClose={() => setShowModal(false)}>
//                     <EcomDatatable data={apiData} type={modalType} />
//                 </Model>
//             )}
//         </>
//     );
// };
//
// export default OrdersFulfillmentSummary;

import React, { useState, useEffect } from "react";
import ExecutiveSummaryTable from "./ExecutiveSummaryTable.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import { formatNumberWithCommas } from "@helpers/formatters.js";

const OrdersFulfillmentSummary = ({ filters, dateFrom, dateTo }) => {
    const validDateFrom = dateFrom || new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0];
    const validDateTo = dateTo || new Date().toISOString().split("T")[0];


    const { data, isLoading } = useFetchWithFilters('/salesforce/fetch_executive_summary/', filters, dateFrom, dateTo);
    const { summary = {
        reconciliation() {

        }
    }, fulfilment_data = [] } = data || {};

    const fulfillmentData = isLoading
        ? [{ label: <LoadingSpinner />, accessor: "" }]
        : [
            {
                label: <span className="dark:text-gray-200 dark:bg-bodybg">Total Parcels to Fulfill</span>,
                accessor: <span className="dark:text-gray-200 dark:bg-bodybg">{formatNumberWithCommas(summary.total_fo_to_fulfil)}</span>
            },
            {
                label: <span className="dark:text-gray-200 dark:bg-bodybg">Un-Approved FOs</span>,
                accessor: <span className="dark:text-gray-200 dark:bg-bodybg">{formatNumberWithCommas(fulfilment_data.find(row => row.status === "Un-Approved FOs")?.value )}</span>
            },
            {
                label: <span className="dark:text-gray-200 dark:bg-bodybg" >Approved FOs</span>,
                accessor: <span className="dark:text-gray-200 dark:bg-bodybg">{formatNumberWithCommas(fulfilment_data.find(row => row.status === "Approved FOs")?.value )}</span>
            },
            {
                label: <span className="dark:text-gray-200 dark:bg-bodybg">Dispatched but Not Picked</span>,
                accessor: <span className="dark:text-gray-200 dark:bg-bodybg">{formatNumberWithCommas(fulfilment_data.find(row => row.status === "Dispatched but Not Picked")?.value )}</span>
            },
            {
                label: <span className="dark:text-gray-200 dark:bg-bodybg">In Transit</span>,
                accessor: <span className="dark:text-gray-200 dark:bg-bodybg">{formatNumberWithCommas(fulfilment_data.find(row => row.status === "In transit")?.value )}</span>
            },
            {
                label: <span className="dark:text-gray-200 dark:bg-bodybg">Delivered</span>,
                accessor: <span className="dark:text-gray-200 dark:bg-bodybg">{formatNumberWithCommas(fulfilment_data.find(row => row.status === "Delivered")?.value )}</span>
            },
            {
                label: <span className="dark:text-gray-200 dark:bg-bodybg">Returned</span>,
                accessor: <span className="dark:text-gray-200 dark:bg-bodybg">{formatNumberWithCommas(fulfilment_data.find(row => row.status === "Returned")?.value )}</span>
            },
            {
                label: <span className="dark:text-gray-200 dark:bg-bodybg">Others</span>,
                accessor: <span className="dark:text-gray-200 dark:bg-bodybg">{formatNumberWithCommas(fulfilment_data.find(row => row.status === "Others")?.value )}</span>
            },
            {
                label: <span className="dark:text-gray-200 dark:bg-bodybg font-bold" >Reconciliation</span>,
                accessor: <span className="dark:text-gray-200 dark:bg-bodybg">{formatNumberWithCommas(summary.reconciliation)}</span>
            }
        ];

    return (
        <ExecutiveSummaryTable
            title="Orders Fulfillment Summary"
            data={fulfillmentData}
            totals={[]}
            isLoading={isLoading}
        />
    );
};

export default OrdersFulfillmentSummary;

