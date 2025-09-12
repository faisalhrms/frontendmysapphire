import {useParams} from "react-router-dom";
import {useFetchSlaById} from "@modules/it_governance/hooks/useServiceLevelAgreementForm.js";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {Edit3} from "lucide-react";
import React from "react";
import ITGovernForm from "@modules/it_governance/components/ITGovernForm.jsx";

const ITGovernEdit = () => {
    const { id } = useParams();
    const{slaData}=useFetchSlaById(id)
    return (
        <>
            <IconPageHeader
                heading="Service Level Agreement"
                description="Service Level Agreement."
                icon={Edit3}
            />
            {slaData&&(
                <ITGovernForm slaData={slaData} isEditMode={true}/>
            )}
        </>
    )
}
export default ITGovernEdit