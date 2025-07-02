
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import FormTextarea from "@components/form/FormTextarea.jsx";
import FormButton from "@components/form/FormButton.jsx";
import { useCaseForm } from "@modules/CustomerAssist/hooks/customerAssistHook.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import { Link } from "react-router-dom";

// Import status helpers
import {
    normalizeStatus,
    getStatusTextClass,
    getStatusBgClass,
    getStatusBadgeClass,
    getStatusOutlinedClass,
} from "@modules/CustomerAssist/helpers/CustomerAssistHelper.js";
import InfoAlert from "../../../InfoAlert.jsx";

const CustomerAssistMainList = ({ data }) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            remarks: data?.remarks || "",
        },
    });

    const caseId = data?.id || null;
    const { handleCaseSubmit } = useCaseForm(caseId);

    const onSubmit = (formData) => {
        const payload = {
            case_id: data.case_id,
            remarks: formData.remarks,
            case_number: data.case_number,
        };
        handleCaseSubmit(payload);
    };

    useEffect(() => {
        if (data) {
            reset({
                remarks: data.remarks || "",
            });
        }
    }, [data, reset]);

    if (!data) {
        return <LoadingSpinner />;
    }

    // Determine if case exists in our DB
    const existInOurDb = data?.exist_in_our_db === true;

    // Compute status/priority values and classes
    const statusValue = data.case_status || data.status || "";
    const statusText = toTitleCase(statusValue);

    const statusTextClass = getStatusTextClass(statusValue); // text-only
    const statusBgOnlyClass = `${getStatusBgClass(statusValue)} ${statusTextClass} px-2 py-1 rounded`; // bg+text
    const statusBadgeClass = getStatusBadgeClass(statusValue, { includeBorder: true, size: "sm" }); // badge
    const statusOutlinedClass = getStatusOutlinedClass(statusValue, { size: "sm" }); // outlined pill

    const priorityValue = data.priority || "";
    const priorityText = toTitleCase(priorityValue);
    const priorityBadgeClass = getStatusBadgeClass(priorityValue, { includeBorder: true, size: "sm" });
    const priorityOutlinedClass = getStatusOutlinedClass(priorityValue, { size: "sm" });
    const priorityTextClass = getStatusTextClass(priorityValue);
    const priorityBgOnlyClass = `${getStatusBgClass(priorityValue)} ${priorityTextClass} px-2 py-1 rounded`;

    return (
        <>
            {/* Example PageHeader usage if desired */}
            {/* <PageHeader title="Customer Assist Details" /> */}
            <div className="grid grid-cols-12 gap-6">
                {/* Left Column (9) */}
                <div className="xl:col-span-9 col-span-12">
                    {/*/!* Customer Info *!/*/}
                    {/*<div className="box shadow-md rounded-lg mb-6">*/}
                    {/*    <div className="box-header bg-white p-4 rounded-t-lg">*/}
                    {/*        <div className="box-title text-lg font-semibold">Customer Info</div>*/}
                    {/*    </div>*/}
                    {/*    <div className="box-body p-6">*/}

                    {/*        <div className="grid grid-cols-12 gap-4">*/}
                    {/*            <div className="col-span-4">*/}
                    {/*                <div className="flex items-center">*/}
                    {/*                    <i className="ri-user-line text-rose-500 text-lg mr-2"></i>*/}
                    {/*                    <div className="flex items-center text-sm max-w-[230px] truncate cursor-pointer"*/}
                    {/*                         title={data.customer_name}>*/}
                    {/*                        <span className="font-medium text-gray-500 mr-1">Name:</span>*/}
                    {/*                        <span className="truncate">{data.customer_name}</span>*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}

                    {/*            <div className="col-span-4">*/}
                    {/*                <div className="flex items-center">*/}
                    {/*                    <i className="ri-mail-line text-amber-500 text-lg mr-2"></i>*/}
                    {/*                    <div className="flex items-center text-sm max-w-[230px] truncate cursor-pointer"*/}
                    {/*                         title={data.email}>*/}
                    {/*                        <span className="font-medium text-gray-500 mr-1">Email:</span>*/}
                    {/*                        <span className="truncate">{data.email}</span>*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}

                    {/*            <div className="col-span-4">*/}
                    {/*                <div className="flex items-center">*/}
                    {/*                    <i className="ri-phone-line text-sky-500 text-lg mr-2"></i>*/}
                    {/*                    <div>*/}
                    {/*                        <div*/}
                    {/*                            className="text-sm font-medium text-gray-500 inline-block mr-1">Phone:*/}
                    {/*                        </div>*/}
                    {/*                        <div className="text-sm inline-block">{data.phone}</div>*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}


                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/* Case Details */}
                    <div className="box shadow-md rounded-lg mb-6">
                        <div className="box-header bg-white p-4 rounded-t-lg">
                            <div className="box-title text-lg font-semibold">Case Details</div>
                        </div>
                        <div className="box-body p-6">
                            <div className="grid grid-cols-12 gap-6">
                                <div className="col-span-12">
                                    <div className="text-sm font-medium text-gray-500">Subject</div>
                                    <div className="text-base mt-1">{data.subject}</div>
                                </div>
                                <div className="col-span-12">
                                    <div className="text-sm font-medium text-gray-500">Description</div>
                                    <div className="text-base mt-1 whitespace-pre-line">{data.description}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="box shadow-md rounded-lg mb-6">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="box shadow-md rounded-lg">
                                <div className="box-header p-4 rounded-t-lg">
                                    <div className="box-title text-lg font-semibold">Execution Details</div>
                                </div>
                                <div className="box-body p-6">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <FormTextarea
                                                name="remarks"
                                                control={control}
                                                errors={errors}
                                                placeholder="Remarks"
                                                rows={4}
                                                disabled={data?.exist_in_our_db}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {!data?.exist_in_our_db && (
                                    <div className="box-footer p-4  rounded-b-lg">
                                        <div className="flex justify-end">
                                            <FormButton
                                                isLoading={isSubmitting}
                                                text="Update Remarks"
                                                submitTxt="Updating..."
                                                className="ti-btn ti-btn-primary ti-btn-md"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column (3) */}
                <div className="xl:col-span-3 col-span-12 space-y-6">
                    <div className="box">
                        <div className="box-header justify-between">
                            <div className="box-title">Customer Info</div>
                            <Link
                                aria-label="anchor"
                                className="hs-collapse-toggle inline-flex items-center gap-x-2"
                                to="#"
                                id="case-additional-detail-collapse"
                                data-hs-collapse="#case-additional-detail-collapse-heading"
                            >
                                <svg
                                    className="hs-collapse-open:rotate-180 w-2.5 h-2.5"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </Link>
                        </div>
                        <div
                            id="case-additional-detail-collapse-heading"
                            className="hs-collapse w-full overflow-hidden transition-[height] duration-300"
                            aria-labelledby="case-additional-detail-collapse"
                        >
                            <div className="box-body !p-0">
                                <div className="table-responsive">
                                    <table className="table whitespace-nowrap min-w-full">
                                        <tbody>
                                        <tr className="border-b border-defaultborder">
                                            <td className="py-3 px-4">
                                                <span className="font-semibold">Customer Name:</span>
                                            </td>
                                            <td className="py-3 px-4">{data.customer_name}</td>
                                        </tr>
                                        <tr className="border-b border-defaultborder">
                                            <td className="py-3 px-4">
                                                <span className="font-semibold">Email:</span>
                                            </td>
                                            <td className="py-3 px-4">{data.email}</td>
                                        </tr>
                                        <tr className="border-b border-defaultborder">
                                            <td className="py-3 px-4">
                                                <span className="font-semibold">Phone:</span>
                                            </td>
                                            <td className="py-3 px-4">{data.phone}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Case Additional Details */}

                    <div className="box">
                        <div className="box-header justify-between">
                            <div className="box-title">Case Additional Details</div>
                            <Link
                                aria-label="anchor"
                                className="hs-collapse-toggle inline-flex items-center gap-x-2"
                                to="#"
                                id="case-additional-detail-collapse"
                                data-hs-collapse="#case-additional-detail-collapse-heading"
                            >
                                <svg
                                    className="hs-collapse-open:rotate-180 w-2.5 h-2.5"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </Link>
                        </div>
                        <div
                            id="case-additional-detail-collapse-heading"
                            className="hs-collapse w-full overflow-hidden transition-[height] duration-300"
                            aria-labelledby="case-additional-detail-collapse"
                        >
                            <div className="box-body !p-0">
                                <div className="table-responsive">
                                    <table className="table whitespace-nowrap min-w-full">
                                        <tbody>
                                        <tr className="border-b border-defaultborder">
                                            <td className="py-3 px-4">
                                                <span className="font-semibold">Case Number:</span>
                                            </td>
                                            <td className="py-3 px-4">{data.case_number}</td>
                                        </tr>
                                        <tr className="border-b border-defaultborder">
                                            <td className="py-3 px-4">
                                                <span className="font-semibold">Order Number:</span>
                                            </td>
                                            <td className="py-3 px-4">{data.order_number}</td>
                                        </tr>
                                        <tr className="border-b border-defaultborder">
                                            <td className="py-3 px-4">
                                                <span className="font-semibold">Reason:</span>
                                            </td>
                                            <td className="py-3 px-4">{data.reason}</td>
                                        </tr>
                                        <tr className="border-b border-defaultborder">
                                            <td className="py-3 px-4">
                                                <span className="font-semibold">Status:</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                {/* Full badge */}
                                                <span className={statusBadgeClass}>{statusText}</span>
                                            </td>
                                        </tr>
                                        <tr className="border-b border-defaultborder">
                                            <td className="py-3 px-4">
                                                <span className="font-semibold">Type:</span>
                                            </td>
                                            <td className="py-3 px-4">{toTitleCase(data.type)}</td>
                                        </tr>
                                        <tr className="border-b border-defaultborder">
                                            <td className="py-3 px-4">
                                                <span className="font-semibold">Priority:</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                {/* Badge */}
                                                <span className={priorityBadgeClass}>{priorityText}</span>
                                            </td>
                                        </tr>
                                        <tr className="border-b border-defaultborder">
                                            <td className="py-3 px-4">
                                                <span className="font-semibold">Origin:</span>
                                            </td>
                                            <td className="py-3 px-4">{toTitleCase(data.origin)}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="box shadow-md  rounded-lg mb-6">
                        <div className="box-header p-4 rounded-t-lg">
                            <div className="box-title text-lg font-semibold">CC Resolution</div>
                        </div>
                        <div className="box-body p-6">
                            {data.cc_resolution ? (
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <div
                                        className="text-gray-800 font-semibold text-base md:text-md leading-relaxed italic">
                                        ❝ {data.cc_resolution} ❞
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


                    {/* Execution Details (Form) */}

                </div>
            </div>
        </>
    );
};

export default CustomerAssistMainList;
