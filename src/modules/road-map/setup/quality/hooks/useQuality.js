import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ROADMAP_SETUP } from "@modules/road-map/routes.js";
import {
  createQuality,
  getQualityById,
  updateQuality
} from "@modules/road-map/setup/quality/services/QualityService.js";

export const useQuality = (id) => {
  const navigate = useNavigate();
  const [quality, setQuality] = useState(null);
  const [tdsFile, setTdsFile] = useState(null);
  const [removeTds, setRemoveTds] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const fileInputRef = useRef();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      code: "",
      business_unit: "",
      label_certificates: []
    }
  });

  useEffect(() => {
    if (!id) return;
    getQualityById(id)
      .then(res => {
        setQuality(res.data);
        if (res.data.tds_pdf_url) {
          setAttachment({
            url: res.data.tds_pdf_url,
            file_name: res.data.tds_pdf_original_name || res.data.tds_pdf_url.split("/").pop()
          });
        }
      })
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    if (quality) {
      setValue("code", quality.code);
      setValue("business_unit", quality.business_unit);
      setValue(
        "label_certificates",
        quality.label_certificates.map(c => c.id)
      );
    }
  }, [quality, setValue]);

  const handleFileChange = (e) => {
    setTdsFile(e.target.files[0]);
    setRemoveTds(false);
    setAttachment(null);
  };

  const handleRemoveAttachment = () => {
    setRemoveTds(true);
    setAttachment(null);
  };

  const onSubmitHandler = async (data) => {
    try {
      const formData = new FormData();
      formData.append("business_unit", data.business_unit);
      formData.append("code", data.code);
      data.label_certificates.forEach(certId =>
        formData.append("label_certificates", certId)
      );
      if (removeTds) {
        formData.append("tds_pdf", "");
      } else if (tdsFile) {
        formData.append("tds_pdf", tdsFile);
      }
      if (id) {
        await updateQuality(id, formData);
      } else {
        await createQuality(formData);
      }
      navigate(`${ROADMAP_SETUP.READ.path}?page=quality`);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    handleSubmit,
    control,
    errors,
    isSubmitting,
    onSubmit: onSubmitHandler,
    quality,
    attachment,
    fileInputRef,
    handleFileChange,
    handleRemoveAttachment
  };
};
