import {useParams} from "react-router-dom";
import {useServiceRequest} from "@modules/employee-self-services/hooks/service-request/ServiceRequestHook.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import React from "react";
import ServiceRequestForm from "@modules/employee-self-services/service-request/components/ServiceRequestForm.jsx";
const ServiceRequestEdit = (props) => {
    const {id}=useParams();
    const {serviceData}=useServiceRequest(id)
    return (
        <>
            <PageHeader currentpage={`Saved Service Request`} activepage="Service Request" mainpage="Service Request"/>

            {
                serviceData &&(
                    <ServiceRequestForm serviceData={serviceData} isSaveMode={true}/>
                )
            }
        </>
    )
}
export default ServiceRequestEdit