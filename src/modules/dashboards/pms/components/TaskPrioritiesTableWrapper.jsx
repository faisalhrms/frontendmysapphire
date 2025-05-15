import React, { useMemo, useState } from "react";
import ClientSideTable from "@components/ClientSideTable.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import usePMSStatsDrillDown from "@modules/dashboards/pms/hooks/usePMSStatsDrillDown.js";
import TaskListModal from "@modules/project-management/components/model/TaskListModal.jsx";

function transformData(data) {
    const rows = [];

    Object.entries(data).forEach(([tag, teamsData]) => {
        let tagHigh = 0;
        let tagMedium = 0;
        let tagLow = 0;
        let tagTotal = 0;

        rows.push({
            tagTeam: <span className="font-semibold dark:text-gray-200 dark:bg-bodybg !text-left">{tag.toUpperCase()}</span>,
            tag: tag,
            high: tagHigh,
            medium: tagMedium,
            low: tagLow,
            total: tagTotal,
        });

        Object.entries(teamsData).forEach(([team, priorities]) => {
            tagHigh += priorities["High"] || 0;
            tagMedium += priorities["Medium"] || 0;
            tagLow += priorities["Low"] || 0;
            tagTotal += priorities["Total"] || 0;

            rows.push({
                tagTeam: toTitleCase(team),
                tag: tag,
                high: priorities["High"] || 0,
                medium: priorities["Medium"] || 0,
                low: priorities["Low"] || 0,
                total: priorities["Total"] || 0,
            });
        });

        rows[rows.length - Object.keys(teamsData).length - 1] = {
            tagTeam: <span className="font-semibold dark:text-gray-200 dark:bg-bodybg !text-left">{tag.toUpperCase()}</span>,
            tag: tag,
            high: tagHigh,
            medium: tagMedium,
            low: tagLow,
            total: tagTotal,
        };
    });

    return rows;
}

function createHeaders() {
    return [
        { label: "Tag/Team", accessor: "tagTeam", align: "!text-left" },
        { label: "High", accessor: "high", classes: "cursor-pointer" },
        { label: "Medium", accessor: "medium", classes: "cursor-pointer" },
        { label: "Low", accessor: "low", classes: "cursor-pointer" },
        { label: "Total", accessor: "total", classes: "cursor-pointer" },
    ];
}

const TaskPrioritiesTableWrapper = ({ data, title = 'Pending Tasks by Tag/Team', filters, type }) => {
    const rows = useMemo(() => transformData(data), [data]);

    const headers = useMemo(() => createHeaders(), []);

    const { isTaskModalOpen, fetchData, tasks, loadingTasks, openTaskModal, closeTaskModal } = usePMSStatsDrillDown(
        'dashboard/pms/project/tasks/priority/detail/',
        filters
    )

    const handleRowClick = async (rowData, colIndex, headers) => {
        const header = headers[colIndex];
        if (header?.accessor && header.accessor !== "tagTeam") {
            await fetchData({
                priority: header.label.toLowerCase() === 'total' ? null : header.label.toLowerCase(),
                tag: rowData?.tag,
                team: rowData?.tagTeam?.props?.children ? null : rowData?.tagTeam,
                type: type
            });
        }
    };

    return (
        <>
            <ClientSideTable
                config={{ headers }}
                data={rows}
                title={title}
                height="400px"
                tHeadClasses="table-bg-dark"
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
        </>
    );
};

export default React.memo(TaskPrioritiesTableWrapper);
