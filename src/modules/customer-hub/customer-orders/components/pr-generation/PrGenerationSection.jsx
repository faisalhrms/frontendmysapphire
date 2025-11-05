import React, { useEffect, useMemo, useState } from "react"
import { ClipboardList, Save, CalendarDays, Hash, Package, BadgeDollarSign, LayoutTemplate } from "lucide-react"
import LoadingSpinner from "@components/LoadingSpinner.jsx"
import { usePrGeneration } from "@modules/customer-hub/customer-orders/hooks/pr-generation/usePrGeneration.js"
import PrPill from "@modules/customer-hub/customer-orders/components/pr-generation/ui-components/PrPill.jsx"
import PrStatTile from "@modules/customer-hub/customer-orders/components/pr-generation/ui-components/PrStatTile.jsx"
import PrSectionCard from "@modules/customer-hub/customer-orders/components/pr-generation/ui-components/PrSectionCard.jsx"
import PrInfoTile from "@modules/customer-hub/customer-orders/components/pr-generation/ui-components/PrInfoTile.jsx";

const PrGenerationSection = ({ seed }) => {
  const { data, loading, saving, save, hasCosting, costingChecked } = usePrGeneration(seed)
  const [form, setForm] = useState(null)

  useEffect(() => {
    setForm(data || null)
  }, [data])


  const qualityChip = useMemo(() => seed?.quality || form?.quality_code || "", [seed, form])
  const typeChip = useMemo(
    () => seed?.payload?.yarn_dyed_or_greige || "",
    [seed, form],
  )
  const designChip = useMemo(
    () => form?.greige_design_combined || "",
    [seed, form],
  )
  const colorChip = useMemo(
    () => (form?.greige_color_combined || "").split("/")[0] || "",
    [seed, form],
  )



  const handleSave = async () => {
    if (!form || !hasCosting) return
    const payload = { ...form }
    await save(payload)
  }

  if (!seed) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center text-sm text-slate-500">
        <span>Select an agreement to start PR generation.</span>
      </div>
    )
  }

  if (seed && costingChecked && !hasCosting) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-rose-200/80 dark:border-rose-700/60 bg-gradient-to-r from-rose-50 via-white to-rose-100 dark:from-rose-950 dark:via-slate-950 dark:to-rose-900 px-5 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200">
              <ClipboardList size={18} />
            </div>
            <div>
              <div className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-rose-600 dark:text-rose-300">
                PR Generation
              </div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Save Agreement and Airjet Costing first
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-dashed border-slate-300/80 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-900/70 px-6 py-6 text-center text-sm text-slate-600 dark:text-slate-200">
          Open the Airjet Costing tab, save the costing for this agreement, and then return here to configure the PR.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-gradient-to-r from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-5 py-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500 text-white shadow-sm">
              <ClipboardList size={18} />
            </div>
            <div>
              <div className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-rose-600 dark:text-rose-300">
                PR Generation
              </div>
              {form?.greige_item_code && (
                <div className="text-[0.7rem] text-slate-500 dark:text-slate-400">
                  Item Code: <span className="font-medium">{form.greige_item_code}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {qualityChip ? (
              <PrPill tone="emerald">
                <Hash size={12} />
                <span>Quality: {qualityChip}</span>
              </PrPill>
            ) : null}
            {typeChip ? (
              <PrPill tone="sky">
                <LayoutTemplate size={12} />
                <span>Type: {typeChip}</span>
              </PrPill>
            ) : null}
            {designChip ? (
              <PrPill tone="amber">
                <Package size={12} />
                <span>Design: {designChip}</span>
              </PrPill>
            ) : null}
            {colorChip ? (
              <PrPill tone="rose">
                <span>Color: {colorChip}</span>
              </PrPill>
            ) : null}
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={!form || saving || !hasCosting}
            className="inline-flex items-center gap-2 rounded-full border border-rose-500/90 bg-rose-500 text-xs font-semibold uppercase tracking-[0.18em] text-white px-4 py-2 shadow-sm hover:bg-rose-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Saving</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Generate PR</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <PrStatTile label="Agreement No" value={form?.agreement_no} icon={<Hash size={14} />} />
          <PrStatTile label="Greige Width (cm)" value={form?.greige_width_cm} icon={<LayoutTemplate size={14} />} />
          <PrStatTile label="Price" value={form?.target_price_per_meter} icon={<BadgeDollarSign size={14} />} />
          <PrStatTile label="Prepared By" value={form?.costing_created_by} icon={<Package size={14} />} />
        </div>
      </div>

      {loading && hasCosting && (
        <div className="flex items-center justify-center py-6">
          <LoadingSpinner />
        </div>
      )}

      {!loading && form && (
        <div className="space-y-2">
          <PrSectionCard
            icon={<Package size={16} />}
            title="Greige Details"
            subtitle="Base construction and greige specifications"
          >
            <div className="mt-1 grid grid-cols-1 md:grid-cols-3 gap-3">
              <PrInfoTile label="Greige Item Code" value={form.greige_item_code} />
              <PrInfoTile label="Agreement No" value={form.agreement_no} />
              <PrInfoTile label="Quality Code" value={form.quality_code} />
              <PrInfoTile label="Warp Blend" value={form.warp_blend} />
              <PrInfoTile label="Weft Blend" value={form.weft_blend} />
              <PrInfoTile label="Fabric Construction" value={form.fabric_construction} />
              <PrInfoTile label="Weave Stripe Size" value={form.weave_stripe_size} />
              <PrInfoTile label="Selvedge" value={form.selvedge} />
              <PrInfoTile label="Greige Width (cm)" value={form.greige_width_cm} />
              <PrInfoTile label="Greige Design Code / Design" value={form.greige_design_combined} />
              <PrInfoTile label="Greige Color Code / Description" value={form.greige_color_combined} />
            </div>
          </PrSectionCard>

          <PrSectionCard
            icon={<LayoutTemplate size={16} />}
            title="Finished Fabric Details"
            subtitle="Finished width, design and process route"
          >
            <div className="mt-1 grid grid-cols-1 md:grid-cols-3 gap-3">
              <PrInfoTile label="Process Item Code" value={form.process_item_code} />
              <PrInfoTile label="Finished Width (cm)" value={form.finished_width_cm} />
              <PrInfoTile label="Finished Width (inches)" value={form.finished_width_inches} />
              <PrInfoTile label="Finished Design Code / Description" value={form.finished_design_combined} />
              <PrInfoTile label="Finished Color Code / Description" value={form.finished_color_combined} />
              <PrInfoTile label="Process Route Code" value={form.process_route_code} />
              <PrInfoTile label="Process Route Description" value={form.process_route_description} />
            </div>
          </PrSectionCard>

          <PrSectionCard
            icon={<CalendarDays size={16} />}
            title="Dates & Commercials"
            subtitle="Timeline and commercial terms"
          >
            <div className="mt-1 grid grid-cols-1 md:grid-cols-4 gap-2">
              <PrInfoTile label="Greige Comp. Date" value={form.greige_comp_date} />
              <PrInfoTile label="Vendor Date" value={form.vendor_date} />
              <PrInfoTile label="MKT Quantity" value={form.mkt_quantity} />
              <PrInfoTile label="Total Greige Quantity" value={form.total_greige_quantity} />
            </div>
          </PrSectionCard>


        </div>
      )}


      {!loading && !form && (
        <div className="flex flex-col items-center justify-center py-10 text-center text-sm text-slate-500">
          <span>No data available for this agreement.</span>
        </div>
      )}
    </div>
  )
}

export default PrGenerationSection
