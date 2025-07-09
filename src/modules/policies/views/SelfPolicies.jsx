import React, { useState } from "react";
import { useSelfPolicies } from "../hooks/policyHooks.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import InfoAlert from "../../../InfoAlert.jsx";
import PdfModalViewer from "../components/PdfModalViewer.jsx";

const SelfPolicies = () => {
    const { data: policies, loading } = useSelfPolicies();
    const [pdfModal, setPdfModal] = useState({
        open: false,
        fileUrl: "",
        fileName: ""
    });

    const renderIcon = (attachment) => {
        const { file_type } = attachment;
        if (file_type.startsWith("image")) return <i className="ri-image-line" />;
        if (file_type.startsWith("video")) return <i className="ri-video-line" />;
        if (file_type.startsWith("audio")) return <i className="ri-user-voice-line" />;
        return <i className="ti ti-file-text" />;
    };

    return (
        <>
            <PageHeader currentpage="My Policies" mainpage="Policies" activepage="My Policies" />
            <InfoAlert />
            <div className="overflow-x-auto p-2">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="min-w-full text-sm text-left border">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Title</th>
                            <th className="p-2 border">Description</th>
                            <th className="p-2 border">Attachments</th>
                        </tr>
                        </thead>
                        <tbody>
                        {policies.map((policy) => (
                            <tr key={policy.id} className="hover:bg-gray-50">
                                <td className="p-2 border">{policy.title}</td>
                                <td className="p-2 border">{policy.description}</td>
                                <td className="p-2 border">
                                    {policy.attachments.length > 0 ? (
                                        <div className="flex space-x-2">
                                            {policy.attachments.map((att, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() =>
                                                        setPdfModal({
                                                            open: true,
                                                            fileUrl: att.file_url,
                                                            fileName: `${att.file_name}.${att.file_extension}`,
                                                        })
                                                    }
                                                    title={`${att.file_name}.${att.file_extension}`}
                                                    className="text-xl hover:text-primary"
                                                >
                                                    {renderIcon(att)}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        "N/A"
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
            <PdfModalViewer
                isOpen={pdfModal.open}
                fileUrl={pdfModal.fileUrl}
                fileName={pdfModal.fileName}
                onClose={() => setPdfModal({ open: false, fileUrl: "", fileName: "" })}
            />
        </>
    );
};

export default SelfPolicies;
