// src/modules/CustomerAssist/components/CustomerAssistDetail.jsx

import React from "react";
import { useParams } from "react-router-dom";
import { useCase } from "@modules/CustomerAssist/hooks/customerAssistHook.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";

const CustomerAssistDetail = () => {
    const { id } = useParams();  // assumes route like "/customer-assist/detail/:id"
    const { caseData, isLoading, error } = useCase(id);

    if (isLoading) {
        return (
          <LoadingSpinner/>
        );
    }
    if (error) {
        return (
            <div className="p-4">
                <p className="text-red-600">Error: {error}</p>
            </div>
        );
    }
    if (!caseData) {
        return (
            <div className="p-4">
                <p>No case found with ID: {id}</p>
            </div>
        );
    }

    // Destructure fields from caseData. Adjust field names if needed.
    const {
        case_id,
        case_number,
        customer_name,
        email,
        phone,
        type,
        case_status,
        reason,
        origin,
        subject,
        priority,
        description,
        remarks,
        cc_resolution,// existing remarks, if any
        created_at,
        updated_at,
    } = caseData;

    // Format dates if desired; you can import a helper, e.g.:
    // import { formatDate } from "@helpers/dateTime.js";
    // const formattedCreated = formatDate(created_at, "MMM dd, yyyy - HH:mm");

    return (
        <>
            <PageHeader currentpage="Customer Assist" mainpage="Customer Assist"  activepage="We Care" />

            <div className="p-4 my-4 bg-white shadow-md rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Customer Case Details</h2>
                <div className="grid grid-cols-12 gap-6">
                    {/* Case ID */}
                    <div className="col-span-4">
                        <label className="block text-sm font-medium text-gray-700">Case ID</label>
                        <div className="mt-1 text-gray-900">{case_id}</div>
                    </div>
                    {/* Case Number */}
                    <div className="col-span-4">
                        <label className="block text-sm font-medium text-gray-700">Case Number</label>
                        <div className="mt-1 text-gray-900">{case_number}</div>
                    </div>
                    {/* Customer Name */}
                    <div className="col-span-4">
                        <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                        <div className="mt-1 text-gray-900">{customer_name}</div>
                    </div>
                    {/* Email */}
                    <div className="col-span-4">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <div className="mt-1 text-gray-900">{email}</div>
                    </div>
                    {/* Phone */}
                    <div className="col-span-4">
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <div className="mt-1 text-gray-900">{phone}</div>
                    </div>
                    {/* Type */}
                    <div className="col-span-4">
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <div className="mt-1 text-gray-900">{type}</div>
                    </div>
                    {/* Case Status */}
                    <div className="col-span-4">
                        <label className="block text-sm font-medium text-gray-700">Case Status</label>
                        <div className="mt-1 text-gray-900">{case_status}</div>
                    </div>
                    {/* Reason */}
                    <div className="col-span-4">
                        <label className="block text-sm font-medium text-gray-700">Reason</label>
                        <div className="mt-1 text-gray-900">{reason}</div>
                    </div>
                    {/* Origin */}
                    <div className="col-span-4">
                        <label className="block text-sm font-medium text-gray-700">Origin</label>
                        <div className="mt-1 text-gray-900">{origin}</div>
                    </div>
                    {/* Subject */}
                    <div className="col-span-4">
                        <label className="block text-sm font-medium text-gray-700">Subject</label>
                        <div className="mt-1 text-gray-900">{subject}</div>
                    </div>
                    {/* Priority */}
                    <div className="col-span-4">
                        <label className="block text-sm font-medium text-gray-700">Priority</label>
                        <div className="mt-1 text-gray-900">{priority}</div>
                    </div>
                    {/* Created At */}
                    {created_at && (
                        <div className="col-span-4">
                            <label className="block text-sm font-medium text-gray-700">Created At</label>
                            <div className="mt-1 text-gray-900">{created_at}</div>
                        </div>
                    )}
                    {/* Updated At */}
                    {updated_at && (
                        <div className="col-span-4">
                            <label className="block text-sm font-medium text-gray-700">Updated At</label>
                            <div className="mt-1 text-gray-900">{updated_at}</div>
                        </div>
                    )}
                    {/* Description */}
                    <div className="col-span-12">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <div className="mt-1 whitespace-pre-wrap text-gray-900 bg-gray-50 p-2 rounded">
                            {description}
                        </div>
                    </div>
                    {/* Remarks (existing) */}

                        {remarks != null && (
                            <div className="col-span-6">
                                <label className="block text-sm font-medium text-gray-700">Remarks</label>
                                <div className="mt-1 whitespace-pre-wrap text-gray-900 bg-gray-50 p-2 rounded">
                                    {remarks}
                                </div>
                            </div>
                        )}
                        <div className="col-span-6">
                            <label className="block text-sm font-medium text-gray-700">CC Resolution</label>
                            <div className="mt-1 whitespace-pre-wrap text-gray-900 bg-gray-50 p-2 rounded">
                                {cc_resolution}
                            </div>
                        </div>

                    

                </div>
            </div>
        </>

    );
};

export default CustomerAssistDetail;
