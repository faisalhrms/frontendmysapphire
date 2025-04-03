import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import DataSanitizeService from "@modules/beirholm-bi/services/DataSanitizeService.js";

export const useDataSanitize = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [job, setJob] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", data.file[0]); // file input
      if (data.data_category) {
        formData.append("data_category", data.data_category);
      }
      if (data.product_country) {
        formData.append("product_country", data.product_country);
      }
      const response = await DataSanitizeService.uploadRawFile(formData);
      setJob(response.job_id);
      reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let interval;
    if (job) {
      interval = setInterval(async () => {
        try {
          const statusResponse = await DataSanitizeService.getJobStatus(job);
          setJobStatus(statusResponse);
          if (
            statusResponse.status === "completed" ||
            statusResponse.status === "failed"
          ) {
            clearInterval(interval);
          }
        } catch (error) {
          console.error(error);
          clearInterval(interval);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [job]);

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    control,
    job,
    jobStatus,
    reset,
  };
};
