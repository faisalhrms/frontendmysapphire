import React, {useMemo} from 'react';
import ApexChart from "@components/charts/ApexChart.jsx";
import {mapSeriesToColors, statusColorMapping} from "@helpers/statusStyles.js";

const RatingCard = ({ data }) => {

    const colors = useMemo(() => {
        return mapSeriesToColors(data?.series, statusColorMapping);
    }, [data?.series]);

    return (
        <div className="xl:col-span-6 col-span-6">
            <div className="box">
                <div className="box-header justify-between">
                    <div className="box-title">Performance / Ratings</div>
                </div>
                <div className="box-body">
                    <div id="RatingCardAnalysis">
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

export default RatingCard;
