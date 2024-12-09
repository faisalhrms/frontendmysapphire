import {Component, useEffect, useRef, useState} from 'react';
import ReactApexChart from 'react-apexcharts';
import ReactECharts from 'echarts-for-react';
import nftimage1 from "@assets/images/nft-images/1.png";
import nftimage2 from "@assets/images/nft-images/2.png";
import nftimage5 from "@assets/images/nft-images/5.png";
import nftimage6 from "@assets/images/nft-images/6.png";
import nftimage7 from "@assets/images/nft-images/7.png";
import nftimage8 from "@assets/images/nft-images/8.png";

// BasicLine Chart
export class Sourcedata extends Component{
    constructor(props) {
        super(props);

        this.state = {
            series: [32, 27, 25, 16],
            options: {

                labels: ["My First Dataset"],
                chart: {
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                    height: 260,
                    type: 'donut'
                },
                dataLabels: {
                    enabled: false,
                },

                legend: {
                    show: false,
                },
                stroke: {
                    show: true,
                    curve: 'smooth',
                    lineCap: 'round',
                    colors: ["#fff"],
                    width: 0,
                    dashArray: 0,
                },
                plotOptions: {

                    pie: {
                        expandOnClick: false,
                        donut: {
                            size: '82%',
                            labels: {
                                show: false,
                                name: {
                                    show: true,
                                    fontSize: '20px',
                                    color: '#495057',
                                    offsetY: -4
                                },
                                value: {
                                    show: true,
                                    fontSize: '18px',
                                    color: undefined,
                                    offsetY: 8,
                                    formatter: function (val) {
                                        return val + "%";
                                    }
                                },

                            }
                        }
                    }
                },
                colors: ["rgb(132, 90, 223)", "rgb(35, 183, 229)",  "rgb(245, 184, 73)", "rgb(38, 191, 148)",],
            }

        };
    }

    render() {
        return (
            <div>
                <ReactApexChart options={this.state.options} series={this.state.series} type="donut" height={260} />
            </div>

        );
    }
}

export class Basicline extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: "Desktops",
                data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
            }],
            options: {
                chart: {
                    height: 320,
                    type: 'line',
                    toolbar: {
                        show: false,
                    },
                    zoom: {
                        enabled: false
                    },
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                },
                colors: ['#845adf'],
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'straight',
                    width: 3,
                },
                grid: {
                    borderColor: '#f2f5f7',
                },
                title: {
                    text: 'Product Trends by Month',
                    align: 'left',
                    style: {
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#8c9097'
                    },
                },
                xaxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                    labels: {
                        show: true,
                        style: {
                            colors: "#8c9097",
                            fontSize: '11px',
                            fontWeight: 600,
                            cssClass: 'apexcharts-xaxis-label',
                        },
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
            <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={300} />

        );
    }
}

export function Basicechart() {
    const chartRef = useRef(null);
    const [chartWidth, setChartWidth] = useState('100%'); // Initial width is 100%
    const option = {
        grid: {
            left: "0%",
            right: "0%",
            bottom: "0%",
            top: "10%",
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisLine: {
                lineStyle: {
                    color: "#8c9097"
                },
                splitLine: {
                    lineStyle: {
                        color: "rgba(142, 156, 173,0.1)"
                    }
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: "#8c9097"
                }
            },
            splitLine: {
                lineStyle: {
                    color: "rgba(142, 156, 173,0.1)"
                }
            }
        },
        series: [
            {
                data: [150, 230, 224, 218, 135, 147, 260],
                type: 'line'
            }
        ],
        color: "#845adf"
    };
    useEffect(() => {
        if (chartRef.current) {
            const myChart = chartRef.current.getEchartsInstance();
            myChart.setOption(option);

            const resizeHandler = () => {
                // Adjust chart width based on the parent container's width
                const parentWidth = chartRef.current?.props?.style?.width;
                if (parentWidth) {
                    setChartWidth(parentWidth);
                }
                myChart.resize();
            };

            // Call the initial resize handler
            resizeHandler();

        }
    }, [option]);

    return (
        <div style={{ width: '100%', overflow: 'hidden' }}>
            <ReactECharts ref={chartRef} option={option} style={{ width: chartWidth, height: '400px' }} />
        </div>
    );
}

export const Courselist = [
    { id: 1, src: nftimage1, name: 'Ray Optics & Optical Fibre Master Class', category: 'Science', classes: '20', last: '29-05-2023', instructor: 'Shin Opran', students: '25' },
    { id: 2, src: nftimage2, name: 'Master Linear Alzebra Medium Level', category: 'Mathematics', classes: '90', last: '11-06-2023', instructor: '	Arya Neo', students: '773' },
    { id: 3, src: nftimage8, name: 'Learn How To Trade And Invest For-Absolute Beginners', category: 'Stocks & Trading', classes: '161', last: '10-06-2023', instructor: 'Sia Niu', students: '51' },
    { id: 4, src: nftimage7, name: 'Digital Marketing Course from Scratch', category: 'Marketing', classes: '115', last: '21-06-2023', instructor: 'Stuart George', students: '1,189' },
    { id: 5, src: nftimage5, name: 'Data Structures & Algorithms For Beginners', category: 'Programming', classes: '30', last: '15-06-2023', instructor: 'Boran Ray', students: '3,368' },
    { id: 6, src: nftimage6, name: 'Css Zero to Hero Master Class', category: 'UI/UX', classes: '51', last: '22-06-2023', instructor: 'Burak Oin', students: '252' },
];