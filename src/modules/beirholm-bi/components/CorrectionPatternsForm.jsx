import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import FormButton from "@components/form/FormButton.jsx";
import FormInput from "@components/form/FormInput.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import { BEIRHOLM_BI_ROUTES } from "@modules/beirholm-bi/routes.js";
import { usePatternForm } from "@modules/beirholm-bi/hooks/CorrectionPatterns.js";

const CorrectionPatternsForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  const {
    handleSubmit,
    control,
    errors,
    isSubmitting,
    onSubmit,
    append,
    remove,
    initialData,
    watch,
  } = usePatternForm(id);

  const submitHandler = async () => {
    await onSubmit();
    navigate(BEIRHOLM_BI_ROUTES.CORRECTION_PATTERN_READ.path);
  };

  const preselectedHeader = initialData?.header
    ? [{ value: initialData.header.id, label: initialData.header.name }]
    : [];

  return (
    <div>
      <PageHeader
        currentpage={id ? "Edit Data Correction Patterns" : "Add Data Correction Patterns"}
        activepage="Data Correction Patterns"
        mainpage="Data Correction Patterns"
      />
      <div className="xl:col-span-9 col-span-12">
        <div className="box">
          <div className="box-header">
            <div className="box-title">
              {id ? "Edit Data Correction Patterns" : "Add Data Correction Patterns"}
            </div>
          </div>
          <div className="box-body">
            <form onSubmit={handleSubmit(submitHandler)}>
              <div className="grid grid-cols-12 gap-4">
                {/* Header Selection */}
                <div className="xl:col-span-4 col-span-12">
                  <FormAsyncSelect
                    label={true}
                    name="header"
                    control={control}
                    errors={errors}
                    placeholder="Header Name"
                    apiUrl="/select/beirholm/excel/headers/"
                    queryKeyBase="header"
                    preselectedOptions={preselectedHeader}
                  />
                </div>
                {/* Pattern Field */}
                <div className="xl:col-span-3 col-span-12">
                  <FormInput
                    name="pattern"
                    control={control}
                    errors={errors}
                    placeholder="Pattern"
                  />
                  <small className="text-gray-500">
                    Define your pattern using 'N' for digits, 'X' as a separator, and 'S' to add a space.
                    For example: <em>NNN X NN S NNN X NN</em>
                  </small>
                </div>
              </div>
              {/* Child Patterns */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-5">
                  <div className="box-title">Child Patterns</div>
                  <button
                    type="button"
                    onClick={() => append({ pattern: "" })}
                    className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                  >
                    <i className="ri-add-line font-semibold align-middle"></i> Add
                  </button>
                </div>
                {watch("child_patterns").map((item, index) => (
                  <div
                    key={item.id || index}
                    className="flex items-center space-x-2 p-2 mb-2 bg-gray-50 rounded-md border"
                  >
                    <FormInput
                      name={`child_patterns.${index}.pattern`}
                      control={control}
                      errors={errors}
                      placeholder="Child Pattern"
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="ti-btn ti-btn-danger ti-btn-sm flex items-center"
                    >
                      <i className="ti ti-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-dashed flex justify-end">
                <FormButton isLoading={isSubmitting} type="submit" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorrectionPatternsForm;
