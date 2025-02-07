import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import FormButton from "@components/form/FormButton.jsx";
import FormInput from "@components/form/FormInput.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import {
  createDigitalProfiles,
  getDigitalProfilesById,
  updateDigitalProfiles,
} from "@modules/digital-profiles/services/Service.js";
import api from "@config/axiosConfig.js";

const DigitalProfileForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  const [dataPreselect, setDataPreselect] = useState({});
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      id: "",
      user_ids: null,
      name: "",
      position: "",
      phone: "",
      email: "",
      media: null,
      address: "",
      company: "",
    },
  });

  const handleEmployeeChange = async (employeeId) => {
    setValue("user_ids", employeeId);
    if (employeeId) {
      try {
        const url = `digital_profiles/${employeeId}/employees_data/`;
        const res = await api.get(url);
        const empData = res.data?.data || res.data;
        setValue("name", empData?.full_name || "");
        setValue("position", empData?.employee?.position?.name || "");
        setValue("department", empData?.employee?.department?.name || "");
        setValue("phone", empData?.employee?.phone || "");
        setValue("email", empData?.email || "");
        setValue("company", empData?.company_details.id || "");
        setValue("address", empData?.company_details?.address || "");
      } catch (error) {}
    }
  };

  const fetchDigitalProfile = async (profileId) => {
    try {
      const res = await getDigitalProfilesById(profileId);

      setValue("name", res?.name || "");
      setValue("position", res?.position || "");
      setValue("department", res?.department || "");
      setValue("phone", res?.phone || "");
      setValue("email", res?.email || "");
      setValue("address", res?.address || "");
      setDataPreselect(res);
    } catch (error) {}
  };

  useEffect(() => {
    if (id) {
      fetchDigitalProfile(id);
    }
  }, [id]);

  console.log(dataPreselect);
useEffect(() => {
  if (dataPreselect && typeof dataPreselect === "object") {
    Object.keys(dataPreselect).forEach((key) => {
      if (key === "company") {
        setValue("company", dataPreselect.company?.id || "");
      } else {
        setValue(key, dataPreselect[key]);
      }
    });
  }
}, [dataPreselect, setValue]);


  const onSubmit = async () => {
    try {
      const newData = getValues();
      if (id) {
        await updateDigitalProfiles(id, newData);
      } else {
        await createDigitalProfiles(newData);
      }
      navigate("/module/digital/profiles");
    } catch (error) {}
  };

  return (
    <div>
      <PageHeader currentpage="Digital Profiles" mainpage="Digital Profiles" />
      <div className="xl:col-span-9 col-span-12">
        <div className="box">
          <div className="box-header">
            <div className="box-title">
              {id && id !== ":id" ? "Edit Digital Profile" : "Add Digital Profile"}
            </div>
          </div>
          <div className="box-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-12 gap-4">
                <div className="xl:col-span-4 col-span-12">
                  <FormAsyncSelect
                      name="user_ids"
                      label="Employees"
                      control={control}
                      errors={errors}
                      placeholder="Search Employee"
                      apiUrl="/select/users"
                      queryKeyBase="employee_data"
                      preselectedOptions={[]}
                      onSelectChange={(value) => handleEmployeeChange(value)}
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <FormInput
                      name="name"
                      type="text"
                      control={control}
                      errors={errors}
                      placeholder="Name"
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <FormInput
                      name="position"
                      type="text"
                      control={control}
                      errors={errors}
                      placeholder="Position"
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <FormInput
                      name="department"
                      type="text"
                      control={control}
                      errors={errors}
                      placeholder="Department"
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <FormInput
                      name="phone"
                      type="number"
                      control={control}
                      errors={errors}
                      placeholder="Phone"
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <FormInput
                      name="email"
                      type="email"
                      control={control}
                      errors={errors}
                      placeholder="Email"
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <FormInput
                      name="address"
                      type="text"
                      control={control}
                      errors={errors}
                      placeholder="Address"
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-dashed sm:flex justify-end">
                <FormButton isLoading={isSubmitting} type="submit"/>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalProfileForm;