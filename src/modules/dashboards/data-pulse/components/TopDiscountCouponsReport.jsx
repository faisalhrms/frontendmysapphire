import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import { formatNumberWithCommas } from "@helpers/formatters.js";

const TopDiscountCouponsReport = ({ isActive, filters }) => {
    if (!isActive) return null;

    const columns = [
        {
            Header: "Date",
            accessor: "Date",
            Cell: ({ value }) => (value ? String(value) : "-"),
        },
        { Header: "Warehouse", accessor: "Warehouse" },
        { Header: "Discount Code", accessor: "DiscountCode" },
        {
            Header: "Discount Amount",
            accessor: "EffectiveAmount",
            Cell: ({ value }) => (
                <span className="font-bold">
          Rs. {formatNumberWithCommas(Number(value || 0))}
        </span>
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            apiUrl="dashboard/data-pulse/retail/top-discount-coupons/"
            needHeader={false}
            filter={filters}
            hiddenParameters={["tab"]}
        />
    );
};

export default TopDiscountCouponsReport;
