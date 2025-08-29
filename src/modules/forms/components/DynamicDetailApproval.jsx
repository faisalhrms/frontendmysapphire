import React, { useState, useEffect } from "react";
import api from "@config/axiosConfig.js";
import {useParams} from "react-router-dom";
import FormFieldTable from "@modules/forms/components/FormFieldTable.jsx";

const DynamicDetailApproval = () => {
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
    const fields = formData?.fields || [];

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
                 <ul className="list-group list-group-flush list-none !rounded-md">
                     <li className="list-group-item">
                         <div className="grid grid-cols-12 xl:gap-x-[3rem] gap-y-4">
                             <div className="xl:col-span-4 col-span-12">
                                 <h3 className="text-base font-semibold text-gray-900 dark:text-gray-200 dark:bg-bodybg">
                                     Basic Info
                                 </h3>
                                 <p className="text-sm text-gray-500 dark:text-gray-200 dark:bg-bodybg">
                                     View the basic details and general information here.
                                 </p>
                             </div>

                             <div className="xl:col-span-8 col-span-12">
                                 <div className="grid grid-cols-12 xl:gap-x-[3rem] gap-y-4">

                                     <div className="xl:col-span-12 col-span-12 flex justify-between items-center">
                                         <div>
                                             <p className="text-base font-semibold">Title</p>
                                           <span  className="text-base font-mono bg-white px-2 py-1 rounded border border-gray-400 dark:text-gray-200 dark:bg-bodybg">{formData.title}</span >
                                         </div>

                                     </div>
                                     <div className="xl:col-span-12 col-span-12 flex justify-between items-center">
                                         <div>
                                             <p className="text-base font-semibold">Description</p>
                                             <span className="text-base font-mono bg-white px-2 py-1 rounded border border-gray-400 dark:text-gray-200 dark:bg-bodybg"> {formData.description}</span>

                                         </div>

                                     </div>
                                     <div className="xl:col-span-12 col-span-12 flex justify-between items-center">
                                         <div>
                                             <p className="text-base font-semibold">Success Message</p>
                                             <span className="text-base font-mono bg-white px-2 py-1 rounded border border-gray-400 dark:text-gray-200 dark:bg-bodybg">{formData.success_message}</span>
                                         </div>

                                     </div>
                                 </div>
                             </div>
                         </div>
                     </li>

                     <li className="list-group-item">
                         <div className="grid grid-cols-12 xl:gap-x-[3rem] gap-y-4">
                             <div className="xl:col-span-4 col-span-12">
                                 <h3 className="text-base font-semibold text-gray-900 dark:text-gray-200 dark:bg-bodybg">Configure</h3>
                                 <p className="text-xs text-gray-500 dark:text-gray-200 dark:bg-bodybg">
                                     View the appearance and expiry settings of your interface.
                                 </p>
                             </div>

                             <div className="xl:col-span-8 col-span-12">
                                 <div className="grid grid-cols-12 xl:gap-x-[3rem] gap-y-4">
                                     {/* Primary Color */}
                                     <div className="xl:col-span-12 col-span-12 flex justify-between items-center">
                                         <div>
                                             <p className="text-base font-semibold">Primary Color</p>
                                             <p className="text-xs text-gray-500">
                                                 View the primary color used for your brand identity.
                                             </p>
                                         </div>
                                         <div className="flex items-center space-x-3">
                                        <span
                                            className="text-base font-mono bg-white px-2 py-1 rounded border dark:text-gray-200 dark:bg-bodybg">
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
                                             <p className="text-base font-semibold">Font Family</p>
                                             <p className="text-xs text-gray-500">
                                                 View the font style used for your brand’s visual tone and readability.
                                             </p>
                                         </div>
                                         <div>
                                             <p className="h-8 text-base rounded bg-purple-600">{formData.font_family}</p>
                                         </div>
                                     </div>
                                     <div className="xl:col-span-12 col-span-12 flex justify-between items-center">
                                         <div>
                                             <p className="text-base font-semibold">Expired At</p>
                                             <p className="text-xs text-gray-500">
                                                 View the expiration date of this feature.
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
                                 <h3 className="text-base font-semibold text-gray-900 dark:text-gray-200 dark:bg-bodybg">Security</h3>
                                 <p className="text-xs text-gray-500 dark:text-gray-200 dark:bg-bodybg">
                                     The account protection, access rules, and alerts.
                                 </p>
                             </div>

                             <div className="xl:col-span-8 col-span-12">
                                 <div className="grid grid-cols-12 xl:gap-x-[3rem] gap-y-4">
                                     {[
                                         {
                                             label: "Is Active",
                                             desc: " View the toggle to enable or disable this feature or module.",
                                             value: formData.is_active
                                         },
                                         {
                                             label: "For Authenticated User",
                                             desc: " View the Restrict access to only logged-in or authenticated users.",
                                             value: formData.authenticated_only
                                         },

                                         {
                                             label: "Enable Submission Alerts",
                                             desc: " View the get alerts when a new submission is received.",
                                             value: formData.enable_submission_alerts
                                         },
                                         {
                                             label: "Require Approval",
                                             desc: " View the ensure this form goes through approval before becoming visible.",
                                             value: formData.require_approval
                                         },
                                     ].map((item) => (
                                         <div key={item.label}
                                              className="xl:col-span-12 col-span-12 flex justify-between items-center">
                                             <div>
                                                 <p className="text-base font-semibold">{item.label}</p>
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
                                 <h3 className="text-base font-semibold text-gray-900 dark:text-gray-200 dark:bg-bodybg">
                                     Coupon Discount
                                 </h3>
                                 <p className="text-xs text-gray-500 dark:text-gray-200 dark:bg-bodybg">
                                     View  Coupon discount options, eligibility rules, and notifications.
                                 </p>
                             </div>
                             <div className="xl:col-span-8 col-span-12 flex justify-between items-center">
                                 <p className="text-base font-semibold">{formData.enable_coupon ? '' : ''}</p>
                                 <input
                                     type="checkbox"
                                     checked={formData.enable_coupon}
                                     readOnly
                                     className="w-5 h-5 accent-indigo-600 cursor-not-allowed"
                                 />
                             </div>
                         </div>
                         {formData?.enable_coupon && (<div
                             className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 sm:col-span-12 col-span-12">
                             <div className="bg-white  border mt-4 p-6 space-y-6 dark:text-gray-200 dark:bg-bodybg">

                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                     <div>
                                         <p className="text-sm font-medium ">Country</p>
                                         <p className="mt-1 text-xs text-gray-500">
                                             {formData.country || "-"}
                                         </p>
                                     </div>
                                     <div>
                                         <p className="text-sm font-medium ">Coupon Type</p>
                                         <p className="mt-1 text-xs text-gray-500">
                                             {formData.coupon_type || "-"}
                                         </p>
                                     </div>
                                     <div>
                                         <p className="text-sm font-medium ">Discount Type</p>
                                         <p className="mt-1 text-xs text-gray-500">
                                             {formData.coupon_discount_type || "-"}
                                         </p>
                                     </div>
                                 </div>


                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                     <div>
                                         <p className="text-sm font-medium ">Discount Amount /
                                             Percentage</p>
                                         <p className="mt-1 text-xs text-gray-500">
                                             {formData.coupon_discount_amount || "-"}
                                         </p>
                                     </div>
                                     <div>
                                         <p className="text-sm font-medium">Min Order Value (for
                                             threshold)</p>
                                         <p className="mt-1 text-xs text-gray-500">
                                             {formData.coupon_min_order_value || "-"}
                                         </p>
                                     </div>
                                     <div>
                                         <p className="text-sm font-medium">Coupon Validity (in days)</p>
                                         <p className="mt-1 text-xs text-gray-500">
                                             {formData.coupon_valid_days || "-"}
                                         </p>
                                     </div>
                                 </div>
                             </div>

                         </div>)}
                     </li>


                     <li className="list-group-item">
                         <div className="grid grid-cols-12 xl:gap-x-[3rem] gap-y-4">
                             <div className="xl:col-span-4 col-span-12">
                                 <p className="text-[1rem] mb-1 font-semibold dark:text-gray-200 dark:bg-bodybg">Email to Submitter</p>
                                 <p className="text-[0.75rem] mb-0 text-[#8c9097] dark:text-white/50 dark:text-gray-200 dark:bg-bodybg">
                                     view the Automatically send a confirmation or notification email to the form
                                     submitter. </p>
                             </div>
                             <div className="xl:col-span-8 col-span-12 flex justify-between items-center">
                                 <p className="text-sm font-semibold">{formData?.send_email ? '' : ''}</p>
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

                     <li className="list-group-item bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-6 ">
                         <div className="grid grid-cols-12 xl:gap-x-[3rem] gap-y-6">
                             <div className="xl:col-span-4 col-span-12">
                                 <div className="flex items-center space-x-3 mb-3">
                                     <div>
                                         <h3 className="text-lg font-bold text-gray-900 dark:text-gray-200 dark:bg-bodybg">Form Fields</h3>

                                     </div>
                                 </div>
                                 <p className="text-sm text-gray-600 leading-relaxed dark:text-gray-200 dark:bg-bodybg">
                                     View all form field configurations including field types, validation rules, and display settings.
                                 </p>
                             </div>

                             <div className="xl:col-span-8 col-span-12">
                                 <div className="p-4 ">
                                     <div className="flex justify-between items-center mb-4">
                                         <div className="flex items-center space-x-2">

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


                                 </div>
                             </div>
                         </div>
                     </li>
                     <div className="list-group-item">
                     <FormFieldTable fields={fields} />
                     </div>

                 </ul>
             </div>
        </div>
    );
};

export default DynamicDetailApproval;