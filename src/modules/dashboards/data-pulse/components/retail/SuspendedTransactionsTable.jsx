import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import { formatDate } from "@helpers/dateTime.js";
import { formatRoundedAmountWithCommas } from "@helpers/formatters.js";

const SuspendedTransactionsTable = ({ filters }) => {
    const columns = [
        {
            Header: "Date",
            accessor: "transdate",
            excelColumnType: "date",
            excelFormat: "MMM dd, yyyy",
            Cell: ({ value }) => formatDate(value, "MMM dd, yyyy"),
            width: 120,
        },
        { Header: "Store", accessor: "storeid", width: 110, getCellProps: () => ({ className: "!text-left font-mono" }) },
        { Header: "Store Name", accessor: "warehousename", getCellProps: () => ({ className: "!text-left" }) },
        { Header: "Txn #", accessor: "transactionnumber", width: 150, getCellProps: () => ({ className: "!text-left font-mono" }) },
        { Header: "Item", accessor: "itemid", width: 120, getCellProps: () => ({ className: "!text-left font-mono" }) },
        { Header: "Color", accessor: "itemcolor", width: 90, getCellProps: () => ({ className: "!text-left font-mono" }) },
        { Header: "Size", accessor: "itemsize", width: 90, getCellProps: () => ({ className: "!text-left font-mono" }) },
        {
            Header: "Qty",
            accessor: "quantity",
            excelColumnType: "number",
            Cell: ({ value }) => Number(value || 0).toLocaleString("en-US"),
            getCellProps: () => ({ className: "!text-right tabular-nums" }),
            width: 90,
        },
        {
            Header: "Net (Incl Tax)",
            accessor: "netamountinclusivetax",
            excelColumnType: "number",
            Cell: ({ value }) => `PKR ${formatRoundedAmountWithCommas(Number(value) || 0)}`,
            getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
            width: 150,
        },
    ];

    return (
        <DataTable
            columns={columns}
            title=""
            apiUrl="/dashboard/data-pulse/retail/suspended/datatable/"
            needHeader={false}
            enableAdvancedFilters={false}
            hideUrlParams={true}
            filters={filters}
        />
    );
};

export default SuspendedTransactionsTable;
