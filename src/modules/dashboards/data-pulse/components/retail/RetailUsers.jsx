import React, { useMemo, useState } from "react";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import StatCard from "@modules/dashboards/analytics/components/StatCard.jsx";
import DataTable from "@components/datatable/DataTable.jsx";
import { formatRoundedAmountWithCommas } from "@helpers/formatters.js";

import {
    Users,
    ShieldAlert,
    CalendarDays,
    AlertTriangle,
    Timer,
    Percent,
    ListFilter,
    UserCheck,
    UserMinus,
} from "lucide-react";

const USER_ENDPOINTS = {
    overview: "/dashboard/data-pulse/retail/users/overview/",
    inactiveTable: "/dashboard/data-pulse/retail/users/inactive/datatable/",
};

const fmtInt = (v) => formatRoundedAmountWithCommas(Number(v) || 0);

const RetailUsers = ({ filters, enabled }) => {
    const [usersView, setUsersView] = useState("dormant");
    const [days, setDays] = useState(7);

    const tableFilter = useMemo(
        () => ({
            ...filters,
            users_view: usersView,
            days,
        }),
        [filters, usersView, days]
    );

    const { data: overviewResp, isLoading: overviewLoading } = useFetchWithFilters(
        USER_ENDPOINTS.overview,
        { ...filters, days },
        { enabled: !!enabled }
    );

    const summary = overviewResp?.summary || {};

    const totalUsers = Number(summary.total_users || 0);
    const enabledUsers = Number(summary.active_users || 0);
    const disabledUsers = Number(summary.inactive_users || 0);

    const dormantUsers = Number(summary.dormant_users || 0);
    const inactive_1_30 = Number(summary.inactive_1_30 || 0);
    const inactive_31_180 = Number(summary.inactive_31_180 || 0);
    const inactive_gt_180 = Number(summary.inactive_gt_180 || 0);

    const threshold = Number(summary.threshold_days || days);

    const viewTabs = useMemo(
        () => [
            { id: "dormant", label: "Dormant", icon: ShieldAlert },
            { id: "inactive_1_30", label: "Inactive 1–30d", icon: CalendarDays },
            { id: "inactive_31_180", label: "Inactive 31–180d", icon: AlertTriangle },
            { id: "inactive_gt_180", label: "Inactive > 180d", icon: Timer },
            { id: "enabled", label: "Enabled", icon: UserCheck },
            { id: "disabled", label: "Disabled", icon: UserMinus },
            { id: "all", label: "All Users", icon: ListFilter },
        ],
        []
    );

    const buttons = (
        <div className="w-full flex items-center gap-3">
            <div className="flex flex-wrap gap-2 flex-1 min-w-0">
                {viewTabs.map((t) => {
                    const Icon = t.icon;
                    const active = usersView === t.id;
                    return (
                        <button
                            key={t.id}
                            onClick={() => setUsersView(t.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition ${
                                active
                                    ? "bg-primary/10 text-primary border-primary/30"
                                    : "bg-white border-gray-200 hover:border-gray-300 dark:bg-bodybg dark:border-gray-700"
                            }`}
                        >
                            <Icon size={16} />
                            <span className="whitespace-nowrap">{t.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Days dropdown only used for Dormant */}
            <div className="ml-auto flex items-center gap-2 justify-end shrink-0">
        <span className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
          Days:
        </span>
                <select
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    disabled={usersView !== "dormant"}
                    className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-bodybg text-sm min-w-[90px]"
                >
                    {[7, 14, 30, 60, 90, 180].map((d) => (
                        <option key={d} value={d}>
                            {d}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );

    const inactiveUsersColumns = useMemo(
        () => [
            {
                Header: "User ID",
                accessor: "userid",
                excelAlignment: "left",
                Cell: ({ value }) => value ?? "-",
                getCellProps: () => ({ className: "!text-left font-mono text-blue-600" }),
            },
            {
                Header: "Username",
                accessor: "username",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
            },
            {
                Header: "Email",
                accessor: "email",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
            },
            {
                Header: "Company",
                accessor: "company",
                excelAlignment: "left",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
            },
            {
                Header: "Logout Date",
                accessor: "logout_date",
                excelAlignment: "left",
                excelColumnType: "date",
                excelFormat: "MMM dd, yyyy",
                Cell: ({ value }) => value || "-",
                getCellProps: () => ({ className: "!text-left font-mono" }),
            },
            {
                Header: "Days Since",
                accessor: "days_since_logout",
                excelAlignment: "right",
                excelColumnType: "number",
                Cell: ({ value }) => (value === null || value === undefined ? "-" : fmtInt(value)),
                getCellProps: () => ({ className: "!text-right tabular-nums font-semibold" }),
            },
        ],
        []
    );

    return (
        <div className="space-y-6">
            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard
                    icon={Users}
                    title="Total Users"
                    value={overviewLoading ? "..." : fmtInt(totalUsers)}
                    subtitle="All accounts (enabled + disabled)"
                    isLoading={overviewLoading}
                    variant="blackIndigo"
                />

                <StatCard
                    icon={UserCheck}
                    title="Enabled Users"
                    value={overviewLoading ? "..." : fmtInt(enabledUsers)}
                    subtitle="Can access system right now"
                    isLoading={overviewLoading}
                    variant="blackGreen"
                />

                <StatCard
                    icon={UserMinus}
                    title="Disabled Users"
                    value={overviewLoading ? "..." : fmtInt(disabledUsers)}
                    subtitle="Access removed / disabled accounts"
                    isLoading={overviewLoading}
                    variant="redOrange"
                />

                <StatCard
                    icon={ShieldAlert}
                    title={`Dormant (< ${threshold}d)`}
                    value={overviewLoading ? "..." : fmtInt(dormantUsers)}
                    subtitle="Enabled users only • based on LastLogout"
                    isLoading={overviewLoading}
                    variant="blackRed"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <StatCard
                    icon={CalendarDays}
                    title="Inactive 1–30 Days"
                    value={overviewLoading ? "..." : fmtInt(inactive_1_30)}
                    subtitle="Enabled users only • last logout within 30 days"
                    isLoading={overviewLoading}
                />

                <StatCard
                    icon={AlertTriangle}
                    title="Inactive 31–180 Days"
                    value={overviewLoading ? "..." : fmtInt(inactive_31_180)}
                    subtitle="Enabled users only • up to 6 months"
                    isLoading={overviewLoading}
                />

                <StatCard
                    icon={Timer}
                    title="Inactive > 180 Days"
                    value={overviewLoading ? "..." : fmtInt(inactive_gt_180)}
                    subtitle="Enabled users only • more than 6 months"
                    isLoading={overviewLoading}
                />
            </div>

                {/* Datatable */}
                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-bodybg dark:border-gray-700">
                    <DataTable
                        columns={inactiveUsersColumns}
                        title=""
                        apiUrl={USER_ENDPOINTS.inactiveTable}
                        needHeader={true}
                        buttons={buttons}
                        enableAdvancedFilters={false}
                        filter={tableFilter}
                        hideUrlParams={true}
                    />
                </div>
            </div>
            );
            };

            export default RetailUsers;
