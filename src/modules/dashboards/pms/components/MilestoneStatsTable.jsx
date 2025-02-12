import React from "react";
import ClientSideTable from "@components/ClientSideTable.jsx";
import ProgressBar from "@components/ProgressBar.jsx";
import {getBadgeClasses} from "@helpers/badges.js";

const MilestoneStatsTable = ({ rows }) => {

    const tableData = (rows || []).map((item) => ({
        name: item.name,
        total_days: item.total_days,
        days_passed: item.days_passed,
        expected_progress: <ProgressBar value={item.expected_progress} status=''/>,
        actual_progress: <ProgressBar value={item.actual_progress} status='' barColor='!bg-success' txtColor='success'/>,
        variance: <ProgressBar value={item.variance} status='' barColor='!bg-warning' txtColor='warning'/>,
        risk_level: <span className={getBadgeClasses(item.risk_level)}>{item.risk_level}</span>,
        overdue_tasks: item.overdue_tasks > 0 ? <span className='text-danger'>{item.overdue_tasks}</span> : 0,
    }));

    const tableConfig = {
        headers: [
            {label: "Name", accessor: "name", align: "left"},
            { label: "Total days", accessor: "total_days" },
            { label: "Days passed", accessor: "days_passed" },
            { label: "Expected progress", accessor: "expected_progress" },
            { label: "Actual progress", accessor: "actual_progress" },
            { label: "Variance", accessor: "variance" },
            { label: "Risk level", accessor: "risk_level" },
            { label: "Overdue tasks", accessor: "overdue_tasks" },
        ],
    };
    return (
        <ClientSideTable config={tableConfig} data={tableData} title='Milestones'/>
    )
}
export default React.memo(MilestoneStatsTable)