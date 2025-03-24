import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createExchangeRate, getExchangeRateById, updateExchangeRate } from "@modules/beirholm-bi/services/ExchangeRateService.js";

export const useExchangeRate = (id) => {
  const [exchangeRate, setExchangeRate] = useState(null);
  const { handleSubmit, control, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      product_country: "",
      rate: "",
      effective_date: "",
    },
  });

  const fetchExchangeRate = async (id) => {
    try {
      const res = await getExchangeRateById(id);
      setExchangeRate(res);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchExchangeRate(id);
    }
  }, [id]);

  useEffect(() => {
    if (exchangeRate) {
      setValue("product_country", exchangeRate.product_country);
      setValue("rate", exchangeRate.rate);
      // Convert the effective_date to a "YYYY-MM" string if needed:
      if (exchangeRate.effective_date) {
        setValue("effective_date", exchangeRate.effective_date.substring(0, 7));
      }
    }
  }, [exchangeRate, setValue]);

  const onSubmitHandler = async (data) => {
    // If the effective_date is in "YYYY-MM" format, append "-01"
    if (data.effective_date && data.effective_date.length === 7) {
      data.effective_date = data.effective_date + "-01";
    }
    try {
      if (id) {
        await updateExchangeRate(id, data);
      } else {
        await createExchangeRate(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return { handleSubmit, control, errors, isSubmitting, onSubmit: onSubmitHandler, exchangeRate };
};
