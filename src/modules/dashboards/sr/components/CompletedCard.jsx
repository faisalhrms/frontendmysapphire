import React, {useMemo} from 'react';
import ApexChart from "@components/charts/ApexChart.jsx";
import {mapSeriesToColors, statusColorMapping} from "@helpers/statusStyles.js";

const CompletedCard = ({ data }) => {

    const colors = useMemo(() => {
        return mapSeriesToColors(data?.series, statusColorMapping);
    }, [data?.series]);

    return (
        <div className="xl:col-span-6 col-span-6">
            <div className="box">
                <div className="box-header justify-between">
                    <div className="box-title">Completed</div>
                </div>
                <div className="box-body">
                    <div id="completedAnalysis">
                        <ApexChart
                            additionalOptions={{
                                grid: { show: true },
                                legend: { position: 'top' }
                            }}
                            columnWidth='90%'
                            height={350}
                            series={data.series}
                            categories={data.categories}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompletedCard;
