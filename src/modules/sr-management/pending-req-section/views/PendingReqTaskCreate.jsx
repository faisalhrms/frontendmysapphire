import {useParams} from "react-router-dom";
import {useServiceRequest} from "@modules/sr-management/Hooks/PendingServiceReqHook.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import React from "react";
import PendingReqTaskForm from "@modules/sr-management/component/components/PendingReqTaskForm.jsx";
const PendingReqTaskCreate = () => {
    const { id } = useParams();
    const { pendingReqData } = useServiceRequest(id);  // Destructure serviceData for easier access


    console.log("Pending Request Data:", pendingReqData);



    return (
       <>
           <PageHeader currentpage="Create Task" activepage="Pending Request" mainpage="Pending Request" />
           {
               pendingReqData && (
                   <PendingReqTaskForm currentReqId={id} pendingReqData={pendingReqData}/>
               )
           }
       </>
    );
}

export default PendingReqTaskCreate;
