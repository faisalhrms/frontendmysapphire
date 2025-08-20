import React, { useState } from 'react';
import { Eye, Target, Clock, Users, Shield, RefreshCw, User } from 'lucide-react';
import ObjectiveDetailHeader from "@modules/employee-self-services/objectives/components/ObjectiveDetailHeader.jsx";
import KRADetailsCard from "@modules/employee-self-services/objectives/components/KRADetailsCard.jsx";
import ActionTimeline from "@modules/employee-self-services/objectives/components/ActionTimeline.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { useObjectiveDetail } from "@modules/employee-self-services/objectives/hooks/useObjectiveDetail.js";
import { useParams } from "react-router-dom";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import EmptyState from "@components/EmptyState.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import { useApprovalHierarchyApprovers } from "@modules/employee-self-services/objectives/hooks/useApprovalHierarchyApprovers.js";
import ObjectiveApprovers from "@modules/employee-self-services/objectives/components/ObjectiveApprovers.jsx";
import LineMangerObjective from "@modules/employee-self-services/objectives/components/LineMangerObjective.jsx";
import LineMangerProfile from "@modules/employee-self-services/objectives/components/LineMangerProfile.jsx";
import { useSelector } from "react-redux";
import KRADetailsTable from "@modules/employee-self-services/objectives/components/KRADetailsTable.jsx";
import ActionTimelineTable from "@modules/employee-self-services/objectives/components/ActionTimeLineTable.jsx";
import ObjectiveApproversTable from "@modules/employee-self-services/objectives/components/ObjectiveApproversTable.jsx";
import LineMangerObjectiveTable from "@modules/employee-self-services/objectives/components/LineMangerObjectiveTable.jsx";
import LineMangerProfileTable from "@modules/employee-self-services/objectives/components/LineMangerProfileTable.jsx";

const ObjectiveDetail = () => {
    const { slug } = useParams();
    const { data, isLoading, refetch, isRefetching, isError, error } = useObjectiveDetail(slug);
    const { data: approvers } = useApprovalHierarchyApprovers(data?.objective?.user?.id, 'objective');
    const currentUser = useSelector((state) => state.auth.user);
    const [activeTab, setActiveTab] = useState('overview');
    const timelineActions = data?.objective?.actions || [];
    const [viewType, setViewType] = useState('grid');

    const handleViewChange = (type) => setViewType(type);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Eye, description: 'Complete objective summary', count: null },
        { id: 'kras', label: 'Key Result Areas', icon: Target, description: 'Performance objectives', count: data?.objective?.details?.length },
        { id: 'timeline', label: 'Action History', icon: Clock, description: 'Workflow timeline', count: timelineActions?.length },
        { id: 'collaboration', label: 'Stakeholders', icon: Users, description: 'Team & approvers', count: approvers?.length },
        ...(currentUser?.id === data?.objective?.user?.id
            ? [{ id: "line-manager", label: "Line Manager Key Result Areas", icon: User, description: "Line Manager Key Result Areas", count: null }]
            : []),
    ];

    return (
        <>
            <IconPageHeader
                heading="Objective Details"
                description={`${data && data.objective.year} Performance Review`}
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

            {isLoading ? (
                <LoadingSpinner />
            ) : isError ? (
                <EmptyState icon={Shield} heading="Error" description={error?.message} />
            ) : (
                <div className="min-h-screen transition-all duration-300   dark:text-gray-200 dark:bg-bodybg">
                    <div className="max-w-7xl mx-auto px-4 bg-gray-50 sm:px-6 lg:px-8 py-8 space-y-8 dark:bg-bodybg dark:text-gray-200">
                        <div className="transform hover:scale-[1.01] transition-transform duration-300">
                            <ObjectiveDetailHeader data={data.objective} />
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 overflow-hidden">
                            <div className="border-b border-slate-200/60 dark:border-gray-700/50">
                                <div className="flex items-center justify-between px-6 py-4">
                                    <div className="flex space-x-1">
                                        {tabs.map((tab) => {
                                            const IconComponent = tab.icon;
                                            return (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setActiveTab(tab.id)}
                                                    className={`relative flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium border
    ${activeTab === tab.id
                                                        ? 'bg-gray-200 text-gray-800 shadow-lg dark:bg-gray-700 dark:text-gray-200 dark:shadow-lg dark:shadow-gray-800'
                                                        : 'text-slate-600 dark:text-gray-300 dark:hover:bg-gray-700'
                                                    }`}


                                                >
                                                    <IconComponent
                                                        className={`w-4 h-4 transition-transform duration-200 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'}`}
                                                    />
                                                    <span>{tab.label}</span>
                                                    {tab.count > 0 && (
                                                        <span
                                                            className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${
                                                                activeTab === tab.id
                                                                    ? 'bg-gray-800 text-white'
                                                                    : 'bg-gray-800 text-white group-hover:bg-gray-500'
                                                            }`}
                                                        >
                                                            {tab.count}
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            className={`ti-btn ti-btn-sm ${viewType === "grid" ? "ti-btn-outline-primary" : "ti-btn-primary"}`}
                                            onClick={() => handleViewChange("grid")}
                                            title="Grid View"
                                        >
                                            <i className="ti ti-grid-dots"></i>
                                        </button>
                                        <button
                                            className={`ti-btn ti-btn-sm ${viewType === "list" ? "ti-btn-outline-primary" : "ti-btn-primary"}`}
                                            onClick={() => handleViewChange("list")}
                                            title="List View"
                                        >
                                            <i className="ti ti-list"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {activeTab === 'overview' && (
                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                    <div className="xl:col-span-2 space-y-8">
                                        {viewType === "grid" ? (
                                            <div className="transform hover:scale-[1.01] transition-transform duration-300">
                                                <KRADetailsCard details={data.objective.details} />
                                            </div>
                                        ) : (
                                            <div className="transform hover:scale-[1.01] transition-transform duration-300">
                                                <KRADetailsTable details={data.objective.details} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-6">
                                        {viewType === "grid" ? (
                                            <div
                                                className="transform hover:scale-[1.01] transition-transform duration-300">
                                                <ActionTimeline actions={timelineActions}/>
                                            </div>
                                        ) : (
                                            <div
                                                className="transform hover:scale-[1.01] transition-transform duration-300">
                                                <ActionTimelineTable actions={timelineActions}/>
                                            </div>
                                        )}

                                        {/* Quick Stats Card */}
                                        <div
                                            className="dark:text-gray-200 dark:bg-bodybg  bg-white dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 border border-indigo-200/50 dark:border-gray-700">
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-200 mb-4">Quick
                                                Stats</h3>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-slate-600 dark:text-gray-200 dark:bg-bodybg ">Total KRAs</span>
                                                    <span
                                                        className="font-bold text-indigo-600 dark:text-indigo-400 dark:text-gray-200 dark:bg-bodybg ">{data.objective.details.length}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span
                                                        className="text-slate-600 dark:text-gray-300">Timeline Events</span>
                                                    <span
                                                        className="font-bold text-indigo-600 dark:text-indigo-400 dark:text-gray-200 dark:bg-bodybg ">{timelineActions.length}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-slate-600 dark:text-gray-200 dark:bg-bodybg ">Current Status</span>
                                                    <span
                                                        className="px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-700 dark:text-amber-100 rounded-lg text-xs font-semibold">
                                                        {toTitleCase(data.objective.status)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            className="dark:text-gray-200 dark:bg-bodybg  bg-white dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 border border-indigo-200/50 dark:border-gray-700">
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-200 mb-4">HR
                                                Remarks</h3>
                                            <div className="space-y-4">
                                                {data.objective.remarks ?
                                                    data.objective.remarks
                                                :
                                                     <EmptyState
                                                        icon={User}
                                                        heading="HR Remarks"
                                                        description={"HR has not yet provided their remarks."}
                                                    />
                                                }

                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )}

                            {activeTab === 'kras' && (
                                viewType === "grid" ? (
                                    <div className="transform hover:scale-[1.01] transition-transform duration-300">
                                        <KRADetailsCard details={data.objective.details}/>
                                    </div>
                                ) : (
                                    <div className="transform hover:scale-[1.01] transition-transform duration-300">
                                        <KRADetailsTable details={data.objective.details}/>
                                    </div>
                                )
                            )}

                            {activeTab === 'timeline' && (
                                viewType === "grid" ? (
                                    <div className="transform hover:scale-[1.01] transition-transform duration-300">
                                        <ActionTimeline actions={timelineActions}/>
                                    </div>
                                ) : (
                                    <div className="transform hover:scale-[1.01] transition-transform duration-300">
                                        <ActionTimelineTable actions={timelineActions}/>
                                    </div>
                                )
                            )}

                            {activeTab === 'collaboration' && (
                                viewType === "grid" ? (
                                    <div className="transform hover:scale-[1.01] transition-transform duration-300">
                                        <ObjectiveApprovers approvers={approvers}/>
                                    </div>
                                ) : (
                                    <div className="transform hover:scale-[1.01] transition-transform duration-300">
                                        <ObjectiveApproversTable approvers={approvers} />
                                    </div>
                                )
                            )}

                            {activeTab === "line-manager" && (
                                data?.line_manager_objective ? (
                                    <div>
                                        <div
                                            className="transform hover:scale-[1.01] transition-transform duration-300 mb-4">
                                            <LineMangerProfile manager={data?.line_manager_objective?.user}/>
                                        </div>
                                        <div className="transform hover:scale-[1.01] transition-transform duration-300">
                                            {
                                                viewType === "grid" ? (
                                                    <KRADetailsCard heading={`Key Result Areas Line Manger`}
                                                                    details={data?.line_manager_objective?.details}
                                                    />
                                                ) : (
                                                    <KRADetailsTable details={data?.line_manager_objective?.details} />
                                                )
                                            }
                                        </div>
                                    </div>
                                        ) : (
                                        <EmptyState
                                            icon={User}
                                            heading="Line Manager Key Result Areas"
                                            description={error?.message || "Line Manager has not yet added Key Result Areas."}
                                        />
                                        )
                                        )}
                                    </div>
                                </div>
                                </div>
                                )}
                        </>
                        );
                        };

export default ObjectiveDetail;
