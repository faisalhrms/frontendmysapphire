import React, { useMemo } from "react";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import EmptyState from "@components/EmptyState.jsx";
import StatCard from "@modules/dashboards/analytics/components/StatCard.jsx";
import ClientSideTable from "@components/ClientSideTable.jsx";
import {
    ShieldAlert,
    UserX,
    CalendarDays,
    Clock,
    Users,
    AlertTriangle,
    Timer,
    Globe,
} from "lucide-react";

const DormantUsers = ({ rows = [], summary = {}, loading = false }) => {
    const safeRows = Array.isArray(rows) ? rows : [];

    // ✅ totals
    const totalUsers = Number(summary?.total_users) || 0; // active + inactive
    const totalActiveUsers = Number(summary?.total_active_users) || 0;
    const totalInactiveUsers = Math.max(totalUsers - totalActiveUsers, 0);

    // ✅ dormant list (flagged among active users)
    const dormantUsers = Number(summary?.inactive_users) || 0;

    // existing
    const neverLoggedIn = Number(summary?.never_logged_in) || 0;
    const older7 = Number(summary?.older_than_7d) || 0;
    const older14 = Number(summary?.older_than_14d) || 0;
    const older30 = Number(summary?.older_than_30d) || 0;
    const maxDays = Number(summary?.max_days_since_last_login) || 0;
    const threshold = Number(summary?.threshold_days) || 7;
    const tz = summary?.timezone || "UTC";

    // percentages out of dormant/flagged users
    const withLogin = Math.max(dormantUsers - neverLoggedIn, 0);
    const pctNever = dormantUsers > 0 ? (neverLoggedIn / dormantUsers) * 100 : 0;
    const pctOlder7 = dormantUsers > 0 ? (older7 / dormantUsers) * 100 : 0;

    const tableData = useMemo(() => {
        return safeRows.map((u) => ({
            username: u.Username || "-",
            email: u.Email || "-",
            last_login: u.LastLoginDate || "-",
            days_since: u.Days_Since_Last_Login || "-",
        }));
    }, [safeRows]);

    const tableConfig = useMemo(
        () => ({
            headers: [
                { label: "Username", accessor: "username", align: "left" },
                { label: "Email", accessor: "email", align: "left" },
                { label: "Last Login", accessor: "last_login" },
                { label: "Days Since", accessor: "days_since" },
            ],
        }),
        []
    );

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* ✅ Total Users with subtitle Active/Inactive */}
                <StatCard
                    icon={Users}
                    title="Total Users"
                    value={totalUsers}
                    subtitle={`Active: ${totalActiveUsers} • Inactive: ${totalInactiveUsers}`}
                    isLoading={false}
                />

                <StatCard
                    icon={ShieldAlert}
                    title="Dormant Users"
                    value={dormantUsers}
                    subtitle="Total flagged (active users only)"
                    isLoading={false}
                />

                <StatCard
                    icon={UserX}
                    title="Never Logged In"
                    value={neverLoggedIn}
                    subtitle={`${pctNever.toFixed(1)}% of flagged`}
                    isLoading={false}
                />

                <StatCard
                    icon={CalendarDays}
                    title={`Inactive ≥ ${threshold} Days`}
                    value={older7}
                    subtitle={`${pctOlder7.toFixed(1)}% of flagged`}
                    isLoading={false}
                />

                <StatCard
                    icon={AlertTriangle}
                    title="Inactive ≥ 14 Days"
                    value={older14}
                    subtitle="Deeper inactivity"
                    isLoading={false}
                />

                <StatCard
                    icon={Timer}
                    title="Inactive ≥ 30 Days"
                    value={older30}
                    subtitle="Critical dormancy"
                    isLoading={false}
                />

                <StatCard
                    icon={Clock}
                    title="Has Login History"
                    value={withLogin}
                    subtitle="Logged in at least once (flagged)"
                    isLoading={false}
                />

                <StatCard
                    icon={Globe}
                    title="Timezone"
                    value={tz}
                    subtitle="Rule uses UTC now()"
                    isLoading={false}
                />
            </div>

            {!safeRows.length ? (
                <EmptyState label="No dormant users found" />
            ) : (
                <ClientSideTable
                    config={tableConfig}
                    data={tableData}
                    title="Dormant Users"
                    height="700px"
                />
            )}
        </div>
    );
};

export default DormantUsers;
