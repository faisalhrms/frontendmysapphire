import React, {useCallback, useState} from "react";
import {useForm} from "react-hook-form";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import CompletedCard from "@modules/dashboards/sr/components/CompletedCard.jsx";
import {usePersonViewDashboardStatistics} from "@modules/dashboards/sr/Hooks/srDashboardHook.js";
import CompletedOverdue from "@modules/dashboards/sr/components/completedOverdue.jsx";
import OverdueCard from "@modules/dashboards/sr/components/OverdueCard.jsx";
import TeamCard from "@modules/dashboards/sr/components/TeamCard.jsx";
import RatingCard from "@modules/dashboards/sr/components/RatingCard.jsx";
import ClosedSR from "@modules/dashboards/sr/components/ClosedSR.jsx";
import CompanyDropdown from "@components/dropdowns/CompanyDropdown.jsx";
import DepartmentDropdown from "@components/dropdowns/DepartmentDropdown.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import {view_type} from "@modules/dashboards/sr/services/srDashboardService.js";
import SubDepartmentDropdown from "@components/dropdowns/SubDepartmentDropdown.jsx";

const PersonView = () => {
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        company_id: null,
        department_id: null,
        sub_department_id: null,
        view_type: null,
    });
    const [company, setCompany] = useState(null);
    const [department, setDepartment] = useState(null);
    const [subDepartment, setSubDepartment] = useState(null);

    const handleCompanySelect = useCallback((id) => {
        setCompany(id)
        setDepartment(null)
    }, []);

    const handleDepartmentSelect = useCallback((id) => {
        setDepartment(id)
        setSubDepartment(null)
    }, []);

    const handleSubDepartmentSelect = useCallback((id) => {
        setSubDepartment(id)
    }, []);

    const {data, isLoading, refetch} = usePersonViewDashboardStatistics(filters);

    const {control, getValues, formState: {errors}, reset} = useForm({
        defaultValues: {
            company_id: "",
            department_id: "",
            sub_department_id: "",
            view_type: "",
        },
    });

    const toggleFilters = () => {
        setShowFilters((prev) => !prev);
    };

    const onSearchClick = () => {
        const formValues = getValues();
        setFilters({
            company_id: formValues.company_id || null,
            department_id: formValues.department_id || null,
            sub_department_id: formValues.sub_department_id || null,
            view_type: formValues.view_type || null,
        });
        refetch();
    };

    const onClearFilters = () => {
        reset();
        setFilters({company_id: null, department_id: null,sub_department_id: null, view_type: null});
        refetch();
    };

    return (
        <>
            <div className="grid grid-cols-12 gap-x-6 mb-1">
                <div className="xl:col-span-12 col-span-12">
                    <div className="btn-list float-end">
                        <button
                            type="button"
                            className="ti-btn bg-primary text-white btn-wave !font-medium !me-[0.375rem] !ms-1 !text-[0.85rem] !rounded-[0.35rem] !py-[0.51rem] !px-[0.86rem] shadow-none mb-1"
                            onClick={toggleFilters}
                        >
                            <i className="ri-filter-3-fill inline-block"></i> Filters
                        </button>
                    </div>
                    <div
                        className={`transition-all duration-300 ease-in-out ${
                            showFilters ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                        }`}
                    >
                        <div className="box">
                            <div className="box-body">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="xl:col-span-3 col-span-12">
                                        <CompanyDropdown
                                            control={control}
                                            errors={errors}
                                            onCompanySelect={handleCompanySelect}
                                        />
                                    </div>
                                    <div className="xl:col-span-3 col-span-12">
                                        <DepartmentDropdown
                                            company_id={company}
                                            control={control}
                                            errors={errors}
                                            onDepartmentSelect={handleDepartmentSelect}
                                        />
                                    </div>
                                    <div className="xl:col-span-3 col-span-12">
                                        <SubDepartmentDropdown
                                            department_id={department}
                                            control={control}
                                            errors={errors}
                                            onSubDepartmentSelect={handleSubDepartmentSelect}
                                        />
                                    </div>
                                    <div className="xl:col-span-3 col-span-12">
                                        <FormSelect
                                            name="view_type"
                                            label={false}
                                            control={control}
                                            errors={errors}
                                            options={view_type}
                                            placeholder=" View Type"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-center mt-6 space-x-4">
                                    <button
                                        type="button"
                                        className="ti-btn bg-primary text-white btn-wave font-medium rounded py-2 px-6"
                                        onClick={onSearchClick}
                                    >
                                        <i className="ri-search-2-line inline-block"></i> Apply Filters
                                    </button>
                                    <button
                                        type="button"
                                        className="ti-btn ti-btn-outline-secondary btn-wave font-medium rounded py-2 px-6"
                                        onClick={onClearFilters}
                                    >
                                        <i className="ri-refresh-line inline-block"></i> Clear Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <LoadingSpinner/>
            ) : (
                <div className="grid grid-cols-12 gap-x-6">
                    <CompletedCard data={data.completed_card}/>
                    <CompletedOverdue data={data.completed_overdue_card}/>
                    <OverdueCard data={data.overdue_card}/>
                    <TeamCard data={data.not_started}/>
                    <RatingCard data={data.ratings_card}/>
                    <div className="xl:col-span-6 col-span-12">
                        <ClosedSR
                            summary={data.closed_service_requests_card}
                            statsFetching={isLoading}
                            heading="Closed SR"
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default PersonView;
