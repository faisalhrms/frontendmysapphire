import React from "react"
import LoadingSpinner from "@components/LoadingSpinner.jsx"
import * as styles from "@helpers/staticDataTableStyles.js"

const CategoryOrdersCount = ({ filters, data = {}, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  const regions = ["Local", "International", "UK"].filter(
    r => (data[r] || []).length > 0
  )
  const rows = data.Local || []
  const fmt = v => (v === 0 || v === "-" || v == null ? "-" : v.toLocaleString())
  const asOf = filters.till_date
    ? new Date(filters.till_date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : "N/A"

  return (
    <>
      <p className="text-primary p-2 text-right">As of {asOf}</p>
      <div className={styles.wrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.headerCell}>Origin</th>
              {regions.map(region => (
                <th key={region} colSpan={3} className={styles.headerCell}>
                  {region}
                </th>
              ))}
            </tr>
            <tr className={styles.subHeaderRow}>
              <th className={styles.headerCell}>Category</th>
              {regions.map(region => (
                <React.Fragment key={region}>
                  <th className={styles.headerCell}>Last Day</th>
                  <th className={styles.headerCell}>Week</th>
                  <th className={styles.headerCell}>MTD</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={regions.length ? regions.length * 3 + 1 : 1} className={styles.tdCenter}>
                  No data available.
                </td>
              </tr>
            )}
            {rows.map((r, i) => {
              const isTotal = r.category === "Total"
              const rowClass = isTotal
                ? styles.rowTotal
                : i % 2 === 0
                ? styles.rowEven
                : styles.rowOdd
              return (
                <tr key={r.category} className={rowClass}>
                  <td className={styles.tdCell}>{r.category}</td>
                  {regions.map((region, j) =>
                    j === 0 ? (
                      <React.Fragment key={region}>
                        <td className={`${styles.tdCell} ${styles.tdRight}`}>{fmt(r.last_day)}</td>
                        <td className={`${styles.tdCell} ${styles.tdRight}`}>{fmt(r.week)}</td>
                        <td className={`${styles.tdCell} ${styles.tdRight}`}>{fmt(r.mtd)}</td>
                      </React.Fragment>
                    ) : (
                      <React.Fragment key={region}>
                        <td className={`${styles.tdCell} ${styles.tdRight}`}>-</td>
                        <td className={`${styles.tdCell} ${styles.tdRight}`}>-</td>
                        <td className={`${styles.tdCell} ${styles.tdRight}`}>-</td>
                      </React.Fragment>
                    )
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default CategoryOrdersCount
