import React, { useMemo } from "react";
import ClientSideTable from "@components/ClientSideTable.jsx";
import { toTitleCase } from "@helpers/formatters.js";

const statusCellClasses = {
    completed: "bg-green/10 text-success",
};

function aggregateCounts(priorityData) {
    return Object.values(priorityData).reduce((agg, counts) => {
        for (const status in counts) {
            agg[status] = (agg[status] || 0) + counts[status];
        }
        return agg;
    }, {});
}

function sumCounts(counts) {
    return Object.values(counts).reduce((sum, num) => sum + num, 0);
}

function transformTagsData(byTags, statuses) {
    const rows = [];
    for (const tag in byTags) {
        const priorityData = byTags[tag];
        const aggregated = aggregateCounts(priorityData);
        const aggregatedRow = {};
        statuses.forEach((status) => {
            aggregatedRow[status] = aggregated[status] !== undefined ? aggregated[status] : 0;
        });
        const tagTotal = sumCounts(aggregatedRow);
        rows.push({
            tag: <span className="font-semibold text-[#232323]">{tag}</span>,
            rowType: "tag",
            ...aggregatedRow,
            total: tagTotal,
        });
        ["high", "medium", "low"].forEach((priority) => {
            if (priorityData[priority]) {
                const prCounts = priorityData[priority];
                const prRow = {};
                statuses.forEach((status) => {
                    prRow[status] = prCounts[status] !== undefined ? prCounts[status] : 0;
                });
                rows.push({
                    tag: toTitleCase(priority),
                    rowType: "priority",
                    ...prRow,
                    total: sumCounts(prRow),
                });
            }
        });
    }
    return rows;
}

function createHeaders(statuses) {
    return [
        { label: "Tag / Priority", accessor: "tag", align: "text-left" },
        ...statuses.map((status) => ({
            label: toTitleCase(status),
            accessor: status,
            ...(status === "completed" && { classes: statusCellClasses.completed }),
        })),
        { label: "Total", accessor: "total" },
    ];
}

const TagsTableWrapper = ({ byTags, statuses }) => {
    const transformedRows = useMemo(() => transformTagsData(byTags, statuses), [byTags, statuses]);

    const footerRow = useMemo(() => {
        const aggregatedRows = transformedRows.filter((row) => row.rowType === "tag");
        const footerTotals = statuses.reduce((totals, status) => {
            totals[status] = aggregatedRows.reduce((sum, row) => sum + (row[status] || 0), 0);
            return totals;
        }, {});
        const grandTotal = Object.values(footerTotals).reduce((sum, value) => sum + value, 0);
        return {tag: <span className="font-semibold text-[#232323]">Total</span>, ...footerTotals, total: grandTotal};
    }, [transformedRows, statuses]);

    const rows = useMemo(() => [...transformedRows, footerRow], [transformedRows, footerRow]);

    const headers = useMemo(() => createHeaders(statuses), [statuses]);

    return (
        <div>
            <ClientSideTable config={{ headers }} data={rows} title="Tag Wise Status" height="800px" />
        </div>
    );
};

export default TagsTableWrapper;
