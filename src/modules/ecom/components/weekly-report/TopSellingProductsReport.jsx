import React from "react";
import { formatNumberWithCommas } from "@helpers/formatters.js";
import DataTable from "@components/DataTable.jsx";

const TopSellingProductsReport = ({isActive }) => {
    if (!isActive) {
        return null;
    }

    const columns = [
        {
            Header: 'Barcode',
            accessor: 'barcode',
            Cell: ({ value }) => <span>{value || 'N/A'}</span>
        },
        {
            Header: 'Ware House Name',
            accessor: 'warehousename',
            Cell: ({ value }) => <span>{value || 'N/A'}</span>
        },
        {
            Header: 'Ware House Code',
            accessor: 'warehousecode',
            Cell: ({ value }) => <span>{value || 'N/A'}</span>
        },
        {
            Header: 'Sales Price',
            accessor: 'salesprice',
            Cell: ({ value }) => <span>{formatNumberWithCommas(value) || 'N/A'}</span>

        },
        {
            Header: 'Onhand Qty',
            accessor: 'onhand_qty',
            Cell: ({ value }) => <span>{value || 'N/A'}</span>
        },

        {
            Header: 'Discount Price',
            accessor: 'discount_price',
            Cell: ({ value }) => <span>{value || 'N/A'}</span>
        },
        {
            Header: 'Discount Per',
            accessor: 'discount_per',
            Cell: ({ value }) => <span>{value || 'N/A'}</span>
        },
        {
            Header: 'Size Set',
            accessor: 'size_set',
            Cell: ({ value }) => <span>{value || 'N/A'}</span>
        },
        {
            Header: 'Size',
            accessor: 'size',
            Cell: ({ value }) => <span>{value || 'N/A'}</span>
        },
        {
            Header: 'Combos',
            accessor: 'combos',
            Cell: ({ value }) => <span>{value || 'N/A'}</span>
        },
        {
            Header: 'Vm Trend',
            accessor: 'vm_trend',
            Cell: ({ value }) => <span>{value || 'N/A'}</span>
        },
        {
            Header: 'Sync Time',
            accessor: 'sync_time',
            Cell: ({ value }) => <span>{value || 'N/A'}</span>
        },

    ];

    return (
        <>

            <DataTable
                columns={columns}
                apiUrl="/inventory-tracker/datatable/"
                needHeader={false}
            />
        </>
    );
};

export default TopSellingProductsReport;