import React from "react";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import CompletedCard from "@modules/dashboards/sr/components/CompletedCard.jsx";
import {usePersonViewDashboardStatistics} from "@modules/dashboards/sr/Hooks/srDashboardHook.js";
import CompletedOverdue from "@modules/dashboards/sr/components/completedOverdue.jsx";
import OverdueCard from "@modules/dashboards/sr/components/OverdueCard.jsx";
import TeamCard from "@modules/dashboards/sr/components/TeamCard.jsx";
import RatingCard from "@modules/dashboards/sr/components/RatingCard.jsx";
import ProjectSummaryStats from "@modules/project-management/components/project/ProjectSummaryStats.jsx";
import ClosedSR from "@modules/dashboards/sr/components/ClosedSR.jsx";


const PersonView = () => {
    const {data, isLoading, refetch} = usePersonViewDashboardStatistics();
    return (
        <>
            {
                isLoading ?
                    <LoadingSpinner/>
                    :
                    (
                        <>

                            <div className="grid grid-cols-12 gap-x-6">
                                <CompletedCard
                                    data={data.completed_card}
                                />
                                <CompletedOverdue
                                    data={data.completed_overdue_card}
                                />
                                <OverdueCard
                                    data={data.overdue_card}
                                />
                                <TeamCard
                                    data={data.not_started}
                                />
                                <RatingCard
                                    data={data.ratings_card}
                                />
                                <div className="xl:col-span-6 col-span-12">
                                    <ClosedSR summary={data.closed_service_requests_card} statsFetching={isLoading}
                                                         heading='Closed SR'/>
                                </div>

                            </div>
                        </>
                    )
            }

        </>
    );
}

export default PersonView;
