import React, {useMemo} from 'react';
import ApexChart from "@components/charts/ApexChart.jsx";
import {mapSeriesToColors, statusColorMapping} from "@helpers/statusStyles.js";

const completedOverdue = ({data}) => {

    const colors = useMemo(() => {
        return mapSeriesToColors(data?.series, statusColorMapping);
    }, [data?.series]);

    return (
        <div className="xl:col-span-6 col-span-6">
            <div className="box">
                <div className="box-header justify-between">
                    <div className="box-title">Overdue</div>
                </div>
                <div className="box-body">
                    <div id="completedOverdueAnalysis">
                        <ApexChart
                            additionalOptions={{
                                grid: {show: true},
                                legend: {position: 'top'}
                            }}
                            height={350}
                            baseWidthPerCategory={50}
                            series={data.series}
                            categories={data.categories}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default completedOverdue;
