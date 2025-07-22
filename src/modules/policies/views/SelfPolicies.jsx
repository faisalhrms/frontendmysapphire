import React, {useState} from "react";
import {useSelfPolicies} from "../hooks/policyHooks.js";
import PdfModalViewer from "../components/PdfModalViewer.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {FileText, Eye, Search, Calendar, User, Shield, Package} from "lucide-react";
import {formatDate} from "@helpers/dateTime.js";
import EmptyState from "@components/EmptyState.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const SelfPolicies = () => {
    const { data: policies, isLoading } = useSelfPolicies();
    const [modal, setModal] = useState({
        open:   false,
        fileId: null,
    });
    const [searchTerm, setSearchTerm] = useState("");

    const openModal = (id) => {
        setModal({ open: true, fileId: id });
    };
    const filteredPolicies = policies?.filter(policy => {
        return policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            policy.description.toLowerCase().includes(searchTerm.toLowerCase());
    }) || [];

    return (
        <>
            <IconPageHeader
                heading="Company Policies"
                description="Browse and access organizational policies, guidelines, and compliance documents."
                icon={Shield}
            />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                                    <input
                                        type="text"
                                        placeholder="Search policies..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        {
                            isLoading ?
                            <LoadingSpinner /> :
                                <>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {filteredPolicies.map((policy) => (
                                            <div key={policy.id}
                                                 className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                                <div className="p-6">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex items-center space-x-3">
                                                            <div
                                                                className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                                                                <FileText className="h-5 w-5 text-primary"/>
                                                            </div>
                                                            <div>
                                                                <h3 className="text-lg font-semibold text-gray-900">{policy.title}</h3>
                                                                <p className="text-sm text-gray-500">
                                                                    {policy.attachment_ids?.length > 0 ? `${policy.attachment_ids.length} document${policy.attachment_ids.length !== 1 ? 's' : ''}` : 'No attachments'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <p className="text-gray-600 text-sm mb-4">{policy.description}</p>

                                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                                        <div className="flex items-center space-x-4">
                                                            {
                                                                policy.updated_at &&
                                                                <div className="flex items-center">
                                                                    <Calendar className="h-4 w-4 mr-1"/>
                                                                    <span>Updated {formatDate(policy.updated_at)}</span>
                                                                </div>
                                                            }
                                                            <div className="flex items-center">
                                                                <User className="h-4 w-4 mr-1"/>
                                                                <span>Created {formatDate(policy.created_at)}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-500">
                                            {policy.attachment_ids?.length || 0} attachment{policy.attachment_ids?.length !== 1 ? 's' : ''}
                                        </span>
                                                        </div>

                                                        <div className="flex space-x-2">
                                                            {policy.attachment_ids?.length > 0 && (
                                                                <>
                                                                    {policy.attachment_ids.map((id) => (
                                                                        <button
                                                                            key={id}
                                                                            onClick={() => openModal(id)}
                                                                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                                        >
                                                                            <Eye className="h-3 w-3 mr-1"/>
                                                                            View
                                                                        </button>
                                                                    ))}
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {filteredPolicies.length === 0 && (
                                        <EmptyState
                                            icon={Shield}
                                            heading="No policies available"
                                            description="Try adjusting your search or filter criteria."
                                        />
                                    )}
                                </>
                        }
                    </div>
                </div>
                    <PdfModalViewer
                        isOpen={modal.open}
                        fileId={modal.fileId}
                        onClose={() => setModal({open: false, fileId: null})}
                    />
                </>
                );
                };

                export default SelfPolicies;
