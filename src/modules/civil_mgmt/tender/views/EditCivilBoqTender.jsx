import React from 'react';
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