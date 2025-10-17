// import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
// import React, { useState, useMemo } from "react";
// import {
//     Package, TrendingUp, TrendingDown, Calendar, AlertCircle,
//     DollarSign, Activity, Shield, Wrench, Users, MapPin,
//     BarChart3, RefreshCw, Clock, Layers, Bell, Grid, Building2,
//     User, Award
// } from "lucide-react";
// import LoadingSpinner from "@components/LoadingSpinner.jsx";
// import ReChart from "@components/charts/ReChart.jsx";
// import StatCard from "@modules/dashboards/analytics/components/StatCard.jsx";
// import {DEFAULT_CHART_COLORS} from "@helpers/styles.js";
//
// const EquipmentDashboardStats = ({ filters }) => {
//     const { data: dashboardData, isLoading } = useFetchWithFilters('/dashboard/equipment/', filters);
//     const [activeTab, setActiveTab] = useState("overview");
//     const [selectedMetric, setSelectedMetric] = useState("by_type");
//
//     const COLORS = DEFAULT_CHART_COLORS;
//
//     const metrics = [
//         { key: "by_type", label: "Equipment Types", icon: Layers},
//         { key: "by_status", label: "Status", icon: Activity, chartType: "pie" },
//         { key: "by_department", label: "Departments", icon: Users, chartType: "bar" },
//         { key: "by_site", label: "Sites", icon: MapPin, chartType: "bar" },
//         { key: "by_location", label: "Physical Location", icon: MapPin, chartType: "bar" },
//         { key: "value_analytics", label: "Value Ranges", icon: DollarSign, chartType: "pie" },
//         { key: "warranty_status", label: "Warranty Status", icon: Shield, chartType: "pie" },
//         { key: "age_distribution", label: "Age Distribution", icon: Calendar, chartType: "bar" }
//     ];
//
//     const summary = useMemo(() => dashboardData?.summary ?? null, [dashboardData]);
//     const costTrends = useMemo(() => dashboardData?.cost_trends ?? null, [dashboardData]);
//     const repairAnalytics = useMemo(() => dashboardData?.repair_analytics ?? null, [dashboardData]);
//     const expiringWarranties = useMemo(() => dashboardData?.expiring_warranties ?? [], [dashboardData]);
//     const recentEquipment = useMemo(() => dashboardData?.recent_equipment ?? [], [dashboardData]);
//     const monthlyPurchases = useMemo(() => dashboardData?.monthly_purchases ?? [], [dashboardData]);
//     const topEquipmentTypes = useMemo(() => dashboardData?.top_equipment_types ?? [], [dashboardData]);
//     const custodianAnalysis = useMemo(() => dashboardData?.custodian_analysis ?? [], [dashboardData]);
//     const byStatus = useMemo(() => dashboardData?.by_status ?? [], [dashboardData]);
//     const byDepartment = useMemo(() => dashboardData?.by_department ?? [], [dashboardData]);
//     const bySite = useMemo(() => dashboardData?.by_site ?? [], [dashboardData]);
//
//     const currentData = useMemo(() => {
//         if (!dashboardData || !dashboardData[selectedMetric]) return [];
//         return dashboardData[selectedMetric];
//     }, [dashboardData, selectedMetric]);
//
//     const total = useMemo(
//         () => currentData.reduce((sum, item) => sum + (Number(item.value) || 0), 0),
//         [currentData]
//     );
//
//     if (isLoading) {
//         return <LoadingSpinner />;
//     }
//
//     return (
//     );
// };
//
// export default EquipmentDashboardStats;