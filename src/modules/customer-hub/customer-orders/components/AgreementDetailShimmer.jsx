import React from "react"
import TableShimmerRow from "@components/TableShimmerRow.jsx"

const AgreementDetailShimmer = () => {
  return (
    <div className="rounded-xl border dark:border-defaultborder/20 bg-white dark:bg-bodybg shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            Loading agreement…
          </div>
          <div className="text-[0.7rem] text-slate-500 dark:text-slate-400">
            Fetching latest data
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-5">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <table className="w-full">
                <tbody>
                  <TableShimmerRow columns={2} rowHeight={14} />
                  <TableShimmerRow columns={2} rowHeight={14} />
                  <TableShimmerRow columns={2} rowHeight={14} />
                  <TableShimmerRow columns={1} rowHeight={14} />
                  <TableShimmerRow columns={1} rowHeight={14} />
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <table className="w-full">
                <tbody>
                  <TableShimmerRow columns={3} rowHeight={14} />
                  <TableShimmerRow columns={3} rowHeight={14} />
                  <TableShimmerRow columns={3} rowHeight={14} />
                  <TableShimmerRow columns={2} rowHeight={14} />
                  <TableShimmerRow columns={2} rowHeight={14} />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgreementDetailShimmer
