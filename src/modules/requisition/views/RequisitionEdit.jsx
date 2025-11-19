import {useParams} from "react-router-dom";
import {Edit3} from "lucide-react";
import React from "react";
import RequisitionForm from "../components/RequisitionForm.jsx";
import {useRequisition} from "../hooks/requisitionHooks.js";
import IconPageHeader from "../../layouts/includes/IconPageHeader.jsx";

const RequisitionEdit=()=>{
    const { id } = useParams();
    const{requisition}= useRequisition(id)
    return(
        <>
            <IconPageHeader
                heading="Edit Policy"
                description="Update policy details, adjust visibility settings, and manage related documents."
                icon={Edit3}
            />
            {requisition
                &&(
                    <RequisitionForm requisitionData={requisition} isEditMode={true}/>
                )
            }
        </>
    )
}
export default RequisitionEdit