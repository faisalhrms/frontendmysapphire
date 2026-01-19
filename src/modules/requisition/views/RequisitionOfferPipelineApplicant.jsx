import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "@components/datatable/DataTable.jsx";
import Avatar from "@components/Avatar.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import { getBadgeClasses } from "@helpers/badges.js";
import { History, Send } from "lucide-react";

const RequisitionOfferPipelineApplicant = ({ requisitionId, isActive }) => {
    const [refreshKey, setRefreshKey] = useState(0);
    const navigate = useNavigate();

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

                            <button
                                type="button"
                                className="ti-btn ti-btn-light ti-btn-sm"
                                title="Interview History"
                                onClick={() => navigate(`/module/requisition/${requisitionId}/applicants/${appId}/interviews`)}
                            >
                <span className="inline-flex items-center gap-1">
                  <History size={16} />
                </span>
                            </button>

                            {/* UI Only: route to offer section */}
                            <button
                                type="button"
                                className="ti-btn ti-btn-primary ti-btn-sm"
                                title="Offer Actions"
                                onClick={() => navigate(`/module/requisition/${requisitionId}/applicants/${appId}?section=offer`)}
                            >
                <span className="inline-flex items-center gap-1">
                  <Send size={16} />
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
                                <p className="font-semibold mb-0">{full}</p>
                                <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem]">{r.email || "—"}</p>
                            </div>
                        </div>
                    );
                },
            },

            { Header: "Mobile", accessor: "mobile_number", filterType: "text", filterable: true },
            { Header: "CNIC", accessor: "cnic_number", filterType: "text", filterable: true },
            { Header: "Expected Salary", accessor: "expected_salary", filterType: "text", filterable: true },
            { Header: "Notice Days", accessor: "notice_period_days", filterType: "text", filterable: true },

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
        <DataTable
            key={refreshKey}
            columns={columns}
            title="Offer Pipeline"
            apiUrl={`/requisitions/${requisitionId}/applicants/offer-pipeline/datatable`}
            enableAdvancedFilters={true}
        />
    );
};

export default RequisitionOfferPipelineApplicant;
