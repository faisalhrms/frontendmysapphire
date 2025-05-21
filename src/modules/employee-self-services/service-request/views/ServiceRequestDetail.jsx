import React, {useMemo, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useServiceRequest} from "@modules/sr-management/Hooks/GeneratedServiceReqHook.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import ServiceReadCard from "@modules/employee-self-services/service-request/components/ServiceReadCard.jsx";
import ContentLeft from "@modules/sr-management/component/components/ContentLeft.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const ServiceRequestDetail = () => {
    const {id} = useParams();
    const {generatedReqData, serviceRequest} = useServiceRequest(id);
    const [error, setError] = useState(null);

    if (error) {
        return <p className="text-red-500">An error occurred: {error.message}</p>;
    }
    if (!serviceRequest) {
        return <LoadingSpinner />;
    }

    return (
        <>
            <PageHeader currentpage="Detail Service Request" activepage="Service Request" mainpage="Service Request"/>

            <div className="flex flex-col lg:flex-row lg:space-x-4 w-full mt-8">
                <ContentLeft generatedReqData={generatedReqData} serviceRequest={serviceRequest} showFooter={false}/>
                <ServiceReadCard serviceData={serviceRequest}/>
            </div>
        </>
    );
};

export default ServiceRequestDetail;
