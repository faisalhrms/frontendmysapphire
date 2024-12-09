import { useParams } from "react-router-dom";
import { useServiceRequest } from "@modules/sr-management/Hooks/GeneratedServiceReqHook.js";
import React from "react";
import GeneratedTaskDetail from "@modules/sr-management/component/TaskGeneratedForm.jsx";

const GeneratedTaskView = () => {
    const { id } = useParams();
    const { generatedReqData, serviceRequest } = useServiceRequest(id);

    console.log("Generated Task Data:", generatedReqData);
    console.log("Service Request Data:", serviceRequest);

    return (
        <>
            {serviceRequest && (
                <GeneratedTaskDetail
                    currentReqId={id}
                    generatedReqData={generatedReqData}
                    serviceRequest={serviceRequest}
                />
            )}
        </>
    );
};

export default GeneratedTaskView;
