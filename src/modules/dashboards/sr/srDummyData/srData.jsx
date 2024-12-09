import { Component } from 'react';
import ReactApexChart from 'react-apexcharts';




export class SrReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            series: [
                {
                    name: 'OnHold',
                    type: 'column',
                    data: [6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28]
                },
                {
                    name: 'Overdue',
                    type: 'column',
                    data: [30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 76, 50]
                },
                {
                    name: 'Cancelled',
                    type: 'column',
                    data: [52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 164, 72]
                },
            ],
            options: {
                chart: {
                    type: 'bar',
                    height: 250,
                    events: {
                        dataPointSelection: (event, chartContext, { seriesIndex }) => {
                            const selectedSR = this.state.series[seriesIndex].name;
                            this.props.onSelectSR(selectedSR); // Pass selected SR type to parent
                        },
                    },
                },
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                colors: ["rgba(132, 90, 223, 1)", '#faa34b', "rgb(250,75,122)"],
                plotOptions: {
                    bar: {
                        columnWidth: "30%",
                        borderRadius: 2
                    }
                },
                legend: {
                    show: true,
                    position: 'top',
                },
            }
        };
    }

    render() {
        return (
            <div>
                <ReactApexChart
                    options={this.state.options}
                    series={this.state.series}
                    type="line"
                    height={257}
                />
            </div>
        );
    }
}

export class OnHold extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [48],
            options: {

                chart: {
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                    height: 120,
                    width: 100,
                    type: "radialBar",
                },
                colors: ["#23b7e5"],
                plotOptions: {
                    radialBar: {
                        hollow: {
                            margin: 0,
                            size: "50%",
                            background: "#fa4b7a"
                        },
                        dataLabels: {
                            name: {
                                offsetY: -10,
                                color: "#4b9bfa",
                                fontSize: "10px",
                                show: false
                            },
                            value: {
                                offsetY: 5,
                                color: "#4b9bfa",
                                fontSize: "12px",
                                show: true,
                                fontWeight: 800
                            }
                        }
                    }
                },
                stroke: {
                    lineCap: "round"
                },
                labels: ["OnHold"]
            }

        };
    }

    render() {
        return (
            <div>
                <ReactApexChart options={this.state.options} series={this.state.series} type="radialBar" width={100} height={120} />
            </div>

        );
    }
}
//
export class Overdue extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [65],
            options: {

                chart: {
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                    height: 120,
                    width: 100,
                    type: "radialBar",
                },
                colors: ["#f7b731"],
                plotOptions: {
                    radialBar: {
                        hollow: {
                            margin: 0,
                            size: "50%",
                            background: "#fff"
                        },
                        dataLabels: {
                            name: {
                                offsetY: -10,
                                color: "#fabd4b",
                                fontSize: "10px",
                                show: false
                            },
                            value: {
                                offsetY: 5,
                                color: "#fa4b7a",
                                fontSize: "12px",
                                show: true,
                                fontWeight: 800
                            }
                        }
                    }
                },
                stroke: {
                    lineCap: "round"
                },
                labels: ["Overdue"]
            }

        };
    }

    render() {
        return (
            <div>
                <ReactApexChart options={this.state.options} series={this.state.series} type="radialBar" width={100} height={120} />
            </div>

        );
    }
}
export class Cancelled extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [65],
            options: {

                chart: {
                    events: {
                        mounted: (chart) => {
                            chart.windowResizeHandler();
                        }
                    },
                    height: 120,
                    width: 100,
                    type: "radialBar",
                },
                colors: ["#f7b731"],
                plotOptions: {
                    radialBar: {
                        hollow: {
                            margin: 0,
                            size: "50%",
                            background: "#fff"
                        },
                        dataLabels: {
                            name: {
                                offsetY: -10,
                                color: "#fabd4b",
                                fontSize: "10px",
                                show: false
                            },
                            value: {
                                offsetY: 5,
                                color: "#fa4b7a",
                                fontSize: "12px",
                                show: true,
                                fontWeight: 800
                            }
                        }
                    }
                },
                stroke: {
                    lineCap: "round"
                },
                labels: ["Cancelled"]
            }

        };
    }

    render() {
        return (
            <div>
                <ReactApexChart options={this.state.options} series={this.state.series} type="radialBar" width={100} height={120} />
            </div>

        );
    }
}

export class SrData extends Component{
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
                colors: ["rgb(38, 191, 148)",],
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



