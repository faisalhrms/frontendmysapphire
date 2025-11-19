import {useParams} from "react-router-dom";
import {Edit3} from "lucide-react";
import React from "react";
import RequisitionForm from "../components/RequisitionForm.jsx";
import {useRequisition} from "../hooks/requisitionHooks.js";
import IconPageHeader from "../../layouts/includes/IconPageHeader.jsx";

const RequisitionEdit=()=>{
    const { id } = useParams();
    const{requisitionData}= useRequisition(id)
    return(
        <>
            <IconPageHeader
                heading="Edit Policy"
                description="Update policy details, adjust visibility settings, and manage related documents."
                icon={Edit3}
            />
            {requisitionData
                &&(
                    <RequisitionForm requisitionData={requisitionData} isEditMode={true}/>
                )
            }
        </>
    )
}
export default RequisitionEdit