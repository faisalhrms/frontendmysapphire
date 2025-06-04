import React from "react"
import LoadingSpinner from "@components/LoadingSpinner.jsx"
import * as styles from "@helpers/staticDataTableStyles.js"

const CategoryWiseSpent = ({ filters, data = {}, loading }) => {
  const formattedDate = filters.till_date
    ? new Date(filters.till_date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A"

  const {
    Local = [],
    UK = [],
    International = [],
    region_totals = {},
    grand_totals = {}
  } = data

  const fmt = val =>
    val === 0 || val === "0" || val == null
      ? "-"
      : typeof val === "number"
      ? val.toLocaleString()
      : val

  const allRegions = ["Local", "UK", "International"]
  const regions = allRegions.filter(r => (data[r] || []).length > 0)

  return (
    <>
      <p className="text-primary p-2 rounded-lg text-right text-black">
        As of {formattedDate}
      </p>
      <div className={styles.wrapper}>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th rowSpan="2" className={styles.headerCell}>Origin</th>
                <th colSpan="3" className={styles.headerCell}>Last Day</th>
                <th colSpan="3" className={styles.headerCell}>MTD</th>
              </tr>
              <tr className={styles.subHeaderRow}>
                <th className={styles.headerCell}>GoogleAds</th>
                <th className={styles.headerCell}>MetaAds</th>
                <th className={styles.headerCell}>Total</th>
                <th className={styles.headerCell}>GoogleAds</th>
                <th className={styles.headerCell}>MetaAds</th>
                <th className={styles.headerCell}>Total</th>
              </tr>
            </thead>
            <tbody>
              {regions.length === 0 && (
                <tr>
                  <td colSpan={7} className={styles.tdCenter}>No data available.</td>
                </tr>
              )}
              {regions.map(regionKey => {
                const entries = data[regionKey] || []
                const totals = region_totals[regionKey] || {}
                return (
                  <React.Fragment key={regionKey}>
                    <tr className={styles.rowSpecial}>
                      <td className={`${styles.tdCell} ${styles.stickyCell}`}>{regionKey}</td>
                      <td className={`${styles.tdCell} ${styles.tdRight}`}>{fmt(totals.last_day_google)}</td>
                      <td className={`${styles.tdCell} ${styles.tdRight}`}>{fmt(totals.last_day_meta)}</td>
                      <td className={`${styles.rowTotal} ${styles.tdCenter} w-36 p-2`}>{fmt(totals.last_day_total)}</td>
                      <td className={`${styles.tdCell} ${styles.tdRight}`}>{fmt(totals.mtd_google)}</td>
                      <td className={`${styles.tdCell} ${styles.tdRight}`}>{fmt(totals.mtd_meta)}</td>
                      <td className={`${styles.rowTotal} ${styles.tdCenter} w-36 p-2`}>{fmt(totals.mtd_total)}</td>
                    </tr>
                    {entries.map((entry, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                        <td className={styles.tdCell}>{entry.brand_category}</td>
                        <td className={`${styles.tdCell} ${styles.tdRight}`}>{fmt(entry.last_day_google)}</td>
                        <td className={`${styles.tdCell} ${styles.tdRight}`}>{fmt(entry.last_day_meta)}</td>
                        <td className={`${styles.rowTotal} ${styles.tdCenter} w-36 p-2`}>{fmt(entry.last_day_total)}</td>
                        <td className={`${styles.tdCell} ${styles.tdRight}`}>{fmt(entry.mtd_google)}</td>
                        <td className={`${styles.tdCell} ${styles.tdRight}`}>{fmt(entry.mtd_meta)}</td>
                        <td className={`${styles.rowTotal} ${styles.tdCenter} w-36 p-2`}>{fmt(entry.mtd_total)}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                )
              })}
              {grand_totals && (
                <tr className={styles.rowTotal}>
                  <td className={`${styles.tdCell} ${styles.stickyCell}`}>Total</td>
                  <td className={`${styles.tdCell} ${styles.tdRight}`}>{fmt(grand_totals.last_day_google)}</td>
                  <td className={`${styles.tdCell} ${styles.tdRight}`}>{fmt(grand_totals.last_day_meta)}</td>
                  <td className={`${styles.tdCell} ${styles.tdCenter}`}>{fmt(grand_totals.last_day_total)}</td>
                  <td className={`${styles.tdCell} ${styles.tdRight}`}>{fmt(grand_totals.mtd_google)}</td>
                  <td className={`${styles.tdCell} ${styles.tdRight}`}>{fmt(grand_totals.mtd_meta)}</td>
                  <td className={`${styles.tdCell} ${styles.tdCenter}`}>{fmt(grand_totals.mtd_total)}</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

export default CategoryWiseSpent
