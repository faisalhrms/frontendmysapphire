import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { GREIGE_LEAD_TIMES, MASTER_DATA } from "@modules/customer-hub/routes.js";
import {
    createGreigeLeadTime,
    getGreigeLeadTimeById, updateGreigeLeadTime
} from "@modules/customer-hub/master-data/greige-lead-times/services/GreigeLeadTimeService.js";

export const useGreigeLeadTimeForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location?.state?.id;
  const [detail, setDetail] = useState(null);

  const { handleSubmit, control, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      vendor_no: "",
      main_group: "",
      quality_code: "",
      loom_type: "",
      fabric_type: "",
      lead_time_days: "",
    },
  });

  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = await getGreigeLeadTimeById(id);
      setDetail(res?.data);
    })();
  }, [id]);

  useEffect(() => {
    if (!detail) return;
    Object.entries(detail).forEach(([k, v]) => setValue(k, v ?? ""));
  }, [detail, setValue]);

  const onSubmit = async (data) => {
    if (id) {
      await updateGreigeLeadTime(id, data);
    } else {
      await createGreigeLeadTime(data);
    }
    navigate(`${MASTER_DATA.READ.path}?tab=greige-lead-times`);
  };

  return { id, handleSubmit, control, errors, isSubmitting, onSubmit, GREIGE_LEAD_TIMES };
};
