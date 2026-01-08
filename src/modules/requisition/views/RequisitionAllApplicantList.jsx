import React, { useMemo, useRef, useEffect, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "@components/datatable/DataTable.jsx";
import Avatar from "@components/Avatar.jsx";
import Notify from "@helpers/toastNotifications.js";
import { toTitleCase } from "@helpers/formatters.js";
import { getBadgeClasses } from "@helpers/badges.js";
import { Sparkles, BadgeCheck, XCircle } from "lucide-react";
import { useRequisitionApplicantsBulkStatus } from "@modules/requisition/hooks/requisitionHooks.js";

const RequisitionAllApplicantList = ({ requisitionId, isActive }) => {
    const {
        selectedIds,
        submitting,
        pendingStatus,
        isSelected,
        toggleOne,
        toggleAllOnPage,
        clearSelection,
        bulkUpdateStatus,
    } = useRequisitionApplicantsBulkStatus(requisitionId);

    const [refreshKey, setRefreshKey] = useState(0);

    // ✅ Holds ids for CURRENT visible page (filled by cell renders)
    const currentPageIdsRef = useRef(new Set());

    // ✅ Track applicant flags (id -> { is_shortlisted })
    const applicantFlagsRef = useRef(new Map());

    const safeInfo = (msg) => {
        if (Notify?.info) Notify.info(msg);
        else Notify.success(msg);
    };

    const runBulkStatus = useCallback(
        async ({ status, is_shortlisted, actionKey, applicationIds }, successMsg) => {
            try {
                await bulkUpdateStatus({ status, is_shortlisted, actionKey, applicationIds });
                Notify.success(successMsg);

                clearSelection();
                setRefreshKey((k) => k + 1);
            } catch (e) {
                Notify.error(e?.response?.data?.message || e?.message || "Bulk update failed.");
            }
        },
        [bulkUpdateStatus, clearSelection]
    );

    const headerButtons = useMemo(() => {
        if (!selectedIds.length) return null;

        const btnBase = "!py-1 !px-2 !text-[0.75rem]";

        // ✅ shortlist-eligible ids = selected ids where is_shortlisted !== true
        const eligibleShortlistIds = selectedIds.filter((id) => {
            const meta = applicantFlagsRef.current.get(id);
            // If meta missing (rare), treat as eligible
            return meta ? !meta.is_shortlisted : true;
        });

        const alreadyShortlistedCount = selectedIds.length - eligibleShortlistIds.length;

        const actions = [
            {
                actionKey: "shortlisted",
                className: `ti-btn ti-btn-success ${btnBase}`,
                icon: "ri-check-line",
                label: "Shortlist",
                title:
                    eligibleShortlistIds.length === 0
                        ? "All selected applicants are already shortlisted"
                        : alreadyShortlistedCount > 0
                            ? `${alreadyShortlistedCount} already shortlisted will be skipped`
                            : "",
                disabled: eligibleShortlistIds.length === 0,
                onClick: () => {
                    if (eligibleShortlistIds.length === 0) {
                        safeInfo("All selected applicants are already shortlisted.");
                        return;
                    }

                    if (alreadyShortlistedCount > 0) {
                        safeInfo(
                            `${alreadyShortlistedCount} already shortlisted — updating remaining ${eligibleShortlistIds.length}.`
                        );
                    }

                    runBulkStatus(
                        {
                            status: "shortlisted",
                            is_shortlisted: true,
                            actionKey: "shortlisted",
                            applicationIds: eligibleShortlistIds, // ✅ only eligible
                        },
                        "Selected applicants shortlisted successfully."
                    );
                },
            },
            {
                actionKey: "rejected",
                className: `ti-btn ti-btn-danger ${btnBase}`,
                icon: "ri-close-line",
                label: "Reject",
                title: "",
                disabled: false,
                onClick: () =>
                    runBulkStatus(
                        {
                            status: "rejected",
                            is_shortlisted: false, // ✅ ensure unshortlist on reject
                            actionKey: "rejected",
                        },
                        "Selected applicants rejected successfully."
                    ),
            },
            {
                actionKey: "submitted",
                className: `ti-btn ti-btn-secondary ${btnBase}`,
                icon: "ri-refresh-line",
                label: "Reset to Submitted",
                title: "Move selected applicants back to initial status",
                disabled: false,
                onClick: () =>
                    runBulkStatus(
                        {
                            status: "submitted",
                            is_shortlisted: false, // ✅ reset shortlist when moving back
                            actionKey: "submitted",
                        },
                        "Selected applicants moved back to Submitted."
                    ),
            },
        ];

        return (
            <div className="flex items-center gap-2 flex-wrap">
                <div className="text-xs text-gray-500">
                    Selected: <span className="font-semibold">{selectedIds.length}</span>
                </div>

                {actions.map((a) => {
                    const isThisLoading = submitting && pendingStatus === a.actionKey;

                    return (
                        <button
                            key={a.actionKey}
                            type="button"
                            title={a.title || ""}
                            onClick={a.onClick}
                            disabled={submitting || a.disabled}
                            className={`${a.className} ${a.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {isThisLoading ? (
                                <>
                                    <i className="ri-loader-4-line animate-spin me-1" /> Updating...
                                </>
                            ) : (
                                <>
                                    <i className={`${a.icon} me-1`} /> {a.label}
                                </>
                            )}
                        </button>
                    );
                })}

                <button
                    type="button"
                    onClick={clearSelection}
                    disabled={submitting}
                    className={`ti-btn ti-btn-light ${btnBase}`}
                    title="Clear selection"
                >
                    <i className="ri-delete-bin-6-line me-1" /> Clear
                </button>
            </div>
        );
    }, [selectedIds, submitting, pendingStatus, runBulkStatus, clearSelection]);

    /**
     * ✅ Select-all header checkbox (NO state, NO parent updates)
     */
    const SelectAllHeader = () => {
        const inputRef = useRef(null);

        // ✅ Clear before body rows add ids for this render
        currentPageIdsRef.current.clear();

        useEffect(() => {
            const el = inputRef.current;
            if (!el) return;

            const pageIds = Array.from(currentPageIdsRef.current);
            const selectedSet = new Set(selectedIds);

            const selectedOnPage = pageIds.filter((id) => selectedSet.has(id)).length;
            const checked = pageIds.length > 0 && selectedOnPage === pageIds.length;
            const indeterminate = selectedOnPage > 0 && selectedOnPage < pageIds.length;

            el.checked = checked;
            el.indeterminate = indeterminate;
        });

        const onChange = (e) => {
            const checked = e.target.checked;
            const pageIds = Array.from(currentPageIdsRef.current);
            toggleAllOnPage(pageIds, checked);
        };

        return (
            <input
                ref={inputRef}
                type="checkbox"
                onChange={onChange}
                disabled={submitting}
                title="Select all on this page"
            />
        );
    };

    const columns = useMemo(
        () => [
            {
                Header: <SelectAllHeader />,
                accessor: "checkbox",
                disableSortBy: true,
                filterable: false,
                Cell: ({ row }) => {
                    const r = row?.original || {};
                    const id = r?.id;
                    if (!id) return null;

                    // ✅ collect current page ids (this runs for visible rows)
                    currentPageIdsRef.current.add(id);

                    // ✅ store shortlist flag (important for bulk shortlist logic)
                    applicantFlagsRef.current.set(id, { is_shortlisted: !!r.is_shortlisted });

                    return (
                        <input
                            type="checkbox"
                            checked={isSelected(id)}
                            onChange={() => toggleOne(id)}
                            disabled={submitting}
                        />
                    );
                },
            },
            {
                Header: "Actions",
                accessor: "id",
                disableSortBy: true,
                Cell: ({ row }) => {
                    const appId = row?.original?.id;
                    return (
                        <div className="flex justify-center space-x-2">
                            <Link to={`/module/requisition/${requisitionId}/applicants/${appId}`}>
                                <button className="ti-btn ti-btn-secondary ti-btn-sm" title="View Applicant">
                                    <i className="ri-eye-line" />
                                </button>
                            </Link>
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
                    const full =
                        r.full_name || [r.first_name, r.last_name].filter(Boolean).join(" ") || "N/A";

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
                                <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                                    {r.email || "—"}
                                </p>
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
                filterable: true,
                filterType: "select",
                filterKey: "status",
                filterOptions: [
                    { value: "submitted", label: "Submitted" },
                    { value: "shortlisted", label: "Shortlisted" },
                    { value: "interview_scheduled", label: "Interview Scheduled" },
                    { value: "interviewed", label: "Interviewed" },
                    { value: "offered", label: "Offered" },
                    { value: "hired", label: "Hired" },
                    { value: "rejected", label: "Rejected" },
                ],
                headerClassName: "!text-center",
                Cell: ({ cell }) => toTitleCase(cell.value || ""),
                getCellProps: (cellInfo) => {
                    const fallback = {
                        submitted: "bg-slate-100 text-slate-700",
                        shortlisted: "bg-indigo/10 text-indigo-600",
                        interview_scheduled: "bg-warning/10 text-warning",
                        interviewed: "bg-purple/10 text-purple",
                        offered: "bg-info/10 text-info",
                        hired: "bg-success/10 text-success",
                        rejected: "bg-danger/10 text-danger",
                    };

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
                Cell: ({ value }) => {
                    const ok = !!value;
                    return ok ? (
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
                    );
                },
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
        [requisitionId, selectedIds, submitting, pendingStatus, isSelected, toggleOne, toggleAllOnPage]
    );

    if (!isActive) return null;

    return (
        <DataTable
            key={refreshKey}
            columns={columns}
            title="Applicants"
            apiUrl={`/requisitions/${requisitionId}/applicants/datatable/`}
            enableAdvancedFilters={true}
            buttons={headerButtons}
        />
    );
};

export default RequisitionAllApplicantList;
