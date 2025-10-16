import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
    Server, HardDrive, Shield, Wifi, Mail, Globe,
    TrendingUp, TrendingDown, Activity, RefreshCw, BarChart3
} from "lucide-react";
import { useEquipmentAudit } from "@modules/dashboards/eq-aud/hooks/useEquipmentAuditHook.js";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import StatCard from "@modules/dashboards/analytics/components/StatCard.jsx";
import ChartByType from "@components/charts/ChartByType.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import ReChart from "@components/charts/ReChart.jsx";

/** --- size tweaks --- **/
const CHART_HEIGHT = 340;
const PIE_RADIUS   = 130;
const XAXIS_HEIGHT = 70;
const XAXIS_ANGLE  = -30;

const EquipmentAuditDashboard = () => {
    const { auditData, loading, refreshData } = useEquipmentAudit();
    const [selectedMetric, setSelectedMetric] = useState("location");

    const COLORS = [
        "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b",
        "#10b981", "#6366f1", "#f97316", "#06b6d4",
        "#14b8a6", "#84cc16", "#a855f7", "#ef4444"
    ];

    const metrics = [
        { key: "location",      label: "Locations",     icon: Globe },
        { key: "device_type",   label: "Device Types",  icon: Server },
        { key: "manufacturer",  label: "Manufacturers", icon: Activity },
        { key: "antivirus",     label: "Antivirus",     icon: Shield },
        { key: "vpn",           label: "VPN Solutions", icon: Wifi },
        { key: "domain_name",   label: "Domains",       icon: Globe },
        { key: "email_server",  label: "Email Servers", icon: Mail },
        { key: "disk_type",     label: "Disk Types",    icon: HardDrive }
    ];

    const summary = useMemo(() => auditData?.summary ?? null, [auditData]);

    const currentData = useMemo(() => {
        if (!auditData || !auditData[selectedMetric]) return [];
        return auditData[selectedMetric];
    }, [auditData, selectedMetric]);

    const total = useMemo(
        () => currentData.reduce((sum, item) => sum + (Number(item.value) || 0), 0),
        [currentData]
    );

    if (loading) {
        return (
            <LoadingSpinner />
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-8 px-4 lg:px-0">
            <IconPageHeader
                heading="Equipment Audit Dashboard"
                headerClasses='font-bold text-[2rem]'
                description="Comprehensive inventory analytics and insights for enterprise asset management"
                icon={BarChart3}
            >
                <button
                    onClick={refreshData}
                    className="p-2.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                    <RefreshCw size={18} className="text-gray-600 dark:text-gray-300" />
                </button>
            </IconPageHeader>

            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard icon={Server}  title="Total Devices"   value={summary.total_devices || 0} />
                    <StatCard icon={Shield}  title="With Antivirus"  value={summary.with_antivirus || 0}
                              change={`${summary.total_devices ? ((summary.with_antivirus / summary.total_devices) * 100).toFixed(1) : 0}`} />
                    <StatCard icon={Wifi}    title="With VPN"        value={summary.with_vpn || 0}
                              change={`${summary.total_devices ? ((summary.with_vpn / summary.total_devices) * 100).toFixed(1) : 0}`} />
                    <StatCard icon={Activity} title="With IP Address" value={summary.with_ip || 0}
                              change={`${summary.total_devices ? ((summary.with_ip / summary.total_devices) * 100).toFixed(1) : 0}`} />
                </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:text-gray-200 dark:bg-bodybg dark:border-gray-700">
                {/* Toolbar: only metric pills. Chart selection lives in global Switcher */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-wrap gap-4 dark:border-gray-700">
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
                                    <Icon size={18} />
                                    {metric.label}
                                </button>
                            );
                        })}
                    </div>

                </div>

                {/* Content: Chart + Top Items */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Chart */}
                        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
                                {metrics.find((m) => m.key === selectedMetric)?.label} Distribution
                            </h3>

                            <ReChart
                                data={currentData}
                            />
                        </div>

                        {/* Top Items */}
                        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">Top Items</h3>
                            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                                {currentData.slice(0, 10).map((item, index) => {
                                    const value = Number(item.value) || 0;
                                    const pct = total ? ((value / total) * 100) : 0;
                                    const percentage = pct.toFixed(1);
                                    return (
                                        <div
                                            key={index}
                                            className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-800"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 truncate pr-4 dark:text-white">
                          {item.name}
                        </span>
                                                <span className="text-sm font-semibold text-primary">{value}</span>
                                            </div>
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
                                    <div className="text-sm text-gray-500 dark:text-gray-400">No data available for this metric.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed table (unchanged) */}
                <div className="p-6">
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Detailed {metrics.find((m) => m.key === selectedMetric)?.label} Data
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-max">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">#</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Count</th>
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
                                        <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
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
        </div>
    );
};

export default EquipmentAuditDashboard;
