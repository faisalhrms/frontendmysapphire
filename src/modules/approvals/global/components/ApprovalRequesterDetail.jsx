import React from 'react';
import { Calendar, User, Target, CheckCircle2, Clock, AlertCircle, Check, X, Building2, Mail, Hash } from 'lucide-react';
import {useSelector} from "react-redux";
import useGlobalApproval from "@modules/approvals/global/hooks/useGlobalApproval.js";
import AlertModalPortal from "@components/AlertModalPortal.jsx";

const ApprovalRequesterDetail = ({ data, refetch }) => {
    const currentUser = useSelector((state) => state.auth.user);

    const {
        selectedId,
        actionType,
        isModalOpen,
        isSubmitting,
        getModalType,
        getModalTitle,
        getModalMessage,
        getModalButtonText,
        handleActionClick,
        handleSubmit,
        setIsModalOpen,
    } = useGlobalApproval(() => {
        refetch();
    });

    const getStatusConfig = (status) => {
        switch (status) {
            case 'pending':
                return {
                    label: 'Under Approval',
                    color: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800',
                    icon: Clock,
                    iconColor: 'text-amber-600 dark:text-amber-400',
                    dotColor: 'bg-amber-500'
                };
            case 'approved':
                return {
                    label: 'Approved',
                    color: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800',
                    icon: CheckCircle2,
                    iconColor: 'text-emerald-600 dark:text-emerald-400',
                    dotColor: 'bg-emerald-500'
                };
            case 'rejected':
                return {
                    label: 'Rejected',
                    color: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800',
                    icon: AlertCircle,
                    iconColor: 'text-rose-600 dark:text-rose-400',
                    dotColor: 'bg-rose-500'
                };
            default:
                return {
                    label: 'Draft',
                    color: 'bg-slate-50 text-slate-800 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700',
                    icon: Target,
                    iconColor: 'text-slate-600 dark:text-slate-400',
                    dotColor: 'bg-slate-500'
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
    const canTakeAction =
      typeof data.can_take_action === "boolean"
        ? data.can_take_action
        : currentUser?.id === data.current_approver?.id;

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 overflow-hidden">
                {/* Clean Header */}
                <div className="bg-slate-50 dark:bg-gray-800 px-6 py-4 border-b border-slate-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-base font-semibold text-slate-900 dark:text-gray-100">
                                Requested By
                            </h3>
                        </div>

                        {/* Compact Status Badge */}
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-lg border text-xs font-medium ${statusConfig.color}`}>
                            <StatusIcon className={`w-3 h-3 ${statusConfig.iconColor} mr-1.5`}/>
                            <span>{statusConfig.label}</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-6">
                    <div className="flex items-start justify-between">
                        {/* Left Side - Employee Information */}
                        <div className="flex items-start space-x-4 flex-1">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                {data.requester.avatar ? (
                                    <img
                                        src={data.requester.avatar.medium_url}
                                        alt={data.requester.full_name}
                                        className="w-16 h-16 rounded-xl object-cover border-2 border-slate-200 dark:border-gray-600"
                                    />
                                ) : (
                                    <div
                                        className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-semibold text-lg border-2 border-slate-200 dark:border-gray-600"
                                        style={{background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'}}>
                                        {data.requester.full_name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                )}
                            </div>

                            {/* Employee Details */}
                            <div className="flex-1 min-w-0">
                                {/* Name and Position */}
                                <div className="mb-4">
                                    <h2 className="text-xl font-semibold text-slate-900 dark:text-gray-100 mb-1">
                                        {data.requester.full_name}
                                    </h2>
                                    <p className="text-sm font-medium text-slate-600 dark:text-gray-400">
                                        {data.requester.position}
                                    </p>
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-slate-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                                <Hash className="w-4 h-4 text-slate-600 dark:text-gray-400"/>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-slate-500 dark:text-gray-500 uppercase tracking-wide">Employee ID</p>
                                                <p className="text-sm font-medium text-slate-900 dark:text-gray-100">{data.requester.emp_code}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-slate-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                                <Building2 className="w-4 h-4 text-slate-600 dark:text-gray-400"/>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-slate-500 dark:text-gray-500 uppercase tracking-wide">Department</p>
                                                <p className="text-sm font-medium text-slate-900 dark:text-gray-100">{data.requester.department}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-slate-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                                <Mail className="w-4 h-4 text-slate-600 dark:text-gray-400"/>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-slate-500 dark:text-gray-500 uppercase tracking-wide">Email</p>
                                                <p className="text-sm font-medium text-slate-900 dark:text-gray-100 truncate">{data.requester.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-slate-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                                <Target className="w-4 h-4 text-slate-600 dark:text-gray-400"/>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-slate-500 dark:text-gray-500 uppercase tracking-wide">Designation</p>
                                                <p className="text-sm font-medium text-slate-900 dark:text-gray-100">{data.requester.designation}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Actions */}
                        <div className="flex flex-col items-end space-y-3 ml-6">
                          {canTakeAction ? (
                            <div className="flex flex-col space-y-3">
                              <div className="text-right mb-1">
                                <p className="text-sm font-medium text-slate-900 dark:text-gray-100">Action Required</p>
                                <p className="text-xs text-slate-500 dark:text-gray-400">Review this request</p>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleActionClick(data.id, "approved", data.approval_type.label)}
                                  className="group inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                  title="Approve Request"
                                >
                                  <Check className="w-4 h-4 mr-1.5" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleActionClick(data.id, "rejected", data.approval_type.label)}
                                  className="group inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                                  title="Reject Request"
                                >
                                  <X className="w-4 h-4 mr-1.5" />
                                  Reject
                                </button>
                              </div>
                            </div>
                          ) : (
                            data.current_approver && (
                              <div className="bg-slate-50 dark:bg-gray-700/50 rounded-lg p-3 text-right max-w-xs">
                                <p className="text-xs font-medium text-slate-500 dark:text-gray-400 mb-2">Pending Approval</p>
                                <div className="flex items-center justify-end space-x-2">
                                  {data.current_approver.avatar ? (
                                    <img
                                      src={data.current_approver.avatar.small_url}
                                      alt={data.current_approver.full_name}
                                      className="w-6 h-6 rounded-lg object-cover"
                                    />
                                  ) : (
                                    <div
                                      className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-semibold"
                                      style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
                                    >
                                      {data.current_approver.full_name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </div>
                                  )}
                                  <div className="text-left">
                                    <p className="text-sm font-medium text-slate-900 dark:text-gray-100">
                                      {data.current_approver.full_name}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 dark:bg-gray-800 border-t border-slate-200 dark:border-gray-700 px-6 py-3">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-slate-500 dark:text-gray-400" />
                                <span className="text-slate-600 dark:text-gray-400">
                                    Created: <span className="font-medium text-slate-900 dark:text-gray-100">{formatDate(data.created_at)}</span>
                                </span>
                            </div>
                            {data.updated_at && (
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-slate-500 dark:text-gray-400" />
                                    <span className="text-slate-600 dark:text-gray-400">
                                        Updated: <span className="font-medium text-slate-900 dark:text-gray-100">{formatDate(data.updated_at)}</span>
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="text-slate-600 dark:text-gray-400">
                            ID: <span className="font-medium text-slate-900 dark:text-gray-100">#{data.id}</span>
                        </div>
                    </div>
                </div>
            </div>

            {selectedId && (
                <AlertModalPortal
                    id="objective-approval"
                    isOpen={isModalOpen}
                    type={getModalType(actionType)}
                    title={getModalTitle(actionType)}
                    message={getModalMessage(actionType)}
                    btnTxt={getModalButtonText(actionType)}
                    isSubmitting={isSubmitting}
                    needInput={true}
                    inputLabel="Remarks"
                    onConfirm={handleSubmit}
                    onClose={setIsModalOpen}
                />
            )}
        </>
    );
};

export default ApprovalRequesterDetail;