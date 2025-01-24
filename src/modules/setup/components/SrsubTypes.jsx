import { useForm } from "react-hook-form";
import React, { useCallback, useEffect, useState } from "react";
import api from "@config/axiosConfig.js";
import FormButton from "@components/form/FormButton.jsx";
import Select from "react-select";

const SrsubTypesForm = ({ handleSubmitData, saveData }) => {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    } = useForm({
        defaultValues: {
            name: saveData?.name || "",
            short_name: saveData?.short_name || "",
            department: saveData?.sr_type_joins?.[0]?.department?.id || null,
            sub_department: saveData?.sr_type_joins?.[0]?.sub_department?.id || null,
            company_id: saveData?.sr_type_joins?.[0]?.department?.company_id || null,
        },
    });

    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [subDepartmentOptions, setSubDepartmentOptions] = useState([]);
    const [companyOptions, setCompanyOptions] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedSubDepartment, setSelectedSubDepartment] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [isDefaultSet, setIsDefaultSet] = useState(false);


    const fetchDepartments = useCallback(async () => {
        try {
            const company_id = watch("company_id") || "";
            const response = await api.get(`/select/departments${company_id ? `?company_id=${company_id}&search=` : ""}`);
            const res = response?.data?.data?.length ? response.data.data : [];
            const formattedOptions = res.map((item) => ({
                value: item.value,
                label: item.label,
            }));

            setDepartmentOptions(formattedOptions);

            // Set default department only once
            if (saveData?.sr_type_joins?.[0]?.department?.id && !isDefaultSet) {
                const defaultDepartment = formattedOptions.find(
                    (option) => option.value === saveData.sr_type_joins[0].department.id
                );
                if (defaultDepartment) {
                    setSelectedDepartment(defaultDepartment);
                    setValue("department", defaultDepartment.value);
                    setIsDefaultSet(true); // Prevent resetting default
                }
            }
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    }, [saveData, watch, setValue, isDefaultSet]);


    const fetchSubDepartments = useCallback(async (departmentId) => {
        try {
            const response = await api.get(`/select/sub-departments?department_id=${departmentId}`);
            const res = response?.data?.data?.length ? response.data.data : [];
            const formattedOptions = res.map((item) => ({
                value: item.value,
                label: item.label,
            }));

            setSubDepartmentOptions(formattedOptions);

            // Set default sub-department only if present in saveData
            if (saveData?.sr_type_joins?.[0]?.sub_department?.id && !isDefaultSet) {
                const defaultSubDepartment = formattedOptions.find(
                    (option) => option.value === saveData.sr_type_joins[0].sub_department.id
                );
                if (defaultSubDepartment) {
                    setSelectedSubDepartment(defaultSubDepartment);
                    setValue("sub_department", defaultSubDepartment.value);
                }
            }
        } catch (error) {
            console.error("Error fetching sub-departments:", error);
        }
    }, [saveData, setValue, isDefaultSet]);


    const fetchCompanies = useCallback(async () => {
        try {
            const response = await api.get("/select/companies");
            const formattedOptions = response.data.data.map((item) => ({
                value: item.value,
                label: item.label,
            }));
            setCompanyOptions(formattedOptions);

            // Set default company
            if (saveData?.sr_type_joins?.[0]?.department?.company_id && !isDefaultSet) {
                const defaultCompany = formattedOptions.find(
                    (option) => option.value === saveData.sr_type_joins[0].department.company_id
                );
                if (defaultCompany) {
                    setSelectedCompany(defaultCompany);
                    setValue("company_id", defaultCompany.value);
                }
            }
        } catch (error) {
            console.error("Error fetching companies:", error);
        }
    }, [saveData, setValue, isDefaultSet]);


    useEffect(() => {
        fetchDepartments();
        fetchCompanies();

        if (saveData?.sr_type_joins?.[0]?.department?.id) {
            fetchSubDepartments(saveData.sr_type_joins[0].department.id);
        }
    }, [fetchDepartments, fetchCompanies, fetchSubDepartments, saveData]);

    const onSubmit = (formData) => {
        console.log("Form Data Submitted:", formData);
        handleSubmitData(formData, 1);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-12 gap-4">

                <div className="xl:col-span-4 col-span-12">
                    <label className="block mb-2 text-sm font-medium text-black">Company</label>
                    <Select
                        value={selectedCompany}
                        onChange={(selectedOption) => {
                            setSelectedCompany(selectedOption);
                            setValue("company_id", selectedOption?.value || null);
                        }}
                        options={companyOptions}
                        placeholder="Select a Company"
                        isSearchable
                        className="block w-full text-sm border border-gray-400 bg-white rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        classNamePrefix="custom-select"
                    />
                </div>


                <div className="xl:col-span-4 col-span-12">
                    <label className="block mb-2 text-sm font-medium text-black">Department</label>
                    <Select
                        value={selectedDepartment}
                        onChange={(selectedOption) => {
                            setSelectedDepartment(selectedOption);
                            setValue("department", selectedOption?.value || null);
                            setSelectedSubDepartment(null); // Reset Sub-Department
                            setValue("sub_department", null); // Reset Sub-Department in form
                            fetchSubDepartments(selectedOption.value); // Fetch Sub-Departments
                        }}
                        options={departmentOptions}
                        placeholder="Select a Department"
                        isSearchable
                        className="block w-full text-sm border border-gray-300 bg-white rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        classNamePrefix="custom-select"
                    />
                </div>


                <div className="xl:col-span-4 col-span-12">
                    <label className="block mb-2 text-sm font-medium text-black">Sub-Department</label>
                    <Select
                        value={selectedSubDepartment}
                        onChange={(selectedOption) => {
                            setSelectedSubDepartment(selectedOption);
                            setValue("sub_department", selectedOption?.value || null);
                        }}
                        options={subDepartmentOptions}
                        placeholder="Select a Sub-Department"
                        isSearchable
                        className="block w-full text-sm border border-gray-300 bg-white rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        classNamePrefix="custom-select"
                    />
                </div>

                <div className="col-span-12 flex justify-end">
                    <FormButton isLoading={isSubmitting} type="submit" />
                </div>
            </div>
        </form>
    );
};

export default SrsubTypesForm;
