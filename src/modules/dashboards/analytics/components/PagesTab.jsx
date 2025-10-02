import React, { memo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RefreshCw, XCircle, Eye, Users, Clock, FileText } from 'lucide-react';
import StatCard from './StatCard';
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import EmptyState from "@components/EmptyState.jsx";

const PagesTab = ({ pageData, pageLoading, refetchPage, selectedPage, setSelectedPage }) => {
    const [inputValue, setInputValue] = useState(selectedPage);

    if (pageLoading) return <LoadingSpinner />;
    if (!pageData) return <EmptyState icon={XCircle} heading="Pages Data" description="No page data available" />;

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-200 dark:bg-bodybg">Select Page</label>
                <div className="flex space-x-3">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:text-gray-200 dark:bg-bodybg"
                        placeholder="Enter page path (e.g., /home)"
                    />
                    <button
                        onClick={() => {
                            setSelectedPage(inputValue);
                            refetchPage();
                        }}
                        className="px-6 py-2 bg-info text-white rounded-lg hover:bg-info transition-colors flex items-center space-x-2 dark:text-gray-200 dark:bg-bodybg"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 dark:text-gray-200 dark:bg-bodybg">
                <StatCard title="Total Views" value={pageData.metrics.total_views} icon={Eye} />
                <StatCard title="Unique Visitors" value={pageData.metrics.unique_visitors} icon={Users} />
                <StatCard title="Avg. Time on Page" value={`${pageData.metrics.avg_time_on_page}s`} icon={Clock} />
                <StatCard title="Entries" value={pageData.metrics.entries} icon={FileText} />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 dark:text-gray-200 dark:bg-bodybg">Daily Trend for {pageData.page_path}</h3>
                {pageData.daily_trend.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={pageData.daily_trend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                            <YAxis stroke="#6B7280" fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
                            <Legend />
                            <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6' }} name="Views" />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-gray-500 text-sm text-center py-8 dark:text-gray-200 dark:bg-bodybg">No trend data available</p>
                )}
            </div>
        </div>
    );
};

export default memo(PagesTab);
