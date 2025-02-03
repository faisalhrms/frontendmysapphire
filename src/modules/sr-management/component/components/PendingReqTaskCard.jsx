import React from "react";
import SRAttachment from "@modules/sr-management/component/SRAttachment.jsx";
import Avatar from "@components/Avatar.jsx";


const PendingReqTaskCard = ({pendingReqData = {}}) => {
    return (

        <div className="xl:col-span-3 col-span-12">
            <div className="xxl:col-span-5 xl:col-span-12 col-span-12">
                <div className="box overflow-hidden">
                    <div className="box-body !p-0">
                        <div className="sm:flex items-start p-6 main-profile-cover">
                            <Avatar avatar={pendingReqData?.employee_info?.avatar} size="xl" parentClasses="me-4"/>
                            <div className="flex-grow main-profile-info">
                                <div className="flex items-center !justify-between">
                                    <h6 className="font-semibold mb-1 text-white text-[1rem]">
                                        {pendingReqData?.employee_info?.concern_person || "-"} ({pendingReqData?.employee_info?.employee_code || "-"})
                                    </h6>
                                </div>
                                <p className="text-[0.75rem] text-white mb-6 opacity-[0.5]">
                      <span className="me-4 inline-flex">
                        <i className="ri-building-line me-1 align-middle"></i>
                          {pendingReqData?.employee_info?.company_name || "No Company"}
                      </span>
                                    <span className="inline-flex">
                        <i className="ri-map-pin-line me-1 align-middle"></i>
                                        {pendingReqData?.employee_info?.reporter_location?.name || "-"}
                      </span>
                                </p>
                            </div>
                        </div>

                        <div className="p-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[#8c9097] dark:text-white/20">
                            <div>
                                <p className="font-semibold">SR#:</p>
                                <p className="opacity-90">{pendingReqData.sr_number || "No SR Number"}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Department:</p>
                                <p className="opacity-90">{pendingReqData.department?.name || "No Department"}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Sub-Department:</p>
                                <p className="opacity-90">{pendingReqData.sub_department?.name || "No Sub-Department"}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Location:</p>
                                <p className="opacity-90">{pendingReqData.location?.name || "No Location"}</p>
                            </div>
                            <div>
                                <p className="font-semibold">SR Type:</p>
                                <p className="opacity-90">{pendingReqData.sr_type?.name || "No SR Type"}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Time Created:</p>
                                <p className="opacity-90">
                                    {pendingReqData.created_at ? new Date(pendingReqData.created_at).toLocaleString() : "No Date"}
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold">Need By Date:</p>
                                <p className="opacity-90">
                                    {pendingReqData.need_by_date ? new Date(pendingReqData.need_by_date).toLocaleDateString() : "No Need By Date"}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="xl:col-span-3 col-span-12">
                <div className="box">
                    <div className="box-body">
                        <div className="xl:col-span-12 col-span-12">
                            <p className="font-semibold mb-2">To:</p>
                            <ul className="list-none space-y-1">
                                {(Array.isArray(pendingReqData.to_email)
                                        ? pendingReqData.to_email
                                        : pendingReqData.to_email?.split(",") || ["No Email"]
                                ).map((email, index) => (
                                    <li key={index} className="bg-gray-100 text-gray-800 p-2 rounded-md shadow-sm">
                                        {email.trim()}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="xl:col-span-12 col-span-12 mt-4">
                            <p className="font-semibold mb-2">CC:</p>
                            <ul className="list-none space-y-1">
                                {(Array.isArray(pendingReqData.cc_email)
                                        ? pendingReqData.cc_email
                                        : pendingReqData.cc_email?.split(",") || ["No CC Email"]
                                ).map((email, index) => (
                                    <li key={index} className="bg-gray-100 text-gray-800 p-2 rounded-md shadow-sm">
                                        {email.trim()}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>


            </div>

            <div className="xl:col-span-3 col-span-12">
                {pendingReqData.attachments.length > 0 && (
                    <SRAttachment attachments={pendingReqData.attachments}/>)}
            </div>
        </div>

    );
};

export default PendingReqTaskCard;
