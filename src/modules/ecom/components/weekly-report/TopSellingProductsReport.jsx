import React from "react";
import DataTable from "@components/DataTable.jsx";
import {formatNumberWithCommas} from "@helpers/formatters.js";

const TopSellingProductsReport = ({isActive, filters }) => {
    if (!isActive) {
        return null;
    }

    const columns = [
        {
            Header: 'Sku',
            accessor: 'productid',
            Cell: ({ row }) => (
                    <a href={row.original?.c_imageurl} target='_blank'>
                        <div className="flex items-center">
                            <div className="me-2">
                            <span className="avatar avatar-lg">
                                <img src={row.original?.c_imageurl} alt={row.original?.productid}/></span>
                            </div>
                            <div className="font-semibold text-primary underline">{row.original?.productid}</div>
                        </div>
                    </a>
            )
        },
        {
            Header: 'Name',
            accessor: 'itemtext',
        },
        {
            Header: 'Ordered QTY',
            accessor: 'qtyordered',
            Cell: ({ value }) => (
                <span><i class="bi bi-bag me-1 text-gray-500"></i>{formatNumberWithCommas(value)}</span>
            )
        },
        {
            Header: 'Revenue',
            accessor: 'revenue',
            Cell: ({ value }) => (
               <span className='font-bold'>RS.{formatNumberWithCommas(value)}</span>
            )
        },

    ];

    return (
        <>

            <DataTable
                columns={columns}
                apiUrl="ecom/weekly-report/top-selling-products/"
                needHeader={false}
                filter={filters}
            />
        </>
    );
};

export default TopSellingProductsReport;