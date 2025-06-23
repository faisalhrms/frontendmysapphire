import React from "react";
import { useParams } from "react-router-dom";
import { useServiceRequest } from "@modules/sr-management/Hooks/GeneratedServiceReqHook.js";
import GeneratedTaskDetail from "@modules/sr-management/component/TaskGeneratedForm.jsx";

const AllTaskView = () => {
  const { id } = useParams();
  const { generatedReqData, serviceRequest, refreshServiceData } = useServiceRequest(id);

  return (
    <>
      {serviceRequest && (
        <GeneratedTaskDetail
          currentReqId={id}
          generatedReqData={generatedReqData}
          serviceRequest={serviceRequest}
          refreshServiceData={refreshServiceData}
        />
      )}
    </>
  );
};

export default AllTaskView;
