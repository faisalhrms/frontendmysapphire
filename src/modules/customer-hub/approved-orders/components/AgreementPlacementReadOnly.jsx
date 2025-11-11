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
  const fabric_delivery_raw = payload.fabric_delivery ?? agreement?.fabric_delivery ?? agreement?.start_date ?? ""
  const need_by_date_raw = payload.need_by_date ?? agreement?.auto_need_by_date ?? agreement?.end_date ?? ""
  const total_meters = payload.total_meters ?? ""
  const warp_yarn_rate = payload.warp_yarn_rate ?? ""
  const warp_delivery_raw = payload.warp_delivery ?? ""
  const weft_yarn_rate = payload.weft_yarn_rate ?? ""
  const weft_delivery_raw = payload.weft_delivery ?? ""

  const fabric_delivery = formatDate(fabric_delivery_raw)
  const need_by_date = formatDate(need_by_date_raw)
  const warp_delivery = formatDate(warp_delivery_raw)
  const weft_delivery = formatDate(weft_delivery_raw)

  const yarn_dyed_or_greige = payload.yarn_dyed_or_greige ?? agreement?.yarn_dyed_or_greige ?? ""

  const fabric_detail = payload.fabric_detail ?? agreement?.item_description ?? agreement?.description ?? ""
  const construction = payload.construction ?? ""
  const warp_blend = payload.warp_blend ?? ""
  const weft_blend = payload.weft_blend ?? ""

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
          <div className="rounded-xl border dark:border-defaultborder/20 bg-white dark:bg-bodybg shadow-sm p-5 space-y-6 h-full">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 sm:col-span-6">
                <div className="text-[0.75rem] font-semibold text-slate-500 uppercase tracking-wide">
                  Agreement No.
                </div>
                <div className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                  {fieldValue(agreement_no)}
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6">
                <div className="text-[0.75rem] font-semibold text-slate-500 uppercase tracking-wide">
                  Agreement Type
                </div>
                <div className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                  {fieldValue(agreement_type)}
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6">
                <div className="text-[0.75rem] font-semibold text-slate-500 uppercase tracking-wide">
                  Fabric Delivery
                </div>
                <div className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                  {fabric_delivery}
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6">
                <div className="text-[0.75rem] font-semibold text-slate-500 uppercase tracking-wide">
                  Need By Date
                </div>
                <div className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                  {need_by_date}
                </div>
              </div>
              <div className="col-span-12">
                <div className="text-[0.75rem] font-semibold text-slate-500 uppercase tracking-wide">
                  Total Meters
                </div>
                <div className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                  {fieldValue(total_meters)}
                </div>
              </div>
            </div>

            <div className="rounded-xl ring-2 ring-violet-300/60 dark:ring-violet-700 p-4">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-6">
                  <div className="text-[0.75rem] font-semibold text-slate-500 uppercase tracking-wide">
                    Warp Yarn Rate
                  </div>
                  <div className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                    {fieldValue(warp_yarn_rate)}
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <div className="text-[0.75rem] font-semibold text-slate-500 uppercase tracking-wide">
                    Warp Delivery
                  </div>
                  <div className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                    {warp_delivery}
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <div className="text-[0.75rem] font-semibold text-slate-500 uppercase tracking-wide">
                    Weft Yarn Rate
                  </div>
                  <div className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                    {fieldValue(weft_yarn_rate)}
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <div className="text-[0.75rem] font-semibold text-slate-500 uppercase tracking-wide">
                    Weft Delivery
                  </div>
                  <div className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                    {weft_delivery}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 sm:col-span-6">
                <div className="text-[0.75rem] font-semibold text-slate-500 uppercase tracking-wide">
                  Width Inches
                </div>
                <div className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                  {fieldValue(widthInchesValue)}
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6">
                <div className="text-[0.75rem] font-semibold text-slate-500 uppercase tracking-wide">
                  Width Cm
                </div>
                <div className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                  {fieldValue(widthCmValue)}
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
                warpBlend={warp_blend}
                weftBlend={weft_blend}
                yarn_dyed_or_greige={yarn_dyed_or_greige}
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
