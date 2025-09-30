import React from 'react';
import CivilBoqForm from "@modules/civil_mgmt/boq/components/CivilBoqForm.jsx";
import {useParams} from "react-router-dom";

const EditCivilBoq = () => {
    const { id } = useParams();

    return (
            <>
                <CivilBoqForm editMode={true} boqId={id} />
            </>
    );
};

export default EditCivilBoq;