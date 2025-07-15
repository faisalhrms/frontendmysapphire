import React, { useState } from "react";
import { useSelfPolicies } from "../hooks/policyHooks.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import InfoAlert from "../../../InfoAlert.jsx";
import PdfModalViewer from "../components/PdfModalViewer.jsx";

const SelfPolicies = () => {
    const { data: policies, loading } = useSelfPolicies();
    const [modal, setModal] = useState({
        open:   false,
        fileId: null,
    });

    const openModal = (id) => {
        setModal({ open: true, fileId: id });
    };

    return (
        <>
            <PageHeader
                currentpage="Policies"
                mainpage="Policies"
                activepage="Policies"
            />
            <InfoAlert />

            <div className="bg-white rounded-lg overflow-x-auto p-2">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="min-w-full text-sm text-left border">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="p-4 border">Title</th>
                            <th className="p-4 border">Description</th>
                            <th className="p-4 border">Attachments</th>
                        </tr>
                        </thead>
                        <tbody>
                        {policies.map((policy) => (
                            <tr key={policy.id} className="hover:bg-gray-50">
                                <td className="p-2 border">{policy.title}</td>
                                <td className="p-2 border">{policy.description}</td>
                                <td className="p-2 border">
                                    {policy.attachment_ids.length > 0 ? (
                                        <div className="flex space-x-2">
                                            {policy.attachment_ids.map((id) => (
                                                <button
                                                    key={id}
                                                    onClick={() => openModal(id)}
                                                    title="View attachment"
                                                    className="ti-btn ti-btn-success ti-btn-sm text-xl hover:text-primary"
                                                >
                                                    <i className="ti ti-file-text" />
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
                isOpen={modal.open}
                // we'll handle POSTing fileId inside the modal later
                fileId={modal.fileId}
                onClose={() => setModal({ open: false, fileId: null })}
            />
        </>
    );
};

export default SelfPolicies;
