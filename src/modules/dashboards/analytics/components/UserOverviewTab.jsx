import React, { memo } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Activity, Eye, Clock, FileText, Target, UserPlus, UserCheck, LogIn, LogOut, RefreshCw, XCircle } from 'lucide-react';
import StatCard from './StatCard';
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import EmptyState from "@components/EmptyState.jsx";

const UserOverviewTab = ({ userOverviewData, userOverviewLoading, refetchUserOverview, selectedCompany, setSelectedCompany, selectedUser, setSelectedUser }) => {
    if (userOverviewLoading) return <LoadingSpinner />;
    if (!userOverviewData) return <EmptyState icon={Users} heading="User Overview" description="No user data available" />;

    const { overview, engagement, top_users, company_breakdown, activity_timeline, user_journey,
        session_quality, top_pages_by_users, retention, peak_hours, user_types } = userOverviewData;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 dark:text-gray-200 dark:bg-bodybg">
                <StatCard
                    title="Total Users"
                    value={overview?.total_users?.value}
                    change={overview?.total_users?.change}
                    icon={Users}
                />
                <StatCard
                    title="Total Sessions"
                    value={overview?.total_sessions?.value}
                    change={overview?.total_sessions?.change}
                    icon={Activity}
                />
                <StatCard
                    title="Page Views"
                    value={overview?.total_page_views?.value}
                    icon={Eye}
                />
                <StatCard
                    title="Avg. Session Duration"
                    value={`${overview?.avg_session_duration?.value}s`}
                    change={overview?.avg_session_duration?.change}
                    icon={Clock}
                />
                <StatCard
                    title="Pages per Session"
                    value={overview?.avg_pages_per_session?.value}
                    icon={FileText}
                />
                <StatCard
                    title="Engagement Rate"
                    value={`${overview?.engagement_rate?.value}%`}
                    icon={Target}
                    subtitle="Sessions > 30s"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 dark:text-gray-200 dark:bg-bodybg">New vs Returning Users</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-success/10 border-success rounded-lg dark:text-gray-200 dark:bg-bodybg border border-gray-200">
                            <div className="flex items-center space-x-3">
                                <UserPlus className="w-6 h-6 text-success" />
                                <span className="font-medium text-gray-900 dark:text-gray-200 dark:bg-bodybg">New Users</span>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-200 dark:bg-bodybg ">{user_types?.new_users}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-200 dark:bg-bodybg ">{user_types?.new_user_percentage}%</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-info/10 border-info rounded-lg border border-gray-200 dark:text-gray-200 dark:bg-bodybg ">
                            <div className="flex items-center space-x-3">
                                <UserCheck className="w-6 h-6 text-blue-600" />
                                <span className="font-medium text-gray-900 dark:text-gray-200 dark:bg-bodybg " >Returning Users</span>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-200 dark:bg-bodybg ">{user_types?.returning_users}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-200 dark:bg-bodybg ">{100 - (user_types?.new_user_percentage || 0)}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg ">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 dark:text-gray-200 dark:bg-bodybg ">User Retention</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center dark:text-gray-200 dark:bg-bodybg ">
                            <span className="text-sm text-gray-600 dark:text-gray-200 dark:bg-bodybg ">First Period Users</span>
                            <span className="font-semibold text-gray-900 dark:text-gray-200 dark:bg-bodybg ">{retention?.first_period_users}</span>
                        </div>
                        <div className="flex justify-between items-center dark:text-gray-200 dark:bg-bodybg ">
                            <span className="text-sm text-gray-600 dark:text-gray-200 dark:bg-bodybg ">Second Period Users</span>
                            <span className="font-semibold text-gray-900 dark:text-gray-200 dark:bg-bodybg ">{retention?.second_period_users}</span>
                        </div>
                        <div className="flex justify-between items-center dark:text-gray-200 dark:bg-bodybg ">
                            <span className="text-sm text-gray-600 dark:text-gray-200 dark:bg-bodybg ">Retained Users</span>
                            <span className="font-semibold text-gray-900 dark:text-gray-200 dark:bg-bodybg ">{retention?.retained_users}</span>
                        </div>
                        <div className="pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-200 dark:bg-bodybg ">Retention Rate</span>
                                <span className="text-2xl font-bold text-primary dark:text-gray-200 dark:bg-bodybg ">{retention?.retention_rate}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-primary h-3 rounded-full transition-all duration-300"
                                    style={{ width: `${retention?.retention_rate}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg ">
                <div className="flex items-center justify-between mb-6 dark:text-gray-200 dark:bg-bodybg ">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 dark:bg-bodybg ">User Activity Timeline</h3>
                    <button
                        onClick={() => refetchUserOverview()}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-200 dark:bg-bodybg "
                    >
                        <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-200 dark:bg-bodybg " />
                    </button>
                </div>
                {activity_timeline && activity_timeline.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={activity_timeline}>
                            <defs>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey={activity_timeline[0]?.date ? "date" : "time"} stroke="#6B7280" fontSize={12} />
                            <YAxis stroke="#6B7280" fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
                            <Legend />
                            <Area type="monotone" dataKey="unique_users" stroke="#3B82F6" fillOpacity={1} fill="url(#colorUsers)" name="Unique Users" />
                            <Area type="monotone" dataKey="total_events" stroke="#10B981" fillOpacity={1} fill="url(#colorEvents)" name="Total Events" />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-gray-500 text-sm text-center py-8 dark:text-gray-200 dark:bg-bodybg ">No activity data available</p>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg ">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 dark:text-gray-200 dark:bg-bodybg ">Engagement Metrics</h3>
                    <div className="space-y-4 dark:text-gray-200 dark:bg-bodybg ">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:text-gray-200 dark:bg-bodybg border border-gray-200 ">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 dark:bg-bodybg ">Events per Session</span>
                            <span className="text-xl font-bold text-gray-900 dark:text-gray-200 dark:bg-bodybg ">{engagement?.events_per_session}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:text-gray-200 dark:bg-bodybg border border-gray-200">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 dark:bg-bodybg ">Sessions per User</span>
                            <span className="text-xl font-bold text-gray-900 dark:text-gray-200 dark:bg-bodybg ">{engagement?.sessions_per_user}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:text-gray-200 dark:bg-bodybg border border-gray-200 ">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 dark:bg-bodybg " >Avg. Active Days</span>
                            <span className="text-xl font-bold text-gray-900 dark:text-gray-200 dark:bg-bodybg ">{engagement?.avg_active_days}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6  dark:text-gray-200 dark:bg-bodybg ">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 dark:text-gray-200 dark:bg-bodybg">Session Quality</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-success/10 rounded-lg border border-success dark:text-gray-200 dark:bg-bodybg">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-success dark:text-gray-200 dark:bg-bodybg">Quality Sessions</span>
                                <span className="text-lg font-bold text-success dark:text-gray-200 dark:bg-bodybg">{session_quality?.quality_sessions}</span>
                            </div>
                            <div className="w-full bg-success/10 rounded-full h-2">
                                <div
                                    className="bg-success h-2 rounded-full"
                                    style={{ width: `${session_quality?.quality_rate}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-success mt-1">{session_quality?.quality_rate}% of total</p>
                        </div>
                        <div className="p-4 bg-danger/10 rounded-lg border border-danger">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-danger">Bounce Sessions</span>
                                <span className="text-lg font-bold text-danger">{session_quality?.bounce_sessions}</span>
                            </div>
                            <div className="w-full bg-danger/10 rounded-full h-2">
                                <div
                                    className="bg-danger h-2 rounded-full"
                                    style={{ width: `${session_quality?.bounce_rate}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-danger mt-1">{session_quality?.bounce_rate}% of total</p>
                        </div>
                    </div>
                </div>
            </div>

            {peak_hours && peak_hours.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg ">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 dark:text-gray-200 dark:bg-bodybg ">Peak Activity Hours</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={peak_hours}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB"/>
                            <XAxis dataKey="hour" stroke="#6B7280" fontSize={12}/>
                            <YAxis stroke="#6B7280" fontSize={12}/>
                            <Tooltip/>
                            <Legend />
                            <Bar dataKey="sessions" fill="#3B82F6" radius={[8, 8, 0, 0]} name="Sessions"/>
                            <Bar dataKey="users" fill="#10B981" radius={[8, 8, 0, 0]} name="Users"/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg ">
                    <div className="flex items-center space-x-2 mb-4">
                        <LogIn className="w-5 h-5 text-success" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 dark:bg-bodybg ">Top Entry Pages</h3>
                    </div>
                    <div className="space-y-2">
                        {user_journey?.entry_pages?.slice(0, 8).map((page, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors dark:text-gray-200 dark:bg-bodybg border border-gray-200" >
                                <p className="text-sm font-medium text-gray-900 truncate flex-1 dark:text-gray-200 dark:bg-bodybg">{page.page_path}</p>
                                <span className="ml-4 px-3 py-1 bg-success/10 text-success rounded-full text-xs font-semibold dark:text-gray-200 dark:bg-bodybg ">
                                    {page.entries}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
                    <div className="flex items-center space-x-2 mb-4">
                        <LogOut className="w-5 h-5 text-danger" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 dark:bg-bodybg">Top Exit Pages</h3>
                    </div>
                    <div className="space-y-2">
                        {user_journey?.exit_pages?.slice(0, 8).map((page, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors dark:text-gray-200 dark:bg-bodybg border border-gray-200">
                                <p className="text-sm font-medium text-gray-900 truncate flex-1 dark:text-gray-200 dark:bg-bodybg">{page.page_path}</p>
                                <span className="ml-4 px-3 py-1 bg-danger/10 text-danger rounded-full text-xs font-semibold dark:text-gray-200 dark:bg-bodybg">
                                    {page.exits}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-200 dark:bg-bodybg">Most Popular Pages</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-200 dark:bg-bodybg">Page</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-200 dark:bg-bodybg">Unique Users</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-200 dark:bg-bodybg">Total Views</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-200 dark:bg-bodybg">Avg. Time</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:text-gray-200 dark:bg-bodybg">
                        {top_pages_by_users?.slice(0, 10).map((page, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors dark:text-gray-200 dark:bg-bodybg">
                                <td className="px-4 py-3 text-sm text-gray-900 truncate max-w-xs dark:text-gray-200 dark:bg-bodybg">{page.page_path}</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-200 dark:bg-bodybg">{page.unique_users}</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-200 dark:bg-bodybg">{page.total_views}</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-200 dark:bg-bodybg">{page.avg_time ? `${page.avg_time.toFixed(1)}s` : 'N/A'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {company_breakdown && company_breakdown.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
                    <div className="flex items-center justify-between mb-6 dark:text-gray-200 dark:bg-bodybg">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 dark:bg-bodybg">Company Breakdown</h3>
                        {selectedCompany && (
                            <button
                                onClick={() => setSelectedCompany(null)}
                                className="p-2 hover:bg-danger/10 rounded-lg transition-colors dark:text-gray-200 dark:bg-bodybg"
                            >
                                <XCircle className="w-4 h-4 text-red"/>
                            </button>
                        )}
                    </div>
                    <div className="overflow-x-auto dark:text-gray-200 dark:bg-bodybg">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-200 dark:bg-bodybg">Company</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-200 dark:bg-bodybg">Users</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-200 dark:bg-bodybg">Sessions</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-200 dark:bg-bodybg">Page Views</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-200 dark:bg-bodybg">Avg. Duration</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-200 dark:bg-bodybg">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:text-gray-200 dark:bg-bodybg">
                            {company_breakdown.map((company, index) => (
                                <tr key={index} className={`hover:bg-gray-50 transition-colors dark:text-gray-200 dark:bg-bodybg ${selectedCompany === company.company_id ? 'bg-primary/10' : ''}`}>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-200 dark:bg-bodybg">{company.company_name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-200 dark:bg-bodybg">{company.total_users}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-200 dark:bg-bodybg">{company.total_sessions}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-200 dark:bg-bodybg">{company.total_page_views}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-200 dark:bg-bodybg">{company.avg_duration}s</td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => setSelectedCompany(company.company_id)}
                                            className="text-xs px-3 py-1 bg-info/10 text-info rounded-full hover:bg-info hover:text-white transition-colors "
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
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
                <div className="flex items-center justify-between space-x-2 mb-6 dark:text-gray-200 dark:bg-bodybg">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 dark:bg-bodybg">Most Active Users</h3>
                    {selectedUser && (
                        <button
                            onClick={() => setSelectedUser(null)}
                            className="p-2 hover:bg-danger/10 rounded-lg transition-colors"
                        >
                            <XCircle className="w-4 h-4 text-red"/>
                        </button>
                    )}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-200 dark:bg-bodybg">User</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-200 dark:bg-bodybg">Company</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-200 dark:bg-bodybg">Sessions</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-200 dark:bg-bodybg">Page Views</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-200 dark:bg-bodybg">Events</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-200 dark:bg-bodybg">Avg. Duration</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-200 dark:bg-bodybg">Last Active</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:text-gray-200 dark:bg-bodybg">
                        {top_users?.map((user, index) => (
                            <tr key={index} className={`hover:bg-gray-50 transition-colors ${selectedUser === user.user_id ? 'bg-primary/10' : ''}`}>
                                <td className="px-4 py-3">
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-200 dark:bg-bodybg">
                                        {user.full_name}
                                        <button
                                            onClick={() => setSelectedUser(user.user_id)}
                                            className="ml-2 text-xs px-3 py-1 bg-info/10 text-info rounded-full hover:bg-info hover:text-white transition-colors"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-200 dark:bg-bodybg">{user.email}</div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-200 dark:bg-bodybg">{user.company || 'N/A'}</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-200 dark:bg-bodybg">{user.total_sessions}</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-200 dark:bg-bodybg">{user.total_page_views}</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-200 dark:bg-bodybg">{user.total_events}</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-200 dark:bg-bodybg">{user.avg_duration}s</td>
                                <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-200 dark:bg-bodybg">
                                    {user.last_active ? new Date(user.last_active).toLocaleString() : 'N/A'}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {engagement?.event_types && engagement.event_types.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 dark:text-gray-200 dark:bg-bodybg">Event Types Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={engagement.event_types}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB"/>
                            <XAxis dataKey="name" stroke="#6B7280" fontSize={12}/>
                            <YAxis stroke="#6B7280" fontSize={12}/>
                            <Tooltip/>
                            <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]}/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default memo(UserOverviewTab);