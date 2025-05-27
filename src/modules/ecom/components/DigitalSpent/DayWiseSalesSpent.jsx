import React from "react"
import LoadingSpinner from "@components/LoadingSpinner.jsx"
import * as styles from "@helpers/staticDataTableStyles.js"

const getGrowthColor = g => (g < 0 ? "text-red" : "text-emerald-600")

const DayWiseSalesSpent = ({ data = {}, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  const regions = Object.keys(data)

  return (
    <div className="flex gap-6 overflow-auto mb-5">
      {regions.map(regionKey => {
        const rows = data[regionKey] || []
        const containerClass = regions.length === 1 ? "w-full" : "min-w-[300px]"
        return (
          <div key={regionKey} className={containerClass}>
            <h4 className="text-lg font-bold mb-2">{regionKey}</h4>
            <div className="relative overflow-auto max-h-[600px]">
              <table className={`${styles.table} table-fixed w-full`}>
                <thead className={styles.thead}>
                  <tr>
                    <th rowSpan="2" className={styles.headerCell}>Date</th>
                    <th colSpan="3" className={styles.headerCell}>Discount</th>
                    <th colSpan="3" className={styles.headerCell}>Regular</th>
                  </tr>
                  <tr className={styles.subHeaderRow}>
                    <th className={styles.headerCell}>Sale</th>
                    <th className={styles.headerCell}>Spent</th>
                    <th className={styles.headerCell}>%</th>
                    <th className={styles.headerCell}>Sale</th>
                    <th className={styles.headerCell}>Spent</th>
                    <th className={styles.headerCell}>%</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.filter(r => r.date !== "Total").map((row, idx) => {
                    const rowClass = idx % 2 === 0 ? styles.rowEven : styles.rowOdd
                    const discountNum = parseFloat(row.discount_pct.replace("%", ""))
                    const regularNum = parseFloat(row.regular_pct.replace("%", ""))
                    return (
                      <tr key={idx} className={rowClass}>
                        <td className={styles.tdCell}>{row.date}</td>
                        <td className={`${styles.tdCell} ${styles.tdRight}`}>{row.discount_sale}</td>
                        <td className={`${styles.tdCell} ${styles.tdRight}`}>{row.discount_spent}</td>
                        <td className={`${styles.tdCell} ${styles.tdCenter} ${!isNaN(discountNum) ? getGrowthColor(discountNum) : ""}`}>
                          {row.discount_pct}
                        </td>
                        <td className={`${styles.tdCell} ${styles.tdRight}`}>{row.regular_sale}</td>
                        <td className={`${styles.tdCell} ${styles.tdRight}`}>{row.regular_spent}</td>
                        <td className={`${styles.tdCell} ${styles.tdCenter} ${!isNaN(regularNum) ? getGrowthColor(regularNum) : ""}`}>
                          {row.regular_pct}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot className="sticky bottom-0">
                  {rows.filter(r => r.date === "Total").map((row, idx) => {
                    const discountNum = parseFloat(row.discount_pct.replace("%", ""))
                    const regularNum = parseFloat(row.regular_pct.replace("%", ""))
                    return (
                      <tr key={idx} className={styles.rowTotal}>
                        <td className={styles.tdCell}>{row.date}</td>
                        <td className={`${styles.tdCell} ${styles.tdRight}`}>{row.discount_sale}</td>
                        <td className={`${styles.tdCell} ${styles.tdRight}`}>{row.discount_spent}</td>
                        <td className={`${styles.tdCell} ${styles.tdCenter} ${!isNaN(discountNum) ? getGrowthColor(discountNum) : ""}`}>
                          {row.discount_pct}
                        </td>
                        <td className={`${styles.tdCell} ${styles.tdRight}`}>{row.regular_sale}</td>
                        <td className={`${styles.tdCell} ${styles.tdRight}`}>{row.regular_spent}</td>
                        <td className={`${styles.tdCell} ${styles.tdCenter} ${!isNaN(regularNum) ? getGrowthColor(regularNum) : ""}`}>
                          {row.regular_pct}
                        </td>
                      </tr>
                    )
                  })}
                </tfoot>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DayWiseSalesSpent
