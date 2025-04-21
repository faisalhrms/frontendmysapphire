import React, { useMemo } from "react";
import ClientSideTable from "@components/ClientSideTable.jsx";
import {formatLabel, toTitleCase} from "@helpers/formatters.js";
import usePMSStatsDrillDown from "@modules/dashboards/pms/hooks/usePMSStatsDrillDown.js";
import TaskListModal from "@modules/project-management/components/model/TaskListModal.jsx";

const statusCellClasses = {
    completed: "bg-green/10 text-success cursor-pointer",
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
            tag: <span className="font-semibold text-[#232323] text-left">{tag.toUpperCase()}</span>,
            rowType: "tag",
            tagName: tag,
            ...aggregatedRow,
            total: tagTotal,
            align: 'text-left',
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
                    tagName: tag,
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
        { label: "Tag/Priority", accessor: "tag", align: "text-left" },
        ...statuses.map((status) => ({
            label: toTitleCase(status),
            accessor: status,
            classes: "cursor-pointer",
            ...(status === "completed" && { classes: statusCellClasses.completed }),
        })),
        { label: "Total", accessor: "total", classes: "cursor-pointer" },
    ];
}

const TagsTableWrapper = ({ byTags, statuses, filters }) => {
    const transformedRows = useMemo(() => transformTagsData(byTags, statuses), [byTags, statuses]);

    const filteredStatuses = useMemo(() => {
        return statuses.filter(status => {
            return transformedRows.some(row => row[status] > 0);
        });
    }, [transformedRows, statuses]);

    const footerRow = useMemo(() => {
        const aggregatedRows = transformedRows.filter((row) => row.rowType === "tag");
        const footerTotals = filteredStatuses.reduce((totals, status) => {
            totals[status] = aggregatedRows.reduce((sum, row) => sum + (row[status] || 0), 0);
            return totals;
        }, {});
        const grandTotal = Object.values(footerTotals).reduce((sum, value) => sum + value, 0);
        return { tag: <span className="font-semibold text-[#232323]">Total</span>, ...footerTotals, total: grandTotal };
    }, [transformedRows, filteredStatuses]);

    const rows = useMemo(() => [...transformedRows, footerRow], [transformedRows, footerRow]);

    const headers = useMemo(() => createHeaders(filteredStatuses), [filteredStatuses]);

    const { isTaskModalOpen, fetchData, tasks, loadingTasks, openTaskModal, closeTaskModal } = usePMSStatsDrillDown(
        'dashboard/pms/project/tasks/status/detail/',
        filters
    )

    const handleRowClick = async (rowData, colIndex, headers) => {
        const header = headers[colIndex];
        if (header?.accessor && header.accessor !== "tag") {
            await fetchData({
                status: formatLabel(header.label),
                tag: rowData?.tagName || null,
                priority: rowData?.rowType === 'priority' ? rowData?.tag?.toLowerCase() : null,
            });
        }
    };

    return (
        <div>
            <ClientSideTable
                config={{ headers }}
                data={rows}
                title="Tag Wise Status"
                height="800px"
                tHeadClasses='table-bg-dark'
                onRowClick={handleRowClick}
            />
            {
                isTaskModalOpen &&
                <TaskListModal
                    tasks={tasks}
                    isLoading={loadingTasks}
                    closeModal={closeTaskModal}
                />
            }
        </div>
    );
};

export default TagsTableWrapper;
