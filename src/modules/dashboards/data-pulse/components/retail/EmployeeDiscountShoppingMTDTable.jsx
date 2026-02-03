import React, { useMemo } from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import { formatRoundedAmountWithCommas, toTitleCase } from "@helpers/formatters.js";

const EmployeeDiscountShoppingMTDTable = ({filters}) => {
    const columns = useMemo(
        () => [
            {
                Header: "Customer Account",
                accessor: "customeraccount",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
                width: 160,
            },
            {
                Header: "Known As",
                accessor: "knownas",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono text-blue-600" }),
                width: 140,
            },
            {
                Header: "Name",
                accessor: "name",
                excelAlignment: "left",
                Cell: ({ value }) => (value ? toTitleCase(value) : "-"),
                getCellProps: () => ({ className: "!text-left" }),
            },
            {
                Header: "Gross Amount",
                accessor: "grossamount",
                excelColumnType: "number",
                excelAlignment: "right",
                Cell: ({ value }) => `PKR ${formatRoundedAmountWithCommas(Number(value) || 0)}`,
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
                width: 145,
            },
            {
                Header: "Effective Amount",
                accessor: "effectiveamount",
                excelColumnType: "number",
                excelAlignment: "right",
                Cell: ({ value }) => `PKR ${formatRoundedAmountWithCommas(Number(value) || 0)}`,
                getCellProps: () => ({ className: "!text-right tabular-nums" }),
                width: 160,
            },
        ],
        []
    );

    return (
        <DataTable
            columns={columns}
            title=""
            apiUrl="/dashboard/data-pulse/retail/employee/discount-shopping/mtd/datatable/"
            needHeader={false}
            enableAdvancedFilters={false}
            hideUrlParams={true}
            filter={filters}
        />
    );
};

export default EmployeeDiscountShoppingMTDTable;
