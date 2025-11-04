import React, { useEffect, useMemo, useState, useCallback } from "react"
import { Calculator, Search } from "lucide-react"
import YarnConsumptionModal from "@modules/customer-hub/customer-orders/components/agreement-placement/YarnConsumptionModal.jsx"
import FormInput from "@components/form/FormInput.jsx"
import FormSelect from "@components/form/FormSelect.jsx"
import { AGREEMENT_TYPES } from "@modules/customer-hub/customer-orders/components/agreement-placement/AgreementPlacementModal.jsx"
import { useAgreementPlacementForm } from "@modules/customer-hub/customer-orders/hooks/agreement-placement/useAgreementPlacementForm.js"
import AgreementActions from "@modules/customer-hub/customer-orders/components/agreement-placement/AgreementActions.jsx"
import AgreementItemMeta from "@modules/customer-hub/customer-orders/components/agreement-placement/AgreementItemMeta.jsx"
import AgreementYarnBags from "@modules/customer-hub/customer-orders/components/agreement-placement/AgreementYarnBags.jsx"
import AgreementFabric from "@modules/customer-hub/customer-orders/components/agreement-placement/AgreementFabric.jsx"
import SelectCustomerItemModal from "@modules/customer-hub/customer-orders/components/agreement-placement/SelectCustomerItemModal.jsx"
import { getAgreement } from "@modules/customer-hub/customer-orders/services/AgreementService.js"
import ApprovalActivityModal from "@modules/customer-hub/customer-orders/components/agreement-placement/ApprovalActivityModal.jsx"

const AgreementPlacementForm = ({
  seed = {},
  email,
  approvalActivity,
  status,
  currentApproverName,
  disabledSubmit = false,
  onAfterPersist,
  hideSubmit = false
}) => {
  const {
    control,
    setValue,
    getValues,
    watch,
    errors,
    showYarn,
    setShowYarn,
    saving,
    activityOpen,
    setActivityOpen,
    qc,
    design,
    color,
    widthSeed,
    handleComputed,
    doSaveDraft,
    doSubmit
  } = useAgreementPlacementForm({ seed, email, onAfterPersist })

  const [open, setOpen] = useState(false)
  const [choices, setChoices] = useState([])
  const [statusMsg, setStatusMsg] = useState(false)

  const matchesCount = choices?.length || 0
  const hasMatches = matchesCount > 0
  const hasMultipleMatches = matchesCount > 1

  const actions = useMemo(
    () => (approvalActivity?.actions || approvalActivity || seed?.actions || []),
    [approvalActivity, seed?.actions]
  )

  useEffect(() => {
    setChoices(seed?.customer_item_matches || [])
    setStatusMsg(true)
  }, [seed?.id, seed?.updated_at])

  const greigeCode =
    watch("greige_item_code") ||
    seed.payload?.greige_item_code ||
    seed.greige_item_code ||
    seed.greige_item ||
    ""

  const matchedItem = useMemo(
    () =>
      choices.find((i) => i.greige_item_code === greigeCode) ||
      (choices.length === 1 ? choices[0] : undefined),
    [choices, greigeCode]
  )

  useEffect(() => {
    if (!choices?.length) return
    const v = getValues()
    const gid = greigeCode
    const m =
      choices.find((i) => i.greige_item_code === gid) ||
      (choices.length === 1 ? choices[0] : null)
    if (!m) return
    const needsApply =
      !(v.warp_blend || v.weft_blend || v.construction) ||
      !String(v.width_cm || "").trim() ||
      !String(v.width_inches || "").trim()
    if (!needsApply) return
    setValue("greige_item_code", v.greige_item_code || m.greige_item_code || "")
    setValue("fabric_detail", v.fabric_detail || m.fab_construction || "")
    setValue("construction", v.construction || m.fab_construction || "")
    setValue("warp_blend", v.warp_blend || m.warp_blend || "")
    setValue("weft_blend", v.weft_blend || m.weft_blend || "")
    if (!String(v.width_cm || "").trim() && m.finished_width_cm != null) {
      setValue("width_cm", String(m.finished_width_cm))
    }
    if (!String(v.width_inches || "").trim() && m.finished_width_inches != null) {
      setValue("width_inches", String(m.finished_width_inches))
    }
  }, [choices, greigeCode])

  const applyItem = useCallback(
    (i) => {
      setValue("greige_item_code", i.greige_item_code || "")
      setValue("fabric_detail", i.fab_construction || watch("fabric_detail") || "")
      setValue("construction", i.fab_construction || "")
      setValue("warp_blend", i.warp_blend || "")
      setValue("weft_blend", i.weft_blend || "")
      setValue("width_cm", String(i.finished_width_cm || ""))
      setValue("width_inches", String(i.finished_width_inches || ""))
      setValue(
        "yarn_dyed_or_greige",
        i.yarn_dyed_or_greige || watch("yarn_dyed_or_greige") || ""
      )
    },
    [setValue, watch]
  )

  const fetchMatches = useCallback(async () => {
    if (!seed?.id) return
    const fresh = await getAgreement(seed.id)
    setChoices(fresh?.customer_item_matches || [])
    setStatusMsg(true)
  }, [seed?.id])

  return (
    <div className="rounded-xl border dark:border-defaultborder/20 bg-white dark:bg-bodybg shadow-sm overflow-hidden mb-5 relative">
      <div className="p-4">
        {statusMsg && !hasMatches && (
          <div className="rounded-xl border dark:border-defaultborder/20 overflow-hidden mb-2">
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-white/5 dark:via-white/5 dark:to-white/5 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[.95rem] font-semibold">No matching item found</div>
                  <div className="text-sm opacity-70">
                    Refine search or fill details manually
                  </div>
                </div>
                <button
                  onClick={fetchMatches}
                  className="ti-btn ti-btn-primary !py-1 !px-2 !text-[0.75rem]"
                  type="button"
                >
                  <Search size={16} />
                  Search again
                </button>
              </div>
            </div>
          </div>
        )}

        {statusMsg && hasMultipleMatches && (
          <div className="rounded-xl border dark:border-defaultborder/20 overflow-hidden mb-3">
            <div className="bg-gradient-to-r from-emerald-50 via-sky-50 to-indigo-50 dark:from-white/5 dark:via-white/5 dark:to-white/5 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[.95rem] font-semibold">
                    {matchesCount} matching customer items found
                  </div>
                  <div className="text-sm opacity-70">
                    Open the selector to choose the correct customer item or continue editing fields manually
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={fetchMatches}
                    className="ti-btn ti-btn-light !py-1 !px-2 !text-[0.75rem]"
                  >
                    <Search size={16} />
                    Refresh
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="ti-btn ti-btn-primary !py-1 !px-2 !text-[0.75rem]"
                  >
                    Select item
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-12 gap-12">
          <div className="col-span-12 md:col-span-6 xl:col-span-5">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <FormInput
                  name="agreement_no"
                  control={control}
                  errors={errors}
                  placeholder="Agreement No."
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <FormSelect
                  name="agreement_type"
                  control={control}
                  errors={errors}
                  options={AGREEMENT_TYPES}
                  placeholder="Agreement Types"
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <FormInput
                  name="fabric_delivery"
                  className="!text-danger"
                  control={control}
                  errors={errors}
                  placeholder="Fabric Delivery"
                  type="date"
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <FormInput
                  name="need_by_date"
                  control={control}
                  errors={errors}
                  placeholder="Need By Date"
                  type="date"
                />
              </div>
              <div className="col-span-12">
                <label className="form-label flex items-center justify-between">
                  <span>Total Meters</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowYarn(true)}
                      className="ti-btn ti-btn-primary !mb-0 h-6 px-2 !text-[0.7rem] inline-flex items-center gap-1 rounded-full"
                    >
                      <Calculator size={14} />
                      Yarn Consumption
                    </button>
                  </div>
                </label>
                <FormInput
                  name="total_meters"
                  label={false}
                  control={control}
                  errors={errors}
                  placeholder="Total Meters"
                  type="number"
                />
              </div>
              <div className="col-span-12">
                <div className="rounded-xl ring-2 ring-violet-300/60 dark:ring-violet-700 p-4">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-6">
                      <FormInput
                        name="warp_yarn_rate"
                        control={control}
                        errors={errors}
                        placeholder="Warp Yarn Rate"
                        type="number"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <FormInput
                        name="warp_delivery"
                        control={control}
                        errors={errors}
                        placeholder="Warp Delivery"
                        type="date"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <FormInput
                        name="weft_yarn_rate"
                        control={control}
                        errors={errors}
                        placeholder="Weft Yarn Rate"
                        type="number"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <FormInput
                        name="weft_delivery"
                        control={control}
                        errors={errors}
                        placeholder="Weft Delivery"
                        type="date"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden">
                <FormInput
                  name="yarn_dyed_or_greige"
                  control={control}
                  errors={errors}
                  placeholder=""
                  label={false}
                />
              </div>
              <div className="hidden">
                <FormInput
                  name="greige_item_code"
                  control={control}
                  errors={errors}
                  placeholder=""
                  label={false}
                />
              </div>
              <AgreementActions
                onSaveDraft={doSaveDraft}
                onSubmit={doSubmit}
                disabledSubmit={
                  disabledSubmit || status === "under_approval" || status === "approved"
                }
                disabled={saving}
                hideSubmit={hideSubmit}
              />
            </div>
          </div>
          <div className="col-span-12 md:col-span-7 rounded-xl border border-slate-200/80 dark:border-white/10 overflow-hidden">
            <AgreementItemMeta
              qc={qc}
              design={design}
              color={color}
              widthSeed={widthSeed}
              yarn_dyed_or_greige={matchedItem?.yarn_dyed_or_greige || ""}
              widthInches={
                (matchedItem && matchedItem.greige_width) ||
                widthSeed ||
                watch("width_inches")
              }
              widthCm={watch("width_cm")}
              greigeItemCode={
                watch("greige_item_code") ||
                seed.payload?.greige_item_code ||
                seed.greige_item_code ||
                seed.greige_item
              }
              actionsCount={actions?.length || 0}
              onOpenActivity={() => setActivityOpen(true)}
            />
            <div className="p-4 space-y-5">
              <AgreementFabric
                fabricDetail={watch("fabric_detail") || seed.description}
                construction={watch("construction")}
                warpBlend={watch("warp_blend")}
                weftBlend={watch("weft_blend")}
                yarn_dyed_or_greige={matchedItem?.yarn_dyed_or_greige || ""}
              />
              <AgreementYarnBags
                values={{
                  dyed_warp_bags: watch("dyed_warp_bags"),
                  ecru_warp_bags: watch("ecru_warp_bags"),
                  dyed_weft_bags: watch("dyed_weft_bags"),
                  ecru_weft_bags: watch("ecru_weft_bags"),
                  dyed_bags: watch("dyed_bags"),
                  ecru_bags: watch("ecru_bags")
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

      <YarnConsumptionModal
        open={showYarn}
        onClose={() => setShowYarn(false)}
        item={matchedItem}
        totalMeters={watch("total_meters")}
        onTotalMetersChange={(v) => setValue("total_meters", v)}
        onComputed={handleComputed}
        dyeingMeta={seed?.dyeing_meta}
      />

      <SelectCustomerItemModal
        open={open}
        onClose={() => setOpen(false)}
        choices={choices}
        queryMeta={{ quality_code: qc, design, color, width: widthSeed }}
        onUse={(item) => {
          applyItem(item)
          setOpen(false)
        }}
      />
    </div>
  )
}

export default AgreementPlacementForm
