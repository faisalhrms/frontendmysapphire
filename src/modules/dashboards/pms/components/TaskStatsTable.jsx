import React from "react";
import ClientSideTable from "@components/ClientSideTable.jsx";
import ProgressBar from "@components/ProgressBar.jsx";
import {getBadgeClasses, getStatusClasses} from "@helpers/badges.js";
import {toTitleCase} from "@helpers/formatters.js";
import {formatDate} from "@helpers/dateTime.js";
import AvatarList from "@components/AvatarList.jsx";
import SimpleBar from "simplebar-react";

const TaskStatsTable = ({ rows }) => {

    const tableData = (rows || []).map((item) => ({
        name: item.name,
        progress: <ProgressBar value={item.progress}/>,
        risk_level: <span className={getBadgeClasses(item.risk_level)}>{item.risk_level}</span>,
        status: <p className={getStatusClasses(item.status)}>{toTitleCase(item.status)}</p>,
        started_at: formatDate(item.started_at),
        ended_at: formatDate(item.ended_at),
        users: <AvatarList users={item.users} max={4} />
    }));

    const tableConfig = {
        headers: [
            { label: "Name", accessor: "name", align: "left"},
            { label: "Progress", accessor: "progress" },
            { label: "Risk level", accessor: "risk_level" },
            { label: "Assigned Date", accessor: "started_at" },
            { label: "Due Date", accessor: "ended_at" },
            { label: "Assigned To", accessor: "users" },
        ],
    };

    return (
        <SimpleBar style={{ height :" 300px"}}>
            <ClientSideTable config={tableConfig} data={tableData} title='Tasks'/>
        </SimpleBar>
    )
}
export default React.memo(TaskStatsTable)