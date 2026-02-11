import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import { formatDate } from "@helpers/dateTime.js";
import { formatRoundedAmountWithCommas } from "@helpers/formatters.js";

const AfterClosingTransactionsTable = ({ filters }) => {
    const columns = [
        {
            Header: "Date",
            accessor: "TRANSACTIONDATE",
            excelColumnType: "date",
            excelFormat: "MMM dd, yyyy",
            Cell: ({ value }) => formatDate(value, "MMM dd, yyyy"),
            width: 120,
        },
        {
            Header: "Time",
            accessor: "TRANSACTIONTIME",
            disableSortBy: true,
            Cell: ({ value }) => value || "-",
            width: 110,
            getCellProps: () => ({ className: "!text-left font-mono" }),
        },
        {
            Header: "Store Name",
            accessor: "WAREHOUSENAME",
            getCellProps: () => ({ className: "!text-left" }),
        },
        {
            Header: "Txn #",
            accessor: "TRANSACTIONNUMBER",
            width: 210,
            getCellProps: () => ({ className: "!text-left font-mono" }),
        },
        {
            Header: "Receipt Amount",
            accessor: "GROSSAMOUNT",
            excelColumnType: "number",
            Cell: ({ value }) => `PKR ${formatRoundedAmountWithCommas(Number(value) || 0)}`,
            getCellProps: () => ({ className: "!text-right tabular-nums" }),
            width: 140,
        },
        // {
        //     Header: "Net (exl: Tax)",
        //     accessor: "NETAMOUNT",
        //     excelColumnType: "number",
        //     Cell: ({ value }) => `PKR ${formatRoundedAmountWithCommas(Number(value) || 0)}`,
        //     getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
        //     width: 140,
        // },
        {
            Header: "Discount",
            accessor: "DISCOUNTAMOUNT",
            excelColumnType: "number",
            Cell: ({ value }) => `PKR ${formatRoundedAmountWithCommas(Number(value) || 0)}`,
            getCellProps: () => ({ className: "!text-right tabular-nums" }),
            width: 140,
        },
    ];

    return (
        <DataTable
            columns={columns}
            title=""
            apiUrl="/dashboard/data-pulse/retail/after-closing/datatable/"
            needHeader={false}
            enableAdvancedFilters={false}
            hideUrlParams={true}
            filters={filters}
        />
    );
};

export default AfterClosingTransactionsTable;
