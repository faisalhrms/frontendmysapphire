import React from "react";
import * as styles from "@helpers/staticDataTableStyles.js";
const StaticDataTable = ({ data }) => {
    const renderPercent = (raw) => {
        // strip off any “%” already there, parse to number
        const num = parseFloat(String(raw).replace("%", "")) || 0;
        let color = "";
        if (num > 0) color = "text-emerald-600";
        else if (num < 0) color = "text-red";
        return (
            <span className={`font-bold ${color}`}>
        {num.toLocaleString()}%
      </span>
        );
    };
    return(
        <>
            <p className="text-primary p-2 rounded-lg text-right text-black">
                Rs in Millions
            </p>

            <div className={styles.wrapper}>

                <table className={styles.table}>
                    <thead className={styles.thead}>
                    <tr>
                        <th
                            rowSpan={2}
                            className={`${styles.headerCell} ${styles.stickyHeader}`}
                            style={{minWidth: '100px'}}
                        >Store Name
                        </th>
                        <th colSpan={3} className={styles.headerCell}>Current Year FY2025</th>
                        <th rowSpan={2} className={styles.headerCell}>FP % Of Total</th>
                        <th rowSpan={2} className={styles.headerCell}>GP %</th>
                        <th colSpan={3} className={styles.headerCell}>Gross Profit RS</th>
                        <th colSpan={2} className={styles.headerCell}>FP Growth From LY</th>
                        <th colSpan={2} className={styles.headerCell}>Total Growth From LY</th>
                        <th colSpan={4} className={styles.headerCell}>Traffic Growth</th>
                    </tr>
                    <tr className={styles.subHeaderRow}>
                        {[
                            "Full Price", "Discounted", "Total",
                            "CY", "LY", "Growth", "Qty", "Value",
                            "Qty", "Value", "FootFall CY", "Conv %",
                            "FF Growth", "Conv % Growth"
                        ].map(label => (
                            <th key={label} className={styles.headerCell}>
                                {label}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((row, i) => {
                        const name = row.store_name.toUpperCase();
                        const isTotal = name.includes("TOTAL");
                        const isSpecial = name.includes("LFL") || name.includes("NEW");

                        const bgClass = isTotal
                            ? styles.rowTotal
                            : isSpecial
                                ? styles.rowSpecial
                                : i % 2 === 0
                                    ? styles.rowEven
                                    : styles.rowOdd;

                        return (
                            <tr key={i} className={bgClass}>
                                {/* STORE NAME cell */}
                                <td className={`${styles.tdCell} ${styles.stickyCell} ${bgClass}`}
                                    style={{minWidth: "100px"}}>
                                    {row.store_name}
                                </td>

                                {/* Regular numeric cells */}
                                <td className={`${styles.tdCell} ${styles.tdRight} ${bgClass}`}>
                                    {row.cy_fp_sales}
                                </td>
                                <td className={`${styles.tdCell} ${styles.tdRight} ${bgClass}`}>
                                    {row.cy_disc_sales}
                                </td>
                                <td className={`${styles.tdCell} ${styles.tdRight} ${bgClass}`}>
                                    {row.cy_total_sales}
                                </td>

                                {/* PERCENT CELLS: use renderPercent */}
                                <td className={`${styles.tdCell} ${styles.tdCenter} ${bgClass}`}>
                                    {renderPercent(row.fp_percent_of_total)}
                                </td>
                                <td className={`${styles.tdCell} ${styles.tdCenter} ${bgClass}`}>
                                    {renderPercent(row.gp_percent)}
                                </td>

                                {/* GROSS PROFIT RS */}
                                <td className={`${styles.tdCell} ${styles.tdRight} ${bgClass}`}>
                                    {row.gp_cy}
                                </td>
                                <td className={`${styles.tdCell} ${styles.tdRight} ${bgClass}`}>
                                    {row.gp_ly}
                                </td>
                                <td className={`${styles.tdCell} ${styles.tdCenter} ${bgClass}`}>
                                    {renderPercent(row.gp_percent_growth)}
                                </td>

                                {/* FP GROWTH FROM LY */}
                                <td className={`${styles.tdCell} ${styles.tdCenter} ${bgClass}`}>
                                    {renderPercent(row.fp_ly_percent_qty)}
                                </td>
                                <td className={`${styles.tdCell} ${styles.tdCenter} ${bgClass}`}>
                                    {renderPercent(row.fp_ly_percent_value)}
                                </td>

                                {/* TOTAL GROWTH FROM LY */}
                                <td className={`${styles.tdCell} ${styles.tdCenter} ${bgClass}`}>
                                    {renderPercent(row.total_percent_growth_ly_qty)}
                                </td>
                                <td className={`${styles.tdCell} ${styles.tdCenter} ${bgClass}`}>
                                    {renderPercent(row.total_percent_growth_ly_value)}
                                </td>

                                {/* TRAFFIC GROWTH */}
                                <td className={`${styles.tdCell} ${styles.tdRight} ${bgClass}`}>
                                    {row.tg_ff_cy}
                                </td>
                                <td className={`${styles.tdCell} ${styles.tdCenter} ${bgClass}`}>
                                    {renderPercent(row.tg_ff_conv)}
                                </td>
                                <td className={`${styles.tdCell} ${styles.tdCenter} ${bgClass}`}>
                                    {renderPercent(row.tg_ff_growth)}
                                </td>
                                <td className={`${styles.tdCell} ${styles.tdCenter} ${bgClass}`}>
                                    {renderPercent(row.tg_ff_conv_growth)}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </>

    );
};

export default StaticDataTable;