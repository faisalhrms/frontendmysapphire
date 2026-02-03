import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { IdCard } from "lucide-react";
import { toTitleCase, formatRoundedAmountWithCommas } from "@helpers/formatters.js";
import {formatDate} from "@helpers/dateTime.js";

const EmployeeDiscountCardsTable = () => {
    const columns = [
        {
            Header: "Account #",
            accessor: "accountnum",
            excelAlignment: "left",
            Cell: ({ value }) => value || "-",
            getCellProps: () => ({ className: "!text-left font-mono" }),
        },
        {
            Header: "Name",
            accessor: "name",
            excelAlignment: "left",
            Cell: ({ value }) => (value ? toTitleCase(value) : "-"),
            getCellProps: () => ({ className: "!text-left" }),
        },
        {
            Header: "Known As",
            accessor: "knownas",
            excelAlignment: "left",
            Cell: ({ value }) => value || "-",
            getCellProps: () => ({ className: "!text-left font-mono text-blue-600" }),
        },
        {
            Header: "Email",
            accessor: "email",
            excelAlignment: "left",
            Cell: ({ value }) => value || "-",
            getCellProps: (cellInfo) => ({
                className: cellInfo?.value ? "!text-left" : "!text-left bg-red/10 text-red",
            }),
        },
        {
            Header: "Classification",
            accessor: "classification",
            excelAlignment: "left",
            Cell: ({ value }) => value || "Unknown",
            getCellProps: () => ({ className: "!text-center bg-primary/10 text-primary" }),
        },
        {
            Header: "Total Value",
            accessor: "totalvalue",
            excelColumnType: "number",
            excelAlignment: "right",
            Cell: ({ value }) => `PKR ${formatRoundedAmountWithCommas(Number(value) || 0)}`,
            getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
        },
        {
            Header: "Remaining Value",
            accessor: "remainingvalue",
            excelColumnType: "number",
            excelAlignment: "right",
            Cell: ({ value }) => `PKR ${formatRoundedAmountWithCommas(Number(value) || 0)}`,
            getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
        },
        {
            Header: "Sync At",
            accessor: "syncstartdatetime",
            disableSortBy: true,
            excelColumnType: 'date',
            excelFormat: "MMM dd, yyyy",
            Cell: ({value}) => (
                formatDate(value, "MMM dd, yyyy")
            )
        },
    ];

    return (
        <>

            <DataTable
                columns={columns}
                title=""
                apiUrl="/dashboard/data-pulse/retail/employee/cards/datatable/"
                needHeader={false}
                enableAdvancedFilters={false}
            />
        </>
    );
};

export default EmployeeDiscountCardsTable;
