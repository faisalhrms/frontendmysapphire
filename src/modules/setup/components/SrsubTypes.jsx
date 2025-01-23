import { useForm } from "react-hook-form";
import React, { useCallback, useEffect, useState } from "react";
import api from "@config/axiosConfig.js";
import FormButton from "@components/form/FormButton.jsx";


const SrsubTypesForm = ({ handleSubmitData, saveData }) => {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting }, // Ensure isSubmitting is destructured
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


    const [selectedDepartment, setSelectedDepartment] = useState(
        saveData?.sr_type_joins?.[0]?.department || null
    );
    const [selectedSubDepartment, setSelectedSubDepartment] = useState(
        saveData?.sr_type_joins?.[0]?.sub_department || null
    );
    const [selectedCompany, setSelectedCompany] = useState(
        saveData?.sr_type_joins?.[0]?.department?.company_id || null
    );

    // Fetch Departments
    const fetchDepartments = useCallback(async () => {
        try {
            const response = await api.get("/select/departments");
            const formattedOptions = response.data.data.map((item) => ({
                value: item.value,
                label: item.label,
            }));
            console.log(response.data.data)
            setDepartmentOptions(formattedOptions);

            // Set default department
            if (saveData?.sr_type_joins?.[0]?.department?.id) {
                const defaultDepartment = formattedOptions.find(
                    (option) => option.value === saveData.sr_type_joins[0].department.id
                );
                if (defaultDepartment) {
                    setSelectedDepartment(defaultDepartment);
                }
            }
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    }, [saveData]);

    // Fetch Sub-Departments
    const fetchSubDepartments = useCallback(async (departmentId) => {
        try {
            const response = await api.get(`/select/sub-departments/`);
            const formattedOptions = response.data.data.map((item) => ({
                value: item.value,
                label: item.label,
            }));
            setSubDepartmentOptions(formattedOptions);

            // Set default sub-department
            if (saveData?.sr_type_joins?.[0]?.sub_department?.id) {
                const defaultSubDepartment = formattedOptions.find(
                    (option) => option.value === saveData.sr_type_joins[0].sub_department.id
                );
                if (defaultSubDepartment) {
                    setSelectedSubDepartment(defaultSubDepartment);
                }
            }
        } catch (error) {
            console.error("Error fetching sub-departments:", error);
        }
    }, [saveData]);

    // Fetch Companies
    const fetchCompanies = useCallback(async () => {
        try {
            const response = await api.get("/select/companies");
            const formattedOptions = response.data.data.map((item) => ({
                value: item.value,
                label: item.label,
            }));

            console.log(response.data.data)
            setCompanyOptions(formattedOptions);

            // Set default company
            if (saveData?.sr_type_joins?.[0]?.department?.company_id) {
                const defaultCompany = formattedOptions.find(
                    (option) => option.value === saveData.sr_type_joins[0].department.company_id
                );
                if (defaultCompany) {
                    setSelectedCompany(defaultCompany);
                }
            }
        } catch (error) {
            console.error("Error fetching companies:", error);
        }
    }, [saveData]);

    // Fetch data on mount
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
                {/* Company Dropdown */}
                <div className="xl:col-span-4 col-span-12">
                    <label className="block mb-2 text-sm font-medium text-black">Company</label>
                    <select
                        value={selectedCompany?.value || ""}
                        onChange={(e) => {
                            const selectedOption = companyOptions.find(
                                (option) => option.value === parseInt(e.target.value, 10)
                            );
                            setSelectedCompany(selectedOption);
                            setValue("company_id", selectedOption?.value || null);
                        }}
                        className="block w-full px-3 py-1.5 text-sm border border-gray-300 bg-white rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="" disabled>
                            Select a Company
                        </option>
                        {companyOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Department Dropdown */}
                <div className="xl:col-span-4 col-span-12">
                    <label className="block mb-2 text-sm font-medium text-black">Department</label>
                    <select
                        value={selectedDepartment?.value || ""}
                        onChange={(e) => {
                            const selectedOption = departmentOptions.find(
                                (option) => option.value === parseInt(e.target.value, 10)
                            );
                            setSelectedDepartment(selectedOption);
                            setValue("department", selectedOption?.value || null);

                            // Reset Sub-Department when Department changes
                            setSelectedSubDepartment(null);
                            setValue("sub_department", null);

                            // Fetch Sub-Departments
                            if (selectedOption?.value) {
                                fetchSubDepartments(selectedOption.value);
                            }
                        }}
                        className="block w-full px-3 py-1.5 text-sm border border-gray-300 bg-white rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="" disabled>
                            Select a Department
                        </option>
                        {departmentOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sub-Department Dropdown */}
                <div className="xl:col-span-4 col-span-12">
                    <label className="block mb-2 text-sm font-medium text-black">Sub-Department</label>
                    <select
                        value={selectedSubDepartment?.value || ""}
                        onChange={(e) => {
                            const selectedOption = subDepartmentOptions.find(
                                (option) => option.value === parseInt(e.target.value, 10)
                            );
                            setSelectedSubDepartment(selectedOption);
                            setValue("sub_department", selectedOption?.value || null);
                        }}
                        className="block w-full px-3 py-1.5 text-sm border border-gray-300 bg-white rounded-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="" disabled>
                            Select a Sub-Department
                        </option>
                        {subDepartmentOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-span-12 flex justify-end">
                    <FormButton isLoading={isSubmitting} type="submit"/>
                </div>

            </div>
        </form>
    );
};

export default SrsubTypesForm;
