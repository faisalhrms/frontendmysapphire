import DataTable from "@components/DataTable.jsx";
import React from "react";
import { formatAmountWithCommas, toTitleCase } from "@helpers/formatters.js";

const SubscriptionHistory = ({ id }) => {
    console.log(id);

    const columns = [
        { Header: "Started Date", accessor: "started_at" },
        { Header: "Ended Date", accessor: "ended_at" },
        { Header: "Payment Method", accessor: "payment_method" },
        { Header: "Payment Cycle", accessor: "payment_cycle" },
        { Header: "Currency", accessor: "currency" },
        {
            Header: "Amount",
            accessor: "amount",
            Cell: ({ value }) => formatAmountWithCommas(value),
        },
    ];

    return (
        <>
            <DataTable
                columns={columns}
                title="Subscriptions History"
                apiUrl={`/transactions/${id}/history/`}
            />
        </>
    );
};

export default SubscriptionHistory;