import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import { formatNumberWithCommas } from "@helpers/formatters.js";

const TopCouponsReport = ({ isActive, filters }) => {
    if (!isActive) return null;

    const columns = [
        { Header: "Order #", accessor: "OrderNumber" },
        { Header: "Ordered Date", accessor: "OrderedDate" },
        { Header: "Status", accessor: "Status" },
        { Header: "Customer", accessor: "Description" },
        { Header: "Coupon", accessor: "coupon_code" },
        { Header: "Type", accessor: "coupon_type" },
        {
            Header: "Coupon Amount",
            accessor: "coupon_amount",
            Cell: ({ value }) => (
                <span className="font-bold">Rs. {formatNumberWithCommas(Number(value || 0))}</span>
            ),
        },
        {
            Header: "Total Payment",
            accessor: "total_payment_amount",
            Cell: ({ value }) => (
                <span>Rs. {formatNumberWithCommas(Number(value || 0))}</span>
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            apiUrl="dashboard/data-pulse/ecom/top-coupons/"
            needHeader={false}
            filter={filters}
            hiddenParameters={["tab"]}
        />
    );
};

export default TopCouponsReport;
