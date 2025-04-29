import React from "react";
import * as styles from "@helpers/staticDataTableStyles.js";
const StaticDataTable = ({ data }) => (
    <div className={styles.wrapper}>
        <table className={styles.table}>
            <thead className={styles.thead}>
            <tr>
                <th
                    rowSpan={2}
                    className={`${styles.headerCell} ${styles.stickyHeader}`}
                    style={{ minWidth: '100px' }}
                >STORE NAME</th>
                <th colSpan={3} className={styles.headerCell}>CURRENT YEAR FY2025</th>
                <th rowSpan={2} className={styles.headerCell}>FP % OF TOTAL</th>
                <th rowSpan={2} className={styles.headerCell}>GP %</th>
                <th colSpan={3} className={styles.headerCell}>GROSS PROFIT RS</th>
                <th colSpan={2} className={styles.headerCell}>FP GROWTH FROM LY</th>
                <th colSpan={2} className={styles.headerCell}>TOTAL GROWTH FROM LY</th>
                <th colSpan={4} className={styles.headerCell}>TRAFFIC GROWTH</th>
            </tr>
            <tr className={styles.subHeaderRow}>
                {['FULL PRICE','DISCOUNTED','TOTAL','CY','LY','GROWTH','QTY','VALUE','QTY','VALUE','FOOTFALL CY','CONV %','FF GROWTH','CONV % GROWTH']
                    .map(label => <th key={label} className={styles.headerCell}>{label}</th>)}
            </tr>
            </thead>
            <tbody>
            {data.map((row, i) => {
                const isLFL = row.store_name.includes("LFL");
                const bgClass = isLFL ? styles.rowLFL : (i % 2 === 0 ? styles.rowEven : styles.rowOdd);
                return (
                    <tr key={i} className={bgClass}>
                        <td
                            className={`${styles.tdCell} ${styles.stickyCell} ${bgClass}`}
                            style={{ minWidth: '100px' }}
                        >
                            {row.store_name}
                        </td>
                        <td className={`${styles.tdCell} ${styles.tdRight} ${bgClass}`}>{row.cy_fp_sales}</td>
                        <td className={`${styles.tdCell} ${styles.tdRight} ${bgClass}`}>{row.cy_disc_sales}</td>
                        <td className={`${styles.tdCell} ${styles.tdRight} ${bgClass}`}>{row.cy_total_sales}</td>
                        <td className={`${styles.tdCell} ${styles.tdCenter} ${bgClass}`}>{row.fp_percent_of_total}%</td>
                        <td className={`${styles.tdCell} ${styles.tdCenter} ${bgClass}`}>{row.gp_percent}%</td>
                        <td className={`${styles.tdCell} ${styles.tdRight} ${bgClass}`}>{row.gp_cy}</td>
                        <td className={`${styles.tdCell} ${styles.tdRight} ${bgClass}`}>{row.gp_ly}</td>
                        <td className={`${styles.tdCell} ${styles.tdCenter} ${bgClass}`}>{row.gp_percent_growth}%</td>
                        <td className={`${styles.tdCell} ${styles.tdCenter} ${bgClass}`}>{row.fp_ly_percent_qty}%</td>
                        <td className={`${styles.tdCell} ${styles.tdCenter} ${bgClass}`}>{row.fp_ly_percent_value}%</td>
                        <td className={`${styles.tdCell} ${styles.tdCenter} ${bgClass}`}>{row.total_percent_growth_ly_qty}%</td>
                        <td className={`${styles.tdCell} ${styles.tdCenter} ${bgClass}`}>{row.total_percent_growth_ly_value}%</td>
                        <td className={`${styles.tdCell} ${styles.tdRight} ${bgClass}`}>{row.tg_ff_cy}</td>
                        <td className={`${styles.tdCell} ${styles.tdCenter} ${bgClass}`}>{row.tg_ff_conv}%</td>
                        <td className={`${styles.tdCell} ${styles.tdCenter} ${bgClass}`}>{row.tg_ff_growth}</td>
                        <td className={`${styles.tdCell} ${styles.tdCenter} ${bgClass}`}>{row.tg_ff_conv_growth}%</td>
                    </tr>
                );
            })}
            </tbody>
        </table>
    </div>
);

export default StaticDataTable;