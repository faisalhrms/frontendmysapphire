import React, { useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import DataTable from "@components/datatable/DataTable.jsx";
import Avatar from "@components/Avatar.jsx";
import Notify from "@helpers/toastNotifications.js";
import { toTitleCase } from "@helpers/formatters.js";
import { getBadgeClasses } from "@helpers/badges.js";
import { Sparkles, BadgeCheck, XCircle, CalendarPlus } from "lucide-react";
import RequisitionInterviewFormWrapper from "../models/components/RequisitionInterviewFormWrapper.jsx";

const RequisitionShortlistedApplicant = ({ requisitionId, isActive }) => {
    const [refreshKey, setRefreshKey] = useState(0);

    const [isInterviewFormOpen, setIsInterviewFormOpen] = useState(false);
    const [selectedApplicationId, setSelectedApplicationId] = useState(null);

    const openInterviewModal = (applicationId) => {
        setSelectedApplicationId(applicationId);
        setIsInterviewFormOpen(true);
    };

    const closeInterviewModal = () => {
        setIsInterviewFormOpen(false);
        setSelectedApplicationId(null);
    };

    /**
     * ✅ IMPORTANT:
     * backend bulk endpoint requires `status` + `is_shortlisted`
     */
    const updateOneStatus = useCallback(
        async (applicationId, status, is_shortlisted, successMsg) => {
            try {
                const api = (await import("../../../config/axiosConfig.js")).default;

                await api.patch(`/requisitions/${requisitionId}/applicants/status/bulk/`, {
                    status,
                    is_shortlisted,
                    application_ids: [applicationId],
                });

                Notify.success(successMsg);
                setRefreshKey((k) => k + 1);
            } catch (e) {
                Notify.error(e?.response?.data?.message || e?.message || "Update failed.");
            }
        },
        [requisitionId]
    );

    const columns = useMemo(
        () => [
            {
                Header: "Actions",
                accessor: "id",
                disableSortBy: true,
                Cell: ({ row }) => {
                    const appId = row?.original?.id;

                    return (
                        <div className="flex justify-center gap-2">
                            <Link to={`/module/requisition/${requisitionId}/applicants/${appId}`}>
                                <button className="ti-btn ti-btn-secondary ti-btn-sm" title="View Applicant">
                                    <i className="ri-eye-line" />
                                </button>
                            </Link>

                            {/* ✅ Schedule interview (keeps shortlist flag true) */}
                            <button
                                type="button"
                                className="ti-btn ti-btn-primary ti-btn-sm"
                                title="Schedule Interview"
                                onClick={() => openInterviewModal(appId)}
                            >
                <span className="inline-flex items-center gap-1">
                  <CalendarPlus size={16} />
                </span>
                            </button>

                            {/* ✅ Reject (removes shortlist flag) */}
                            <button
                                type="button"
                                className="ti-btn ti-btn-danger ti-btn-sm"
                                title="Reject"
                                onClick={() =>
                                    updateOneStatus(appId, "rejected", false, "Applicant rejected successfully.")
                                }
                            >
                                <i className="ri-close-line" />
                            </button>

                            {/* ✅ Move back to submitted (BUT keep shortlisted = true as per your requirement) */}
                            <button
                                type="button"
                                className="ti-btn ti-btn-secondary ti-btn-sm"
                                title="Move Back to Submitted"
                                onClick={() =>
                                    updateOneStatus(appId, "submitted", true, "Applicant moved back to Submitted.")
                                }
                            >
                                <i className="ri-refresh-line" />
                            </button>
                        </div>
                    );
                },
            },
            {
                Header: "Applicant",
                accessor: "full_name",
                filterType: "text",
                filterable: true,
                filterKey: "first_name",
                getCellProps: () => ({ className: "!text-left" }),
                Cell: ({ row }) => {
                    const r = row?.original || {};
                    const full = r.full_name || [r.first_name, r.last_name].filter(Boolean).join(" ") || "N/A";

                    return (
                        <div className="flex items-center">
                            <Avatar
                                avatar={r.avatar ? r.avatar : null}
                                full_name={full}
                                size="md"
                                parentClasses="bg-primary/10 !fill-primary"
                            />
                            <div className="ms-2">
                                <p className="font-semibold mb-0 flex items-center">{full}</p>
                                <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem]">{r.email || "—"}</p>
                            </div>
                        </div>
                    );
                },
            },

            { Header: "Mobile", accessor: "mobile_number", filterType: "text", filterable: true },
            { Header: "CNIC", accessor: "cnic_number", filterType: "text", filterable: true },
            { Header: "City", accessor: "city", filterType: "text", filterable: true },

            {
                Header: "Status",
                accessor: "status",
                filterable: false,
                headerClassName: "!text-center",
                Cell: ({ cell }) => toTitleCase(cell.value || ""),
                getCellProps: (cellInfo) => {
                    const fallback = { shortlisted: "bg-indigo/10 text-indigo-600" };
                    const v = cellInfo.value;
                    const cls = getBadgeClasses?.(v, "", false);
                    return {
                        className: `${cls || `badge !rounded-full ${fallback[v] || "bg-light text-default"}`} !text-center`,
                    };
                },
            },

            {
                Header: "AI Score",
                accessor: "ai_score",
                filterType: "text",
                filterable: true,
                Cell: ({ value }) => (value ?? value === 0 ? `${Number(value).toFixed(2)}%` : "—"),
            },
            {
                Header: "AI Recommended",
                accessor: "ai_shortlisted",
                filterType: "boolean",
                filterable: true,
                Cell: ({ value }) =>
                    value ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold bg-success/10 text-success">
              <Sparkles size={14} />
              AI Recommended
              <BadgeCheck size={14} />
            </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold bg-light text-default">
              <XCircle size={14} />
              Not Recommended
            </span>
                    ),
            },
            {
                Header: "Resume",
                accessor: "resume_file_url",
                disableSortBy: true,
                filterable: false,
                Cell: ({ value }) =>
                    value ? (
                        <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                            View
                        </a>
                    ) : (
                        "—"
                    ),
            },
            {
                Header: "Applied At",
                accessor: "created_at",
                filterType: "datetime",
                filterable: true,
            },
        ],
        [requisitionId, updateOneStatus]
    );

    if (!isActive) return null;

    return (
        <>
            <DataTable
                key={refreshKey}
                columns={columns}
                title="Shortlisted Applicants"
                apiUrl={`/requisitions/${requisitionId}/applicants/datatable/?is_shortlisted=true`}
                enableAdvancedFilters={true}
            />

            <RequisitionInterviewFormWrapper
                requisitionId={requisitionId}
                applicationId={selectedApplicationId}
                isOpen={isInterviewFormOpen}
                onClose={closeInterviewModal}
                onSuccess={() => {
                    closeInterviewModal();
                    setRefreshKey((k) => k + 1);
                }}
            />
        </>
    );
};

export default RequisitionShortlistedApplicant;
