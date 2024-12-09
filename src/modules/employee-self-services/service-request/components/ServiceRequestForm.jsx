import React, { useEffect, useState } from "react";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import { formatOptions } from "@helpers/formatters.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import serviceRequestSchema from "@modules/employee-self-services/schemas/service-request/ServiceRequestSchema.js";
import { useServiceRequestForm } from "@modules/employee-self-services/hooks/service-request/ServiceRequestHook.js";
import FormInput from "@components/form/FormInput.jsx";
import FormRichTextarea from "@components/form/FormRichTextarea.jsx";
import GalleryUpload from "@components/GalleryUpload.jsx";
import FormButton from "@components/form/FormButton.jsx";
import ServiceRequestCard from "@modules/employee-self-services/service-request/components/ServiceRequestCard.jsx";
import { useSelector } from "react-redux";

const ServiceRequestForm = ({
  serviceData,
  isSaveMode = false,
  isChild = false,
  serviceRequestId,
}) => {
  const user = useSelector((state) => state.auth.user);

  const [isSavedAsDraft, setIsSavedAsDraft] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(
    serviceData?.is_submitted || false
  );
  const [subDepartmentOptions, setSubDepartmentOptions] = useState([]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(serviceRequestSchema(isSaveMode)),
    defaultValues: {
      reporter: user.full_name,
      reporter_email: user.email,
      cc_email: serviceData?.cc_email || [],
      attachment_ids: serviceData?.attachment_ids || [],
      department_id: serviceData?.department_id || null,
      sub_department_id: serviceData?.sub_department_id || null,
    },
  });

  const selectedDepartment = watch("department_id");
  const selectedSubDepartment = watch("sub_department_id");

  const handleEmailSelect = (email) => {
    setValue("to_email", [email]);
  };

  const { saveAsDraft, submitRequest } = useServiceRequestForm(
    serviceData,
    isSaveMode
  );

  useEffect(() => {
    if (serviceData) {
      Object.keys(serviceData).forEach((key) => {
        setValue(key, serviceData[key]);
      });
      setIsSavedAsDraft(serviceData?.is_submitted === false);
      setIsSubmitted(serviceData?.is_submitted || false);
    }
  }, [serviceData, setValue]);

  const handleSaveDraft = async (data) => {
    try {
      await saveAsDraft(data);
      setIsSavedAsDraft(true);
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  const handleSubmitRequest = async (data) => {
    try {
      const payload = {
        ...data,
        is_submitted: true,
        parent_request_id: serviceRequestId || null,
      };
      if (isSaveMode && serviceData?.id) {
        await submitRequest(serviceData.id, payload);
      } else {
        await submitRequest(null, payload);
      }
      setIsSavedAsDraft(false);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSaveDraft)} className="overflow-hidden">
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-9">
          <div className="box">
            <div className="box-body overflow-hidden">
              <div className="grid grid-cols-12 gap-4">
                <div className="xl:col-span-4 col-span-12">
                  <FormAsyncSelect
                    label="Location"
                    name="location_id"
                    control={control}
                    errors={errors}
                    placeholder="Location"
                    apiUrl="/select/locations"
                    queryKeyBase="locations"
                    clientSideSearch={true}
                    preselectedOptions={formatOptions(serviceData, "location")}
                  />
                </div>

                <div className="xl:col-span-4 col-span-12">
                  <FormAsyncSelect
                    label="Department"
                    name="department_id"
                    control={control}
                    errors={errors}
                    placeholder="Department"
                    apiUrl="/select/departments"
                    queryKeyBase="departments"
                    clientSideSearch={true}
                    preselectedOptions={formatOptions(
                      serviceData,
                      "department"
                    )}
                  />
                </div>

                <div className="xl:col-span-4 col-span-12">
                  <FormAsyncSelect
                    label="Sub Department"
                    name="sub_department_id"
                    control={control}
                    errors={errors}
                    placeholder="Sub Department"
                    apiUrl={`/select/sub-departments?department_id=${selectedDepartment}`}
                    queryKeyBase={`subdepartments-${selectedDepartment}`}
                    clientSideSearch={true}
                    preselectedOptions={formatOptions(
                      serviceData,
                      "subdepartment"
                    )}
                    isDisabled={!selectedDepartment}
                    onOptionSelect={handleEmailSelect}
                  />
                </div>

                <div className="xl:col-span-4 col-span-12">
                  <FormAsyncSelect
                    label="SR Type"
                    name="sr_type_id"
                    control={control}
                    errors={errors}
                    placeholder="SR Type"
                    apiUrl={`/select/sr-types?sub_department_id=${selectedSubDepartment}`}
                    queryKeyBase={`srtype-${selectedSubDepartment}`}
                    clientSideSearch={true}
                    preselectedOptions={formatOptions(serviceData, "sr_type")}
                    isDisabled={!selectedSubDepartment}
                  />
                </div>

                <div className="xl:col-span-4 col-span-12">
                  <FormInput
                    type="date"
                    name="need_by_date"
                    control={control}
                    errors={errors}
                    placeholder="Needed Date"
                  />
                </div>

                <div className="xl:col-span-12 col-span-12">
                  <FormInput
                    name="request_title"
                    control={control}
                    errors={errors}
                    placeholder="Request Title"
                  />
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
            <div className="px-6 py-4 border-t border-dashed dark:border-defaultborder/10 sm:flex justify-end">
              {!isSubmitted && (
                <>
                  <FormButton
                    text="Save"
                    onClick={handleSubmit(handleSaveDraft)}
                  />
                  <FormButton
                    text="Submit"
                    onClick={handleSubmit(handleSubmitRequest)}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        <ServiceRequestCard currentUser={user} serviceData={serviceData} />
      </div>
    </form>
  );
};

export default ServiceRequestForm;
