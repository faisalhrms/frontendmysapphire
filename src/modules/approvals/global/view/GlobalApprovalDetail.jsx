import React, { useState } from 'react';
import { Eye, Target, Clock, Shield, RefreshCw, FileText, Users, Activity, BarChart3 } from 'lucide-react';
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { useParams } from "react-router-dom";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import EmptyState from "@components/EmptyState.jsx";
import {useGlobalApprovalDetail} from "@modules/approvals/global/hooks/useGlobalApprovalDetail.js";
import ApprovalRequesterDetail from "@modules/approvals/global/components/ApprovalRequesterDetail.jsx";
import ApprovalActionTimelineGrid from "@modules/approvals/global/components/ApprovalActionTimelineGrid.jsx";
import ApprovalActionTimeLineTable from "@modules/approvals/global/components/ApprovalActionTimeLineTable.jsx";

const GlobalApprovalDetail = () => {
    const { id } = useParams();
    const { data, isLoading, refetch, isRefetching, isError, error } = useGlobalApprovalDetail(id);
    const [activeTab, setActiveTab] = useState('overview');
    const timelineActions = data?.actions || [];
    const [viewType, setViewType] = useState('grid');

    const handleViewChange = (type) => setViewType(type);

    const tabs = [
        {
            id: 'overview',
            label: 'Details Overview',
            icon: FileText,
            description: 'Complete summary & specifications',
            count: null
        },
        {
            id: 'timeline',
            label: 'Action History',
            icon: Activity,
            description: 'Workflow timeline & approvals',
            count: timelineActions?.length
        },
    ];

    if (isLoading) return <LoadingSpinner />;
    if (isError) return <EmptyState icon={Shield} heading="Error Loading Approval" description={error?.message} />;


    return (
        <>
            <IconPageHeader
                heading={data.approval_type.label}
                description={data.approval_type.description}
                icon={Target}
                children={
                    <div className="flex items-center space-x-2">
                        <div className="hidden md:flex items-center space-x-2">
                            <button
                                onClick={() => refetch()}
                                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-700 transition-all duration-200 group"
                                disabled={isRefetching}
                            >
                                <RefreshCw
                                    className={`w-4 h-4 text-slate-600 dark:text-gray-200 group-hover:text-slate-900 dark:group-hover:text-white transition-all ${isRefetching ? 'animate-spin' : ''}`}
                                />
                            </button>
                        </div>
                    </div>
                }
            />
            <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                    {/* Requester Detail Card */}
                    <div className="transform hover:scale-[1.001] transition-all duration-300">
                        <ApprovalRequesterDetail data={data} refetch={refetch} />
                    </div>

                    {/* Professional Tab Navigation */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 overflow-hidden">
                        <div className="border-b border-slate-200/60 dark:border-gray-700/50 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-gray-800">
                            <div className="flex items-center justify-between px-8 py-6">
                                <div className="flex space-x-2">
                                    {tabs.map((tab) => {
                                        const IconComponent = tab.icon;
                                        const isActive = activeTab === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`relative group flex items-center space-x-3 px-6 py-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                                    isActive
                                                        ? 'bg-white dark:bg-gray-700 text-blue-700 dark:text-blue-300 shadow-lg border border-blue-200 dark:border-blue-800'
                                                        : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-white/60 dark:hover:bg-gray-700/60'
                                                }`}
                                            >
                                                <div className={`transition-all duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                                                    <IconComponent className="w-5 h-5" />
                                                </div>
                                                <div className="text-left">
                                                    <div className="font-semibold">{tab.label}</div>
                                                    <div className="text-xs opacity-75">{tab.description}</div>
                                                </div>
                                                {tab.count !== null && tab.count > 0 && (
                                                    <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                                                        isActive
                                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                                            : 'bg-slate-100 text-slate-600 dark:bg-gray-600 dark:text-gray-300'
                                                    }`}>
                                                        {tab.count}
                                                    </div>
                                                )}
                                                {isActive && (
                                                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white dark:border-t-gray-700"></div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* View Toggle Controls */}
                                {activeTab === 'timeline' && (
                                    <div className="flex items-center space-x-2">
                                        <div className="flex bg-slate-100 dark:bg-gray-700 rounded-lg p-1">
                                            <button
                                                className={`flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 ${
                                                    viewType === "grid"
                                                        ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                                                        : "text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200"
                                                }`}
                                                onClick={() => handleViewChange("grid")}
                                                title="Grid View"
                                            >
                                                <BarChart3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                className={`flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 ${
                                                    viewType === "list"
                                                        ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                                                        : "text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200"
                                                }`}
                                                onClick={() => handleViewChange("list")}
                                                title="List View"
                                            >
                                                <Activity className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="space-y-8">
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-12 gap-6">
                                <div className="col-span-12">
                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden dark:text-gray-200 dark:bg-bodybg">
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-slate-200 dark:border-gray-700 px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                                                     style={{background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'}}>
                                                    <Target className="w-5 h-5"/>
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-bold text-slate-900 dark:text-gray-200">
                                                        {data.approval_type.label} Details
                                                    </h2>
                                                    <p className="text-sm text-slate-600 dark:text-gray-200">
                                                        {data.approval_type.description} - Complete specifications
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-body dark:text-gray-200 dark:bg-bodybg">
                                            <div className="table-responsive task-table overflow-hidden transition-all duration-300 min-h-[100px] bg-white dark:bg-bodybg">
                                                <table className="table whitespace-nowrap table-bordered min-w-full">
                                                    <thead>
                                                    <tr className="border-b border-defaultborder">
                                                        {data.details.tHeads.map((head) => (
                                                            <th scope="col" key={head.label}
                                                                className="relative text-center">
                                                                <div className="flex items-center justify-center p-2 gap-2">
                                                                    <span>{head.label}</span>
                                                                </div>
                                                            </th>
                                                        ))}
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {data.details.tRows.map((row, idx) => (
                                                        <tr key={idx} className="border-b border-defaultborder">
                                                            {data.details.tHeads.map(({label, type}) => {
                                                                const val = row[label];
                                                                if (type === "files" && Array.isArray(val)) {
                                                                    return (
                                                                        <td key={label}>
                                                                            <div className="flex space-x-2">
                                                                                {val.map(file => (
                                                                                    <a
                                                                                        key={file.id}
                                                                                        href={file.file_url}
                                                                                        target="_blank"
                                                                                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                                                    >
                                                                                        <Eye className="h-3 w-3 mr-1"/>
                                                                                        View
                                                                                    </a>
                                                                                ))}
                                                                            </div>
                                                                        </td>
                                                                    );
                                                                }

                                                                if (type === "file" && val?.file_url) {
                                                                    return (
                                                                        <td key={label} className="border px-2 py-1">
                                                                            <a href={val.file_url} target="_blank">
                                                                                {val.file_name}
                                                                            </a>
                                                                        </td>
                                                                    );
                                                                }
                                                                return <td key={label}>{val ?? "-"}</td>;
                                                            })}
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="mt-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-2xl p-4 border border-blue-200/50 dark:border-gray-600">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
                                                        <Target className="w-6 h-6"/>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900 text-sm dark:text-gray-200">
                                                            {data.approval_type.label} Summary
                                                        </p>
                                                        <p className="text-xs text-slate-600 dark:text-gray-200">
                                                            Complete {data.approval_type.description.toLowerCase()} documentation
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-slate-900 dark:text-gray-200">
                                                        {data.details.tRows.length}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-gray-200">
                                                        Record{data.details.tRows.length !== 1 ? 's' : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'timeline' && (
                            <div className="transform hover:scale-[1.001] transition-all duration-300">
                                {viewType === "grid" ? (
                                    <ApprovalActionTimelineGrid actions={timelineActions}/>
                                ) : (
                                    <ApprovalActionTimeLineTable actions={timelineActions}/>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default GlobalApprovalDetail;