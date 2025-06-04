import React from "react"
import LoadingSpinner from "@components/LoadingSpinner"

const fmtPercent = v => {
  if (!v) return "0%"
  const p4 = parseFloat(v.toFixed(3))
  if (p4) return `${p4}%`
  return `${parseFloat(v.toFixed(6))}%`
}

export default function SplitTable({ title, data, labelKey, valueKey, isLoading }) {
  const total = data.reduce((s, r) => s + Number(r[valueKey] || 0), 0)
  const totalPercent = data.reduce((s, r) => s + Number(r.percentage || 0), 0)

  return (
    <div className="border border-gray-400 text-black dark:text-gray-200 dark:bg-bodybg bg-white flex flex-col h-[330px] w-full rounded-lg">
      <div className="px-4 pt-2 pb-2 text-center text-[#1E3A8A]">
        <h6 className="text-base font-semibold">{title}</h6>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="sticky top-0">
                <tr className="bg-amber-400 text-[#1E40AF]">
                  <th className="py-1 pl-2 text-left">{title.split(" ")[0]}</th>
                  <th className="py-1 pr-2 text-right">Value&nbsp;(USD)</th>
                  <th className="py-1 pr-2 text-right">%</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} className={i % 2 ? "bg-gray-100" : "bg-white"}>
                    <td className="pl-2 whitespace-nowrap border border-gray-400">{row[labelKey]}</td>
                    <td className="pr-2 text-right whitespace-nowrap border border-gray-400">
                      {Number(row[valueKey]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="pr-2 text-right whitespace-nowrap border border-gray-400">
                      {fmtPercent(row.percentage)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border border-gray-400 text-[#1E3A8A] dark:text-gray-200 dark:bg-bodybg font-semibold grid grid-cols-3 px-2 py-1 text-xs rounded-lg">
            <span>Total</span>
            <span className="text-right">
              {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-right">{fmtPercent(totalPercent)}</span>
          </div>
        </>
      )}
    </div>
  )
}
