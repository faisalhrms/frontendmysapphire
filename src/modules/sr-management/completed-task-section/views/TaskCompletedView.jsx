import { useParams } from "react-router-dom";
import { useServiceRequest } from "@modules/sr-management/Hooks/GeneratedServiceReqHook.js";
import React from "react";
import TaskCompletedForm from "@modules/sr-management/component/TaskCompletedForm.jsx";

const CompletedTaskView = () => {
    const { id } = useParams();
    const { generatedReqData, serviceRequest } = useServiceRequest(id);



    return (
        <>
            {serviceRequest && (
                <TaskCompletedForm
                    currentReqId={id}
                    generatedReqData={generatedReqData}
                    serviceRequest={serviceRequest}
                />
            )}
        </>
    );
};

export default CompletedTaskView;
