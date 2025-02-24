import React, {useCallback, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useLocation, useNavigate} from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import FormButton from "@components/form/FormButton.jsx";
import FormInput from "@components/form/FormInput.jsx";
import {SLA_SETUP_ROUTES} from "@modules/sr-management/sla-setup/routes.js";
import CompanyDropdown from "@components/dropdowns/CompanyDropdown.jsx";
import DepartmentDropdown from "@components/dropdowns/DepartmentDropdown.jsx";
import SubDepartmentDropdown from "@components/dropdowns/SubDepartmentDropdown.jsx";
import {createSLA, getSLAById, updateSLA} from "@modules/sr-management/sla-setup/services/Service.js";

const SlaSetupForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {id} = location.state || {};
    const [department, setDepartment] = useState(null);
    const [subDepartment, setSubDepartment] = useState(null);
    const [company, setCompany] = useState(null);
    const [sla, setSLA] = useState(null);

    const {
        handleSubmit,
        control,
        setValue,
        getValues,
        formState: {errors, isSubmitting},
    } = useForm({
        defaultValues: {
            id: "",
            company_id: "",
            department_id: "",
            sub_department_id: "",
            sla_days: "",
            name: ""
        },
    });
    const handleCompanySelect = useCallback((id) => {
        setCompany(id);
        setDepartment(null);
        setSubDepartment(null);
        setValue("department_id", "");
        setValue("sub_department_id", "");
    }, [setValue]);

    const handleDepartmentSelect = useCallback((id) => {
        setDepartment(id);
        setSubDepartment(null);
        setValue("sub_department_id", "");
    }, [setValue]);

    const handleSubDepartmentSelect = useCallback((id) => {
        setSubDepartment(id);
    }, []);

    const fetchSLA = async (SLA) => {
        try {
            const res = await getSLAById(SLA);
            setSLA(res);
        } catch (error) {
        }
    };
useEffect(() => {
    if (sla) {
        setValue("id", sla.id);
        setValue("name", sla.name);
        setValue("company_id", sla.company?.id || "");
        setValue("department_id", sla.department?.id || "");
        setValue("sub_department_id", sla.sub_department?.id || "");
        setValue("sla_days", sla.sla_days);

        setCompany(sla.company?.id || null);
        setDepartment(sla.department?.id || null);
        setSubDepartment(sla.sub_department?.id || null);
    }
}, [sla, setValue]);

    useEffect(() => {
        if (id) {
            fetchSLA(id);
        }
    }, [id]);

    const onSubmit = async () => {
        try {
            const newData = getValues();
            if (id) {
                await updateSLA(id, newData);
            } else {
                await createSLA(newData);
            }
            navigate(SLA_SETUP_ROUTES.READ.path);
        } catch (error) {
        }
    };

    return (
        <div>
            <PageHeader currentpage="SLA Setup" mainpage="SLA Setup"/>
            <div className="xl:col-span-9 col-span-12">
                <div className="box">
                    <div className="box-header">
                        <div className="box-title">
                            {id && id !== ":id" ? "Edit SR SLA" : "Add SR SLA"}
                        </div>
                    </div>
                    <div className="box-body">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-12 gap-4">
                                <div className="xl:col-span-4 col-span-12">
                                    <FormInput
                                        name="name"
                                        type="text"
                                        control={control}
                                        errors={errors}
                                        placeholder="Activity Name"
                                    />
                                </div>
                                <div className="xl:col-span-4 col-span-12">
                                    <CompanyDropdown
                                        name="company_id"
                                        control={control}
                                        errors={errors}
                                        placeholder="Company"
                                        haveLabel={true}
                                        onCompanySelect={handleCompanySelect}
                                        data={sla}
                                    />
                                </div>
                                <div className="xl:col-span-4 col-span-12">
                                    <DepartmentDropdown
                                        control={control}
                                        errors={errors}
                                        company_id={company}
                                        haveLabel={true}
                                        onDepartmentSelect={handleDepartmentSelect}
                                         data={sla}
                                    />
                                </div>
                                <div className="xl:col-span-4 col-span-12">
                                    <SubDepartmentDropdown
                                        name="sub_department_id"
                                        control={control}
                                        errors={errors}
                                        department_id={department}
                                        haveLabel={true}
                                        placeholder="Sub department"
                                        onSubDepartmentSelect={handleSubDepartmentSelect}
                                        data={sla}
                                    />
                                </div>
                                <div className="xl:col-span-4 col-span-12">
                                    <FormInput
                                        name="sla_days"
                                        type="number"
                                        control={control}
                                        errors={errors}
                                        placeholder="SLA Days"
                                        min={0}
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

export default SlaSetupForm;
