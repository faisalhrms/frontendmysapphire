import React from 'react';
import { Calendar, User, Target, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const ObjectiveDetailHeader = ({ data }) => {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'under_approval':
                return {
                    label: 'Under Approval',
                    color: 'bg-amber-100 text-amber-800 border-amber-200',
                    icon: Clock,
                    iconColor: 'text-amber-600'
                };
            case 'approved':
                return {
                    label: 'Approved',
                    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                    icon: CheckCircle2,
                    iconColor: 'text-emerald-600'
                };
            case 'rejected':
                return {
                    label: 'Rejected',
                    color: 'bg-red-100 text-red-800 border-red-200',
                    icon: AlertCircle,
                    iconColor: 'text-red-600'
                };
            default:
                return {
                    label: 'Draft',
                    color: 'bg-slate-100 text-slate-800 border-slate-200',
                    icon: Target,
                    iconColor: 'text-slate-600'
                };
        }
    };

    const statusConfig = getStatusConfig(data.status);
    const StatusIcon = statusConfig.icon;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Hero Section */}
            <div className="relative">
                <div className="absolute inset-0 opacity-5"
                     style={{background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'}}></div>
                <div className="relative px-8 py-8">
                    <div className="flex items-start justify-between">
                        {/* Left Section - User Info */}
                        <div className="flex items-start space-x-6">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    {data.user.avatar ? (
                                        <img
                                            src={data.user.avatar.medium_url}
                                            alt={data.user.full_name}
                                            className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg"
                                             style={{background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'}}>
                                            {data.user.full_name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                    )}
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                        <Target className="w-4 h-4 text-blue-600" />
                                    </div>
                                </div>
                            </div>

                            {/* User Details */}
                            <div className="flex-1">
                                <div className="mb-3">
                                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                                        Performance Objectives {data.year}
                                    </h1>
                                    <p className="text-slate-600 mt-1">
                                        Annual Key Result Areas & Performance Indicators
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-info/50 rounded-xl flex items-center justify-center">
                                            <User className="w-5 h-5 text-info" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Employee</p>
                                            <p className="font-semibold text-slate-900">{data.user.full_name}</p>
                                            <p className="text-xs text-slate-500">{data.user.emp_code} • {data.user.position}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Department</p>
                                            <p className="font-semibold text-slate-900">{data.user.department}</p>
                                            <p className="text-xs text-slate-500">{data.user.designation}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Section - Status & Actions */}
                        <div className="flex flex-col items-end space-y-4">
                            {/* Status Badge */}
                            <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border ${statusConfig.color}`}>
                                <StatusIcon className={`w-4 h-4 ${statusConfig.iconColor}`} />
                                <span className="font-semibold text-sm">{statusConfig.label}</span>
                            </div>

                            {/* Quick Stats */}
                            <div className="text-right">
                                <div className="text-2xl font-bold text-slate-900">{data.total_weightage}%</div>
                                <div className="text-sm text-slate-500">Total Weightage</div>
                            </div>

                            {/* Current Approver */}
                            {data.current_approver && (
                                <div className="text-right">
                                    <p className="text-xs text-slate-500">Pending Approval</p>
                                    <p className="font-semibold text-sm text-slate-900">{data.current_approver.full_name}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline Info Bar */}
            <div className="bg-slate-50 border-t border-slate-100 px-8 py-4">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-slate-600">Created: {formatDate(data.created_at)}</span>
                        </div>
                        {data.submitted_at && (
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                <span className="text-slate-600">Submitted: {formatDate(data.submitted_at)}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span className="text-slate-600">{data.details.length} KRAs Defined</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ObjectiveDetailHeader;