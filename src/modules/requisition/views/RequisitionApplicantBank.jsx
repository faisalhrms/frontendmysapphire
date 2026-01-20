// src/modules/requisition/views/RequisitionApplicantBank.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import DataTable from "@components/datatable/DataTable.jsx";
import Avatar from "@components/Avatar.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import { getBadgeClasses } from "@helpers/badges.js";

import { Eye, History, Sparkles, BadgeCheck, XCircle, UsersRound } from "lucide-react";
import IconPageHeader from "../../layouts/includes/IconPageHeader.jsx";

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

const renderApplicantCell = (r) => {
    const full = r?.full_name || [r?.first_name, r?.last_name].filter(Boolean).join(" ") || "N/A";
    const appId = r?.id;

    return (
        <Link
            to={`/module/requisition/candidates/${appId}`}
            className="flex items-center group"
            title="Open Candidate Profile"
        >
            <Avatar
                avatar={r?.avatar ? r.avatar : null}
                full_name={full}
                size="md"
                parentClasses="bg-primary/10 !fill-primary"
            />
            <div className="ms-2">
                <p className="font-semibold mb-0 flex items-center group-hover:underline">
                    {full}
                </p>
                <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem] group-hover:underline">
                    {r?.email || "—"}
                </p>
            </div>
        </Link>
    );
};
const renderReqCell = (req, company, reqId) => {
    if (!req) return "—";
    const title = req?.title || "—";
    const reqNo = req?.req_no || "—";
    const companyName = company?.name ? ` • ${company.name}` : "";

    return (
        <Link
            to={`/module/requisition/detail/${reqId}`}
            className="text-left block group"
            title="Open Requisition Detail"
        >
            <div className="font-semibold truncate max-w-[320px] group-hover:underline" title={`${reqNo}${companyName}`}>
                {reqNo}
                {companyName}
            </div>
            <div
                className="text-[#8c9097] dark:text-white/50 text-[0.75rem] truncate max-w-[320px] group-hover:underline"
                title={title}
            >
                {title}
            </div>
        </Link>
    );
};
const renderTruncated = (value, maxWidth = 240) => {
    if (!value) return "—";
    return (
        <span className={`truncate inline-block max-w-[${maxWidth}px] align-middle`} title={String(value)}>
            {String(value)}
        </span>
    );
};

export default function RequisitionApplicantBank() {
    const [refreshKey, setRefreshKey] = useState(0);
    const navigate = useNavigate();

    const columns = useMemo(
        () => [
            {
                Header: "Actions",
                accessor: "id",
                disableSortBy: true,
                Cell: ({ row }) => {
                    const r = row?.original || {};
                    const reqId = r?.requisition?.id;
                    const appId = r?.id;

                    return (
                        <div className="flex justify-center gap-2">
                            <Link to={`/module/requisition/${reqId}/applicants/${appId}`}>
                                <button className="ti-btn ti-btn-secondary ti-btn-sm" title="View Applicant">
                                    <span className="inline-flex items-center gap-1">
                                        <Eye size={16} />
                                    </span>
                                </button>
                            </Link>

                            <button
                                type="button"
                                className="ti-btn ti-btn-light ti-btn-sm"
                                title="Interview History"
                                onClick={() => navigate(`/module/requisition/${reqId}/applicants/${appId}/interviews`)}
                            >
                                <span className="inline-flex items-center gap-1">
                                    <History size={16} />
                                </span>
                            </button>
                        </div>
                    );
                },
            },

            // ======================
            // Applicant
            // ======================
            {
                Header: "Applicant",
                accessor: "full_name",
                filterType: "text",
                filterable: true,
                filterKey: "first_name",
                getCellProps: () => ({ className: "!text-left" }),
                Cell: ({ row }) => renderApplicantCell(row?.original || {}),
            },
            { Header: "Email", accessor: "email", filterType: "text", filterable: true, getCellProps: () => ({ className: "!text-left" }) },
            { Header: "Mobile", accessor: "mobile_number", filterType: "text", filterable: true },
            { Header: "CNIC", accessor: "cnic_number", filterType: "text", filterable: true },
            { Header: "City", accessor: "city", filterType: "text", filterable: true },

            {
                Header: "Total Exp (Years)",
                accessor: "total_experience_years",
                filterType: "text",
                filterable: true,
                Cell: ({ value }) => (value ?? value === 0 ? Number(value).toFixed(2) : "—"),
            },

            // ======================
            // Latest Experience (split)
            // ======================
            {
                Header: "Latest Company",
                accessor: "latest_company",
                filterType: "text",
                filterable: true,
                getCellProps: () => ({ className: "!text-left" }),
                Cell: ({ value }) => renderTruncated(value, 240),
            },
            {
                Header: "Latest Designation",
                accessor: "latest_designation",
                filterType: "text",
                filterable: true,
                getCellProps: () => ({ className: "!text-left" }),
                Cell: ({ value }) => renderTruncated(value, 240),
            },

            // ======================
            // Latest Education (split)
            // ======================
            {
                Header: "Latest Degree",
                accessor: "latest_degree",
                filterType: "text",
                filterable: true,
                getCellProps: () => ({ className: "!text-left" }),
                Cell: ({ value }) => renderTruncated(value, 240),
            },
            {
                Header: "Institution",
                accessor: "latest_institution",
                filterType: "text",
                filterable: true,
                getCellProps: () => ({ className: "!text-left" }),
                Cell: ({ value }) => renderTruncated(value, 260),
            },
            {
                Header: "Year",
                accessor: "latest_year_completed",
                filterType: "text",
                filterable: true,
                Cell: ({ value }) => (value ?? value === 0 ? String(value) : "—"),
            },

            // ======================
            // Requisition
            // ======================
            {
                Header: "Requisition",
                id: "requisition_summary",
                accessor: (r) => r?.requisition?.req_no || "",
                filterType: "text",
                filterable: true,
                filterKey: "requisition__req_no",
                getCellProps: () => ({ className: "!text-left" }),
                Cell: ({ row }) => {
                    const r = row?.original || {};
                    const reqId = r?.requisition?.id;
                    return renderReqCell(r?.requisition, r?.company, reqId);
                },
            },


            // ✅ separate column for designation
            {
                Header: "Req Designation",
                id: "requisition_designation",
                accessor: (r) => r?.requisition_designation || r?.requisition?.designation?.name || "",
                filterType: "text",
                filterable: true,
                getCellProps: () => ({ className: "!text-left" }),
                Cell: ({ value }) => renderTruncated(value, 220),
            },

            {
                Header: "Requisition Status",
                id: "requisition_status",
                accessor: (r) => r?.requisition?.status || "",
                filterable: false,
                headerClassName: "!text-center",
                Cell: ({ value }) => (value ? toTitleCase(String(value).replaceAll("_", " ")) : "—"),
                getCellProps: (cellInfo) => {
                    const v = cellInfo.value;
                    const cls = getBadgeClasses?.(v, "", false);
                    const fallback = {
                        draft: "bg-light text-default",
                        submitted: "bg-primary/10 text-primary",
                        approved: "bg-success/10 text-success",
                        rejected: "bg-danger/10 text-danger",
                        closed: "bg-gray-200 text-gray-700",
                    };
                    return {
                        className: `${cls || `badge !rounded-full ${fallback[String(v || "").toLowerCase()] || "bg-light text-default"}`} !text-center`,
                    };
                },
            },

            {
                Header: "Hiring Manager",
                id: "hiring_manager",
                accessor: (r) => r?.requisition?.hiring_manager || null,
                filterable: false,
                getCellProps: () => ({ className: "!text-left" }),
                Cell: ({ value }) => renderUserCell(value),
            },

            // ======================
            // Department columns (split)
            // ======================
            {
                Header: "Department",
                id: "jd_department",
                accessor: (r) => r?.job_description?.department?.name || "",
                filterType: "text",
                filterable: true,
                filterKey: "requisition__job_description__department__name",
                getCellProps: () => ({ className: "!text-left" }),
                Cell: ({ value }) => renderTruncated(value, 240),
            },
            {
                Header: "Sub Department",
                id: "jd_sub_department",
                accessor: (r) => r?.job_description?.sub_department?.name || "",
                filterType: "text",
                filterable: true,
                filterKey: "requisition__job_description__sub_department__name",
                getCellProps: () => ({ className: "!text-left" }),
                Cell: ({ value }) => renderTruncated(value, 240),
            },
            {
                Header: "Position Title",
                id: "jd_position_title",
                accessor: (r) => r?.job_description?.position_title || "",
                filterType: "text",
                filterable: true,
                filterKey: "requisition__job_description__position_title",
                getCellProps: () => ({ className: "!text-left" }),
                Cell: ({ value }) => renderTruncated(value, 280),
            },

            // ======================
            // Applicant Status + Interview Status
            // ======================
            {
                Header: "Applicant Status",
                accessor: "status",
                filterable: false,
                headerClassName: "!text-center",
                Cell: ({ cell }) => (cell.value ? toTitleCase(String(cell.value).replaceAll("_", " ")) : "—"),
                getCellProps: (cellInfo) => {
                    const v = cellInfo.value;
                    const cls = getBadgeClasses?.(v, "", false);
                    return { className: `${cls || "badge !rounded-full bg-light text-default"} !text-center` };
                },
            },
            {
                Header: "Interview Status",
                accessor: "interview_status",
                filterable: false,
                headerClassName: "!text-center",
                Cell: ({ value }) => (value ? toTitleCase(String(value).replaceAll("_", " ")) : "—"),
                getCellProps: (cellInfo) => {
                    const v = String(cellInfo.value || "").toLowerCase();
                    const cls = getBadgeClasses?.(v, "", false);
                    const fallback = {
                        none: "bg-light text-default",
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

            // ======================
            // AI + Resume + Applied At
            // ======================
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
        [navigate]
    );

    return (
        <>
            <IconPageHeader
                heading="Applicant Bank"
                description="All applicants across requisitions with requisition, JD, application status, interview status, and latest profile insights."
                icon={UsersRound}
            />

            <DataTable
                key={refreshKey}
                columns={columns}
                needHeader={false}
                apiUrl={`/requisition/applicants/datatable/`}
                enableAdvancedFilters={true}
            />
        </>
    );
}
