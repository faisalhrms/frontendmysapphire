import React, { useMemo } from "react";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import EmptyState from "@components/EmptyState.jsx";
import StatCard from "@modules/dashboards/analytics/components/StatCard.jsx";
import { Ban, User, Calendar, Truck, Clock, Layers } from "lucide-react";
import ClientSideTable from "@components/ClientSideTable.jsx";
import { formatDate } from "@helpers/dateTime.js";

const ReturnsCancelledAfterDispatchTable = ({
                                                rows = [],
                                                summary = {},
                                                loading = false,
                                            }) => {
    const safeRows = Array.isArray(rows) ? rows : [];

    const tableData = useMemo(() => {
        return safeRows.map((item) => ({
            fo_number: item.Formatted_FO_Number__c || "-",
            created_date: formatDate(item.CreatedDate, "MMM dd, yyyy - HH:mm"),
            cn: item.CN__c || "-",
            shipped_date: formatDate(item.Shipped_Date__c, "MMM dd, yyyy - HH:mm"),
            canceled_date: formatDate(item.Canceled_Date__c, "MMM dd, yyyy - HH:mm"),
            cancel_by: item.cancel_by || "-",
        }));
    }, [safeRows]);

    const tableConfig = useMemo(
        () => ({
            headers: [
                { label: "FO #", accessor: "fo_number", align: "left" },
                { label: "Created", accessor: "created_date" },
                { label: "CN", accessor: "cn" },
                { label: "Shipped", accessor: "shipped_date" },
                { label: "Canceled", accessor: "canceled_date" },
                { label: "Canceled By", accessor: "cancel_by" },
            ],
        }),
        []
    );

    const cancelledCount = Number(summary?.cancelled_after_dispatch_count) || 0;
    const uniqueCancelers = Number(summary?.unique_cancelers) || 0;

    const minShipped = summary?.min_shipped_date ? formatDate(summary.min_shipped_date, "MMM dd, yyyy") : "-";
    const maxShipped = summary?.max_shipped_date ? formatDate(summary.max_shipped_date, "MMM dd, yyyy") : "-";

    const minCanceled = summary?.min_canceled_date ? formatDate(summary.min_canceled_date, "MMM dd, yyyy") : "-";
    const maxCanceled = summary?.max_canceled_date ? formatDate(summary.max_canceled_date, "MMM dd, yyyy") : "-";

    // (6th card) row count as a safety cross-check (often equals cancelledCount)
    const rowCount = safeRows.length;

    if (loading) return <LoadingSpinner />;

    if (!safeRows.length) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 dark:text-gray-200 dark:bg-bodybg dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                    <Ban size={18} />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Cancelled After Dispatch
                    </h3>
                </div>
                <EmptyState label="No cancelled-after-dispatch records found" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ✅ 6 summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <StatCard
                    icon={Ban}
                    title="Cancelled After Dispatch"
                    value={cancelledCount}
                    subtitle="Window total"
                    isLoading={false}
                    classes='border-gray-400'
                />

                <StatCard
                    icon={User}
                    title="Unique Cancelers"
                    value={uniqueCancelers}
                    subtitle="Distinct users"
                    isLoading={false}
                    classes='border-gray-400'
                />

                <StatCard
                    icon={Truck}
                    title="Shipped Range"
                    value={`${minShipped} → ${maxShipped}`}
                    subtitle="Min → Max"
                    isLoading={false}
                    classes='border-gray-400'
                />

                <StatCard
                    icon={Calendar}
                    title="Canceled Range"
                    value={`${minCanceled} → ${maxCanceled}`}
                    subtitle="Min → Max"
                    isLoading={false}
                    classes='border-gray-400'
                />

                <StatCard
                    icon={Layers}
                    title="Rows Returned"
                    value={rowCount}
                    subtitle="Table rows"
                    isLoading={false}
                    classes='border-gray-400'
                />

                <StatCard
                    icon={Clock}
                    title="Signal"
                    value={cancelledCount > 0 ? "Investigate" : "Normal"}
                    subtitle="Ops check"
                    isLoading={false}
                    classes='border-gray-400'
                />
            </div>

            {/* Table */}
            <ClientSideTable config={tableConfig} data={tableData} title="" height="700px" />
        </div>
    );
};

export default ReturnsCancelledAfterDispatchTable;
