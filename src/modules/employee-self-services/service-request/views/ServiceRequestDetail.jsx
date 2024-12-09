import React from 'react';
import { useParams } from 'react-router-dom';
import ServiceRequestCard from "@modules/employee-self-services/service-request/components/ServiceRequestCard.jsx";
import { useServiceRequest } from "@modules/employee-self-services/hooks/service-request/ServiceRequestHook.js";
import { formatDate } from "@helpers/dateTime.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";

const ServiceRequestDetail = () => {
    const { id } = useParams();
    const { serviceData } = useServiceRequest(id);
        console.log(serviceData);
    if (!serviceData) {
        return <p>Loading...</p>;
    }

    const {
        sr_number,
        sr_type,
        location,
        department,
        sub_department,
        request_title,
        reporter,
        assignee,
        status,
        created_at,
        need_by_date,
        description,
        priority,
        attachments,
        to_email,
        cc_email,
        company,
    } = serviceData;

    return (
        <>
        <PageHeader currentpage={`Detail Service Request`} activepage="Service Request" mainpage="Service Request"/>

    <div className="grid grid-cols-12 gap-x-6">
            <div className="xxl:col-span-9 col-span-12">
                <div className="box">
                    <div className="box-header">
                        <div className="box-title">Service Request Details</div>
                    </div>
                    <div className="box-body">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-6">
                                <label className="form-label">SR Number</label>
                                <p className="text-[#8c9097] dark:text-white/50">{sr_number}</p>
                            </div>
                            <div className="col-span-6">
                                <label className="form-label">SR Type</label>
                                <p className="text-[#8c9097] dark:text-white/50">{sr_type?.name}</p>
                            </div>
                            <div className="col-span-6">
                                <label className="form-label">Location</label>
                                <p className="text-[#8c9097] dark:text-white/50">{location?.name}</p>
                            </div>
                            <div className="col-span-6">
                                <label className="form-label">Department</label>
                                <p className="text-[#8c9097] dark:text-white/50">{department?.name}</p>
                            </div>
                            <div className="col-span-6">
                                <label className="form-label">Request Title</label>
                                <p className="text-[#8c9097] dark:text-white/50">{request_title}</p>
                            </div>
                            <div className="col-span-6">
                                <label className="form-label">Reporter</label>
                                <p className="text-[#8c9097] dark:text-white/50">{reporter}</p>
                            </div>
                            <div className="col-span-6">
                                <label className="form-label">Assignee</label>
                                <p className="text-[#8c9097] dark:text-white/50">{assignee || 'Unassigned'}</p>
                            </div>
                            <div className="col-span-6">
                                <label className="form-label">Status</label>
                                <p className="text-[#8c9097] dark:text-white/50">{status}</p>
                            </div>
                            <div className="col-span-6">
                                <label className="form-label">Priority</label>
                                <p className="text-[#8c9097] dark:text-white/50">{priority}</p>
                            </div>
                            <div className="col-span-6">
                                <label className="form-label">Date Created</label>
                                <p className="text-[#8c9097] dark:text-white/50">{formatDate(created_at)}</p>
                            </div>
                            <div className="col-span-6">
                                <label className="form-label">Needed By Date</label>
                                <p className="text-[#8c9097] dark:text-white/50">{formatDate(need_by_date)}</p>
                            </div>
                            <div className="col-span-12">
                                <label className="form-label">Description</label>
                                <div className="text-[#8c9097] dark:text-white/50" dangerouslySetInnerHTML={{ __html: description }} />
                            </div>
                            <div className="col-span-12">
                                <label className="form-label">Attachments</label>
                                <div className="grid grid-cols-12 gap-2">
                                    {attachments?.map((attachment, index) => (
                                        <a
                                            key={index}
                                            href={`/uploads/${attachment.file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 underline"
                                        >
                                            {attachment.file_name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ServiceRequestCard serviceData={serviceData} />
        </div>
        </>
    );
};

export default ServiceRequestDetail;
