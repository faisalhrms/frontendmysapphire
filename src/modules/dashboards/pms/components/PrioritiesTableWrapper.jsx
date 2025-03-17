import React, {useMemo} from "react";
import ClientSideTable from "@components/ClientSideTable.jsx";
import {toTitleCase} from "@helpers/formatters.js";

function transformPrioritiesData(data, statuses) {
    return Object.entries(data).map(([priority, statusData]) => {
        const formattedPriority = toTitleCase(priority);
        const rowData = {};
        statuses.forEach(status => {
            rowData[status] = statusData[status] !== undefined ? statusData[status] : 0;
        });
        const rowTotal = statuses.reduce((sum, status) => sum + rowData[status], 0);
        return { priority: formattedPriority, ...rowData, total: rowTotal };
    });
}

function createPrioritiesHeaders(statuses) {
    return [
        { label: "Priority", accessor: "priority", align: "text-left" },
        ...statuses.map((status) => ({
            label: toTitleCase(status),
            accessor: status,
        })),
        { label: "Total", accessor: "total" },
    ];
}

const PrioritiesTable = ({ data, statuses }) => {
    const rows = useMemo(() => transformPrioritiesData(data, statuses), [data, statuses]);

    const columnTotals = useMemo(() => {
        return statuses.reduce((totals, status) => {
            totals[status] = rows.reduce((sum, row) => sum + (row[status] || 0), 0);
            return totals;
        }, {});
    }, [rows, statuses]);

    const grandTotal = useMemo(
        () => Object.values(columnTotals).reduce((sum, value) => sum + value, 0),
        [columnTotals]
    );

    const rowsWithFooter = useMemo(() => {
        return [
            ...rows,
            {priority: <span className="font-semibold text-[#232323]">Total</span>, ...columnTotals, total: grandTotal}
        ];
    }, [rows, columnTotals, grandTotal]);

    const headers = useMemo(() => createPrioritiesHeaders(statuses), [statuses]);

    return (
        <div>
            <ClientSideTable config={{ headers }} data={rowsWithFooter} title="Priority Wise Status" height="400px" />
        </div>
    );
};

export default PrioritiesTable;
