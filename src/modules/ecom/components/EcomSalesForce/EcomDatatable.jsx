// import React from "react";
// import AgingDatatable from "../../components/SalesforceDashboard/AgingDatatable.jsx";
// import { formatNumberWithCommas, toTitleCase } from "../../../../helpers/formatters.js";
// import EcomPagination from "../../components/EcomSalesForce/EcomPagination.jsx";
//
// const EcomDatatable = ({ data, type}) => {
//     console.log(data);
//     const columns = [
//         { Header: "Order #", accessor: "orderno" },
//         { Header: "Date", accessor: "placedate", Cell: ({ value }) => toTitleCase(value) },
//         { Header: "Status", accessor: "confirmationstatus" },
//         {
//             Header: "Order Value",
//             accessor: "ordertotal",
//             Cell: ({ value }) => <div className="text-right">{formatNumberWithCommas(value)}</div>,
//         },
//         {
//             Header: "Customer Name",
//             accessor: "customername",
//             Cell: ({ value }) => <div className="whitespace-normal break-words text-wrap max-w-[250px]">{value}</div>,
//         },
//         { Header: "Payment Status", accessor: "paymentstatus" },
//         { Header: "Payment Method", accessor: "c_paymentmethod" },
//         ...(type=='ipc'?[{ Header: "Reason", accessor: "reason" }]:[]),
//     ];
//
//     return <EcomPagination data={data} columns={columns} pageSize={10} />;
// };
//
// export default EcomDatatable;
import React, { useState } from "react";
import AgingDatatable from "../../components/SalesforceDashboard/AgingDatatable.jsx";
import { formatNumberWithCommas, toTitleCase } from "../../../../helpers/formatters.js";
import EcomPagination from "../../components/EcomSalesForce/EcomPagination.jsx";
import OrderModal from "../OrderModel.jsx";
import OrderDetailsTable from "../OrderDetailsTable.jsx";

const EcomDatatable = ({ data = [], type }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    if (!Array.isArray(data)) {
        console.error("EcomDatatable: 'data' is not an array", data);
        return null;
    }

    const openModal = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const columns = [
        {
            Header: "Order #",
            accessor: "orderno",
            Cell: ({ value, row }) => (
                <button
                    onClick={() => openModal(row.original)}
                    className="text-gray-800 hover:underline hover:font-bold dark:text-gray-200 dark:bg-bodybg"
                >
                    {value}
                </button>
            ),
        },
        { Header: "Date", accessor: "placedate", Cell: ({ value }) => toTitleCase(value) },
        { Header: "Status", accessor: "confirmationstatus" },
        {
            Header: "Order Value",
            accessor: "ordertotal",
            Cell: ({ value }) => <div className="text-right">{formatNumberWithCommas(value)}</div>,
        },
        {
            Header: "Customer Name",
            accessor: "customername",
            Cell: ({ value }) => <div className="whitespace-normal break-words text-wrap max-w-[250px]">{value}</div>,
        },
        { Header: "Payment Status", accessor: "paymentstatus" },
        { Header: "Payment Method", accessor: "c_paymentmethod" },
        ...(type === 'ipc' ? [{ Header: "Reason", accessor: "reason" }] : []),
    ];

    return (
        <>
            <EcomPagination data={data} columns={columns} pageSize={10} />
            {isModalOpen && selectedOrder && (
                <OrderModal onClose={closeModal}>
                    <div className="">
                        <h2 className="text-lg font-bold">Order Details - {selectedOrder.orderno}</h2>
                        <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-xl"></button>
                    </div>
                    <div className="overflow-auto max-h-[70vh] p-4">
                        <OrderDetailsTable order={selectedOrder} />
                    </div>
                </OrderModal>
            )}
        </>
    );
};

export default EcomDatatable;
