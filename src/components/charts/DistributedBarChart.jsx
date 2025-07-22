import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';

class DistributedBarChart extends Component {
    constructor(props) {
        super(props);

        const { labels = [], values = [], colors = [] } = props;

        this.state = {
            series: [{ data: values }],
            options: {
                chart: {
                    height: 320,
                    type: 'bar',
                    events: {
                        click: function (_chart, _w, _e) {},
                        mounted: chart => chart.windowResizeHandler(),
                    },
                },
                colors: colors.length ? colors : ['#845adf', '#23b7e5', '#f5b849', '#49b6f5', '#e6533c', '#26bf94'],
                plotOptions: {
                    bar: {
                        columnWidth: '60%',
                        distributed: true,
                        endingShape: 'rounded',
                    }
                },
                tooltip: {
                    shared: false,
                    intersect: false,
                    followCursor: true,
                    style: {
                        fontSize: '13px',
                    }
                },
                dataLabels: { enabled: false },
                legend: { show: false },
                grid: { borderColor: '#f2f5f7' },
                xaxis: {
                    categories: labels,
                    labels: {
                        style: {
                            colors: colors.length ? colors : ['#845adf', '#23b7e5', '#f5b849'],
                            fontSize: '12px',
                        }
                    }
                },
                yaxis: {
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-yaxis-label',
                        },
                    }
                }
            }

        };
    }

    render() {
        return (
            <ReactApexChart
                options={this.state.options}
                series={this.state.series}
                type="bar"
                height={350}
            />
        );
    }
}

export default DistributedBarChart;
