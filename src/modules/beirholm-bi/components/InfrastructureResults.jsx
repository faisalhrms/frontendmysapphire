import React from "react"
const InfrastructureResults = ({ analysis }) => {
  if (!analysis) return null
  const { headers, data } = analysis
  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden mb-6">
      <div className="w-full flex justify-center items-center">
        <table className="w-full table-fixed border-collapse">
          <thead style={{ backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white" }}>
            <tr>{headers.map((h, i) => <th key={i} className="p-2 border border-gray-400 text-center">{h}</th>)}</tr>
          </thead>
          <tbody className="text-gray-800">
            {data.map((r, ri) => (
              <tr key={ri}>{r.map((c, ci) => <td key={ci} className="p-2 border border-gray-400 text-center">{c}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default InfrastructureResults
