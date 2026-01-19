import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";

import {
    Activity,
    Star,
    BarChart3,
    CheckCircle2,
    Grid,
    Timer,
    Users,
    UserPlus,
    UserX,
    Briefcase,
    MapPin,
    Award,
    Building2,
    Eye, ChevronDown, ChevronUp
} from "lucide-react";

import useFilters from "@hooks/useFilters.js";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";

import DepartmentDropdown from "@components/dropdowns/DepartmentDropdown.jsx";
import FilterButton from "@components/form/FilterButton.jsx";

import StatCard from "@modules/dashboards/analytics/components/StatCard.jsx";
import ReChart from "@components/charts/ReChart.jsx";
import { DEFAULT_CHART_COLORS } from "@helpers/styles.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import {toTitleCase} from "@helpers/formatters.js";
import {formatDate, secToHrs} from "@helpers/dateTime.js";

const badgeTone = (status) => {
    const v = String(status || "").toLowerCase();
    if (v === "completed") return "bg-success/10 text-success ring-success";
    if (v === "in_progress") return "bg-amber-50 text-amber-700 ring-amber-200";
    if (v === "assigned") return "bg-info/10 text-info ring-info";
    if (v === "not_enrolled") return "bg-danger/10 text-danger ring-danger";
    return "bg-slate-50 text-slate-700 ring-slate";
};

const StarSvg = ({ filled }) => (
    <svg
        viewBox="0 0 20 20"
        className={`w-4 h-4 ${filled ? "text-warning" : "text-zinc-200"}`}
        fill="currentColor"
        aria-hidden="true"
    >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.964a1 1 0 00.95.69h4.17c.969 0 1.371 1.24.588 1.81l-3.374 2.452a1 1 0 00-.364 1.118l1.286 3.964c.3.921-.755 1.688-1.538 1.118l-3.374-2.452a1 1 0 00-1.175 0l-3.374 2.452c-.783.57-1.838-.197-1.538-1.118l1.286-3.964a1 1 0 00-.364-1.118L2.05 9.391c-.783-.57-.38-1.81.588-1.81h4.17a1 1 0 00.95-.69l1.286-3.964z" />
    </svg>
);

const FIELD_LABELS = [
    ["Content Quality", "content_quality"],
    ["Role Relevance", "role_relevance"],
    ["Objectives Met", "learning_objectives_met"],
    ["Platform", "platform_experience"],
    ["Engagement", "engagement_interactivity"],
];

const StarRow = ({ value }) => {
    const v = Number(value || 0);
    const filled = Math.max(0, Math.min(5, Math.round(v)));
    const stars = Array.from({ length: 5 }, (_, i) => i < filled);

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
                {stars.map((f, i) => (
                    <svg
                        key={i}
                        viewBox="0 0 20 20"
                        className={`w-4 h-4 ${f ? "text-warning" : "text-zinc-200"}`}
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.964a1 1 0 00.95.69h4.17c.969 0 1.371 1.24.588 1.81l-3.374 2.452a1 1 0 00-.364 1.118l1.286 3.964c.3.921-.755 1.688-1.538 1.118l-3.374-2.452a1 1 0 00-1.175 0l-3.374 2.452c-.783.57-1.838-.197-1.538-1.118l1.286-3.964a1 1 0 00-.364-1.118L2.05 9.391c-.783-.57-.38-1.81.588-1.81h4.17a1 1 0 00.95-.69l1.286-3.964z" />
                    </svg>
                ))}
            </div>
            <span className="text-xs font-semibold text-zinc-900">{v ? `${v}/5` : "—"}</span>
        </div>
    );
};

const RatingCell = ({ avg }) => {
    const a = Number(avg || 0);
    if (!avg) return <span className="text-zinc-400 text-sm">—</span>;

    const rounded = Math.round(a * 10) / 10;
    const starsFilled = Math.max(0, Math.min(5, Math.round(rounded)));
    const stars = Array.from({ length: 5 }, (_, i) => i < starsFilled);

    return (
        <div className="flex items-center gap-2 whitespace-nowrap">
            <div className="flex items-center gap-0.5">
                {stars.map((filled, i) => <StarSvg key={i} filled={filled} />)}
            </div>
        </div>
    );
};

const fmt = (v) => (v == null || v === "" ? "—" : String(v));

const OfferingDetailedDashboard = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();

    const { user } = useSelector((state) => state.auth);
    const defaultCompanyId = user?.employee?.company?.id;

    const initialFilters = useMemo(() => {
        const params = Object.fromEntries(searchParams.entries());
        return { department_id: params.department_id || "" };
    }, [searchParams]);

    const { control, handleSubmit, errors, getFilters, resetFilters } = useFilters(
        useMemo(
            () => ({
                initialFilters: [{ name: "department_id", defaultValue: initialFilters.department_id }],
            }),
            [initialFilters]
        )
    );

    const [filters, setFilters] = useState(getFilters());

    useEffect(() => {
        resetFilters(initialFilters);
        setFilters(initialFilters);
    }, [initialFilters, resetFilters]);

    const onSubmit = useCallback((formData) => {
        setFilters(formData);
    }, []);

    const [department, setDepartment] = useState(initialFilters.department_id || null);
    const handleDepartmentSelect = useCallback((depId) => {
        setDepartment(depId);
    }, []);

    const tabs = [
        { id: "overview", label: "Overview", icon: Grid },
        { id: "analytics", label: "Analytics", icon: BarChart3 },
        { id: "users", label: "Users", icon: Users },
    ];

    const [activeTab, setActiveTab] = useState("overview");
    const COLORS = DEFAULT_CHART_COLORS;

    const apiFilters = useMemo(() => {
        const out = { offering_id: Number(id) };
        const dep = filters.department_id || department;
        if (dep) out.department_id = dep;
        return out;
    }, [id, filters.department_id, department]);

    const { data: dashboardData, isLoading } = useFetchWithFilters(
        "/lms/course-offerings-detailed-dashboard/",
        apiFilters
    );

    const summary = useMemo(() => dashboardData?.summary ?? null, [dashboardData]);
    const dist = useMemo(() => dashboardData?.status_distribution ?? [], [dashboardData]);
    const usersList = useMemo(() => dashboardData?.users ?? [], [dashboardData]);

    const metrics = [
        { key: "department", label: "Departments", icon: Building2 },
        { key: "designation", label: "Designations", icon: Award },
        { key: "location", label: "Locations", icon: MapPin },
    ];
    const [selectedMetric, setSelectedMetric] = useState("department");

    const groupRows = useMemo(() => dashboardData?.breakdowns?.[selectedMetric] ?? [], [dashboardData, selectedMetric]);

    const [metricKey, setMetricKey] = useState("eligible");
    const metricTabs = [
        { key: "eligible", label: "Eligible", icon: Users },
        { key: "enrolled", label: "Enrolled", icon: Activity },
        { key: "not_enrolled", label: "Not Enrolled", icon: UserX },
        { key: "assigned", label: "Assigned", icon: UserPlus },
        { key: "in_progress", label: "In Progress", icon: Timer },
        { key: "completed", label: "Completed", icon: CheckCircle2 },
    ];
    const chartData = useMemo(() => {
        return groupRows.map((r) => ({ name: r.name, value: Number(r?.[metricKey] || 0) }));
    }, [groupRows, metricKey]);

    const total = useMemo(
        () => chartData.reduce((sum, item) => sum + (Number(item.value) || 0), 0),
        [chartData]
    );

    const topGroups = useMemo(() => groupRows.slice(0, 8), [groupRows]);

    const statusTabs = [
        { key: "all", label: "All", icon: Users },
        { key: "completed", label: "Completed", icon: CheckCircle2 },
        { key: "in_progress", label: "In Progress", icon: Activity },
        { key: "assigned", label: "Assigned", icon: UserPlus },
        { key: "not_enrolled", label: "Not Enrolled", icon: UserX },
    ];
    const [userStatus, setUserStatus] = useState("all");

    const countByStatus = useMemo(() => {
        const map = { all: usersList.length, completed: 0, in_progress: 0, assigned: 0, not_enrolled: 0 };
        usersList.forEach((u) => {
            const k = String(u?.status || "").toLowerCase();
            if (map[k] != null) map[k] += 1;
        });
        return map;
    }, [usersList]);

    const filteredUsers = useMemo(() => {
        if (userStatus === "all") return usersList;
        return usersList.filter((u) => String(u?.status || "").toLowerCase() === userStatus);
    }, [usersList, userStatus]);

    const [openFeedbackUserId, setOpenFeedbackUserId] = useState(null);

    const toggleFeedback = useCallback((userId) => {
        setOpenFeedbackUserId((prev) => (prev === userId ? null : userId));
    }, []);


    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="space-y-6 pb-8 pt-8">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2">
                                <BarChart3 size={28} />
                            </div>
                            <div>
                                <h1 className="font-bold text-2xl text-gray-900 dark:text-white">Offering Dashboard</h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Enrollment analytics and user progress insights
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Course: <span className="font-semibold">{summary?.course_title || "—"}</span> · Self Enroll:{" "}
                                    <span className="font-semibold">{summary?.allow_self_enroll ? "Yes" : "No"}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters inline (NO separate component) */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-12 gap-6 mt-6 border-t border-gray-200 pt-4 dark:border-gray-700 overflow-x-auto">
                        <div className="col-span-12">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-1">
                                    <DepartmentDropdown
                                        company_id={defaultCompanyId}
                                        control={control}
                                        errors={errors}
                                        onDepartmentSelect={handleDepartmentSelect}
                                    />
                                </div>
                                <FilterButton />
                            </div>
                        </div>
                    </div>
                </form>

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
                                        : "bg-white text-gray-700 border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 dark:text-gray-200 dark:bg-bodybg"
                                }`}
                            >
                                <Icon size={18} />
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* OVERVIEW */}
            {activeTab === "overview" && summary && (
                <div className="space-y-6">
                    {/* 8 Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard icon={Users} title="Eligible Users" value={summary.eligible_users || 0} />
                        <StatCard icon={Activity} title="Enrolled" value={summary.enrolled || 0} subtitle={`Not Enrolled: ${summary.not_enrolled || 0}`} />
                        <StatCard icon={UserX} title="Not Enrolled" value={summary.not_enrolled || 0} subtitle="No enrollment row" />
                        <StatCard icon={UserPlus} title="Assigned" value={summary.assigned || 0} />
                        <StatCard icon={Activity} title="In Progress" value={summary.in_progress || 0} />
                        <StatCard icon={CheckCircle2} title="Completed" value={summary.completed || 0} subtitle={`${summary.completion_rate_of_eligible || 0}% of eligible`} />
                        <StatCard icon={Briefcase} title="HR Assigned" value={summary.hr_assigned || 0} subtitle="source = HR" />
                        <StatCard icon={Timer} title="Self Enrolled" value={summary.self_enrolled || 0} subtitle="source = SELF" />
                    </div>

                    {/* Top Groups + Engagement */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Top Departments */}
                        <div className="bg-primary-gradient rounded-xl shadow-lg p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -mr-14 -mt-14"/>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <Users className="text-white" size={24}/>
                                    <h3 className="text-lg font-semibold text-white">Top Departments</h3>
                                </div>

                                <div className="space-y-3">
                                    {(dashboardData?.breakdowns?.department ?? []).slice(0, 8).map((d, idx) => (
                                        <div key={idx}
                                             className="bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/20">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-white truncate">{d.name}</p>
                                                    <p className="text-xs text-white">
                                                        Completed {d.completed}/{d.enrolled} · Eligible {d.eligible}
                                                    </p>
                                                </div>
                                                <span className="text-lg font-bold text-white">{d.completed}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Engagement */}
                        <div
                            className="bg-gradient-to-br from-black to-blue rounded-xl shadow-lg p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -mr-14 -mt-14"/>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white">Engagement</h3>
                                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                        <Timer className="text-white" size={24}/>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-white">Avg Time</p>
                                        <p className="text-4xl font-bold text-white">{secToHrs(summary.avg_time_seconds || 0)}</p>
                                    </div>

                                    <div className="pt-4 border-t border-white/30 grid grid-cols-2 gap-4">
                                        <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                            <p className="text-xs text-white">Avg Progress</p>
                                            <p className="text-2xl font-bold text-white">{Math.round(summary.avg_progress || 0)}%</p>
                                        </div>
                                        <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                            <p className="text-xs text-white">Avg Score</p>
                                            <p className="text-2xl font-bold text-white">{Math.round(summary.avg_score || 0)}%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rating */}
                        <div
                            className="bg-gradient-to-br from-red to-yellow rounded-xl shadow-lg p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -mr-14 -mt-14" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white">Rating</h3>
                                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                        <Star className="text-white" size={24} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-white">Avg Rating</p>
                                        <p className="text-4xl font-bold text-white">
                                            {Number(summary.course_avg_rating || 0).toFixed(1)}
                                            <span className="text-lg font-semibold text-white/80">/5</span>
                                        </p>
                                        <p className="text-sm text-white/90 mt-1">
                                            {summary.course_review_count || 0} reviews
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-white/30 grid grid-cols-2 gap-4">
                                        <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                            <p className="text-xs text-white">Reviews</p>
                                            <p className="text-2xl font-bold text-white">{summary.course_review_count || 0}</p>
                                        </div>
                                        <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                            <p className="text-xs text-white">Out of</p>
                                            <p className="text-2xl font-bold text-white">5.0</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Distribution */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Overall Status</h3>
                        </div>
                        <div className="p-6">
                            <ReChart data={dist} dimensions={{ height: 320 }} />
                        </div>
                    </div>
                </div>
            )}

            {/* ANALYTICS (with icons like your metrics example) */}
            {activeTab === "analytics" && (
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                        <div
                            className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-wrap gap-4 dark:border-gray-700">
                            <div className="flex flex-wrap gap-2">
                                {metrics.map((m) => {
                                    const Icon = m.icon;
                                    const active = selectedMetric === m.key;
                                    return (
                                        <button
                                            key={m.key}
                                            onClick={() => setSelectedMetric(m.key)}
                                            type="button"
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all border ${
                                                active
                                                    ? "bg-primary/10 text-primary border-primary/30 shadow-md"
                                                    : "bg-white text-gray-700 border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 dark:text-gray-200 dark:bg-bodybg"
                                            }`}
                                        >
                                            <Icon size={18}/>
                                            {m.label}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {metricTabs.map((t) => {
                                    const Icon = t.icon;
                                    const active = metricKey === t.key;

                                    return (
                                        <button
                                            key={t.key}
                                            onClick={() => setMetricKey(t.key)}
                                            type="button"
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all border ${
                                                active
                                                    ? "bg-primary/10 text-primary border-primary/30 shadow-md"
                                                    : "bg-white text-gray-700 border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 dark:text-gray-200 dark:bg-bodybg"
                                            }`}
                                        >
                                            <Icon size={18}/>
                                            {t.label}
                                        </button>
                                    );
                                })}
                            </div>

                        </div>

                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div
                                    className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-md dark:text-gray-200 dark:bg-bodybg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
                                        {metrics.find((m) => m.key === selectedMetric)?.label} —{" "}
                                        {metricKey.replaceAll("_", " ").toUpperCase()}
                                    </h3>
                                    <ReChart data={chartData}/>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-md dark:text-gray-200 dark:bg-bodybg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">Top Items</h3>

                                    <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                                        {topGroups.slice(0, 10).map((r, idx) => {
                                            const value = Number(r?.[metricKey] || 0);
                                            const percentage = total ? ((value / total) * 100).toFixed(1) : 0;
                                            return (
                                                <div key={`${r.name}-${idx}`} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-200 dark:bg-bodybg">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-medium text-gray-900 truncate pr-4 dark:text-white">
                                                            {r.name}
                                                        </span>
                                                        <span className="text-sm font-semibold text-blue-600">{value}</span>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden dark:bg-gray-600">
                                                            <div
                                                                className="h-full rounded-full transition-all duration-500"
                                                                style={{
                                                                    width: `${percentage}%`,
                                                                    backgroundColor: COLORS[idx % COLORS.length],
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 min-w-[50px] text-right">
                                                            {percentage}%
                                                        </span>
                                                    </div>

                                                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                        Completed {r.completed}/{r.enrolled} · Eligible {r.eligible}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {groupRows.length === 0 && (
                                            <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                                                No analytics data.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detailed table */}
                        <div className="p-6">
                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md dark:text-gray-200 dark:bg-bodybg">
                                <div className="p-5 border-b border-gray-200 dark:border-gray-600">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Detailed {metrics.find((m) => m.key === selectedMetric)?.label}
                                    </h3>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-max">
                                        <thead className="bg-gray-50 border border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase dark:text-gray-300">#</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase dark:text-gray-300">Name</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase dark:text-gray-300">Eligible</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase dark:text-gray-300">Enrolled</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase dark:text-gray-300">Assigned</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase dark:text-gray-300">In Progress</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase dark:text-gray-300">Completed</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase dark:text-gray-300">Avg Prog</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase dark:text-gray-300">Avg Score</th>
                                        </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {groupRows.map((r, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{idx + 1}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{r.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{r.eligible || 0}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{r.enrolled || 0}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{r.assigned || 0}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{r.in_progress || 0}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{r.completed || 0}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{Math.round(r.avg_progress || 0)}%</td>
                                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{Math.round(r.avg_score || 0)}%</td>
                                            </tr>
                                        ))}

                                        {groupRows.length === 0 && (
                                            <tr>
                                                <td colSpan="9" className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                                                    No data.
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
            )}

            {/* USERS (with status tabs) */}
            {activeTab === "users" && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg">
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Users ({filteredUsers.length})
                        </h3>

                        <div className="flex flex-wrap gap-2">
                            {statusTabs.map((t) => {
                                const Icon = t.icon;
                                const active = userStatus === t.key;
                                return (
                                    <button
                                        key={t.key}
                                        type="button"
                                        onClick={() => setUserStatus(t.key)}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all border ${
                                            active
                                                ? "bg-primary/10 text-primary border-primary/30 shadow-md"
                                                : "bg-white text-gray-700 border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 dark:text-gray-200 dark:bg-bodybg"
                                        }`}
                                    >
                                        <Icon size={18} />
                                        <span className="font-medium">
                                            {t.label} ({countByStatus[t.key] ?? 0})
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-max">
                            <thead className="bg-gray-50 border border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase dark:text-gray-300">User</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase dark:text-gray-300">Emp
                                    Code
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase dark:text-gray-300">Department</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase dark:text-gray-300">Designation</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase dark:text-gray-300">Location</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase dark:text-gray-300">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase dark:text-gray-300">Progress</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase dark:text-gray-300">Score</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase dark:text-gray-300">Time</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase dark:text-gray-300">Rating</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase dark:text-gray-300">Feedback</th>

                            </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredUsers.map((u, idx) => {
                                const isOpen = openFeedbackUserId === u.user_id;
                                const hasFeedback = Boolean(u.feedback);

                                return (
                                    <React.Fragment key={`${u.user_id}-${idx}`}>
                                        {/* Main row */}
                                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div
                                                    className="text-sm font-semibold text-gray-900 dark:text-white">{u.user_name}</div>
                                                <div
                                                    className="text-xs text-gray-500 dark:text-gray-400">{u.user_email}</div>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{u.emp_code}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{u.department}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{u.designation}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{u.location}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${badgeTone(u.status)}`}>
                                              {toTitleCase(u.status)}
                                            </span>
                                                {u.scorm_status && (
                                                    <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                                                        COURSE: {String(u.scorm_status)}
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{Math.round(u.progress || 0)}%</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{u.score == null ? "—" : `${Math.round(u.score)}%`}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{secToHrs(u.total_time_seconds || 0)}</td>

                                            {/* Rating */}
                                            <td className="px-6 py-4">
                                                <RatingCell avg={u.user_avg_rating}/>
                                            </td>

                                            {/* Feedback action */}
                                            <td className="px-6 py-4">
                                                <button
                                                    type="button"
                                                    disabled={!hasFeedback}
                                                    onClick={() => toggleFeedback(u.user_id)}
                                                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition whitespace-nowrap
                                                ${hasFeedback
                                                        ? "bg-white hover:bg-gray-50 border-gray-200 text-gray-900 shadow-sm"
                                                        : "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
                                                    }`}
                                                    title={hasFeedback ? "View feedback" : "No feedback submitted"}
                                                >
                                                    <Eye size={16}/>
                                                    {isOpen ? "Hide" : "View"}
                                                    {isOpen ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                                                </button>
                                            </td>
                                        </tr>

                                        {/* Expanded feedback row */}
                                        {isOpen && (
                                            <tr className="bg-white dark:bg-bodybg">
                                                <td colSpan={11} className="px-6 py-5">
                                                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/30 p-5">
                                                        {/* Top Row */}
                                                        <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                                                            {/* Overall */}
                                                            <div className="lg:w-[280px] shrink-0">
                                                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                                                                    Overall Rating
                                                                </div>

                                                                <div className="mt-2 flex items-center justify-between">
                                                                    <StarRow value={u.feedback?.overall_rating} />
                                                                    <div className="text-[11px] font-semibold text-gray-500">
                                                                        {u.feedback?.submitted_at ? `Submitted: ${formatDate(u.feedback.submitted_at)}` : ""}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Category ratings */}
                                                            <div className="flex-1">
                                                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3">
                                                                    Breakdown
                                                                </div>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                                                                    {FIELD_LABELS.map(([label, key]) => (
                                                                        <div
                                                                            key={key}
                                                                            className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-bodybg px-4 py-3"
                                                                        >
                                                                            <div className="text-[11px] font-semibold text-gray-700 dark:text-gray-200">
                                                                                {label}
                                                                            </div>
                                                                            <StarRow value={u.feedback?.[key]} />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Notes */}
                                                        {(u.feedback?.issue_details || u.feedback?.improvement_suggestion) && (
                                                            <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                                {u.feedback?.issue_details && (
                                                                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-bodybg p-4">
                                                                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                                                                            Issue Details
                                                                        </div>
                                                                        <div className="mt-2 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                                                                            {u.feedback.issue_details}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {u.feedback?.improvement_suggestion && (
                                                                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-bodybg p-4">
                                                                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                                                                            Improvement Suggestion
                                                                        </div>
                                                                        <div className="mt-2 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                                                                            {u.feedback.improvement_suggestion}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}

                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="11" className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OfferingDetailedDashboard;
