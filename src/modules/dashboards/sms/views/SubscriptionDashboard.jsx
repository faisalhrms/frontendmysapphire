import React, { useState, useMemo } from "react";
import {
    DollarSign, CreditCard, TrendingUp, TrendingDown,
    Calendar, AlertCircle, Package, Users, Bell,
    RefreshCw, BarChart3, PieChart, Activity, CheckCircle
} from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import StatCard from "@modules/dashboards/analytics/components/StatCard.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import useSubscriptionDashboard from "@modules/dashboards/sms/hooks/subscriptionHook.js";
import ReChart from "@components/charts/ReChart.jsx";
import {DEFAULT_CHART_COLORS} from "@helpers/styles.js";

const SubscriptionDashboard = () => {
    const { dashboardData, loading, refreshData } = useSubscriptionDashboard();
    const [selectedMetric, setSelectedMetric] = useState("by_vendor");

    const COLORS = DEFAULT_CHART_COLORS

    const metrics = [
        { key: "by_vendor", label: "Vendors", icon: Package },
        { key: "by_status", label: "Status", icon: Activity },
        { key: "by_type", label: "Types", icon: PieChart },
        { key: "by_payment_cycle", label: "Payment Cycles", icon: Calendar },
        { key: "by_payment_method", label: "Payment Methods", icon: CreditCard },
        { key: "by_department", label: "Departments", icon: Users },
        { key: "by_payment_status", label: "Payment Status", icon: CheckCircle },
    ];

    const summary = useMemo(() => dashboardData?.summary ?? null, [dashboardData]);
    const costTrends = useMemo(() => dashboardData?.cost_trends ?? null, [dashboardData]);
    const upcomingRenewals = useMemo(() => dashboardData?.upcoming_renewals ?? [], [dashboardData]);
    const monthlySpending = useMemo(() => dashboardData?.monthly_spending ?? [], [dashboardData]);
    const topSpending = useMemo(() => dashboardData?.top_spending ?? [], [dashboardData]);

    const currentData = useMemo(() => {
        if (!dashboardData || !dashboardData[selectedMetric]) return [];
        return dashboardData[selectedMetric];
    }, [dashboardData, selectedMetric]);

    const total = useMemo(
        () => currentData.reduce((sum, item) => sum + (Number(item.value) || 0), 0),
        [currentData]
    );

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-8 px-4 lg:px-0">
            <IconPageHeader
                heading="Subscription Dashboard"
                description="Comprehensive subscription analytics and cost management insights"
                icon={BarChart3}
                headerClasses='font-bold text-[2rem]'
            >
                <button
                    onClick={refreshData}
                    className="p-2.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                    <RefreshCw size={18} className="text-gray-600 dark:text-gray-300" />
                </button>
            </IconPageHeader>

            {/* Summary Stats */}
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={Package}
                        title="Total Subscriptions"
                        value={summary.total_subscriptions || 0}
                        subtitle={`${summary.active_subscriptions || 0} active`}
                    />
                    <StatCard
                        icon={DollarSign}
                        title="Monthly Cost"
                        value={`${(summary.total_monthly_cost || 0).toLocaleString()}`}
                        subtitle={`${((summary.total_annual_cost || 0) / 1000000).toFixed(1)}M yearly`}
                    />
                    <StatCard
                        icon={Calendar}
                        title="Upcoming Renewals"
                        value={summary.upcoming_renewals || 0}
                        subtitle={`${summary.expiring_soon || 0} expiring soon`}
                    />
                    <StatCard
                        icon={AlertCircle}
                        title="Overdue Payments"
                        value={summary.overdue_payments || 0}
                        subtitle={`${summary.total_vendors || 0} vendors`}
                    />
                    <StatCard
                        icon={TrendingUp}
                        title="Average Cost"
                        value={`${(summary.average_cost || 0).toLocaleString()}`}
                        subtitle="Per subscription"
                    />
                    <StatCard
                        icon={CreditCard}
                        title="Payment Status"
                        value={summary.paid_count || 0}
                        subtitle={`${summary.pending_count || 0} pending`}
                    />
                    <StatCard
                        icon={Activity}
                        title="Recent Activity"
                        value={summary.recent_transactions || 0}
                        subtitle={`${(summary.recent_spending || 0).toLocaleString()} spent`}
                    />
                    <StatCard
                        icon={Users}
                        title="Total Vendors"
                        value={summary.total_vendors || 0}
                        subtitle={`${summary.active_subscriptions || 0} subscriptions`}
                    />
                </div>
            )}

            {/* Cost Trends & Recent Activity */}
            {costTrends && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div
                        className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg shadow-lg p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    Cost Trends
                                </h3>
                                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                    {costTrends.trend === 'up' ? (
                                        <TrendingUp className="text-white" size={24}/>
                                    ) : costTrends.trend === 'down' ? (
                                        <TrendingDown className="text-white" size={24}/>
                                    ) : (
                                        <Activity className="text-white" size={24}/>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-white">{costTrends.current_month.label}</p>
                                    <p className="text-4xl font-bold text-white">
                                        {(costTrends.current_month.total || 0).toLocaleString()}
                                    </p>
                                    <p className="text-xs text-white">
                                        {costTrends.current_month.count} transactions
                                    </p>
                                </div>
                                <div
                                    className="pt-4 border-t border-white/30 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                    <p className="text-sm text-white">{costTrends.last_month.label}</p>
                                    <p className="text-2xl font-bold text-white">
                                        {(costTrends.last_month.total || 0).toLocaleString()}
                                    </p>
                                    <p className="text-xs text-white">
                                        {costTrends.last_month.count} transactions
                                    </p>
                                </div>
                                <div className={`flex items-center gap-2 pt-2 bg-white/10 p-2 rounded-lg ${
                                    costTrends.change_percentage > 0 ? 'text-danger' :
                                        costTrends.change_percentage < 0 ? 'text-success' : 'text-white'
                                }`}>
                                    {costTrends.change_percentage > 0 ? <TrendingUp size={16}/> :
                                        <TrendingDown size={16}/>}
                                    <span className="text-sm font-medium">
                                        {Math.abs(costTrends.change_percentage)}% vs last month
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-bodybg dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
                            <Bell className="inline mr-2" size={20}/>
                            Upcoming Renewals
                        </h3>
                        <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2">
                            {upcomingRenewals.slice(0, 5).map((renewal, index) => (
                                <div
                                    key={renewal.id}
                                    className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition-all dark:bg-gray-800 dark:border-gray-700"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-white">{renewal.name}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{renewal.vendor}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {renewal.currency} ${renewal.amount.toLocaleString()}
                                            </p>
                                            <p className={`text-xs font-medium ${
                                                renewal.days_until <= 7 ? 'text-danger' :
                                                    renewal.days_until <= 30 ? 'text-orange-600' : 'text-gray-600'
                                            }`}>
                                                In {renewal.days_until} days
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {upcomingRenewals.length === 0 && (
                                <p className="text-sm text-gray-500 text-center py-8 dark:text-gray-400">
                                    No upcoming renewals
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Distribution Charts */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-bodybg dark:border-gray-700">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-wrap gap-4 ">
                    <div className="flex flex-wrap gap-2">
                        {metrics.map((metric) => {
                            const Icon = metric.icon;
                            const active = selectedMetric === metric.key;
                            return (
                                <button
                                    key={metric.key}
                                    onClick={() => setSelectedMetric(metric.key)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all border ${
                                        active
                                            ? "bg-primary/10 text-primary border-primary/30 shadow-md"
                                            : "bg-white text-gray-700 border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300  dark:text-gray-200 dark:bg-bodybg"
                                    }`}
                                >
                                    <Icon size={18} />
                                    {metric.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Chart */}
                        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow dark:text-gray-200 dark:bg-bodybg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
                                {metrics.find((m) => m.key === selectedMetric)?.label}
                            </h3>
                            <ReChart
                                data={currentData}
                            />
                        </div>

                        {/* Top Items */}
                        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow dark:text-gray-200 dark:bg-bodybg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">Top Items</h3>
                            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                                {currentData.slice(0, 10).map((item, index) => {
                                    const value = Number(item.value) || 0;
                                    const pct = total ? ((value / total) * 100) : 0;
                                    const percentage = pct.toFixed(1);
                                    return (
                                        <div
                                            key={index}
                                            className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all dark:text-gray-200 dark:bg-bodybg"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-900 truncate pr-4 dark:text-white">
                                                    {item.name}
                                                </span>
                                                <span className="text-sm font-semibold text-primary">{value}</span>
                                            </div>
                                            {item.cost !== undefined && (
                                                <p className="text-xs text-gray-600 mb-2 dark:text-gray-400">
                                                    Monthly: {item.cost.toLocaleString()}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden dark:bg-gray-700">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-500"
                                                        style={{
                                                            width: `${percentage}%`,
                                                            backgroundColor: COLORS[index % COLORS.length],
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 min-w-[50px] text-right">
                                                    {percentage}%
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                {currentData.length === 0 && (
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        No data available for this metric.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Table */}
                <div className="p-6">
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow dark:text-gray-200 dark:bg-bodybg">
                        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Detailed {metrics.find((m) => m.key === selectedMetric)?.label} Data
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-max">
                                <thead className="bg-gray-50 border border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">#</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Count</th>
                                    {currentData.some(item => item.cost !== undefined) && (
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Monthly Cost</th>
                                    )}
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Percentage</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Visual</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {currentData.map((item, index) => {
                                    const value = Number(item.value) || 0;
                                    const percentage = total ? ((value / total) * 100).toFixed(1) : "0.0";
                                    return (
                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{value}</td>
                                            {currentData.some(i => i.cost !== undefined) && (
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {item.cost !== undefined ? `${item.cost.toLocaleString()}` : 'N/A'}
                                                </td>
                                            )}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{percentage}%</td>
                                            <td className="px-6 py-4">
                                                <div className="w-40 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                                    <div
                                                        className="h-2.5 rounded-full transition-all duration-500"
                                                        style={{
                                                            width: `${percentage}%`,
                                                            backgroundColor: COLORS[index % COLORS.length],
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {currentData.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No data available for this metric.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Monthly Spending Trend */}
            {monthlySpending.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-bodybg dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
                        <TrendingUp className="inline mr-2" size={20} />
                        Monthly Spending Trend (Last 12 Months)
                    </h3>
                    <div className="overflow-x-auto">
                        <div className="min-w-[600px]">
                            <ReChart
                                data={monthlySpending.map(item => ({
                                    name: item.month,
                                    value: item.amount
                                }))}
                                dimensions={{
                                    height: 300
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Top Spending Subscriptions */}
            {topSpending.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-bodybg dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
                        <DollarSign className="inline mr-2" size={20} />
                        Top 10 Subscriptions by Cost
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-max">
                            <thead className="bg-gray-50 border border-gray-200 dark:text-gray-200 dark:bg-bodybg
">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">#</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Subscription</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Vendor</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Payment Cycle</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Monthly Cost</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Annual Cost</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {topSpending.map((sub, index) => (
                                <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{sub.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{sub.vendor}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{sub.payment_cycle}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                                        {sub.currency} {sub.monthly_cost.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {sub.currency} {sub.annual_cost.toLocaleString()}
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

export default SubscriptionDashboard;