// @modules/customer-hub/integrations/components/ApiIntegrationCard.jsx
import React, { useState } from "react";
import FormInput from "@components/form/FormInput.jsx";
import FormButton from "@components/form/FormButton.jsx";
import FormToggle from "@components/form/FormToggle.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";

const ApiIntegrationCard = ({ control, errors, itemsFA, handleSubmit, onSubmit, onTest }) => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  const doTest = async () => {
    setTesting(true);
    const r = await onTest();
    setResult(r || null);
    setTesting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="box">
        <div className="box-header">
          <div className="box-title">API Integration</div>
        </div>
        <div className="box-body space-y-6">
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="xl:col-span-4 col-span-12">
              <FormAsyncSelect
                label
                name="channel_id"
                control={control}
                errors={errors}
                placeholder="Channel"
                apiUrl="/select/integration/channels/?type=api&active=1"
                queryKeyBase="integration_channels_api"
              />
            </div>
            <div className="xl:col-span-2 col-span-6">
              <FormToggle name="preview" label control={control} errors={errors} placeholder="Preview" />
            </div>
            <div className="xl:col-span-6 col-span-12 flex items-center gap-2">
              <button type="button" onClick={doTest} className="ti-btn ti-btn-outline-primary !py-1 !px-2 !text-[0.75rem]" disabled={testing}>
                <i className="ri-wifi-line" />
              </button>
              {result && (
                <span className={`text-xs px-2 py-1 rounded ${result.ok ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
                  {result.ok ? "OK" : "Fail"} {typeof result.status === "number" ? `• ${result.status}` : ""} {result.latency_ms ? `• ${result.latency_ms}ms` : ""}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {itemsFA.fields.map((f,i)=>(
              <div key={f.id} className="p-3 border rounded-md bg-light/20 dark:bg-white/5">
                <div className="grid grid-cols-12 gap-2">
                  <div className="xl:col-span-3 col-span-12">
                    <FormInput name={`items.${i}.agreement_no`} control={control} errors={errors} placeholder="Agreement No" is_required />
                  </div>
                  <div className="xl:col-span-3 col-span-12">
                    <FormInput name={`items.${i}.item_no`} control={control} errors={errors} placeholder="Item No" />
                  </div>
                  <div className="xl:col-span-2 col-span-12">
                    <FormInput name={`items.${i}.type`} control={control} errors={errors} placeholder="Type" />
                  </div>
                  <div className="xl:col-span-2 col-span-12">
                    <FormInput name={`items.${i}.color`} control={control} errors={errors} placeholder="Color" />
                  </div>
                  <div className="xl:col-span-2 col-span-12">
                    <FormInput name={`items.${i}.width`} control={control} errors={errors} placeholder="Width" />
                  </div>
                  <div className="xl:col-span-3 col-span-12">
                    <FormInput name={`items.${i}.design`} control={control} errors={errors} placeholder="Design" />
                  </div>
                  <div className="xl:col-span-3 col-span-12">
                    <FormInput name={`items.${i}.quality`} control={control} errors={errors} placeholder="Quality" />
                  </div>
                  <div className="xl:col-span-3 col-span-12">
                    <FormInput type="date" name={`items.${i}.start_date`} control={control} errors={errors} placeholder="Start Date" />
                  </div>
                  <div className="xl:col-span-3 col-span-12">
                    <FormInput type="date" name={`items.${i}.end_date`} control={control} errors={errors} placeholder="End Date" />
                  </div>
                  <div className="xl:col-span-3 col-span-12">
                    <FormInput name={`items.${i}.vmi_po`} control={control} errors={errors} placeholder="VMI PO" />
                  </div>
                  <div className="xl:col-span-6 col-span-12">
                    <FormInput name={`items.${i}.description`} control={control} errors={errors} placeholder="Description"/>
                  </div>
                  <div className="xl:col-span-3 col-span-12">
                    <FormInput name={`items.${i}.vendor_design`} control={control} errors={errors} placeholder="Vendor Design" />
                  </div>
                  <div className="xl:col-span-12 col-span-12 flex justify-between">
                    <button type="button" onClick={()=>itemsFA.remove(i)} className="ti-btn ti-btn-outline-danger !py-1 !px-2 !text-[0.75rem]">
                      <i className="ri-delete-bin-6-line" />
                    </button>
                    <button type="button" onClick={()=>itemsFA.append({ agreement_no: "" })} className="ti-btn ti-btn-outline-primary !py-1 !px-2 !text-[0.75rem]">
                      <i className="ri-add-line" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {itemsFA.fields.length === 0 && (
              <button type="button" onClick={()=>itemsFA.append({ agreement_no: "" })} className="ti-btn ti-btn-outline-primary !py-1 !px-2 !text-[0.75rem]">
                <i className="ri-add-line" />
              </button>
            )}
          </div>
        </div>
        <div className="px-6 py-4 border-t sm:flex justify-end">
          <FormButton isLoading={false} type="submit" />
        </div>
      </div>
    </form>
  );
};

export default ApiIntegrationCard;
