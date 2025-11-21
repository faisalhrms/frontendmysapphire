import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import FormButton from "@components/form/FormButton.jsx";
import Notify from "@helpers/toastNotifications.js";

import { MASTER_DATA, SIZING_COST } from "@modules/customer-hub/routes.js";
import {
  createSizing,
  getSizingById,
  updateSizing,
} from "@modules/customer-hub/master-data/sizing-cost/services/SizingCostService.js";

import TwoThumbRange from "@modules/customer-hub/master-data/components/TwoThumbRange.jsx";

const MIN_LIMIT = 1;
const MAX_LIMIT = 200;

const SizingCostForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state?.id;

  const [isSpecial, setIsSpecial] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    defaultValues: {
      warp_min: 7,
      warp_max: 24,
      sizing_cost: "30.00",
      special_criteria: "",
    },
  });

  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = await getSizingById(id);
      const data = res?.data || {};
      setValue("warp_min", data.warp_min ?? 7);
      setValue("warp_max", data.warp_max ?? 24);
      setValue("sizing_cost", data.sizing_cost ?? "0.00");
      setValue("special_criteria", data.special_criteria ?? "");
      setIsSpecial(!!data.special_criteria);
    })();
  }, [id, setValue]);

  const warpMin = watch("warp_min");
  const warpMax = watch("warp_max");
  const rangeLabel = useMemo(() => {
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(warpMin)}-${pad(warpMax)}`;
  }, [warpMin, warpMax]);

  const onSubmit = async (data) => {
    if (!isSpecial && Number(data.warp_min) > Number(data.warp_max)) {
      return Notify.error("Min cannot be greater than Max");
    }

    const payload = {
      sizing_cost: data.sizing_cost,
    };

    if (isSpecial) {
      if (!data.special_criteria) {
        return Notify.error("Special criteria is required");
      }
      payload.special_criteria = data.special_criteria;
    } else {
      payload.warp_min = Number(data.warp_min);
      payload.warp_max = Number(data.warp_max);
    }

    if (id) await updateSizing(id, payload);
    else await createSizing(payload);
    navigate(`${MASTER_DATA.READ.path}?tab=sizing-cost`);
  };

  return (
    <div>
      <PageHeader
        currentpage={id ? "Edit Sizing Cost" : "Add Sizing Cost"}
        activepage="Sizing Cost"
        mainpage={id ? "Edit Sizing Cost" : "Add Sizing Cost"}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-6">
          <div className="xxl:col-span-7 xl:col-span-8 lg:col-span-8 col-span-12">
            <div className="box">
              <div className="box-header">
                <div className="box-title">{id ? "Edit Cost" : "Add Cost"}</div>
              </div>

              <div className="box-body space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      id="is_special"
                      type="checkbox"
                      className="ti-form-checkbox"
                      checked={isSpecial}
                      onChange={(e) => setIsSpecial(e.target.checked)}
                    />
                    <label htmlFor="is_special" className="form-label mt-2">
                      Use special criteria instead of range
                    </label>
                  </div>
                </div>

                {!isSpecial && (
                  <div>
                    <label className="form-label">Warp Count Range</label>
                    <div className="rounded-md border p-4">
                      <Controller
                        name="warp_min"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: minField }) => (
                          <Controller
                            name="warp_max"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: maxField }) => (
                              <TwoThumbRange
                                min={MIN_LIMIT}
                                max={MAX_LIMIT}
                                step={1}
                                values={[Number(minField.value), Number(maxField.value)]}
                                onChange={([min, max]) => {
                                  const lo = Math.min(min, max);
                                  const hi = Math.max(min, max);
                                  minField.onChange(lo);
                                  maxField.onChange(hi);
                                }}
                              />
                            )}
                          />
                        )}
                      />
                      <div className="mt-3 text-xs text-slate-500">
                        Selected:{" "}
                        <span className="font-semibold text-slate-700">
                          {rangeLabel}
                        </span>
                      </div>
                      {(errors.warp_min || errors.warp_max) && (
                        <div className="text-rose-500 text-xs mt-1">
                          Please select a valid range.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {isSpecial && (
                  <div>
                    <label className="form-label">Special Criteria</label>
                    <Controller
                      name="special_criteria"
                      control={control}
                      rules={{
                        validate: (v) =>
                          !isSpecial || (v && v.trim().length > 0) || "Required",
                      }}
                      render={({ field }) => (
                        <input
                          type="text"
                          placeholder="e.g. 30"
                          className="form-control w-full !rounded-sm"
                          {...field}
                        />
                      )}
                    />
                    {errors.special_criteria && (
                      <div className="text-rose-500 text-xs mt-1">
                        {errors.special_criteria.message}
                      </div>
                    )}
                    <div className="text-xs text-slate-500 mt-1">
                      For your example, enter 30 here and cost 90 below.
                    </div>
                  </div>
                )}

                <div>
                  <label className="form-label">Sizing Cost PKR (per unit)</label>
                  <Controller
                    name="sizing_cost"
                    control={control}
                    rules={{ required: "Required" }}
                    render={({ field }) => (
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="e.g. 30.00"
                        className="form-control w-full !rounded-sm"
                        {...field}
                      />
                    )}
                  />
                  {errors.sizing_cost && (
                    <div className="text-rose-500 text-xs mt-1">
                      {errors.sizing_cost.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 border-t sm:flex justify-end">
                <FormButton isLoading={isSubmitting} type="submit" />
              </div>
            </div>
          </div>

          <div className="xxl:col-span-5 xl:col-span-4 lg:col-span-4 col-span-12">
            <div className="box">
              <div className="box-header">
                <div className="box-title">Guidelines</div>
              </div>
              <div className="box-body text-sm text-slate-600 space-y-3">
                <p>
                  Ranges are inclusive: <strong>[min, max]</strong>.
                </p>
                <p>Overlapping ranges are blocked by the server for data safety.</p>
                <p>Typical examples:</p>
                <ul className="list-disc ms-4">
                  <li>07–24 → 30.00</li>
                  <li>25–30 → 34.00</li>
                  <li>31–40 → 38.00</li>
                </ul>
                <p className="mt-2">
                  For special cases like warp 30 → 90.00, enable special criteria and set
                  criteria to 30 and cost to 90.00.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SizingCostForm;
