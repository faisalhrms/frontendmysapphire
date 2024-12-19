import React from "react";
import face5 from "@assets/images/faces/5.jpg";
import SRAttachment from "@modules/sr-management/component/SRAttachment.jsx";

const PendingReqTaskCard = ({pendingReqData = {}}) => {
    return (

        <div className="xl:col-span-3 col-span-12">
            <div className="box p-4 rounded-xl shadow-md bg-primary" style={{backgroundColor: "#6b21a8"}}>
                <div className="flex items-start mb-4">
                    <span className="avatar avatar-xl avatar-rounded mr-4">
                        <img src={face5} alt="Profile" className="rounded-full w-16 h-16"/>
                    </span>
                    <div className="text-white">
                        <h6 className="font-semibold text-lg mb-1">{pendingReqData.reporter || "No Reporter"}</h6>
                        <p className="opacity-70">{pendingReqData.company?.name || "No Company"}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-white">
                    <div>
                        <p className="font-semibold">SR#:</p>
                        <p className="opacity-70">{pendingReqData.sr_number || "No SR Number"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Department:</p>
                        <p className="opacity-70">{pendingReqData.department?.name || "No Department"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Sub-Department:</p>
                        <p className="opacity-70">{pendingReqData.sub_department?.name || "No Sub-Department"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Location:</p>
                        <p className="opacity-70">{pendingReqData.location?.name || "No Location"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">SR Type:</p>
                        <p className="opacity-70">{pendingReqData.sr_type?.name || "No SR Type"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Time Created:</p>
                        <p className="opacity-70">
                            {pendingReqData.created_at ? new Date(pendingReqData.created_at).toLocaleString() : "No Date"}
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold">Need By Date:</p>
                        <p className="opacity-70">
                            {pendingReqData.need_by_date ? new Date(pendingReqData.need_by_date).toLocaleDateString() : "No Need By Date"}
                        </p>
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
