import React from 'react';
import CivilProjectForm from "@modules/civil_mgmt/project/components/CivilProjectForm.jsx";
import {useParams} from "react-router-dom";
import CivilBoqTenderForm from "@modules/civil_mgmt/tender/components/CivilBoqTenderForm.jsx";

const EditCivilBoqTender = () => {
    const { id } = useParams();

    return (
            <>
                <CivilBoqTenderForm editMode={true} tenderId={id} />
            </>
    );
};

export default EditCivilBoqTender;