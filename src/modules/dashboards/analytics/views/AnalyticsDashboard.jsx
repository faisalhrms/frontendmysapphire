import React, {memo, useState} from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity } from 'lucide-react';
import api from "@config/axiosConfig.js";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import UserOverviewTab from "@modules/dashboards/analytics/components/UserOverviewTab.jsx";
import PagesTab from "@modules/dashboards/analytics/components/PagesTab.jsx";
import RealtimeTab from "@modules/dashboards/analytics/components/RealtimeTab.jsx";
import OverviewTab from "@modules/dashboards/analytics/components/OverViewTab.jsx";

const AnalyticsDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [period, setPeriod] = useState('today');
    const [selectedPage, setSelectedPage] = useState('/module/ess/brand-book');
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const { data: dashboardData, isLoading: dashboardLoading, refetch: refetchDashboard } = useQuery({
        queryKey: ['analytics-dashboard', period],
        queryFn: async () => {
            const response = await api.get(`analytics/dashboard/?period=${period}`);
            return response.data.data;
        },
        enabled: activeTab === 'overview',
        refetchInterval: 60000,
    });

    const { data: realtimeData, isLoading: realtimeLoading, refetch: refetchRealtime } = useQuery({
        queryKey: ['analytics-realtime'],
        queryFn: async () => {
            const response = await api.get('analytics/realtime/?minutes=30');
            return response.data.data;
        },
        enabled: activeTab === 'realtime',
        refetchInterval: 10000,
    });

    const { data: pageData, isLoading: pageLoading, refetch: refetchPage } = useQuery({
        queryKey: ['analytics-page', selectedPage, period],
        queryFn: async () => {
            const response = await api.get(`analytics/page/?path=${encodeURIComponent(selectedPage)}&period=${period}`);
            return response.data.data;
        },
        enabled: activeTab === 'pages',
        refetchInterval: 60000,
    });

    const { data: userOverviewData, isLoading: userOverviewLoading, refetch: refetchUserOverview } = useQuery({
        queryKey: ['analytics-user-overview', period, selectedCompany, selectedUser],
        queryFn: async () => {
            const companyParam = selectedCompany ? `&company_id=${selectedCompany}` : '';
            const userParam = selectedUser ? `&user_id=${selectedUser}` : '';
            const response = await api.get(
                `analytics/user-overview/?period=${period}${companyParam}${userParam}`
            );
            return response.data.data;
        },
        enabled: activeTab === 'users',
        refetchInterval: 60000,
    });

    return (
        <div className="min-h-screen">
            <div className="mx-auto">
                <IconPageHeader
                    heading="Analytics Dashboard"
                    description="Monitor your website performance and user behavior"
                    icon={Activity}
                    headerClasses='font-bold text-[2rem]'
                />
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 dark:text-gray-200 dark:bg-bodybg">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-wrap gap-4">
                        <div className="flex space-x-1">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    activeTab === 'overview'
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('realtime')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                                    activeTab === 'realtime'
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <span>Real-time</span>
                                {realtimeData &&
                                    <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>}
                            </button>
                            <button
                                onClick={() => setActiveTab('pages')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    activeTab === 'pages'
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                Pages
                            </button>
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    activeTab === 'users'
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                Users
                            </button>
                        </div>

                        {(activeTab === 'overview' || activeTab === 'pages' || activeTab === 'users') && (
                            <div className="flex space-x-2">
                                {['today', 'yesterday', '7d', '30d', '90d', '1y'].map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPeriod(p)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                            period === p
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {p === 'today'
                                            ? 'Today'
                                            : p === 'yesterday'
                                                ? 'Yesterday'
                                                : p === '7d'
                                                    ? '7 Days'
                                                    : p === '30d'
                                                        ? '30 Days'
                                                        : p === '90d'
                                                            ? '90 Days'
                                                            : '1 Year'}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-6">
                        {activeTab === 'overview' && (
                            <OverviewTab
                                dashboardData={dashboardData}
                                dashboardLoading={dashboardLoading}
                                refetchDashboard={refetchDashboard}
                                setActiveTab={setActiveTab}
                                setSelectedPage={setSelectedPage}
                            />
                        )}
                        {activeTab === 'realtime' && (
                            <RealtimeTab
                                realtimeData={realtimeData}
                                realtimeLoading={realtimeLoading}
                                refetchRealtime={refetchRealtime}
                            />
                        )}
                        {activeTab === 'pages' && (
                            <PagesTab
                                pageData={pageData}
                                pageLoading={pageLoading}
                                refetchPage={refetchPage}
                                selectedPage={selectedPage}
                                setSelectedPage={setSelectedPage}
                            />
                        )}
                        {activeTab === 'users' && (
                            <UserOverviewTab
                                userOverviewData={userOverviewData}
                                userOverviewLoading={userOverviewLoading}
                                refetchUserOverview={refetchUserOverview}
                                selectedCompany={selectedCompany}
                                setSelectedCompany={setSelectedCompany}
                                selectedUser={selectedUser}
                                setSelectedUser={setSelectedUser}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(AnalyticsDashboard);