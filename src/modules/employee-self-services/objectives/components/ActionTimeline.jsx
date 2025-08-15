import React from 'react';
import { Clock, Send, CheckCircle2, XCircle, Edit3, FileText } from 'lucide-react';

const ActionTimeline = ({ actions }) => {
    const getActionConfig = (action) => {
        switch (action.toLowerCase()) {
            case 'submitted':
                return {
                    icon: Send,
                    color: 'bg-info',
                    bgColor: 'bg-info/10',
                    textColor: 'text-info',
                    label: 'Submitted'
                };
            case 'approved':
                return {
                    icon: CheckCircle2,
                    color: 'bg-success',
                    bgColor: 'bg-success/10',
                    textColor: 'text-success',
                    label: 'Approved'
                };
            case 'rejected':
                return {
                    icon: XCircle,
                    color: 'bg-danger',
                    bgColor: 'bg-danger/10',
                    textColor: 'text-danger',
                    label: 'Rejected'
                };
            case 'edited':
                return {
                    icon: Edit3,
                    color: 'bg-amber-500',
                    bgColor: 'bg-amber-50',
                    textColor: 'text-amber-700',
                    label: 'Edited'
                };
            default:
                return {
                    icon: FileText,
                    color: 'bg-slate-500',
                    bgColor: 'bg-slate-50',
                    textColor: 'text-slate-700',
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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-50 via-slate-50 to-white border-b border-slate-200 px-6 py-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Action Timeline</h2>
                        <p className="text-sm text-slate-600">Complete history of objective actions</p>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="p-6">
                <div className="flow-root">
                    <div className="max-h-[549px] overflow-y-auto pr-2">
                    <ul className="-mb-8">
                        {sortedActions.map((action, index) => {
                            const config = getActionConfig(action.action);
                            const ActionIcon = config.icon;
                            const isLast = index === sortedActions.length - 1;

                            return (
                                <li key={index}>
                                    <div className="relative pb-8">
                                        {/* Connecting Line */}
                                        {!isLast && (
                                            <span
                                                className="absolute left-6 top-10 -ml-px h-full w-0.5 bg-gradient-to-b from-slate-300 to-slate-100"
                                                aria-hidden="true"
                                            />
                                        )}

                                        <div className="relative flex items-start space-x-4 group">
                                            {/* Timeline Icon */}
                                            <div className="relative flex-shrink-0">
                                                <div className={`w-12 h-12 ${config.color} rounded-2xl flex items-center justify-center text-white shadow-lg ring-4 ring-white group-hover:scale-105 transition-transform duration-200`}>
                                                    <ActionIcon className="w-5 h-5" />
                                                </div>
                                                {/* Level Badge */}
                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-slate-200 shadow-sm">
                                                    <span className="text-xs font-bold text-slate-600">{action.level}</span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="min-w-0 flex-1">
                                                <div className={`${config.bgColor} rounded-2xl p-4 border border-slate-200/50 group-hover:border-slate-300/70 transition-all duration-200`}>
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            {/* User Info */}
                                                            <div className="flex items-center space-x-3 mb-3">
                                                                {action.user.avatar ? (
                                                                    <img
                                                                        src={action.user.avatar.small_url}
                                                                        alt={action.user.full_name}
                                                                        className="w-8 h-8 rounded-xl object-cover border-2 border-white shadow-sm"
                                                                    />
                                                                ) : (
                                                                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm"
                                                                         style={{background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'}}>
                                                                        {action.user.full_name.split(' ').map(n => n[0]).join('')}
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <p className="font-semibold text-slate-900 text-sm">
                                                                        {action.user.full_name}
                                                                    </p>
                                                                    <p className="text-xs text-slate-500">
                                                                        {action.user.email}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Action Details */}
                                                            <div className="mb-3">
                                                                <div className="flex items-center space-x-2 mb-2">
                                                                    <span className={`px-2 py-1 ${config.textColor} ${config.bgColor} rounded-lg text-xs font-semibold border border-current/20`}>
                                                                        {config.label}
                                                                    </span>
                                                                    <span className="text-xs text-slate-500">
                                                                        Level {action.level}
                                                                    </span>
                                                                </div>

                                                                {action.remarks && (
                                                                    <p className="text-sm text-slate-700 leading-relaxed">
                                                                        {action.remarks}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Detailed timestamp on hover */}
                                                    <div className="mt-3 pt-3 border-t border-slate-200/60">
                                                        <p className="text-xs text-slate-500">
                                                            {formatDetailedDate(action.created_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    </div>
                </div>

                <div className="mt-8 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-slate-300 rounded-xl flex items-center justify-center">
                                <Clock className="w-4 h-4 text-slate-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900 text-sm">Timeline Summary</p>
                                <p className="text-xs text-slate-600">Total workflow actions recorded</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-bold text-slate-900">{actions.length}</div>
                            <div className="text-xs text-slate-500">Actions</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActionTimeline;