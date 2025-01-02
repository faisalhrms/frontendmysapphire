import { useParams } from "react-router-dom";
import { useServiceRequest } from "@modules/sr-management/Hooks/GeneratedServiceReqHook.js";
import React from "react";
import TaskClosedForm from "@modules/sr-management/component/TaskClosedForm.jsx";

const TaskClosedView = () => {
    const { id } = useParams();
    const { generatedReqData, serviceRequest } = useServiceRequest(id);



    return (
        <>
            {serviceRequest && (
                <TaskClosedForm
                    currentReqId={id}
                    generatedReqData={generatedReqData}
                    serviceRequest={serviceRequest}
                />
            )}
        </>
    );
};

export default TaskClosedView;
