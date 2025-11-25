import React, { useMemo, useState } from "react"
import AgreementItemMeta from "@modules/customer-hub/customer-orders/components/agreement-placement/AgreementItemMeta.jsx"
import AgreementYarnBags from "@modules/customer-hub/customer-orders/components/agreement-placement/AgreementYarnBags.jsx"
import AgreementFabric from "@modules/customer-hub/customer-orders/components/agreement-placement/AgreementFabric.jsx"
import ApprovalActivityModal from "@modules/customer-hub/customer-orders/components/agreement-placement/ApprovalActivityModal.jsx"

const fieldValue = (v) => (v === null || v === undefined || v === "" ? "—" : v)

const formatDate = (v) => {
  if (!v) return "—"
  if (typeof v === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v
    const d = new Date(v)
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10)
    return v
  }
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  return String(v)
}

const AgreementPlacementReadOnly = ({ agreement }) => {
  const [activityOpen, setActivityOpen] = useState(false)

  const payload = agreement?.payload || {}
  const matches = agreement?.customer_item_matches || []

  const qc = useMemo(
    () => String(agreement?.quality ?? agreement?.query_meta?.quality_code ?? "").trim(),
    [agreement]
  )
  const design = useMemo(
    () => String(agreement?.design ?? agreement?.query_meta?.design ?? "").trim(),
    [agreement]
  )
  const color = useMemo(
    () => String(agreement?.colour ?? agreement?.query_meta?.color ?? "").trim(),
    [agreement]
  )
  const widthSeed = useMemo(
    () => String(agreement?.width ?? agreement?.query_meta?.width ?? "").trim(),
    [agreement]
  )

  const greigeCode =
    payload.greige_item_code ||
    agreement?.greige_item_code ||
    agreement?.greige_item ||
    ""

  const matchedItem = useMemo(
    () =>
      matches.find((i) => i.greige_item_code === greigeCode) ||
      (matches.length === 1 ? matches[0] : null),
    [matches, greigeCode]
  )

  const greigeDisplay = useMemo(() => {
    const parts = []
    if (matchedItem?.greige_item_code) parts.push(matchedItem.greige_item_code)
    else if (greigeCode) parts.push(greigeCode)
    if (matchedItem?.greige_design) parts.push(matchedItem.greige_design)
    if (matchedItem?.greige_color) parts.push(matchedItem.greige_color)
    return parts.join(" · ")
  }, [matchedItem, greigeCode])

  const widthInchesValue = useMemo(() => {
    if (matchedItem && matchedItem.greige_width != null) return String(matchedItem.greige_width)
    if (payload.width_inches) return String(payload.width_inches)
    if (agreement?.width_inches) return String(agreement.width_inches)
    return ""
  }, [matchedItem, payload.width_inches, agreement?.width_inches])

  const widthCmValue = useMemo(
    () => String(payload.width_cm ?? agreement?.width ?? agreement?.width_cm ?? ""),
    [payload.width_cm, agreement?.width, agreement?.width_cm]
  )

  const actions = useMemo(
    () => agreement?.actions || [],
    [agreement]
  )

  const agreement_no = payload.agreement_no ?? agreement?.agreement_no ?? ""
  const agreement_type = payload.agreement_type ?? agreement?.vmi_po ?? ""

  const fabric_delivery_raw =
    payload.fabric_delivery ?? agreement?.fabric_delivery ?? agreement?.start_date ?? ""
  const need_by_date_raw =
    payload.need_by_date ?? agreement?.auto_need_by_date ?? agreement?.end_date ?? ""

  const total_meters = payload.total_meters ?? ""
  const warp_yarn_rate = payload.warp_yarn_rate ?? ""
  const warp_delivery_raw = payload.warp_delivery ?? ""
  const weft_yarn_rate = payload.weft_yarn_rate ?? ""
  const weft_delivery_raw = payload.weft_delivery ?? ""

  const fabric_delivery = formatDate(fabric_delivery_raw)
  const need_by_date = formatDate(need_by_date_raw)
  const warp_delivery = formatDate(warp_delivery_raw)
  const weft_delivery = formatDate(weft_delivery_raw)

  const yarn_dyed_or_greige =
    payload.yarn_dyed_or_greige ??
    agreement?.yarn_dyed_or_greige ??
    matchedItem?.yarn_dyed_or_greige ??
    ""

  // Fabric meta: prefer payload, fallback to matchedItem where relevant
  const fabric_detail =
    payload.fabric_detail ??
    agreement?.item_description ??
    agreement?.description ??
    matchedItem?.finished_design_description ??
    ""

  const construction = payload.construction ?? matchedItem?.fab_construction ?? ""

  const warp_blend = payload.warp_blend ?? matchedItem?.warp_blend ?? ""
  const weft_blend = payload.weft_blend ?? matchedItem?.weft_blend ?? ""

  const weave = matchedItem?.weave || ""
  const selvedge = matchedItem?.selvedge || ""
  const warpYarnGrade = matchedItem?.warp_yarn_grade || ""
  const warpSpinMethod = matchedItem?.warp_spin_method || ""
  const weftYarnGrade = matchedItem?.weft_yarn_grade || ""
  const weftSpinMethod = matchedItem?.weft_spin_method || ""

  const dyed_warp_bags = payload.dyed_warp_bags ?? ""
  const ecru_warp_bags = payload.ecru_warp_bags ?? ""
  const dyed_weft_bags = payload.dyed_weft_bags ?? ""
  const ecru_weft_bags = payload.ecru_weft_bags ?? ""
  const dyed_bags = payload.dyed_bags ?? ""
  const ecru_bags = payload.ecru_bags ?? ""

  const status = agreement?.status
  const currentApproverName = agreement?.current_approver_name

  return (
    <div className="mb-5">
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        <div className="col-span-12 lg:col-span-5">
          <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-bodybg shadow-sm p-5 space-y-6 h-full">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[0.7rem] font-semibold text-slate-500 uppercase tracking-[0.12em]">
                  Agreement No.
                </div>
                <div className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {fieldValue(agreement_no)}
                </div>
                <div className="mt-2 text-[0.7rem] font-semibold text-slate-500 uppercase tracking-[0.12em]">
                  Agreement Type
                </div>
                <div className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                  {fieldValue(agreement_type)}
                </div>
              </div>
              {(status || currentApproverName) && (
                <div className="flex flex-col items-end gap-1 text-right">
                  {status && (
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] bg-slate-900 text-slate-50 dark:bg-slate-50 dark:text-slate-900">
                      {status}
                    </span>
                  )}
                  {currentApproverName && (
                    <span className="text-[0.7rem] text-slate-500">
                      With {currentApproverName}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 sm:col-span-6">
                <div className="text-[0.7rem] font-semibold text-slate-500 uppercase tracking-[0.12em]">
                  Fabric Delivery
                </div>
                <div className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                  {fabric_delivery}
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6">
                <div className="text-[0.7rem] font-semibold text-slate-500 uppercase tracking-[0.12em]">
                  Need By Date
                </div>
                <div className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                  {need_by_date}
                </div>
              </div>
              <div className="col-span-12">
                <div className="text-[0.7rem] font-semibold text-slate-500 uppercase tracking-[0.12em]">
                  Total Meters
                </div>
                <div className="mt-1 inline-flex items-center rounded-lg bg-slate-50 dark:bg-slate-900/40 px-3 py-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {fieldValue(total_meters)}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-violet-50 dark:bg-violet-900/20 ring-1 ring-violet-200/70 dark:ring-violet-700/70 px-4 py-3 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[0.7rem] font-semibold text-violet-700 dark:text-violet-200 uppercase tracking-[0.12em]">
                  Yarn Rates
                </div>
                <div className="text-[0.7rem] text-violet-600/80 dark:text-violet-200/80">
                  Warp &amp; Weft
                </div>
              </div>
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-6 space-y-2">
                  <div>
                    <div className="text-[0.7rem] font-semibold text-slate-500 uppercase tracking-[0.12em]">
                      Warp Yarn Rate
                    </div>
                    <div className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                      {fieldValue(warp_yarn_rate)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[0.7rem] font-semibold text-slate-500 uppercase tracking-[0.12em]">
                      Warp Delivery
                    </div>
                    <div className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                      {warp_delivery}
                    </div>
                  </div>
                </div>
                <div className="col-span-6 space-y-2 border-l border-violet-100/70 dark:border-violet-700/60 pl-3 sm:pl-4">
                  <div>
                    <div className="text-[0.7rem] font-semibold text-slate-500 uppercase tracking-[0.12em]">
                      Weft Yarn Rate
                    </div>
                    <div className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                      {fieldValue(weft_yarn_rate)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[0.7rem] font-semibold text-slate-500 uppercase tracking-[0.12em]">
                      Weft Delivery
                    </div>
                    <div className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                      {weft_delivery}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 sm:col-span-6">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-900/40 px-4 py-3 h-full flex flex-col justify-between">
                  <div className="text-[0.7rem] font-semibold text-slate-500 uppercase tracking-[0.12em]">
                    G.Width (In)
                  </div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                    {fieldValue(widthInchesValue)}
                  </div>
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-900/40 px-4 py-3 h-full flex flex-col justify-between">
                  <div className="text-[0.7rem] font-semibold text-slate-500 uppercase tracking-[0.12em]">
                    F.Width (Cm)
                  </div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                    {fieldValue(widthCmValue)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7">
          <div className="rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-bodybg shadow-sm overflow-hidden h-full">
            <AgreementItemMeta
              qc={qc}
              design={design}
              color={color}
              widthSeed={widthSeed}
              yarn_dyed_or_greige={yarn_dyed_or_greige}
              widthInches={widthInchesValue}
              widthCm={widthCmValue}
              greigeItemCode={greigeDisplay}
              actionsCount={actions?.length || 0}
              onOpenActivity={() => setActivityOpen(true)}
            />
            <div className="p-4 space-y-5">
              <AgreementFabric
                fabricDetail={fabric_detail}
                construction={construction}
                weave={weave}
                selvedge={selvedge}
                warpBlend={warp_blend}
                weftBlend={weft_blend}
                warpYarnGrade={warpYarnGrade}
                warpSpinMethod={warpSpinMethod}
                weftYarnGrade={weftYarnGrade}
                weftSpinMethod={weftSpinMethod}
                yarn_dyed_or_greige={yarn_dyed_or_greige}
                source={agreement?.source || (agreement?.email ? "email" : "manual")}
              />
              <AgreementYarnBags
                values={{
                  dyed_warp_bags,
                  ecru_warp_bags,
                  dyed_weft_bags,
                  ecru_weft_bags,
                  dyed_bags,
                  ecru_bags
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {activityOpen && (
        <ApprovalActivityModal
          open={activityOpen}
          onClose={() => setActivityOpen(false)}
          status={status}
          currentApproverName={currentApproverName}
          actions={actions}
        />
      )}
    </div>
  )
}

export default AgreementPlacementReadOnly
