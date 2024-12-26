// import React, { useState } from "react";
// import Select from "react-select";
// import "react-datepicker/dist/react-datepicker.css";
// import CreatedAssign from "./components/CreatedAssign";
// import ContentLeft from "./components/ContentLeft";
// import ContentRight from "./components/ContentRight";
// import {Link, useNavigate} from "react-router-dom";
// import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
// import { useForm } from "react-hook-form";
// import { formatOptions } from "@helpers/formatters.js";
// import ConfirmationModal from "@modules/sr-management/component/ConfirmationModal.jsx";
// import api from "@config/axiosConfig.js";
// import Notify from "@helpers/toastNotifications.js";
// import { SELF_SERVICES_ROUTES } from "@modules/employee-self-services/routes.js";

// function TaskGeneratedForm({ generatedReqData = {}, serviceRequest = {} }) {
//     const { control, handleSubmit, formState: { errors }, setValue } = useForm({});
//     const [selectedStatus, setSelectedStatus] = useState(null);
//     const [showConfirmation, setShowConfirmation] = useState(false);
//     const [taskIdToUpdate, setTaskIdToUpdate] = useState(null);

//     const userOptions = formatOptions(generatedReqData, "status");

//     const handleStatusChange = (selectedOption) => {
//         if (selectedOption && selectedOption.value) {
//             setSelectedStatus(selectedOption);
//             setValue("status", [selectedOption.value]);
//             setTaskIdToUpdate(generatedReqData?.id || null);
//             setShowConfirmation(true);
//         } else {
//             console.warn("Invalid option selected");
//         }
//     };
//     const navigate = useNavigate();

//     const handleNavigateToSubTask = () => {
//         navigate(SELF_SERVICES_ROUTES.SERVICES.CREATE.path, {
//             state: { isChild: true, serviceRequestId: serviceRequest?.id },
//         });
//     };

//     const confirmStatusChange = async () => {
//         if (selectedStatus && taskIdToUpdate) {
//             try {
//                 const response = await api.post(`/sr-task/${taskIdToUpdate}/status`, {
//                     status: selectedStatus.label,
//                 });
//                 if (response.status === 200) {
//                     Notify.success("Status updated successfully");
//                 } else {
//                     Notify.error("Failed to update status. Please try again.");
//                 }
//             } catch (error) {
//                 Notify.error("Failed to update status. Please try again.");
//             }
//         } else {
//             console.warn("Invalid task ID or status.");
//         }
//         setShowConfirmation(false);
//     };

//     const TaskFormHeader = () => (
//         <div className="flex justify-between bg-white dark:bg-bodybg items-center border-b border-gray-200 bg-blue-50 p-1">
//             <div className="flex space-x-2">
//                 <div className="justify-between flex">
//                     <button
//                         onClick={handleNavigateToSubTask}
//                         className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
//                     >
//                         <i className="ri-add-line font-semibold align-middle"></i> Sub Task
//                     </button>
//                 </div>
//                 <div className="flex">
//                     <button className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]">
//                         <i className="bi bi-link-45deg font-semibold align-middle"></i> Link Task
//                     </button>
//                 </div>
//             </div>
//             <div className="flex items-center space-x-4 w-1/3">
//                 <FormAsyncSelect
//                     label={false}
//                     name="status"
//                     control={control}
//                     errors={errors}
//                     placeholder="Status"
//                     apiUrl="select/sr/statuses"
//                     queryKeyBase="statuses"
//                     clientSideSearch={true}
//                     preselectedOptions={userOptions}
//                     onOptionSelect={handleStatusChange}
//                 />
//             </div>
//         </div>
//     );



//     return (
//         <div className="dark:bg-bodybg p-4 rounded-lg my-6">
//             <ConfirmationModal
//                 show={showConfirmation}
//                 message={`Are you sure you want to update the status to ${selectedStatus?.label}?`}
//                 onConfirm={confirmStatusChange}
//                 onCancel={() => setShowConfirmation(false)}
//             />
//             <TaskFormHeader />
//             <CreatedAssign generatedReqData={generatedReqData} serviceRequest={serviceRequest} />
//             <div className="flex flex-col lg:flex-row lg:space-x-4 w-full mt-8">
//                 <ContentLeft generatedReqData={generatedReqData} serviceRequest={serviceRequest} />
//                 <ContentRight generatedReqData={generatedReqData} serviceRequest={serviceRequest} />
//             </div>
//         </div>
//     );
// }

// export default TaskGeneratedForm;
import React, { useState } from "react";
import CreatedAssign from "./components/CreatedAssign";
import ContentLeft from "./components/ContentLeft";
import ContentRight from "./components/ContentRight";
import { useNavigate } from "react-router-dom";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import { useForm } from "react-hook-form";
import { formatOptions } from "@helpers/formatters.js";
import ConfirmationModal from "@modules/sr-management/component/ConfirmationModal.jsx";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import { SELF_SERVICES_ROUTES } from "@modules/employee-self-services/routes.js";

function TaskGeneratedForm({ generatedReqData = {}, serviceRequest = {} }) {
    const { control, formState: { errors }, setValue } = useForm({});
    const [updatedReqData, setUpdatedReqData] = useState(generatedReqData);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [taskIdToUpdate, setTaskIdToUpdate] = useState(null);

    const statusMap = {
        pending: "Pending",
        in_progress: "In Progress",
        completed: "Completed",
    };

    
    const userOptions = formatOptions(generatedReqData, "status")
        .map((option) => ({
            value: option.value,
            label: statusMap[option.value] || option.label, 
        }))
        .filter((option) => ["completed", "in_progress", "pending"].includes(option.value));

    const handleStatusChange = (selectedOption) => {
        if (selectedOption && selectedOption.value) {
            const newStatus = selectedOption.value;
            const progressMap = {
                pending: 25,
                in_progress: 50,
                completed: 100,
            };

            const updatedData = {
                ...updatedReqData,
                status: newStatus, 
                progress: progressMap[newStatus] || 0,
            };

            setUpdatedReqData(updatedData);
            setSelectedStatus(selectedOption);
            setValue("status", [selectedOption.value]);
            setTaskIdToUpdate(generatedReqData?.id || null);
            setShowConfirmation(true);
        } else {
            console.warn("Invalid option selected");
        }
    };

    const confirmStatusChange = async () => {
        if (selectedStatus && taskIdToUpdate) {
            try {
                const response = await api.post(`/sr-task/${taskIdToUpdate}/status`, {
                    status: selectedStatus.value, // Send the status value to the API
                });
                if (response.status === 200) {
                    Notify.success("Status updated successfully");
                } else {
                    Notify.error("Failed to update status. Please try again.");
                }
            } catch (error) {
                Notify.error("Failed to update status. Please try again.");
            }
        } else {
            console.warn("Invalid task ID or status.");
        }
        setShowConfirmation(false);
    };

    const navigate = useNavigate();

    const handleNavigateToSubTask = () => {
        navigate(SELF_SERVICES_ROUTES.SERVICES.CREATE.path, {
            state: { isChild: true, serviceRequestId: serviceRequest?.id },
        });
    };

    const TaskFormHeader = () => (
        <div className="flex justify-between bg-white dark:bg-bodybg items-center border-b border-gray-200 bg-blue-50 p-1">
            <div className="flex space-x-2">
                <div className="justify-between flex">
                    <button
                        onClick={handleNavigateToSubTask}
                        className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                    >
                        <i className="ri-add-line font-semibold align-middle"></i> Sub Task
                    </button>
                </div>
                <div className="flex">
                    <button className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]">
                        <i className="bi bi-link-45deg font-semibold align-middle"></i> Link Task
                    </button>
                </div>
            </div>
            <div className="flex items-center space-x-4 w-1/3">
                <FormAsyncSelect
                    label={false}
                    name="status"
                    control={control}
                    errors={errors}
                    placeholder="Select Status"
                    apiUrl="select/sr/statuses"
                    queryKeyBase="statuses"
                    clientSideSearch={true}
                    preselectedOptions={userOptions}
                    onOptionSelect={handleStatusChange}
                />
            </div>
        </div>
    );

    return (
        <div className="dark:bg-bodybg p-4 rounded-lg my-6">
            <ConfirmationModal
                show={showConfirmation}
                message={`Are you sure you want to update the status to "${selectedStatus?.label}"?`}
                onConfirm={confirmStatusChange}
                onCancel={() => setShowConfirmation(false)}
            />
            <TaskFormHeader />
            <div>
                <h3>Service Request Info</h3>
                <p>Status: {statusMap[updatedReqData?.status] || "Unknown"}</p>
            </div>
            <CreatedAssign generatedReqData={updatedReqData} serviceRequest={serviceRequest} />
            <div className="flex flex-col lg:flex-row lg:space-x-4 w-full mt-8">
                <ContentLeft generatedReqData={updatedReqData} serviceRequest={serviceRequest} />
                <ContentRight generatedReqData={updatedReqData} serviceRequest={serviceRequest} />
            </div>
        </div>
    );
}

export default TaskGeneratedForm;
