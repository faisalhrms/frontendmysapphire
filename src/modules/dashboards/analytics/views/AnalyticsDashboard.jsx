// import React, { useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
// import {
//     Activity,
//     Users,
//     Eye,
//     Clock,
//     TrendingUp,
//     TrendingDown,
//     Monitor,
//     Smartphone,
//     Tablet,
//     RefreshCw,
//     FileText,
//     XCircle,
//     Target,
//     UserPlus,
//     UserCheck,
//     LogIn,
//     LogOut,
//     Award
// } from 'lucide-react';
// import api from "@config/axiosConfig.js";
// import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
// import Avatar from "@components/Avatar.jsx";
// import LoadingSpinner from "@components/LoadingSpinner.jsx";
// import EmptyState from "@components/EmptyState.jsx";
//
// const AnalyticsDashboard = () => {
//     const [activeTab, setActiveTab] = useState('overview');
//     const [period, setPeriod] = useState('today');
//     const [selectedPage, setSelectedPage] = useState('/module/ess/brand-book');
//     const [selectedCompany, setSelectedCompany] = useState(null);
//     const [selectedUser, setSelectedUser] = useState(null);
//
//     // Fetch dashboard data
//     const { data: dashboardData, isLoading: dashboardLoading, refetch: refetchDashboard } = useQuery({
//         queryKey: ['analytics-dashboard', period],
//         queryFn: async () => {
//             const response = await api.get(`analytics/dashboard/?period=${period}`);
//             return response.data.data;
//         },
//         enabled: activeTab === 'overview',
//         refetchInterval: 60000, // Refresh every minute
//     });
//
//     // Fetch realtime data
//     const { data: realtimeData, isLoading: realtimeLoading, refetch: refetchRealtime } = useQuery({
//         queryKey: ['analytics-realtime'],
//         queryFn: async () => {
//             const response = await api.get('analytics/realtime/?minutes=30');
//             return response.data.data;
//         },
//         enabled: activeTab === 'realtime',
//         refetchInterval: 10000, // Refresh every 10 seconds
//     });
//
//     // Fetch page analytics
//     const { data: pageData, isLoading: pageLoading, refetch: refetchPage } = useQuery({
//         queryKey: ['analytics-page', selectedPage, period],
//         queryFn: async () => {
//             const response = await api.get(`analytics/page/?path=${encodeURIComponent(selectedPage)}&period=${period}`);
//             return response.data.data;
//         },
//         enabled: activeTab === 'pages',
//         refetchInterval: 60000,
//     });
//
//     // Fetch user overview data
//     const { data: userOverviewData, isLoading: userOverviewLoading, refetch: refetchUserOverview } = useQuery({
//         queryKey: ['analytics-user-overview', period, selectedCompany, selectedUser],
//         queryFn: async () => {
//             const companyParam = selectedCompany ? `&company_id=${selectedCompany}` : '';
//             const userParam = selectedUser ? `&user_id=${selectedUser}` : '';
//             const response = await api.get(
//                 `analytics/user-overview/?period=${period}${companyParam}${userParam}`
//             );
//             return response.data.data;
//         },
//         enabled: activeTab === 'users',
//         refetchInterval: 60000,
//     });
//
//     const StatCard = ({ title, value, change, icon: Icon }) => (
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow hover:border-primary">
//             <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center space-x-3">
//                     <div className="p-2 bg-primary/10 rounded-lg">
//                         <Icon className="w-5 h-5 text-primary" />
//                     </div>
//                     <h3 className="text-sm font-medium text-gray-600">{title}</h3>
//                 </div>
//                 {change !== undefined && (
//                     <div className={`flex items-center space-x-1 text-sm font-semibold ${change >= 0 ? 'text-success' : 'text-danger'}`}>
//                         {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
//                         <span>{Math.abs(change)}%</span>
//                     </div>
//                 )}
//             </div>
//             <p className="text-3xl font-bold text-gray-900">{typeof value === 'string' ? value : value.toLocaleString()}</p>
//         </div>
//     );
//
//     const OverviewTab = () => {
//         if (dashboardLoading) return <LoadingSpinner />;
//         if (!dashboardData) return <EmptyState icon={XCircle} heading="Overview Data" description="No data available" />;
//
//         return (
//             <div className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     <StatCard
//                         title="Total Sessions"
//                         value={dashboardData.overview.total_sessions.value}
//                         change={dashboardData.overview.total_sessions.change}
//                         icon={Users}
//                     />
//                     <StatCard
//                         title="Page Views"
//                         value={dashboardData.overview.page_views.value}
//                         change={dashboardData.overview.page_views.change}
//                         icon={Eye}
//                     />
//                     <StatCard
//                         title="Unique Visitors"
//                         value={dashboardData.overview.unique_visitors.value}
//                         change={dashboardData.overview.unique_visitors.change}
//                         icon={Activity}
//                     />
//                     <StatCard
//                         title="Avg. Duration"
//                         value={`${dashboardData.overview.avg_session_duration.value}s`}
//                         change={dashboardData.overview.avg_session_duration.change}
//                         icon={Clock}
//                     />
//                     <StatCard
//                         title="Bounce Rate"
//                         value={`${dashboardData.overview.bounce_rate.value}%`}
//                         change={dashboardData.overview.bounce_rate.change}
//                         icon={TrendingUp}
//                     />
//                     <StatCard
//                         title="Active Users"
//                         value={dashboardData.overview.active_users}
//                         icon={Activity}
//                     />
//                 </div>
//
//                 {/* Traffic Chart */}
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                     <div className="flex items-center justify-between mb-6">
//                         <h3 className="text-lg font-semibold text-gray-900">Traffic Overview</h3>
//                         <button
//                             onClick={() => refetchDashboard()}
//                             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                         >
//                             <RefreshCw className="w-4 h-4 text-gray-600" />
//                         </button>
//                     </div>
//                     <ResponsiveContainer width="100%" height={300}>
//                         <AreaChart data={dashboardData.time_series}>
//                             <defs>
//                                 <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
//                                     <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
//                                     <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
//                                 </linearGradient>
//                                 <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
//                                     <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
//                                     <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
//                                 </linearGradient>
//                             </defs>
//                             <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
//                             <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
//                             <YAxis stroke="#6B7280" fontSize={12} />
//                             <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
//                             <Legend />
//                             <Area type="monotone" dataKey="page_views" stroke="#3B82F6" fillOpacity={1} fill="url(#colorViews)" name="Page Views" />
//                             <Area type="monotone" dataKey="sessions" stroke="#10B981" fillOpacity={1} fill="url(#colorSessions)" name="Sessions" />
//                         </AreaChart>
//                     </ResponsiveContainer>
//                 </div>
//
//                 {/* Top Pages & Traffic Sources */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                         <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
//                         <div className="space-y-3">
//                             {dashboardData.top_pages.slice(0, 5).map((page, index) => (
//                                 <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
//                                      onClick={() => {
//                                          setSelectedPage(page.page_path);
//                                          setActiveTab('pages');
//                                      }}
//                                 >
//                                     <div className="flex-1 min-w-0">
//                                         <p className="text-sm font-medium text-gray-900 truncate">{page.page_path}</p>
//                                         <p className="text-xs text-gray-500">{page.unique_visitors} unique visitors</p>
//                                     </div>
//                                     <span className="ml-4 text-sm font-semibold text-primary">{page.views} views</span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                         <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
//                         <ResponsiveContainer width="100%" height={200}>
//                             <PieChart>
//                                 <Pie
//                                     data={dashboardData.traffic_sources.slice(0, 5)}
//                                     cx="50%"
//                                     cy="50%"
//                                     labelLine={false}
//                                     label={({ source, percent }) => `${source} ${(percent * 100).toFixed(0)}%`}
//                                     outerRadius={80}
//                                     fill="#8884d8"
//                                     dataKey="sessions"
//                                 >
//                                     {dashboardData.traffic_sources.slice(0, 5).map((entry, index) => (
//                                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                                     ))}
//                                 </Pie>
//                                 <Tooltip />
//                             </PieChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </div>
//
//                 {/* Device & Browser Stats */}
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                         <h3 className="text-lg font-semibold text-gray-900 mb-6">Device Breakdown</h3>
//                         <div className="space-y-3">
//                             {dashboardData.device_stats.map((device, index) => {
//                                 const DeviceIcon = device.device_type === 'Desktop' ? Monitor : device.device_type === 'Mobile' ? Smartphone : Tablet;
//                                 const total = dashboardData.device_stats.reduce((sum, d) => sum + d.count, 0);
//                                 const percentage = ((device.count / total) * 100).toFixed(1);
//                                 return (
//                                     <div key={index}
//                                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                                         <div className="flex items-center space-x-3">
//                                             <DeviceIcon className="w-6 h-6 text-gray-600"/>
//                                             <span
//                                                 className="text-sm font-medium text-gray-900 capitalize">{device.device_type || 'Unknown'}</span>
//                                         </div>
//                                         <div className="text-right">
//                                             <p className="text-lg font-bold text-gray-900">{device.count}</p>
//                                             <p className="text-xs text-gray-500">{percentage}%</p>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </div>
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                         <h3 className="text-lg font-semibold text-gray-900 mb-6">Browser Breakdown</h3>
//                         <div className="space-y-3">
//                             {dashboardData.browser_stats.slice(0, 5).map((browser, index) => {
//                                 const total = dashboardData.browser_stats.reduce((sum, b) => sum + b.count, 0);
//                                 const percentage = ((browser.count / total) * 100).toFixed(1);
//                                 return (
//                                     <div key={index}
//                                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                                         <span className="text-sm font-medium text-gray-900">{browser.browser}</span>
//                                         <div className="text-right">
//                                             <p className="text-lg font-bold text-gray-900">{browser.count}</p>
//                                             <p className="text-xs text-gray-500">{percentage}%</p>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </div>
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                         <h3 className="text-lg font-semibold text-gray-900 mb-6">Operating System Breakdown</h3>
//                         <div className="space-y-3">
//                             {dashboardData.os_stats.slice(0, 5).map((os, index) => {
//                                 const total = dashboardData.os_stats.reduce((sum, b) => sum + b.count, 0);
//                                 const percentage = ((os.count / total) * 100).toFixed(1);
//                                 return (
//                                     <div key={index}
//                                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                                         <span className="text-sm font-medium text-gray-900">{os.os}</span>
//                                         <div className="text-right">
//                                             <p className="text-lg font-bold text-gray-900">{os.count}</p>
//                                             <p className="text-xs text-gray-500">{percentage}%</p>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* Events by Category */}
//                 {dashboardData.events_by_category && dashboardData.events_by_category.length > 0 && (
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                         <h3 className="text-lg font-semibold text-gray-900 mb-4">Events by Category</h3>
//                         <ResponsiveContainer width="100%" height={250}>
//                             <BarChart data={dashboardData.events_by_category.slice(0, 10)}>
//                                 <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB"/>
//                                 <XAxis dataKey="category" stroke="#6B7280" fontSize={12}/>
//                                 <YAxis stroke="#6B7280" fontSize={12}/>
//                                 <Tooltip/>
//                                 <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]}/>
//                             </BarChart>
//                         </ResponsiveContainer>
//                     </div>
//                 )}
//             </div>
//         );
//     };
//
//     const RealtimeTab = () => {
//         if (realtimeLoading) return <LoadingSpinner/>;
//         if (!realtimeData) return   <EmptyState icon={XCircle} heading="Real Time Data" description="No real-time data available" />
//         return (
//             <div className="space-y-6">
//                 {/* Active Users Card */}
//                 <div className="bg-primary-gradient rounded-lg shadow-lg p-8 text-white">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <p className="text-blue-100 text-sm font-medium mb-2">Active Users Right Now</p>
//                             <p className="text-5xl font-bold">{realtimeData.active_sessions_count}</p>
//                             <p className="text-blue-100 text-sm mt-2">Last {realtimeData.time_window_minutes} minutes</p>
//                         </div>
//                         <div className="relative">
//                             <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
//                                 <Activity className="w-12 h-12 animate-pulse" />
//                             </div>
//                             <div className="absolute top-0 right-0 w-4 h-4 bg-success rounded-full animate-pulse"></div>
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* Active Pages & Timeline */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                         <div className="flex items-center justify-between mb-4">
//                             <h3 className="text-lg font-semibold text-gray-900">Active Pages</h3>
//                             <button
//                                 onClick={() => refetchRealtime()}
//                                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                             >
//                                 <RefreshCw className="w-4 h-4 text-gray-600" />
//                             </button>
//                         </div>
//                         <div className="space-y-3">
//                             {realtimeData.active_pages.length > 0 ? (
//                                 realtimeData.active_pages.map((page, index) => (
//                                     <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                                         <p className="text-sm font-medium text-gray-900 truncate flex-1">{page.page_path}</p>
//                                         <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
//                                             {page.active_users} active
//                                         </span>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <p className="text-gray-500 text-sm text-center py-4">No active pages</p>
//                             )}
//                         </div>
//                     </div>
//
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                         <h3 className="text-lg font-semibold text-gray-900 mb-4">Events Timeline</h3>
//                         {realtimeData.events_timeline.length > 0 ? (
//                             <ResponsiveContainer width="100%" height={200}>
//                                 <BarChart data={realtimeData.events_timeline}>
//                                     <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
//                                     <XAxis dataKey="minute" stroke="#6B7280" fontSize={10} angle={-45} textAnchor="end" height={80} />
//                                     <YAxis stroke="#6B7280" fontSize={12} />
//                                     <Tooltip />
//                                     <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} />
//                                 </BarChart>
//                             </ResponsiveContainer>
//                         ) : (
//                             <p className="text-gray-500 text-sm text-center py-8">No events in timeline</p>
//                         )}
//                     </div>
//                 </div>
//
//                 {/* Recent Events */}
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Events</h3>
//                     {realtimeData.recent_events.length > 0 ? (
//                         <div className="overflow-x-auto">
//                             <table className="w-full">
//                                 <thead className="bg-gray-50 border-b border-gray-200">
//                                 <tr>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Page</th>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device</th>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
//                                 </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-gray-200">
//                                 {realtimeData.recent_events.slice(0, 10).map((event, index) => (
//                                     <tr key={index} className="hover:bg-gray-50 transition-colors">
//                                         <td className="px-4 py-3 text-sm text-gray-900">{event.name}</td>
//                                         <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-xs">{event.page_path}</td>
//                                         <td className="px-4 py-3 text-sm text-gray-600 capitalize">{event.device_type || 'Unknown'}</td>
//                                         <td className="px-4 py-3 text-sm text-gray-500">{new Date(event.created_at).toLocaleTimeString()}</td>
//                                     </tr>
//                                 ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     ) : (
//                         <p className="text-gray-500 text-sm text-center py-8">No recent events</p>
//                     )}
//                 </div>
//
//                 {/* Active Users by Company */}
//                 {realtimeData.active_users_by_company && realtimeData.active_users_by_company.length > 0 && (
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                         <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Users by Company</h3>
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                             {realtimeData.active_users_by_company.map((company, index) => (
//                                 <div key={index} className="p-4 bg-gray-50 rounded-lg">
//                                     <p className="font-semibold text-gray-900 mb-3">{company.company_name}</p>
//                                     <div className="flex flex-wrap gap-2">
//                                         {company.users.map((user, userIndex) => (
//                                             <div key={userIndex} className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-gray-200">
//                                                 <Avatar avatar={user.avatar} />
//                                                 <span className="text-sm text-gray-700">{user.full_name}</span>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         );
//     };
//
//     const PagesTab = () => {
//         if (pageLoading) return <LoadingSpinner />;
//         if (!pageData) return  <EmptyState icon={XCircle} heading="Pages Data" description="No page data available" />
//
//         return (
//             <div className="space-y-6">
//                 {/* Page Selector */}
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Select Page</label>
//                     <div className="flex space-x-3">
//                         <input
//                             type="text"
//                             value={selectedPage}
//                             onChange={(e) => setSelectedPage(e.target.value)}
//                             className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                             placeholder="Enter page path (e.g., /home)"
//                         />
//                         <button
//                             onClick={() => refetchPage()}
//                             className="px-6 py-2 bg-info text-white rounded-lg hover:bg-info transition-colors flex items-center space-x-2"
//                         >
//                             <RefreshCw className="w-4 h-4" />
//                             <span>Refresh</span>
//                         </button>
//                     </div>
//                 </div>
//
//                 {/* Page Metrics */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                     <StatCard
//                         title="Total Views"
//                         value={pageData.metrics.total_views}
//                         icon={Eye}
//                     />
//                     <StatCard
//                         title="Unique Visitors"
//                         value={pageData.metrics.unique_visitors}
//                         icon={Users}
//                     />
//                     <StatCard
//                         title="Avg. Time on Page"
//                         value={`${pageData.metrics.avg_time_on_page}s`}
//                         icon={Clock}
//                     />
//                     <StatCard
//                         title="Entries"
//                         value={pageData.metrics.entries}
//                         icon={FileText}
//                     />
//                 </div>
//
//                 {/* Daily Trend */}
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-6">Daily Trend for {pageData.page_path}</h3>
//                     {pageData.daily_trend.length > 0 ? (
//                         <ResponsiveContainer width="100%" height={300}>
//                             <LineChart data={pageData.daily_trend}>
//                                 <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
//                                 <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
//                                 <YAxis stroke="#6B7280" fontSize={12} />
//                                 <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
//                                 <Legend />
//                                 <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6' }} name="Views" />
//                             </LineChart>
//                         </ResponsiveContainer>
//                     ) : (
//                         <p className="text-gray-500 text-sm text-center py-8">No trend data available</p>
//                     )}
//                 </div>
//             </div>
//         );
//     };
//
//     const UserOverviewTab = () => {
//         if (userOverviewLoading) return <LoadingSpinner />;
//         if (!userOverviewData) return <EmptyState icon={Users} heading="User Overview" description="No user data available" />;
//
//         const { overview, engagement, top_users, company_breakdown, activity_timeline, user_journey,
//             session_quality, top_pages_by_users, retention, peak_hours, user_types } = userOverviewData;
//
//         return (
//             <div className="space-y-6">
//                 {/* Key Metrics */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     <StatCard
//                         title="Total Users"
//                         value={overview?.total_users?.value}
//                         change={overview?.total_users?.change}
//                         icon={Users}
//                     />
//                     <StatCard
//                         title="Total Sessions"
//                         value={overview?.total_sessions?.value}
//                         change={overview?.total_sessions?.change}
//                         icon={Activity}
//                     />
//                     <StatCard
//                         title="Page Views"
//                         value={overview?.total_page_views?.value}
//                         icon={Eye}
//                     />
//                     <StatCard
//                         title="Avg. Session Duration"
//                         value={`${overview?.avg_session_duration?.value}s`}
//                         change={overview?.avg_session_duration?.change}
//                         icon={Clock}
//                     />
//                     <StatCard
//                         title="Pages per Session"
//                         value={overview?.avg_pages_per_session?.value}
//                         icon={FileText}
//                     />
//                     <StatCard
//                         title="Engagement Rate"
//                         value={`${overview?.engagement_rate?.value}%`}
//                         icon={Target}
//                         subtitle="Sessions > 30s"
//                     />
//                 </div>
//
//                 {/* User Types & Retention */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                         <h3 className="text-lg font-semibold text-gray-900 mb-6">New vs Returning Users</h3>
//                         <div className="space-y-4">
//                             <div className="flex items-center justify-between p-4 bg-success/10 border-success rounded-lg">
//                                 <div className="flex items-center space-x-3">
//                                     <UserPlus className="w-6 h-6 text-success" />
//                                     <span className="font-medium text-gray-900">New Users</span>
//                                 </div>
//                                 <div className="text-right">
//                                     <p className="text-2xl font-bold text-gray-900">{user_types?.new_users}</p>
//                                     <p className="text-xs text-gray-500">{user_types?.new_user_percentage}%</p>
//                                 </div>
//                             </div>
//                             <div className="flex items-center justify-between p-4 bg-info/10 border-info rounded-lg">
//                                 <div className="flex items-center space-x-3">
//                                     <UserCheck className="w-6 h-6 text-blue-600" />
//                                     <span className="font-medium text-gray-900">Returning Users</span>
//                                 </div>
//                                 <div className="text-right">
//                                     <p className="text-2xl font-bold text-gray-900">{user_types?.returning_users}</p>
//                                     <p className="text-xs text-gray-500">{100 - (user_types?.new_user_percentage || 0)}%</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                         <h3 className="text-lg font-semibold text-gray-900 mb-6">User Retention</h3>
//                         <div className="space-y-4">
//                             <div className="flex justify-between items-center">
//                                 <span className="text-sm text-gray-600">First Period Users</span>
//                                 <span className="font-semibold text-gray-900">{retention?.first_period_users}</span>
//                             </div>
//                             <div className="flex justify-between items-center">
//                                 <span className="text-sm text-gray-600">Second Period Users</span>
//                                 <span className="font-semibold text-gray-900">{retention?.second_period_users}</span>
//                             </div>
//                             <div className="flex justify-between items-center">
//                                 <span className="text-sm text-gray-600">Retained Users</span>
//                                 <span className="font-semibold text-gray-900">{retention?.retained_users}</span>
//                             </div>
//                             <div className="pt-4 border-t border-gray-200">
//                                 <div className="flex justify-between items-center mb-2">
//                                     <span className="text-sm font-medium text-gray-900">Retention Rate</span>
//                                     <span className="text-2xl font-bold text-primary">{retention?.retention_rate}%</span>
//                                 </div>
//                                 <div className="w-full bg-gray-200 rounded-full h-3">
//                                     <div
//                                         className="bg-primary h-3 rounded-full transition-all duration-300"
//                                         style={{ width: `${retention?.retention_rate}%` }}
//                                     ></div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* Activity Timeline */}
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                     <div className="flex items-center justify-between mb-6">
//                         <h3 className="text-lg font-semibold text-gray-900">User Activity Timeline</h3>
//                         <button
//                             onClick={() => refetchUserOverview()}
//                             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                         >
//                             <RefreshCw className="w-4 h-4 text-gray-600" />
//                         </button>
//                     </div>
//                     {activity_timeline && activity_timeline.length > 0 ? (
//                         <ResponsiveContainer width="100%" height={300}>
//                             <AreaChart data={activity_timeline}>
//                                 <defs>
//                                     <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
//                                         <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
//                                         <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
//                                     </linearGradient>
//                                     <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
//                                         <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
//                                         <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
//                                     </linearGradient>
//                                 </defs>
//                                 <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
//                                 <XAxis dataKey={activity_timeline[0]?.date ? "date" : "time"} stroke="#6B7280" fontSize={12} />
//                                 <YAxis stroke="#6B7280" fontSize={12} />
//                                 <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
//                                 <Legend />
//                                 <Area type="monotone" dataKey="unique_users" stroke="#3B82F6" fillOpacity={1} fill="url(#colorUsers)" name="Unique Users" />
//                                 <Area type="monotone" dataKey="total_events" stroke="#10B981" fillOpacity={1} fill="url(#colorEvents)" name="Total Events" />
//                             </AreaChart>
//                         </ResponsiveContainer>
//                     ) : (
//                         <p className="text-gray-500 text-sm text-center py-8">No activity data available</p>
//                     )}
//                 </div>
//
//                 {/* Engagement Metrics & Session Quality */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                         <h3 className="text-lg font-semibold text-gray-900 mb-6">Engagement Metrics</h3>
//                         <div className="space-y-4">
//                             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                                 <span className="text-sm font-medium text-gray-700">Events per Session</span>
//                                 <span className="text-xl font-bold text-gray-900">{engagement?.events_per_session}</span>
//                             </div>
//                             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                                 <span className="text-sm font-medium text-gray-700">Sessions per User</span>
//                                 <span className="text-xl font-bold text-gray-900">{engagement?.sessions_per_user}</span>
//                             </div>
//                             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                                 <span className="text-sm font-medium text-gray-700">Avg. Active Days</span>
//                                 <span className="text-xl font-bold text-gray-900">{engagement?.avg_active_days}</span>
//                             </div>
//                         </div>
//                     </div>
//
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                         <h3 className="text-lg font-semibold text-gray-900 mb-6">Session Quality</h3>
//                         <div className="space-y-4">
//                             <div className="p-4 bg-success/10 rounded-lg border border-success">
//                                 <div className="flex justify-between items-center mb-2">
//                                     <span className="text-sm font-medium text-success">Quality Sessions</span>
//                                     <span className="text-lg font-bold text-success">{session_quality?.quality_sessions}</span>
//                                 </div>
//                                 <div className="w-full bg-success/10 rounded-full h-2">
//                                     <div
//                                         className="bg-success h-2 rounded-full"
//                                         style={{ width: `${session_quality?.quality_rate}%` }}
//                                     ></div>
//                                 </div>
//                                 <p className="text-xs text-success mt-1">{session_quality?.quality_rate}% of total</p>
//                             </div>
//                             <div className="p-4 bg-danger/10 rounded-lg border border-danger">
//                                 <div className="flex justify-between items-center mb-2">
//                                     <span className="text-sm font-medium text-danger">Bounce Sessions</span>
//                                     <span className="text-lg font-bold text-danger">{session_quality?.bounce_sessions}</span>
//                                 </div>
//                                 <div className="w-full bg-danger/10 rounded-full h-2">
//                                     <div
//                                         className="bg-danger h-2 rounded-full"
//                                         style={{ width: `${session_quality?.bounce_rate}%` }}
//                                     ></div>
//                                 </div>
//                                 <p className="text-xs text-danger mt-1">{session_quality?.bounce_rate}% of total</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* Peak Activity Hours */}
//                 {peak_hours && peak_hours.length > 0 && (
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                         <h3 className="text-lg font-semibold text-gray-900 mb-6">Peak Activity Hours</h3>
//                         <ResponsiveContainer width="100%" height={250}>
//                             <BarChart data={peak_hours}>
//                                 <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB"/>
//                                 <XAxis dataKey="hour" stroke="#6B7280" fontSize={12}/>
//                                 <YAxis stroke="#6B7280" fontSize={12}/>
//                                 <Tooltip/>
//                                 <Legend />
//                                 <Bar dataKey="sessions" fill="#3B82F6" radius={[8, 8, 0, 0]} name="Sessions"/>
//                                 <Bar dataKey="users" fill="#10B981" radius={[8, 8, 0, 0]} name="Users"/>
//                             </BarChart>
//                         </ResponsiveContainer>
//                     </div>
//                 )}
//
//                 {/* User Journey */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                         <div className="flex items-center space-x-2 mb-4">
//                             <LogIn className="w-5 h-5 text-success" />
//                             <h3 className="text-lg font-semibold text-gray-900">Top Entry Pages</h3>
//                         </div>
//                         <div className="space-y-2">
//                             {user_journey?.entry_pages?.slice(0, 8).map((page, index) => (
//                                 <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//                                     <p className="text-sm font-medium text-gray-900 truncate flex-1">{page.page_path}</p>
//                                     <span className="ml-4 px-3 py-1 bg-success/10 text-success rounded-full text-xs font-semibold">
//                                         {page.entries}
//                                     </span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                         <div className="flex items-center space-x-2 mb-4">
//                             <LogOut className="w-5 h-5 text-danger" />
//                             <h3 className="text-lg font-semibold text-gray-900">Top Exit Pages</h3>
//                         </div>
//                         <div className="space-y-2">
//                             {user_journey?.exit_pages?.slice(0, 8).map((page, index) => (
//                                 <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//                                     <p className="text-sm font-medium text-gray-900 truncate flex-1">{page.page_path}</p>
//                                     <span className="ml-4 px-3 py-1 bg-danger/10 text-danger rounded-full text-xs font-semibold">
//                                         {page.exits}
//                                     </span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* Top Pages by Users */}
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Popular Pages</h3>
//                     <div className="overflow-x-auto">
//                         <table className="w-full">
//                             <thead className="bg-gray-50 border-b border-gray-200">
//                             <tr>
//                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Page</th>
//                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unique Users</th>
//                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Views</th>
//                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg. Time</th>
//                             </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-200">
//                             {top_pages_by_users?.slice(0, 10).map((page, index) => (
//                                 <tr key={index} className="hover:bg-gray-50 transition-colors">
//                                     <td className="px-4 py-3 text-sm text-gray-900 truncate max-w-xs">{page.page_path}</td>
//                                     <td className="px-4 py-3 text-sm text-gray-600">{page.unique_users}</td>
//                                     <td className="px-4 py-3 text-sm text-gray-600">{page.total_views}</td>
//                                     <td className="px-4 py-3 text-sm text-gray-600">{page.avg_time ? `${page.avg_time.toFixed(1)}s` : 'N/A'}</td>
//                                 </tr>
//                             ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//
//                 {/* Company Breakdown */}
//                 {company_breakdown && company_breakdown.length > 0 && (
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                         <div className="flex items-center justify-between mb-6">
//                                 <h3 className="text-lg font-semibold text-gray-900">Company Breakdown</h3>
//                             {
//                                 selectedCompany &&
//                                 <button
//                                     onClick={() => setSelectedCompany(null)}
//                                     className="p-2 hover:bg-danger/10 rounded-lg transition-colors"
//                                 >
//                                     <XCircle className="w-4 h-4 text-red"/>
//                                 </button>
//                             }
//                         </div>
//                         <div className="overflow-x-auto">
//                             <table className="w-full">
//                                 <thead className="bg-gray-50 border-b border-gray-200">
//                                 <tr>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Users</th>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sessions</th>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Page Views</th>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg. Duration</th>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//                                 </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-gray-200">
//                                 {company_breakdown.map((company, index) => (
//                                     <tr key={index} className={`hover:bg-gray-50 transition-colors ${selectedCompany === company.company_id ? 'bg-primary/10' : ''}`}>
//                                         <td className="px-4 py-3 text-sm font-medium text-gray-900">{company.company_name}</td>
//                                         <td className="px-4 py-3 text-sm text-gray-600">{company.total_users}</td>
//                                         <td className="px-4 py-3 text-sm text-gray-600">{company.total_sessions}</td>
//                                         <td className="px-4 py-3 text-sm text-gray-600">{company.total_page_views}</td>
//                                         <td className="px-4 py-3 text-sm text-gray-600">{company.avg_duration}s</td>
//                                         <td className="px-4 py-3">
//                                             <button
//                                                 onClick={() => setSelectedCompany(company.company_id)}
//                                                 className="text-xs px-3 py-1 bg-info/10 text-info rounded-full hover:bg-info hover:text-white transition-colors"
//                                             >
//                                                 View Details
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 )}
//
//                 {/* Top Users */}
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                     <div className="flex items-center justify-between space-x-2 mb-6">
//                         <h3 className="text-lg font-semibold text-gray-900">Most Active Users</h3>
//                         {
//                             selectedUser &&
//                             <button
//                                 onClick={() => setSelectedUser(null)}
//                                 className="p-2 hover:bg-danger/10 rounded-lg transition-colors"
//                             >
//                                 <XCircle className="w-4 h-4 text-red"/>
//                             </button>
//                         }
//                     </div>
//                     <div className="overflow-x-auto">
//                         <table className="w-full">
//                             <thead className="bg-gray-50 border-b border-gray-200">
//                             <tr>
//                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
//                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
//                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sessions</th>
//                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Page Views</th>
//                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Events</th>
//                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg. Duration</th>
//                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Active</th>
//                             </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-200">
//                             {top_users?.map((user, index) => (
//                                 <tr key={index} className={`hover:bg-gray-50 transition-colors ${selectedUser === user.user_id ? 'bg-primary/10' : ''}`}>
//                                     <td className="px-4 py-3">
//                                         <div className="text-sm font-medium text-gray-900">
//                                             {user.full_name}
//                                             <button
//                                                 onClick={() => setSelectedUser(user.user_id)}
//                                                 className="ml-2 text-xs px-3 py-1 bg-info/10 text-info rounded-full hover:bg-info hover:text-white transition-colors"
//                                             >
//                                                 View Details
//                                             </button>
//                                         </div>
//                                         <div className="text-xs text-gray-500">{user.email}</div>
//                                     </td>
//                                     <td className="px-4 py-3 text-sm text-gray-600">{user.company || 'N/A'}</td>
//                                     <td className="px-4 py-3 text-sm text-gray-600">{user.total_sessions}</td>
//                                     <td className="px-4 py-3 text-sm text-gray-600">{user.total_page_views}</td>
//                                     <td className="px-4 py-3 text-sm text-gray-600">{user.total_events}</td>
//                                     <td className="px-4 py-3 text-sm text-gray-600">{user.avg_duration}s</td>
//                                     <td className="px-4 py-3 text-xs text-gray-500">
//                                         {user.last_active ? new Date(user.last_active).toLocaleString() : 'N/A'}
//                                     </td>
//                                 </tr>
//                             ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//
//                 {/* Event Types Distribution */}
//                 {engagement?.event_types && engagement.event_types.length > 0 && (
//                     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                         <h3 className="text-lg font-semibold text-gray-900 mb-6">Event Types Distribution</h3>
//                         <ResponsiveContainer width="100%" height={300}>
//                             <BarChart data={engagement.event_types}>
//                                 <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB"/>
//                                 <XAxis dataKey="name" stroke="#6B7280" fontSize={12}/>
//                                 <YAxis stroke="#6B7280" fontSize={12}/>
//                                 <Tooltip/>
//                                 <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]}/>
//                             </BarChart>
//                         </ResponsiveContainer>
//                     </div>
//                 )}
//             </div>
//         );
//     };
//
//     return (
//         <div className="min-h-screen">
//             <div className="mx-auto">
//                 <IconPageHeader
//                     heading="Analytics Dashboard"
//                     description="Monitor your website performance and user behavior"
//                     icon={Activity}
//                     headerClasses='font-bold text-[2rem]'
//                 />
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
//                     <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-wrap gap-4">
//                         <div className="flex space-x-1">
//                             <button
//                                 onClick={() => setActiveTab('overview')}
//                                 className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                                     activeTab === 'overview'
//                                         ? 'bg-primary/10 text-primary'
//                                         : 'text-gray-600 hover:bg-gray-50'
//                                 }`}
//                             >
//                                 Overview
//                             </button>
//                             <button
//                                 onClick={() => setActiveTab('realtime')}
//                                 className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
//                                     activeTab === 'realtime'
//                                         ? 'bg-primary/10 text-primary'
//                                         : 'text-gray-600 hover:bg-gray-50'
//                                 }`}
//                             >
//                                 <span>Real-time</span>
//                                 {realtimeData &&
//                                     <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>}
//                             </button>
//                             <button
//                                 onClick={() => setActiveTab('pages')}
//                                 className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                                     activeTab === 'pages'
//                                         ? 'bg-primary/10 text-primary'
//                                         : 'text-gray-600 hover:bg-gray-50'
//                                 }`}
//                             >
//                                 Pages
//                             </button>
//                             <button
//                                 onClick={() => setActiveTab('users')}
//                                 className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                                     activeTab === 'users'
//                                         ? 'bg-primary/10 text-primary'
//                                         : 'text-gray-600 hover:bg-gray-50'
//                                 }`}
//                             >
//                                 Users
//                             </button>
//
//                         </div>
//
//                         {(activeTab === 'overview' || activeTab === 'pages' || activeTab === 'users') && (
//                             <div className="flex space-x-2">
//                                 {['today', 'yesterday', '7d', '30d', '90d', '1y'].map((p) => (
//                                     <button
//                                         key={p}
//                                         onClick={() => setPeriod(p)}
//                                         className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
//                                             period === p
//                                                 ? 'bg-primary text-white'
//                                                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                                         }`}
//                                     >
//                                         {p === 'today'
//                                             ? 'Today'
//                                             : p === 'yesterday'
//                                                 ? 'Yesterday'
//                                                 : p === '7d'
//                                                     ? '7 Days'
//                                                     : p === '30d'
//                                                         ? '30 Days'
//                                                         : p === '90d'
//                                                             ? '90 Days'
//                                                             : '1 Year'}
//                                     </button>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//
//                     <div className="p-6">
//                         {activeTab === 'overview' && <OverviewTab />}
//                         {activeTab === 'realtime' && <RealtimeTab />}
//                         {activeTab === 'pages' && <PagesTab />}
//                         {activeTab === 'users' && <UserOverviewTab />}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
//
// export default AnalyticsDashboard;
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