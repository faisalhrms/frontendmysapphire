import React from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";

const formatNumber = (num) => num?.toLocaleString() || "N/A";
const formatPercentage = (value) => {
  const num = parseFloat(value);
  return {
    value: `${num > 0 ? "" : "-"}${Math.abs(num)}%`,
    isNegative: num < 0,
  };
};

const Table = ({ title, headers = [], data = [], loading }) => {
  console.log(loading);
  return (
      <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden mt-4 mb-4">
        <div className="p-3 text-lg font-semibold text-gray-900 dark:text-gray-200 border-b bg-gray-100 dark:border-gray-700">
          {title}
        </div>

        <div className="w-full flex justify-center items-center">
          {loading ? (
              <LoadingSpinner />
          ) : (
              <table className="w-full table-fixed border-collapse">
                <thead className="bg-gray-200 dark:border-gray-700 dark:text-gray-200 text-gray-700 uppercase">
                <tr>
                  <th className="p-2 border border-gray-400 dark:border-gray-700"></th>
                  <th colSpan="3" className="p-2 text-center border border-gray-400 dark:border-gray-700">CY</th>
                  <th colSpan="3" className="p-2 text-center border border-gray-400 dark:border-gray-700">LY</th>
                  <th colSpan="3" className="p-2 text-center border border-gray-400 dark:border-gray-700">YoY%</th>
                </tr>
                <tr>
                  {headers.map((header, index) => (
                      <th key={index} className="p-3 border border-gray-300 dark:border-gray-700 text-center">
                        {header.label}
                      </th>
                  ))}
                </tr>
                </thead>
                <tbody className="text-gray-800 dark:text-gray-200">
                {data.length > 0 ? (
                    data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border border-gray-300 dark:border-gray-700 transition hover:bg-gray-100">
                          <td className="border border-gray-400 font-semibold dark:border-gray-700 text-center">
                            {row.period}
                          </td>
                          <td className="border border-gray-400 dark:border-gray-700 text-center">{formatNumber(row?.cy_order)}</td>
                          <td className="border border-gray-400 dark:border-gray-700 text-center">{formatNumber(row?.cy_qty)}</td>
                          <td className="border border-gray-400 dark:border-gray-700 text-center">{formatNumber(row?.cy_value)}</td>
                          <td className="border border-gray-400 dark:border-gray-700 text-center">{formatNumber(row?.ly_order)}</td>
                          <td className="border border-gray-400 dark:border-gray-700 text-center">{formatNumber(row?.ly_qty)}</td>
                          <td className="border border-gray-400 dark:border-gray-700 text-center">{formatNumber(row?.ly_value)}</td>
                          <td className={`border border-gray-400 dark:border-gray-700 text-center ${row?.yoy_order < 0 ? "text-red-600" : ""}`}>
                            {formatPercentage(row?.yoy_qty).value}
                          </td>
                          <td className={`border border-gray-400 dark:border-gray-700 text-center ${row?.yoy_qty < 0 ? "text-red-600" : ""}`}>
                            {formatPercentage(row?.yoy_qty).value}
                          </td>
                          <td className={`border border-gray-400 dark:border-gray-700 text-center ${row?.yoy_value< 0 ? "text-red-600" : ""}`}>
                            {formatPercentage(row?.yoy_value).value}
                          </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                      <td colSpan={headers.length} className="p-3 text-center text-gray-500">
                        No Data Available
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
          )}
        </div>
      </div>
  );
};

export default Table;