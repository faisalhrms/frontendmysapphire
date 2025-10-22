import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { createQualityWeaving, getQualityWeavingById, updateQualityWeaving } from "@modules/customer-hub/master-data/QualityWeaving/services/QualityWeavingService.js";
import {MASTER_DATA} from "@modules/customer-hub/routes.js";

export const useQualityWeavingForm = (editMode = false, qualityId = null) => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state?.id;
  const resolvedId = id ?? null;
  const resolvedEdit = editMode || Boolean(resolvedId);

  const { handleSubmit, control, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { quality_code: "", machine_type: "", loom_type: "", weft_method: "", process_type: "" }
  });

  useEffect(() => {
    if (!resolvedEdit || !resolvedId) return;
    (async () => {
      const res = await getQualityWeavingById(resolvedId);
      const d = res?.data?.data ?? res?.data ?? res ?? {};
      reset({
        quality_code: d.quality_code ?? "",
        machine_type: d.machine_type ?? "",
        loom_type: d.loom_type ?? "",
        weft_method: d.weft_method ?? "",
        process_type: d.process_type ?? ""
      });
    })();
  }, [resolvedEdit, resolvedId, reset, setValue]);

  const onSubmit = async (data) => {
    if (resolvedEdit && resolvedId) await updateQualityWeaving(resolvedId, data);
    else await createQualityWeaving(data);
    navigate(`${MASTER_DATA.READ.path}?tab=quality-weaving`);
  };

  return { control, errors, handleSubmit, onSubmit, isSubmitting, resolvedEdit };
};
