import React, { useState } from "react";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import CreatedAssign from "./components/CreatedAssign";
import ContentLeft from "./components/ContentLeft";
import ContentRight from "./components/ContentRight";
import {Link, useNavigate} from "react-router-dom";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import { useForm } from "react-hook-form";
import { formatOptions } from "@helpers/formatters.js";
import ConfirmationModal from "@modules/sr-management/component/ConfirmationModal.jsx";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import { SELF_SERVICES_ROUTES } from "@modules/employee-self-services/routes.js";
import SRAsyncSelect from "@modules/sr-management/component/components/SRAsyncSelect.jsx";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";

function TaskClosedForm({ generatedReqData = {}, serviceRequest = {} }) {
    const { control, handleSubmit, formState: { errors }, setValue,watch } = useForm({});
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [taskIdToUpdate, setTaskIdToUpdate] = useState(null);


    const userOptions = formatOptions(generatedReqData, "status");

    const handleStatusChange = (selectedOption) => {
        if (selectedOption && selectedOption.value) {
            setSelectedStatus(selectedOption);
            setValue("status", [selectedOption.value]);
            setTaskIdToUpdate(generatedReqData?.id || null);
            setShowConfirmation(true);
        } else {
            console.warn("Invalid option selected");
        }
    };
    const navigate = useNavigate();

    const handleNavigateToSubTask = () => {
        navigate(SELF_SERVICES_ROUTES.SERVICES.CREATE.path, {
            state: { isChild: true, serviceRequestId: serviceRequest?.id },
        });
    };

    const confirmStatusChange = async () => {
        if (selectedStatus && taskIdToUpdate) {
            try {
                const response = await api.post(`/sr-task/${taskIdToUpdate}/status`, {
                    status: selectedStatus.label,
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

    const TaskFormHeader = () => (
        <div className="xl:col-span-9 col-span-12">
            <div className="box">
                <div className="box-body">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="xl:col-span-6 col-span-12">
                            <button
                                onClick={handleNavigateToSubTask}
                                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                            >
                                <i className="ri-add-line font-semibold align-middle"></i> Sub Task
                            </button>
                        </div>
                        <div className="xl:col-span-4 col-span-12">
                            <SRAsyncSelect
                                label={false}
                                name="status"
                                control={control}
                                errors={errors}
                                placeholder="Status"
                                apiUrl="select/sr/statuses"
                                queryKeyBase="statuses"
                                clientSideSearch={true}
                                preselectedOptions={[]}
                                onOptionSelect={handleStatusChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );



    return (
        <>
         <PageHeader
                currentpage="Task Closed"
                activepage="SR Assignment"
                mainpage="Task Closed"
            />
        <div className="dark:bg-bodybg p-4 rounded-lg my-6">
            <ConfirmationModal
                show={showConfirmation}
                message={`Are you sure you want to update the status to ${selectedStatus?.label}?`}
                onConfirm={confirmStatusChange}
                onCancel={() => setShowConfirmation(false)}
            />
            <TaskFormHeader />
            <CreatedAssign generatedReqData={generatedReqData} serviceRequest={serviceRequest} />
            <div className="flex flex-col lg:flex-row lg:space-x-4 w-full mt-8">
                <ContentLeft generatedReqData={generatedReqData} serviceRequest={serviceRequest} selectedStatus={selectedStatus}/>
                <ContentRight generatedReqData={generatedReqData} serviceRequest={serviceRequest} />
            </div>
        </div>
       </>
    );
}

export default TaskClosedForm;
