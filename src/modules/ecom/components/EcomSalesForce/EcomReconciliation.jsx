// import React, {useEffect, useState} from "react";
// import Table from "../EcomSalesForce/Table.jsx";
// import { formatNumberWithCommas } from "../../../../helpers/formatters.js";
// import { useExecutiveSummary } from "../../hooks/ecomsaleHooks.js";
// import EcomModal from "../../components/EcomSalesForce/EcomModel.jsx";
// import EcomBreakuporder from "../../components/EcomSalesForce/EcomBreakuporder.jsx";
// import EcomDatatable from  "../../components/EcomSalesForce/EcomDatatable.jsx";
// import {
//     total_orders_cc,
//     total_orders_oms,
//     orders_with_multiple_fo,
//     orders_with_single_fo,
//     cancelled,
//     fetchExecutiveSummary,
//     in_process_with_customercare,
//     order_with_exception,
//     missing_in_oms,
// } from "../../services/saleapi_service.js";
// import BreakupOrdersFO from "../SalesforceDashboard/BreakupOrdersFO.jsx";
// import EcomOrdersFulfillment from "../../components/EcomSalesForce/EcomOrdersFulfillment.jsx";
// import LoadingSpinner from "../../../../components/LoadingSpinner.jsx";
//
// const functionMap = {
//     total_orders_cc,
//     total_orders_oms,
//     orders_with_multiple_fo,
//     orders_with_single_fo,
//     cancelled,
//     in_process_with_customercare,
//     order_with_exception,
//     missing_in_oms,
// };
//
// const EcomReconciliation = ({filters}) => {
//     const [data , setData] = useState({});
//     const [isLoading , setIsLoading] = useState(false);
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [modalData, setModalData] = useState(null);
//     const [modalTitle, setModalTitle] = useState("");
//
//     const fetch = async () => {
//         try {
//             const res = await fetchExecutiveSummary(filters);
//             setData(res);
//         }catch (error) {
//             console.log(error)
//         }
//     }
//
//     useEffect(() => {
//         fetch()
//     },[filters]);
//
//     const {summary, fulfilment_data} = data || {};
//
//
//     const fetchModalData = async (type) => {
//         const selectedFunction = functionMap[type];
//
//         if (typeof selectedFunction === "function") {
//             const res = await selectedFunction({ dateFrom: filters?.date_from, dateTo: filters?.date_to });
//             setModalTitle(type.replace(/_/g, " ").toUpperCase());
//             setModalData(res || []);
//             setIsModalVisible(true);
//         } else {
//             console.log("Error: Invalid type function passed to fetchModalData");
//         }
//     };
//
//     const reconciliationData = isLoading
//         ? [{ label: <LoadingSpinner />, accessor: "" }]
//         : [
//             {
//                 label: <span className="p-1 rounded text-right cursor-pointer transition-all hover:font-bold">Commerce Cloud</span>,
//                 accessor: (
//                     <div className="p-1 rounded text-right cursor-pointer transition-all hover:font-bold"
//                          onClick={() => fetchModalData("total_orders_cc")}>
//                         <span className="text-gray-800 hover:underline hover:font-bold">
//                             {formatNumberWithCommas(summary?.total_orders_cc || 0)}
//                         </span>
//                     </div>
//                 ),
//             },
//             {
//                 label: <span className="p-1 rounded text-right cursor-pointer transition-all hover:font-bold">Total - Orders in OMS</span>,
//                 accessor: (
//                     <div className="p-1 rounded text-right cursor-pointer transition-all hover:font-bold"
//                          onClick={() => fetchModalData("total_orders_oms")}>
//                         <span className="text-gray-800 hover:underline hover:font-bold">
//                             {formatNumberWithCommas(summary?.total_orders_summary || 0)}
//                         </span>
//                     </div>
//                 ),
//             },
//             {
//                 label: <span className="text-danger font-bold">Missing in OMS</span>,
//                 accessor: (
//                     <div className="p-1 rounded text-right cursor-pointer transition-all hover:font-bold"
//                          onClick={() => fetchModalData("missing_oms")}>
//                         <span className="text-danger hover:underline hover:font-bold">
//                             {formatNumberWithCommas(summary?.missing_oms || 0)}
//                         </span>
//                     </div>
//                 ),
//             },
//             {
//                 label: <span>Orders with Single FOs</span>,
//                 accessor: (
//                     <div className="p-1 rounded text-right cursor-pointer transition-all hover:font-bold"
//                          onClick={() => fetchModalData("orders_with_single_fo")}>
//                         <span className="text-gray-800 hover:underline hover:font-bold">
//                             {formatNumberWithCommas(summary?.orders_with_single_fo || 0)}
//                         </span>
//                     </div>
//                 ),
//             },
//             {
//                 label: <span>Orders with Multiple FOs</span>,
//                 accessor: (
//                     <div className="p-1 rounded text-right cursor-pointer transition-all hover:font-bold"
//                          onClick={() => fetchModalData("orders_with_multiple_fo")}>
//                         <span className="text-gray-800 hover:underline hover:font-bold">
//                             {formatNumberWithCommas(summary?.orders_with_multiple_fo || 0)}
//                         </span>
//                     </div>
//                 ),
//             },
//             {
//                 label: <span>Cancelled in OMS</span>,
//                 accessor: (
//                     <div className="p-1 rounded text-right cursor-pointer transition-all hover:font-bold"
//                          onClick={() => fetchModalData("cancelled")}>
//                         <span className=" text-gray-800 hover:underline hover:font-bold">
//                             {formatNumberWithCommas(summary?.cancelled || 0)}
//                         </span>
//                     </div>
//                 ),
//             },
//             {
//                 label: <span>In-Process with Customer Care</span>,
//                 accessor: (
//                     <div className="p-1 rounded text-right cursor-pointer transition-all hover:font-bold"
//                          onClick={() => fetchModalData("in_process_with_customercare")}>
//                         <span className="text-gray-800 hover:underline hover:font-bold">
//                             {formatNumberWithCommas(summary?.in_process_with_customercare || 0)}
//                         </span>
//                     </div>
//                 ),
//             },
//             {
//                 label: <span>Orders with Exceptions</span>,
//                 accessor: (
//                     <div className="p-1 rounded text-right cursor-pointer transition-all hover:font-bold"
//                          onClick={() => fetchModalData("order_with_exception")}>
//                         <span className="text-gray-800 hover:underline hover:font-bold">
//                             {formatNumberWithCommas(summary?.order_with_exception || 0)}
//                         </span>
//                     </div>
//                 ),
//             },
//         ];
//
//     return (
//         <>
//             <div className="flex flex-wrap md:flex-nowrap gap-6 p-2 dark:text-gray-900 dark:bg-bodybg">
//                 <Table
//                     title="Reconciliation CC vs OMS"
//                     data={reconciliationData}
//                     totals={["Total - Orders in OMS", formatNumberWithCommas(summary?.total_order_oms || 0)]}
//                     isLoading={isLoading}
//                 />
//                 <EcomBreakuporder  />
//                 <EcomOrdersFulfillment/>
//             </div>
//
//
//             {isModalVisible && (
//                 <EcomModal
//                     onClose={() => setIsModalVisible(false)}
//                     title={modalTitle}
//                 >
//                     <EcomDatatable data={modalData} />
//                 </EcomModal>
//             )}
//         </>
//     );
// };
//
// export default EcomReconciliation;
//
//
import React, { useEffect, useState } from "react";
import Table from "../EcomSalesForce/Table.jsx";
import { formatNumberWithCommas } from "../../../../helpers/formatters.js";
import { useExecutiveSummary } from "../../hooks/ecomsaleHooks.js";
import EcomModal from "../../components/EcomSalesForce/EcomModel.jsx";

import EcomDatatable from "../../components/EcomSalesForce/EcomDatatable.jsx";
import {
    commerce_cloud,
    total_orders_oms,
    multiple_fo,
    single_fo,
    cancelled,
    fetchExecutiveSummary,
    ipc,
    owe,
    oms,
} from "../../services/saleapi_service.js";


import LoadingSpinner from "../../../../components/LoadingSpinner.jsx";

const functionMap = {
    commerce_cloud,
    total_orders_oms,
    multiple_fo,
    single_fo,
    cancelled,
    ipc,
    owe,
    oms,
};

const EcomReconciliation = ({ filters }) => {
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [modalTitle, setModalTitle] = useState("");
    const [isModelLoading, setModelLoading] = useState(false);
    const fetch = async () => {
        try {
            setIsLoading(true);
            const res = await fetchExecutiveSummary(filters);
            setData(res);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetch();
    }, [filters]);

    const { summary, fulfilment_data } = data || {};

    const fetchModalData = async (type) => {
        const selectedFunction = functionMap[type];

        if (typeof selectedFunction === "function") {
            const res = await selectedFunction({ dateFrom: filters?.date_from, dateTo: filters?.date_to });
            setModalTitle(type.replace(/_/g, " ").toUpperCase());
            setModalData(res || []);
            setIsModalVisible(true);
        } else {
            console.log("Error: Invalid type function passed to fetchModalData");
        }
    };

    const reconciliationData = isLoading
        ? [{ label: <LoadingSpinner />, accessor: "" }]
        : [
            {
                label: <span className="p-1 rounded text-right cursor-pointer transition-all hover:font-bold">Commerce Cloud</span>,
                accessor: (
                    <div className="p-1 rounded text-right cursor-pointer transition-all hover:font-bold"
                         onClick={() => fetchModalData("total_orders_cc")}>
                        <span className="text-gray-800 hover:underline hover:font-bold">
                            {formatNumberWithCommas(summary?.total_orders_cc || 0)}
                        </span>
                    </div>
                ),
            },
            {
                label: <span className="p-1 rounded text-right cursor-pointer transition-all hover:font-bold">Total - Orders in OMS</span>,
                accessor: (
                    <div className="p-1 rounded text-right cursor-pointer transition-all hover:font-bold"
                         onClick={() => fetchModalData("total_orders_oms")}>
                        <span className="text-gray-800 hover:underline hover:font-bold">
                            {formatNumberWithCommas(summary?.total_orders_summary || 0)}
                        </span>
                    </div>
                ),
            },
            {
                label: <span className="text-danger font-bold">Missing in OMS</span>,
                accessor: (
                    <div className="p-1 rounded text-right cursor-pointer transition-all hover:font-bold"
                         onClick={() => fetchModalData("missing_oms")}>
                        <span className="text-danger hover:underline hover:font-bold">
                            {formatNumberWithCommas(summary?.missing_oms || 0)}
                        </span>
                    </div>
                ),
            },
            {
                label: <span>Orders with Single FOs</span>,
                accessor: (
                    <div className="p-1 rounded text-right cursor-pointer transition-all hover:font-bold"
                         onClick={() => fetchModalData("orders_with_single_fo")}>
                        <span className="text-gray-800 hover:underline hover:font-bold">
                            {formatNumberWithCommas(summary?.orders_with_single_fo || 0)}
                        </span>
                    </div>
                ),
            },
            {
                label: <span>Orders with Multiple FOs</span>,
                accessor: (
                    <div className="p-1 rounded text-right cursor-pointer transition-all hover:font-bold"
                         onClick={() => fetchModalData("orders_with_multiple_fo")}>
                        <span className="text-gray-800 hover:underline hover:font-bold">
                            {formatNumberWithCommas(summary?.orders_with_multiple_fo || 0)}
                        </span>
                    </div>
                ),
            },
            {
                label: <span>Cancelled in OMS</span>,
                accessor: (
                    <div className="p-1 rounded text-right cursor-pointer transition-all hover:font-bold"
                         onClick={() => fetchModalData("cancelled")}>
                        <span className=" text-gray-800 hover:underline hover:font-bold">
                            {formatNumberWithCommas(summary?.cancelled || 0)}
                        </span>
                    </div>
                ),
            },
            {
                label: <span>In-Process with Customer Care</span>,
                accessor: (
                    <div className="p-1 rounded text-right cursor-pointer transition-all hover:font-bold"
                         onClick={() => fetchModalData("in_process_with_customercare")}>
                        <span className="text-gray-800 hover:underline hover:font-bold">
                            {formatNumberWithCommas(summary?.in_process_with_customercare || 0)}
                        </span>
                    </div>
                ),
            },
            {
                label: <span>Orders with Exceptions</span>,
                accessor: (
                    <div className="p-1 rounded text-right cursor-pointer transition-all hover:font-bold"
                         onClick={() => fetchModalData("order_with_exception")}>
                        <span className="text-gray-800 hover:underline hover:font-bold">
                            {formatNumberWithCommas(summary?.order_with_exception || 0)}
                        </span>
                    </div>
                ),
            },
        ];

    return (
        <>
            <div className="flex flex-wrap md:flex-nowrap gap-6 p-2 dark:text-gray-900 dark:bg-bodybg">
                <Table
                    title="Reconciliation CC vs OMS"
                    data={reconciliationData}
                    totals={["Total - Orders in OMS", formatNumberWithCommas(summary?.total_order_oms || 0)]}
                    isLoading={isLoading}
                />

            </div>

            {isModalVisible && (
                <EcomModal
                    onClose={() => setIsModalVisible(false)}
                    title={modalTitle}
                    loading={isModelLoading}
                >
                    <EcomDatatable data={modalData} />
                </EcomModal>
            )}
        </>
    );
};

export default EcomReconciliation;
