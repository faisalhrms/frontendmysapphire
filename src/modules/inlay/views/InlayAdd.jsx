import React from "react";
import { Layers } from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import InlayForm from "@modules/inlay/components/InlayForm.jsx";

const InlayAdd = () => {
    return (
        <>
            <IconPageHeader
                heading="Add New Inlay"
                description="Create a new inlay design, add label/value details, and upload images (first image becomes the thumbnail)."
                icon={Layers}
            />
            <InlayForm />
        </>
    );
};

export default InlayAdd;
