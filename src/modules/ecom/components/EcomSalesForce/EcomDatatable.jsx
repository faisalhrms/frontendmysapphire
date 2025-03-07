import React, { useState } from "react";
import OrderModal from "../OrderModel.jsx";
import OrderDetailsTable from "../OrderDetailsTable.jsx";
import EcomPagination from "../../components/EcomSalesForce/EcomPagination.jsx";

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
        { Header: "Date", accessor: "placedate" },
        { Header: "Status", accessor: "confirmationstatus" },
        { Header: "Order Value", accessor: "ordertotal" },
        { Header: "Customer Name", accessor: "customername" },
        { Header: "Payment Status", accessor: "paymentstatus" },
        { Header: "Payment Method", accessor: "c_paymentmethod" },
        ...(type === 'ipc' ? [{ Header: "Reason", accessor: "reason" }] : []),
    ];

    return (
        <>
            <EcomPagination data={data} columns={columns} pageSize={10} />
            {isModalOpen && selectedOrder && (
                <OrderModal onClose={closeModal}>
                    <OrderDetailsTable order={selectedOrder} />

                </OrderModal>
            )}
        </>
    );
};

export default EcomDatatable;