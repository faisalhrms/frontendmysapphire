// src/modules/CustomerAssist/components/CustomerAssistDetail.jsx

import React from "react";
import { useParams } from "react-router-dom";
import { useCase } from "@modules/CustomerAssist/hooks/customerAssistHook.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import {
    getStatusTextClass,
    getStatusBadgeClass,
    getStatusOutlinedClass
} from "@modules/CustomerAssist/helpers/CustomerAssistHelper.js";
import {format} from "date-fns";

const CustomerAssistDetail = () => {
    const { id } = useParams();
    const { caseData, isLoading, error } = useCase(id);

    if (isLoading) {
        return <LoadingSpinner />;
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
        cc_resolution,
        created_at,
        updated_at,
    } = caseData;

    // Compute status/priority values and classes
    const statusValue = case_status || "";
    const statusText = toTitleCase(statusValue);
    const statusBadgeClass = getStatusBadgeClass(statusValue, { includeBorder: true, size: "sm" });
    const priorityValue = priority || "";
    const priorityText = toTitleCase(priorityValue);
    const priorityBadgeClass = getStatusBadgeClass(priorityValue, { includeBorder: true, size: "sm" });

    return (
        <>
            <PageHeader
                currentpage="Customer Assist"
                mainpage="Customer Assist"
                activepage="We Care"
                title="Case Details"
            />

            <div className="grid grid-cols-12 gap-6">
                {/* Left Column (9) */}
                <div className="xl:col-span-9 col-span-12">
                    {/* Customer Info */}
                    <div className="box shadow-md rounded-lg mb-6">
                        <div className="box-header bg-white p-4 rounded-t-lg">
                            <div className="box-title text-lg font-semibold">Customer Info</div>
                        </div>
                        <div className="box-body p-6">
                            <div className="flex items-center mb-6">
                                <div
                                    className="bg-gray-100 border-2 border-dashed border-emerald-300 rounded-full w-16 h-16 flex items-center justify-center mr-4">
                                    <i className="ri-user-3-line text-2xl text-gray-500"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">{customer_name}</h3>
                                    <div className="text-gray-600">{email}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-4">
                                    <div className="flex items-center">
                                        <i className="ri-phone-line text-sky-500 text-lg mr-2"></i>
                                        <div>
                                            <div
                                                className="text-sm font-medium text-gray-500 inline-block mr-1">Phone:
                                            </div>
                                            <div className="text-base inline-block">{phone}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-4">
                                    <div className="flex items-center">
                                        <i className="ri-file-list-3-line text-rose-500 text-lg mr-2"></i>
                                        <div>
                                            <div className="text-sm font-medium text-gray-500 inline-block mr-1">Case:
                                            </div>
                                            <div className="text-base inline-block">{case_number}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-4">
                                    <div className="flex items-center">
                                        <i className="ri-calendar-line text-amber-500 text-lg mr-2"></i>
                                        <div>
                                            <div
                                                className="text-sm font-medium text-gray-500 inline-block mr-1">Created:
                                            </div>
                                            <div
                                                className="text-base inline-block"> {format(new Date(created_at), "MMM d, yyyy, h:mm a")}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Case Details */}
                    <div className="box shadow-md rounded-lg mb-6">
                        <div className="box-header bg-white p-4 rounded-t-lg">
                            <div className="box-title text-lg font-semibold">Case Details</div>
                        </div>
                        <div className="box-body p-6">
                            <div className="grid grid-cols-12 gap-6">
                                <div className="col-span-4">
                                    <div className="text-sm font-medium text-gray-500">Case ID</div>
                                    <div className="text-base mt-1">{case_id}</div>
                                </div>
                                <div className="col-span-4">
                                    <div className="text-sm font-medium text-gray-500">Type</div>
                                    <div className="text-base mt-1">{toTitleCase(type)}</div>
                                </div>
                                <div className="col-span-4">
                                    <div className="text-sm font-medium text-gray-500">Status</div>
                                    <div className="text-base mt-1">
                                        <span className={statusBadgeClass}>{statusText}</span>
                                    </div>
                                </div>
                                <div className="col-span-4">
                                    <div className="text-sm font-medium text-gray-500">Reason</div>
                                    <div className="text-base mt-1">{toTitleCase(reason)}</div>
                                </div>
                                <div className="col-span-4">
                                    <div className="text-sm font-medium text-gray-500">Origin</div>
                                    <div className="text-base mt-1">{toTitleCase(origin)}</div>
                                </div>
                                <div className="col-span-4">
                                    <div className="text-sm font-medium text-gray-500">Priority</div>
                                    <div className="text-base mt-1">
                                        <span className={priorityBadgeClass}>{priorityText}</span>
                                    </div>
                                </div>
                                <div className="col-span-12">
                                    <div className="text-sm font-medium text-gray-500">Subject</div>
                                    <div className="text-base mt-1">{subject}</div>
                                </div>
                                <div className="col-span-12">
                                    <div className="text-sm font-medium text-gray-500">Description</div>
                                    <div className="text-base mt-1 whitespace-pre-line p-3 rounded">
                                        {description}
                                    </div>
                                </div>
                                {updated_at && (
                                    <div className="col-span-6">
                                        <div className="text-sm font-medium text-gray-500">Last Updated</div>
                                        <div className="text-base mt-1">{updated_at}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/*{Remarks}*/}
                    <div className="box shadow-md rounded-lg mb-6">
                        <div className="box shadow-md rounded-lg">
                            <div className="box-header p-4 rounded-t-lg">
                                <div className="box-title text-lg font-semibold">Execution Details</div>
                            </div>
                            <div className="box-body p-6">
                                {remarks ? (
                                    <div className=" rounded-lg p-4">
                                        <div className="text-gray-700 whitespace-pre-line">{remarks}</div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <i className="ri-information-line text-2xl mb-2"></i>
                                        <p>No remarks added</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (3) */}
                <div className="xl:col-span-3 col-span-12 space-y-6">
                    {/* Case Additional Details */}
                    <div className="box">
                        <div className="box-header justify-between">
                            <div className="box-title">Case Summary</div>
                        </div>
                        <div className="box-body !p-0">
                            <div className="table-responsive">
                                <table className="table whitespace-nowrap min-w-full">
                                <tbody>
                                                <tr className="border-b border-defaultborder">
                                                    <td className="py-3 px-4">
                                                        <span className="font-semibold">Case Number:</span>
                                                    </td>
                                                    <td className="py-3 px-4">{case_number}</td>
                                                </tr>
                                                <tr className="border-b border-defaultborder">
                                                    <td className="py-3 px-4">
                                                        <span className="font-semibold">Created:</span>
                                                    </td>
                                                    <td className="py-3 px-4">{format(new Date(created_at), "MMM d, yyyy, h:mm a")}</td>
                                                </tr>
                                                {updated_at && (
                                                    <tr className="border-b border-defaultborder">
                                                        <td className="py-3 px-4">
                                                            <span className="font-semibold">Updated:</span>
                                                        </td>
                                                        <td className="py-3 px-4"> {format(new Date(updated_at), "MMM d, yyyy, h:mm a")}</td>
                                                    </tr>
                                                )}
                                                <tr className="border-b border-defaultborder">
                                                    <td className="py-3 px-4">
                                                        <span className="font-semibold">Type:</span>
                                                    </td>
                                                    <td className="py-3 px-4">{toTitleCase(type)}</td>
                                                </tr>
                                                <tr className="border-b border-defaultborder">
                                                    <td className="py-3 px-4">
                                                        <span className="font-semibold">Origin:</span>
                                                    </td>
                                                    <td className="py-3 px-4">{toTitleCase(origin)}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* CC Resolution */}
                                <div className="box shadow-md  rounded-lg mb-6">
                                    <div className="box-header p-4 rounded-t-lg">
                                        <div className="box-title text-lg font-semibold">CC Resolution</div>
                                    </div>
                                    <div className="box-body p-6">
                                        {cc_resolution ? (
                                            <div className="bg-blue-50 rounded-lg p-4">
                                                <div
                                                    className="text-gray-800 font-semibold text-base md:text-md leading-relaxed italic">
                                                    ❝ {cc_resolution} ❞
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                <i className="ri-information-line text-2xl mb-2"></i>
                                                <p>No resolution provided</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                    );
                    };

                    export default CustomerAssistDetail;