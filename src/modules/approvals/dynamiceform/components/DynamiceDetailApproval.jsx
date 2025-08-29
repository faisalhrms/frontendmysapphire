import React, { useState, useEffect } from "react";
import api from "@config/axiosConfig.js";
import {useParams} from "react-router-dom";

const DynamiceDetailApproval = () => {
    const [formData, setFormData] = useState(null);
    const {id} = useParams();
    console.log(id);

    const fontFamilyOptions = [
        { label: "Inter (Default)", value: "Inter, sans-serif" },
        { label: "Arial", value: "Arial, sans-serif" },
        { label: "Helvetica", value: "Helvetica, sans-serif" },
        { label: "Georgia", value: "Georgia, serif" },
        { label: "Times New Roman", value: "Times New Roman, serif" },
    ];

    useEffect(() => {
        const fetchFormData = async () => {
            const apiResponse = await api.get(`/forms/${id}/`);
            console.log(apiResponse);
            setFormData(apiResponse?.data?.data);
        };
        fetchFormData();
    }, [id]);

    if (!formData) return <p className="p-6"></p>;

    return (
        <div className="box">
             <div className="box-body ">
                 <ul className=" list-group list-group-flush list-none !rounded-md space-y-6">

                <li className="list-group-item bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-primary/80 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold dark:text-gray-200 dark:bg-bodybg  mb-1">Form Title</h3>
                            <div className="bg-white px-4 py-3 rounded-lg border-l-4 border-gray-500 dark:text-gray-200 dark:bg-bodybg ">
                                <p className="text-lg font-medium text-gray-800 leading-relaxed dark:text-gray-200 dark:bg-bodybg ">
                                    {formData.title}
                                </p>
                            </div>
                        </div>
                    </div>
                </li>

                <li className="list-group-item">
                    <div className="grid grid-cols-12 xl:gap-x-[3rem] gap-y-4">
                        <div className="xl:col-span-4 col-span-12">
                            <h3 className="text-base font-semibold text-gray-900">Configure</h3>
                            <p className="text-xs text-gray-500">
                                Customize the appearance and expiry settings of your interface.
                            </p>
                        </div>

                        <div className="xl:col-span-8 col-span-12">
                            <div className="grid grid-cols-12 xl:gap-x-[3rem] gap-y-4">
                                {/* Primary Color */}
                                <div className="xl:col-span-12 col-span-12 flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-semibold">Primary Color</p>
                                        <p className="text-xs text-gray-500">
                                            Customize primary colors to align the interface with your brand
                                            identity.
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-base font-mono bg-white px-2 py-1 rounded border dark:text-gray-200 dark:bg-bodybg">
                                            {formData.primary_color}
                                        </span>
                                        <div
                                            className="w-8 h-8 rounded-lg border-2 border-white shadow-md"
                                            style={{backgroundColor: formData.primary_color}}
                                        ></div>
                                    </div>
                                </div>

                                <div className="xl:col-span-12 col-span-12 flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-semibold">Font Family</p>
                                        <p className="text-xs text-gray-500">
                                            Choose a font style to match your brand&apos;s visual tone and
                                            readability.
                                        </p>
                                    </div>
                                    <div>
                                        <p className="h-8 text-base rounded bg-purple-600">{formData.font_family}</p>
                                    </div>
                                </div>

                                {/* Expired At */}
                                <div className="xl:col-span-12 col-span-12 flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-semibold">Expired At</p>
                                        <p className="text-xs text-gray-500">
                                            Set the expiration date to automatically disable the feature after a
                                            specific time.
                                        </p>
                                    </div>
                                    <p className="text-base font-mono">{formData.expired_at}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>

                <li className="list-group-item">
                    <div className="grid grid-cols-12 xl:gap-x-[3rem] gap-y-4">
                        <div className="xl:col-span-4 col-span-12">
                            <h3 className="text-base font-semibold text-gray-900">Security</h3>
                            <p className="text-xs text-gray-500">
                                Manage account protection, access rules, and alerts.
                            </p>
                        </div>

                        <div className="xl:col-span-8 col-span-12">
                            <div className="grid grid-cols-12 xl:gap-x-[3rem] gap-y-4">
                                {[
                                    {
                                        label: "Is Active",
                                        desc: "Toggle to enable or disable this feature or module.",
                                        value: formData.is_active
                                    },
                                    {
                                        label: "For Authenticated User",
                                        desc: "Restrict access to only logged-in or authenticated users.",
                                        value: formData.authenticated_only
                                    },
                                    {
                                        label: "Require Captcha",
                                        desc: "Enable CAPTCHA verification to prevent spam and ensure real users.",
                                        value: formData.require_captcha
                                    },
                                    {
                                        label: "Enable Submission Alerts",
                                        desc: "Get alerts when a new submission is received.",
                                        value: formData.enable_submission_alerts
                                    },
                                    {
                                        label: "Require Approval",
                                        desc: "Ensure this form goes through approval before becoming visible.",
                                        value: formData.require_approval
                                    },
                                ].map((item) => (
                                    <div key={item.label}
                                         className="xl:col-span-12 col-span-12 flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-semibold">{item.label}</p>
                                            <p className="text-xs text-gray-500">{item.desc}</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={item.value}
                                            readOnly
                                            className="w-5 h-5 accent-indigo-600 cursor-not-allowed"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </li>

                <li className="list-group-item">
                    <div className="grid grid-cols-12 xl:gap-x-[3rem] gap-y-4">
                        <div className="xl:col-span-4 col-span-12">
                            <h3 className="text-base font-semibold text-gray-900">
                                Coupon Discount Settings
                            </h3>
                            <p className="text-xs text-gray-500">
                                Customize Coupon discount options, eligibility rules, and notifications.
                            </p>
                        </div>
                        <div className="xl:col-span-8 col-span-12 flex justify-between items-center">
                            <p className="text-sm font-semibold">{formData.enable_coupon ? 'Enabled' : 'Disabled'}</p>
                            <input
                                type="checkbox"
                                checked={formData.enable_coupon}
                                readOnly
                                className="w-5 h-5 accent-indigo-600 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </li>

                {formData?.enable_coupon && (<div
                    className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 sm:col-span-12 col-span-12">
                    <div className="space-y-2">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="w-full md:w-1/3">
                                <p className="text-sm font-semibold">Select Country</p>
                                <p className="text-xs text-gray-500">

                                </p>
                            </div>
                            <div className="w-full md:w-1/3">
                                <p className="text-sm font-semibold">Select Coupon Type</p>
                                <p className="text-xs text-gray-500">
                                    {formData.coupon_type}
                                </p>
                            </div>
                            <div className="w-full md:w-1/3">
                                <p className="text-sm font-semibold">Select Discount Type</p>
                                <p className="text-xs text-gray-500">
                                    {formData.coupon_discount_type}
                                </p>
                            </div>
                        </div>
                        <div
                            className="flex flex-col md:flex-row gap-4">
                            <div className="w-full md:w-1/3">
                                <p className="text-sm font-semibold">Discount Amount / Percentage</p>
                                <p className="text-xs text-gray-500">
                                    {formData.coupon_discount_amount}
                                </p>
                            </div>

                            <div className="w-full md:w-1/3">
                                <p className="text-sm font-semibold">Min Order Value (for threshold)</p>
                                <p className="text-xs text-gray-500">
                                    {formData.coupon_min_order_value}
                                </p>
                            </div>

                            <div className="w-full md:w-1/3">
                                <p className="text-sm font-semibold">Coupon Validity (in days)</p>
                                <p className="text-xs text-gray-500">
                                    {formData.coupon_valid_days}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>)}

                <li className="list-group-item">
                    <div className="grid grid-cols-12 xl:gap-x-[3rem] gap-y-4">
                        <div className="xl:col-span-4 col-span-12">
                            <p className="text-[1rem] mb-1 font-semibold">Send Email to Submitter</p>
                            <p className="text-[0.75rem] mb-0 text-[#8c9097] dark:text-white/50">
                                Automatically send a confirmation or notification email to the form submitter.
                            </p>
                        </div>
                        <div className="xl:col-span-8 col-span-12 flex justify-between items-center">
                            <p className="text-sm font-semibold">{formData?.send_email ? 'Enabled' : 'Disabled'}</p>
                            <input
                                type="checkbox"
                                checked={formData?.send_email || false}
                                readOnly
                                className="w-5 h-5 accent-indigo-600 "
                            />
                        </div>

                        {formData?.send_email && (
                            <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
                                <div className="box space-y-2 p-4 border rounded-md">
                                    <input
                                        type="text"
                                        value={formData?.email_subject || ""}
                                        placeholder="Email Subject"
                                        readOnly
                                        className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                                    />
                                    <textarea
                                        value={formData?.email_content || ""}
                                        placeholder="Email Content"
                                        readOnly
                                        className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                                        rows={5}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </li>

                <li className="list-group-item bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 ">
                    <div className="grid grid-cols-12 xl:gap-x-[3rem] gap-y-6">
                        <div className="xl:col-span-4 col-span-12">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-10 h-10 bg-primary/80 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Form Fields</h3>
                                    <div className="flex items-center space-x-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {formData?.fields?.length || 0} Fields
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Manage and view all form field configurations including field types, validation rules, and display settings.
                            </p>
                        </div>

                        <div className="xl:col-span-8 col-span-12">
                            <div className="p-4 ">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center space-x-2">
                                        <p className="text-sm font-semibold text-gray-900">Enable Form Fields</p>
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                            {formData?.fields?.length > 0 ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm text-gray-500">
                                            {formData?.fields?.length > 0 ? 'Enabled' : 'Disabled'}
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={formData?.fields?.length > 0 || false}
                                            readOnly
                                            className="w-5 h-5 accent-green-600"
                                        />
                                    </div>
                                </div>

                                {formData?.fields?.length > 0 && (
                                    <div className="space-y-4  pt-4">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Active Form Fields
                                        </h4>
                                        <div className="grid gap-4">
                                            {formData.fields.map((field, index) => (
                                                <div
                                                    key={field.id || index}
                                                    className="bg-gray-50 border border-gray-300 rounded-xl p-5  dark:text-gray-200 dark:bg-bodybg"
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-8 h-8 bg-primary/80 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                                                {index + 1}
                                                            </div>
                                                            <h5 className="text-sm font-semibold text-gray-900">
                                                                Field {index + 1}
                                                            </h5>
                                                        </div>
                                                        <span className="text-xs bg-primary/80 text-white px-3 py-1 rounded-full font-medium">
                                                            {field.type || 'Field'}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                        {Object.entries(field).map(([key, value]) => (
                                                            <div key={key} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm hover:border-gray-300 transition-colors dark:text-gray-200 dark:bg-bodybg">
                                                                <div className="flex items-start space-x-2 mb-1">

                                                                    <p className="text-base font-mono ">{key}</p>
                                                                </div>
                                                                <p className="text-sm break-words leading-relaxed">
                                                                    {Array.isArray(value)
                                                                        ? value.length > 0
                                                                            ? JSON.stringify(value)
                                                                            : "-"
                                                                        : value !== null && value !== undefined
                                                                            ? value.toString()
                                                                            : "-"}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        </div>
    );
};

export default DynamiceDetailApproval;