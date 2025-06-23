import React, {useCallback, useState} from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {setSrFilters, resetSrFilters} from '@modules/dashboards/sr/redux/srSlice.js'
import {formatOptions} from '@helpers/formatters.js'
import {useServiceRequest} from '@modules/dashboards/sr/Hooks/SrListHook.js'
import FormAsyncSelect from '@components/form/FormAsyncSelect.jsx'
import FormSelect from '@components/form/FormSelect.jsx'
import DepartmentDropdown from '@components/dropdowns/DepartmentDropdown.jsx'
import SubDepartmentDropdown from '@components/dropdowns/SubDepartmentDropdown.jsx'
import {monthDashboard, yearDashboard} from '@modules/sr-management/services/srServices.js'
import srSchema from '@modules/sr-management/schema/srSchema.js'
import Rating from '@mui/material/Rating'
import CountUp from 'react-countup'
import SrStatics from '@modules/dashboards/sr/components/SrStatics.jsx'
import SlaDonut from '@modules/dashboards/sr/components/SlaDonut.jsx'
import PercentageIcon from "@components/PercentageIcon.jsx"
import {getChangeStyles, getStatusStyles} from "@helpers/statusStyles.js"
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const SrDashboard = () => {
    const dispatch = useDispatch()
    const filters = useSelector(s => s.sr.filters)
    const reduxFilterParams = {
        company_id: filters.company?.id || '',
        store_region_id: filters.store_region?.id || '',
        city_id: filters.city?.id || '',
        location_id: filters.location?.id || '',
        department_id: filters.department?.id || '',
        sub_department_id: filters.sub_department?.id || '',
        month: filters.month || '',
        year_dashboard: filters.year_dashboard || ''
    }
    const {serviceRequest, applyFilters, downloadExcel, isDownloading} = useServiceRequest(reduxFilterParams)
    const isLoading = serviceRequest === null
    const navigate = useNavigate()
    const hasInitial = Object.values(filters).some(v => v && (typeof v === 'object' ? v.id || v.name : true))
    const [showFilters, setShowFilters] = useState(hasInitial)
    const {
        control,
        watch,
        getValues,
        reset,
        formState: {errors}
    } = useForm({
        resolver: zodResolver(srSchema),
        defaultValues: {
            company_id: reduxFilterParams.company_id || null,
            store_region_id: reduxFilterParams.store_region_id || null,
            city_id: reduxFilterParams.city_id || null,
            location_id: reduxFilterParams.location_id || null,
            department_id: reduxFilterParams.department_id || null,
            sub_department_id: reduxFilterParams.sub_department_id || null,
            month: reduxFilterParams.month || '',
            year_dashboard: reduxFilterParams.year_dashboard || ''
        }
    })
    const [company, setCompany] = useState(filters.company || null)
    const [storeRegion, setStoreRegion] = useState(filters.store_region || null)
    const [cityObj, setCityObj] = useState(filters.city || null)
    const [locationObj, setLocationObj] = useState(filters.location || null)
    const [department, setDepartment] = useState(filters.department || null)
    const [subDepartment, setSubDepartment] = useState(filters.sub_department || null)

    const handleCompanySelect = useCallback(o => {
        setCompany(o)
        setDepartment(null)
    }, [])

    const handleRegionSelect = useCallback(o => {
        setStoreRegion(o)
        setCityObj(null)
        setLocationObj(null)
    }, [])

    const handleCitySelect = useCallback(o => {
        setCityObj(o)
        setLocationObj(null)
    }, [])

    const handleLocationSelect = useCallback(o => {
        setLocationObj(o)
    }, [])

    const handleDepartmentSelect = useCallback(o => {
        setDepartment(o)
        setSubDepartment(null)
    }, [])

    const handleSubDepartmentSelect = useCallback(o => {
        setSubDepartment(o)
    }, [])

    const active = () => {
        const v = getValues()
        return (
            v.company_id ||
            v.store_region_id ||
            v.city_id ||
            v.location_id ||
            v.department_id ||
            v.sub_department_id ||
            v.month ||
            v.year_dashboard
        )
    }

    const toggleFilters = () => {
        if (showFilters && active()) return
        setShowFilters(v => !v)
    }

    const onSearchClick = () => {
        const v = getValues()
        const f = {
            company_id: v.company_id || '',
            store_region_id: v.store_region_id || '',
            city_id: v.city_id || '',
            location_id: v.location_id || '',
            department_id: v.department_id || '',
            sub_department_id: v.sub_department_id || '',
            month: v.month || '',
            year_dashboard: v.year_dashboard || ''
        }
        applyFilters(f)
        dispatch(
            setSrFilters({
                company,
                store_region: storeRegion,
                city: cityObj,
                location: locationObj,
                department,
                sub_department: subDepartment,
                month: v.month || '',
                year_dashboard: v.year_dashboard || ''
            })
        )
        setShowFilters(true)
    }

    const onClearFilters = () => {
        reset()
        applyFilters({})
        dispatch(resetSrFilters())
        setCompany(null)
        setStoreRegion(null)
        setCityObj(null)
        setLocationObj(null)
        setDepartment(null)
        setSubDepartment(null)
        setShowFilters(false)
    }

    const handleCardClick = useCallback(
        status => {
            const v = getValues()
            const q = {
                company_id: v.company_id || '',
                store_region_id: v.store_region_id || '',
                city_id: v.city_id || '',
                location_id: v.location_id || '',
                department_id: v.department_id || '',
                sub_department_id: v.sub_department_id || '',
                month: v.month || '',
                year_dashboard: v.year_dashboard || '',
                status
            }
            const qs = Object.keys(q).filter(k => q[k]).length
                ? `?${new URLSearchParams(q).toString()}`
                : ''
            applyFilters(q)
            navigate(`/dashboards/sr/sr-list/${status}${qs}`)
        },
        [applyFilters, getValues, navigate]
    )

    const selRegion = watch('store_region_id')
    const selCity = watch('city_id')

    return (
        <div className="dark:bg-bodybg min-h-screen flex flex-col">
            <div className="flex justify-end space-x-2">
                <button className="ti-btn bg-primary text-white py-2 px-4" onClick={toggleFilters}>
                    <i className="ri-filter-3-fill"></i> Filters
                </button>
                <button className="ti-btn ti-btn-outline-secondary py-2 px-4" onClick={downloadExcel}>
                    <i className="ri-upload-cloud-line"
                       style={isDownloading ? {animation: 'spin 1s infinite linear'} : {}}></i> Excel
                </button>
            </div>

            {showFilters && (
                <div className="box mt-2">
                    <div className="box-body">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="xl:col-span-3 col-span-12">
                                <FormAsyncSelect
                                    name="company_id"
                                    control={control}
                                    errors={errors}
                                    placeholder="Company"
                                    apiUrl="/select/companies"
                                    queryKeyBase="companies"
                                    clientSideSearch
                                    preselectedOptions={formatOptions(filters, 'company')}
                                    needObject={true}
                                    onSelectChange={handleCompanySelect}
                                />
                            </div>
                            <div className="xl:col-span-3 col-span-12">
                                <FormAsyncSelect
                                    name="store_region_id"
                                    control={control}
                                    errors={errors}
                                    placeholder="Store Region"
                                    apiUrl="/select/store_regions"
                                    queryKeyBase="store_regions"
                                    clientSideSearch
                                    preselectedOptions={formatOptions(filters, 'store_region')}
                                    needObject={true}
                                    onSelectChange={handleRegionSelect}
                                />
                            </div>
                            <div className="xl:col-span-3 col-span-12">
                                <FormAsyncSelect
                                    name="city_id"
                                    control={control}
                                    errors={errors}
                                    placeholder="City"
                                    apiUrl={`/select/cities?store_region_id=${selRegion || ''}`}
                                    queryKeyBase={`cities-${selRegion || ''}`}
                                    clientSideSearch
                                    preselectedOptions={formatOptions(filters, 'city')}
                                    needObject={true}
                                    onSelectChange={handleCitySelect}
                                />
                            </div>
                            <div className="xl:col-span-3 col-span-12">
                                <FormAsyncSelect
                                    name="location_id"
                                    control={control}
                                    errors={errors}
                                    placeholder="Location"
                                    apiUrl={`/select/locations?city_id=${selCity || ''}`}
                                    queryKeyBase={`locations-${selCity || ''}`}
                                    clientSideSearch
                                    preselectedOptions={formatOptions(filters, 'location')}
                                    needObject={true}
                                    onSelectChange={handleLocationSelect}
                                />
                            </div>
                            <div className="xl:col-span-3 col-span-12">
                                <DepartmentDropdown
                                    haveLabel={true}
                                    company_id={company?.id || null}
                                    control={control}
                                    errors={errors}
                                    data={filters}
                                    needObject={true}
                                    onDepartmentSelect={handleDepartmentSelect}
                                />
                            </div>
                            <div className="xl:col-span-3 col-span-12">
                                <SubDepartmentDropdown
                                    haveLabel={true}
                                    department_id={department?.id || null}
                                    control={control}
                                    errors={errors}
                                    data={filters}
                                    needObject={true}
                                    onSubDepartmentSelect={handleSubDepartmentSelect}
                                />
                            </div>
                            <div className="xl:col-span-3 col-span-12">
                                <FormSelect
                                    name="month"
                                    control={control}
                                    errors={errors}
                                    options={monthDashboard}
                                    placeholder="Select Month"
                                />
                            </div>
                            <div className="xl:col-span-3 col-span-12">
                                <FormSelect
                                    name="year_dashboard"
                                    control={control}
                                    errors={errors}
                                    options={yearDashboard}
                                    placeholder="Select Year"
                                />
                            </div>
                        </div>
                        <div className="flex justify-center mt-6 space-x-4">
                            <button className="ti-btn bg-primary text-white py-2 px-6" onClick={onSearchClick}>
                                <i className="ri-search-2-line"></i> Apply Filter
                            </button>
                            <button className="ti-btn ti-btn-outline-secondary py-2 px-6" onClick={onClearFilters}>
                                <i className="ri-refresh-line"></i> Clear
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                {[
                    {
                        status: 'Unassign',
                        label: 'Unassigned',
                        icon: 'ri-user-unfollow-line text-primary',
                        trend: serviceRequest?.trends?.unassigned || '0.0%',
                        bg: '!bg-primary/10'
                    },
                    {
                        status: 'Not-Started',
                        label: 'Not Started',
                        icon: 'ri-timer-line text-danger',
                        trend: serviceRequest?.trends?.notStarted || '0.0%',
                        bg: '!bg-danger/10'
                    },
                    {
                        status: 'In-Progress',
                        label: 'In Process',
                        icon: 'ri-run-line text-warning',
                        trend: serviceRequest?.trends?.inProgress || '0.0%',
                        bg: '!bg-warning/10'
                    },
                    {
                        status: 'Completed',
                        label: 'Completed',
                        icon: 'ri-checkbox-circle-line text-success',
                        trend: serviceRequest?.trends?.completed || '0.0%',
                        bg: '!bg-success/10'
                    },
                    {
                        status: 'Overdue',
                        label: 'Overdue',
                        icon: 'ri-alarm-warning-line text-info',
                        trend: serviceRequest?.trends?.overdue || '0.0%',
                        bg: '!bg-info/10'
                    }
                ].map((it, i) => {
                    const {changeClass, arrowIconClass, ariaLabel} = getChangeStyles(it.trend)
                    return (
                        <div key={i} onClick={() => handleCardClick(it.status)} className="cursor-pointer">
                            <div
                                className={`${it.bg} bg-white dark:bg-bodybg rounded-lg p-1 flex flex-col items-center shadow-xl justify-center h-[145px]`}>
                                <div className="flex items-center justify-end w-10 h-10 rounded-full mb-1">
                                    <i className={`${it.icon} text-3xl`}></i>
                                </div>
                                <h3 className="text-[1.4rem] font-semibold leading-none mb-0">
                                    <CountUp end={serviceRequest?.[it.status] ?? 0}/>
                                </h3>
                                <p className="mb-0">
                                    <span className="text-[0.9rem]">{it.label}</span>
                                </p>
                                <PercentageIcon
                                    parentClasses="text-[0.65rem] mt-2 text-gray-600"
                                    percentage_change={it.trend}
                                    arrowIconClass={arrowIconClass}
                                    changeClass={changeClass}
                                    ariaLabel={ariaLabel}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 auto-rows-fr gap-4 mt-6 flex-1">
                <div className="box overflow-hidden h-full flex flex-col shadow-xl">
                    <div className="box-header !bg-warning/10">
                        <div className="box-title">Waiting For</div>
                    </div>
                    <div className="box-body !p-0 h-full">
                        <div className="table-responsive h-full overflow-y-auto">
                            <table className="table table-hover whitespace-nowrap min-w-full">
                                <tbody>
                                {[
                                    {
                                        statusKey: 'Waiting for Quotation',
                                        icon: 'ri-file-search-line text-secondary',
                                        label: 'Quotation',
                                        count: serviceRequest?.['Waiting for Quotation'] ?? 0,
                                        trend: serviceRequest?.trends?.waitingQuotation || '0.0%'
                                    },
                                    {
                                        statusKey: 'Waiting for Approval',
                                        icon: 'ri-loader-2-line text-secondary',
                                        label: 'Approval',
                                        count: serviceRequest?.['Waiting for Approval'] ?? 0,
                                        trend: serviceRequest?.trends?.waitingApproval || '0.0%'
                                    },
                                    {
                                        statusKey: 'Waiting for Acknowledgement',
                                        icon: 'ri-user-voice-line text-secondary',
                                        label: 'Acknowledgement',
                                        count: serviceRequest?.['Waiting for Acknowledgement'] ?? 0,
                                        trend: serviceRequest?.trends?.waitingAcknowledgement || '0.0%'
                                    },
                                    {
                                        statusKey: 'Waiting for Budget',
                                        icon: 'ri-money-dollar-box-line text-secondary',
                                        label: 'Budget',
                                        count: serviceRequest?.['Waiting for Budget'] ?? 0,
                                        trend: serviceRequest?.trends?.waitingBudget || '0.0%'
                                    },
                                    {
                                        statusKey: 'Waiting for PR',
                                        icon: 'ri-file-list-3-line text-secondary',
                                        label: 'PR',
                                        count: serviceRequest?.['Waiting for PR'] ?? 0,
                                        trend: serviceRequest?.trends?.waitingPR || '0.0%'
                                    },
                                    {
                                        statusKey: 'Waiting for Purchase',
                                        icon: 'ri-shopping-cart-2-line text-secondary',
                                        label: 'Purchase',
                                        count: serviceRequest?.['Waiting for Purchase'] ?? 0,
                                        trend: serviceRequest?.trends?.waitingPurchase || '0.0%'
                                    },
                                    {
                                        statusKey: 'Waiting for GRN',
                                        icon: 'ri-file-copy-line text-primary',
                                        label: 'GRN',
                                        count: serviceRequest?.['Waiting for GRN'] ?? 0,
                                        trend: serviceRequest?.trends?.waitingGRN || '0.0%'
                                    }
                                ].map((item, index) => {
                                    const {changeClass, arrowIconClass, ariaLabel} = getChangeStyles(item.trend)
                                    return (
                                        <tr key={index}
                                            className="border-t hover:bg-gray-100 dark:hover:bg-light cursor-pointer"
                                            onClick={() => handleCardClick(item.statusKey)}>
                                            <td>
                                                <div className="flex items-center">
                                                    <i className={`${item.icon} text-[1.125rem] me-2`}></i>
                                                    <div className="font-semibold">{item.label}</div>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <div className="text-[1.125rem] font-semibold">{item.count}</div>
                                            </td>
                                            <td className="text-center">
                                                <div className="flex items-center justify-end mr-3">
                                                    <PercentageIcon
                                                        parentClasses="text-[0.7rem] text-gray-600"
                                                        percentage_change={item.trend}
                                                        arrowIconClass={arrowIconClass}
                                                        changeClass={changeClass}
                                                        ariaLabel={ariaLabel}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 h-full">
                    {[
                        {
                            status: 'Delivered',
                            label: 'Delivered',
                            icon: 'ri-truck-line text-danger',
                            count: serviceRequest?.Delivered ?? 0,
                            trend: serviceRequest?.trends?.delivered || '0.0%',
                            bg: '!bg-secondary/10'
                        },
                        {
                            status: 'On-Hold',
                            label: 'On Hold',
                            icon: 'ri-pause-circle-line text-warning',
                            count: serviceRequest?.['On-Hold'] ?? 0,
                            trend: serviceRequest?.trends?.onHold || '0.0%',
                            bg: '!bg-indigo/10'
                        },
                        {
                            status: 'Closed',
                            label: 'Closed',
                            icon: 'ri-lock-line text-secondary',
                            count: serviceRequest?.Closed ?? 0,
                            trend: serviceRequest?.trends?.closed || '0.0%',
                            bg: '!bg-indigo/10'
                        },
                        {
                            status: 'Cancelled',
                            label: 'Cancelled',
                            icon: 'ri-close-circle-line text-danger',
                            count: serviceRequest?.Cancelled ?? 0,
                            trend: serviceRequest?.trends?.cancelled || '0.0%',
                            bg: '!bg-secondary/10'
                        }
                    ].map((item, idx) => {
                        const {changeClass, arrowIconClass, ariaLabel} = getChangeStyles(item.trend)
                        return (
                            <div key={idx} onClick={() => handleCardClick(item.status)} className="cursor-pointer">
                                <div
                                    className={`${item.bg} bg-white dark:bg-bodybg rounded-lg p-3 flex flex-col justify-between shadow-xl h-full`}>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[0.9rem] font-medium">{item.label}</span>
                                        <i className={`${item.icon} text-3xl`}></i>
                                    </div>
                                    <div className="flex-1 flex items-center justify-center">
                                        <h3 className="text-[1.6rem] font-semibold">
                                            <CountUp end={item.count}/>
                                        </h3>
                                    </div>
                                    <div className="flex justify-end">
                                        <PercentageIcon
                                            parentClasses="text-[0.75rem] text-gray-600"
                                            percentage_change={item.trend}
                                            arrowIconClass={arrowIconClass}
                                            changeClass={changeClass}
                                            ariaLabel={ariaLabel}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="box overflow-hidden h-full flex flex-col shadow-xl">
                    <div className="box-header !bg-info/25">
                        <div className="box-title">Service Request Statistics <span
                            className="text-gray-500 font-normal">(Last 6 months):</span></div>
                    </div>
                    <div className="box-body h-full">
                        {isLoading
                            ? <LoadingSpinner/>
                            : <SrStatics
                                categories={serviceRequest?.monthly_status?.categories}
                                series={serviceRequest?.monthly_status?.series}
                            />
                        }
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 auto-rows-fr gap-4 mt-6 flex-1">

                <div className="box overflow-hidden h-full flex flex-col shadow-xl">
                    <div className="box-header !bg-danger/20">
                        <div className="box-title">Payments</div>
                    </div>
                    <div className="box-body !p-0 h-full">
                        <div className="table-responsive h-full overflow-y-auto">
                            <table className="table table-hover whitespace-nowrap min-w-full">
                                <tbody>
                                {[
                                    {
                                        statusKey: 'PO Created',
                                        icon: 'ri-file-list-2-line text-secondary',
                                        label: 'PO Created',
                                        count: serviceRequest?.['PO Created'] ?? 0,
                                        trend: serviceRequest?.trends?.poCreated || '0.0%'
                                    },
                                    {
                                        statusKey: 'Invoice Submitted',
                                        icon: 'ri-file-text-line text-secondary',
                                        label: 'Invoice Submitted',
                                        count: serviceRequest?.['Invoice Submitted'] ?? 0,
                                        trend: serviceRequest?.trends?.invoiceSubmitted || '0.0%'
                                    },
                                    {
                                        statusKey: 'Payment Proceed',
                                        icon: 'ri-money-dollar-circle-line text-secondary',
                                        label: 'Payment Proceed',
                                        count: serviceRequest?.['Payment Proceed'] ?? 0,
                                        trend: serviceRequest?.trends?.paymentProceed || '0.0%'
                                    }
                                ].map((item, index) => {
                                    const {changeClass, arrowIconClass, ariaLabel} = getChangeStyles(item.trend)
                                    return (
                                        <tr
                                            key={index}
                                            className="border-t border-inherit border-solid hover:bg-gray-100 dark:hover:bg-light dark:border-defaultborder/10 cursor-pointer"
                                            onClick={() => handleCardClick(item.statusKey)}
                                        >
                                            <td>
                                                <div className="flex items-center">
                                                    <i className={`${item.icon} text-[1.125rem] me-2`}></i>
                                                    <div className="font-semibold">{item.label}</div>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <div className="text-[1.125rem] font-semibold">{item.count}</div>
                                            </td>
                                            <td className="text-center">
                                                <div className="flex items-center justify-end mr-3">
                                                    <PercentageIcon
                                                        parentClasses="text-[0.7rem] text-gray-600"
                                                        percentage_change={item.trend}
                                                        arrowIconClass={arrowIconClass}
                                                        changeClass={changeClass}
                                                        ariaLabel={ariaLabel}
                                                    />
                                                </div>
                                            </td>

                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="box overflow-hidden h-full flex flex-col shadow-xl">
                    <div className="box-header !bg-cyan/20">
                        <div className="box-title">Service Request Ratings</div>
                    </div>
                    <div className="box-body !p-3 h-full">
                        {[
                            {label: "5Star", rating: 5, count: serviceRequest?.['rating-5'] ?? 0},
                            {label: "4Star", rating: 4, count: serviceRequest?.['rating-4'] ?? 0},
                            {label: "3Star", rating: 3, count: serviceRequest?.['rating-3'] ?? 0},
                            {label: "2Star", rating: 2, count: serviceRequest?.['rating-2'] ?? 0},
                            {label: "1Star", rating: 1, count: serviceRequest?.['rating-1'] ?? 0}
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                onClick={() => handleCardClick(`rating-${item.rating}`)}
                                className="flex items-center justify-between mb-3 p-1 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                            >
                                <div className="flex items-center">
                                    <span className="text-sm mr-2">{item.label}</span>
                                    <Rating
                                        name={`read-only-${idx}`}
                                        value={item.rating}
                                        readOnly
                                        size="medium"
                                    />
                                </div>
                                <span
                                    className="text-sm font-semibold bg-blue-100 text-blue-600 px-3 py-1 rounded-full">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="box overflow-hidden h-full flex flex-col shadow-xl">
                    <div className="box-header !bg-green/20">
                        <div className="box-title">SLA Performance</div>
                    </div>
                    <div className="box-body h-full">
                        {isLoading
                            ? <LoadingSpinner/>
                            : <SlaDonut
                                onTime={serviceRequest?.onTime}
                                overDue={serviceRequest?.overDue}
                                onLegendClick={idx => handleCardClick(idx === 0 ? 'On-Time' : 'Sla-Overdue')}
                            />
                        }
                    </div>
                </div>


            </div>
        </div>
    )
}

export default SrDashboard
