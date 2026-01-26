// src/modules/inlay/views/InlayEdit.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { Edit3 } from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";

import { useInlay } from "@modules/inlay/hooks/inlayHooks.js";
import InlayForm from "@modules/inlay/components/InlayForm.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const InlayEdit = () => {
    const { id } = useParams();
    const { inlay, loading } = useInlay(id);

    return (
        <>
            <IconPageHeader
                heading="Edit Inlay"
                description="Update inlay details, manage label/value description, and change attachments (first image becomes thumbnail)."
                icon={Edit3}
            />

            {loading && (
               <LoadingSpinner/>
            )}

            {!loading && inlay && <InlayForm inlayData={inlay} isEditMode={true} />}
        </>
    );
};

export default InlayEdit;
