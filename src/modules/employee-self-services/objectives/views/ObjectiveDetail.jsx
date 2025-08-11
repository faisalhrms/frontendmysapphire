import React, { useState } from 'react';
import {Eye, Target, Clock, Users, Shield, RefreshCw, Share2} from 'lucide-react';
import ObjectiveDetailHeader from "@modules/employee-self-services/objectives/components/ObjectiveDetailHeader.jsx";
import KRADetailsCard from "@modules/employee-self-services/objectives/components/KRADetailsCard.jsx";
import ActionTimeline from "@modules/employee-self-services/objectives/components/ActionTimeline.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {useObjectiveDetail} from "@modules/employee-self-services/objectives/hooks/useObjectiveDetail.js";
import {useParams} from "react-router-dom";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import EmptyState from "@components/EmptyState.jsx";
import {toTitleCase} from "@helpers/formatters.js";
import {
    useApprovalHierarchyApprovers
} from "@modules/employee-self-services/objectives/hooks/useApprovalHierarchyApprovers.js";
import ObjectiveApprovers from "@modules/employee-self-services/objectives/components/ObjectiveApprovers.jsx";

const ObjectiveDetail = () => {
    const { slug } = useParams();

    const { data, isLoading, refetch, isRefetching, isError, error } = useObjectiveDetail(slug);

    const { data: approvers, isLoading: isApproversLoading } = useApprovalHierarchyApprovers(data?.user?.id, 'objective');

    const [activeTab, setActiveTab] = useState('overview');

    const timelineActions = data?.actions || [];

    const tabs = [
        {
            id: 'overview',
            label: 'Overview',
            icon: Eye,
            description: 'Complete objective summary',
            count: null
        },
        {
            id: 'kras',
            label: 'Key Result Areas',
            icon: Target,
            description: 'Performance objectives',
            count: data?.details?.length
        },
        {
            id: 'timeline',
            label: 'Action History',
            icon: Clock,
            description: 'Workflow timeline',
            count: timelineActions?.length
        },
        {
            id: 'collaboration',
            label: 'Stakeholders',
            icon: Users,
            description: 'Team & approvers',
            count: 3
        }
    ];


    return (
        <>
            <IconPageHeader
                heading="Objective Details"
                description={`${data && data.year} Performance Review`}
                icon={Target}
                children={
                    <>
                        <div className="flex items-center space-x-2">
                            <div className="hidden md:flex items-center space-x-2">
                                <button
                                    onClick={() => refetch()}
                                    className="p-2 rounded-xl hover:bg-slate-100 transition-all duration-200 group"
                                    disabled={isRefetching}
                                >
                                    <RefreshCw
                                        className={`w-4 h-4 text-slate-600 group-hover:text-slate-900 transition-all ${isRefetching ? 'animate-spin' : ''}`}/>
                                </button>
                            </div>
                        </div>
                    </>
                }
            />
            {isLoading ? (
                <LoadingSpinner/>
            ) : isError ? (
                <EmptyState
                    icon={Shield}
                    heading="Error"
                    description={error?.message}
                />
            ) : (
                <div
                    className={`min-h-screen transition-all duration-300 bg-gradient-to-br from-slate-50 via-white to-slate-100`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                        <div className="transform hover:scale-[1.01] transition-transform duration-300">
                            <ObjectiveDetailHeader data={data}/>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="border-b border-slate-200/60">
                            <div className="flex items-center justify-between px-6 py-4">
                                <div className="flex space-x-1">
                                    {tabs.map((tab) => {
                                        const IconComponent = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`relative flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
                                                    activeTab === tab.id
                                                        ? 'bg-gradient-to-r from-green-500 to-indigo-600 text-white shadow-lg shadow-green-500/25'
                                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                                }`}
                                            >
                                                <IconComponent className={`w-4 h-4 transition-transform duration-200 ${
                                                    activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'
                                                }`}/>
                                                <span>{tab.label}</span>
                                                {tab.count > 0 && (
                                                    <span
                                                        className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition-colors ${
                                                            activeTab === tab.id
                                                                ? 'bg-white/20 text-white'
                                                                : 'bg-slate-200 text-slate-600 group-hover:bg-slate-300'
                                                        }`}>
                                                    {tab.count}
                                                </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Content Area */}
                    <div className="space-y-8">
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                <div className="xl:col-span-2 space-y-8">
                                    <div className="transform hover:scale-[1.01] transition-transform duration-300">
                                        <KRADetailsCard details={data.details}/>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="transform hover:scale-[1.01] transition-transform duration-300">
                                        <ActionTimeline actions={timelineActions}/>
                                    </div>

                                    {/* Quick Stats Card */}
                                    <div
                                        className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-200/50">
                                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Stats</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-600">Total KRAs</span>
                                                <span
                                                    className="font-bold text-indigo-600">{data.details.length}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-600">Timeline Events</span>
                                                <span
                                                    className="font-bold text-indigo-600">{timelineActions.length}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-600">Current Status</span>
                                                <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold">
                                                    {toTitleCase(data.status)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'kras' && (
                            <div className="transform hover:scale-[1.01] transition-transform duration-300">
                                <KRADetailsCard details={data.details}/>
                            </div>
                        )}

                        {activeTab === 'timeline' && (
                            <div className="transform hover:scale-[1.01] transition-transform duration-300">
                                <ActionTimeline actions={timelineActions}/>
                            </div>
                        )}

                        {activeTab === 'collaboration' && (
                            <div className="transform hover:scale-[1.01] transition-transform duration-300">
                                <ObjectiveApprovers approvers={approvers} />
                            </div>
                        )}
                    </div>
                </div>
                </div>
            )}
        </>
    );
};

export default ObjectiveDetail;