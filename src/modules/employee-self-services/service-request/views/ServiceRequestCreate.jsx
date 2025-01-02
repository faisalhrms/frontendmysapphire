import React from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import ServiceRequestForm from "@modules/employee-self-services/service-request/components/ServiceRequestForm.jsx";
import { useLocation } from "react-router-dom";

const ServiceRequestCreate = (props) => {
    const location = useLocation();
    const isChild = location.state?.isChild || false; // Check if it's a sub-task
    const serviceRequestId = location.state?.serviceRequestId || null; // Get the service request ID if available

    console.log("isChild:", isChild, "serviceRequestId:", serviceRequestId);

    return (
        <>
            <PageHeader
            
                currentpage={isChild ? "Add Sub Task" : "Add Self Service"}
                activepage={isChild ? "Sub Task" : "Self Service"}
                mainpage={isChild ? "Add Sub Task" : "Add Self Service"}
            />
            <ServiceRequestForm
                serviceData={props.serviceData}
                isSaveMode={props.isSaveMode}
                isChild={isChild}
                serviceRequestId={serviceRequestId}
            />
        </>
    );
};

export default ServiceRequestCreate;
