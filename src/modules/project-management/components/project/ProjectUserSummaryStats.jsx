import React, { useMemo, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { mapSeriesToColors, statusColorMapping } from "@helpers/statusStyles.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { Link } from "react-router-dom";
import useFullScreen from "@hooks/useFullScreen.js";

const ProjectUserSummaryStats = ({ summary, statsFetching, height = 400 }) => {
    const { isFullscreen, handleFullscreenClick } = useFullScreen();
    const containerHeight = isFullscreen ? "calc(100vh - 100px)" : height;
    const [searchTerm, setSearchTerm] = useState("");

    const enrichedData = useMemo(() => {
        if (!summary?.details) return [];
        return summary.details.map((detail) => ({
            name: detail.user.full_name,
            userId: detail.user.id,
            avatar: detail.user.avatar?.small_url || detail.user.avatar?.file_url,
            email: detail.user.email,
            total: detail.total,
            Overdue: detail.overdue,
            "Completed On Time": detail.completed_on_time,
            "Completed Late": detail.completed_late,
            "In Progress": detail.in_progress,
        }));
    }, [summary?.details]);

    const filteredData = useMemo(() => {
        const data = [...enrichedData]; // clone to avoid mutation
        if (!searchTerm.trim()) return data.sort((a, b) => b.total - a.total);

        const lower = searchTerm.toLowerCase();
        return data
            .filter(
                (user) =>
                    user.name.toLowerCase().includes(lower) ||
                    user.email.toLowerCase().includes(lower)
            )
            .sort((a, b) => b.total - a.total);
    }, [searchTerm, enrichedData]);

    const colors = useMemo(
        () => mapSeriesToColors(summary?.series, statusColorMapping),
        [summary?.series]
    );

    const seriesNames = useMemo(
        () => summary?.series?.map((s) => s.name) || [],
        [summary?.series]
    );

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload?.length) return null;
        const labelStr = String(label || "");
        const userData = filteredData.find((d) => d.name === labelStr);
        const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);
        const initials = (name) =>
            name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) || "?";

        return (
            <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg min-w-[220px]">
                <div className="flex items-center gap-3 mb-3 pb-3 border-b">
                    {userData?.avatar ? (
                        <img
                            src={userData.avatar}
                            alt={labelStr}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm">
                            {initials(labelStr)}
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-gray-800">{labelStr}</p>
                        {userData?.email && (
                            <p className="text-xs text-gray-500">{userData.email}</p>
                        )}
                    </div>
                </div>
                <div className="space-y-1">
                    {payload.map(
                        (entry, index) =>
                            entry.value > 0 && (
                                <div
                                    key={index}
                                    className="flex items-center justify-between gap-6 text-sm"
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded"
                                            style={{ backgroundColor: entry.color }}
                                        />
                                        <span className="text-gray-600">{entry.name}</span>
                                    </div>
                                    <span className="font-medium text-gray-800">
                    {entry.value}
                  </span>
                                </div>
                            )
                    )}
                </div>
                <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between text-sm font-semibold">
                    <span>Total Tasks:</span>
                    <span className="text-info">{total}</span>
                </div>
            </div>
        );
    };

    const CustomYAxisTick = ({ x, y, payload }) => {
        const userData = filteredData.find((d) => d.name === payload.value);
        if (!userData) return null;
        const total = userData.total || 0;
        let workloadColor = "#10B981";
        if (total > 15) workloadColor = "#EF4444";
        else if (total > 10) workloadColor = "#F59E0B";
        const initials = (name) =>
            name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) || "?";

        return (
            <g transform={`translate(${x},${y})`}>
                <circle cx={-145} cy={0} r={4} fill={workloadColor} />
                {userData.avatar ? (
                    <>
                        <defs>
                            <clipPath id={`avatar-clip-${userData.userId}`}>
                                <circle cx={-125} cy={0} r={14} />
                            </clipPath>
                        </defs>
                        <circle cx={-125} cy={0} r={14} fill="#E5E7EB" />
                        <image
                            x={-139}
                            y={-14}
                            width={28}
                            height={28}
                            href={userData.avatar}
                            clipPath={`url(#avatar-clip-${userData.userId})`}
                            preserveAspectRatio="xMidYMid slice"
                        />
                        <circle
                            cx={-125}
                            cy={0}
                            r={14}
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="2"
                        />
                    </>
                ) : (
                    <>
                        <defs>
                            <linearGradient
                                id={`gradient-avatar-${userData.userId}`}
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="100%"
                            >
                                <stop offset="0%" stopColor="#3B82F6" />
                                <stop offset="100%" stopColor="#8B5CF6" />
                            </linearGradient>
                        </defs>
                        <circle
                            cx={-125}
                            cy={0}
                            r={14}
                            fill={`url(#gradient-avatar-${userData.userId})`}
                        />
                        <text
                            x={-125}
                            y={0}
                            dy={4}
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize={10}
                            fontWeight={600}
                        >
                            {initials(payload.value)}
                        </text>
                    </>
                )}
                <circle cx={-100} cy={10} r={8} fill={workloadColor} opacity={0.2} />
                <text
                    x={-100}
                    y={10}
                    dy={3}
                    textAnchor="middle"
                    fill={workloadColor}
                    fontSize={9}
                    fontWeight={600}
                >
                    {total}
                </text>
            </g>
        );
    };

    return (
        <div className={`box custom-card ${isFullscreen ? "box-fullscreen" : ""}`}>
            <div className="box-header justify-between">
                <div className="box-title">Resource Planning Summary</div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-3 mr-4 text-xs">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-success" />
                            <span className="text-gray-600">Light (&lt;10)</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-warning" />
                            <span className="text-gray-600">Moderate (10-15)</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-danger" />
                            <span className="text-gray-600">Overloaded (&gt;15)</span>
                        </div>
                    </div>
                    <input
                        className="ti-form-control form-control-sm"
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Link
                        aria-label="anchor"
                        to="#"
                        className="terms-fullscreen"
                        onClick={handleFullscreenClick}
                    >
                        <i className="ri-fullscreen-line"></i>
                    </Link>
                </div>
            </div>

            <div className="box-body !p-0">
                {statsFetching ? (
                    <LoadingSpinner />
                ) : filteredData.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        No users found matching {searchTerm}
                    </div>
                ) : (
                    <div className="p-6 pb-2">
                        <ResponsiveContainer width="100%" height={containerHeight}>
                            <BarChart
                                data={filteredData}
                                layout="vertical"
                                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                                barSize={30}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#E5E7EB"
                                    vertical={false}
                                    horizontal={true}
                                />
                                <XAxis
                                    type="number"
                                    stroke="#6B7280"
                                    fontSize={12}
                                    tick={{ fill: "#6B7280" }}
                                    label={{
                                        value: "Number of Tasks",
                                        position: "insideBottom",
                                        offset: -5,
                                        fill: "#6B7280",
                                        fontSize: 12,
                                    }}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    stroke="transparent"
                                    fontSize={12}
                                    width={160}
                                    tick={<CustomYAxisTick />}
                                />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    cursor={{ fill: "rgba(59, 130, 246, 0.05)" }}
                                />
                                <Legend
                                    wrapperStyle={{ paddingTop: "10px" }}
                                    iconType="rect"
                                    iconSize={12}
                                />
                                {seriesNames.map((seriesName, index) => (
                                    <Bar
                                        key={seriesName}
                                        dataKey={seriesName}
                                        stackId="a"
                                        fill={colors[index] || "#3B82F6"}
                                        name={seriesName}
                                        radius={
                                            index === seriesNames.length - 1
                                                ? [0, 4, 4, 0]
                                                : [0, 0, 0, 0]
                                        }
                                    />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectUserSummaryStats;
