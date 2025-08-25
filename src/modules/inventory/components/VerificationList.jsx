import React from "react";
import { formatDate } from "@helpers/dateTime.js";

const VerificationList = ({ verifications = [] }) => (
    <div className="box">
        <div className="box-header">
            <h3 className="box-title">Verification History</h3>
        </div>
        <div className="box-body overflow-auto max-h-64">
            {verifications.length ? (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                    <tr>
                        {["Date & Time", "Verified By", "Email"].map((h) => (
                            <th
                                key={h}
                                className="px-3 py-2 text-left text-xs font-semibold"
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="divide-y">
                    {verifications.map((v) => (
                        <tr key={v.id}>
                            <td className="px-3 py-2">
                                {formatDate(v.verified_on)}
                            </td>
                            <td className="px-3 py-2">
                                {v.verified_by?.full_name || "N/A"}
                            </td>
                            <td className="px-3 py-2">
                                {v.verified_by?.email || "N/A"}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p className="p-4 text-center text-sm text-gray-500">
                    No verifications recorded.
                </p>
            )}
        </div>
    </div>
);

export default VerificationList;
