import React, {useCallback, useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setSrFilters, resetSrFilters} from "@modules/dashboards/sr/redux/srSlice.js";
import {usePreselectedOption} from "@modules/dashboards/sr/Hooks/usePreselectedOption.js";
import FormSelect from "@components/form/FormSelect.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import {monthDashboard, yearDashboard} from "@modules/sr-management/services/srServices.js";
import srSchema from "@modules/sr-management/schema/srSchema.js";
import Rating from "@mui/material/Rating";
import DepartmentDropdown from "@components/dropdowns/DepartmentDropdown.jsx";
import SubDepartmentDropdown from "@components/dropdowns/SubDepartmentDropdown.jsx";
import {useServiceRequest} from "@modules/dashboards/sr/Hooks/SrListHook.js";

const getBgColor = (iconClass) => {
  if (iconClass.includes("text-primary")) return "bg-blue-100";
  if (iconClass.includes("text-danger")) return "bg-red-100";
  if (iconClass.includes("text-warning")) return "bg-yellow-100";
  if (iconClass.includes("text-success")) return "bg-green-100";
  if (iconClass.includes("text-info")) return "bg-blue-100";
  if (iconClass.includes("text-secondary")) return "bg-gray-100";
  return "bg-gray-100";
};

const SrDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const storedFilters = useSelector(state => state.sr.filters);
  const {control, watch, formState: {errors}, getValues, reset, setValue} = useForm({
    resolver: zodResolver(srSchema),
    defaultValues: storedFilters
  });
  const {serviceRequest, applyFilters, downloadExcel} = useServiceRequest(storedFilters);
  const [showFilters, setShowFilters] = useState(Object.keys(storedFilters).length > 0);
  const [company, setCompany] = useState(storedFilters.company_id || null);
  const [department, setDepartment] = useState(storedFilters.department_id || null);
  const [subDepartment, setSubDepartment] = useState(storedFilters.sub_department_id || null);
  const companyOption = usePreselectedOption("/select/companies", storedFilters.company_id);
  const storeRegionOption = usePreselectedOption("/select/store_regions", storedFilters.store_region_id);
  const cityOption = usePreselectedOption("/select/cities", storedFilters.city_id);
  const locationOption = usePreselectedOption("/select/locations", storedFilters.location_id);
  const [resetKey, setResetKey] = useState(0);
  useEffect(() => {
    applyFilters(storedFilters);
  }, [storedFilters, applyFilters]);
  const handleCompanySelect = useCallback((selectedValue) => {
    if (!selectedValue) {
      setCompany(null);
      setValue("company_id", "");
      setDepartment(null);
      setValue("department_id", "");
      return;
    }
    setCompany(selectedValue);
    setDepartment(null);
    setValue("company_id", selectedValue);
    setValue("department_id", "");
  }, [setValue]);
  const handleDepartmentSelect = useCallback((id) => {
    if (!id) {
      setDepartment(null);
      setValue("department_id", "");
      return;
    }
    setDepartment(id);
    setValue("department_id", id);
  }, [setValue]);
  const handleSubDepartmentSelect = useCallback((id) => {
    if (!id) {
      setSubDepartment(null);
      setValue("sub_department_id", "");
      return;
    }
    setSubDepartment(id);
    setValue("sub_department_id", id);
  }, [setValue]);
  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };
  const handleCardClick = (status) => {
    const queryString = new URLSearchParams(storedFilters).toString();
    navigate(`/dashboards/sr/sr-list/${status}${queryString ? `?${queryString}` : ""}`);
  };
  const handleRatingChange2 = (_event, newValue) => {};
  const onSearchClick = () => {
    const formValues = getValues();
    const filters = {
      company_id: formValues.company_id || "",
      store_region_id: formValues.store_region_id || "",
      city_id: formValues.city_id || "",
      location_id: formValues.location_id || "",
      department_id: formValues.department_id || "",
      sub_department_id: formValues.sub_department_id || "",
      month: formValues.month || "",
      year_dashboard: formValues.year_dashboard || ""
    };
    dispatch(setSrFilters(filters));
    setShowFilters(true);
  };
  const onClearFilters = () => {
    reset({
      company_id: "",
      store_region_id: "",
      city_id: "",
      location_id: "",
      department_id: "",
      sub_department_id: "",
      month: "",
      year_dashboard: ""
    });
    dispatch(resetSrFilters());
    setShowFilters(false);
    setCompany(null);
    setDepartment(null);
    setSubDepartment(null);
    setResetKey(prev => prev + 1);
  };
  const selectedRegion = watch("store_region_id");
  const selectedCity = watch("city_id");
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-12 gap-x-6 mb-1">
        <div className="xl:col-span-12 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12">
          <div className="btn-list md:mt-0 mt-0 float-end flex space-x-2">
            <button type="button" className="ti-btn bg-primary text-white !font-medium !text-sm !rounded py-2 px-4 shadow-lg" onClick={toggleFilters}>
              <i className="ri-filter-3-fill inline-block"></i> Filters
            </button>
            <button type="button" onClick={downloadExcel} className="ti-btn ti-btn-outline-secondary !font-medium !text-sm !rounded py-2 px-4 shadow-lg">
              <i className="ri-upload-cloud-line inline-block"></i> Excel
            </button>
          </div>
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showFilters ? "max-h-[1000px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
            <div className="box bg-white shadow-lg rounded-lg p-4">
              <div className="box-body">
                <div className="grid grid-cols-12 gap-4">
                  <div className="xl:col-span-3 col-span-12">
                    <FormAsyncSelect
                      key={`company-${resetKey}`}
                      label={false}
                      name="company_id"
                      control={control}
                      errors={errors}
                      placeholder="Company"
                      apiUrl="/select/companies/"
                      queryKeyBase="companies"
                      onSelectChange={handleCompanySelect}
                      clientSideSearch={false}
                      preselectedOptions={companyOption ? [companyOption] : []}
                    />
                  </div>
                  <div className="xl:col-span-3 col-span-12">
                    <FormAsyncSelect
                      key={`region-${resetKey}`}
                      label={false}
                      name="store_region_id"
                      control={control}
                      errors={errors}
                      placeholder="Store Region"
                      apiUrl="/select/store_regions"
                      queryKeyBase="store_regions"
                      clientSideSearch={false}
                      preselectedOptions={storeRegionOption ? [storeRegionOption] : []}
                    />
                  </div>
                  <div className="xl:col-span-3 col-span-12">
                    <FormAsyncSelect
                      key={`city-${resetKey}`}
                      label={false}
                      name="city_id"
                      control={control}
                      errors={errors}
                      placeholder="City"
                      apiUrl={`/select/cities?store_region_id=${selectedRegion || ""}`}
                      queryKeyBase={`cities-${selectedRegion || ""}`}
                      clientSideSearch={false}
                      preselectedOptions={cityOption ? [cityOption] : []}
                    />
                  </div>
                  <div className="xl:col-span-3 col-span-12">
                    <FormAsyncSelect
                      key={`location-${resetKey}`}
                      label={false}
                      name="location_id"
                      control={control}
                      errors={errors}
                      placeholder="Location"
                      apiUrl={`/select/locations?city_id=${selectedCity || ""}`}
                      queryKeyBase={`locations-${selectedCity || ""}`}
                      clientSideSearch={false}
                      preselectedOptions={locationOption ? [locationOption] : []}
                    />
                  </div>
                  <div className="xl:col-span-3 col-span-12">
                    <DepartmentDropdown company_id={company} control={control} errors={errors} onDepartmentSelect={handleDepartmentSelect} />
                  </div>
                  <div className="xl:col-span-3 col-span-12">
                    <SubDepartmentDropdown department_id={department} control={control} errors={errors} onSubDepartmentSelect={handleSubDepartmentSelect} />
                  </div>
                  <div className="xl:col-span-3 col-span-12">
                    <FormSelect
                      key={`month-${resetKey}`}
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
                      key={`year-${resetKey}`}
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
                  <button type="button" className="ti-btn bg-primary text-white font-medium rounded py-2 px-6 shadow-lg" onClick={onSearchClick}>
                    <i className="ri-search-2-line inline-block"></i> Apply Filter
                  </button>
                  <button type="button" className="ti-btn ti-btn-outline-secondary font-medium rounded py-2 px-6 shadow-lg" onClick={onClearFilters}>
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
          {status: "Unassign", label: "Unassigned", icon: "ri-user-unfollow-line text-primary"},
          {status: "Not-Started", label: "Not Started", icon: "ri-timer-line text-danger"},
          {status: "In-Progress", label: "In Process", icon: "ri-run-line text-warning"},
          {status: "Waiting for Quotation", label: "Waiting for Quotation", icon: "ri-file-search-line text-secondary"},
          {status: "Waiting for PR", label: "Waiting for PR", icon: "ri-file-list-3-line text-secondary"}
        ].map((item, index) => (
          <div key={index} onClick={() => handleCardClick(item.status)} className="cursor-pointer">
            <div className="bg-white shadow-xl hover:shadow-2xl rounded-lg p-4 flex items-center space-x-4 transition-transform hover:scale-105 h-[100px]">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getBgColor(item.icon)}`}>
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


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[
          ...[
            { status: "Waiting for Approval", label: "Waiting for Approval", icon: "ri-loader-2-line text-secondary" },
            { status: "Waiting for Purchase", label: "Waiting for Purchase", icon: "ri-shopping-cart-2-line text-secondary" },
            { status: "PO Created", label: "PO Created", icon: "ri-file-list-2-line text-secondary" },
            { status: "Delivered", label: "Delivered", icon: "ri-truck-line text-danger" }
          ],
          ...[
            { status: "Waiting for GRN", label: "Waiting for GRN", icon: "ri-file-copy-line text-primary" },
            { status: "Invoice Submitted", label: "Invoice Submitted", icon: "ri-file-text-line text-secondary" },
            { status: "Payment Proceed", label: "Payment Proceed", icon: "ri-money-dollar-circle-line text-secondary" },
            {status: "Closed", label: "Closed", icon: "ri-lock-line text-secondary"}
          ]
        ].map((item, index) => (
          <div key={index} onClick={() => handleCardClick(item.status)} className="cursor-pointer">
            <div className="bg-white shadow-xl hover:shadow-2xl rounded-lg p-4 flex items-center space-x-4 transition-transform hover:scale-105 h-[100px]">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getBgColor(item.icon)}`}>
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


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {[
          ...[
            { status: "Waiting for Budget", label: "Waiting for Budget", icon: "ri-money-dollar-box-line text-secondary" },
            { status: "Waiting for Acknowledgement", label: "Waiting for Acknowledgement", icon: "ri-user-voice-line text-secondary" },
            {status: "Completed", label: "Completed", icon: "ri-checkbox-circle-line text-success"}
          ]
        ].map((item, index) => (
          <div key={index} onClick={() => handleCardClick(item.status)} className="cursor-pointer">
            <div className="bg-white shadow-xl hover:shadow-2xl rounded-lg p-4 flex items-center space-x-4 transition-transform hover:scale-105 h-[100px]">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getBgColor(item.icon)}`}>
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
            <div className="bg-white shadow-xl hover:shadow-2xl rounded-lg p-4 flex items-center space-x-4 transition-transform hover:scale-105 h-[100px]">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getBgColor(item.icon)}`}>
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
            <div className="bg-white shadow-xl hover:shadow-2xl rounded-lg flex flex-col items-center space-y-3 transition-transform hover:scale-105 p-4 h-[100px]">
              <div className="text-center">
                <p className="text-2xl font-bold">{serviceRequest?.[item.status] ?? 0}</p>
              </div>
              <div>
                <Rating name={`clickable-rating-${index}`} value={item.rating} onChange={handleRatingChange2} readOnly />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SrDashboard;
