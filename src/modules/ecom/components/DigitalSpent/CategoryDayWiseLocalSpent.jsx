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

  const rows       = data.Local || []
  const categories = rows.length ? Object.keys(rows[0].categories) : []
  const totalCols  = 3 + categories.length * 3

  const grouped = rows.reduce((acc, r) => {
    acc[r.week] = acc[r.week] || []
    acc[r.week].push(r)
    return acc
  }, {})

  return (
    <div className={styles.wrapper}>
      <h3 className="text-lg font-bold mb-2">Local</h3>

      <div className="overflow-x-auto overflow-y-auto max-h-[600px] mb-5">
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th rowSpan={rows.length ? 2 : 1} className={`${styles.headerCell}`}>Week</th>
              <th rowSpan={rows.length ? 2 : 1} className={`${styles.headerCell} w-[120px]`}>Date</th>
              <th rowSpan={rows.length ? 2 : 1} className={styles.headerCell}>Day</th>
              {categories.map(c => (
                <th key={c} colSpan={3} className={styles.headerCell}>{c}</th>
              ))}
            </tr>
            {rows.length > 0 && (
              <tr className={styles.subHeaderRow}>
                {categories.map(c => (
                  <Fragment key={c}>
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

            {Object.entries(grouped).map(([week, list]) =>
              list.map((r, idx) => (
                <tr key={r.date} className={idx % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                  {idx === 0 && (
                    <td
                      rowSpan={list.length}
                      className={`${styles.tdCell} ${styles.stickyCell}`}
                    >
                      {week}
                    </td>
                  )}
                  <td className={styles.tdCell}>{r.date}</td>
                  <td className={styles.tdCell}>{r.day}</td>

                  {categories.map(cat => {
                    const { sale, spent, pct } = r.categories[cat] || {}
                    const num = pct ? parseFloat(pct.replace("%", "")) : null
                    return (
                      <Fragment key={cat}>
                        <td className={`${styles.tdCell} ${styles.tdRight}`}>{sale}</td>
                        <td className={`${styles.tdCell} ${styles.tdRight}`}>{spent}</td>
                        <td
                          className={`${styles.tdCell} ${styles.tdCenter} ${num != null ? getGrowthColor(num) : ""}`}
                        >
                          {pct ?? "-"}
                        </td>
                      </Fragment>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CategoryDayWiseLocalSpent
