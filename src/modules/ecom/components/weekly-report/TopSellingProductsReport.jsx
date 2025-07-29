import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
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
                <div className="flex items-center">
                    <div className="me-2">
                        <a href={row.original?.c_imageurl}
                           target='_blank'>
                            <span className="avatar avatar-lg">
                                <img src={row.original?.c_imageurl} alt={row.original?.productid}/>
                            </span>
                        </a>
                    </div>
                    <a href={`https://pk.sapphireonline.pk/collections/three-piece-unstitched/products/${row.original?.productid}.html`} target='_blank'>
                        <div className="font-semibold text-primary underline">{row.original?.productid}</div>
                    </a>
                </div>
)
},
    {
        Header: 'Name',
            accessor
    :
        'itemtext',
    }
,
    {
            Header: 'Ordered QTY',
            accessor: 'qtyordered',
            Cell: ({ value }) => (
                <span><i className="bi bi-bag me-1 text-gray-500"></i>{formatNumberWithCommas(value)}</span>
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
                hiddenParameters={['tab']}
            />
        </>
    );
};

export default TopSellingProductsReport;