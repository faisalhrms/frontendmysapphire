import React, { useEffect, useMemo, useState, useCallback, forwardRef, useImperativeHandle } from "react"
import LoadingSpinner from "@components/LoadingSpinner.jsx"
import { useForm } from "react-hook-form"
import { Save, Calculator, Ruler, Package, Forward, TextSearch, ClipboardList } from "lucide-react"
import { matchCustomerItems } from "@modules/customer-hub/customer-orders/services/CustomerHubMailService.js"
import SelectCustomerItemModal from "@modules/customer-hub/customer-orders/components/SelectCustomerItemModal.jsx"
import YarnConsumptionModal from "@modules/customer-hub/customer-orders/components/YarnConsumptionModal.jsx"
import FormInput from "@components/form/FormInput.jsx"
import { createAgreement, submitAgreement, updateAgreement, getAgreement, findAgreementByEmail, getApprovalActivity } from "@modules/customer-hub/customer-orders/services/AgreementService.js"
import FormSelect from "@components/form/FormSelect.jsx"
import { AGREEMENT_TYPES } from "@modules/customer-hub/customer-orders/components/AgreementPlacementModal.jsx"

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
const dateToYMD = (d) => { if (!d) return null; const dt = d instanceof Date ? d : new Date(d); if (isNaN(dt)) return null; const y = dt.getFullYear(); const m = String(dt.getMonth() + 1).padStart(2, "0"); const dd = String(dt.getDate()).padStart(2, "0"); return `${y}-${m}-${dd}` }

export const AgreementPlacementForm = forwardRef(({ active, seed = {}, email, showHeader = true, onSave, actionsSlot, disableSubmit = false }, ref) => {
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
      selected_item_code: "",
      yarn_dyed_or_greige: seed.yarn_dyed_or_greige || seed.item_type || "",
      greige_item_code: seed.greige_item_code || seed.greige_item || ""
    }
  })

  const [choices, setChoices] = useState([])
  const [open, setOpen] = useState(false)
  const [matching, setMatching] = useState(false)
  const [statusMsg, setStatusMsg] = useState("")
  const [selectedItem, setSelectedItem] = useState(null)
  const [showYarn, setShowYarn] = useState(false)
  const [saving, setSaving] = useState(false)
  const [agreementId, setAgreementId] = useState(seed?.id || null)
  const [approvalOpen, setApprovalOpen] = useState(false)
  const [approvalActivity, setApprovalActivity] = useState(null)
  const [agreementMeta, setAgreementMeta] = useState({ status: seed.status, current_approver_name: null })

  const hydrateFromAgreement = useCallback((ag) => {
    const p = ag?.payload || {}
    setAgreementId(ag?.id || null)
    setAgreementMeta({ status: ag?.status, current_approver_name: ag?.current_approver_name || null })
    setValue("agreement_no", ag?.agreement_no ?? "")
    setValue("agreement_type", p?.agreement_type ?? "")
    setValue("fabric_detail", ag?.item_description ?? p?.fabric_detail ?? "")
    setValue("construction", p?.construction ?? "")
    setValue("warp_blend", p?.warp_blend ?? "")
    setValue("weft_blend", p?.weft_blend ?? "")
    setValue("width_inches", p?.width_inches ?? "")
    setValue("width_cm", ag?.width ?? p?.width_cm ?? "")
    setValue("total_meters", p?.total_meters ?? "")
    setValue("warp_yarn_rate", p?.warp_yarn_rate ?? "")
    setValue("weft_yarn_rate", p?.weft_yarn_rate ?? "")
    setValue("warp_delivery", p?.warp_delivery ? normalizeDateSeed(p.warp_delivery) : "")
    setValue("weft_delivery", p?.weft_delivery ? normalizeDateSeed(p.weft_delivery) : "")
    setValue("dyed_warp_bags", p?.dyed_warp_bags ?? "")
    setValue("dyed_weft_bags", p?.dyed_weft_bags ?? "")
    setValue("ecru_warp_bags", p?.ecru_warp_bags ?? "")
    setValue("ecru_weft_bags", p?.ecru_weft_bags ?? "")
    setValue("dyed_bags", p?.dyed_bags ?? "")
    setValue("ecru_bags", p?.ecru_bags ?? "")
    setValue("total_bags", p?.total_bags ?? "")
    setValue("selected_item_code", p?.selected_item_code ?? "")
    setValue("yarn_dyed_or_greige", p?.yarn_dyed_or_greige || ag?.item_type || "")
    setValue("greige_item_code", p?.greige_item_code || "")
    setValue("fabric_delivery", ag?.start_date ? normalizeDateSeed(ag.start_date) : (p?.fabric_delivery ? normalizeDateSeed(p.fabric_delivery) : ""))
    setValue("need_by_date", ag?.end_date ? normalizeDateSeed(ag.end_date) : (p?.need_by_date ? normalizeDateSeed(p.need_by_date) : ""))
  }, [setValue])

  useEffect(() => {
    setValue("agreement_no", getValues("agreement_no") || (seed.agreement_no != null ? String(seed.agreement_no) : ""))
    setValue("agreement_type", getValues("agreement_type") || (seed.type != null ? String(seed.type) : ""))
    setValue("fabric_detail", getValues("fabric_detail") || (seed.description ?? ""))
    setValue("width_inches", getValues("width_inches") || (seed.width_inches ?? ""))
    setValue("width_cm", getValues("width_cm") || (seed.width ?? seed.width_cm ?? ""))
    setValue("need_by_date", normalizeDateSeed(seed.need_by_date))
    setValue("fabric_delivery", normalizeDateSeed(seed.fabric_delivery))
  }, [seed, getValues, setValue])

  useEffect(() => {
    if (seed?.id) setAgreementId(seed.id)
  }, [seed?.id])

  useEffect(() => {
    if (seed?.id) {
      ;(async () => {
        const fresh = await getAgreement(seed.id)
        if (fresh?.id) {
          hydrateFromAgreement(fresh)
          const act = await getApprovalActivity(fresh.id)
          setApprovalActivity(act)
        } else {
          hydrateFromAgreement(seed)
        }
      })()
    }
  }, [seed?.id, hydrateFromAgreement])

  useEffect(() => {
    const tryHydrate = async () => {
      if (agreementId) return
      const eid = email?.id || null
      if (!eid) return
      const an = getValues("agreement_no") || (seed.agreement_no ?? "")
      if (!an) return
      try {
        const ag = await findAgreementByEmail({ email_id: eid, agreement_no: an })
        if (ag && ag.id) {
          hydrateFromAgreement(ag)
          const act = await getApprovalActivity(ag.id)
          setApprovalActivity(act)
        }
      } catch {}
    }
    tryHydrate()
  }, [email, agreementId, seed.agreement_no, getValues, hydrateFromAgreement])

  const qc = (seed.quality_code || seed.quality || "").toString().trim()
  const design = (seed.design || seed.greige_design || seed.finished_design_description || "").toString().trim()
  const color = (seed.color || seed.colour || seed.greige_color || seed.finished_color_description || "").toString().trim()
  const widthSeed = (seed.width || seed.width_cm || seed.finished_width_cm || seed.width_inches || "").toString().trim()

  const applyItem = (item) => {
    setSelectedItem(item)
    setValue("fabric_detail", item.finished_design_description || item.greige_design || getValues("fabric_detail") || "")
    setValue("construction", item.fab_construction || getValues("construction") || "")
    setValue("warp_blend", item.warp_blend || getValues("warp_blend") || "")
    setValue("weft_blend", item.weft_blend || getValues("weft_blend") || "")
    setValue("width_inches", item.finished_width_inches || getValues("width_inches") || "")
    setValue("width_cm", item.finished_width_cm || getValues("width_cm") || "")
    setValue("selected_item_code", item.processed_item_code || getValues("selected_item_code") || "")
    setValue("yarn_dyed_or_greige", item.warp_weft_dyed || item.yarn_dyed_or_greige || getValues("yarn_dyed_or_greige") || "")
    setValue("greige_item_code", item.greige_item_code || item.greige_item || getValues("greige_item_code") || "")
  }

  const fetchMatches = async () => {
    if (!active) return
    if (!qc && !design && !color && !widthSeed) return
    setMatching(true)
    setStatusMsg("")
    try {
      const list = await matchCustomerItems({ quality_code: qc, design, color, width: widthSeed })
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

  useEffect(() => { fetchMatches() }, [active, qc, design, color, widthSeed])

  const handleComputed = useCallback((res) => {
    const dyedFlag = /yarn\s*dyed|warp\s*weft\s*dyed/i.test((watch("yarn_dyed_or_greige") || selectedItem?.yarn_dyed_or_greige || ""))
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
  }, [selectedItem, setValue, watch])

  const handleSave = async (mode = "draft") => {
    setSaving(true)
    try {
      const v = getValues()
      const greigeCode = v.greige_item_code || selectedItem?.greige_item_code || seed.greige_item_code || seed.greige_item || ""
      const processedCode = v.selected_item_code || selectedItem?.processed_item_code || seed.processed_item_code || seed.item_no || seed.item_code || ""
      const preferGreige = /greige/i.test(v.yarn_dyed_or_greige || selectedItem?.yarn_dyed_or_greige || seed.item_type || "")
      const topItemNo = preferGreige ? (greigeCode || processedCode) : (processedCode || greigeCode)
      const topItemType = v.yarn_dyed_or_greige || selectedItem?.yarn_dyed_or_greige || seed.item_type || selectedItem?.process_type || seed.process_type || null
      const topQuality = (seed.quality_code || seed.quality || selectedItem?.quality_code || "").toString().trim()
      const topDesign = (seed.design || seed.greige_design || seed.finished_design_description || "").toString().trim()
      const topColour = (seed.color || seed.colour || seed.greige_color || seed.finished_color_description || "").toString().trim()
      const topWidth = v.width_cm || v.width_inches || (seed.width || seed.width_cm || seed.finished_width_cm || seed.width_inches || "").toString().trim()
      const base = {
        owner: email?.from_name || email?.from_address || null,
        agreement_no: v.agreement_no || "",
        item_no: topItemNo || null,
        colour: topColour || null,
        item_type: topItemType || null,
        start_date: dateToYMD(v.fabric_delivery),
        vmi_po: null,
        item_description: v.fabric_detail || "",
        quality: topQuality || null,
        design: topDesign || null,
        width: topWidth || "",
        vendor_design: seed.vendor_design || null,
        description: v.fabric_detail || "",
        agreed_min_qty: null,
        log_agreed_min_qty: null,
        agreed_max_qty: null,
        log_agreed_max_qty: null,
        end_date: dateToYMD(v.need_by_date),
        log_end_date: null,
        email_id: email?.id || null,
        source: email ? "email" : "manual",
        payload: {
          ...v,
          selected_item_code: processedCode || "",
          greige_item_code: greigeCode || "",
          yarn_dyed_or_greige: v.yarn_dyed_or_greige || selectedItem?.yarn_dyed_or_greige || "",
          fabric_delivery: dateToYMD(v.fabric_delivery),
          need_by_date: dateToYMD(v.need_by_date)
        }
      }
      let saved
      if (agreementId) saved = await updateAgreement(agreementId, base)
      else saved = await createAgreement(base)
      const id = saved?.id || saved?.data?.id || saved?.agreement?.id || agreementId
      if (!agreementId && id) setAgreementId(id)
      if (id && mode === "submitted") {
        await submitAgreement(id)
        const fresh = await getAgreement(id)
        hydrateFromAgreement(fresh)
        const act = await getApprovalActivity(id)
        setApprovalActivity(act)
      } else if (id) {
        const fresh = await getAgreement(id)
        hydrateFromAgreement(fresh)
      }
      if (onSave) onSave(saved)
      return saved
    } finally {
      setSaving(false)
    }
  }

  useImperativeHandle(ref, () => ({
    saveDraft: () => handleSave("draft"),
    submit: () => handleSave("submitted"),
    getValues: () => getValues()
  }))

  const statusBadge = () => {
    const s = agreementMeta.status
    if (!s) return null
    const cls = s === "approved" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
      : s === "under_approval" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
      : s === "rejected" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300"
      : "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white/80"
    return <span className={`px-2 py-1 rounded-full text-xs ${cls}`}>{s.replace("_"," ")}</span>
  }

  return (
    <div className="rounded-xl border dark:border-defaultborder/20 bg-white dark:bg-bodybg shadow-sm overflow-hidden mb-5 relative">
      {showHeader && (
        <div className="px-4 py-2.5 border-b dark:border-defaultborder/20 flex items-center justify-between">
          <div className="font-semibold text-[.95rem]">Airjet Costing</div>
          <div className="flex items-center gap-2">
            {statusBadge()}
            {agreementMeta.current_approver_name ? <span className="text-xs opacity-70">Pending: {agreementMeta.current_approver_name}</span> : null}
            <button type="button" onClick={() => setApprovalOpen(true)} className="ti-btn ti-btn-light !mb-0 h-7 px-2 !text-[0.75rem] inline-flex items-center gap-1 rounded-full">
              <ClipboardList size={16} /> Activity
            </button>
          </div>
        </div>
      )}
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
                    <Chip k="Width" v={widthSeed} />
                  </div>
                </div>
                <button onClick={fetchMatches} className="ti-btn ti-btn-primary !py-1 !px-2 !text-[0.75rem]"><TextSearch size={16} /> Search again</button>
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
                <FormSelect name="agreement_type" control={control} errors={errors} options={AGREEMENT_TYPES} placeholder="Agreement Types" />
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
              <div className="hidden">
                <FormInput name="yarn_dyed_or_greige" control={control} errors={errors} placeholder="" label={false} />
              </div>
              <div className="hidden">
                <FormInput name="greige_item_code" control={control} errors={errors} placeholder="" label={false} />
              </div>
              <div className="col-span-12 flex justify-end gap-2 pt-2">
                {actionsSlot ? actionsSlot : (
                  <>
                    <button type="button" onClick={() => handleSave("draft")} disabled={saving || matching} className="ti-btn ti-btn-secondary !mb-0 inline-flex items-center gap-2 text-sm">
                      <Save size={16} /> Save
                    </button>
                    <button type="button" onClick={() => handleSave("submitted")} disabled={disableSubmit || saving || matching || agreementMeta.status === "under_approval" || agreementMeta.status === "approved"} className="ti-btn ti-btn-success !mb-0 inline-flex items-center gap-2 text-sm">
                      <Forward size={16} /> Submit
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-7">
            <div className="md:sticky md:top-24 rounded-xl border border-slate-200/80 dark:border-white/10 overflow-hidden">
              <div className="px-4 py-2 border-b border-slate-200/70 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-[.75rem]">Item Code</div>
                  <span className="text-[.7rem] px-2 py-1 rounded-full bg-slate-700/5 dark:bg-white/10">{watch("greige_item_code") || "-"}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Chip k="Quality" v={qc} />
                  <Chip k="Design" v={design} />
                  <Chip k="Color" v={color} />
                  <Chip k="Width" v={widthSeed} />
                  <Chip k="Type" v={watch("yarn_dyed_or_greige")} />
                </div>
              </div>

              <div className="p-4 space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <Stat Icon={Ruler} label="Width (In)" value={watch("width_inches") || "-"} />
                  <Stat Icon={Ruler} label="Width (Cm)" value={watch("width_cm") || "-"} />
                </div>

                <div>
                  <div className="text-[.7rem] uppercase tracking-wide opacity-60 mb-2">Yarn Bags</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-slate-200/70 dark:border-white/10 bg-white/60 dark:bg-white/5"><KV k="Warp Dyed Bags" v={watch("dyed_warp_bags")} /></div>
                    <div className="rounded-lg border border-slate-200/70 dark:border-white/10 bg-white/60 dark:bg-white/5"><KV k="Warp Ecru Bags" v={watch("ecru_warp_bags")} /></div>
                    <div className="rounded-lg border border-slate-200/70 dark:border-white/10 bg-white/60 dark:bg-white/5"><KV k="Weft Dyed Bags" v={watch("dyed_weft_bags")} /></div>
                    <div className="rounded-lg border border-slate-200/70 dark:border-white/10 bg-white/60 dark:bg-white/5"><KV k="Weft Ecru Bags" v={watch("ecru_weft_bags")} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <Stat Icon={Package} label="Total Dyed" value={watch("dyed_bags") || 0} />
                    <Stat Icon={Package} label="Total Ecru" value={watch("ecru_bags") || 0} />
                  </div>
                </div>

                <div>
                  <div className="text-[.7rem] uppercase tracking-wide opacity-60 mb-2">Fabric</div>
                  <div className="rounded-xl border border-slate-200/70 dark:border-white/10 divide-y divide-slate-200/70 dark:divide-white/10 bg-white/60 dark:bg-white/5">
                    <KV k="Fabric Detail" v={watch("fabric_detail") || seed.description} />
                    <KV k="Construction" v={watch("construction")} />
                    <KV k="Warp Blend" v={watch("warp_blend")} />
                    <KV k="Weft Blend" v={watch("weft_blend")} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {approvalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-bodybg rounded-xl shadow-xl w-full max-w-2xl">
            <div className="px-4 py-3 border-b dark:border-white/10 flex items-center justify-between">
              <div className="font-semibold text-sm">Approval Activity</div>
              <button className="ti-btn ti-btn-light !mb-0 h-7 px-2 !text-[0.75rem]" onClick={() => setApprovalOpen(false)}>Close</button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center gap-2 mb-3">
                {statusBadge()}
                {approvalActivity?.current_approver_name ? <span className="text-xs opacity-70">Pending: {approvalActivity.current_approver_name}</span> : null}
              </div>
              <div className="space-y-3">
                {(approvalActivity?.actions || []).map(a => (
                  <div key={a.id} className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full mt-2 bg-slate-400" />
                    <div className="flex-1">
                      <div className="text-sm font-medium capitalize">{a.action} <span className="opacity-60 text-xs">L{a.level}</span></div>
                      <div className="text-xs opacity-70">{new Date(a.created_at).toLocaleString()}</div>
                      {a.remarks ? <div className="text-xs mt-1">{a.remarks}</div> : null}
                    </div>
                  </div>
                ))}
                {!approvalActivity?.actions?.length ? <div className="text-sm opacity-70">No activity yet</div> : null}
              </div>
            </div>
          </div>
        </div>
      )}

      <SelectCustomerItemModal open={open} onClose={() => setOpen(false)} choices={choices} queryMeta={{ quality_code: qc, design, color, width: widthSeed }} onUse={(item) => { applyItem(item); setOpen(false) }} />

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
})
AgreementPlacementForm.displayName = "AgreementPlacementForm"
export default AgreementPlacementForm
