import React, { useEffect, useMemo, useState, useCallback } from "react"
import LoadingSpinner from "@components/LoadingSpinner.jsx"
import { useForm } from "react-hook-form"
import { Save, Calculator, Ruler, Package } from "lucide-react"
import { matchCustomerItems, saveAirjetCosting } from "@modules/customer-hub/customer-orders/services/CustomerHubMailService.js"
import SelectCustomerItemModal from "@modules/customer-hub/customer-orders/components/SelectCustomerItemModal.jsx"
import YarnConsumptionModal from "@modules/customer-hub/customer-orders/components/YarnConsumptionModal.jsx"
import FormInput from "@components/form/FormInput.jsx"

const Chip = ({ k, v }) => (v ? <span className="inline-flex items-center gap-1 rounded-full border dark:border-defaultborder/20 px-2 py-1 text-xs"><span className="opacity-70">{k}:</span><span className="font-medium">{v}</span></span> : null)
const KV = ({ k, v }) => <div className="flex items-center justify-between py-2 px-3"><span className="text-gray-600 dark:text-white/70 truncate">{k}</span><span className="font-medium">{v ?? "-"}</span></div>
const Stat = ({ Icon, label, value }) => (
  <div className="rounded-xl border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900/5 dark:bg-white/10"><Icon size={16} /></span>
      <span className="text-[.8rem] opacity-70">{label}</span>
    </div>
    <span className="text-lg font-semibold">{value ?? "-"}</span>
  </div>
)
const normalizeDateSeed = (v) => { if (!v) return ""; if (v instanceof Date && !isNaN(v.getTime())) return v; if (typeof v === "number") { const d = new Date(v); return isNaN(d.getTime()) ? "" : d } let s = String(v).trim(); if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(s + "T00:00:00Z"); if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}(:\d{2})?$/.test(s)) s = s.replace(" ", "T"); const d = new Date(s); return isNaN(d.getTime()) ? "" : d }
const r2 = (n) => Number((+n || 0).toFixed(2))

const AgreementPlacementForm = ({ active, seed = {}, email, showHeader = true, onSave }) => {
  const { control, setValue, getValues, watch, formState: { errors } } = useForm({
    defaultValues: {
      agreement_no: seed.agreement_no ?? "",
      total_meters: seed.total_meters ?? "",
      agreement_type: seed.type ?? "",
      fabric_delivery: normalizeDateSeed(seed.fabric_delivery),
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
    setValue("fabric_delivery", normalizeDateSeed(seed.fabric_delivery))
  }, [seed, getValues, setValue])

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
    if (!active) return
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

  useEffect(() => { fetchMatches() }, [active, qc, design, color, width])

  const payload = useMemo(() => ({ ...getValues(), email }), [watch(), email])

  const handleComputed = useCallback((res) => {
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
  }, [selectedItem, setValue])

  const handleSave = async () => {
    const data = { ...getValues(), email }
    const res = onSave ? await onSave(data) : await saveAirjetCosting(data)
    return res
  }

  const w = watch()

  return (
    <div className="rounded-xl border dark:border-defaultborder/20 bg-white dark:bg-bodybg shadow-sm overflow-hidden mb-5 relative">
      {showHeader && <div className="px-4 py-2.5 border-b dark:border-defaultborder/20 font-semibold text-[.95rem]">Airjet Costing</div>}
      {matching && (
        <div className="absolute inset-0 bg-white/60 dark:bg-black/30 backdrop-blur-sm flex items-center justify-center z-10">
          <LoadingSpinner />
        </div>
      )}

      <div className="p-4">
        {!matching && statusMsg ? (
          <div className="rounded-xl border dark:border-defaultborder/20 overflow-hidden mb-4">
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

        <div className="grid grid-cols-12 gap-12">
          <div className="col-span-12 md:col-span-6 xl:col-span-5">
  <div className="grid grid-cols-12 gap-4">
    <div className="col-span-12 md:col-span-6">
      <FormInput name="agreement_no" control={control} errors={errors} placeholder="Agreement No." />
    </div>
    <div className="col-span-12 md:col-span-6">
      <FormInput name="agreement_type" control={control} errors={errors} placeholder="Agreement Type" />
    </div>

    <div className="col-span-12 md:col-span-6">
      <FormInput name="fabric_delivery" control={control} errors={errors} placeholder="Fabric Delivery" type="date" />
    </div>
    <div className="col-span-12 md:col-span-6">
      <FormInput name="need_by_date" control={control} errors={errors} placeholder="Need By Date" type="date" />
    </div>

    <div className="col-span-12">
      <label className="form-label flex items-center justify-between">
        <span>Total Meters</span>
        <button type="button" onClick={() => setShowYarn(true)} className="ti-btn ti-btn-primary !mb-0 h-6 px-2 !text-[0.7rem] inline-flex items-center gap-1 rounded-full">
          <Calculator size={14} /> Yarn Consumption
        </button>
      </label>
      <FormInput name="total_meters" label={false} control={control} errors={errors} placeholder="Total Meters" type="number" />
    </div>

    <div className="col-span-12">
      <div className="rounded-xl ring-2 ring-violet-300/60 dark:ring-violet-700 p-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6">
            <FormInput name="warp_yarn_rate" control={control} errors={errors} placeholder="Warp Yarn Rate" type="number" />
          </div>
          <div className="col-span-12 md:col-span-6">
            <FormInput name="warp_delivery" control={control} errors={errors} placeholder="Warp Delivery" type="date" />
          </div>
          <div className="col-span-12 md:col-span-6">
            <FormInput name="weft_yarn_rate" control={control} errors={errors} placeholder="Weft Yarn Rate" type="number" />
          </div>
          <div className="col-span-12 md:col-span-6">
            <FormInput name="weft_delivery" control={control} errors={errors} placeholder="Weft Delivery" type="date" />
          </div>
        </div>
      </div>
    </div>

    <div className="hidden">
      <FormInput name="selected_item_code" control={control} errors={errors} placeholder="" label={false} />
    </div>

    <div className="col-span-12 flex justify-end pt-2">
      <button type="button" onClick={handleSave} className="ti-btn ti-btn-success !mb-0 inline-flex items-center gap-2 text-sm">
        <Save size={16} /> Save
      </button>
    </div>
  </div>
</div>

          <div className="col-span-12 md:col-span-7">
            <div className="md:sticky md:top-24 rounded-xl border border-slate-200/80 dark:border-white/10 overflow-hidden">
              <div className="px-4 py-2 border-b border-slate-200/70 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-[.75rem]">Item Code</div>
                  <span className="text-[.7rem] px-2 py-1 rounded-full bg-slate-700/5 dark:bg-white/10">{w.selected_item_code || "-"}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Chip k="Quality" v={qc} />
                  <Chip k="Design" v={design} />
                  <Chip k="Color" v={color} />
                  <Chip k="Width" v={width} />
                </div>
              </div>

              <div className="p-4 space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <Stat Icon={Ruler} label="Width (In)" value={w.width_inches || "-"} />
                  <Stat Icon={Ruler} label="Width (Cm)" value={w.width_cm || "-"} />
                </div>

                <div>
                  <div className="text-[.7rem] uppercase tracking-wide opacity-60 mb-2">Fabric</div>
                  <div className="rounded-xl border border-slate-200/70 dark:border-white/10 divide-y divide-slate-200/70 dark:divide-white/10 bg-white/60 dark:bg-white/5">
                    <KV k="Fabric Detail" v={w.fabric_detail || seed.description} />
                    <KV k="Construction" v={w.construction} />
                    <KV k="Warp Blend" v={w.warp_blend} />
                    <KV k="Weft Blend" v={w.weft_blend} />
                  </div>
                </div>

                <div>
                  <div className="text-[.7rem] uppercase tracking-wide opacity-60 mb-2">Yarn Bags</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-slate-200/70 dark:border-white/10 bg-white/60 dark:bg-white/5"><KV k="Warp Dyed Bags" v={w.dyed_warp_bags} /></div>
                    <div className="rounded-lg border border-slate-200/70 dark:border-white/10 bg-white/60 dark:bg-white/5"><KV k="Warp Ecru Bags" v={w.ecru_warp_bags} /></div>
                    <div className="rounded-lg border border-slate-200/70 dark:border-white/10 bg-white/60 dark:bg-white/5"><KV k="Weft Dyed Bags" v={w.dyed_weft_bags} /></div>
                    <div className="rounded-lg border border-slate-200/70 dark:border-white/10 bg-white/60 dark:bg-white/5"><KV k="Weft Ecru Bags" v={w.ecru_weft_bags} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <Stat Icon={Package} label="Total Dyed" value={w.dyed_bags || 0} />
                    <Stat Icon={Package} label="Total Ecru" value={w.ecru_bags || 0} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
        onComputed={handleComputed}
      />
    </div>
  )
}

export default AgreementPlacementForm
