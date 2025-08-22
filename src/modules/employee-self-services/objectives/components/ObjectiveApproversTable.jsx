
import { Users } from "lucide-react";
import React from "react";

const ObjectiveApproversTable = ({ approvers = [] }) => {
    const getOrdinal = (n) => {
        const j = n % 10, k = n % 100;
        if (k >= 11 && k <= 13) return `${n}th`;
        switch (j) {
            case 1: return `${n}st`;
            case 2: return `${n}nd`;
            case 3: return `${n}rd`;
            default: return `${n}th`;
        }
    };

    const sortedApprovers = [...approvers].sort((a, b) => b.level - a.level);
    const maxLevel = Math.max(...sortedApprovers.map(a => a.level));
    const getDisplayLevel = (level) => {
        return level === maxLevel ? "Last" : getOrdinal(level);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden dark:text-gray-200 dark:bg-bodybg">
            <div className="dark:text-gray-200 dark:bg-bodybg border-b border-slate-200 px-6 py-4">
                <div className="flex items-center space-x-3 ">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                        style={{
                            background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
                        }}
                    >
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-gray-200">
                            Approval Hierarchy
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-gray-200">
                            Stakeholders & Approvers
                        </p>
                    </div>
                </div>
            </div>

            <div className="accordion-body p-6 dark:text-gray-200 dark:bg-bodybg border border-slate-300">
                <div className="table-responsive task-table overflow-hidden transition-all duration-300 min-h-[100px]">
                    <table className="table whitespace-nowrap table-bordered min-w-full border border-slate-300">
                        <thead style={{ fontWeight: "bold" }}>
                        <tr className="border-b border-defaultborder bg-slate-100">
                            <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700  dark:text-gray-200 dark:bg-bodybg border border-slate-300">Level</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700 dark:text-gray-200 dark:bg-bodybg border border-slate-300">Approver</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-slate-700 dark:text-gray-200 dark:bg-bodybg border border-slate-300">Designation</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortedApprovers.map((item) => (
                            <tr key={item.approver.id} className="border-b border border-slate-300">
                                <td style={{ fontWeight: "bold" }} className="px-4 py-3 text-sm text-slate-600 dark:text-gray-200 border border-slate-300">
                                    {getDisplayLevel(item.level)}
                                </td>
                                <td className="px-4 py-3 dark:text-gray-200 border border-slate-300" >
                                    <div className="flex items-center space-x-3 dark:text-gray-200 ">
                                        {item.approver.avatar?.small_url ? (
                                            <img
                                                src={item.approver.avatar.small_url}
                                                alt={item.approver.full_name}
                                                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm "
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                                {item.approver.full_name
                                                    ?.split(" ")
                                                    .map((n) => n[0])
                                                    .join("")
                                                    .toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex flex-col ">
                        <span className="font-semibold text-slate-900 text-left dark:text-gray-200 ">
                          {item.approver.full_name}
                        </span>
                                            <span className="text-xs text-slate-500 dark:text-gray-200 ">
                          {item.approver.email}
                        </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-indigo-600 dark:text-gray-200 border border-slate-300">
                                    {item.approver.designation}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ObjectiveApproversTable;

