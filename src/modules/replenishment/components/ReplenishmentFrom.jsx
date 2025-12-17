import React, {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import FormSelect from "@components/form/FormSelect.jsx";
import {useFieldArray, useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import replenishmentSchema from "@modules/replenishment/schemas/replenishmentSchema.js";
import {
  forecastMethods,
} from "@modules/replenishment/services/replenishmentService.js";
import FormToggle from "@components/form/FormToggle.jsx";
import FormInput from "@components/form/FormInput.jsx";
import { Slider } from "@mui/material";
import FormButton from "@components/form/FormButton.jsx";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import FormTextarea from "@components/form/FormTextarea.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import {REPLENISHMENT_ROUTES} from "@modules/replenishment/routes.js";
import {formatDate} from "@helpers/dateTime.js";

const ReplenishmentFrom = () => {
  const [minSoldAt, setMinSoldAt] = useState(null);
  const [maxSoldAt, setMaxSoldAt] = useState(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [submitTxt, setSubmitTxt] = useState('Generating Report...');
  const [sliderValue, setSliderValue] = useState(0.00);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  useEffect( () => {
    const fetchSalesDateRange = async () => {
      setIsGenerating(true);
      try {
        const response = await api.get('/scm/report/sales-import-status/');
        setMinSoldAt(response.data?.data?.min_sold_at)
        setMaxSoldAt(response.data?.data?.max_sold_at)
        setLastUpdatedAt(response.data?.data?.last_updated_at)
        setCurrentStatus(response.data?.data?.current_status)
        if (response.data?.data?.current_status === 'completed'){
          setIsGenerating(false);
        }else {
          setSubmitTxt('Importing Data...')
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchSalesDateRange()
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    unregister,
  } = useForm({
    resolver: zodResolver(replenishmentSchema),
    defaultValues: {
      split_report: false,
      date_from: "",
      date_to: "",
      standard_deviations: 0.00,
      launches: [],
      forecast_days: 13,
      forecast_method: "standard_deviation",
      // from_warehouses: [{ name: "", priority: undefined }],
      reason_code:102,
      comment:"Replenishment",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "from_warehouses",
  });

  const addField = () => {
    append({ name: "", priority: undefined });

  };

  const removeField = (index) => {
    if (fields.length > 1) {
      remove(index);
      unregister(`from_warehouses.${index}`);
    }
  };


  const handleSliderChange = (event, newValue) => {
    const formattedValue = parseFloat(newValue).toFixed(2);
    setSliderValue(parseFloat(formattedValue));
    setValue("standard_deviations", parseFloat(formattedValue));
  };

  const handleReport = async (payload) => {
    try {
      setIsGenerating(true);
      const response = await api.post('scm/report/generate/', payload);
      const { forecast_days, message, progress, status, task_id, total_items, total_warehouses, file_url } = response.data?.data;
      navigate(REPLENISHMENT_ROUTES.THANK.path, {
        state: {
          forecast_days,
          message,
          progress,
          status,
          task_id,
          total_items,
          total_warehouses,
          file_url,
        },
      });
    } catch (error) {
      Notify.error(error.response?.data?.message || "An error occurred while generating the report.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
      <>
          {
            currentStatus === 'in_progress' ?
                <div className="alert alert-danger flex items-center" role="alert">
                  <svg className="sm:flex-shrink-0 me-2 fill-danger" xmlns="http://www.w3.org/2000/svg"
                       enableBackground="new 0 0 24 24" height="1.5rem" viewBox="0 0 24 24" width="1.5rem"
                       fill="#000000">
                    <g>
                      <rect fill="none" height="24" width="24"></rect>
                    </g>
                    <g>
                      <g>
                        <g>
                          <path
                              d="M15.73,3H8.27L3,8.27v7.46L8.27,21h7.46L21,15.73V8.27L15.73,3z M19,14.9L14.9,19H9.1L5,14.9V9.1L9.1,5h5.8L19,9.1V14.9z"></path>
                          <rect height="6" width="2" x="11" y="7"></rect>
                          <rect height="2" width="2" x="11" y="15"></rect>
                        </g>
                      </g>
                    </g>
                  </svg>
                  <div> Data import is currently in progress. Please try again later.</div>
                </div>
                :
                <div className="alert alert-primary flex items-center" role="alert">
                  <svg className="sm:flex-shrink-0 me-2 svg-primary" xmlns="http://www.w3.org/2000/svg" height="1.5rem"
                       viewBox="0 0 24 24" width="1.5rem" fill="#000000">
                    <path d="M0 0h24v24H0V0z" fill="none"></path>
                    <path
                        d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
                  </svg>
                  <div> The data was last updated on {formatDate(lastUpdatedAt, 'MMM dd, yyyy - HH:mm')}. The system
                    holds data
                    from {formatDate(minSoldAt)} to {formatDate(maxSoldAt)}.
                  </div>
                </div>
          }
        <form onSubmit={handleSubmit(handleReport)}>
          <ul className="list-group list-group-flush">
            <li className="list-group-item !border !border-defaultborder dark:!border-defaultborder/10 !border-t-0 !border-e-0 !border-s-0">
              <div className="grid grid-cols-12 xl:gap-x-[3rem] gap-y-4">
                <div className="xl:col-span-4 col-span-12">
                  <label
                      className="text-[1rem] mb-1 font-semibold"
                      title="Configuration"
                  >
                    Configuration
                  </label>
                  <p
                      className="text-[0.75rem] mb-0 text-[#8c9097] dark:text-white/50"
                      title="Configure your replenishment settings here."
                  >
                    Configure your replenishment settings here. Enable or disable
                    features like splitting recommendations based on your
                            preference.
                          </p>
                        </div>
                        <div className="xl:col-span-8 col-span-12">
                          <div className="flex flex-col gap-y-4">
                            <div>
                              <label className="form-label">Split Transfer Recommendations</label>
                              <FormToggle
                                  label="Split Transfer Recommendations"
                                  name="split_report"
                                  control={control}
                                  errors={errors}
                              />
                            </div>
                            <div>
                              <FormSelect
                                  label="Forecast Method"
                                  name="forecast_method"
                                  control={control}
                                  errors={errors}
                                  options={forecastMethods}
                                  placeholder="Forecast Method"
                                  is_required={true}
                              />
                            </div>
                            <div className="xl:col-span-8 col-span-12">
                              <div className="items-center justify-between">
                                <div>
                                  <label className="form-label">Standard Deviations: {sliderValue.toFixed(2)}</label>
                                  <Slider
                                      aria-label="Standard Deviation"
                                      value={sliderValue}
                                      onChange={handleSliderChange}
                                      min={0.00}
                                      max={5.0}
                                      step={0.01}
                                      color="primary"
                                  />
                                  <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between"
                                      }}
                                  >
                                    <span className="text-primary">0.00</span>
                                    <span className="text-danger">5.00</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/*<div>*/}
                            {/*  <label*/}
                            {/*      className="form-label"*/}
                            {/*      title="From Warehouses"*/}
                            {/*      htmlFor="from_warehouses">*/}
                            {/*    From Warehouses*/}
                            {/*  </label>*/}
                            {/*  <div className="flex flex-col gap-y-2">*/}
                            {/*    {fields.map((field, index) => (*/}
                            {/*        <div key={index} className="flex items-center gap-x-2">*/}
                            {/*          <FormAsyncSelect*/}
                            {/*              label={false}*/}
                            {/*              name={`from_warehouses.${index}.name`}*/}
                            {/*              control={control}*/}
                            {/*              errors={errors}*/}
                            {/*              placeholder="Warehouse"*/}
                            {/*              apiUrl="/select/scm/warehouses/"*/}
                            {/*              queryKeyBase="scm_warehouses"*/}
                            {/*              preselectedOptions={[]}*/}
                            {/*          />*/}
                            {/*          {errors?.from_warehouses?.[index]?.priority && (*/}
                            {/*              <span className="text-danger text-sm">*/}
                            {/*         <p className="text-sm text-red mt-2">{errors.from_warehouses[index].priority.message}</p>*/}
                            {/*     </span>*/}
                            {/*          )}*/}
                            {/*          <FormInput*/}
                            {/*              type="number"*/}
                            {/*              name={`from_warehouses.${index}.priority`}*/}
                            {/*              control={control}*/}
                            {/*              errors={errors}*/}
                            {/*          />*/}
                            {/*          {index === 0 ? (*/}
                            {/*              <i*/}
                            {/*                  className="bi bi-plus-square text-success cursor-pointer"*/}
                            {/*                  onClick={addField}*/}
                            {/*              ></i>*/}
                            {/*          ) : (*/}
                            {/*              <i*/}
                            {/*                  className="bi bi-dash-square text-danger cursor-pointer"*/}
                            {/*                  onClick={() => removeField(index)}*/}
                            {/*              ></i>*/}
                            {/*          )}*/}
                            {/*        </div>*/}
                            {/*    ))}*/}
                            {/*  </div>*/}
                            {/*</div>*/}

                            <div>
                              <FormInput
                                  placeholder='Forecast Days'
                                  type="number"
                                  name="forecast_days"
                                  control={control}
                                  errors={errors}
                                  is_required={true}
                              />
                            </div>
                            <div className="xl:col-span-8 col-span-12">
                              <div className="grid grid-cols-12 gap-x-2 gap-y-2">
                                <div className="xl:col-span-6 col-span-12">
                                  <FormAsyncSelect
                                      label={true}
                                      name={`category`}
                                      control={control}
                                      errors={errors}
                                      placeholder="Category"
                                      apiUrl="/select/scm/categories/"
                                      queryKeyBase="scm_categories"
                                      is_required={true}
                                  />
                                </div>
                                <div className="xl:col-span-6 col-span-12">
                                  <FormInput
                                      placeholder='Minimum Quantity'
                                      type="number"
                                      name="min_qty"
                                      control={control}
                                      errors={errors}
                                      is_required={true}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
              </div>
            </li>

                    <li className="list-group-item !border !border-defaultborder dark:!border-defaultborder/10 !border-t-0 !border-e-0 !border-s-0">
                      <div className="grid grid-cols-12 xl:gap-x-[3rem] gap-y-4">
                        <div className="xl:col-span-4 col-span-12">
                          <label
                              className="text-[1rem] mb-1 font-semibold"
                              title="Date Configuration"
                          >
                            Date Configuration
                          </label>
                          <p
                              className="text-[0.75rem] mb-0 text-[#8c9097] dark:text-white/50"
                              title="Define the date range for the forecast."
                          >
                            Define the date range for your forecast. Select the start and
                            end dates to specify the timeframe for the analysis.
                          </p>
                        </div>
                        <div className="xl:col-span-8 col-span-12">
                          <div className="flex flex-col gap-y-4">
                            <div className="xl:col-span-8 col-span-12">
                              <div className="grid grid-cols-12 gap-x-2 gap-y-2">
                                <div className="xl:col-span-6 col-span-12">
                                    <FormAsyncSelect
                                        label={true}
                                        isMulti={true}
                                        name="launches"
                                        control={control}
                                        errors={errors}
                                        placeholder="Launches"
                                        apiUrl="/select/scm/launches/"
                                        queryKeyBase="scm_launches"
                                        clientSideSearch={true}
                                    />
                                </div>
                                <div className="xl:col-span-6 col-span-12">
                                  <FormInput
                                      placeholder='Launch Aging'
                                      type="number"
                                      name="launch_aging"
                                      control={control}
                                      errors={errors}
                                      is_required={true}
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <FormInput
                                  type="date"
                                  id="from_date"
                                  name="from_date"
                                  control={control}
                                  errors={errors}
                                  placeholder="Sale Date From"
                                  min={minSoldAt}
                                      max={maxSoldAt}
                                      is_required={true}
                                  />
                                </div>
                                <div>
                                  <FormInput
                                      type="date"
                                      id="to_date"
                                      name="to_date"
                                      control={control}
                                      errors={errors}
                                      placeholder="Sale Date To"
                                      min={minSoldAt}
                                      max={maxSoldAt}
                                      is_required={true}
                                  />
                                </div>
                                <div>
                                  <FormInput
                                      type="date"
                                      name="excluded_from_date"
                                      control={control}
                                      errors={errors}
                                      placeholder="Excluded From Date"
                                  />
                                </div>
                                <div>
                                  <FormInput
                                      type="date"
                                      name="excluded_to_date"
                                      control={control}
                                      errors={errors}
                                      placeholder="Excluded To Date"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                    </li>

            <li className="list-group-item !border !border-defaultborder dark:!border-defaultborder/10 !border-t-0 !border-e-0 !border-s-0">
            <div className="grid grid-cols-12 xl:gap-x-[3rem] gap-y-4">
                <div className="xl:col-span-4 col-span-12">
                  <label
                      className="text-[1rem] mb-1 font-semibold"
                      title="File Columns Configuration"
                          >
                            File Columns Configuration
                          </label>
                          <p
                              className="text-[0.75rem] mb-0 text-[#8c9097] dark:text-white/50"
                              title="Define the date range for the forecast."
                          >
                            Enter the Reason Code to categorize entries, set the Plan Ship Date and Plan Receive Date to define shipment schedules, and add any Comments to provide additional context or instructions.
                          </p>
                        </div>
                        <div className="xl:col-span-8 col-span-12">
                          <div className="grid grid-cols-12 gap-x-2 gap-y-2">
                            <div className="xl:col-span-4 col-span-12">
                              <FormInput
                                  placeholder='Reason Code'
                                  type="number"
                                  name="reason_code"
                                  control={control}
                                  errors={errors}
                                  is_required={true}
                              />
                            </div>
                            <div className="xl:col-span-4 col-span-12">
                              <FormInput
                                  placeholder='Plan Ship Date'
                                  type="date"
                                  name="plan_ship_date"
                                  control={control}
                                  errors={errors}
                                  is_required={true}
                              />
                            </div>
                            <div className="xl:col-span-4 col-span-12">
                              <FormInput
                                  placeholder='Plan Receive Date'
                                  type="date"
                                  name="plan_receive_date"
                                  control={control}
                                  errors={errors}
                                  is_required={true}
                              />
                            </div>
                            <div className="col-span-12">
                              <FormTextarea
                                  label="Comment"
                                  placeholder='Comment'
                                  name="comment"
                                  control={control}
                                  errors={errors}
                                  is_required={true}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-group-item !border-0 text-right">
                      <FormButton isLoading={isGenerating} text='Generate Report' submitTxt={submitTxt}/>
                    </li>
                  </ul>
                </form>
            </>
            );
          };

        export default ReplenishmentFrom;
