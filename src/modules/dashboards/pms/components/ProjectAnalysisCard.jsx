import React from 'react';
import ReactApexChart from "react-apexcharts";

const ProjectAnalysisCard = ({ data }) => {
    return (
        <div className="xl:col-span-8 col-span-12">
            <div className="box">
                <div className="box-header justify-between">
                    <div className="box-title">Project Analysis</div>
                </div>
                <div className="box-body">
                    <div id="projectAnalysis">
                        <ReactApexChart options={ {
                            chart: {
                                height: 350,
                                animations: {
                                    speed: 500
                                },
                                dropShadow: {
                                    enabled: true,
                                    enabledOnSeries: undefined,
                                    top: 8,
                                    left: 0,
                                    blur: 3,
                                    color: 'rgb(132, 90, 223)',
                                    opacity: 0.1
                                },
                            },
                            colors: ["rgba(132, 90, 223, 0.2)", "rgba(35, 183, 229, 0.85)", "rgb(245, 184, 73)", "rgb(29, 216, 113)", "rgb(208, 61, 70)"],
                            dataLabels: {
                                enabled: false
                            },
                            grid: {
                                borderColor: '#f1f1f1',
                                strokeDashArray: 3
                            },
                            stroke: {
                                curve: 'smooth',
                                width: [2, 2, 2, 2, 2],
                                dashArray: [0, 5, 0, 0, 0],
                            },
                            xaxis: {
                                axisTicks: {
                                    show: false,
                                },
                            },
                            markers: {
                                hover: {
                                    sizeOffset: 5
                                }
                            },
                        }} series={data.series} type="line" height={350} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectAnalysisCard;
