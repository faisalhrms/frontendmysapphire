import LoadingSpinner from "@components/LoadingSpinner.jsx";
import React from "react";
import TaskOverviewCard from "@modules/dashboards/pms/components/TaskOverviewCard.jsx";
import TaskDelayedTeamCard from "@modules/dashboards/pms/components/TaskDelayedTeamCard.jsx";
import TaskDelayedPersonCard from "@modules/dashboards/pms/components/TaskDelayedPersonCard.jsx";
import TaskOverviewCompletedCard from "@modules/dashboards/pms/components/TaskOverviewCompletedCard.jsx";

const ProjectDashboardTaskStats = ({data, isLoading, isActive}) => {
    if (isLoading) {
        return <LoadingSpinner/>;
    }
    if (!isActive){
        return null
    }
    return (
            <>
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xl:col-span-6 col-span-12">
                        <TaskOverviewCard data={data?.overview}/>
                    </div>
                    <div className="xl:col-span-6 col-span-12">
                        <TaskDelayedTeamCard data={data?.delayed_by_team}/>
                    </div>
                    <div className="xl:col-span-6 col-span-12">
                        <TaskDelayedPersonCard data={data?.delayed_by_person}/>
                    </div>
                    <div className="xl:col-span-6 col-span-12">
                        <TaskOverviewCompletedCard data={data?.overview_completed_tasks}/>
                    </div>
                </div>
            </>
    )
}

export default React.memo(ProjectDashboardTaskStats)