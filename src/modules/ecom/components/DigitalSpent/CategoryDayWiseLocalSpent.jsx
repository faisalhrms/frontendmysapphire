import React, { Fragment } from "react"
import LoadingSpinner from "@components/LoadingSpinner.jsx"
import * as styles from "@helpers/staticDataTableStyles.js"

const getGrowthColor = growth => growth > 7 ? "text-red" : "text-emerald-600"

const CategoryDayWiseLocalSpent = ({ data = {}, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  const rows = data.Local || []
  const categories = [...new Set(rows.flatMap(r => Object.keys(r.categories)))]
  const dataRows = rows.filter(r => r.date !== "Total")
  const totalRow = rows.find(r => r.date === "Total")

  return (
    <div className={styles.wrapper}>
      <h3 className="text-lg font-bold mb-2">Local</h3>
      <div className="overflow-x-auto overflow-y-auto max-h-[600px] mb-5 relative">
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th
                rowSpan="2"
                className={`${styles.headerCell} sticky top-0 left-0 z-[30] bg-gray-800`}
              >
                Date
              </th>
              {categories.map(cat => (
                <th key={cat} colSpan="3" className={`${styles.headerCell} sticky top-0 bg-gray-800 z-20`}>
                  {cat}
                </th>
              ))}
            </tr>
            <tr className={styles.subHeaderRow}>
              {categories.map(cat => (
                <Fragment key={cat}>
                  <th className={`${styles.headerCell} sticky  bg-gray-700 z-10`}>Sale</th>
                  <th className={`${styles.headerCell} sticky  bg-gray-700 z-10`}>Spent</th>
                  <th className={`${styles.headerCell} sticky  bg-gray-700 z-10`}>% of Sale</th>
                </Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {!dataRows.length && (
              <tr>
                <td colSpan={1 + categories.length * 3} className={styles.tdCenter}>
                  No data available.
                </td>
              </tr>
            )}
            {dataRows.map((r, idx) => (
              <tr key={r.date} className={idx % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                <td className={`${styles.tdCell} sticky left-0 z-[5] bg-white dark:bg-bodybg`}>
                  {r.date}
                </td>
                {categories.map(cat => {
                  const { sale, spent, pct } = r.categories[cat] || {}
                  const num = pct ? parseFloat(pct.replace("%", "")) : null
                  return (
                    <Fragment key={cat}>
                      <td className={`${styles.tdCell} ${styles.tdRight}`}>{sale}</td>
                      <td className={`${styles.tdCell} ${styles.tdRight}`}>{spent}</td>
                      <td className={`${styles.tdCell} ${styles.tdCenter} ${num != null ? getGrowthColor(num) : ""}`}>
                        {pct ?? "-"}
                      </td>
                    </Fragment>
                  )
                })}
              </tr>
            ))}
          </tbody>
          {totalRow && (
            <tfoot>
              <tr>
                <td className={`${styles.tdCell} text-center sticky left-0 bottom-0 font-bold z-[25] bg-gray-500`}>
                  Total
                </td>
                {categories.map(cat => {
                  const { sale, spent, pct } = totalRow.categories[cat] || {}
                  const num = pct ? parseFloat(pct.replace("%", "")) : null
                  return (
                    <Fragment key={cat}>
                      <td className={`${styles.tdCell} ${styles.tdRight} sticky bottom-0 bg-gray-500`}>
                        {sale}
                      </td>
                      <td className={`${styles.tdCell} ${styles.tdRight} sticky bottom-0 bg-gray-500`}>
                        {spent}
                      </td>
                      <td className={`${styles.tdCell} ${styles.tdCenter} sticky bottom-0 bg-gray-500 ${num != null ? getGrowthColor(num) : ""}`}>
                        {pct ?? "-"}
                      </td>
                    </Fragment>
                  )
                })}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}

export default CategoryDayWiseLocalSpent
