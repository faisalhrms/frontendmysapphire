import React from "react";
import { Controller } from "react-hook-form";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import DateDropdown from "@modules/dashboards/beirholmBi/components/DateDropdown.jsx";

const ExportDashboardFilter = ({ control, errors }) => (
  <div className="grid grid-cols-12 gap-6">
    <div className="col-span-12">
      <div className="box custom-box">
        <div className="box-body p-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DateDropdown
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.date && (
                <p className="text-red-500 text-sm">
                  {errors.date.message}
                </p>
              )}
            </div>
            <div>
              <FormAsyncSelect
                label={false}
                name="data_category"
                control={control}
                errors={errors}
                placeholder="Select Data Category"
                apiUrl="/select/data/categories/"
                queryKeyBase="data_category"
                preselectedOptions={[]}
              />
            </div>
            <div>
              <FormAsyncSelect
                label={false}
                name="continent"
                control={control}
                errors={errors}
                placeholder="Select Continent"
                apiUrl="/select/beirholm/continents/"
                queryKeyBase="continent"
                preselectedOptions={[]}
              />
            </div>
            <div>
              <FormAsyncSelect
                label={false}
                name="country"
                control={control}
                errors={errors}
                placeholder="Select Country"
                apiUrl="/select/beirholm/country/"
                queryKeyBase="country"
                preselectedOptions={[]}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div>
              <FormAsyncSelect
                label={false}
                name="classification"
                control={control}
                errors={errors}
                placeholder="Select Classification"
                apiUrl="/select/beirholm/classification/"
                queryKeyBase="classification"
                preselectedOptions={[]}
              />
            </div>
            <div>
              <FormAsyncSelect
                label={false}
                name="exporter"
                control={control}
                errors={errors}
                placeholder="Select Exporter"
                apiUrl="/select/beirholm/exporter/"
                queryKeyBase="exporter"
                preselectedOptions={[]}
              />
            </div>
            <div>
              <FormAsyncSelect
                label={false}
                name="importer"
                control={control}
                errors={errors}
                placeholder="Select Importer"
                apiUrl="/select/beirholm/importer/"
                queryKeyBase="importer"
                preselectedOptions={[]}
              />
            </div>
            <div>
              <FormAsyncSelect
                label={false}
                name="focus_buyer"
                control={control}
                errors={errors}
                placeholder="Select Focus Buyer"
                apiUrl="/select/beirholm/focus/buyer/"
                queryKeyBase="focus_buyer"
                preselectedOptions={[]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default React.memo(ExportDashboardFilter);
