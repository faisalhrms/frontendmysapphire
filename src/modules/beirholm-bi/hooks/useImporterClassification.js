import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  createImporterClassification,
  getImporterClassificationById,
  updateImporterClassification
} from "@modules/beirholm-bi/services/importerClassificationService.js";

export const useImporterClassification = (id) => {
  const [importerClassification, setImporterClassification] = useState(null);
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      importer: "",
      classification: "",
      data_category: "",
      product_country: "",
      focus_buyers: ""
    }
  });

  const fetchImporterClassification = async (id) => {
    try {
      const res = await getImporterClassificationById(id);
      setImporterClassification(res);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchImporterClassification(id);
    }
  }, [id]);

  useEffect(() => {
    if (importerClassification) {
      setValue("importer", importerClassification.importer);
      setValue("classification", importerClassification.classification);
      setValue("focus_buyers", importerClassification.focus_buyers);
      setValue("data_category", importerClassification.data_category?.id);
      setValue("product_country", importerClassification.product_country);
    }
  }, [importerClassification, setValue]);

  const onSubmitHandler = async (data) => {
    try {
      if (id) {
        await updateImporterClassification(id, data);
      } else {
        await createImporterClassification(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return { handleSubmit, control, errors, isSubmitting, onSubmit: onSubmitHandler, importerClassification };
};
