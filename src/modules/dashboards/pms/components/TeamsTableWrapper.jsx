import React, {useMemo} from "react";
import ClientSideTable from "@components/ClientSideTable.jsx";
import {toTitleCase} from "@helpers/formatters.js";


function transformTeamsData(data, statuses) {
    return Object.entries(data).map(([team, statusData]) => {
        const rowData = {};
        statuses.forEach(status => {
            rowData[status] = statusData[status] !== undefined ? statusData[status] : 0;
        });
        const rowTotal = statuses.reduce((sum, status) => sum + rowData[status], 0);
        return { team, ...rowData, total: rowTotal };
    });
}

function createTeamsHeaders(statuses) {
    return [
        { label: "Team", accessor: "team", align: "text-left" },
        ...statuses.map((status) => ({
            label: toTitleCase(status),
            accessor: status,
        })),
        { label: "Total", accessor: "total" },
    ];
}

const TeamsTableWrapper = ({ data, statuses }) => {
    const rows = useMemo(() => transformTeamsData(data, statuses), [data, statuses]);

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
        return [...rows, {
            team: <span className="font-semibold text-[#232323]">Total</span>, ...columnTotals,
            total: <span className="font-semibold text-[#232323]">Total</span>
        }];
    }, [rows, columnTotals, grandTotal]);

    const headers = useMemo(() => createTeamsHeaders(statuses), [statuses]);

    return (
        <div>
            <ClientSideTable
                config={{ headers }}
                data={rowsWithFooter}
                title="Team Wise Status"
                height="400px"
            />
        </div>
    );
};

export default TeamsTableWrapper;
