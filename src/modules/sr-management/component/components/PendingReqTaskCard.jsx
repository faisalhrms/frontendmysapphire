import React from "react";
import face5 from "@assets/images/faces/5.jpg";

const PendingReqTaskCard = ({ pendingReqData = {} }) => {
    return (
        <div className="xl:col-span-3 col-span-12">
            <div className="box">
                <div className="box-body text-center !pt-1">
                    <span className="avatar avatar-xl avatar-rounded me-2 my-2">
                        <img src={face5} alt="img" />
                    </span>
                    <div className="font-semibold text-[1rem]">{pendingReqData.reporter || "No Reporter"}</div>
                </div>
                <div className="box-body">
                    <div>
                        <div className="font-semibold mb-1">Company:</div>
                        <p className="text-[#8c9097] dark:text-white/50 mb-3">
                            {pendingReqData.company?.name || "No Company"}
                        </p>

                        <div className="font-semibold mb-1">SR No:</div>
                        <p className="text-[#8c9097] dark:text-white/50 mb-3">
                            {pendingReqData.sr_number || "No SR Number"}
                        </p>

                        <div className="font-semibold mb-1">Department:</div>
                        <p className="text-[#8c9097] dark:text-white/50 mb-3">
                            {pendingReqData.department?.name || "No Department"}
                        </p>

                        <div className="font-semibold mb-1">Sub-Department:</div>
                        <p className="text-[#8c9097] dark:text-white/50 mb-3">
                            {pendingReqData.sub_department?.name || "No Sub-Department"}
                        </p>

                        <div className="font-semibold mb-1">Location:</div>
                        <p className="text-[#8c9097] dark:text-white/50 mb-3">
                            {pendingReqData.location?.name || "No Location"}
                        </p>

                        <div className="font-semibold mb-1">SR Type:</div>
                        <p className="text-[#8c9097] dark:text-white/50 mb-3">
                            {pendingReqData.sr_type?.name || "No SR Type"}
                        </p>

                        <div className="font-semibold mb-1">Time Created:</div>
                        <span className="text-[#8c9097] dark:text-white/50 mb-3">
                            {pendingReqData.created_at ? new Date(pendingReqData.created_at).toLocaleString() : "No Date"}
                        </span>

                        <div className="font-semibold mb-1">Need By Date:</div>
                        <span className="text-[#8c9097] dark:text-white/50 mb-3">
                            {pendingReqData.need_by_date ? new Date(pendingReqData.need_by_date).toLocaleDateString() : "No Need By Date"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PendingReqTaskCard;
