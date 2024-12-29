import face5 from "@assets/images/faces/5.jpg";
import React from "react";
import {useSelector} from "react-redux";

const ServiceRequestCard = ({serviceData = {}, currentUser}) => {
    return (
        <div className="xl:col-span-3 col-span-12">
            <div className="box">
                <div className="box-body text-center !pt-1">
                    <span className="avatar avatar-xl avatar-rounded me-2 my-2">
                        <img src={face5} alt="img"/>
                    </span>
                    <div
                        className="font-semibold text-[1rem]">{serviceData?.reporter_user?.full_name || currentUser?.full_name}</div>
                </div>
                <div className="box-body">
                    <div>
                        <div className="font-semibold mb-1">Company :</div>
                        <p className="text-[#8c9097] dark:text-white/50 mb-3">
                            {serviceData?.reporter_user?.company?.name || currentUser?.company.name}
                        </p>

                        <div className="font-semibold mb-1">Reporter :</div>
                        <p className="text-[#8c9097] dark:text-white/50 mb-3">
                            {currentUser?.email || "No Reporter"}
                        </p>

                        <div className="font-semibold mb-1">Employee Code :</div>
                        <p className="text-[#8c9097] dark:text-white/50 mb-3">
                            {serviceData?.reporter_user?.emp_code || currentUser?.emp_code || 'N/A'}
                        </p>

                        <div className="font-semibold mb-1">Request Status:</div>
                        <p className="text-[#8c9097] dark:text-white/50 mb-3">
                            {serviceData?.status || "New"}
                        </p>

                        <div className="font-semibold mb-1">Date & Time Created:</div>
                        <span className="font-semibold block">
                        {(serviceData?.created_at ? new Date(serviceData.created_at) : new Date()).toLocaleString() || "No Date"}
                        </span>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceRequestCard;
