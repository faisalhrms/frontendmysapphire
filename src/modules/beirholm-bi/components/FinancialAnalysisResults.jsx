import React from "react";
import Chart from "react-apexcharts";

const FinancialAnalysisResults = ({ analysis, currencyValue, convertToMillions }) => {
  const tableHeaders = analysis.headers;
  const tableData = analysis.values[currencyValue] || [];
  const ratioHeaders = analysis.ratios.headers;
  const ratioData = analysis.ratios.data;
  const years = tableHeaders.slice(2);
  const revenue = convertToMillions(tableData.find(row => row[0] === "Revenue"));
  const grossProfit = convertToMillions(tableData.find(row => row[0] === "Gross Profit"));
  const profitAfterTax = convertToMillions(tableData.find(row => row[0] === "Profit After Tax"));
  const equity = convertToMillions(tableData.find(row => row[0] === "Equity"));
  const currentLiabilities = convertToMillions(tableData.find(row => row[0] === "Current Liabilities"));
  const nonCurrentLiabilities = convertToMillions(tableData.find(row => row[0] === "Non-Current Liabilities"));

const revenueChartOptions = {
  chart: { type: "bar", height: 350, stacked: false },
  xaxis: { categories: years },
  yaxis: [
    {
      title: { text: `Revenue (Million) in ${currencyValue}` },
      labels: {
        formatter: (val) => parseFloat(val).toFixed(2)
      }
    },
    {
      opposite: true,
      title: { text: `Profit Metrics (Million) in ${currencyValue}` },
      labels: {
        formatter: (val) => parseFloat(val).toFixed(2)
      }
    }
  ],
  dataLabels: {
    enabled: true,
    enabledOnSeries: [0],
    formatter: (val) => parseFloat(val).toFixed(2),
    offsetY: -10,
      style: { fontSize: "12px", colors: ["#304758"] }  },
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: (val) => `${parseFloat(val).toFixed(2)} Million (${(val * 1000).toFixed(2)} Thousand)`
    }
  },
  stroke: {
    width: [0, 2, 2],
    curve: "smooth"
  },
  markers: {
    size: 4,
    hover: { sizeOffset: 4 }
  }
};


const revenueChartSeries = [
  { name: "Revenue", type: "column", data: revenue },
  { name: "Gross Profit", type: "line", data: grossProfit, yAxisIndex: 1 },
  { name: "Profit After Tax", type: "line", data: profitAfterTax, yAxisIndex: 1 }
];

  const equityChartOptions = {
    chart: { type: "bar", height: 350, stacked: true },
    plotOptions: { bar: { horizontal: true } },
    xaxis: { categories: years, labels: { style: { fontSize: "12px" } } },
    yaxis: { title: { text: `Value (Million) in ${currencyValue}` }, labels: { style: { fontSize: "12px" } } },
    tooltip: {
      shared: true,
      intersect: false,
      y: { formatter: (val) => `${val} Million (${(val * 1000).toFixed(2)} Thousand)` }
    }
  };
  const equityChartSeries = [
    { name: "Equity", data: equity },
    { name: "Current Liabilities", data: currentLiabilities },
    { name: "Non-Current Liabilities", data: nonCurrentLiabilities }
  ];

  return (
    <div>
      <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="p-3 text-lg font-semibold text-gray-900 border-b bg-gray-100 text-left">
          {/*{analysis.title}*/}
        </div>
        <div className="w-full flex justify-center items-center">
          <table className="w-full table-fixed border-collapse">
            <thead style={{ backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white" }}>
              <tr className="custom-table-header">
                {tableHeaders.map((header, headerIndex) => (
                  <th key={headerIndex} className="p-2 border border-gray-400 text-center">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="p-2 border border-gray-400 text-center">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {ratioHeaders && ratioHeaders.length > 0 && (
        <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="p-3 text-lg font-semibold text-gray-900 border-b bg-gray-100 text-left">
            {/*{analysis.ratios.title}*/}
          </div>
          <div className="w-full flex justify-center items-center">
            <table className="w-full table-fixed border-collapse">
              <thead style={{ backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white" }}>
                <tr className="custom-table-header">
                  {ratioHeaders.map((header, headerIndex) => (
                    <th key={headerIndex} className="p-2 border border-gray-400 text-center">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {ratioData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="p-2 border border-gray-400 text-center">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="grid grid-cols-12 gap-x-6 mb-6">
        <div className="xl:col-span-6 col-span-12">
          <Chart options={revenueChartOptions} series={revenueChartSeries} type="line" height={350} />
        </div>
        <div className="xl:col-span-6 col-span-12">
          <Chart options={equityChartOptions} series={equityChartSeries} type="bar" height={350} />
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalysisResults;
