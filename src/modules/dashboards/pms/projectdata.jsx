import { Component } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from "apexcharts";

export class Projectdata extends Component {
  constructor(props) {
      super(props);

      this.state = {
          series: [1754, 1234, 878, 270],
          options: {

              labels: ["open", "In progress", "Completed","On Hold" ,"Overall","Others"],
              chart: {
                  height: 250,
                  type: 'donut',
                  events: {
                      mounted: (chart) => {
                        chart.windowResizeHandler();
                      }
                    },
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
                          size: '80%',
                          background: 'transparent',
                          labels: {
                              show: true,
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
                              total: {
                                  show: true,
                                  showAlways: true,
                                  label: 'Total',
                                  fontSize: '22px',
                                  fontWeight: 600,
                                  color: '#495057',
                              }

                          }
                      }
                  }
              },
              colors: ["rgba(132, 90, 223, 1)", "rgba(35, 183, 229, 1)", "rgba(38, 191, 148, 1)", "rgba(245, 184, 73, 1)",],
          }

      };
  }

  render() {
      return (
          <div>
              <ReactApexChart options={this.state.options} series={this.state.series} type="donut" height={250} />
          </div>

      );
  }
}