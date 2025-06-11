import React from "react";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import * as styles from "@helpers/staticDataTableStyles.js";


const ObjectiveWiseSpentSummary = ({ filters, data = {}, loading }) => {
  const formattedDate = filters?.till_date
    ? new Date(filters.till_date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const calcTotals = (entries) =>
    entries.reduce(
      (acc, cur) => {
        acc.ld_googleads += Number(cur.ld_googleads);
        acc.ld_metaads += Number(cur.ld_metaads);
        acc.ld_total += Number(cur.ld_total);
        acc.mtd_googleads += Number(cur.mtd_googleads);
        acc.mtd_metaads += Number(cur.mtd_metaads);
        acc.mtd_total += Number(cur.mtd_total);
        return acc;
      },
      {
        ld_googleads: 0,
        ld_metaads: 0,
        ld_total: 0,
        mtd_googleads: 0,
        mtd_metaads: 0,
        mtd_total: 0,
      }
    );

  const regions = Object.keys(data);

  const grandTotals = regions.reduce(
    (acc, regionKey) => {
      const totals = calcTotals(data[regionKey]);
      acc.ld_googleads += totals.ld_googleads;
      acc.ld_metaads += totals.ld_metaads;
      acc.ld_total += totals.ld_total;
      acc.mtd_googleads += totals.mtd_googleads;
      acc.mtd_metaads += totals.mtd_metaads;
      acc.mtd_total += totals.mtd_total;
      return acc;
    },
    {
      ld_googleads: 0,
      ld_metaads: 0,
      ld_total: 0,
      mtd_googleads: 0,
      mtd_metaads: 0,
      mtd_total: 0,
    }
  );

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
                <th rowSpan="2" className={styles.headerCell}>
                  Origin
                </th>
                <th colSpan="3" className={styles.headerCell}>
                  Last Day
                </th>
                <th colSpan="3" className={styles.headerCell}>
                  MTD
                </th>
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
                  <td colSpan={7} className={styles.tdCenter}>
                    No data available.
                  </td>
                </tr>
              )}
              {regions.map((regionKey) => {
                const entries = data[regionKey];
                const totals = calcTotals(entries);
                return (
                  <React.Fragment key={regionKey}>
                    <tr className={styles.rowSpecial}>
                      <td className={`${styles.tdCell} ${styles.stickyCell}`}>
                        {regionKey.charAt(0).toUpperCase() +
                          regionKey.slice(1)}
                      </td>
                      <td className={`${styles.tdCell} ${styles.tdRight}`}>
                        {totals.ld_googleads.toLocaleString()}
                      </td>
                      <td className={`${styles.tdCell} ${styles.tdRight}`}>
                        {totals.ld_metaads.toLocaleString()}
                      </td>
                      <td className={`${styles.tdCell} ${styles.tdRight}`}>
                        {totals.ld_total.toLocaleString()}
                      </td>
                      <td className={`${styles.tdCell} ${styles.tdRight}`}>
                        {totals.mtd_googleads.toLocaleString()}
                      </td>
                      <td className={`${styles.tdCell} ${styles.tdRight}`}>
                        {totals.mtd_metaads.toLocaleString()}
                      </td>
                      <td className={`${styles.rowTotal} ${styles.tdCenter} w-36 p-2`}>
                        {totals.mtd_total.toLocaleString()}
                      </td>
                    </tr>
                    {entries.map((entry, idx) => {
                      const bgClass =
                        idx % 2 === 0 ? styles.rowEven : styles.rowOdd;
                      return (
                        <tr key={idx} className={bgClass}>
                          <td
                            className={`${styles.tdCell} ${styles.stickyCell} ${bgClass}`}
                          >
                            {entry.origin}
                          </td>
                          <td
                            className={`${styles.tdCell} ${styles.tdRight} ${bgClass}`}
                          >
                            {Number(entry.ld_googleads).toLocaleString()}
                          </td>
                          <td
                            className={`${styles.tdCell} ${styles.tdRight} ${bgClass}`}
                          >
                            {Number(entry.ld_metaads).toLocaleString()}
                          </td>
                          <td
                            className={`${styles.tdCell} ${styles.tdRight} ${bgClass}`}
                          >
                            {Number(entry.ld_total).toLocaleString()}
                          </td>
                          <td
                            className={`${styles.tdCell} ${styles.tdRight} ${bgClass}`}
                          >
                            {Number(entry.mtd_googleads).toLocaleString()}
                          </td>
                          <td
                            className={`${styles.tdCell} ${styles.tdRight} ${bgClass}`}
                          >
                            {Number(entry.mtd_metaads).toLocaleString()}
                          </td>
                          <td
                            className={`${styles.rowTotal} ${styles.tdCenter} ${bgClass} w-36 p-2`}
                          >
                            {Number(entry.mtd_total).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}
              {regions.length > 0 && (
                <tr className={styles.rowTotal}>
                  <td className={`${styles.tdCell} ${styles.stickyCell}`}>
                    Total
                  </td>
                  <td className={`${styles.tdCell} ${styles.tdRight}`}>
                    {grandTotals.ld_googleads.toLocaleString()}
                  </td>
                  <td className={`${styles.tdCell} ${styles.tdRight}`}>
                    {grandTotals.ld_metaads.toLocaleString()}
                  </td>
                  <td className={`${styles.tdCell} ${styles.tdRight}`}>
                    {grandTotals.ld_total.toLocaleString()}
                  </td>
                  <td className={`${styles.tdCell} ${styles.tdRight}`}>
                    {grandTotals.mtd_googleads.toLocaleString()}
                  </td>
                  <td className={`${styles.tdCell} ${styles.tdRight}`}>
                    {grandTotals.mtd_metaads.toLocaleString()}
                  </td>
                  <td className={`${styles.tdCell} ${styles.tdCenter}`}>
                    {grandTotals.mtd_total.toLocaleString()}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default ObjectiveWiseSpentSummary;
