// @modules/dms/views/DmsList.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "@components/datatable/DataTable.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { FileText, Download } from "lucide-react";
import Notify from "@helpers/toastNotifications.js";
import { downloadDmsJournalReport } from "@modules/dms/hooks/dmsHook.js";

const renderIcon = (attachment) => {
    const { file_type } = attachment || {};
    if (!file_type) return <i className="ti ti-file-text" />;
    if (file_type.startsWith("image")) return <i className="ri-image-line" />;
    if (file_type.startsWith("video")) return <i className="ri-video-line" />;
    if (file_type.startsWith("audio")) return <i className="ri-user-voice-line" />;
    return <i className="ti ti-file-text" />;
};

const DmsList = () => {
    // track per-row downloading state (by voucher no)
    const [downloading, setDownloading] = useState({});

    const columns = [
        {
            Header: "Voucher Number",
            accessor: "doc_sequence_value",
            filterable: true,
            filterType: "text",
            Cell: ({ value }) => (value ? value : "N/A"),
        },
        {
            Header: "Attachments",
            accessor: "attachments",
            disableSortBy: true,
            Cell: ({ row }) => {
                const attachments = row.original.attachments || [];
                if (!attachments.length) return "N/A";
                return (
                    <div className="flex space-x-2">
                        {attachments.map((att) => (
                            <a
                                key={att.id}
                                href={att.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={`${att.file_name}.${att.file_extension}`}
                                className="text-xl hover:text-primary"
                            >
                                {renderIcon(att)}
                            </a>
                        ))}
                    </div>
                );
            },
        },
        {
            Header: "Download",
            accessor: "id",
            disableSortBy: true,
            Cell: ({ row }) => {
                const { doc_sequence_value } = row.original;
                const isBusy = !!downloading[doc_sequence_value];

                const onDownload = async () => {
                    if (!doc_sequence_value) {
                        Notify.error("Missing voucher number (doc_sequence_value).");
                        return;
                    }
                    try {
                        setDownloading((s) => ({ ...s, [doc_sequence_value]: true }));
                        const blob = await downloadDmsJournalReport(doc_sequence_value);

                        // Create a local download without navigation
                        const fileName = `Journal_${doc_sequence_value}.pdf`;
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = fileName;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        URL.revokeObjectURL(url);
                    } catch (_) {
                        // Notify handled in service; nothing else to do
                    } finally {
                        setDownloading((s) => {
                            const n = { ...s };
                            delete n[doc_sequence_value];
                            return n;
                        });
                    }
                };

                return (
                    <button
                        type="button"
                        onClick={onDownload}
                        className={`ti-btn ti-btn-primary ti-btn-md flex items-center justify-center !p-2 ${
                            isBusy ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                        title="Download Journal PDF"
                        disabled={isBusy}
                    >
                        <Download size={22} strokeWidth={2.2} />
                        {isBusy && <span className="ml-2 text-xs">Preparing…</span>}
                    </button>
                );
            },
        },
    ];

    return (
        <>
            <IconPageHeader
                heading="PF Contribution Attachments"
                description="List of vouchers with their attached documents."
                icon={FileText}
            />
            <DataTable
                columns={columns}
                title="DMS"
                apiUrl="/dms-journals/datatable/"
                needHeader={false}
                enableAdvancedFilters={true}
            />
        </>
    );
};

export default DmsList;
