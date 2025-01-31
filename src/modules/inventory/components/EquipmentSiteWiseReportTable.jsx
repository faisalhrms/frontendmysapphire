import React, { useMemo } from 'react';
import { useTable } from 'react-table';
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import PropTypes from "prop-types";
import { useDataTable } from "@hooks/dataTableHooks.js";

const EquipmentSiteWiseReportTable = ({ apiUrl, title = 'Equipment Site Wise Report' }) => {
    const { data, isLoading } = useDataTable(apiUrl, 10);

    const rows = Array.isArray(data?.data?.rows) ? data.data.rows : [];

    const siteNames = useMemo(() => {
        const sites = new Set();
        rows.forEach(row => {
            sites.add(row.site_name);
        });
        return Array.from(sites);
    }, [rows]);

    const equipmentTypes = useMemo(() => {
        const types = new Set();
        rows.forEach(row => {
            row.equipment_types.forEach(eq => {
                types.add(eq.name);
            });
        });
        return Array.from(types);
    }, [rows]);

    const tableData = useMemo(() => {
        const dataMap = {};

        equipmentTypes.forEach(type => {
            dataMap[type] = {};
            siteNames.forEach(site => {
                dataMap[type][site] = 0;
            });
        });

        rows.forEach(row => {
            row.equipment_types.forEach(eq => {
                dataMap[eq.name][row.site_name] = eq.quantity;
            });
        });

        return Object.entries(dataMap).map(([type, sites]) => ({
            type,
            ...sites,
            total: Object.values(sites).reduce((sum, qty) => sum + qty, 0),
        }));
    }, [rows, siteNames, equipmentTypes]);

    const columnTotals = useMemo(() => {
        const totals = {};
        siteNames.forEach(site => {
            totals[site] = tableData.reduce((sum, row) => sum + row[site], 0);
        });
        totals["total"] = tableData.reduce((sum, row) => sum + row.total, 0);
        return totals;
    }, [tableData, siteNames]);

    const columns = useMemo(() => [
        { Header: "Type", accessor: "type" },
        ...siteNames.map(site => ({ Header: site, accessor: site })),
        { Header: "Total", accessor: "total" }
    ], [siteNames]);

    const { getTableProps, getTableBodyProps, headerGroups, rows: tableRows, prepareRow } = useTable({
        columns,
        data: [...tableData, { type: "Total", ...columnTotals }],
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
                            {headerGroups?.map((headerGroup, headerIndex) => {
                                const headerProps = headerGroup.getHeaderGroupProps();
                                return (
                                    <tr {...headerProps} key={`headerGroup-${headerIndex}`} className="border-b border-defaultborder">
                                        {headerGroup.headers.map((column, columnIndex) => {
                                            const columnProps = column.getHeaderProps();
                                            return (
                                                <th {...columnProps} key={`header-${columnIndex}`} className="text-start align-middle">
                                                    {column.render('Header')}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                            </thead>
                            <tbody {...getTableBodyProps()}>
                            {tableRows.map((row, rowIndex) => {
                                prepareRow(row);
                                const rowProps = row.getRowProps();
                                return (
                                    <tr {...rowProps} key={`row-${rowIndex}`} className="border-b border-defaultborder text-[0.6875rem]">
                                        {row.cells.map((cell, cellIndex) => {
                                            const cellProps = cell.getCellProps();
                                            return (
                                                <td {...cellProps} key={`cell-${rowIndex}-${cellIndex}`}>
                                                    {cell.render('Cell')}
                                                </td>
                                            );
                                        })}
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
