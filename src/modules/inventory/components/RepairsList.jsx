import React from "react";
import { formatDate } from "@helpers/dateTime.js";
import { toTitleCase, formatAmountWithCommas } from "@helpers/formatters.js";
import { getBadgeClasses } from "@helpers/badges.js";

const RepairsList = ({ repairs = [] }) => (
    <div className="box">
        <div className="box-header">
            <h3 className="box-title">Repair History</h3>
        </div>
        <div className="box-body overflow-auto max-h-64">
            {repairs.length ? (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                    <tr>
                        {[
                            "Date",
                            "Description",
                            "Cost",
                            "PO/PR No.",
                            "Vendor",
                            "TAT (days)",
                            "Status",
                            "Created By",
                        ].map((h) => (
                            <th key={h} className="px-3 py-2 text-left text-xs font-semibold">
                                {h}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="divide-y">
                    {repairs.map((r) => (
                        <tr key={r.id}>
                            <td className="px-3 py-2">{formatDate(r.repair_date)}</td>
                            <td className="px-3 py-2">{r.issue_description}</td>
                            <td className="px-3 py-2">{formatAmountWithCommas(r.repair_cost)}</td>
                            <td className="px-3 py-2">{r.pr_po_number || "-"}</td>
                            <td className="px-3 py-2">{r.vendor_details || "-"}</td>
                            <td className="px-3 py-2">{r.turnaround_time}</td>
                            <td className="px-3 py-2">
                  <span className={getBadgeClasses(r.status)}>
                    {toTitleCase(r.status.replace("_", " "))}
                  </span>
                            </td>
                            <td className="px-3 py-2">{r.created_by.full_name}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p className="p-4 text-center text-sm text-gray-500">No repairs recorded.</p>
            )}
        </div>
    </div>
);

export default RepairsList;
