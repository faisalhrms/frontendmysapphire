import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "@components/datatable/DataTable.jsx";
import Avatar from "@components/Avatar.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import { getBadgeClasses } from "@helpers/badges.js";
import {
    Sparkles,
    BadgeCheck,
    XCircle,
    CalendarPlus,
    History,
} from "lucide-react";

import RequisitionInterviewFormWrapper from "../models/components/RequisitionInterviewFormWrapper.jsx";

const RequisitionInterviewCompletedApplicant = ({ requisitionId, isActive }) => {
    const [refreshKey, setRefreshKey] = useState(0);

    const navigate = useNavigate();

    // ✅ schedule next interview modal
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

    const renderUserCell = (userObj) => {
        if (!userObj) return "—";
        return (
            <div className="flex items-center">
                <Avatar
                    avatar={userObj.avatar || null}
                    full_name={userObj.full_name || "—"}
                    size="sm"
                    parentClasses="bg-primary/10 !fill-primary"
                />
                <div className="ms-2 leading-tight">
                    <p className="font-semibold mb-0">{userObj.full_name || "—"}</p>
                    <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                        {userObj.email || "—"}
                    </p>
                </div>
            </div>
        );
    };

    const renderInterviewLink = (value) => {
        if (!value) return "—";
        const match = String(value).match(/https?:\/\/\S+/i);
        const url = match?.[0];
        if (url) {
            return (
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                    Open Link
                </a>
            );
        }
        return (
            <span title={value} className="truncate inline-block max-w-[240px] align-middle">
                {value}
            </span>
        );
    };

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

                            {/* ✅ Interview History */}
                            <button
                                type="button"
                                className="ti-btn ti-btn-light ti-btn-sm"
                                title="Interview History"
                                onClick={() =>
                                    navigate(`/module/requisition/${requisitionId}/applicants/${appId}/interviews`)
                                }
                            >
                                <span className="inline-flex items-center gap-1">
                                    <History size={16} />
                                </span>
                            </button>

                            {/* ✅ Completed tab: schedule next round */}
                            <button
                                type="button"
                                className="ti-btn ti-btn-primary ti-btn-sm"
                                title="Schedule Next Round"
                                onClick={() => openInterviewModal(appId)}
                            >
                                <span className="inline-flex items-center gap-1">
                                    <CalendarPlus size={16} />
                                </span>
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
                Header: "Interview At",
                id: "next_interview_scheduled_at",
                accessor: (r) => r?.next_interview?.scheduled_at || null,
                filterable: false,
                Cell: ({ value }) => (value ? new Date(value).toLocaleString() : "—"),
            },
            {
                Header: "Round",
                id: "next_interview_round",
                accessor: (r) => r?.next_interview?.round || "",
                filterable: false,
                Cell: ({ value }) => (value ? toTitleCase(value.replaceAll("_", " ")) : "—"),
            },
            {
                Header: "Type",
                id: "next_interview_type",
                accessor: (r) => r?.next_interview?.interview_type || "",
                filterable: false,
                Cell: ({ value }) => (value ? toTitleCase(value) : "—"),
            },
            {
                Header: "Interviewer",
                id: "next_interview_interviewer",
                accessor: (r) => r?.next_interview?.interviewer || null,
                filterable: false,
                getCellProps: () => ({ className: "!text-left" }),
                Cell: ({ value }) => renderUserCell(value),
            },
            {
                Header: "Scheduled By",
                id: "next_interview_scheduled_by",
                accessor: (r) => r?.next_interview?.scheduled_by || null,
                filterable: false,
                getCellProps: () => ({ className: "!text-left" }),
                Cell: ({ value }) => renderUserCell(value),
            },
            {
                Header: "Interview Status",
                id: "next_interview_status",
                accessor: (r) => r?.next_interview?.status || "",
                filterable: false,
                headerClassName: "!text-center",
                Cell: ({ value }) => (value ? toTitleCase(value.replaceAll("_", " ")) : "—"),
                getCellProps: (cellInfo) => {
                    const v = cellInfo.value;
                    const cls = getBadgeClasses?.(v, "", false);
                    const fallback = {
                        scheduled: "bg-primary/10 text-primary",
                        rescheduled: "bg-warning/10 text-warning",
                        cancelled: "bg-danger/10 text-danger",
                        completed: "bg-success/10 text-success",
                        no_show: "bg-gray-200 text-gray-700",
                    };
                    return {
                        className: `${cls || `badge !rounded-full ${fallback[v] || "bg-light text-default"}`} !text-center`,
                    };
                },
            },
            {
                Header: "Location / Link",
                id: "next_interview_link",
                accessor: (r) => r?.next_interview?.link_or_location || "",
                filterable: false,
                getCellProps: () => ({ className: "!text-left" }),
                Cell: ({ value }) => renderInterviewLink(value),
            },

            {
                Header: "Applicant Status",
                accessor: "status",
                filterable: false,
                headerClassName: "!text-center",
                Cell: ({ cell }) => toTitleCase(cell.value || ""),
                getCellProps: (cellInfo) => {
                    const v = cellInfo.value;
                    const cls = getBadgeClasses?.(v, "", false);
                    return { className: `${cls || "badge !rounded-full bg-light text-default"} !text-center` };
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
                            <Sparkles size={14} /> AI Recommended <BadgeCheck size={14} />
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold bg-light text-default">
                            <XCircle size={14} /> Not Recommended
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
        [requisitionId, navigate]
    );

    if (!isActive) return null;

    return (
        <>
            <DataTable
                key={refreshKey}
                columns={columns}
                title="Interview Completed Applicants"
                apiUrl={`/requisitions/${requisitionId}/applicants/interviews/datatable/?bucket=completed`}
                enableAdvancedFilters={true}
            />

            {/* ✅ only schedule interview modal */}
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

export default RequisitionInterviewCompletedApplicant;
