import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormSelect from "@components/form/FormSelect.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../../../layouts/includes/PageHeader.jsx";
import { useServiceRequest } from "@modules/dashboards/sr/Hooks/SrListHook.js";
import { formatOptions } from "@helpers/formatters.js";
import {
  monthDashboard,
  yearDashboard,
} from "@modules/sr-management/services/srServices.js";
import srSchema from "@modules/sr-management/schema/srSchema.js";
import Rating from "@mui/material/Rating";
const SrDashboard = ({ status, label, icon, serviceRequest: serviceData }) => {
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const {
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(srSchema),
  });

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const { serviceRequest, downloadExcel } = useServiceRequest();

  const handleCardClick = (status) => {
    navigate(`/dashboards/sr/sr-list/${status}`);
  };

  const [selectedStatus, setSelectedStatus] = useState(null);
  const handleClick = (status) => {
    setSelectedStatus((prev) => (prev === status ? null : status));
  };

  const count = serviceRequest?.[status] ?? 0;
  const [ratingValue2, setRatingValue2] = useState(null);
  const handleRatingChange2 = (_event, newValue) => {
    setRatingValue2(newValue);

    return (
      <div
        onClick={() => handleCardClick(status)}
        className="cursor-pointer xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12"
      >
        <div className="box">
          <div className="grid grid-cols-12">
            <div className="col-span-3">
              <p className="mb-1">
                <span className="text-[0.75rem]">{label}</span>
              </p>
              <p className="mb-1 text-[0.75rem]">
                <span className="text-[1.5625rem] font-semibold leading-none vertical-bottom ">
                  {count}
                </span>
              </p>
            </div>
            <div className="col-span-3">
              <p className="main-card-icon mb-0">
                <i className={`text-3xl text-primary ${icon}`}></i>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCard2 = (status, label, icon, bg) => {
    const count = serviceRequest?.[status] ?? 0;

    return (
      <div className="xxl:col-span-3  xl:col-span-3 col-span-12">
        <div
          onClick={() => handleCardClick(status)}
          className="cursor-pointer xxl:col-span-3 xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12"
        >
          <div className="box overflow-hidden bg-white shadow-md rounded-lg  transition-transform transform hover:scale-105">
            <div className="box-body">
              <div className="flex items-top justify-between">
                <div>
                  <span
                    className={`!text-[0.7rem] !w-[2rem] !h-[2rem] !leading-[2rem] !rounded-full inline-flex items-center justify-center ${bg}`}
                  >
                    <i className={`${icon} text-[0.9rem] text-white`}></i>
                  </span>
                </div>
                <div className="flex-grow ms-3">
                  <div className="flex items-center justify-between flex-wrap">
                    <div>
                      <p className="text-[#8c9097] dark:text-white/50 text-[0.75rem] mb-0">
                        {label}
                      </p>
                      <h4 className="font-semibold text-[1.25rem] !mb-1">
                        {count}
                      </h4>
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
      <PageHeader
        currentpage="SR Dashboard"
        activepage="SR Management"
        mainpage="SR Dashboard"
      />
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
              onClick={downloadExcel}
              className="ti-btn ti-btn-outline-secondary btn-wave !font-medium !me-[0.375rem] !ms-1 !text-[0.85rem] !rounded-[0.35rem] !py-[0.51rem] !px-[0.86rem] shadow-none mb-1"
            >
              <i className="ri-upload-cloud-line inline-block"></i> Excel
            </button>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out ${
              showFilters ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
            } `}
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
                      preselectedOptions={formatOptions(
                        serviceRequest,
                        "department"
                      )}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
        {[
          {
            status: "Unassign",
            label: "Unassigned",
            icon: "ri-user-line text-primary",
          },
          {
            status: "Not-Started",
            label: "Not Started",
            icon: "ri-time-line text-danger",
          },
          {
            status: "In-Progress",
            label: "In Process",
            icon: "ri-settings-6-line text-warning",
          },
          {
            status: "Waiting for Approval",
            label: "Waiting for Approval",
            icon: "ri-loader-2-line text-secondary",
          },
          {
            status: "Waiting for Quotation",
            label: "Waiting for Quotation",
            icon: "bx bx-circle-three-quarter text-secondary",
          },
        ].map((item, index) => (
          <div
            key={index}
            onClick={() => handleClick(item.status)}
            className="cursor-pointer"
          >
            <div
              className={`bg-white ${
                selectedStatus === item.status ? "shadow-2xl" : "shadow-md"
              } rounded-lg p-4 flex items-center space-x-4 transition-transform transform hover:scale-105`}
            >
              <i className={`${item.icon} text-4xl`}></i>
              <div>
                <h3 className="text-gray-600 text-sm font-medium">
                  {item.label}
                </h3>
                <p className="text-2xl font-bold">
                  {serviceData?.[item.status] ?? 0}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[
          {
            status: "Waiting for Budget",
            label: "Waiting for Budget",
            icon: "bx bx-box text-secondary",
          },
          {
            status: "Waiting for Purchase",
            label: "Waiting for Purchase",
            icon: "ri-bank-line text-secondary",
          },
          {
            status: "Waiting for Acknowledgement",
            label: "Waiting for Acknowledgement",
            icon: "ri-service-line text-secondary",
          },
          {
            status: "Cancelled",
            label: "Cancelled",
            icon: "ri-close-circle-line text-danger",
          },
        ].map((item, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(item.status)}
            className="cursor-pointer"
          >
            <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4 transition-transform transform hover:scale-105 ">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
                <i className={`${item.icon} text-4xl`}></i>
              </div>

              <div>
                <h3 className="text-gray-600 text-sm font-medium">
                  {item.label}
                </h3>
                <p className="text-2xl font-bold">
                  {serviceRequest?.[item.status] ?? 0}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
        {[
          {
            status: "Completed",
            label: "Completed",
            icon: "bx bx-check-circle text-success",
          },
          {
            status: "On-Hold",
            label: "On Hold",
            icon: "ri-pause-circle-line text-warning",
          },
          {
            status: "Overdue",
            label: "Overdue",
            icon: "ri-timer-line text-info",
          },
          {
            status: "Waiting for GRN",
            label: "Waiting for GRN",
            icon: "ri-grid-line text-primary",
          },
          {
            status: "Closed",
            label: "Closed",
            icon: "ri-lock-line text-secondary",
          },
        ].map((item, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(item.status)}
            className="cursor-pointer"
          >
            <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4 transition-transform transform hover:scale-105">
              <i className={`${item.icon} text-4xl`}></i>

              <div>
                <h3 className="text-gray-600 text-sm font-medium">
                  {item.label}
                </h3>
                <p className="text-2xl font-bold">
                  {serviceRequest?.[item.status] ?? 0}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
        {[
          {
            rating: 5,
            status: "rating",

            icon: "ri-star-fill text-yellow-600",
          },
          {
            rating: 4,
            status: "rating",

            icon: "ri-star-fill text-yellow-600",
          },
          {
            rating: 3,
            status: "rating",

            icon: "ri-star-fill text-yellow-600",
          },
          {
            rating: 2,
            status: "rating",

            icon: "ri-star-fill text-yellow-600",
          },
          {
            rating: 1,
            status: "rating",

            icon: "ri-star-fill text-yellow-600",
          },
        ].map((item, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(item.status)}
            className="cursor-pointer"
          >
            <div className="bg-white shadow-md rounded-lg flex flex-col items-center space-y-3 transition-transform transform hover:scale-105 mt-2">
              <div className="text-center">
                <h3 className="text-gray-600 text-sm font-medium mt-2">
                  {item.label}
                </h3>
                <p className="text-2xl font-bold">{item.rating}</p>
              </div>

              <div className="mt-2">
                <Rating
                  name={`clickable-rating-${index}`}
                  value={item.rating}
                  onChange={handleRatingChange2}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SrDashboard;
