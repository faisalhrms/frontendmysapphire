import React from "react"
import LoadingSpinner from "@components/LoadingSpinner.jsx"
import * as styles from "@helpers/staticDataTableStyles.js"

const getGrowthColor = g => (g < 0 ? "text-red" : "text-emerald-600")

const DailyWebsiteVisitors = ({ loading, data = {} }) => {
  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )

  const rows       = data.Local || []
  const normal     = rows.filter(r => r.date !== "Total")
  const totalRow   = rows.find(r => r.date === "Total")
  const grouped    = Object.entries(
    normal.reduce((a, r) => ((a[r.week] ??= []).push(r), a), {})
  )

  return (
    <div className={styles.wrapper}>

      <div className="overflow-x-auto overflow-y-auto max-h-[600px] mb-5">
        <table className={`${styles.table} table-fixed`}>
          <thead className={styles.thead}>
            <tr>
              <th className={`${styles.headerCell}`}>Week</th>
              <th className={styles.headerCell}>Date</th>
              <th className={styles.headerCell}>Day</th>
              <th className={styles.headerCell}>Digital Spent</th>
              <th className={styles.headerCell}>Sessions</th>
              <th className={styles.headerCell}>Orders</th>
              <th className={styles.headerCell}>Conv%</th>
              <th className={styles.headerCell}>Sale Value</th>
            </tr>
          </thead>

          <tbody>
            {!rows.length && (
              <tr>
                <td colSpan={8} className={styles.tdCenter}>No data available.</td>
              </tr>
            )}

            {grouped.map(([wk, list]) =>
              list.map((r, i) => {
                const conv = parseFloat(r.conv_per.replace("%", "")) || 0
                const rowCls = i % 2 === 0 ? styles.rowEven : styles.rowOdd
                return (
                  <tr key={r.date} className={rowCls}>
                    {i === 0 && (
                      <td
                        rowSpan={list.length}
                        className={`${styles.tdCell} ${styles.tdCenter}`}
                      >
                        {wk}
                      </td>
                    )}
                    <td className={styles.tdCell}>{r.date}</td>
                    <td className={styles.tdCell}>{r.day}</td>
                    <td className={`${styles.tdCell} ${styles.tdRight}`}>{r.spent}</td>
                    <td className={`${styles.tdCell} ${styles.tdRight}`}>{r.sessions}</td>
                    <td className={`${styles.tdCell} ${styles.tdRight}`}>{r.orders}</td>
                    <td className={`${styles.tdCell} ${styles.tdCenter} ${getGrowthColor(conv)}`}>
                      {r.conv_per}
                    </td>
                    <td className={`${styles.tdCell} ${styles.tdRight}`}>{r.sale_value}</td>
                  </tr>
                )
              })
            )}
          </tbody>

          {totalRow && (
            <tfoot className="sticky bottom-0">
              <tr className={styles.rowTotal}>
                <td className={styles.tdCell}></td>
                <td className={styles.tdCell}>Total</td>
                <td className={styles.tdCell}></td>
                <td className={`${styles.tdCell} ${styles.tdRight}`}>{totalRow.spent}</td>
                <td className={`${styles.tdCell} ${styles.tdRight}`}>{totalRow.sessions}</td>
                <td className={`${styles.tdCell} ${styles.tdRight}`}>{totalRow.orders}</td>
                <td
                  className={`${styles.tdCell} ${styles.tdCenter} ${getGrowthColor(parseFloat(totalRow.conv_per.replace("%","")) || 0)}`}
                >
                  {totalRow.conv_per}
                </td>
                <td className={`${styles.tdCell} ${styles.tdRight}`}>{totalRow.sale_value}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}

export default DailyWebsiteVisitors
