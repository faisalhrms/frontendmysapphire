import React, {useCallback, useEffect, useMemo, useState} from "react";
import EquipmentDashboardFilter from "@modules/dashboards/eq/components/EquipmentDashboardFilter.jsx";
import useFilters from "@hooks/useFilters.js";
import HasPermission from "@components/HasPermission.jsx";
import {useSelector} from "react-redux";
import {useSearchParams} from "react-router-dom";
import {
    Activity, AlertCircle, Award,
    BarChart3,
    Building2, Calendar,
    DollarSign,
    Grid,
    Layers, MapPin,
    Package, Shield,
    TrendingDown,
    TrendingUp,
    Users,
    Wrench
} from "lucide-react";
import StatCard from "@modules/dashboards/analytics/components/StatCard.jsx";
import ReChart from "@components/charts/ReChart.jsx";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";
import {DEFAULT_CHART_COLORS} from "@helpers/styles.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const EquipmentDashboard = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const companyId = useSelector((state) => state.auth.user.employee.company.id);

    const initialFilters = useMemo(() => {
        const params = Object.fromEntries(searchParams.entries());
        return {
            company_id: params.company_id || companyId,
            department_id: params.department_id || "",
            location_id: params.location_id || "",
            equipment_site_id: params.equipment_site_id || "",
            equipment_type_id: params.equipment_type_id || "",
            status: params.status || "",
            custodian_id: params.custodian_id || ""
        };
    }, [searchParams, companyId]);

    const {
        control,
        handleSubmit,
        errors,
        getFilters,
        resetFilters
    } = useFilters(
        useMemo(() => ({
            initialFilters: [
                { name: 'company_id', defaultValue: initialFilters.company_id },
                { name: 'department_id', defaultValue: initialFilters.department_id },
                { name: 'location_id', defaultValue: initialFilters.location_id },
                { name: 'equipment_site_id', defaultValue: initialFilters.equipment_site_id },
                { name: 'equipment_type_id', defaultValue: initialFilters.equipment_type_id },
                { name: 'status', defaultValue: initialFilters.status },
                { name: 'custodian_id', defaultValue: initialFilters.custodian_id }
            ],
        }), [initialFilters])
    );

    const [filters, setFilters] = useState(getFilters());

    const onSubmit = useCallback((formData) => {
        setFilters(formData);
    }, []);

    useEffect(() => {
        resetFilters(initialFilters);
        setFilters(initialFilters);
    }, [initialFilters, resetFilters]);

    const tabs = [
        { id: "overview", label: "Overview", icon: Grid },
        { id: "analytics", label: "Analytics", icon: BarChart3 },
        { id: "repairs", label: "Repairs & Maintenance", icon: Wrench },
        { id: "custodians", label: "Custodians", icon: Users }
    ];

    const { data: dashboardData, isLoading } = useFetchWithFilters('/dashboard/equipment/', filters);
    const [activeTab, setActiveTab] = useState("overview");
    const [selectedMetric, setSelectedMetric] = useState("by_type");

    const COLORS = DEFAULT_CHART_COLORS;

    const metrics = [
        { key: "by_type", label: "Equipment Types", icon: Layers},
        { key: "by_status", label: "Status", icon: Activity, chartType: "pie" },
        { key: "by_department", label: "Departments", icon: Users, chartType: "bar" },
        { key: "by_site", label: "Sites", icon: MapPin, chartType: "bar" },
        { key: "by_location", label: "Physical Location", icon: MapPin, chartType: "bar" },
        { key: "value_analytics", label: "Value Ranges", icon: DollarSign, chartType: "pie" },
        { key: "warranty_status", label: "Warranty Status", icon: Shield, chartType: "pie" },
        { key: "age_distribution", label: "Age Distribution", icon: Calendar, chartType: "bar" }
    ];

    const summary = useMemo(() => dashboardData?.summary ?? null, [dashboardData]);
    const costTrends = useMemo(() => dashboardData?.cost_trends ?? null, [dashboardData]);
    const repairAnalytics = useMemo(() => dashboardData?.repair_analytics ?? null, [dashboardData]);
    const recentEquipment = useMemo(() => dashboardData?.recent_equipment ?? [], [dashboardData]);
    const monthlyPurchases = useMemo(() => dashboardData?.monthly_purchases ?? [], [dashboardData]);
    const topEquipmentTypes = useMemo(() => dashboardData?.top_equipment_types ?? [], [dashboardData]);
    const custodianAnalysis = useMemo(() => dashboardData?.custodian_analysis ?? [], [dashboardData]);
    const byStatus = useMemo(() => dashboardData?.by_status ?? [], [dashboardData]);
    const bySite = useMemo(() => dashboardData?.by_site ?? [], [dashboardData]);

    const currentData = useMemo(() => {
        if (!dashboardData || !dashboardData[selectedMetric]) return [];
        return dashboardData[selectedMetric];
    }, [dashboardData, selectedMetric]);

    const total = useMemo(
        () => currentData.reduce((sum, item) => sum + (Number(item.value) || 0), 0),
        [currentData]
    );

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6 pb-8 pt-8">
            <div
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2">
                                <BarChart3 size={28}/>
                            </div>
                            <div>
                                <h1 className="font-bold text-2xl text-gray-900 dark:text-white">Equipment Asset
                                    Dashboard</h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive equipment
                                    analytics and asset management insights</p>
                            </div>
                        </div>
                    </div>
                </div>
                <HasPermission permission='auth.equipment_dashboard_filters'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <EquipmentDashboardFilter control={control} errors={errors}/>
                    </form>
                </HasPermission>
                {/* Tabs */}
                <div className="mt-4 flex gap-2 border-t border-gray-200 pt-4 dark:border-gray-700 overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all border ${
                                    activeTab === tab.id
                                        ? "bg-primary/10 text-primary border-primary/30 shadow-md"
                                        : "bg-white text-gray-700 border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800"
                                }`}
                            >
                                <Icon size={18}/>
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

                {activeTab === "overview" && summary && (
                    <div className="space-y-6">
                        {/* Primary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                icon={Package}
                                title="Total Equipment"
                                value={summary.total_equipment || 0}
                                subtitle={`${summary.active_equipment || 0} active • ${summary.faulty_equipment || 0} faulty`}
                            />
                            <StatCard
                                icon={DollarSign}
                                title="Total Asset Value"
                                value={`PKR ${((summary.total_value || 0) / 1000000).toFixed(1)}M`}
                                subtitle={`Avg: PKR ${((summary.average_value || 0) / 1000).toFixed(0)}K`}
                            />
                            <StatCard
                                icon={Building2}
                                title="Total Sites"
                                value={summary.total_sites || 0}
                                subtitle={`${summary.total_departments || 0} departments`}
                            />
                            <StatCard
                                icon={Layers}
                                title="Equipment Types"
                                value={summary.total_types || 0}
                                subtitle={`${summary.unassigned_equipment || 0} unassigned`}
                            />
                        </div>

                        {/* Cost Trends & Alerts */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Cost Trends */}
                            {costTrends && (
                                <div
                                    className="bg-primary-gradient rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-white-900">Cost
                                            Trends</h3>
                                        {costTrends.trend === 'up' ? (
                                            <TrendingUp className="text-danger" size={24}/>
                                        ) : (
                                            <TrendingDown className="text-success" size={24}/>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-white-600">{costTrends.current_month.label}</p>
                                            <p className="text-2xl font-bold text-white-900">
                                                PKR {(costTrends.current_month.total || 0).toLocaleString()}
                                            </p>
                                            <p className="text-xs text-white-500">
                                                {costTrends.current_month.count} purchases
                                            </p>
                                        </div>
                                        <div className="pt-4 border-t border-white-200">
                                            <p className="text-sm text-white-600">{costTrends.last_month.label}</p>
                                            <p className="text-xl font-semibold text-white-700">
                                                PKR {(costTrends.last_month.total || 0).toLocaleString()}
                                            </p>
                                            <p className="text-xs text-white-500">
                                                {costTrends.last_month.count} purchases
                                            </p>
                                        </div>
                                        <div className={`flex items-center gap-2 pt-2 ${
                                            costTrends.trend === 'up' ? 'text-success' : 'text-danger'
                                        }`}>
                                            {costTrends.trend === 'up' ? <TrendingUp size={16}/> :
                                                <TrendingDown size={16}/>}
                                            <span className="text-sm font-medium">
                                            {Math.abs(costTrends.change_percentage)}% vs last month
                                        </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Warranties */}
                            <div
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white flex items-center gap-2">
                                    <Shield size={20}/>
                                    Warranty Status
                                </h3>
                                <div className="space-y-4">
                                    <div
                                        className="flex items-center justify-between p-3 bg-success/10 border border-success rounded-lg">
                                        <span
                                            className="text-sm font-medium text-gray-900 dark:text-white">Active</span>
                                        <span
                                            className="text-lg font-bold text-success">{summary.total_equipment - summary.expired_warranties - summary.expiring_soon}</span>
                                    </div>
                                    <div
                                        className="flex items-center justify-between p-3 bg-warning/10 border border-warning rounded-lg">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">Expiring Soon</span>
                                        <span
                                            className="text-lg font-bold text-warning">{summary.expiring_soon || 0}</span>
                                    </div>
                                    <div
                                        className="flex items-center justify-between p-3 bg-danger/10 border border-danger rounded-lg">
                                        <span
                                            className="text-sm font-medium text-gray-900 dark:text-white">Expired</span>
                                        <span
                                            className="text-lg font-bold text-danger">{summary.expired_warranties || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Repairs */}
                            {repairAnalytics && (
                                <div
                                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white flex items-center gap-2">
                                        <Wrench size={20}/>
                                        Repair Overview
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Repairs</p>
                                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{repairAnalytics.total_repairs}</p>
                                        </div>
                                        <div
                                            className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                            <div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">Open</p>
                                                <p className="text-lg font-bold text-danger">{repairAnalytics.open_repairs}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">Closed</p>
                                                <p className="text-lg font-bold text-success">{repairAnalytics.closed_repairs}</p>
                                            </div>
                                        </div>
                                        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Total Cost</p>
                                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                PKR {((repairAnalytics.total_cost || 0) / 1000).toFixed(0)}K
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {byStatus.slice(0, 4).map((status, idx) => (
                                <StatCard
                                    key={idx}
                                    icon={Activity}
                                    title={status.name}
                                    value={status.value}
                                    subtitle={`PKR ${(status.cost / 1000).toFixed(0)}K`}
                                />
                            ))}
                        </div>

                        {/* Top Equipment & Sites */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Top Equipment Types */}
                            <div
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white flex items-center gap-2">
                                    <Layers size={20}/>
                                    Top Equipment Types
                                </h3>
                                <div className="space-y-3">
                                    {topEquipmentTypes.slice(0, 8).map((type, idx) => (
                                        <div key={idx}
                                             className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-700">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900 dark:text-white text-sm">{type.name}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">PKR {(type.cost / 1000).toFixed(0)}K</p>
                                            </div>
                                            <span className="text-lg font-bold">{type.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Top Sites */}
                            <div
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white flex items-center gap-2">
                                    <MapPin size={20}/>
                                    Top Sites by Equipment
                                </h3>
                                <div className="space-y-3">
                                    {bySite.slice(0, 8).map((site, idx) => (
                                        <div key={idx}
                                             className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-700">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900 dark:text-white text-sm">{site.name}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">PKR {(site.cost / 1000).toFixed(0)}K</p>
                                            </div>
                                            <span className="text-lg font-bold">{site.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Monthly Purchases Trend */}
                        {monthlyPurchases.length > 0 && (
                            <div
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white flex items-center gap-2">
                                    <TrendingUp size={20}/>
                                    Monthly Purchases Trend
                                </h3>
                                <div className="h-[350px]">
                                    <ReChart data={monthlyPurchases} dimensions={{height: 450, bottom: 0}}
                                             colors={COLORS}/>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === "analytics" && (
                    <div className="space-y-6">
                        <div
                            className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                            <div
                                className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-wrap gap-4 dark:border-gray-700">
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
                                                        : "bg-white text-gray-700 border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800"
                                                }`}
                                            >
                                                <Icon size={18}/>
                                                {metric.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div
                                        className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-md dark:bg-gray-800 dark:border-gray-700">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
                                            {metrics.find((m) => m.key === selectedMetric)?.label}
                                        </h3>
                                        <ReChart data={currentData}/>
                                    </div>

                                    <div
                                        className="bg-white border border-gray-200 rounded-xl p-5 shadow-md dark:bg-gray-700 dark:border-gray-600">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">Top
                                            Items</h3>
                                        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                                            {currentData.slice(0, 10).map((item, index) => {
                                                const value = Number(item.value) || 0;
                                                const percentage = total ? ((value / total) * 100).toFixed(1) : 0;
                                                return (
                                                    <div key={index}
                                                         className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                                                        <div className="flex items-center justify-between mb-2">
                                                        <span
                                                            className="text-sm font-medium text-gray-900 truncate pr-4 dark:text-white">
                                                            {item.name}
                                                        </span>
                                                            <span
                                                                className="text-sm font-semibold text-blue-600">{value}</span>
                                                        </div>
                                                        {item.cost !== undefined && (
                                                            <p className="text-xs text-gray-600 mb-2 dark:text-gray-400">
                                                                PKR {(item.cost / 1000).toFixed(0)}K
                                                            </p>
                                                        )}
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden dark:bg-gray-600">
                                                                <div
                                                                    className="h-full rounded-full transition-all duration-500"
                                                                    style={{
                                                                        width: `${percentage}%`,
                                                                        backgroundColor: COLORS[index % COLORS.length],
                                                                    }}
                                                                />
                                                            </div>
                                                            <span
                                                                className="text-xs font-medium text-gray-600 dark:text-gray-400 min-w-[50px] text-right">
                                                            {percentage}%
                                                        </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div
                                    className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md dark:bg-gray-700 dark:border-gray-600">
                                    <div className="p-5 border-b border-gray-200 dark:border-gray-600">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Detailed {metrics.find((m) => m.key === selectedMetric)?.label} Data
                                        </h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-max">
                                            <thead className="bg-gray-50 dark:bg-gray-800">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">#</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Name</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Count</th>
                                                {currentData.some(item => item.cost !== undefined) && (
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Value</th>
                                                )}
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Percentage</th>
                                            </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {currentData.map((item, index) => {
                                                const value = Number(item.value) || 0;
                                                const percentage = total ? ((value / total) * 100).toFixed(1) : "0.0";
                                                return (
                                                    <tr key={index}
                                                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{index + 1}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{value}</td>
                                                        {currentData.some(i => i.cost !== undefined) && (
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                                {item.cost !== undefined ? `PKR ${(item.cost / 1000).toFixed(0)}K` : 'N/A'}
                                                            </td>
                                                        )}
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{percentage}%</td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Repairs Tab */}
                {activeTab === "repairs" && repairAnalytics && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                icon={Wrench}
                                title="Total Repairs"
                                value={repairAnalytics.total_repairs}
                                subtitle={`Avg cost: PKR ${(repairAnalytics.average_cost / 1000).toFixed(0)}K`}
                            />
                            <StatCard
                                icon={AlertCircle}
                                title="Open Repairs"
                                value={repairAnalytics.open_repairs}
                                subtitle="Requires attention"
                            />
                            <StatCard
                                icon={Activity}
                                title="In Progress"
                                value={repairAnalytics.in_progress}
                                subtitle="Currently being worked on"
                            />
                            <StatCard
                                icon={DollarSign}
                                title="Total Repair Cost"
                                value={`PKR ${(repairAnalytics.total_cost / 1000).toFixed(0)}K`}
                                subtitle={`${repairAnalytics.closed_repairs} closed`}
                            />
                        </div>

                        <div
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">Most Repaired
                                Equipment Types</h3>
                            <div className="h-[400px]">
                                <ReChart data={repairAnalytics.most_repaired_types}
                                         dimensions={{height: 470, bottom: 0}} colors={COLORS}/>
                            </div>
                        </div>

                        <div
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">Repair Status
                                Breakdown</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {repairAnalytics.by_status.map((status, idx) => (
                                    <div key={idx} className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{status.name}</p>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{status.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Custodians Tab */}
                {activeTab === "custodians" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard
                                icon={Users}
                                title="Total Custodians"
                                value={custodianAnalysis.length}
                                subtitle="Assigned equipment holders"
                            />
                            <StatCard
                                icon={Package}
                                title="Assigned Equipment"
                                value={summary.total_equipment - summary.unassigned_equipment}
                                subtitle={`${summary.unassigned_equipment} unassigned`}
                            />
                            <StatCard
                                icon={Award}
                                title="Top Custodian"
                                value={custodianAnalysis[0]?.value || 0}
                                subtitle={custodianAnalysis[0]?.name || "N/A"}
                            />
                        </div>

                        <div
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">Top Custodians by
                                Equipment Count</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-max">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">#</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Department</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Equipment
                                            Count
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Total
                                            Value
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {custodianAnalysis.map((custodian, idx) => (
                                        <tr key={idx}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{idx + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{custodian.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{custodian.department}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">{custodian.value}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                                                {custodian.cost > 0 ? `PKR ${(custodian.cost / 1000).toFixed(0)}K` : ''}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">Equipment
                                    Distribution by Custodian</h3>
                                <div className="space-y-3">
                                    {custodianAnalysis.slice(0, 10).map((custodian, idx) => {
                                        const totalEquipment = custodianAnalysis.reduce((sum, c) => sum + c.value, 0);
                                        const percentage = ((custodian.value / totalEquipment) * 100).toFixed(1);
                                        return (
                                            <div key={idx} className="p-3 bg-gray-50 rounded-lg dark:bg-gray-700">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{custodian.name}</p>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400">{custodian.department}</p>
                                                    </div>
                                                    <span
                                                        className="text-sm font-bold text-primary">{custodian.value}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="flex-1 bg-gray-200 rounded-full h-2 dark:bg-gray-600">
                                                        <div
                                                            className="h-2 rounded-full bg-primary transition-all"
                                                            style={{width: `${percentage}%`}}
                                                        />
                                                    </div>
                                                    <span
                                                        className="text-xs text-gray-600 dark:text-gray-400">{percentage}%</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">Top Value
                                    Holders</h3>
                                <div className="space-y-3">
                                    {[...custodianAnalysis]
                                        .sort((a, b) => b.cost - a.cost)
                                        .slice(0, 10)
                                        .map((custodian, idx) => (
                                            <div key={idx} className="p-3 bg-gray-50 rounded-lg dark:bg-gray-700">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{custodian.name}</p>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400">{custodian.value} equipment</p>
                                                    </div>
                                                    <span className="text-sm font-bold">
                                                    {custodian.cost > 0 ? `PKR ${(custodian.cost / 1000).toFixed(0)}K` : ''}
                                                </span>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Recent Equipment - Shown on all tabs */}
                {recentEquipment.length > 0 && activeTab === "overview" && (
                    <div
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white flex items-center gap-2">
                            <Package size={20}/>
                            Recently Added Equipment
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-max">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Code</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Description</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Type</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Price</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Custodian</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {recentEquipment.slice(0, 10).map((eq) => (
                                    <tr key={eq.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{eq.code}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{eq.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{eq.type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                            eq.status === 'Functional' ? 'bg-success/10 text-success' :
                                                eq.status === 'Faulty' ? 'bg-danger/10 text-danger' :
                                                    'bg-warning text-warning'
                                        }`}>
                                            {eq.status}
                                        </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                                            {eq.price > 0 ? `PKR ${(eq.price / 1000).toFixed(0)}K` : ''}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{eq.custodian}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
        </div>
    );
}

export default EquipmentDashboard;
