import { Users } from "lucide-react";
import React from "react";

const ObjectiveApprovers = ({ approvers = [] }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 via-slate-50 to-white border-b border-slate-200 px-6 py-4">
                <div className="flex items-center space-x-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                        style={{
                            background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)"
                        }}
                    >
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Approval Hierarchy</h2>
                        <p className="text-sm text-slate-600">Stakeholders & Approvers</p>
                    </div>
                </div>
            </div>

            <div className="p-12">
                <div className="flex flex-col items-center">
                    {approvers?.map((item, index) => (
                            <React.Fragment key={item.approver.id}>
                                <div
                                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer min-w-[280px]"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            {item.approver.avatar?.small_url ? (
                                                <img
                                                    src={item.approver.avatar.small_url}
                                                    alt={item.approver.full_name}
                                                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-lg"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                    {item.approver.full_name
                                                        ?.split(" ")
                                                        .map((n) => n[0])
                                                        .join("")
                                                        .toUpperCase()}
                                                </div>
                                            )}
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-900 text-lg">
                                                {item.approver.full_name}
                                            </h4>
                                            <p className="text-sm font-semibold text-indigo-600">
                                                {item.approver.designation}
                                            </p>
                                            <p className="text-xs text-slate-500">{item.approver.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {index < approvers.length - 1 && (
                                    <div className="w-0.5 h-16 bg-gray-400 relative z-0"></div>
                                )}
                            </React.Fragment>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default ObjectiveApprovers;