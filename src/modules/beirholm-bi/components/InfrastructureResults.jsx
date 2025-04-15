import React from "react";

const InfrastructureResults = ({ analysis }) => {
  const tableHeaders = analysis.headers;
  const tableData = analysis.data;

  return (
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
  );
};

export default InfrastructureResults;
