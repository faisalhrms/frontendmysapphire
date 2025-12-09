import { Fragment } from "react";
import { useParams, Link } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import PerfectScrollbar from "react-perfect-scrollbar";
import { formatDate } from "@helpers/dateTime.js";
import "@assets/css/custom/attachment-card.css";
import {useEquipmentReplacement} from "@modules/inventory/hooks/inventoryReplaceHooks.js";


const EquipmentReplaceDetail = () => {
    const { id } = useParams();
    const { replacement, loading } = useEquipmentReplacement(id);


    const replacementData = replacement?.data || replacement;

    const getStatusBadge = (status) => {
        const map = {
            in_progress: "badge bg-warning/10 text-warning",
            completed: "badge bg-success/10 text-success",
            pending: "badge bg-info/10 text-info",
            cancelled: "badge bg-danger/10 text-danger",
        };
        return map[status] || "badge bg-light text-default";
    };

    const pretty = (val) => (val === 0 || val ? String(val) : "N/A");

    const formatCost = (v) =>
        (v || v === 0) ? Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "N/A";

    const isImage = (t) =>
        typeof t === "string" && (t === "image" || t.startsWith("image"));

    const isVideo = (t) =>
        typeof t === "string" && (t === "video" || t.startsWith("video"));

    const isAudio = (t) =>
        typeof t === "string" && (t === "audio" || t.includes("audio"));


    if (loading || !replacementData) {
        return <LoadingSpinner />;
    }

    const {
        equipment,
        reason_for_replacement,
        replacement_date,
        maturity_date,
        replacement_cost,
        pr_po_number,
        vendor_details,
        new_equipment_details,
        status,
        replaced_by,
        remarks,
        attachments,
        created_at,
    } = replacementData;

    return (
        <Fragment>
            <PageHeader
                currentpage="Equipment Replacement Details"
                title="Equipment Replacement Details"
                activepage="IT Governance"
                mainpage="Equipment Replacement Details"
            />

            <div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-9 col-span-12 space-y-6 pb-5">
                    <div className="box">
                        <div className="box-header justify-between">
                            <div className="box-title">Replacement Summary</div>
                        </div>
                        <div className="box-body">
                            <div className="grid grid-cols-12 gap-4">
                                <div className="xl:col-span-4 col-span-12">
                                    <div className="space-y-3">
                                        <div className="mb-3">
                                            <span className="badge bg-danger/10 text-danger">Old Equipment</span>
                                        </div>
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Equipment ID
                                            </label>
                                            <p className="text-[0.875rem] font-semibold mb-0">
                                                {pretty(equipment?.id)}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Code
                                            </label>
                                            <p className="text-[0.875rem] mb-0">{pretty(equipment?.code)}</p>
                                        </div>
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Serial No
                                            </label>
                                            <p className="text-[0.875rem] mb-0">{pretty(equipment?.serial_no)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="xl:col-span-4 col-span-12">
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Replacement Reason
                                            </label>
                                            <p className="text-[0.875rem] mb-0">
                                                {pretty(reason_for_replacement)}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Replacement Date
                                            </label>
                                            <p className="text-[0.875rem] mb-0">
                                                {replacement_date ? formatDate(replacement_date) : "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                Maturity Date
                                            </label>
                                            <p className="text-[0.875rem] mb-0">
                                                {maturity_date ? formatDate(maturity_date) : "N/A"}
                                            </p>
                                        </div>
                                        {status && (
                                            <div>
                                                <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                    Status
                                                </label>
                                                <div>
                                                    <span className={getStatusBadge(status)}>
                                                        {String(status || "N/A").replaceAll("_", " ").toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {(replacement_cost || pr_po_number || vendor_details) && (
                                    <div className="xl:col-span-4 col-span-12">
                                        <div className="space-y-3">
                                            {replacement_cost && (
                                                <div>
                                                    <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                        Replacement Cost
                                                    </label>
                                                    <p className="text-[0.875rem] mb-0">{formatCost(replacement_cost)}</p>
                                                </div>
                                            )}
                                            {pr_po_number && (
                                                <div>
                                                    <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                        PR/PO Number
                                                    </label>
                                                    <p className="text-[0.875rem] mb-0">{pretty(pr_po_number)}</p>
                                                </div>
                                            )}
                                            {vendor_details && (
                                                <div>
                                                    <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                        Vendor Details
                                                    </label>
                                                    <p className="text-[0.875rem] mb-0">{pretty(vendor_details)}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {new_equipment_details && (
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">
                                    <span className="badge bg-success/10 text-success me-2">New Equipment</span>
                                    Details
                                </div>
                            </div>
                            <div className="box-body">
                                <div className="space-y-2">
                                    <p className="text-[0.875rem] mb-0 whitespace-pre-wrap">
                                        {new_equipment_details}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    {remarks && (
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">Remarks</div>
                            </div>
                            <div className="box-body">
                                <div className="space-y-2">
                                    <p className="text-[0.875rem] mb-0 whitespace-pre-wrap">
                                        {remarks}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    {replaced_by && (
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">Replaced By</div>
                            </div>
                            <div className="box-body">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="xl:col-span-6 col-span-12">
                                        <div className="space-y-2">
                                            <div>
                                                <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                    Name
                                                </label>
                                                <p className="text-[0.875rem] mb-0">
                                                    {pretty(replaced_by?.full_name)}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                    Email
                                                </label>
                                                <p className="text-[0.875rem] mb-0">
                                                    {replaced_by?.email ? (
                                                        <a className="text-primary" href={`mailto:${replaced_by.email}`}>
                                                            {replaced_by.email}
                                                        </a>
                                                    ) : (
                                                        "N/A"
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="xl:col-span-6 col-span-12">
                                        <div className="space-y-2">
                                            <div>
                                                <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                    User ID
                                                </label>
                                                <p className="text-[0.875rem] mb-0">{pretty(replaced_by?.id)}</p>
                                            </div>
                                            <div>
                                                <label className="text-[0.75rem] text-[#8c9097] dark:text-white/50 font-semibold">
                                                    Created At
                                                </label>
                                                <p className="text-[0.875rem] mb-0">
                                                    {created_at ? formatDate(created_at) : "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="xl:col-span-3 col-span-12 mb-5 space-y-6">
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">Record Meta</div>
                        </div>
                        <div className="box-body">
                            <div className="space-y-4">
                                {status && (
                                    <div className="flex items-start">
                                        <div className="me-3">
                                            <span className="avatar avatar-sm avatar-rounded bg-primary/10">
                                                <i className="ri-refresh-line text-primary text-[1rem]"></i>
                                            </span>
                                        </div>
                                        <div className="flex-grow">
                                            <p className="mb-1 text-[0.75rem] font-semibold text-[#8c9097] dark:text-white/50">
                                                Replacement Status
                                            </p>
                                            <p className="text-[0.875rem] font-semibold mb-0">
                                                <span className={getStatusBadge(status)}>
                                                    {String(status || "N/A").replaceAll("_", " ").toUpperCase()}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start">
                                    <div className="me-3">
                                        <span className="avatar avatar-sm avatar-rounded bg-success/10">
                                            <i className="ri-calendar-line text-success text-[1rem]"></i>
                                        </span>
                                    </div>
                                    <div className="flex-grow">
                                        <p className="mb-1 text-[0.75rem] font-semibold text-[#8c9097] dark:text-white/50">
                                            Created
                                        </p>
                                        <p className="text-[0.875rem] font-semibold mb-0">
                                            {created_at ? formatDate(created_at) : "—"}
                                        </p>
                                    </div>
                                </div>

                                {maturity_date && (
                                    <div className="flex items-start">
                                        <div className="me-3">
                                            <span className="avatar avatar-sm avatar-rounded bg-warning/10">
                                                <i className="ri-calendar-check-line text-warning text-[1rem]"></i>
                                            </span>
                                        </div>
                                        <div className="flex-grow">
                                            <p className="mb-1 text-[0.75rem] font-semibold text-[#8c9097] dark:text-white/50">
                                                Maturity Date
                                            </p>
                                            <p className="text-[0.875rem] font-semibold mb-0">
                                                {formatDate(maturity_date)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
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
                                        {attachments.map((attachment) => (
                                            <li key={attachment.id} className="!mb-4">
                                                <div className="flex items-center">
                                                    <div className="me-2">
                                                        <span className="shared-file-icon">
                                                            {isImage(attachment.file_type) && <i className="ri-image-line"></i>}
                                                            {isVideo(attachment.file_type) && <i className="ri-video-line"></i>}
                                                            {isAudio(attachment.file_type) ? (
                                                                <i className="ri-user-voice-line"></i>
                                                            ) : (
                                                                !isImage(attachment.file_type) &&
                                                                !isVideo(attachment.file_type) && <i className="ti ti-file-text"></i>
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
                                                            {/* No timestamp in sample attachment; omit or add if backend provides */}
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

export default EquipmentReplaceDetail;