import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import {DYEING_CHARGES, MASTER_DATA} from "@modules/customer-hub/routes.js";
import {
    createDyeingCharge,
    getDyeingChargeById,
    updateDyeingCharge
} from "@modules/customer-hub/master-data/dyeing-charges/services/DyeingChargeService.js";

export const useDyeingChargeForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location?.state?.id;
  const [detail, setDetail] = useState(null);

  const { handleSubmit, control, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      quality_code: "",
      design_name: "",
      color_name: "",
      accumulative_charges: "",
      warp_charges: "",
      weft_charges: "",
      warp_coverage: "",
      weft_coverage: "",
      design_code: "",
      color_code: "",
      design: "",
      effective_date: ""
    }
  });

  const warp = watch("warp_charges");
  const weft = watch("weft_charges");
  const dcode = watch("design_code");
  const dname = watch("design_name");

  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = await getDyeingChargeById(id);
      setDetail(res?.data);
    })();
  }, [id]);

  useEffect(() => {
    if (!detail) return;
    Object.entries(detail).forEach(([k, v]) => setValue(k, v ?? ""));
  }, [detail, setValue]);

  useEffect(() => {
    const w = Number(warp || 0);
    const f = Number(weft || 0);
    setValue("accumulative_charges", w + f);
  }, [warp, weft, setValue]);

  useEffect(() => {
    const dn = (dname || "").toString().trim();
    const dc = (dcode || "").toString().trim();
    if (dn || dc) setValue("design", `${dn}${dn && dc ? "/" : ""}${dc}`);
  }, [dname, dcode, setValue]);

  const onSubmit = async (data) => {
    if (id) {
      await updateDyeingCharge(id, data);
    } else {
      await createDyeingCharge(data);
    }
    navigate(`${MASTER_DATA.READ.path}?tab=dyeing-charges`);
  };

  return { id, handleSubmit, control, errors, isSubmitting, onSubmit };
};
