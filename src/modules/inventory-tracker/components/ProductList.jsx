import React from 'react';
import DataTable from "@components/DataTable.jsx";
import {formatNumberWithCommas} from "@helpers/formatters.js";

const ProductDatatableTab = ({ isActive }) => {
    if (!isActive) {
        return null;
    }

    const iconMap = {
        barcode: <i className="bi bi-upc inline-block mr-2 text-primary"></i>,
        warehousename: <i className="bi bi-building inline-block mr-2 text-amber-600"></i>,
        warehousecode: <i className="bi bi-123 inline-block mr-2 text-purple-600"></i>,
        salesprice: <i className="bi bi-cash-coin inline-block mr-2 text-success"></i>,
        onhand_qty: <i className="bi bi-box-seam inline-block mr-2 text-gray-500"></i>,
        discount_price: <i className="bi bi-tag inline-block mr-2 text-warning"></i>,
        discount_per: <i className="bi bi-percent inline-block mr-2 text-indigo-500"></i>,
        size_set: <i className="bi bi-grid-1x2-fill inline-block mr-2 text-pink-600"></i>,
        product_size: <i className="bi bi-aspect-ratio inline-block mr-2 text-emerald-500"></i>,
        sizes: <i className="bi bi-rulers inline-block mr-2 text-cyan-500"></i>,
        combos: <i className="bi bi-layers inline-block mr-2 text-gray-700"></i>,
        vm_trend: <i className="bi bi-graph-up-arrow inline-block mr-2 text-teal-600"></i>,
        sync_time: <i className="bi bi-clock-history inline-block mr-2 text-red-500"></i>,
    };

    const columns = [
        {
            Header: 'Barcode',
            accessor: 'barcode',
            Cell: ({ value }) => {
                const [copied, setCopied] = React.useState(false);

                const copyToClipboard = () => {
                    if (value) {
                        navigator.clipboard.writeText(value);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1500); // reset after 1.5s
                    }
                };

                return (
                    <span className="text-primary flex items-center gap-2">
                {iconMap.barcode}
                        {value || 'N/A'}
                        {value && (
                            <button
                                onClick={copyToClipboard}
                                className="text-gray-500 hover:text-green-600 transition-all"
                                title={copied ? "Copied!" : "Copy Barcode"}
                            >
                                <i className={`bi ${copied ? 'bi-check-lg' : 'bi-clipboard'} text-[14px]`}></i>
                            </button>
                        )}
            </span>
                );
            }
        }

        ,
        {
            Header: 'Warehouse Name',
            accessor: 'warehousename',
            Cell: ({ value }) => <span>{iconMap.warehousename}{value || 'N/A'}</span>
        },
        {
            Header: 'Warehouse Code',
            accessor: 'warehousecode',
            Cell: ({ value }) => <span>{value || 'N/A'}</span>
        },
        {
            Header: 'Sales Price',
            accessor: 'salesprice',
            Cell: ({ value }) => <span className="text-info">{value || 'N/A'}</span>
        },
        {
            Header: 'Onhand Qty',
            accessor: 'onhand_qty',
            Cell: ({ value }) => <span>{iconMap.onhand_qty}{value ?? 'N/A'}</span>
        },
        {
            Header: 'Discount Price',
            accessor: 'discount_price',
            Cell: ({ value }) => <span>{iconMap.discount_price}{value ?? 'N/A'}</span>
        },
        {
            Header: 'Discount %',
            accessor: 'discount_per',
            Cell: ({ value }) => <span>{iconMap.discount_per}{value ?? 'N/A'}</span>
        },

        {
            Header: 'Product Size',
            accessor: 'product_size',
            Cell: ({ value }) => <span>{iconMap.product_size}{value ?? 'N/A'}</span>
        },
        {
            Header: 'Size',
            accessor: 'sizes',
            Cell: ({ value }) => <span>{iconMap.sizes}{value || 'N/A'}</span>
        },
        {
            Header: 'Matching Separate (MS)',
            accessor: 'combos',
            Cell: ({ value }) => <span>{iconMap.combos}{value || 'N/A'}</span>
        },
        {
            Header: '(MS) Size',
            accessor: 'size_set',
            Cell: ({ value }) => <span>{iconMap.size_set}{value ?? 'N/A'}</span>
        },
        {
            Header: 'Rack Status',
            accessor: 'vm_trend',
            Cell: ({ value }) => <span>{iconMap.vm_trend}{value || 'N/A'}</span>
        },
        {
            Header: 'Sync Time',
            accessor: 'sync_time',
            Cell: ({ value }) => (
                <span>{iconMap.sync_time}{value ? new Date(value).toLocaleString() : 'N/A'}</span>
            )
        }
    ];

    return (
        <DataTable
            columns={columns}
            apiUrl="/inventory-tracker/datatable/"
        />
    );
};

export default ProductDatatableTab;
