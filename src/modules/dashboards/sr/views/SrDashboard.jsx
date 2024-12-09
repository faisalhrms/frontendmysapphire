import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import FormSelect from "@components/form/FormSelect.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import {Link, useNavigate} from "react-router-dom";
import PageHeader from "../../../layouts/includes/PageHeader.jsx";
import {useServiceRequest} from "@modules/dashboards/sr/Hooks/SrListHook.js";
import {formatOptions} from "@helpers/formatters.js";
import {monthDashboard, yearDashboard} from "@modules/sr-management/services/srServices.js";
import srSchema from "@modules/sr-management/schema/srSchema.js";

const SrDashboard = () => {
    const [showFilters, setShowFilters] = useState(false);
    const navigate = useNavigate();
    const {control, formState: {errors}} = useForm({
        resolver: zodResolver(srSchema),
    });

    const toggleFilters = () => {
        setShowFilters((prev) => !prev);
    };

    const {serviceRequest} = useServiceRequest();

    const handleCardClick = (status) => {
        navigate(`/dashboards/sr/sr-list/${status}`);
    };

    const renderCard = (status, label, icon) => {
        const count = serviceRequest?.[status] ?? 0;

        return (
            <div
                onClick={() => handleCardClick(status)}
                className="cursor-pointer xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12"
            >
                <div className="box">
                    <div className="box-body">
                        <div className="grid grid-cols-12">
                            <div className="col-span-6 pe-0">
                                <p className="mb-2">
                                    <span className="text-[0.75rem]">{label}</span>
                                </p>
                                <p className="mb-2 text-[0.75rem]">
                                    <span
                                        className="text-[1.5625rem] font-semibold leading-none vertical-bottom mb-0">{count}</span>

                                </p>
                            </div>
                            <div className="col-span-6">
                                <p className="main-card-icon mb-0">
                                    <i className={`text-3xl text-primary ${icon}`}></i>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderCard2 = (status, label, icon,bg) => {
        const count = serviceRequest?.[status] ?? 0;

        return (
            <div className="xxl:col-span-3  xl:col-span-3 col-span-12">
                    <div className="xxl:col-span-6 xl:col-span-6 col-span-12">
                        <div className="box overflow-hidden">
                            <div className="box-body">
                                <div className="flex items-top justify-between">
                                    <div>
                              <span
                                  className={`!text-[0.8rem]  !w-[2.5rem] !h-[2.5rem] !leading-[2.5rem] !rounded-full inline-flex items-center justify-center ${bg}`}>
                                  <i className={`${icon} text-[1rem] text-white`}></i>

                              </span>
                                    </div>
                                    <div className="flex-grow ms-4">
                                        <div className="flex items-center justify-between flex-wrap">
                                            <div>
                                                <p className="text-[#8c9097] dark:text-white/50 text-[0.813rem] mb-0">{label}</p>
                                                <h4 className="font-semibold  text-[1.5rem] !mb-2 ">{count}</h4>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between !mt-1">
                                            <div>
                                                <a className="text-primary text-[0.813rem]"
                                                   onClick={() => handleCardClick(status)}>View All<i
                                                    className="ti ti-arrow-narrow-right ms-2 font-semibold inline-block"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        );
    };

    return (
        <>
            <PageHeader currentpage="SR Dashboard" activepage="SR Management" mainpage="SR Dashboard"/>
            <div className="grid grid-cols-12 gap-x-6 mb-1">
                <div className="xl:col-span-12 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12">
                    <div className="btn-list md:mt-0 mt-0 float-end">
                        <button
                            type="button"
                            className="ti-btn bg-primary text-white btn-wave !font-medium !me-[0.375rem] !ms-1 !text-[0.85rem] !rounded-[0.35rem] !py-[0.51rem] !px-[0.86rem] shadow-none mb-1"
                            onClick={toggleFilters}
                        >
                            <i className="ri-filter-3-fill inline-block"></i> Filters
                        </button>
                        <button
                            type="button"
                            className="ti-btn ti-btn-outline-secondary btn-wave !font-medium !me-[0.375rem] !ms-1 !text-[0.85rem] !rounded-[0.35rem] !py-[0.51rem] !px-[0.86rem] shadow-none mb-1"
                        >
                            <i className="ri-upload-cloud-line inline-block"></i> Excel
                        </button>
                    </div>

                    {/* Slide-down filter section */}
                    <div
                        className={`transition-all duration-300 ease-in-out ${
                            showFilters ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                        } overflow-hidden`}
                    >
                        <div className="box">
                            <div className="box-body">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="xl:col-span-4 col-span-12">
                                        <FormAsyncSelect
                                            label={false}
                                            name="department_id"
                                            control={control}
                                            errors={errors}
                                            placeholder="Department"
                                            apiUrl="/select/departments"
                                            queryKeyBase="departments"
                                            clientSideSearch={true}
                                            preselectedOptions={formatOptions(serviceRequest, "department")}
                                        />
                                    </div>
                                    <div className="xl:col-span-4 col-span-12">
                                        <FormSelect
                                            label={false}
                                            name="month"
                                            control={control}
                                            errors={errors}
                                            options={monthDashboard}
                                            placeholder="Select Month"
                                        />
                                    </div>
                                    <div className="xl:col-span-4 col-span-12">
                                        <FormSelect
                                            label={false}
                                            name="year_dashboard"
                                            control={control}
                                            errors={errors}
                                            options={yearDashboard}
                                            placeholder="Select Year"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-x-6">
                {renderCard2("Unassign", "Unassigned", "ri-user-line","bg-primary")}
                {renderCard2("Not Started", "Not Started", "ri-time-line","bg-danger")}
                {renderCard2("In-Progress", "In Process", "ri-settings-6-line","bg-warning")}
                {renderCard2("Waiting for Approval", "Waiting for Approval", "ri-check-double-line","bg-secondary")}
                {renderCard2("Waiting for Quotation", "Waiting for Quotation", "ri-price-tag-3-line","bg-secondary")}
                {renderCard2("Waiting for Budget", "Waiting for Budget", "ri-bank-line","bg-secondary")}
                {renderCard2("Waiting for Purchase", "Waiting for Purchase", "ri-shopping-cart-line","bg-secondary")}
                {renderCard2("Waiting for Acknowledgement", "Waiting for Acknowledgement", "ri-service-line","bg-secondary")}
                {renderCard2("Cancelled", "Cancelled", "ri-close-circle-line","bg-danger")}
                {renderCard2("Closed", "Closed", "ri-lock-line","bg-secondary")}
                {renderCard2("Completed", "Completed", "ri-checkbox-circle-fill","bg-success")}
                {renderCard2("On-Hold", "On Hold", "ri-pause-circle-line","bg-success/70")}
                {renderCard2("Overdue", "Overdue", "ri-timer-line","bg-info/70")}
                {renderCard2("Waiting for GRN", "Waiting for GRN", "ri-grid-line","bg-primary/70")}
                {renderCard2("Waiting for PR", "Waiting for PR", "ri-checkbox-indeterminate-line","bg-primary/70")}
                {renderCard2("Unassign (1Day)", "Unassigned (1 Day)", "ri-loader-line","bg-primary")}
                {renderCard2("Unassign (7Day)", "Unassigned (7 Days)", "ri-group-line","bg-warning/70")}
                {renderCard2("Unassign (Above7Days)", "Unassigned (Above 7 Days)", "ri-group-2-line","bg-warning/70")}


            </div>
        </>
    );
};

export default SrDashboard;
