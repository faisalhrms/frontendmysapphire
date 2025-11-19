import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { CUSTOMER_ITEMS, MASTER_DATA } from "@modules/customer-hub/routes.js";
import {
    createCustomerItem,
    getCustomerItemById, updateCustomerItem
} from "@modules/customer-hub/master-data/customer-item-data/services/CustomerItemService.js";

export const useCustomerItemForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location?.state?.id;
  const [detail, setDetail] = useState(null);

  const { handleSubmit, control, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      customer_name: "",
      item_code_creation_date: "",
      greige_item_code: "",
      warp_count: "",
      weft_count: "",
      ends: "",
      picks: "",
      yarn_dyed_or_greige: "",
      quality_code: "",
      greige_design: "",
      greige_design_code: "",
      greige_color: "",
      greige_color_code: "",
      greige_width: "",
      selvedge: "",
      weave: "",
      stripe_size: "",
      fab_construction: "",
      warp_yarn_grade: "",
      warp_spin_method: "",
      warp_blend: "",
      weft_yarn_grade: "",
      weft_spin_method: "",
      weft_blend: "",
      weft_insertion_method: "",
      processed_item_code: "",
      finished_design_description: "",
      finished_design_code: "",
      finished_color_description: "",
      finished_color_code: "",
      finished_width_inches: "",
      finished_width_cm: "",
      process_route: "",
      process_code: "",
      warp_count_raw: "",
      weft_count_raw: ""
    }
  });

  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = await getCustomerItemById(id);
      setDetail(res?.data);
    })();
  }, [id]);

  useEffect(() => {
    if (!detail) return;
    Object.entries(detail).forEach(([k, v]) => setValue(k, v ?? ""));
  }, [detail, setValue]);

  const onSubmit = async (data) => {
    if (id) await updateCustomerItem(id, data);
    else await createCustomerItem(data);
    navigate(`${MASTER_DATA.READ.path}?tab=customer-items`);
  };

  return { id, handleSubmit, control, errors, isSubmitting, onSubmit };
};
