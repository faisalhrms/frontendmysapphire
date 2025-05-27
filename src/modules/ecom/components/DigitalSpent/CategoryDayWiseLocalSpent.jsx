import React, { Fragment } from "react"
import LoadingSpinner from "@components/LoadingSpinner.jsx"
import * as styles from "@helpers/staticDataTableStyles.js"

const getGrowthColor = g => (g < 0 ? "text-red" : "text-emerald-600")

const CategoryDayWiseLocalSpent = ({ data = {}, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  const rows = data.Local || []
  const categories = rows.length ? Object.keys(rows[0].categories) : []
  const totalCols = 1 + categories.length * 3

  return (
    <div className={styles.wrapper}>
      <h3 className="text-lg font-bold mb-2">Local</h3>
      <div className="overflow-x-auto overflow-y-auto max-h-[600px] mb-5">
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th rowSpan="2" className={styles.headerCell}>Date</th>
              {categories.map(cat => (
                <th key={cat} colSpan="3" className={styles.headerCell}>{cat}</th>
              ))}
            </tr>
            {rows.length > 0 && (
              <tr className={styles.subHeaderRow}>
                {categories.map(cat => (
                  <Fragment key={cat}>
                    <th className={styles.headerCell}>Sale</th>
                    <th className={styles.headerCell}>Spent</th>
                    <th className={styles.headerCell}>% of Sale</th>
                  </Fragment>
                ))}
              </tr>
            )}
          </thead>
          <tbody>
            {!rows.length && (
              <tr>
                <td colSpan={totalCols} className={styles.tdCenter}>No data available.</td>
              </tr>
            )}
            {rows.map((r, idx) => {
              const rowClass = idx % 2 === 0 ? styles.rowEven : styles.rowOdd
              return (
                <tr key={r.date} className={rowClass}>
                  <td className={styles.tdCell}>{r.date}</td>
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
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CategoryDayWiseLocalSpent
