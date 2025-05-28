import React from "react"
import LoadingSpinner from "@components/LoadingSpinner.jsx"
import * as styles from "@helpers/staticDataTableStyles.js"

const getGrowthColor = growth =>
  growth > 7 ? "text-red" : "text-emerald-600"

const DigitalSpentCCSale = ({ data = {}, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }
  const rawRegions = Object.keys(data).filter(r => data[r]?.length)
  const regions = rawRegions.filter(r => r !== "Total").concat(
    rawRegions.filter(r => r === "Total")
  )
  const order = ["Regular", "Discount"]
  return (
    <div className={styles.wrapper}>
      <table className={`${styles.table} table-fixed`}>
        <thead className={styles.thead}>
          <tr>
            <th rowSpan={2} className={styles.headerCell}>Origin</th>
            <th rowSpan={2} className={styles.headerCell}>Sale Type</th>
            <th rowSpan={2} className={styles.headerCell}>Category</th>
            <th colSpan={3} className={styles.headerCell}>Last Day</th>
            <th colSpan={3} className={styles.headerCell}>MTD</th>
            <th colSpan={3} className={styles.headerCell}>YTD</th>
          </tr>
          <tr className={styles.subHeaderRow}>
            <th className={styles.headerCell}>Sale Value</th>
            <th className={styles.headerCell}>Platform Spent</th>
            <th className={styles.headerCell}>Spend % of Sales</th>
            <th className={styles.headerCell}>Sale Value</th>
            <th className={styles.headerCell}>Platform Spent</th>
            <th className={styles.headerCell}>Spend % of Sales</th>
            <th className={styles.headerCell}>Sale Value</th>
            <th className={styles.headerCell}>Platform Spent</th>
            <th className={styles.headerCell}>Spend % of Sales</th>
          </tr>
        </thead>
        <tbody>
          {regions.length === 0 && (
            <tr>
              <td colSpan={12} className={styles.tdCenter}>No data available.</td>
            </tr>
          )}
          {regions.map(region => {
            const rows = data[region]
            const types = Array.from(new Set(rows.map(r => r.sale_type)))
            const sorted = [
              ...order.filter(t => types.includes(t)),
              ...types.filter(t => !order.includes(t))
            ]
            const totalRows = rows.length
            return sorted.flatMap((type, ti) => {
              const group = rows.filter(r => r.sale_type === type)
              return group.map((row, idx) => {
                const isBottom = region === "Total"
                const isSubtotal = row.category === "Total" || row.sale_type === "Discount"
                const rowClass = isBottom
                  ? styles.rowTotal
                  : isSubtotal
                  ? styles.rowSpecial
                  : idx % 2 === 0
                  ? styles.rowEven
                  : styles.rowOdd
                const ldVal = parseFloat(row.ld_ss ?? 0)
                const mtdVal = parseFloat(row.mtd_ss ?? 0)
                const ytdVal = parseFloat(row.ytd_ss ?? 0)
                return (
                  <tr key={`${region}-${type}-${idx}`} className={rowClass}>
                    {ti === 0 && idx === 0 && (
                      <td rowSpan={totalRows} className={`${styles.tdCell} ${styles.stickyCell} ${styles.tdCenter}`}>
                        {region}
                      </td>
                    )}
                    {idx === 0 && (
                      <td rowSpan={group.length} className={`${styles.tdCell} ${styles.tdCenter}`}>
                        {row.sale_type}
                      </td>
                    )}
                    <td className={styles.tdCell}>{row.category}</td>
                    <td className={`${styles.tdCell} ${styles.tdRight}`}>{row.ld_sale_value || "-"}</td>
                    <td className={`${styles.tdCell} ${styles.tdRight}`}>{row.ld_spent || "-"}</td>
                    <td className={`${styles.tdCell} ${styles.tdCenter} ${getGrowthColor(ldVal)}`}>{row.ld_ss || "-"}</td>
                    <td className={`${styles.tdCell} ${styles.tdRight}`}>{row.mtd_sale_value || "-"}</td>
                    <td className={`${styles.tdCell} ${styles.tdRight}`}>{row.mtd_spent || "-"}</td>
                    <td className={`${styles.tdCell} ${styles.tdCenter} ${getGrowthColor(mtdVal)}`}>{row.mtd_ss || "-"}</td>
                    <td className={`${styles.tdCell} ${styles.tdRight}`}>{row.ytd_sale_value || "-"}</td>
                    <td className={`${styles.tdCell} ${styles.tdRight}`}>{row.ytd_spent || "-"}</td>
                    <td className={`${styles.tdCell} ${styles.tdCenter} ${getGrowthColor(ytdVal)}`}>{row.ytd_ss || "-"}</td>
                  </tr>
                )
              })
            })
          })}
        </tbody>
      </table>
    </div>
  )
}

export default DigitalSpentCCSale
