import React from 'react';
import CivilProjectForm from "@modules/civil_mgmt/project/components/CivilProjectForm.jsx";
import {useParams} from "react-router-dom";

const EditCivilProject = () => {
    const { id } = useParams();

    return (
            <>
                <CivilProjectForm editMode={true} projectId={id} />
            </>
    );
};

export default EditCivilProject;