// @modules/user/pages/OtherUserAdd.jsx
import React from "react";
import { UserPlus } from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import OtherUserForm from "@modules/user/components/OtherUserForm.jsx";

const OtherUserAdd = () => {
    return (
        <>
            <IconPageHeader
                heading="Add Other User"
                description="Create a new user account and assign roles."
                icon={UserPlus}
            />
            <OtherUserForm />
        </>
    );
};

export default OtherUserAdd;
