import React from "react";
import { useParams } from "react-router-dom";

import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import SrTypes from "@modules/setup/views/SrTypes.jsx";

const SrTypesEdit = () => {
    const {id} = useParams();

    return (
        <div>
            <PageHeader
                currentpage="Edit SrType"
                activepage="SrType"
                mainpage="Edit Srtype"
            />
            <SrTypes isEditMode={true} />
        </div>
    );
};

export default SrTypesEdit;
