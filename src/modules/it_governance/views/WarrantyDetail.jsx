import { Fragment } from "react";
import { useParams, Link } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import PerfectScrollbar from "react-perfect-scrollbar";
import { formatDate } from "@helpers/dateTime.js";
import "@assets/css/custom/attachment-card.css";
import { useFetchWarrantyById } from "@modules/it_governance/hooks/useWarrantyForm.js";

const WarrantyDetail = () => {
    const { id } = useParams();
    const { warrantyData } = useFetchWarrantyById(id);

    // ---------- helpers ----------
    const prettyEnum = (val) =>
        val ? String(val).replaceAll("_", " ").toUpperCase() : "N/A";

    const getPeriodBadge = (period) => {
        const map = {
            "6_months": "badge bg-info/10 text-info",
            "12_months": "badge bg-primary/10 text-primary",
            "18_months": "badge bg-warning/10 text-warning",
            "24_months": "badge bg-success/10 text-success",
            "2_years": "badge bg-success/10 text-success",
            "3_years": "badge bg-secondary/10 text-secondary",
        };
        return map[period] || "badge bg-light text-default";
    };

    const getDisputeBadge = (mode) => {
        const map = {
            arbitration: "badge bg-purple/10 text-purple",
            mediation: "badge bg-warning/10 text-warning",
            litigation: "badge bg-danger/10 text-danger",
        };
        return map[mode] || "badge bg-light text-default";
    };

    const addMonths = (dateStr, months) => {
        if (!dateStr || typeof months !== "number") return null;
        const d = new Date(dateStr);
        if (Number.isNaN(d.getTime())) return null;
        const copy = new Date(d);
        copy.setMonth(copy.getMonth() + months);
        return copy;
    };

    const formatEndsIn = (months) => {
        if (typeof months !== "number") return "N/A";
        return `${months} month${months === 1 ? "" : "s"}`;
    };

    // ---------- loading ----------
    if (!warrantyData) {
        return <LoadingSpinner />;
    }

    const {
        equipment_and_services,
        warranty_period,
        vendor,
        client,
        exclusions,
        service_credits,
        confidentiality_protocols,
        warranty_ends, // months until expiry (number)
        disputes_resolved,
        company,
        attachments,
        created_at,
        updated_at,
    } = warrantyData;

    const expiryDate =
        typeof warranty_ends === "number" ? addMonths(created_at, warranty_ends) : null;

    const hasExclusions = Array.isArray(exclusions) && exclusions.length > 0;

    return (
        <Fragment>
            <PageHeader
                currentpage="Warranty Details"
                title="Warranty Details"
                activepage="IT Governance"
                mainpage="Warranty Details"
            />

            <div className="grid grid-cols-12 gap-6">
                {/* Main column */}
                <div className="xl:col-span-9 col-span-12 space-y-6 pb-5">
                    {/* Summary */}
                    <div className="box">
                        <div className="box-header justify-between">
                            <div className="box-title">Warranty Summary</div>
                            <div>
                                <Link
                                    to={`/module/it-governance/warranty/edit/${id}`}
                                    className="ti-btn !py-1 !px-2 !text-[0.75rem] ti-btn-secondary btn-wave"
                                >
                                    <i className="ri-edit-line align-middle me-1 font-semibold"></i>
                                    Edit
                                </Link>
                            </div>
                        </div>
                        <div className="box-body">
                            <div className="grid grid-cols-12 gap-4">
                                {/* Parties */}
                                <div className="xl:col-span-4 col-span-12">
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Vendor
                                            </label>
                                            <p className="text-[0.875rem] font-semibold mb-0">
                                                {vendor || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Client
                                            </label>
                                            <p className="text-[0.875rem] mb-0">{client || "N/A"}</p>
                                        </div>
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Company
                                            </label>
                                            <div className="flex items-center gap-2">
                        <span className="badge bg-primary/10 text-primary">
                          {company?.name || "N/A"}
                        </span>
                                                {company?.id && (
                                                    <span className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                            ID: {company.id}
                          </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Scope */}
                                <div className="xl:col-span-4 col-span-12">
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Equipment & Services
                                            </label>
                                            <p className="text-[0.875rem] mb-0">
                                                {equipment_and_services || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Warranty Period
                                            </label>
                                            <div>
                        <span className={getPeriodBadge(warranty_period)}>
                          {prettyEnum(warranty_period)}
                        </span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Warranty Start
                                            </label>
                                            <p className="text-[0.875rem] mb-0">{formatDate(created_at)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Expiry & Disputes */}
                                <div className="xl:col-span-4 col-span-12">
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Dispute Resolution
                                            </label>
                                            <div>
                        <span className={getDisputeBadge(disputes_resolved)}>
                          {prettyEnum(disputes_resolved)}
                        </span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Warranty Ends In
                                            </label>
                                            <p className="text-[0.875rem] mb-0">
                                                {formatEndsIn(warranty_ends)}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Expiry Date
                                            </label>
                                            <p className="text-[0.875rem] mb-0">
                                                {expiryDate ? formatDate(expiryDate) : "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">Terms & Conditions</div>
                        </div>
                        <div className="box-body">
                            <div className="grid grid-cols-12 gap-4">
                                {/* Confidentiality */}
                                <div className="xl:col-span-6 col-span-12">
                                    <div className="p-4 bg-light rounded">
                                        <div className="flex items-center mb-3">
                      <span className="avatar avatar-sm avatar-rounded bg-info/10 me-2">
                        <i className="ri-shield-check-line text-info text-[1.125rem]"></i>
                      </span>
                                            <h6 className="font-semibold mb-0">Confidentiality Protocols</h6>
                                        </div>
                                        <p className="text-[0.875rem] mb-0">
                                            {confidentiality_protocols || "Not specified"}
                                        </p>
                                    </div>
                                </div>

                                {/* Service Credits */}
                                <div className="xl:col-span-6 col-span-12">
                                    <div className="p-4 bg-light rounded">
                                        <div className="flex items-center mb-3">
                      <span className="avatar avatar-sm avatar-rounded bg-success/10 me-2">
                        <i className="ri-hand-coin-line text-success text-[1.125rem]"></i>
                      </span>
                                            <h6 className="font-semibold mb-0">Service Credits</h6>
                                        </div>
                                        <p className="text-[0.875rem] mb-0">
                                            {service_credits || "Not specified"}
                                        </p>
                                    </div>
                                </div>

                                {/* Exclusions */}
                                <div className="xl:col-span-12 col-span-12">
                                    <div className="p-4 bg-light rounded">
                                        <div className="flex items-center mb-3">
                      <span className="avatar avatar-sm avatar-rounded bg-danger/10 me-2">
                        <i className="ri-error-warning-line text-danger text-[1.125rem]"></i>
                      </span>
                                            <h6 className="font-semibold mb-0">Exclusions</h6>
                                        </div>
                                        {hasExclusions ? (
                                            <div className="flex flex-wrap gap-2">
                                                {exclusions.map((ex, i) => (
                                                    <span
                                                        key={i}
                                                        className="badge bg-danger/10 text-danger text-[0.75rem]"
                                                    >
                            {ex}
                          </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-[0.875rem] mb-0 text-[#8c9097] dark:text-white/50">
                                                No exclusions listed
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="xl:col-span-3 col-span-12 mb-5 space-y-6">
                    {/* Meta */}
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">Record Meta</div>
                        </div>
                        <div className="box-body">
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="me-3">
                    <span className="avatar avatar-sm avatar-rounded bg-primary/10">
                      <i className="ri-calendar-line text-primary text-[1rem]"></i>
                    </span>
                                    </div>
                                    <div className="flex-grow">
                                        <p className="mb-1 text-[0.75rem] font-semibold text-[#8c9097] dark:text-white/50">
                                            Created
                                        </p>
                                        <p className="text-[0.875rem] font-semibold mb-0">
                                            {formatDate(created_at)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="me-3">
                    <span className="avatar avatar-sm avatar-rounded bg-success/10">
                      <i className="ri-refresh-line text-success text-[1rem]"></i>
                    </span>
                                    </div>
                                    <div className="flex-grow">
                                        <p className="mb-1 text-[0.75rem] font-semibold text-[#8c9097] dark:text-white/50">
                                            Last Updated
                                        </p>
                                        <p className="text-[0.875rem] font-semibold mb-0">
                                            {updated_at ? formatDate(updated_at) : "—"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Attachments */}
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">
                                Attachments
                                <span className="badge bg-primary/10 !rounded-full text-primary ms-1">
                  {attachments?.length || 0}
                </span>
                            </div>
                        </div>

                        {!attachments || attachments.length === 0 ? (
                            <div className="box-body">
                                <div className="text-center py-4">
                                    <i className="ri-file-line text-[2rem] text-[#8c9097] dark:text-white/50"></i>
                                    <p className="text-[0.813rem] text-[#8c9097] dark:text-white/50 mt-2">
                                        No attachments available
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <PerfectScrollbar className="box-body max-h-72">
                                <div className="attachments">
                                    <ul className="shared-files list-none">
                                        {attachments.map((attachment, key) => (
                                            <li key={key} className="!mb-4">
                                                <div className="flex items-center">
                                                    <div className="me-2">
                            <span className="shared-file-icon">
                              {attachment.file_type?.startsWith("image") && (
                                  <i className="ri-image-line"></i>
                              )}
                                {attachment.file_type?.startsWith("video") && (
                                    <i className="ri-video-line"></i>
                                )}
                                {(attachment.file_type?.includes("audio") ||
                                    attachment.file_type?.startsWith("audio")) ? (
                                    <i className="ri-user-voice-line"></i>
                                ) : (
                                    !attachment.file_type?.startsWith("image") &&
                                    !attachment.file_type?.startsWith("video") && (
                                        <i className="ti ti-file-text"></i>
                                    )
                                )}
                            </span>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <Link
                                                            className="text-[0.75rem] font-semibold mb-0 dark:text-defaulttextcolor/70"
                                                            aria-label={attachment.file_name}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            to={attachment.file_url}
                                                        >
                                                            {attachment.file_name}
                                                            {attachment.file_extension &&
                                                                `.${attachment.file_extension}`}
                                                        </Link>
                                                        <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.6875rem]">
                                                            {formatDate(attachment.created_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </PerfectScrollbar>
                        )}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default WarrantyDetail;
