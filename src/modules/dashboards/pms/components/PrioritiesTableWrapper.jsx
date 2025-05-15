import React, { useMemo } from "react";
import ClientSideTable from "@components/ClientSideTable.jsx";
import {formatLabel, toTitleCase} from "@helpers/formatters.js";
import usePMSStatsDrillDown from "@modules/dashboards/pms/hooks/usePMSStatsDrillDown.js";
import TaskListModal from "@modules/project-management/components/model/TaskListModal.jsx";

const statusCellClasses = {
    completed: "bg-green/10 text-success cursor-pointer",
};

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
            classes: "cursor-pointer",
            ...(status === "completed" && { classes: statusCellClasses.completed }),
        })),
        { label: "Total", accessor: "total", classes: "cursor-pointer" },
    ];
}

const PrioritiesTableWrapper = ({ data, statuses, filters }) => {
    const rows = useMemo(() => transformPrioritiesData(data, statuses), [data, statuses]);
    const filteredStatuses = useMemo(() => {
        return statuses.filter(status => {
            return rows.some(row => row[status] > 0);
        });
    }, [rows, statuses]);

    const columnTotals = useMemo(() => {
        return filteredStatuses.reduce((totals, status) => {
            totals[status] = rows.reduce((sum, row) => sum + (row[status] || 0), 0);
            return totals;
        }, {});
    }, [rows, filteredStatuses]);

    const grandTotal = useMemo(
        () => Object.values(columnTotals).reduce((sum, value) => sum + value, 0),
        [columnTotals]
    );

    const rowsWithFooter = useMemo(() => {
        return [
            ...rows,
            { priority: <span className="font-semibold dark:text-gray-200 dark:bg-bodybg">Total</span>, ...columnTotals, total: grandTotal }
        ];
    }, [rows, columnTotals, grandTotal]);

    const headers = useMemo(() => createPrioritiesHeaders(filteredStatuses), [filteredStatuses]);

    const { isTaskModalOpen, fetchData, tasks, loadingTasks, openTaskModal, closeTaskModal } = usePMSStatsDrillDown(
        'dashboard/pms/project/tasks/status/detail/',
        filters
    )

    const handleRowClick = async (rowData, colIndex, headers) => {
        const header = headers[colIndex];
        if (header?.accessor && header.accessor !== "priority") {
            await fetchData({
                status: formatLabel(header.label),
                priority: rowData?.priority?.props?.children ? null : rowData?.priority.toLowerCase(),
            });
        }
    };
    return (
        <div>
            <ClientSideTable
                config={{ headers }}
                data={rowsWithFooter}
                title="Priority Wise Status"
                height="400px"
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

export default PrioritiesTableWrapper;
