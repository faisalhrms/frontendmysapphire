import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import FormButton from "@components/form/FormButton.jsx";
import FormInput from "@components/form/FormInput.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import { BEIRHOLM_BI_ROUTES } from "@modules/beirholm-bi/routes.js";
import { useExchangeRate } from "@modules/beirholm-bi/hooks/exchangeRate.js";
import { productCountry } from "@modules/beirholm-bi/services/DataSanitizeService.js";

const ExchangeRateForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  const { handleSubmit, control, errors, isSubmitting, onSubmit, exchangeRate } = useExchangeRate(id);

  const submitHandler = async (data) => {
    await onSubmit(data);
    navigate(BEIRHOLM_BI_ROUTES.EXCHANGE_RATE_READ.path);
  };

  return (
    <div>
      <PageHeader currentpage="Add Exchange Rates" activepage="Exchange Rates" mainpage="Add Exchange Rates" />
      <div className="xl:col-span-9 col-span-12">
        <div className="box">
          <div className="box-header">
            <div className="box-title">
              {id && id !== ":id" ? "Edit Exchange Rates" : "Add Exchange Rates"}
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
                  <FormInput
                    name="rate"
                    type="number"
                    control={control}
                    errors={errors}
                    placeholder="Exchange Rate"
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <FormInput
                    name="effective_date"
                    type="month"
                    control={control}
                    errors={errors}
                    placeholder="Effective Date"
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

export default ExchangeRateForm;
