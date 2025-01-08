import React, {useState} from "react"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {useNavigate} from "react-router-dom"
import PageHeader from "../../../layouts/includes/PageHeader.jsx"
import {useServiceRequest} from "@modules/dashboards/sr/Hooks/SrListHook.js"
import FormSelect from "@components/form/FormSelect.jsx"
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx"
import {monthDashboard, yearDashboard} from "@modules/sr-management/services/srServices.js"
import srSchema from "@modules/sr-management/schema/srSchema.js"
import Rating from "@mui/material/Rating"

const SrDashboard = () => {
    const [showFilters, setShowFilters] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState(null)
    const [ratingValue2, setRatingValue2] = useState(null)
    const navigate = useNavigate()
    const {
        control,
        watch,
        formState: {errors},
        getValues,
        reset
    } = useForm({
        resolver: zodResolver(srSchema),
        defaultValues: {}
    })
    const {serviceRequest, applyFilters, downloadExcel} = useServiceRequest()

    const toggleFilters = () => {
        setShowFilters((prev) => !prev)
    }

    const handleCardClick = (status) => {
        const currentValues = getValues()
        const filters = {
            company_id: currentValues.company_id || "",
            store_region_id: currentValues.store_region_id || "",
            city_id: currentValues.city_id || "",
            location_id: currentValues.location_id || "",
            department_id: currentValues.department_id || "",
            month: currentValues.month || "",
            year_dashboard: currentValues.year_dashboard || ""
        }

        // Remove empty keys so they don't appear as &key= in the URL
        Object.keys(filters).forEach((key) => {
            if (!filters[key]) {
                delete filters[key]
            }
        })

        const queryString = new URLSearchParams(filters).toString()
        navigate(`/dashboards/sr/sr-list/${status}${queryString ? `?${queryString}` : ""}`)
    }


    const handleClick = (status) => {
        setSelectedStatus((prev) => (prev === status ? null : status))
    }

    const handleRatingChange2 = (_event, newValue) => {
        setRatingValue2(newValue)
    }

    const onSearchClick = () => {
        const formValues = getValues()
        const filters = {
            company_id: formValues.company_id || "",
            store_region_id: formValues.store_region_id || "",
            city_id: formValues.city_id || "",
            location_id: formValues.location_id || "",
            department_id: formValues.department_id || "",
            month: formValues.month || "",
            year_dashboard: formValues.year_dashboard || ""
        }
        applyFilters(filters)
    }

    const onClearFilters = () => {
        reset()
        applyFilters({})
    }

    const selectedRegion = watch("store_region_id")
    const selectedCity = watch("city_id")

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
                            onClick={downloadExcel}
                            className="ti-btn ti-btn-outline-secondary btn-wave !font-medium !me-[0.375rem] !ms-1 !text-[0.85rem] !rounded-[0.35rem] !py-[0.51rem] !px-[0.86rem] shadow-none mb-1"
                        >
                            <i className="ri-upload-cloud-line inline-block"></i> Excel
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
                                        <FormAsyncSelect
                                            label={false}
                                            name="company_id"
                                            control={control}
                                            errors={errors}
                                            placeholder="Company"
                                            apiUrl="/select/companies"
                                            queryKeyBase="companies"
                                            clientSideSearch
                                            preselectedOptions={[]}
                                        />
                                    </div>
                                    <div className="xl:col-span-3 col-span-12">
                                        <FormAsyncSelect
                                            label={false}
                                            name="store_region_id"
                                            control={control}
                                            errors={errors}
                                            placeholder="Store Region"
                                            apiUrl="/select/store_regions"
                                            queryKeyBase="store_regions"
                                            clientSideSearch
                                            preselectedOptions={[]}
                                        />
                                    </div>
                                    <div className="xl:col-span-3 col-span-12">
                                        <FormAsyncSelect
                                            label={false}
                                            name="city_id"
                                            control={control}
                                            errors={errors}
                                            placeholder="City"
                                            apiUrl={`/select/cities?store_region_id=${selectedRegion || ""}`}
                                            queryKeyBase={`cities-${selectedRegion || ""}`}
                                            clientSideSearch
                                            preselectedOptions={[]}
                                        />
                                    </div>
                                    <div className="xl:col-span-3 col-span-12">
                                        <FormAsyncSelect
                                            label={false}
                                            name="location_id"
                                            control={control}
                                            errors={errors}
                                            placeholder="Location"
                                            apiUrl={`/select/locations?city_id=${selectedCity || ""}`}
                                            queryKeyBase={`locations-${selectedCity || ""}`}
                                            clientSideSearch
                                            preselectedOptions={[]}
                                        />
                                    </div>
                                    <div className="xl:col-span-3 col-span-12">
                                        <FormAsyncSelect
                                            label={false}
                                            name="department_id"
                                            control={control}
                                            errors={errors}
                                            placeholder="Department"
                                            apiUrl="/select/departments"
                                            queryKeyBase="departments"
                                            clientSideSearch
                                            preselectedOptions={[]}
                                        />
                                    </div>
                                    <div className="xl:col-span-3 col-span-12">
                                        <FormSelect
                                            label={false}
                                            name="month"
                                            control={control}
                                            errors={errors}
                                            options={monthDashboard}
                                            placeholder="Select Month"
                                        />
                                    </div>
                                    <div className="xl:col-span-3 col-span-12">
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
                                <div className="flex justify-center mt-6 space-x-4">
                                    <button
                                        type="button"
                                        className="ti-btn bg-primary text-white btn-wave font-medium rounded py-2 px-6"
                                        onClick={onSearchClick}
                                    >
                                        <i className="ri-search-2-line inline-block"></i> Apply Filter
                                    </button>
                                    <button
                                        type="button"
                                        className="ti-btn ti-btn-outline-secondary btn-wave font-medium rounded py-2 px-6"
                                        onClick={onClearFilters}
                                    >
                                        <i className="ri-refresh-line inline-block"></i> Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
                {[
                    {status: "Unassign", label: "Unassigned", icon: "ri-user-line text-primary"},
                    {status: "Not-Started", label: "Not Started", icon: "ri-time-line text-danger"},
                    {status: "In-Progress", label: "In Process", icon: "ri-settings-6-line text-warning"},
                    {
                        status: "Waiting for Approval",
                        label: "Waiting for Approval",
                        icon: "ri-loader-2-line text-secondary"
                    },
                    {
                        status: "Waiting for Quotation",
                        label: "Waiting for Quotation",
                        icon: "bx bx-circle-three-quarter text-secondary"
                    }
                ].map((item, index) => (
                    <div
                        key={index}
                        onClick={() => handleCardClick(item.status)}
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
                                    {serviceRequest?.[item.status] ?? 0}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {[
                    {status: "Waiting for Budget", label: "Waiting for Budget", icon: "bx bx-box text-secondary"},
                    {
                        status: "Waiting for Purchase",
                        label: "Waiting for Purchase",
                        icon: "ri-bank-line text-secondary"
                    },
                    {
                        status: "Waiting for Acknowledgement",
                        label: "Waiting for Acknowledgement",
                        icon: "ri-service-line text-secondary"
                    },
                    {status: "Cancelled", label: "Cancelled", icon: "ri-close-circle-line text-danger"}
                ].map((item, index) => (
                    <div
                        key={index}
                        onClick={() => handleCardClick(item.status)}
                        className="cursor-pointer"
                    >
                        <div
                            className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4 transition-transform transform hover:scale-105">
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
                    {status: "Completed", label: "Completed", icon: "bx bx-check-circle text-success"},
                    {status: "On-Hold", label: "On Hold", icon: "ri-pause-circle-line text-warning"},
                    {status: "Overdue", label: "Overdue", icon: "ri-timer-line text-info"},
                    {status: "Waiting for GRN", label: "Waiting for GRN", icon: "ri-grid-line text-primary"},
                    {status: "Closed", label: "Closed", icon: "ri-lock-line text-secondary"}
                ].map((item, index) => (
                    <div
                        key={index}
                        onClick={() => handleCardClick(item.status)}
                        className="cursor-pointer"
                    >
                        <div
                            className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4 transition-transform transform hover:scale-105">
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
                    {rating: 5, status: "rating-5", icon: "ri-star-fill text-yellow-600"},
                    {rating: 4, status: "rating-4", icon: "ri-star-fill text-yellow-600"},
                    {rating: 3, status: "rating-3", icon: "ri-star-fill text-yellow-600"},
                    {rating: 2, status: "rating-2", icon: "ri-star-fill text-yellow-600"},
                    {rating: 1, status: "rating-1", icon: "ri-star-fill text-yellow-600"}
                ].map((item, index) => (
                    <div
                        key={index}
                        onClick={() => handleCardClick(item.status)}
                        className="cursor-pointer"
                    >
                        <div
                            className="bg-white shadow-md rounded-lg flex flex-col items-center space-y-3 transition-transform transform hover:scale-105 mt-2 p-4">
                            <div className="text-center">
                                <h3 className="text-gray-600 text-sm font-medium mt-2">
                                    {item.label}
                                </h3>
                                <p className="text-2xl font-bold">
                                    {serviceRequest?.[item.status] ?? 0}
                                </p>
                            </div>
                            <div className="mt-2">
                                <Rating
                                    name={`clickable-rating-${index}`}
                                    value={item.rating}
                                    onChange={handleRatingChange2}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default SrDashboard
