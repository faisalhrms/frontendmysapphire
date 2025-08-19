import React from 'react';
import { Clock, Send, CheckCircle2, XCircle, Edit3, FileText } from 'lucide-react';

const ActionTimelineTable = ({ actions }) => {
    const getActionConfig = (action) => {
        switch (action.toLowerCase()) {
            case 'submitted':
                return {
                    icon: Send,
                    color: 'text-info ',
                    bg: 'bg-info/10',
                    label: 'Submitted'
                };
            case 'approved':
                return {
                    icon: CheckCircle2,
                    color: 'text-success',
                    bg: 'bg-success/10',
                    label: 'Approved'
                };
            case 'rejected':
                return {
                    icon: XCircle,
                    color: 'text-danger',
                    bg: 'bg-danger/10',
                    label: 'Rejected'
                };
            case 'edited':
                return {
                    icon: Edit3,
                    color: 'text-amber-600',
                    bg: 'bg-amber-50',
                    label: 'Edited'
                };
            default:
                return {
                    icon: FileText,
                    color: 'text-slate-600',
                    bg: 'bg-slate-50',
                    label: action
                };
        }
    };


    const formatDetailedDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const sortedActions = [...actions].reverse();

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden dark:text-gray-200 dark:bg-bodybg">
            {/* Header */}
            <div
                className="dark:text-gray-200 dark:bg-bodybg border-b border-slate-200 px-6 py-4 flex items-center space-x-3">
                <div
                    className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Clock className="w-5 h-5"/>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-gray-200 dark:bg-bodybg">Action Timeline</h2>
                    <p className="text-sm text-slate-600 dark:text-gray-200 dark:bg-bodybg">Complete history of objective actions</p>
                </div>
            </div>
            <div className="accordion-body dark:text-gray-200 dark:bg-bodybg">
                <div className="table-responsive task-table overflow-hidden transition-all duration-300 min-h-[100px]">
                    <table className="table whitespace-nowrap table-bordered min-w-full">
                        <thead className="bg-slate-100 text-slate-700 dark:text-gray-200 dark:bg-bodybg">
                        <tr className="border-b border-defaultborder">
                            <th style={{fontWeight: "bold"}}
                                className="px-4 py-2 text-left text-sm font-semibold text-slate-700 border-b dark:text-gray-200 dark:bg-bodybg" >Action
                            </th>
                            <th style={{fontWeight: "bold"}}
                                className="px-4 py-2 text-left text-sm font-semibold text-slate-700 border-b dark:text-gray-200 dark:bg-bodybg">Person
                            </th>
                            <th style={{fontWeight: "bold"}}
                                className="px-4 py-2 text-left text-sm font-semibold text-slate-700 border-b dark:text-gray-200 dark:bg-bodybg">Remarks
                            </th>
                            <th style={{fontWeight: "bold"}}
                                className="px-4 py-2 text-left text-sm font-semibold text-slate-700 border-b dark:text-gray-200 dark:bg-bodybg">Date
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortedActions.map((action, index) => {
                            const config = getActionConfig(action.action);
                            const ActionIcon = config.icon;

                            return (
                                <tr key={index} className="border-b">
                                    <td className={`text-center px-3 py-2 border border-slate-300 ${config.bg}`}>
                                        <div className={`flex items-center justify-center gap-2 ${config.color}`}>
                                            <config.icon className="w-4 h-4"/>
                                            <span className="text-center">{config.label}</span>
                                        </div>
                                    </td>


                                    <td className="px-4 py-3 text-sm">
                                        <div className="flex items-center space-x-2">
                                            {action.user.avatar ? (
                                                <img
                                                    src={action.user.avatar.small_url}
                                                    alt={action.user.full_name}
                                                    className="w-6 h-6 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div
                                                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs dark:text-gray-200 dark:bg-bodybg "
                                                    style={{background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'}}
                                                >
                                                    {action.user.full_name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-slate-900 text-xs text-left dark:text-gray-200 dark:bg-bodybg">{action.user.full_name}</p>
                                                <p className="text-xs text-slate-500 dark:text-gray-200 dark:bg-bodybg">{action.user.email}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td style={{textAlign: "left"}}
                                        className="px-4 py-3 text-sm text-slate-700 text-left dark:text-gray-200 dark:bg-bodybg">{action.remarks || '-'}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-gray-200 dark:bg-bodybg">{formatDetailedDate(action.created_at)}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div
                className="mt-4 bg-gray-100 dark:text-gray-200 dark:bg-bodybg rounded-2xl p-4 border ">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-slate-300 rounded-xl flex items-center justify-center">
                            <Clock className="w-4 h-4 text-slate-600 "/>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900 text-sm dark:text-gray-200 dark:bg-bodybg">Timeline Summary</p>
                            <p className="text-xs text-slate-600 dark:text-gray-200 dark:bg-bodybg">Total workflow actions recorded</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-bold text-slate-900 dark:text-gray-200 dark:bg-bodybg">{actions.length}</div>
                        <div className="text-xs text-slate-500 dark:text-gray-200 dark:bg-bodybg">Actions</div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ActionTimelineTable;
