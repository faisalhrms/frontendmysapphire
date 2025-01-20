import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormInput from "@components/form/FormInput.jsx";
import FormButton from "@components/form/FormButton.jsx";
import { zodResolver } from "@hookform/resolvers/zod";
import equipmentSchema from "@modules/inventory/schemas/equipmentSchema.js";

import { useLocation, useNavigate } from "react-router-dom";
import {
  createCompany,
  getCompanyById,
  updateCompany,
} from "../services/service";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import FileUpload from "@components/FileUpload.jsx";

const CompanyForm = () => {
  const [companyLogo, setCompanyLogo] = useState("");
  const navigate = useNavigate();
  
  const location = useLocation();
  const { id } = location.state || {};

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      id: "",
      name: "",
      short_name: "",
      full_name: "",
      business: "",
      media: null,
      website: "",
      address: "",
    },
  });

  const fetchCompany = async (companyId) => {
    try {
      const res = await getCompanyById(companyId);
      console.log(res)
      setValue("name", res?.name || "");
      setValue("business", res?.business || "");
      setValue("website", res?.website || "");
      setValue("address", res?.address || "");
      setValue("short_name", res?.short_name || "");
      setValue("full_name", res?.full_name || "");
      setValue("media", res?.media || "");
     
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCompany(id);
    }
  }, [id]);

  const onSubmit = async (data) => {
    try {
      const newData = getValues();
      console.log(newData)
      if (id ) {
        await updateCompany(id, newData);
        navigate("/module/setup");
      } else {
        await createCompany(newData);
        navigate("/module/setup");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <PageHeader currentpage="Companies" mainpage="Companies" />

      <div className="xl:col-span-9 col-span-12">
        <div className="box">
          <div className="box-header">
            <div className="box-title">
              {id && id !== ":id" ? "Edit Company" : "Add Company"}
             
            </div>
          </div>
          <div className="box-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-12 gap-4">
                <div className="xl:col-span-12 col-span-12">
                  <FileUpload
                    currentValue={companyLogo}
                    inputName="media"
                    control={control}
                    errors={errors}
                    setCompanyLogo={setCompanyLogo}
                  />
                </div>

                <div className="xl:col-span-4 col-span-12">
                  <FormInput
                    {...register("name")}
                    type="text"
                    onChange={(e) => setValue("name", e.target.value)}
                    control={control}
                    errors={errors}
                    label={true}
                    placeholder="Name"
                  />
                </div>

                <div className="xl:col-span-4 col-span-12">
                  <FormInput
                    {...register("short_name")}
                    type="text"
                    onChange={(e) => setValue("short_name", e.target.value)}
                    control={control}
                    errors={errors}
                    label={true}
                    placeholder="Short Name"
                  />
                </div>

                <div className="xl:col-span-4 col-span-12">
                  <FormInput
                    {...register("full_name")}
                    type="text"
                    onChange={(e) => setValue("full_name", e.target.value)}
                    control={control}
                    errors={errors}
                    label={true}
                    placeholder="Full Name"
                  />
                </div>

                <div className="xl:col-span-4 col-span-12">
                  <FormInput
                    {...register("business")}
                    type="text"
                    onChange={(e) => setValue("business", e.target.value)}
                    control={control}
                    errors={errors}
                    label={true}
                    placeholder="Business"
                  />
                </div>

                <div className="xl:col-span-4 col-span-12">
                  <FormInput
                    {...register("website")}
                    type="text"
                    onChange={(e) => setValue("website", e.target.value)}
                    control={control}
                    errors={errors}
                    label={true}
                    placeholder="Website"
                  />
                </div>

                <div className="xl:col-span-4 col-span-12">
                  <FormInput
                    {...register("address")}
                    type="text"
                    onChange={(e) => setValue("address", e.target.value)}
                    control={control}
                    errors={errors}
                    label={true}
                    placeholder="Address"
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
    </div>
  );
};

export default CompanyForm;
