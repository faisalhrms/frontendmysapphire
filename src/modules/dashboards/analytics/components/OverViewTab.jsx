import React, { memo } from "react";
import {
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart, Bar
} from 'recharts';
import { RefreshCw, XCircle } from 'lucide-react';
import StatCard from './StatCard';
import { Activity, Users, Eye, Clock, TrendingUp, Monitor, Smartphone, Tablet } from 'lucide-react';
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import EmptyState from "@components/EmptyState.jsx";
export const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];


const OverviewTab = ({ dashboardData, dashboardLoading, refetchDashboard, setActiveTab, setSelectedPage }) => {
    if (dashboardLoading) return <LoadingSpinner />;
    if (!dashboardData) return <EmptyState icon={XCircle} heading="Overview Data" description="No data available" />;


    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Total Sessions"
                    value={dashboardData.overview.total_sessions.value}
                    change={dashboardData.overview.total_sessions.change}
                    icon={Users}
                />
                <StatCard
                    title="Page Views"
                    value={dashboardData.overview.page_views.value}
                    change={dashboardData.overview.page_views.change}
                    icon={Eye}
                />
                <StatCard
                    title="Unique Visitors"
                    value={dashboardData.overview.unique_visitors.value}
                    change={dashboardData.overview.unique_visitors.change}
                    icon={Activity}
                />
                <StatCard
                    title="Avg. Duration"
                    value={`${dashboardData.overview.avg_session_duration.value}s`}
                    change={dashboardData.overview.avg_session_duration.change}
                    icon={Clock}
                />
                <StatCard
                    title="Bounce Rate"
                    value={`${dashboardData.overview.bounce_rate.value}%`}
                    change={dashboardData.overview.bounce_rate.change}
                    icon={TrendingUp}
                />
                <StatCard
                    title="Active Users"
                    value={dashboardData.overview.active_users}
                    icon={Activity}
                />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 dark:bg-bodybg">Traffic Overview</h3>
                    <button
                        onClick={() => refetchDashboard()}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <RefreshCw className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={dashboardData.time_series}>
                        <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                        <YAxis stroke="#6B7280" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
                        <Legend />
                        <Area type="monotone" dataKey="page_views" stroke="#3B82F6" fillOpacity={1} fill="url(#colorViews)" name="Page Views" />
                        <Area type="monotone" dataKey="sessions" stroke="#10B981" fillOpacity={1} fill="url(#colorSessions)" name="Sessions" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-200 dark:bg-bodybg">Top Pages</h3>
                    <div className="space-y-3">
                        {dashboardData.top_pages.slice(0, 5).map((page, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200 dark:text-gray-200 dark:bg-bodybg"
                                 onClick={() => {
                                     setSelectedPage(page.page_path);
                                     setActiveTab('pages');
                                 }}
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-200 dark:bg-bodybg">{page.page_path}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-200 dark:bg-bodybg">{page.unique_visitors} unique visitors</p>
                                </div>
                                <span className="ml-4 text-sm font-semibold text-primary dark:text-gray-200 dark:bg-bodybg">{page.views} views</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-200 dark:bg-bodybg">Traffic Sources</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={dashboardData.traffic_sources.slice(0, 5)}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ source, percent }) => `${source} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="sessions"
                            >
                                {dashboardData.traffic_sources.slice(0, 5).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 dark:text-gray-200 dark:bg-bodybg">Device Breakdown</h3>
                    <div className="space-y-3">
                        {dashboardData.device_stats.map((device, index) => {
                            const DeviceIcon = device.device_type === 'Desktop' ? Monitor : device.device_type === 'Mobile' ? Smartphone : Tablet;
                            const total = dashboardData.device_stats.reduce((sum, d) => sum + d.count, 0);
                            const percentage = ((device.count / total) * 100).toFixed(1);
                            return (
                                <div key={index}
                                     className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:text-gray-200 dark:bg-bodybg border border-gray-200">
                                    <div className="flex items-center space-x-3">
                                        <DeviceIcon className="w-6 h-6 text-gray-600 dark:text-gray-200 dark:bg-bodybg"/>
                                        <span
                                            className="text-sm font-medium text-gray-900 capitalize dark:text-gray-200 dark:bg-bodybg" >{device.device_type || 'Unknown'}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900 dark:text-gray-200 dark:bg-bodybg ">{device.count}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-200 dark:bg-bodybg ">{percentage}%</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 dark:text-gray-200 dark:bg-bodybg">Browser Breakdown</h3>
                    <div className="space-y-3">
                        {dashboardData.browser_stats.slice(0, 5).map((browser, index) => {
                            const total = dashboardData.browser_stats.reduce((sum, b) => sum + b.count, 0);
                            const percentage = ((browser.count / total) * 100).toFixed(1);
                            return (
                                <div key={index}
                                     className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:text-gray-200 dark:bg-bodybg border border-gray-200">
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200 dark:bg-bodybg">{browser.browser}</span>
                                    <div className="text-right dark:text-gray-200 dark:bg-bodybg">
                                        <p className="text-lg font-bold text-gray-900 dark:text-gray-200 dark:bg-bodybg">{browser.count}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-200 dark:bg-bodybg">{percentage}%</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 dark:text-gray-200 dark:bg-bodybg">Operating System Breakdown</h3>
                    <div className="space-y-3">
                        {dashboardData.os_stats.slice(0, 5).map((os, index) => {
                            const total = dashboardData.os_stats.reduce((sum, b) => sum + b.count, 0);
                            const percentage = ((os.count / total) * 100).toFixed(1);
                            return (
                                <div key={index}
                                     className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:text-gray-200 dark:bg-bodybg border border-gray-200">
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200 dark:bg-bodybg">{os.os}</span>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900 dark:text-gray-200 dark:bg-bodybg">{os.count}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-200 dark:bg-bodybg">{percentage}%</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {dashboardData.events_by_category && dashboardData.events_by_category.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-200 dark:bg-bodybg">Events by Category</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={dashboardData.events_by_category.slice(0, 10)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB"/>
                            <XAxis dataKey="category" stroke="#6B7280" fontSize={12}/>
                            <YAxis stroke="#6B7280" fontSize={12}/>
                            <Tooltip/>
                            <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]}/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default memo(OverviewTab);