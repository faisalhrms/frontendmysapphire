import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setSrFilters, resetSrFilters } from '@modules/dashboards/sr/redux/srSlice.js'
import { formatOptions } from '@helpers/formatters.js'
import { useServiceRequest } from '@modules/dashboards/sr/Hooks/SrListHook.js'
import FormAsyncSelect from '@components/form/FormAsyncSelect.jsx'
import FormSelect from '@components/form/FormSelect.jsx'
import DepartmentDropdown from '@components/dropdowns/DepartmentDropdown.jsx'
import SubDepartmentDropdown from '@components/dropdowns/SubDepartmentDropdown.jsx'
import { monthDashboard, yearDashboard } from '@modules/sr-management/services/srServices.js'
import srSchema from '@modules/sr-management/schema/srSchema.js'
import Rating from '@mui/material/Rating'

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
  const { serviceRequest, applyFilters, downloadExcel, isDownloading } = useServiceRequest(reduxFilterParams)
  const navigate = useNavigate()

  const hasInitial = Object.values(filters).some(v => v && (typeof v === 'object' ? v.id || v.name : true))
  const [showFilters, setShowFilters] = useState(hasInitial)

  const {
    control,
    watch,
    getValues,
    reset,
    formState: { errors }
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

  const getBgColor = cls =>
    cls.includes('text-primary')
      ? 'bg-blue-100'
      : cls.includes('text-danger')
      ? 'bg-red-100'
      : cls.includes('text-warning')
      ? 'bg-yellow-100'
      : cls.includes('text-success')
      ? 'bg-green-100'
      : cls.includes('text-info')
      ? 'bg-blue-100'
      : 'bg-gray-100'

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
    <div className="p-4 bg-gray-50 dark:bg-bodybg min-h-screen">
      <div className="grid grid-cols-12 gap-x-6 mb-1">
        <div className="col-span-12">
          <div className="btn-list float-end space-x-2">
            <button className="ti-btn bg-primary text-white py-2 px-4" onClick={toggleFilters}>
              <i className="ri-filter-3-fill"></i> Filters
            </button>
            <button className="ti-btn ti-btn-outline-secondary py-2 px-4" onClick={downloadExcel}>
              <i
                className="ri-upload-cloud-line"
                style={isDownloading ? { animation: 'spin 1s infinite linear' } : {}}
              ></i>{' '}
              Excel
            </button>
          </div>
          <div
            className={`transition-all duration-300 ${
              showFilters ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="box">
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
                    <FormSelect name="month" control={control} errors={errors} options={monthDashboard} placeholder="Select Month" />
                  </div>
                  <div className="xl:col-span-3 col-span-12">
                    <FormSelect name="year_dashboard" control={control} errors={errors} options={yearDashboard} placeholder="Select Year" />
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
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
        {[
          { status: 'Unassign', label: 'Unassigned', icon: 'ri-user-unfollow-line text-primary' },
          { status: 'Not-Started', label: 'Not Started', icon: 'ri-timer-line text-danger' },
          { status: 'In-Progress', label: 'In Process', icon: 'ri-run-line text-warning' },
          { status: 'Waiting for Quotation', label: 'Waiting for Quotation', icon: 'ri-file-search-line text-secondary' },
          { status: 'Waiting for Approval', label: 'Waiting for Approval', icon: 'ri-loader-2-line text-secondary' }
        ].map((it, i) => (
          <div key={i} onClick={() => handleCardClick(it.status)} className="cursor-pointer">
            <div className="dark:bg-bodybg bg-white shadow-xl rounded-lg p-4 flex items-center space-x-4 transition-transform hover:scale-105 h-[100px]">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getBgColor(it.icon)}`}>
                <i className={`${it.icon} text-4xl`}></i>
              </div>
              <div>
                <h3 className="text-gray-600 text-sm font-medium">{it.label}</h3>
                <p className="text-2xl font-bold">{serviceRequest?.[it.status] ?? 0}</p>
              </div>
            </div>
          </div>
        ))}
      </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {[
                    ...[
                        {
                            status: "Waiting for Budget",
                            label: "Waiting for Budget",
                            icon: "ri-money-dollar-box-line text-secondary"
                        },
                        {status: "Waiting for PR", label: "Waiting for PR", icon: "ri-file-list-3-line text-secondary"},
                        {status: "PO Created", label: "PO Created", icon: "ri-file-list-2-line text-secondary"},
                        {
                            status: "Waiting for Purchase",
                            label: "Waiting for Purchase",
                            icon: "ri-shopping-cart-2-line text-secondary"
                        },
                    ],
                    ...[
                        {status: "Delivered", label: "Delivered", icon: "ri-truck-line text-danger"},
                        {status: "Waiting for GRN", label: "Waiting for GRN", icon: "ri-file-copy-line text-primary"},
                        {
                            status: "Invoice Submitted",
                            label: "Invoice Submitted",
                            icon: "ri-file-text-line text-secondary"
                        },
                        {
                            status: "Payment Proceed",
                            label: "Payment Proceed",
                            icon: "ri-money-dollar-circle-line text-secondary"
                        },
                    ]
                ].map((item, index) => (
                    <div key={index} onClick={() => handleCardClick(item.status)} className="cursor-pointer">
                        <div
                            className='dark:bg-bodybg bg-white shadow-xl rounded-lg p-4 flex items-center space-x-4 transition-transform hover:scale-105 h-[100px]'>
                            <div
                                className={`flex items-center justify-center w-12 h-12 rounded-full ${getBgColor(item.icon)}`}>
                                <i className={`${item.icon} text-4xl`}></i>
                            </div>
                            <div>
                                <h3 className='text-gray-600 text-sm font-medium'>{item.label}</h3>
                                <p className='text-2xl font-bold'>{serviceRequest?.[item.status] ?? 0}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {[
                    ...[
                        {
                            status: "Waiting for Acknowledgement",
                            label: "Waiting for Acknowledgement",
                            icon: "ri-user-voice-line text-secondary"
                        },
                        {status: "Completed", label: "Completed", icon: "ri-checkbox-circle-line text-success"},
                        {status: "Closed", label: "Closed", icon: "ri-lock-line text-secondary"}
                    ]
                ].map((item, index) => (
                    <div key={index} onClick={() => handleCardClick(item.status)} className="cursor-pointer">
                        <div
                            className="dark:bg-bodybg bg-white shadow-xl hover:shadow-2xl rounded-lg p-4 flex items-center space-x-4 transition-transform hover:scale-105 h-[100px]">
                            <div
                                className={`flex items-center justify-center w-12 h-12 rounded-full ${getBgColor(item.icon)}`}>
                                <i className={`${item.icon} text-4xl`}></i>
                            </div>
                            <div>
                                <h3 className="text-gray-600 text-sm font-medium">{item.label}</h3>
                                <p className="text-2xl font-bold">{serviceRequest?.[item.status] ?? 0}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-6">
                {[
                    {status: "On-Hold", label: "On Hold", icon: "ri-pause-circle-line text-warning"},
                    {status: "Overdue", label: "Overdue", icon: "ri-alarm-warning-line text-info"},
                    {status: "Cancelled", label: "Cancelled", icon: "ri-close-circle-line text-danger"}
                ].map((item, index) => (
                    <div key={index} onClick={() => handleCardClick(item.status)} className="cursor-pointer">
                        <div
                            className="dark:bg-bodybg bg-white shadow-xl hover:shadow-2xl rounded-lg p-4 flex items-center space-x-4 transition-transform hover:scale-105 h-[100px]">
                            <div
                                className={`flex items-center justify-center w-12 h-12 rounded-full ${getBgColor(item.icon)}`}>
                                <i className={`${item.icon} text-4xl`}></i>
                            </div>
                            <div>
                                <h3 className="text-gray-600 text-sm font-medium">{item.label}</h3>
                                <p className="text-2xl font-bold">{serviceRequest?.[item.status] ?? 0}</p>
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
                    <div key={index} onClick={() => handleCardClick(item.status)} className="cursor-pointer">
                        <div
                            className="dark:bg-bodybg bg-white shadow-xl hover:shadow-2xl rounded-lg flex flex-col items-center space-y-3 transition-transform hover:scale-105 p-4 h-[100px]">
                            <div className="text-center">
                                <p className="text-2xl font-bold">{serviceRequest?.[item.status] ?? 0}</p>
                            </div>
                            <div>
                                <Rating name={`clickable-rating-${index}`} value={item.rating}
                                        readOnly/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SrDashboard;
