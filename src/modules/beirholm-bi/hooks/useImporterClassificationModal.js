import { useState } from "react";
import { useForm } from "react-hook-form";
import { uploadImporterClassificationExcel } from "@modules/beirholm-bi/services/importerClassificationService.js";

export const useImporterClassificationModal = () => {
  const [importerClassification, setImporterClassification] = useState(null);
  const {
    handleSubmit,
    control,
    setValue,
    register,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      data_category: "",
      product_country: "",
      file: null
    }
  });

  const onSubmitHandler = async (data) => {
    const formData = new FormData();
    if (data.file && data.file.length > 0) {
      formData.append("file", data.file[0]);
    }
    formData.append("data_category", data.data_category);
    formData.append("product_country", data.product_country);
    try {
      await uploadImporterClassificationExcel(formData);
    } catch (error) {
      console.error(error);
    }
  };

  return { handleSubmit, control, register, errors, isSubmitting, onSubmit: onSubmitHandler, importerClassification };
};
