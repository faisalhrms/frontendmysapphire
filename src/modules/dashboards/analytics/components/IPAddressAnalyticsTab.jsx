import React, { memo } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Globe, Activity, Users, Eye, Clock, Monitor, Chrome, Apple, Shield, RefreshCw, ArrowLeft, AlertCircle } from 'lucide-react';
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import EmptyState from "@components/EmptyState.jsx";
import StatCard from "@modules/dashboards/analytics/components/StatCard.jsx";

const IPAddressAnalyticsTab = ({ ipData, ipLoading, ipError, refetchIPData, selectedIP, setSelectedIP }) => {
    if (ipLoading) return <LoadingSpinner />;

    if (ipError) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-danger mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-2">Error Loading Data</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{ipError}</p>
                    <button
                        onClick={() => refetchIPData()}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!ipData) return <EmptyState icon={Globe} heading="IP Address Analytics" description="No IP data available" />;

    if (!selectedIP) {
        return <IPOverviewList ipData={ipData} setSelectedIP={setSelectedIP} refetchIPData={refetchIPData} />;
    }

    return <IPDetailView ipData={ipData} selectedIP={selectedIP} setSelectedIP={setSelectedIP} refetchIPData={refetchIPData} />;
};

const IPOverviewList = ({ ipData, setSelectedIP, refetchIPData }) => {
    const { overview, ip_list, traffic_timeline } = ipData;

    if (!ip_list || ip_list.length === 0) {
        return <EmptyState icon={Globe} heading="No IP Addresses Found" description="No IP address data available for the selected period" />;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard
                    title="Unique IP Addresses"
                    value={overview?.total_unique_ips?.value || 0}
                    change={overview?.total_unique_ips?.change}
                    icon={Globe}
                />
                <StatCard
                    title="Total Sessions"
                    value={overview?.total_sessions || 0}
                    icon={Activity}
                />
            </div>

            {traffic_timeline && traffic_timeline.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-bodybg">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">IP Traffic Timeline</h3>
                        <button onClick={() => refetchIPData()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors dark:hover:bg-gray-700">
                            <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-200" />
                        </button>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={traffic_timeline}>
                            <defs>
                                <linearGradient id="colorIPSessions" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorIPUnique" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey={traffic_timeline[0]?.date ? "date" : "time"} stroke="#6B7280" fontSize={12} />
                            <YAxis stroke="#6B7280" fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
                            <Legend />
                            <Area type="monotone" dataKey="session_count" stroke="#3B82F6" fillOpacity={1} fill="url(#colorIPSessions)" name="Sessions" />
                            <Area type="monotone" dataKey="unique_ips" stroke="#10B981" fillOpacity={1} fill="url(#colorIPUnique)" name="Unique IPs" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-bodybg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-200">IP Address Breakdown</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200 dark:bg-gray-800">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-300">IP Address</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-300">Sessions</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-300">Users</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-300">Page Views</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-300">Avg Duration</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-300">Auth Rate</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-300">First Seen</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-300">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {ip_list.map((ip, index) => (
                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <td className="px-4 py-3 text-sm font-mono text-gray-900 dark:text-gray-200">{ip.ip_address}</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{ip.total_sessions}</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{ip.unique_users}</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{ip.total_page_views}</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{ip.avg_duration}s</td>
                                <td className="px-4 py-3">
                                        <span className={`text-sm font-medium ${ip.auth_rate > 50 ? 'text-success' : 'text-warning'}`}>
                                            {ip.auth_rate}%
                                        </span>
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                                    {ip.first_seen ? new Date(ip.first_seen).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => setSelectedIP(ip.ip_address)}
                                        className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-colors"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const IPDetailView = ({ ipData, selectedIP, setSelectedIP, refetchIPData }) => {
    const { overview, users, devices, activity_timeline, page_views, traffic_patterns, session_quality } = ipData;

    if (!overview) {
        return <EmptyState icon={Globe} heading="No Data Available" description="No data found for this IP address" />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setSelectedIP(null)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-200" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200">IP Address Details</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{selectedIP}</p>
                    </div>
                </div>
                <button
                    onClick={() => refetchIPData()}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                    <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-200" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Total Sessions"
                    value={overview.total_sessions?.value || 0}
                    change={overview.total_sessions?.change}
                    icon={Activity}
                />
                <StatCard
                    title="Unique Users"
                    value={overview.total_users?.value || 0}
                    change={overview.total_users?.change}
                    icon={Users}
                />
                <StatCard
                    title="Page Views"
                    value={overview.total_page_views || 0}
                    icon={Eye}
                />
                <StatCard
                    title="Avg Session Duration"
                    value={`${overview.avg_session_duration?.value || 0}s`}
                    change={overview.avg_session_duration?.change}
                    icon={Clock}
                />
                <StatCard
                    title="First Seen"
                    value={overview.first_seen ? new Date(overview.first_seen).toLocaleDateString() : 'N/A'}
                    icon={Clock}
                />
                <StatCard
                    title="Last Seen"
                    value={overview.last_seen ? new Date(overview.last_seen).toLocaleDateString() : 'N/A'}
                    icon={Clock}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-bodybg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 dark:text-gray-200">Authentication Status</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-success/10 border border-success rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Shield className="w-6 h-6 text-success" />
                                <span className="font-medium text-gray-900 dark:text-gray-200">Authenticated</span>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-200">{overview.authenticated_sessions || 0}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{overview.authentication_rate || 0}%</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-warning/10 border border-warning rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Users className="w-6 h-6 text-warning" />
                                <span className="font-medium text-gray-900 dark:text-gray-200">Anonymous</span>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-200">{overview.anonymous_sessions || 0}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{100 - (overview.authentication_rate || 0)}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {session_quality && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-bodybg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 dark:text-gray-200">Session Quality</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-success/10 rounded-lg border border-success">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-success">Quality Sessions</span>
                                    <span className="text-lg font-bold text-success">{session_quality.quality_sessions || 0}</span>
                                </div>
                                <div className="w-full bg-success/20 rounded-full h-2">
                                    <div className="bg-success h-2 rounded-full transition-all" style={{ width: `${session_quality.quality_rate || 0}%` }}></div>
                                </div>
                                <p className="text-xs text-success mt-1">{session_quality.quality_rate || 0}%</p>
                            </div>
                            <div className="p-4 bg-danger/10 rounded-lg border border-danger">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-danger">Bounce Sessions</span>
                                    <span className="text-lg font-bold text-danger">{session_quality.bounce_sessions || 0}</span>
                                </div>
                                <div className="w-full bg-danger/20 rounded-full h-2">
                                    <div className="bg-danger h-2 rounded-full transition-all" style={{ width: `${session_quality.bounce_rate || 0}%` }}></div>
                                </div>
                                <p className="text-xs text-danger mt-1">{session_quality.bounce_rate || 0}%</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {activity_timeline && activity_timeline.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-bodybg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 dark:text-gray-200">Activity Timeline</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={activity_timeline}>
                            <defs>
                                <linearGradient id="colorIPEvents" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorIPViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey={activity_timeline[0]?.date ? "date" : "time"} stroke="#6B7280" fontSize={12} />
                            <YAxis stroke="#6B7280" fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
                            <Legend />
                            <Area type="monotone" dataKey="total_events" stroke="#3B82F6" fillOpacity={1} fill="url(#colorIPEvents)" name="Events" />
                            <Area type="monotone" dataKey="page_views" stroke="#10B981" fillOpacity={1} fill="url(#colorIPViews)" name="Page Views" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}

            {devices && (devices.devices?.length > 0 || devices.browsers?.length > 0 || devices.operating_systems?.length > 0) && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {devices.devices && devices.devices.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-bodybg">
                            <div className="flex items-center space-x-2 mb-4">
                                <Monitor className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">Devices</h3>
                            </div>
                            <div className="space-y-2">
                                {devices.devices.map((device, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{device.device_type || 'Unknown'}</span>
                                        <span className="text-sm font-bold text-gray-900 dark:text-gray-200">{device.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {devices.browsers && devices.browsers.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-bodybg">
                            <div className="flex items-center space-x-2 mb-4">
                                <Chrome className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">Browsers</h3>
                            </div>
                            <div className="space-y-2">
                                {devices.browsers.map((browser, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{browser.browser || 'Unknown'}</span>
                                        <span className="text-sm font-bold text-gray-900 dark:text-gray-200">{browser.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {devices.operating_systems && devices.operating_systems.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-bodybg">
                            <div className="flex items-center space-x-2 mb-4">
                                <Apple className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">Operating Systems</h3>
                            </div>
                            <div className="space-y-2">
                                {devices.operating_systems.map((os, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{os.os || 'Unknown'}</span>
                                        <span className="text-sm font-bold text-gray-900 dark:text-gray-200">{os.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {traffic_patterns?.hourly && traffic_patterns.hourly.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-bodybg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 dark:text-gray-200">Hourly Traffic Pattern</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={traffic_patterns.hourly}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="hour" stroke="#6B7280" fontSize={12} />
                            <YAxis stroke="#6B7280" fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
                            <Bar dataKey="session_count" fill="#10B981" radius={[8, 8, 0, 0]} name="Sessions" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {page_views && page_views.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-bodybg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-200">Most Viewed Pages</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Page</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Total Views</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Sessions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {page_views.map((page, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200 truncate max-w-xs">{page.page_path}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{page.total_views}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{page.unique_sessions}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {users && users.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-bodybg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-200">Users from this IP</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">User</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Company</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Sessions</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Page Views</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Avg Duration</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Last Session</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {users.map((user, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{user.full_name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{user.company || 'N/A'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{user.total_sessions}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{user.total_page_views}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{user.avg_duration}s</td>
                                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                                        {user.last_session ? new Date(user.last_session).toLocaleString() : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(IPAddressAnalyticsTab);