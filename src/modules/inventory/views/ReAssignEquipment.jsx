import {useParams} from "react-router-dom";
import {useEquipment} from "@modules/inventory/hooks/inventoryHooks.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import React from "react";
import EquipmentReAssignForm from "@modules/inventory/components/EquipmentReAssignForm.jsx";

const ReAssignEquipment = (props) => {
    const { id } = useParams();
    const {equipmentData}=useEquipment(id)
    return (
       <div>
           <PageHeader currentpage='Re-Assign Equipment' activepage="Equipment" mainpage="Re-Assign Equipment"/>
           {
               equipmentData && (
                   <EquipmentReAssignForm equipmentData={equipmentData}/>
               )
           }
       </div>
    )
}
export default ReAssignEquipment