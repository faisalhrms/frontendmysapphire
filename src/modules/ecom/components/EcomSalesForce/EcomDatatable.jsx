import React from "react";
import AgingDatatable from "../../components/SalesforceDashboard/AgingDatatable.jsx";
import { formatNumberWithCommas, toTitleCase } from "../../../../helpers/formatters.js";
import EcomPagination from "../../components/EcomSalesForce/EcomPagination.jsx";

const EcomDatatable = ({ data, type}) => {
    console.log(data);
    const columns = [
        { Header: "Order #", accessor: "orderno" },
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
        ...(type=='ipc'?[{ Header: "Reason", accessor: "reason" }]:[]),
    ];

    return <EcomPagination data={data} columns={columns} pageSize={5} />;
};

export default EcomDatatable;
