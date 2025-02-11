import {useForm, useWatch} from "react-hook-form";
import React, {useEffect, useMemo, useState} from "react";
import FormInput from "@components/form/FormInput.jsx";
import FormButton from "@components/form/FormButton.jsx";
import TemplateSignature from "./TemplateSignature";
import SRAsyncSelect from "@modules/sr-management/component/components/SRAsyncSelect.jsx";
import FileUpload from "@components/FileUpload.jsx";

const SignatureForm = ({
  handleSubmitData,
  isEditMode = false,
  editData,
  hide,
  handleHide,
  tempStep,
  handleChangeTemplate
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors, isSubmitting},
    setValue,
    watch,
    reset
  } = useForm({
    defaultValues: useMemo(() => ({
      company_id: editData?.company_id || "",
      employee_code: editData?.employee_code || "",
      name: editData?.name || "",
      designation: editData?.designation || "",
      department: editData?.department || "",
      website: editData?.website || "",
      phone: editData?.phone || "",
      mobile: editData?.mobile || "",
      email: editData?.email || "",
      address: editData?.address || "",
      banner_media_id: editData?.banner_media_id || null
    }), [editData])
  });

  const [companyLogo, setCompanyLogo] = useState("");
  const [previewData, setPreviewData] = useState({});

  const handleCompanyChange = (selectedCompany) => {
    setCompanyLogo(selectedCompany?.logo || "");
    setValue("website", selectedCompany?.website || "");
    setValue("address", selectedCompany?.address || "");
  };

  useEffect(() => {
    reset(editData);
    setPreviewData(editData);
  }, [editData, reset]);

  useEffect(() => {
    const subscription = watch((formData) => {
      setPreviewData((prev) => ({...prev, ...formData}));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = (formData) => {
    handleSubmitData({...formData, companyLogo}, 2);
  };

  const handleClear = () => {
    reset({
      company_id: "",
      employee_code: "",
      name: "",
      designation: "",
      department: "",
      website: "",
      phone: "",
      mobile: "",
      email: "",
      address: "",
      banner_media_id: null
    });
    setPreviewData({});
    setCompanyLogo("");
    handleHide();
  };

  return (
    <div className="grid grid-cols-12 gap-x-4">
      <div className="xxl:col-span-7 col-span-12 sm:col-span-7">
        <div className="box">
          <div className="box-header">
            <div className="box-title">Signature Form</div>
          </div>
          <div className="box-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-12 gap-4">
                <div className="xl:col-span-4 col-span-12">
                  <SRAsyncSelect
                    label={true}
                    name="company_id"
                    control={control}
                    errors={errors}
                    placeholder="Company"
                    apiUrl="/select/company_details"
                    queryKeyBase="company_details"
                    clientSideSearch
                    preselectedOptions={[]}
                    onOptionSelect={handleCompanyChange}
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <FormInput
                    type="text"
                    name="employee_code"
                    control={control}
                    errors={errors}
                    label={true}
                    placeholder="Employee Code"
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <FormInput
                    name="name"
                    control={control}
                    errors={errors}
                    placeholder="Employee Name"
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <FormInput
                    type="text"
                    name="designation"
                    control={control}
                    errors={errors}
                    label={true}
                    placeholder="Designation"
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <FormInput
                    name="department"
                    control={control}
                    errors={errors}
                    placeholder="Department"
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <FormInput
                    type="text"
                    name="website"
                    control={control}
                    errors={errors}
                    label={true}
                    placeholder="Website"
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <FormInput
                    type="text"
                    name="phone"
                    control={control}
                    errors={errors}
                    label={true}
                    placeholder="Phone number"
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <FormInput
                    type="text"
                    name="mobile"
                    control={control}
                    errors={errors}
                    label={true}
                    placeholder="Mobile"
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <FormInput
                    type="email"
                    name="email"
                    control={control}
                    errors={errors}
                    label={true}
                    placeholder="Email"
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <FormInput
                    type="text"
                    name="address"
                    control={control}
                    errors={errors}
                    label={true}
                    placeholder="Address"
                  />
                </div>
                <div className="col-span-12">
                  <FileUpload
                    currentValue={editData?.banner_media?.id || null}
                    file={editData?.banner_media || null}
                    inputName="banner_media_id"
                    control={control}
                    errors={errors}
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-dashed sm:flex justify-end">
                <FormButton isLoading={isSubmitting} type="submit" />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="xxl:col-span-5 col-span-12 sm:col-span-5">
        <div className="box">
          <div className="box-header">
            <div className="box-title">Preview</div>
          </div>
          <div className="border border-dashed border-gray-300 rounded-md p-4 bg-white">
            <TemplateSignature
              title={false}
              editData={editData}
              previewData={previewData}
              tempStep={tempStep}
              companyLogo={companyLogo}
            />
          </div>
          <div className="mt-4 flex justify-end gap-4 mb-4 mr-4">
            <button
              className="px-4 py-2 text-sm font-medium rounded-md ti-btn-primary-full"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureForm;
