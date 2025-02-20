import React, { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/DataTable.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import { getBadgeClasses } from "@helpers/badges.js";
// import TaskListFilter from "@modules/tasks/components/TaskListFilter.jsx";
import useFilters from "@hooks/useFilters.js";
import {formatDate} from "@helpers/dateTime.js";

const TaskList = () => {
    // const {
    //     control,
    //     handleSubmit,
    //     errors,
    //     getFilters,
    //     resetFilters,
    // } = useFilters(
    //     useMemo(
    //         () => ({
    //             initialFilters: [
    //                 { name: "project_name" },
    //                 { name: "milestone_name" },
    //                 { name: "status" },
    //                 { name: "timeline_groups" },
    //             ],
    //         }),
    //         []
    //     )
    // );

    // const [filters, setFilters] = useState(getFilters());

    // const onSubmit = useCallback((formData) => {
    //     setFilters(formData);
    // }, []);
    //
    // const onClear = useCallback(() => {
    //     resetFilters();
    //     setFilters(getFilters());
    // }, [resetFilters, getFilters]);

    const columns = [
        { Header: "Project", accessor: "project_name" },
        { Header: "Milestone", accessor: "milestone_name" },
        { Header: "Task", accessor: "task_name" },
        {
            Header: "Deadline",
            accessor: "task_deadline",
            Cell: ({ value }) => formatDate(value, "MMM dd, yyyy - HH:mm"),
        },
        {
            Header: "Status",
            accessor: "status",
            Cell: ({ row }) => (
                <span className={getBadgeClasses(row.original.status)}>
                {toTitleCase(row.original.status)}
            </span>
            ),
        },
        {
            Header: "Completion Date",
            accessor: "completion_date",
            Cell: ({ value }) => (value ? formatDate(value, "MMM dd, yyyy") : "N/A"),
        },
        { Header: "Status Timeline", accessor: "status_completion_timeline" },
        { Header: "Timeline Group", accessor: "timeline_groups" },
    ];




    return (
        <>
            <PageHeader currentpage="Tasks" mainpage="Tasks" />
            {/*<form onSubmit={handleSubmit(onSubmit)}>*/}
            {/*    <TaskListFilter control={control} errors={errors} onClear={onClear} />*/}
            {/*</form>*/}
            <DataTable
                columns={columns}
                title="Tasks"
                apiUrl="/pms/tasks/datatable/"
                // filter={filters}
            />
        </>
    );
};

export default TaskList;
