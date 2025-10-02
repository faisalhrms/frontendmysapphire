import React, { memo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, RefreshCw, XCircle } from 'lucide-react';
import Avatar from "@components/Avatar.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import EmptyState from "@components/EmptyState.jsx";

const RealtimeTab = ({ realtimeData, realtimeLoading, refetchRealtime }) => {
    if (realtimeLoading) return <LoadingSpinner />;
    if (!realtimeData) return <EmptyState icon={XCircle} heading="Real Time Data" description="No real-time data available" />;

    return (
        <div className="space-y-6">
            <div className="bg-primary-gradient rounded-lg shadow-lg p-8 text-white dark:text-gray-200 dark:bg-bodybg">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-blue-100 text-sm font-medium mb-2 ">Active Users Right Now</p>
                        <p className="text-5xl font-bold">{realtimeData.active_sessions_count}</p>
                        <p className="text-blue-100 text-sm mt-2">Last {realtimeData.time_window_minutes} minutes</p>
                    </div>
                    <div className="relative">
                        <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <Activity className="w-12 h-12 animate-pulse" />
                        </div>
                        <div className="absolute top-0 right-0 w-4 h-4 bg-success rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 dark:bg-bodybg">Active Pages</h3>
                        <button
                            onClick={() => refetchRealtime()}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <RefreshCw className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {realtimeData.active_pages.length > 0 ? (
                            realtimeData.active_pages.map((page, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:text-gray-200 dark:bg-bodybg border border-gray-200">
                                    <p className="text-sm font-medium text-gray-900 truncate flex-1 dark:text-gray-200 dark:bg-bodybg">{page.page_path}</p>
                                    <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold dark:text-gray-200 dark:bg-bodybg">
                                        {page.active_users} active
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm text-center py-4 dark:text-gray-200 dark:bg-bodybg">No active pages</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-200 dark:bg-bodybg">Events Timeline</h3>
                    {realtimeData.events_timeline.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={realtimeData.events_timeline}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="minute" stroke="#6B7280" fontSize={10} angle={-45} textAnchor="end" height={80} />
                                <YAxis stroke="#6B7280" fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-500 text-sm text-center py-8 dark:text-gray-200 dark:bg-bodybg">No events in timeline</p>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-200 dark:bg-bodybg">Recent Events</h3>
                {realtimeData.recent_events.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-200 dark:bg-bodybg">Event</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-200 dark:bg-bodybg">Page</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-200 dark:bg-bodybg ">Device</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-200 dark:bg-bodybg">Time</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {realtimeData.recent_events.slice(0, 10).map((event, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors dark:text-gray-200 dark:bg-bodybg">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200 dark:bg-bodybg">{event.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-xs dark:text-gray-200 dark:bg-bodybg">{event.page_path}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 capitalize dark:text-gray-200 dark:bg-bodybg">{event.device_type || 'Unknown'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-200 dark:bg-bodybg">{new Date(event.created_at).toLocaleTimeString()}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm text-center py-8 dark:text-gray-200 dark:bg-bodybg">No recent events</p>
                )}
            </div>

            {realtimeData.active_users_by_company && realtimeData.active_users_by_company.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-200 dark:bg-bodybg">Active Users by Company</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 dark:text-gray-200 dark:bg-bodybg">
                        {realtimeData.active_users_by_company.map((company, index) => (
                            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                                <p className="font-semibold text-gray-900 mb-3 dark:text-gray-200 dark:bg-bodybg" >{company.company_name}</p>
                                <div className="flex flex-wrap gap-2 dark:text-gray-200 dark:bg-bodybg">
                                    {company.users.map((user, userIndex) => (
                                        <div key={userIndex} className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                                            <Avatar avatar={user.avatar} />
                                            <span className="text-sm text-gray-700 dark:text-gray-200 dark:bg-bodybg">{user.full_name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(RealtimeTab);