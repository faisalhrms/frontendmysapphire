import React, { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { Save, Calculator } from "lucide-react"
import { matchCustomerItems, saveAirjetCosting } from "@modules/customer-hub/mail-app/services/CustomerHubMailService.js"
import SelectCustomerItemModal from "@modules/customer-hub/mail-app/components/SelectCustomerItemModal.jsx"
import YarnConsumptionModal from "@modules/customer-hub/mail-app/components/YarnConsumptionModal.jsx"
import FormInput from "@components/form/FormInput.jsx"

const Chip = ({ k, v }) => (v ? <span className="inline-flex items-center gap-1 rounded-full border dark:border-defaultborder/20 px-2 py-1 text-xs"><span className="opacity-70">{k}:</span><span className="font-medium">{v}</span></span> : null)
const normalizeDateSeed = (v) => { if (!v) return ""; if (v instanceof Date && !isNaN(v.getTime())) return v; if (typeof v === "number") { const d = new Date(v); return isNaN(d.getTime()) ? "" : d } let s = String(v).trim(); if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(s + "T00:00:00Z"); if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}(:\d{2})?$/.test(s)) s = s.replace(" ", "T"); const d = new Date(s); return isNaN(d.getTime()) ? "" : d }
const r2 = (n) => Number((+n || 0).toFixed(2))

const AgreementPlacementForm = ({ seed = {}, email, showHeader = true, onSave }) => {
  const { control, setValue, getValues, watch, formState: { errors } } = useForm({
    defaultValues: {
      agreement_no: seed.agreement_no ?? "",
      total_meters: seed.total_meters ?? "",
      agreement_type: seed.type ?? "",
      fabric_delivery: "",
      fabric_detail: seed.description ?? "",
      construction: "",
      warp_blend: "",
      weft_blend: "",
      dyed_bags: "",
      ecru_bags: "",
      dyed_warp_bags: "",
      dyed_weft_bags: "",
      ecru_warp_bags: "",
      ecru_weft_bags: "",
      warp_yarn_rate: "",
      weft_yarn_rate: "",
      warp_delivery: "",
      weft_delivery: "",
      width_inches: seed.width_inches ?? "",
      width_cm: seed.width ?? seed.width_cm ?? "",
      total_bags: "",
      need_by_date: normalizeDateSeed(seed.need_by_date),
      selected_item_code: ""
    }
  })

  const [choices, setChoices] = useState([])
  const [open, setOpen] = useState(false)
  const [matching, setMatching] = useState(false)
  const [statusMsg, setStatusMsg] = useState("")
  const [selectedItem, setSelectedItem] = useState(null)
  const [showYarn, setShowYarn] = useState(false)

  useEffect(() => {
    setValue("agreement_no", getValues("agreement_no") || (seed.agreement_no != null ? String(seed.agreement_no) : ""))
    setValue("agreement_type", getValues("agreement_type") || (seed.type != null ? String(seed.type) : ""))
    setValue("fabric_detail", getValues("fabric_detail") || (seed.description ?? ""))
    setValue("width_inches", getValues("width_inches") || (seed.width_inches ?? ""))
    setValue("width_cm", getValues("width_cm") || (seed.width ?? seed.width_cm ?? ""))
    setValue("need_by_date", normalizeDateSeed(seed.need_by_date))
  }, [seed])

  const qc = (seed.quality_code || seed.quality || "").toString().trim()
  const design = (seed.design || seed.greige_design || seed.finished_design_description || "").toString().trim()
  const color = (seed.color || seed.greige_color || seed.finished_color_description || "").toString().trim()
  const width = (seed.width || seed.width_cm || seed.finished_width_cm || seed.width_inches || "").toString().trim()

  const applyItem = (item) => {
    setSelectedItem(item)
    setValue("fabric_detail", item.finished_design_description || item.greige_design || getValues("fabric_detail") || "")
    setValue("construction", item.fab_construction || getValues("construction") || "")
    setValue("warp_blend", item.warp_blend || getValues("warp_blend") || "")
    setValue("weft_blend", item.weft_blend || getValues("weft_blend") || "")
    setValue("width_inches", item.finished_width_inches || getValues("width_inches") || "")
    setValue("width_cm", item.finished_width_cm || getValues("width_cm") || "")
    setValue("selected_item_code", item.processed_item_code || getValues("selected_item_code") || "")
  }

  const fetchMatches = async () => {
    if (!qc && !design && !color && !width) return
    setMatching(true)
    setStatusMsg("")
    try {
      const list = await matchCustomerItems({ quality_code: qc, design, color, width })
      if (!list.length) {
        setChoices([])
        setOpen(false)
        setStatusMsg("No matching item found")
      } else if (list.length === 1) {
        applyItem(list[0])
        setChoices([])
        setOpen(false)
        setStatusMsg("")
      } else {
        setChoices(list)
        setOpen(true)
        setStatusMsg("")
      }
    } finally {
      setMatching(false)
    }
  }

  useEffect(() => { fetchMatches() }, [seed])

  const payload = useMemo(() => ({ ...getValues(), email }), [watch(), email])

  const onYarnComputed = (res) => {
    const dyedFlag = /yarn\s*dyed/i.test(selectedItem?.yarn_dyed_or_greige || "")
    const warpDyed = dyedFlag ? res.warpWithRej : 0
    const weftDyed = dyedFlag ? res.weftWithRej : 0
    const warpEcru = r2(res.warpWithRej - warpDyed)
    const weftEcru = r2(res.weftWithRej - weftDyed)
    setValue("dyed_warp_bags", r2(warpDyed))
    setValue("dyed_weft_bags", r2(weftDyed))
    setValue("ecru_warp_bags", r2(warpEcru))
    setValue("ecru_weft_bags", r2(weftEcru))
    setValue("dyed_bags", r2(warpDyed + weftDyed))
    setValue("ecru_bags", r2(warpEcru + weftEcru))
    setValue("total_bags", r2(res.totalWithRej))
  }

  const handleSave = async () => {
    const data = { ...getValues(), email }
    const res = onSave ? await onSave(data) : await saveAirjetCosting(data)
    return res
  }

  return (
    <div className="rounded-xl border dark:border-defaultborder/20 bg-white dark:bg-bodybg shadow-sm overflow-hidden mb-5 relative">
      {showHeader && <div className="px-4 py-2.5 border-b dark:border-defaultborder/20 font-semibold text-[.95rem]">Airjet Costing</div>}

      <div className="p-4 space-y-4">
        {!matching && statusMsg ? (
          <div className="rounded-xl border dark:border-defaultborder/20 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-white/5 dark:via-white/5 dark:to-white/5 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[.95rem] font-semibold">No matching item found</div>
                  <div className="text-sm opacity-70">Refine search or fill details manually</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Chip k="Quality" v={qc} />
                    <Chip k="Design" v={design} />
                    <Chip k="Color" v={color} />
                    <Chip k="Width" v={width} />
                  </div>
                </div>
                <button onClick={fetchMatches} className="ti-btn ti-btn-primary !mb-0 text-sm">Search again</button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-3">
            <FormInput name="agreement_no" control={control} errors={errors} placeholder="Agreement" />
          </div>
          <div className="col-span-12 md:col-span-3">
            <FormInput name="agreement_type" control={control} errors={errors} placeholder="Agreement Type" />
          </div>
          <div className="col-span-12 md:col-span-3">
            <FormInput name="need_by_date" control={control} errors={errors} placeholder="Need By Date" type="date" />
          </div>
          <div className="col-span-12 md:col-span-3">
            <label className="form-label flex items-center justify-between">
              <span>Total Meters</span>
              <button type="button" onClick={() => setShowYarn(true)} className="ti-btn ti-btn-primary !mb-0 h-5 px-2 !text-[0.68rem] inline-flex items-center gap-1 rounded-full" title={"Yarn Consumption"}>
                <Calculator size={14} /> Yarn Consumption
              </button>
            </label>
            <FormInput name="total_meters" label={false} control={control} errors={errors} placeholder="Total Meters" type="number" />
          </div>

          <div className="col-span-6">
            <FormInput name="fabric_detail" control={control} errors={errors} placeholder="Fabric Detail" />
          </div>
          <div className="col-span-6">
            <FormInput name="construction" control={control} errors={errors} placeholder="Construction" />
          </div>

          <div className="col-span-12 grid grid-cols-12 gap-3 rounded-lg border dark:border-defaultborder/20 p-3">
            <div className="col-span-12 md:col-span-4">
              <FormInput name="warp_blend" control={control} errors={errors} placeholder="Warp Blend" />
            </div>
            <div className="col-span-6 md:col-span-2">
              <FormInput name="dyed_warp_bags" control={control} errors={errors} placeholder="Warp Dyed Bags" type="number" />
            </div>
            <div className="col-span-6 md:col-span-2">
              <FormInput name="ecru_warp_bags" control={control} errors={errors} placeholder="Warp Ecru Bags" type="number" />
            </div>
            <div className="col-span-6 md:col-span-2">
              <FormInput name="warp_yarn_rate" control={control} errors={errors} placeholder="Warp Yarn Rate" type="number" />
            </div>
            <div className="col-span-6 md:col-span-2">
              <FormInput name="warp_delivery" control={control} errors={errors} placeholder="Warp Delivery" />
            </div>
          </div>

          <div className="col-span-12 grid grid-cols-12 gap-3 rounded-lg border dark:border-defaultborder/20 p-3">
            <div className="col-span-12 md:col-span-4">
              <FormInput name="weft_blend" control={control} errors={errors} placeholder="Weft Blend" />
            </div>
            <div className="col-span-6 md:col-span-2">
              <FormInput name="dyed_weft_bags" control={control} errors={errors} placeholder="Weft Dyed Bags" type="number" />
            </div>
            <div className="col-span-6 md:col-span-2">
              <FormInput name="ecru_weft_bags" control={control} errors={errors} placeholder="Weft Ecru Bags" type="number" />
            </div>
            <div className="col-span-6 md:col-span-2">
              <FormInput name="weft_yarn_rate" control={control} errors={errors} placeholder="Weft Yarn Rate" type="number" />
            </div>
            <div className="col-span-6 md:col-span-2">
              <FormInput name="weft_delivery" control={control} errors={errors} placeholder="Weft Delivery" />
            </div>
          </div>

          <div className="col-span-12 grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-3">
              <FormInput name="width_inches" control={control} errors={errors} placeholder="Width (Inches)" type="number" />
            </div>
            <div className="col-span-12 md:col-span-3">
              <FormInput name="width_cm" control={control} errors={errors} placeholder="Width (Cm)" type="number" />
            </div>
            <div className="col-span-6 md:col-span-3">
              <FormInput name="dyed_bags" control={control} errors={errors} placeholder="Dyed Bags (Total)" type="number" />
            </div>
            <div className="col-span-6 md:col-span-3">
              <FormInput name="ecru_bags" control={control} errors={errors} placeholder="Ecru Bags (Total)" type="number" />
            </div>
          </div>

          <div className="hidden">
            <FormInput name="selected_item_code" control={control} errors={errors} placeholder="" label={false} />
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 z-20 bg-white/85 dark:bg-bodybg/85 backdrop-blur border-t dark:border-defaultborder/20 px-4 py-3 flex items-center justify-end gap-2">
        <button onClick={handleSave} className="ti-btn ti-btn-success !mb-0 inline-flex items-center gap-2 text-sm">
          <Save size={16} /> Save
        </button>
      </div>

      <SelectCustomerItemModal open={open} onClose={() => setOpen(false)} choices={choices} queryMeta={{ quality_code: qc, design, color, width }} onUse={(item) => { applyItem(item); setOpen(false) }} />

      <YarnConsumptionModal
        open={showYarn}
        onClose={() => setShowYarn(false)}
        item={selectedItem}
        totalMeters={watch("total_meters")}
        onTotalMetersChange={(v) => setValue("total_meters", v)}
        widthInches={watch("width_inches")}
        widthCm={watch("width_cm")}
        onComputed={(res) => {
          const dyedFlag = /yarn\s*dyed/i.test(selectedItem?.yarn_dyed_or_greige || "")
          const warpDyed = dyedFlag ? res.warpWithRej : 0
          const weftDyed = dyedFlag ? res.weftWithRej : 0
          const warpEcru = r2(res.warpWithRej - warpDyed)
          const weftEcru = r2(res.weftWithRej - weftDyed)
          setValue("dyed_warp_bags", r2(warpDyed))
          setValue("dyed_weft_bags", r2(weftDyed))
          setValue("ecru_warp_bags", r2(warpEcru))
          setValue("ecru_weft_bags", r2(weftEcru))
          setValue("dyed_bags", r2(warpDyed + weftDyed))
          setValue("ecru_bags", r2(warpEcru + weftEcru))
          setValue("total_bags", r2(res.totalWithRej))
        }}
      />
    </div>
  )
}

export default AgreementPlacementForm
