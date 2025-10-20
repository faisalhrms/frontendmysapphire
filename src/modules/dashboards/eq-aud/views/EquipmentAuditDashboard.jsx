import React, { useState, useMemo } from "react";
import {
    Monitor, Cpu, HardDrive, MemoryStick, Network, Shield,
    MapPin, Building, RefreshCw, BarChart3, Activity, AlertTriangle,
    CheckCircle, XCircle, TrendingUp, Users, Server
} from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import StatCard from "@modules/dashboards/analytics/components/StatCard.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import ReChart from "@components/charts/ReChart.jsx";
import {DEFAULT_CHART_COLORS} from "@helpers/styles.js";
import {useEquipmentAudit} from "@modules/dashboards/eq-aud/hooks/useEquipmentAuditHook.js";

const EquipmentAuditDashboard = () => {
    const { auditData, loading, refreshData } = useEquipmentAudit();
    const [selectedMetric, setSelectedMetric] = useState("location");

    const COLORS = DEFAULT_CHART_COLORS;

    const metrics = [
        { key: "location", label: "Locations", icon: MapPin },
        { key: "device_type", label: "Device Types", icon: Monitor },
        { key: "manufacturer", label: "Manufacturers", icon: Building },
        { key: "operating_system", label: "Operating Systems", icon: Server },
        { key: "antivirus", label: "Antivirus", icon: Shield },
        { key: "vpn", label: "VPN", icon: Network },
        { key: "domain_name", label: "Domains", icon: Activity },
        { key: "disk_type", label: "Disk Types", icon: HardDrive },
        { key: "cpu_model", label: "CPU", icon: Cpu },
    ];

    const summary = useMemo(() => auditData?.summary ?? {}, [auditData]);
    const deviceHealth = useMemo(() => auditData?.device_health ?? {}, [auditData]);
    const hardwareStats = useMemo(() => auditData?.hardware_stats ?? {}, [auditData]);
    const locationInsights = useMemo(() => auditData?.location_insights ?? [], [auditData]);

    const currentData = useMemo(() => {
        if (!auditData || !auditData[selectedMetric]) return [];
        return auditData[selectedMetric];
    }, [auditData, selectedMetric]);

    const total = useMemo(
        () => currentData.reduce((sum, item) => sum + (Number(item.value) || 0), 0),
        [currentData]
    );

    const dataWithPercentages = useMemo(() => {
        return currentData.map(item => ({
            ...item,
            percentage: total ? ((item.value / total) * 100).toFixed(1) : 0
        }));
    }, [currentData, total]);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-8 px-4 lg:px-0">
            <IconPageHeader
                heading="Equipment Audit Dashboard"
                description="Comprehensive device inventory, hardware analytics, and security compliance insights"
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
                        icon={Monitor}
                        title="Total Devices"
                        value={summary.total_devices || 0}
                        subtitle={`${summary.device_types_count || 0} device types`}
                    />
                    <StatCard
                        icon={Shield}
                        title="Security Score"
                        value={`${deviceHealth.security_score || 0}%`}
                        subtitle={`${summary.with_antivirus || 0} with antivirus`}
                    />
                    <StatCard
                        icon={Network}
                        title="Network Compliance"
                        value={`${deviceHealth.network_compliance || 0}%`}
                        subtitle={`${summary.with_ip || 0} with IP addresses`}
                    />
                    <StatCard
                        icon={MemoryStick}
                        title="Avg RAM"
                        value={`${summary.avg_ram_gb || 0} GB`}
                        subtitle={`Max: ${summary.max_ram_gb || 0} GB`}
                    />
                    <StatCard
                        icon={HardDrive}
                        title="Avg Storage"
                        value={`${summary.avg_disk_gb || 0} GB`}
                        subtitle={`Max: ${summary.max_disk_gb || 0} GB`}
                    />
                    <StatCard
                        icon={Building}
                        title="Locations"
                        value={summary.total_locations || 0}
                        subtitle="Active locations"
                    />
                    <StatCard
                        icon={Users}
                        title="Domain Joined"
                        value={summary.domain_joined || 0}
                        subtitle={`${Math.round((summary.domain_joined / summary.total_devices) * 100) || 0}% of devices`}
                    />
                    <StatCard
                        icon={Activity}
                        title="Hardware Health"
                        value={`${Math.round(
                            (deviceHealth.hardware_health?.ram +
                                deviceHealth.hardware_health?.disk +
                                deviceHealth.hardware_health?.cpu) / 3 || 0
                        )}%`}
                        subtitle="Overall hardware compliance"
                    />
                </div>
            )}

            {/* Device Health & Location Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Security Compliance - Redesigned */}
                <div
                    className="bg-gradient-to-br from-blue to-purple rounded-xl shadow-lg p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -mb-12 -ml-12"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                Security Compliance
                            </h3>
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                <Shield className="text-white" size={24}/>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-white">Overall Security Score</p>
                                <p className="text-4xl font-bold text-white">
                                    {deviceHealth.security_score || 0}%
                                </p>
                                <p className="text-xs text-white">Device protection level</p>
                            </div>
                            <div className="pt-4 border-t border-white/30 grid grid-cols-2 gap-4">
                                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                    <p className="text-xs text-white">Antivirus</p>
                                    <p className="text-2xl font-bold text-white">{summary.with_antivirus || 0}</p>
                                </div>
                                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                    <p className="text-xs text-white">VPN</p>
                                    <p className="text-2xl font-bold text-white">{summary.with_vpn || 0}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-2 text-white bg-white/10 p-2 rounded-lg">
                                <Shield size={16}/>
                                <span className="text-sm font-medium">
                                    {summary.domain_joined || 0} domain joined devices
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hardware Health - Redesigned */}
                <div
                    className="bg-gradient-to-br from-black to-green rounded-xl shadow-lg p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -mb-12 -ml-12"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                Hardware Health
                            </h3>
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                <Activity className="text-white" size={24}/>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-white">Overall Health Score</p>
                                <p className="text-4xl font-bold text-white">
                                    {Math.round(
                                        (deviceHealth.hardware_health?.ram +
                                            deviceHealth.hardware_health?.disk +
                                            deviceHealth.hardware_health?.cpu) / 3 || 0
                                    )}%
                                </p>
                                <p className="text-xs text-white">Hardware configuration rate</p>
                            </div>
                            <div className="pt-4 border-t border-white/30 space-y-3">
                                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs text-white">RAM Configured</span>
                                        <span
                                            className="text-sm font-bold text-white">{deviceHealth.hardware_health?.ram || 0}%</span>
                                    </div>
                                    <div className="w-full bg-white/20 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full bg-white transition-all duration-500"
                                            style={{width: `${deviceHealth.hardware_health?.ram || 0}%`}}
                                        ></div>
                                    </div>
                                </div>
                                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs text-white">Storage Configured</span>
                                        <span
                                            className="text-sm font-bold text-white">{deviceHealth.hardware_health?.disk || 0}%</span>
                                    </div>
                                    <div className="w-full bg-white/20 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full bg-white transition-all duration-500"
                                            style={{width: `${deviceHealth.hardware_health?.disk || 0}%`}}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-2 text-white bg-white/10 p-2 rounded-lg">
                                <Activity size={16}/>
                                <span className="text-sm font-medium">
                                    {deviceHealth.hardware_health?.cpu || 0}% CPU identification rate
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Locations - Redesigned */}
                <div
                    className="bg-gradient-to-br from-red to-orange rounded-xl shadow-lg p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -mb-12 -ml-12"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                Top Locations
                            </h3>
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                <MapPin className="text-white" size={24}/>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-white">Total Locations</p>
                                <p className="text-4xl font-bold text-white">
                                    {summary.total_locations || 0}
                                </p>
                                <p className="text-xs text-white">Active network locations</p>
                            </div>
                            <div className="pt-4 border-t border-white/30 space-y-3 max-h-[140px] overflow-y-auto pr-2">
                                {locationInsights.slice(0, 3).map((location, index) => (
                                    <div
                                        key={index}
                                        className="bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-white truncate">
                                                    {location.location_subnet__location__name || 'Unknown'}
                                                </p>
                                                <p className="text-xs text-white">
                                                    {location.device_count} devices
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-white">
                                                    {Math.round(location.avg_ram || 0)}GB
                                                </p>
                                                <p className="text-xs text-white">
                                                    {Math.round(location.avg_disk || 0)}GB
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {locationInsights.length === 0 && (
                                    <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm text-center">
                                        <p className="text-xs text-white">No location data available</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2 pt-2 text-white bg-white/10 p-2 rounded-lg">
                                <MapPin size={16}/>
                                <span className="text-sm font-medium">
                        {locationInsights.reduce((sum, loc) => sum + loc.device_count, 0)} total devices across locations
                    </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Distribution Charts */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:text-gray-200 dark:bg-bodybg
">
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
                                            : "bg-white text-gray-700 border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 dark:text-gray-200 dark:bg-bodybg"
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
                        {/* Chart */}
                        <div
                            className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow dark:text-gray-200 dark:bg-bodybg
">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
                                {metrics.find((m) => m.key === selectedMetric)?.label}
                            </h3>
                            <ReChart
                                data={dataWithPercentages}
                                dimensions={{height: 400}}
                            />
                        </div>

                        {/* Top Items with Enhanced Info */}
                        <div
                            className="bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow dark:text-gray-200 dark:bg-bodybg
">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
                                Top {metrics.find((m) => m.key === selectedMetric)?.label}
                            </h3>
                            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                                {dataWithPercentages.slice(0, 8).map((item, index) => (
                                    <div
                                        key={index}
                                        className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all dark:text-gray-200 dark:bg-bodybg
"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span
                                                className="text-sm font-medium text-gray-900 truncate pr-4 dark:text-white">
                                                {item.name}
                                            </span>
                                            <span className="text-sm font-semibold text-primary">{item.value}</span>
                                        </div>

                                        {/* Hardware metrics if available */}
                                        {(item.avg_ram > 0 || item.avg_disk > 0) && (
                                            <div className="flex gap-4 text-xs text-gray-600 mb-2 dark:text-gray-400">
                                                {item.avg_ram > 0 && (
                                                    <span>RAM: {item.avg_ram}GB</span>
                                                )}
                                                {item.avg_disk > 0 && (
                                                    <span>Disk: {item.avg_disk}GB</span>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3">
                                            <div
                                                className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden dark:bg-gray-700">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${item.percentage}%`,
                                                        backgroundColor: COLORS[index % COLORS.length],
                                                    }}
                                                />
                                            </div>
                                            <span
                                                className="text-xs font-medium text-gray-600 dark:text-gray-400 min-w-[50px] text-right">
                                                {item.percentage}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {dataWithPercentages.length === 0 && (
                                    <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                                        No data available for this metric.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Table */}
                <div className="p-6">
                    <div
                        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow dark:text-gray-200 dark:bg-bodybg
">
                        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Detailed {metrics.find((m) => m.key === selectedMetric)?.label} Analytics
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-max">
                                <thead className="bg-gray-50 border border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">#</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Count</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Avg
                                        RAM
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Avg
                                        Disk
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Percentage</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">Distribution</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {dataWithPercentages.map((item, index) => (
                                    <tr key={index}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{item.value}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {item.avg_ram > 0 ? `${item.avg_ram} GB` : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {item.avg_disk > 0 ? `${item.avg_disk} GB` : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{item.percentage}%</td>
                                        <td className="px-6 py-4">
                                            <div className="w-32 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                                <div
                                                    className="h-2.5 rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${item.percentage}%`,
                                                        backgroundColor: COLORS[index % COLORS.length],
                                                    }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {dataWithPercentages.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
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

            {/* Hardware Statistics */}
            {hardwareStats.top_manufacturers && hardwareStats.top_manufacturers.length > 0 && (
                <div className="bg-gradient-to-br from-indigo to-purple rounded-xl shadow-lg border border-indigo-300 p-6 relative overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -mb-16 -ml-16"></div>
                    <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                    <Cpu className="text-white" size={24}/>
                                </div>
                                Hardware Overview
                            </h3>
                            <div className="text-right">
                                <p className="text-sm text-white">Total Devices</p>
                                <p className="text-2xl font-bold text-white">{summary.total_devices || 0}</p>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Top Manufacturers */}
                            <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm border border-white/20">
                                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                                    <Building size={18} className="text-indigo-200" />
                                    Top Manufacturers
                                </h4>
                                <div className="space-y-4">
                                    {hardwareStats.top_manufacturers.slice(0, 5).map((manufacturer, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                                <span className="text-sm font-medium text-white group-hover:text-indigo-100 transition-colors">
                                        {manufacturer.manufacturer || 'Unknown'}
                                    </span>
                                            </div>
                                            <span className="text-lg font-bold text-white bg-white/10 px-3 py-1 rounded-full border border-white/20">
                                    {manufacturer.count}
                                </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Disk Types */}
                            <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm border border-white/20">
                                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                                    <HardDrive size={18} className="text-indigo-200" />
                                    Storage Types
                                </h4>
                                <div className="space-y-4">
                                    {hardwareStats.disk_types && hardwareStats.disk_types.slice(0, 5).map((disk, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                                <span className="text-sm font-medium text-white group-hover:text-indigo-100 transition-colors">
                                        {disk.disk_type || 'Unknown'}
                                    </span>
                                            </div>
                                            <span className="text-lg font-bold text-white bg-white/10 px-3 py-1 rounded-full border border-white/20">
                                    {disk.count}
                                </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Hardware Stats Summary */}
                            <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm border border-white/20">
                                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                                    <MemoryStick size={18} className="text-indigo-200" />
                                    Performance Stats
                                </h4>
                                <div className="space-y-4">
                                    {/* Average RAM */}
                                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-white">Avg RAM</span>
                                            <span className="text-lg font-bold text-white">{summary.avg_ram_gb || 0} GB</span>
                                        </div>
                                        <div className="w-full bg-white/20 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full bg-green transition-all duration-500"
                                                style={{
                                                    width: `${Math.min((summary.avg_ram_gb / (summary.max_ram_gb || 32)) * 100, 100)}%`
                                                }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-white mt-1">Max: {summary.max_ram_gb || 0} GB</p>
                                    </div>

                                    {/* Average Storage */}
                                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-white">Avg Storage</span>
                                            <span className="text-lg font-bold text-white">{summary.avg_disk_gb || 0} GB</span>
                                        </div>
                                        <div className="w-full bg-white/20 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full bg-green transition-all duration-500"
                                                style={{
                                                    width: `${Math.min((summary.avg_disk_gb / (summary.max_disk_gb || 2000)) * 100, 100)}%`
                                                }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-white mt-1">Max: {summary.max_disk_gb || 0} GB</p>
                                    </div>

                                    {/* Health Score */}
                                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-white">Health Score</span>
                                            <span className="text-lg font-bold text-white">
                                    {Math.round(
                                        (deviceHealth.hardware_health?.ram +
                                            deviceHealth.hardware_health?.disk +
                                            deviceHealth.hardware_health?.cpu) / 3 || 0
                                    )}%
                                </span>
                                        </div>
                                        <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                                            <div
                                                className="h-2 rounded-full bg-green transition-all duration-500"
                                                style={{
                                                    width: `${Math.round(
                                                        (deviceHealth.hardware_health?.ram +
                                                            deviceHealth.hardware_health?.disk +
                                                            deviceHealth.hardware_health?.cpu) / 3 || 0
                                                    )}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Stats */}
                        <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white">{deviceHealth.hardware_health?.ram || 0}%</p>
                                <p className="text-xs text-white">RAM Configured</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white">{deviceHealth.hardware_health?.disk || 0}%</p>
                                <p className="text-xs text-white">Storage Configured</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white">{deviceHealth.hardware_health?.cpu || 0}%</p>
                                <p className="text-xs text-white">CPU Identified</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white">{hardwareStats.top_manufacturers?.length || 0}</p>
                                <p className="text-xs text-white">Manufacturers</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EquipmentAuditDashboard;