import React, {useEffect, useState} from "react";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import {formatOptions} from "@helpers/formatters.js";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import serviceRequestSchema from "@modules/employee-self-services/schemas/service-request/ServiceRequestSchema.js";
import {useServiceRequestForm} from "@modules/employee-self-services/hooks/service-request/ServiceRequestHook.js";
import FormInput from "@components/form/FormInput.jsx";
import FormRichTextarea from "@components/form/FormRichTextarea.jsx";
import FormButton from "@components/form/FormButton.jsx";
import ServiceRequestCard from "@modules/employee-self-services/service-request/components/ServiceRequestCard.jsx";
import {useSelector} from "react-redux";
import SRAsyncSelect from "@modules/sr-management/component/components/SRAsyncSelect.jsx";

const ServiceRequestForm = ({serviceData, isSaveMode = false, isChild = false, serviceRequestId}) => {
  const user = useSelector((state) => state.auth.user);
  const [isSavedAsDraft, setIsSavedAsDraft] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(serviceData?.is_submitted || false);
  const [showOnBehalfOfField, setShowOnBehalfOfField] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  const {control, handleSubmit, formState: {errors}, setValue, watch} = useForm({
    resolver: zodResolver(serviceRequestSchema()),
    defaultValues: {
      company_id: user.employee.company.id || 1,
      sr_number: serviceData?.sr_number || "",
      on_behalf_of: serviceData?.on_behalf_of || false,
      on_behalf_employee: serviceData?.on_behalf_employee || "",
      reporter: user?.full_name,
      reporter_email: user?.email,
      to_email: serviceData?.to_email?.map((email) => email.replace(/[\n\r]+/g, "").trim()) || [],
      cc_email: serviceData?.cc_email || [],
      attachments: serviceData?.attachments?.map((file) => file.id) || [],
      description: serviceData?.description || "",
      location_id: serviceData?.location.id || null,
      department_id: serviceData?.department.id || null,
      sub_department_id: serviceData?.sub_department.id || null,
      sr_type: serviceData?.sr_type.id || null,
      parent_request: serviceData?.parent_request || null,
      need_by_date: serviceData?.need_by_date || "",
    },
  });

  const selectedDepartment = watch("department_id");
  const selectedSubDepartment = watch("sub_department_id");

  const handleEmailSelect = (email) => {
    setValue("to_email", [email?.email]);
  };

  const {saveAsDraft, submitRequest} = useServiceRequestForm(serviceData, isSaveMode);

  useEffect(() => {
    if (serviceData) {
      Object.keys(serviceData).forEach((key) => setValue(key, serviceData[key]));
      setIsSavedAsDraft(serviceData?.is_submitted === false);
      setIsSubmitted(serviceData?.is_submitted || false);
    }
  }, [serviceData, setValue]);

  const handleSaveDraft = async (data) => {
    setIsSaving(true);
    try {
      const payload = {
        ...data,
        attachments: data.attachments.filter((file) => (typeof file === "object" ? file.file_content : true)),
        is_submitted: false,
        parent_request: serviceRequestId || null,
      };
      await saveAsDraft(payload);
      setIsSavedAsDraft(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitRequest = async (data) => {
    setIsSubmittingRequest(true);
    try {
      const payload = {
        ...data,
        attachments: data.attachments.filter((file) => (typeof file === "object" ? file.file_content : true)),
        is_submitted: true,
        parent_request: serviceRequestId || null,
      };
      if (isSaveMode && serviceData?.id) {
        await submitRequest(serviceData.id, payload);
      } else {
        await submitRequest(null, payload);
      }
      setIsSavedAsDraft(false);
      setIsSubmitted(true);
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full">
      <div className="mx-auto w-full max-w-[1400px] px-4">
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
          <div className="w-full">
            <div className="box">
              <div className="box-body overflow-hidden">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 xl:col-span-4">
                    <FormAsyncSelect
                      label="Location"
                      name="location_id"
                      control={control}
                      errors={errors}
                      placeholder="Location"
                      apiUrl="/select/locations"
                      queryKeyBase="locations"
                      preselectedOptions={formatOptions(serviceData, "location")}
                    />
                  </div>
                  <div className="col-span-12 xl:col-span-4">
                    <FormAsyncSelect
                      label="Department"
                      name="department_id"
                      control={control}
                      errors={errors}
                      placeholder="Department"
                      apiUrl="/select/departments"
                      queryKeyBase="departments"
                      preselectedOptions={formatOptions(serviceData, "department")}
                    />
                  </div>
                  <div className="col-span-12 xl:col-span-4">
                    <SRAsyncSelect
                      label="Sub Department"
                      name="sub_department_id"
                      control={control}
                      errors={errors}
                      placeholder="Sub Department"
                      apiUrl={`/select/sub-departments?department_id=${selectedDepartment}`}
                      queryKeyBase={`subdepartments-${selectedDepartment}`}
                      preselectedOptions={formatOptions(serviceData, "sub_department")}
                      isDisabled={!selectedDepartment}
                      onOptionSelect={handleEmailSelect}
                    />
                  </div>
                  <div className="col-span-12 xl:col-span-4">
                    <FormAsyncSelect
                      label="SR Type"
                      name="sr_type"
                      control={control}
                      errors={errors}
                      placeholder="SR Type"
                      apiUrl={`/select/sr-types?sub_department_id=${selectedSubDepartment}`}
                      queryKeyBase={`srtype-${selectedSubDepartment}`}
                      preselectedOptions={formatOptions(serviceData, "sr_type")}
                      isDisabled={!selectedSubDepartment}
                    />
                  </div>
                  <div className="col-span-12 xl:col-span-4">
                    <FormInput type="date" name="need_by_date" control={control} errors={errors} placeholder="Needed Date" />
                  </div>
                  <div className="col-span-12">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="on_behalf_of"
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setShowOnBehalfOfField(isChecked);
                          setValue("on_behalf_of", isChecked);
                          setValue("on_behalf_employee", isChecked ? "" : null);
                        }}
                        checked={watch("on_behalf_of") || false}
                      />
                      <span>On Behalf Of</span>
                    </label>
                  </div>
                  {showOnBehalfOfField && (
                    <div className="col-span-12 xl:col-span-4">
                      <FormAsyncSelect
                        label="On Behalf Of Employee"
                        name="on_behalf_employee"
                        control={control}
                        errors={errors}
                        placeholder="On Behalf Of Employee"
                        apiUrl="/select/users/email/"
                        queryKeyBase="employees"
                        preselectedOptions={formatOptions(serviceData, "on_behalf_employee")}
                      />
                    </div>
                  )}
                  <div className="col-span-12">
                    <FormInput name="request_title" control={control} errors={errors} placeholder="Request Title" />
                  </div>
                  <div className="col-span-12">
                    <FormRichTextarea
                      name="description"
                      control={control}
                      errors={errors}
                      placeholder="Description"
                      editorOptions={{
                        height: 150,
                        buttonList: [
                          ["bold", "italic", "underline", "strike"],
                          ["font", "fontSize", "fontColor", "hiliteColor"],
                          ["align", "list", "table"],
                        ],
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-dashed dark:border-defaultborder/10 flex justify-end gap-3">
                {!isSubmitted && (
                  <>
                    <FormButton text="Save" type="button" isLoading={isSaving} onClick={handleSubmit(handleSaveDraft)} />
                    <FormButton text="Submit" type="button" isLoading={isSubmittingRequest} onClick={handleSubmit(handleSubmitRequest)} />
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="w-full xl:w-[360px] shrink-0">
            <ServiceRequestCard
              currentUser={user}
              serviceData={serviceData}
              control={control}
              setValue={setValue}
              errors={errors}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default ServiceRequestForm;
