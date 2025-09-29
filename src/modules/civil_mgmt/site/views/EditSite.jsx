import React from 'react';
import {useParams} from "react-router-dom";
import SiteForm from "@modules/civil_mgmt/site/components/SiteForm.jsx";

const EditSite = () => {
    const { id } = useParams();
    return (
            <>
                <SiteForm editMode={true} siteId={id} />
            </>
    );
};

export default EditSite;