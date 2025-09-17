import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ROADMAP_SETUP } from "@modules/road-map/routes.js";
import { createUnit, getUnitById, updateUnit } from "@modules/road-map/setup/unit/services/UnitService.js";

export const useUnit = id => {
  const navigate = useNavigate();
  const [unit, setUnit] = useState(null);
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: "",
      business_unit: "",
      unit_category: "",
      is_in_house: true,
      certificates: []
    }
  });

  const fetchUnit = async id => {
    const res = await getUnitById(id);
    setUnit(res.data);
  };

  useEffect(() => {
    if (id) fetchUnit(id);
  }, [id]);

  useEffect(() => {
    if (!unit) return;
    setValue("name", unit.name);
    setValue("business_unit", unit.business_unit);
    setValue("is_in_house", unit.is_in_house);
    setValue("unit_category", unit.unit_category.id);
    if (Array.isArray(unit.certificates)) {
      setValue(
        "certificates",
        unit.certificates.map(c => ({
          certificateType: c.certificate.certificate_type.id,
          certificateType_label: c.certificate.certificate_type.name,
          certificateList: c.certificate.id,
          certificateList_label: c.certificate.name,
          optionType: c.status,
          expiryDate: c.expiry_date,
          attachment: c.media_id || c.media?.id || null,
          mediaUrl: c.media?.file_url || ""
        }))
      );
    }
  }, [unit, setValue]);

  const onSubmitHandler = async data => {
    const payload = {
      ...data,
      certificates: data.certificates.map(({ certificateList, optionType, expiryDate, attachment }) => ({
        certificateList,
        optionType,
        expiryDate: expiryDate || null,
        attachment: attachment || null
      }))
    };
    if (id) await updateUnit(id, { unit: payload });
    else await createUnit({ unit: payload });
    navigate(`${ROADMAP_SETUP.READ.path}?tab=unit`);
  };

  return {
    handleSubmit,
    control,
    errors,
    isSubmitting,
    onSubmit: onSubmitHandler,
    unit,
    watch,
    setValue
  };
};
