import React from "react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { FilePlus } from "lucide-react";
import DynamicFormBuilderApproval from "@modules/approvals/dynamiceform/components/DynamicFormBuilderApproval/DynamiceFormBuilderApproval.jsx";
const CreateDynamicFormApproval = ({ isDisabled = true }) => {
    return (
        <>
            <IconPageHeader
                heading="Create New Dynamic Form"
                description="Design and configure a dynamic form with customizable fields and settings."
                icon={FilePlus}
            />
            <DynamicFormBuilderApproval disabled={isDisabled} />
        </>
    );
};
// const CreateDynamicFormApproval = ({}) => {
//     return (
//         <>
//             <IconPageHeader
//                 heading="Create New Dynamic Form"
//                 description="Design and configure a dynamic form with customizable fields and settings."
//                 icon={FilePlus}
//             />
//             <DynamicFormBuilderApproval disabled={true} />
//         </>
//     );
// };

export default CreateDynamicFormApproval;