import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import CreatedAssign from "./components/CreatedAssign";
import ContentLeft from "./components/ContentLeft";
import ContentRight from "./components/ContentRight";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { formatOptions } from "@helpers/formatters.js";
import ConfirmationModal from "@modules/sr-management/component/ConfirmationModal.jsx";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import { SELF_SERVICES_ROUTES } from "@modules/employee-self-services/routes.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import SRAsyncSelect from "@modules/sr-management/component/components/SRAsyncSelect.jsx";

function TaskGeneratedForm({ generatedReqData = {}, serviceRequest = {}, refreshServiceData }) {
  const { control, formState: { errors }, setValue } = useForm({});
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [confirmationType, setConfirmationType] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [taskIdToUpdate, setTaskIdToUpdate] = useState(null);
  const navigate = useNavigate();

  const handleStatusChange = (selectedOption) => {
    if (selectedOption && selectedOption.value) {
      setSelectedStatus(selectedOption);
      setValue("status", [selectedOption.value]);
      setTaskIdToUpdate(generatedReqData?.id || null);
      setConfirmationType("status");
      setShowConfirmation(true);
    }
  };

  const handleSLAActivityChange = (selectedOption) => {
    if (selectedOption && selectedOption.value && generatedReqData?.id) {
      setSelectedActivity(selectedOption);
      setConfirmationType("sla");
      setShowConfirmation(true);
    }
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
    }
    setShowConfirmation(false);
  };

  const confirmSLAActivityChange = async () => {
    if (selectedActivity && generatedReqData?.id) {
      try {
        const response = await api.post(
          `/sr-task/${generatedReqData.id}/activity`,
          { sla_activity: selectedActivity.value }
        );
        if (response.status === 200) {
          Notify.success("Activity created successfully");
          await refreshServiceData();
        } else {
         Notify.error(
            error.response?.data?.errors?.detail ||
            error.response?.data?.message ||
            "Failed to fetch"
        );
        }
      } catch (error) {
      Notify.error(
            error.response?.data?.errors?.detail ||
            error.response?.data?.message ||
            "Failed to fetch"
        );
      }
    }
    setShowConfirmation(false);
  };
  const handleConfirm = async () => {
    if (confirmationType === "status") {
      await confirmStatusChange();
    } else if (confirmationType === "sla") {
      await confirmSLAActivityChange();
    }
  };

  const handleNavigateToSubTask = () => {
    navigate(SELF_SERVICES_ROUTES.SERVICES.CREATE.path, {
      state: { isChild: true, serviceRequestId: serviceRequest?.id },
    });
  };

  const handleRefresh = async () => {
    if (refreshServiceData) {
      await refreshServiceData();
      Notify.success("Data refreshed");
    }
  };

  const getConfirmationMessage = () => {
    if (confirmationType === "status") {
      return `Are you sure you want to update the status to ${selectedStatus?.label}?`;
    } else if (confirmationType === "sla") {
      return `Are you sure you want to create the activity ${selectedActivity?.label}?`;
    }
    return "";
  };

  const TaskFormHeader = () => (
    <div className="xl:col-span-9 col-span-12">
      <div className="box">
        <div className="box-body">
          <div className="grid grid-cols-12 gap-4">
            <div className="xl:col-span-3 col-span-12">
              <button
                onClick={handleNavigateToSubTask}
                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
              >
                <i className="ri-add-line font-semibold align-middle"></i> Sub Task
              </button>
            </div>
            <div className="xl:col-span-3 col-span-12">
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
            <div className="xl:col-span-3 col-span-12">
              <SRAsyncSelect
                label={false}
                name="sla_activity"
                control={control}
                errors={errors}
                placeholder="SLA Activity"
                apiUrl={`/select/sla/activity/?sub_department_id=${serviceRequest.sub_department_id}`}
                queryKeyBase="sla_activity"
                clientSideSearch={true}
                preselectedOptions={[]}
                onOptionSelect={handleSLAActivityChange}
              />
            </div>
            <div className="xl:col-span-3 col-span-12 flex justify-end">
              <button
                type="button"
                onClick={handleRefresh}
                className="hs-dropdown-toggle ti-btn ti-btn-success-full !py-1 !px-2 !text-[0.75rem]"
              >
                <i className="ri-refresh-line font-semibold align-middle"></i> Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader
        currentpage="Task Generated"
        activepage="SR Assignment"
        mainpage="Task Generated"
      />
      <div className="dark:bg-bodybg p-4 rounded-lg my-6">
        <ConfirmationModal
          show={showConfirmation}
          message={getConfirmationMessage()}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirmation(false)}
        />
        <TaskFormHeader />
        <CreatedAssign generatedReqData={generatedReqData} serviceRequest={serviceRequest} />
        <div className="flex flex-col lg:flex-row lg:space-x-4 w-full mt-8">
          <ContentLeft
            generatedReqData={generatedReqData}
            serviceRequest={serviceRequest}
            selectedStatus={selectedStatus}
          />
          <ContentRight generatedReqData={generatedReqData} serviceRequest={serviceRequest} refreshServiceData={refreshServiceData} />
        </div>
      </div>
    </>
  );
}

export default TaskGeneratedForm;
