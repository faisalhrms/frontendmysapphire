import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ROADMAP_SETUP } from "@modules/road-map/routes.js";
import {
  createSupplier,
  getSupplierById,
  updateSupplier
} from "@modules/road-map/setup/suppliers/services/SupplierService.js";

export const useSupplier = id => {
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);
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
      certificates: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "certificates"
  });

  const fetchSupplier = async id => {
    const res = await getSupplierById(id);
    setSupplier(res.data);
  };

  useEffect(() => {
    if (id) fetchSupplier(id);
  }, [id]);

  useEffect(() => {
    if (!supplier) return;

    setValue("name", supplier.name);
    setValue("business_unit", supplier.business_unit);

    if (Array.isArray(supplier.certificates)) {
      setValue(
        "certificates",
        supplier.certificates.map(c => ({
          certificateType:        c.certificate.certificate_type.id,
          certificateType_label:  c.certificate.certificate_type.name,
          certificateList:        c.certificate.id,
          certificateList_label:  c.certificate.name,
          optionType:             c.status,
          expiryDate:             c.expiry_date,
          attachment:             c.media_id || c.media?.id || null,
          mediaUrl:               c.media?.file_url || ""

        }))
      );
    }
  }, [supplier, setValue]);

  const onSubmitHandler = async data => {
    if (id) await updateSupplier(id, { supplier: data });
    else   await createSupplier({ supplier: data });
    navigate(`${ROADMAP_SETUP.READ.path}?tab=supplier`);
  };

  return {
    handleSubmit,
    control,
    errors,
    isSubmitting,
    onSubmit: onSubmitHandler,
    watch,
    fields,
    append,
    remove,
    setValue
  };
};
