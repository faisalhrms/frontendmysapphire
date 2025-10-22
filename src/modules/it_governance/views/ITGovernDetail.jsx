import { Fragment } from "react";
import { useParams, Link } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import PerfectScrollbar from 'react-perfect-scrollbar';
import { formatDate } from "@helpers/dateTime.js";
import "@assets/css/custom/attachment-card.css";
import {useFetchSlaById} from "@modules/it_governance/hooks/useServiceLevelAgreementForm.js";

const ITGovernDetail = () => {
    const { id } = useParams();
    const { slaData } = useFetchSlaById(id);

    const getPriorityBadge = (priority) => {
        const badges = {
            high: 'badge bg-danger/10 text-danger',
            medium: 'badge bg-warning/10 text-warning',
            low: 'badge bg-success/10 text-success'
        };
        return badges[priority] || badges.low;
    };

    const getSupportHoursBadge = (hours) => {
        return hours === 'business_hours'
            ? 'badge bg-primary/10 text-primary'
            : 'badge bg-info/10 text-info';
    };

    const formatTime = (time) => {
        if (!time) return 'N/A';
        const parts = time.split(' ');
        if (parts.length === 2) {
            return `${parts[0]} days ${parts[1]}`;
        }
        return time;
    };

    // Show loading spinner while data is being fetched
    if (!slaData) {
        return <LoadingSpinner />;
    }

    const hasExitDetails = slaData.exit_conditions ||
        slaData.exit_obligations ||
        slaData.early_exit_penalty;

    return (
        <Fragment>
            <PageHeader
                currentpage="Service Level Agreements Details"
                title="Service Level Agreements Details"
                activepage="IT Governance"
                mainpage="Service Level Agreements Details"
            />

            <div className="grid grid-cols-12 gap-6">
                {/* Main column */}
                <div className="xl:col-span-9 col-span-12 space-y-6 pb-5">
                    {/* Vendor Summary */}
                    <div className="box">
                        <div className="box-header justify-between">
                            <div className="box-title">Vendor Summary</div>
                            <div>

                                <Link
                                    to={`/module/it-governance/service-level-agreements/edit/${id}`}

                                    className="ti-btn !py-1 !px-2 !text-[0.75rem] ti-btn-secondary  btn-wave"
                                >
                                    <i className="ri-edit-line align-middle me-1 font-semibold"></i>Edit
                                </Link>
                            </div>
                        </div>
                        <div className="box-body">
                            <div className="grid grid-cols-12 gap-4">
                                {/* Vendor Basic Info */}
                                <div className="xl:col-span-4 col-span-12">
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Vendor Name
                                            </label>
                                            <p className="text-[0.875rem] font-semibold mb-0">
                                                {slaData.vendor_name}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Address
                                            </label>
                                            <p className="text-[0.875rem] mb-0">
                                                {slaData.address}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Phone
                                            </label>
                                            <p className="text-[0.875rem] mb-0">
                                                <a href={`tel:${slaData.phone}`} className="text-primary">
                                                    {slaData.phone}
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Services & Responsibilities */}
                                <div className="xl:col-span-4 col-span-12">
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Services Provided
                                            </label>
                                            <p className="text-[0.875rem] mb-0">
                                                {slaData.services_provided}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Responsibilities
                                            </label>
                                            <p className="text-[0.875rem] mb-0">
                                                {slaData.responsibilities}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Priority
                                            </label>
                                            <div>
                                                <span className={getPriorityBadge(slaData.priority)}>
                                                    {slaData.priority?.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* SLA Overview */}
                                <div className="xl:col-span-4 col-span-12">
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Support Hours
                                            </label>
                                            <div>
                                                <span className={getSupportHoursBadge(slaData.support_hours)}>
                                                    {slaData.support_hours?.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Key Metric
                                            </label>
                                            <p className="text-[0.875rem] mb-0">
                                                {slaData.key_metric?.name || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Review Frequency
                                            </label>
                                            <p className="text-[0.875rem] mb-0">
                                                Every {slaData.review_frequency} months
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Duration & Penalties */}
                                <div className="xl:col-span-12 col-span-12 mt-4">
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="xl:col-span-6 col-span-12">
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Contract Duration
                                            </label>
                                            <p className="text-[0.875rem] mb-0">
                                                {slaData.duration}
                                            </p>
                                        </div>
                                        <div className="xl:col-span-6 col-span-12">
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Penalties
                                            </label>
                                            <p className="text-[0.875rem] mb-0">
                                                {slaData.penalties}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SLA Details & Compliance */}
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">SLA Details & Compliance</div>
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
                                            <h6 className="font-semibold mb-0">Confidentiality Requirements</h6>
                                        </div>
                                        <p className="text-[0.875rem] mb-0">
                                            {slaData.confidentiality_requirement || 'Not specified'}
                                        </p>
                                    </div>
                                </div>

                                {/* Dispute Resolution */}
                                <div className="xl:col-span-6 col-span-12">
                                    <div className="p-4 bg-light rounded">
                                        <div className="flex items-center mb-3">
                                            <span className="avatar avatar-sm avatar-rounded bg-warning/10 me-2">
                                                <i className="ri-scales-line text-warning text-[1.125rem]"></i>
                                            </span>
                                            <h6 className="font-semibold mb-0">Dispute Resolution</h6>
                                        </div>
                                        <p className="text-[0.875rem] mb-0">
                                            {slaData.dispute_resolution || 'Not specified'}
                                        </p>
                                    </div>
                                </div>

                                {/* Exit Clause Reference */}
                                {slaData.exit_clause_reference && (
                                    <div className="xl:col-span-12 col-span-12">
                                        <div className="p-4 bg-light rounded">
                                            <div className="flex items-center mb-3">
                                                <span className="avatar avatar-sm avatar-rounded bg-danger/10 me-2">
                                                    <i className="ri-door-open-line text-danger text-[1.125rem]"></i>
                                                </span>
                                                <h6 className="font-semibold mb-0">Exit Clause Reference</h6>
                                            </div>
                                            <p className="text-[0.875rem] mb-0">
                                                {slaData.exit_clause_reference}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Exit Clause Details */}
                    {hasExitDetails && (
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">Exit Clause Details</div>
                            </div>
                            <div className="box-body">
                                <div className="space-y-4">
                                    {slaData.exit_conditions && (
                                        <div>
                                            <div className="flex items-center mb-2">
              <span className="avatar avatar-xs avatar-rounded bg-primary/10 me-2">
                <i className="ri-file-list-3-line text-primary text-[0.875rem]"></i>
              </span>
                                                <label className="text-[0.875rem] font-semibold mb-0">
                                                    Exit Conditions
                                                </label>
                                            </div>
                                            <div
                                                className="ps-8 text-[0.813rem] text-[#8c9097] dark:text-white/50 mb-0"
                                                dangerouslySetInnerHTML={{ __html: slaData.exit_conditions }}
                                            />
                                        </div>
                                    )}

                                    {slaData.exit_obligations && (
                                        <div>
                                            <div className="flex items-center mb-2">
              <span className="avatar avatar-xs avatar-rounded bg-warning/10 me-2">
                <i className="ri-task-line text-warning text-[0.875rem]"></i>
              </span>
                                                <label className="text-[0.875rem] font-semibold mb-0">
                                                    Exit Obligations
                                                </label>
                                            </div>
                                            <div
                                                className="ps-8 text-[0.813rem] text-[#8c9097] dark:text-white/50 mb-0"
                                                dangerouslySetInnerHTML={{ __html: slaData.exit_obligations }}
                                            />
                                        </div>
                                    )}

                                    {slaData.early_exit_penalty && (
                                        <div>
                                            <div className="flex items-center mb-2">
                                                <span className="avatar avatar-xs avatar-rounded bg-danger/10 me-2">
                                                    <i className="ri-alert-line text-danger text-[0.875rem]"></i>
                                                </span>
                                                <label className="text-[0.875rem] font-semibold mb-0">
                                                    Early Exit Penalty
                                                </label>
                                            </div>
                                            <div className="ps-8">
                                                <p className="text-[0.813rem] text-[#8c9097] dark:text-white/50 mb-0">
                                                    {slaData.early_exit_penalty}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="xl:col-span-3 col-span-12 mb-5 space-y-6">
                    {/* SLA Timelines */}
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">SLA Timelines</div>
                        </div>
                        <div className="box-body">
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="me-3">
                                        <span className="avatar avatar-sm avatar-rounded bg-primary/10">
                                            <i className="ri-time-line text-primary text-[1rem]"></i>
                                        </span>
                                    </div>
                                    <div className="flex-grow">
                                        <p className="mb-1 text-[0.75rem] font-semibold text-[#8c9097] dark:text-white/50">
                                            Response Time
                                        </p>
                                        <p className="text-[0.875rem] font-semibold mb-0">
                                            {formatTime(slaData.response_time)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="me-3">
                                        <span className="avatar avatar-sm avatar-rounded bg-success/10">
                                            <i className="ri-checkbox-circle-line text-success text-[1rem]"></i>
                                        </span>
                                    </div>
                                    <div className="flex-grow">
                                        <p className="mb-1 text-[0.75rem] font-semibold text-[#8c9097] dark:text-white/50">
                                            Resolution Time
                                        </p>
                                        <p className="text-[0.875rem] font-semibold mb-0">
                                            {formatTime(slaData.resolution_time)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="me-3">
                                        <span className="avatar avatar-sm avatar-rounded bg-warning/10">
                                            <i className="ri-calendar-check-line text-warning text-[1rem]"></i>
                                        </span>
                                    </div>
                                    <div className="flex-grow">
                                        <p className="mb-1 text-[0.75rem] font-semibold text-[#8c9097] dark:text-white/50">
                                            Termination Notice Period
                                        </p>
                                        <p className="text-[0.875rem] font-semibold mb-0">
                                            {slaData.termination_notice_period} days
                                        </p>
                                    </div>
                                </div>

                                {slaData.exclusions && slaData.exclusions.length > 0 && (
                                    <div className="flex items-start">
                                        <div className="me-3">
                                            <span className="avatar avatar-sm avatar-rounded bg-danger/10">
                                                <i className="ri-error-warning-line text-danger text-[1rem]"></i>
                                            </span>
                                        </div>
                                        <div className="flex-grow">
                                            <p className="mb-1 text-[0.75rem] font-semibold text-[#8c9097] dark:text-white/50">
                                                Exclusions
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {slaData.exclusions.map((exclusion, index) => (
                                                    <span
                                                        key={index}
                                                        className="badge bg-danger/10 text-danger text-[0.75rem]"
                                                    >
                                                        {exclusion}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Attachments */}
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">
                                Attachments
                                <span className="badge bg-primary/10 !rounded-full text-primary ms-1">
                                    {slaData.attachments?.length || 0}
                                </span>
                            </div>
                        </div>
                        {(!slaData.attachments || slaData.attachments.length === 0) ? (
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
                                        {slaData.attachments.map((attachment, key) => (
                                            <li key={key} className="!mb-4">
                                                <div className="flex items-center">
                                                    <div className="me-2">
                                                        <span className="shared-file-icon">
                                                            {attachment.file_type?.startsWith('image') && (
                                                                <i className="ri-image-line"></i>
                                                            )}
                                                            {attachment.file_type?.startsWith('video') && (
                                                                <i className="ri-video-line"></i>
                                                            )}
                                                            {(attachment.file_type?.includes('audio') ||
                                                                attachment.file_type?.startsWith('audio')) ? (
                                                                <i className="ri-user-voice-line"></i>
                                                            ) : (
                                                                !attachment.file_type?.startsWith('image') &&
                                                                !attachment.file_type?.startsWith('video') && (
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
                                                            {attachment.file_extension && `.${attachment.file_extension}`}
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

export default ITGovernDetail;