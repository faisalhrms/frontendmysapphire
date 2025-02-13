import React, { useMemo } from 'react';
import { useTable } from 'react-table';
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import PropTypes from "prop-types";
import { useDataTable } from "@hooks/dataTableHooks.js";

const EquipmentSiteWiseReportTable = ({ apiUrl, title = 'Equipment Site Wise Report' }) => {
    const { data, isLoading } = useDataTable(apiUrl, 10);

    // Process data with null handling
    const processedData = useMemo(() => {
        if (!data?.data?.rows) return [];
        return data.data.rows.map(row => ({
            ...row,
            equipment_types: (row.equipment_types || []).map(et => ({
                name: et.name || 'Unknown Type',
                quantity: et.quantity || 0
            }))
        }));
    }, [data]);

    // Generate unique sites with null handling
    const siteNames = useMemo(() => {
        const sites = new Set();
        processedData.forEach(row => {
            const site = row.site_name || 'Unknown Site';
            sites.add(site);
        });
        return Array.from(sites);
    }, [processedData]);

    // Generate equipment types with null handling
    const equipmentTypes = useMemo(() => {
        const types = new Set();
        processedData.forEach(row => {
            row.equipment_types.forEach(et => {
                types.add(et.name);
            });
        });
        return Array.from(types);
    }, [processedData]);

    // Create table data structure
    const tableData = useMemo(() => {
        const dataMap = equipmentTypes.map(type => {
            const row = { type, total: 0 };
            siteNames.forEach(site => {
                row[site] = 0; // Initialize each site with 0 for this equipment type
            });
            return row;
        });

        processedData.forEach(row => {
            row.equipment_types.forEach(et => {
                const type = et.name;
                const site = row.site_name || 'Unknown Site';
                // Find the row for this equipment type and update the quantity for this site
                const dataRow = dataMap.find(d => d.type === type);
                if (dataRow) {
                    dataRow[site] += et.quantity;
                    dataRow.total += et.quantity;
                }
            });
        });

        return dataMap;
    }, [processedData, siteNames, equipmentTypes]);

    // Calculate column totals
    const columnTotals = useMemo(() => {
        const totals = { type: 'Total', total: 0 };
        siteNames.forEach(site => {
            totals[site] = tableData.reduce((sum, row) => sum + (row[site] || 0), 0);
            totals.total += totals[site];
        });
        return totals;
    }, [tableData, siteNames]);

    // Create react-table columns
    const columns = useMemo(() => [
        {
            Header: 'Equipment Type',
            accessor: 'type',
            Cell: ({ value }) => value || 'Unknown Type'
        },
        ...siteNames.map(site => ({
            Header: site,
            accessor: site,
            Cell: ({ value }) => value || 0
        })),
        {
            Header: 'Total',
            accessor: 'total',
            Cell: ({ value }) => value || 0
        }
    ], [siteNames]);

    // React-table configuration
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows: tableRows,
        prepareRow
    } = useTable({
        columns,
        data: [...tableData, columnTotals]
    });

    return (
        <div className="box custom-box">
            <div className="box-header justify-between">
                <div className="box-title">{title}</div>
            </div>

            <div className="box-body">
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="table-responsive">
                        <table {...getTableProps()} className="table whitespace-nowrap table-hover min-w-full ti-custom-table-hover">
                            <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps()} className="text-start align-middle">
                                            {column.render('Header')}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                            </thead>
                            <tbody {...getTableBodyProps()}>
                            {tableRows.map(row => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map(cell => (
                                            <td {...cell.getCellProps()}>
                                                {cell.render('Cell')}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

EquipmentSiteWiseReportTable.propTypes = {
    apiUrl: PropTypes.string.isRequired,
    title: PropTypes.string,
};

export default EquipmentSiteWiseReportTable;
