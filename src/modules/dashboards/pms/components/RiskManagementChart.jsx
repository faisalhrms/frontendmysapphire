import React, { useMemo, useState } from 'react';
import ApexChart from "@components/charts/ApexChart.jsx";
import { mapSeriesToColors, statusColorMapping } from "@helpers/statusStyles.js";
import MilestonesStatsModal from "@modules/dashboards/pms/components/MilestonesStatsModal.jsx";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";
import LottieLoader from "@components/LottieLoader.jsx";

const RiskAnalysisChart = ({ filters }) => {
    const { data, isLoading } = useFetchWithFilters(
        '/dashboard/pms/statistics/risk-summary/', filters
    );
    const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const colors = useMemo(() => {
        return mapSeriesToColors(data?.series, statusColorMapping);
    }, [data?.series]);

    const handlePointClick = (event, chartContext, config) => {
        const { dataPointIndex } = config;
        const projectId = data?.details?.[dataPointIndex]?.id;

        if (projectId) {
            setSelectedProjectId(projectId);
            setIsMilestoneModalOpen(true);
        }
    };
    const closeMilestoneModal = () => {
        setIsMilestoneModalOpen(false);
        setSelectedProjectId(null);
    };
    return (
        <>
            <div className="xl:col-span-12 col-span-12">
                <div className="box">
                    <div className="box-header justify-between">
                        <div className="box-title">Risk Analysis Summary</div>
                    </div>
                    <div className="box-body">
                        {
                            isLoading ?
                                <LottieLoader
                                    width={300}
                                    height={300}
                                    opacity={0.2}
                                    speed={0.5}
                                />
                                :
                                <div id="projectAnalysis">
                                    <ApexChart
                                        columnWidth="15%"
                                        additionalOptions={{
                                            legend: {position: 'top'},
                                            plotOptions: {
                                                bar: {
                                                    colors: {
                                                        ranges: [{
                                                            from: -100,
                                                            to: -0,
                                                            color: '#ebeff5'
                                                        }]
                                                    }
                                                }
                                            },
                                            dataLabels: {
                                                enabled: true,
                                                formatter: function (val) {
                                                    return `${val}%`;
                                                },
                                            },
                                        }}
                                        colors={colors}
                                        categories={data.categories}
                                        height={500}
                                        series={data.series}
                                        onPointClick={handlePointClick}
                                    />
                                </div>
                        }
                    </div>
                </div>
            </div>


            {isMilestoneModalOpen && selectedProjectId && (
                <MilestonesStatsModal
                    onClose={closeMilestoneModal}
                    projectId={selectedProjectId}
                />
            )}
        </>
    );
};

export default React.memo(RiskAnalysisChart);

