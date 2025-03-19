import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import FormButton from "@components/form/FormButton.jsx";
import FormInput from "@components/form/FormInput.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import { BEIRHOLM_BI_ROUTES } from "@modules/beirholm-bi/routes.js";
import { useImporterClassification } from "@modules/beirholm-bi/hooks/useImporterClassification.js";
import FormSelect from "@components/form/FormSelect.jsx";
import {productCountry} from "@modules/beirholm-bi/services/DataSanitizeService.js";

const ImporterClassificationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  const { handleSubmit, control, errors, isSubmitting, onSubmit, importerClassification } =
    useImporterClassification(id);

  const submitHandler = async (data) => {
    await onSubmit(data);
    navigate(BEIRHOLM_BI_ROUTES.IMPORTER_CLASSIFICATION_READ.path);
  };

  return (
    <div>
      <PageHeader
        currentpage={id ? "Edit Importer Classification" : "Add Importer Classification"}
        mainpage="Importer Classification"
      />
      <div className="xl:col-span-9 col-span-12">
        <div className="box">
          <div className="box-header">
            <div className="box-title">
              {id ? "Edit Importer Classification" : "Add Importer Classification"}
            </div>
          </div>
          <div className="box-body">
            <form onSubmit={handleSubmit(submitHandler)}>
              <div className="grid grid-cols-12 gap-4">
                <div className="xl:col-span-4 col-span-12">
                  <FormSelect
                      name="product_country"
                      control={control}
                      errors={errors}
                      placeholder="Select Country"
                      options={productCountry}
                      label="Select Country"
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <FormAsyncSelect
                    label={true}
                    name="data_category"
                    control={control}
                    errors={errors}
                    placeholder="Select Data Category"
                    apiUrl="/select/data/categories/"
                    queryKeyBase="data_category"
                    preselectedOptions={[]}
                    saveOptionEndpoint="/select/data/category/"
                    allowSaveNewOption={true}
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <FormInput
                    name="importer"
                    control={control}
                    errors={errors}
                    placeholder="Importer"
                    label="Importer"
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <FormInput
                    name="classification"
                    control={control}
                    errors={errors}
                    placeholder="Classification"
                    label="Classification"
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <FormInput
                    name="focus_buyers"
                    control={control}
                    errors={errors}
                    placeholder="Focus Buyers"
                    label="Focus Buyers"
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-dashed sm:flex justify-end">
                <FormButton isLoading={isSubmitting} type="submit" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImporterClassificationForm;
