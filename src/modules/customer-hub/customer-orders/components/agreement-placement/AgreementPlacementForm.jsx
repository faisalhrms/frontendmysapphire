import React, { useEffect, useMemo, useState, useCallback } from "react"
import dayjs from "dayjs"
import { Calculator, Search, CheckCircle2, AlertTriangle } from "lucide-react"
import YarnConsumptionModal from "@modules/customer-hub/customer-orders/components/agreement-placement/YarnConsumptionModal.jsx"
import YarnConsumptionCard from "@modules/customer-hub/customer-orders/components/agreement-placement/YarnConsumptionCard.jsx"
import FormInput from "@components/form/FormInput.jsx"
import FormSelect from "@components/form/FormSelect.jsx"
import {
  AGREEMENT_EXECUTION_TYPES,
  AGREEMENT_TYPES,
} from "@modules/customer-hub/customer-orders/components/agreement-placement/AgreementPlacementModal.jsx"
import { useAgreementPlacementForm } from "@modules/customer-hub/customer-orders/hooks/agreement-placement/useAgreementPlacementForm.js"
import AgreementActions from "@modules/customer-hub/customer-orders/components/agreement-placement/AgreementActions.jsx"
import AgreementItemMeta from "@modules/customer-hub/customer-orders/components/agreement-placement/AgreementItemMeta.jsx"
import AgreementYarnBags from "@modules/customer-hub/customer-orders/components/agreement-placement/AgreementYarnBags.jsx"
import AgreementFabric from "@modules/customer-hub/customer-orders/components/agreement-placement/AgreementFabric.jsx"
import SelectCustomerItemModal from "@modules/customer-hub/customer-orders/components/agreement-placement/SelectCustomerItemModal.jsx"
import { getAgreement } from "@modules/customer-hub/customer-orders/services/AgreementService.js"
import ApprovalActivityModal from "@modules/customer-hub/customer-orders/components/agreement-placement/ApprovalActivityModal.jsx"
import SubmitAgreementModal from "@modules/customer-hub/customer-orders/components/agreement-placement/SubmitAgreementModal.jsx"

const AgreementPlacementForm = ({
  seed = {},
  email,
  approvalActivity,
  status: propStatus,
  currentApproverName,
  disabledSubmit = false,
  onAfterPersist,
  hideSubmit = false,
  refetch,
  active,
  showHeader,
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
    doSubmit,
  } = useAgreementPlacementForm({ seed, email, onAfterPersist, refetch })

  const [open, setOpen] = useState(false)
  const [choices, setChoices] = useState([])
  const [statusMsg, setStatusMsg] = useState(false)
  const [submitModalOpen, setSubmitModalOpen] = useState(false)

  const matchesCount = choices?.length || 0
  const hasMatches = matchesCount > 0
  const hasMultipleMatches = matchesCount > 1

  const status = propStatus ?? seed?.status
  const yarnTermsStatus = seed?.yarn_terms_status
  const fabricDeliveryStatus = seed?.fabric_delivery_status
  const isAgreementApproved = status === "approved"

  const canEditYarn = !!seed?.can_edit_yarn_terms
  const canEditFabric = !!seed?.can_edit_fabric_delivery

  // use lightweight counts from API instead of full arrays
  const timelineCount =
    (seed?.approval_actions_count || 0) + (seed?.activity_logs_count || 0)

  const currentApproverDisplayName =
    currentApproverName ?? seed?.current_approver_name ?? null

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

  const greigeDisplay = useMemo(() => {
    const parts = []
    if (matchedItem?.greige_item_code) {
      parts.push(matchedItem.greige_item_code)
    } else if (greigeCode) {
      parts.push(greigeCode)
    }
    if (matchedItem?.greige_design) {
      parts.push(matchedItem.greige_design)
    }
    if (matchedItem?.greige_color) {
      parts.push(matchedItem.greige_color)
    }
    return parts.join(" · ")
  }, [matchedItem, greigeCode])

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
    setValue("fabric_detail", v.fabric_detail || "")
    setValue("construction", v.construction || m.fab_construction || "")
    setValue("warp_blend", v.warp_blend || m.warp_blend || "")
    setValue("weft_blend", v.weft_blend || m.weft_blend || "")
    if (!String(v.width_cm || "").trim() && m.finished_width_cm != null) {
      setValue("width_cm", String(m.finished_width_cm))
    }
    if (!String(v.width_inches || "").trim() && m.greige_width != null) {
      setValue("width_inches", String(m.greige_width))
    }
  }, [choices, greigeCode, getValues, setValue])

  const applyItem = useCallback(
    (i) => {
      setValue("greige_item_code", i.greige_item_code || "")
      setValue("fabric_detail", watch("fabric_detail") || "")
      setValue("construction", i.fab_construction || "")
      setValue("warp_blend", i.warp_blend || "")
      setValue("weft_blend", i.weft_blend || "")
      setValue("width_cm", String(i.finished_width_cm || ""))
      setValue("width_inches", String(i.greige_width || ""))
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

  const totalMeters = watch("total_meters")
  const widthInchesValue =
    (matchedItem && matchedItem.greige_width) || widthSeed || watch("width_inches")
  const widthCmValue = watch("width_cm")
  const finishedMeters = watch("finished_meters")
  const marginPct = watch("margin_pct")
  const warpYarnRate = watch("warp_yarn_rate")
  const warpDelivery = watch("warp_delivery")
  const weftYarnRate = watch("weft_yarn_rate")
  const weftDelivery = watch("weft_delivery")

  const isYarnFieldsReadOnly = !canEditYarn

  const isFabricDeliveryLockedByYarn =
    !warpYarnRate || !warpDelivery || !weftYarnRate || !weftDelivery

  const isFabricDeliveryReadOnly = !canEditFabric

  const isFabricDeliveryLocked =
    isFabricDeliveryLockedByYarn || isFabricDeliveryReadOnly

  const needByDate = watch("need_by_date")
  const fabricDelivery = watch("fabric_delivery")

  const deliveryDeviation = useMemo(() => {
    if (!needByDate || !fabricDelivery) return null
    const need = dayjs(needByDate)
    const fabric = dayjs(fabricDelivery)
    if (!need.isValid() || !fabric.isValid()) return null
    const diff = Math.abs(need.diff(fabric, "day"))
    if (diff <= 5) return { level: "ok", diff }
    if (diff <= 10) return { level: "soft", diff }
    return { level: "hard", diff }
  }, [needByDate, fabricDelivery])

  const handleSubmitWithType = useCallback(
    async (submissionType, hierarchies) => {
      try {
        await doSubmit(submissionType, hierarchies)
        setSubmitModalOpen(false)
      } catch (e) {}
    },
    [doSubmit]
  )

  const initialHierarchies =
    seed?.payload?.approval_hierarchies || seed?.approval_hierarchies || []

  return (
    <div className="rounded-xl border dark:border-defaultborder/20 bg-white dark:bg-bodybg shadow-sm overflow-hidden mb-5 relative">
      <div className="p-4">
        {statusMsg && !hasMatches && (
          <div className="rounded-xl border dark:border-defaultborder/20 overflow-hidden mb-2">
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-white/5 dark:via-white/5 dark:to-white/5 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[.95rem] font-semibold">
                    No matching item found
                  </div>
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
                    Open the selector to choose the correct customer item or
                    continue editing fields manually
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

        <div className="grid grid-cols-12 gap-x-4 gap-y-6 xl:gap-x-5">
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
                <FormSelect
                  name="execution_type"
                  control={control}
                  errors={errors}
                  options={AGREEMENT_EXECUTION_TYPES}
                  placeholder="Execution Type"
                  is_required
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
                <FormInput
                  name="fabric_delivery"
                  className="!text-danger"
                  control={control}
                  errors={errors}
                  placeholder="Fabric Delivery"
                  type="date"
                  disabled={isFabricDeliveryLocked}
                />
              </div>

              {deliveryDeviation && (
                <div className="col-span-12">
                  <div
                    className={
                      deliveryDeviation.level === "ok"
                        ? "flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-xs dark:border-emerald-500/40 dark:bg-emerald-900/10"
                        : deliveryDeviation.level === "soft"
                        ? "flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2 text-xs dark:border-amber-500/40 dark:bg-amber-900/10"
                        : "flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50/80 px-3 py-2 text-xs dark:border-rose-500/40 dark:bg-rose-900/10"
                    }
                  >
                    <div className="mt-[2px]">
                      {deliveryDeviation.level === "ok" && <CheckCircle2 size={14} />}
                      {deliveryDeviation.level !== "ok" && (
                        <AlertTriangle size={14} />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[0.75rem] font-semibold">
                        {deliveryDeviation.level === "ok" &&
                          "Need by date is aligned with fabric delivery"}
                        {deliveryDeviation.level === "soft" &&
                          "Need by and delivery dates have a small deviation"}
                        {deliveryDeviation.level === "hard" &&
                          "Need by and delivery dates are out of tolerance"}
                      </div>
                      <div className="opacity-80">
                        Deviation of {deliveryDeviation.diff} day
                        {deliveryDeviation.diff !== 1 ? "s" : ""} between need by
                        date and received fabric delivery.
                        {deliveryDeviation.level === "soft" &&
                          " Within ±10 days but beyond ±5 days; review before final approval."}
                        {deliveryDeviation.level === "hard" &&
                          " More than ±10 days difference; please decide to approve or reject."}
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
                        disabled={isYarnFieldsReadOnly}
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <FormInput
                        name="warp_delivery"
                        control={control}
                        errors={errors}
                        placeholder="Warp Delivery"
                        type="date"
                        disabled={isYarnFieldsReadOnly}
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <FormInput
                        name="weft_yarn_rate"
                        control={control}
                        errors={errors}
                        placeholder="Weft Yarn Rate"
                        type="number"
                        disabled={isYarnFieldsReadOnly}
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <FormInput
                        name="weft_delivery"
                        control={control}
                        errors={errors}
                        placeholder="Weft Delivery"
                        type="date"
                        disabled={isYarnFieldsReadOnly}
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
                onSubmit={() => setSubmitModalOpen(true)}
                disabledSubmit={disabledSubmit || status === "under_approval"}
                disabled={saving}
                hideSubmit={hideSubmit}
              />
            </div>
          </div>

          <div className="col-span-12 md:col-span-7 rounded-xl border-2 border-slate-200/80 dark:border-white/10 overflow-hidden">
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
              greigeItemCode={greigeDisplay}
              actionsCount={timelineCount}
              onOpenActivity={() => setActivityOpen(true)}
            />
            <div className="p-4 space-y-5">
              <AgreementFabric
                fabricDetail={watch("fabric_detail") || ""}
                construction={
                  watch("construction") || matchedItem?.fab_construction || ""
                }
                weave={matchedItem?.weave || ""}
                selvedge={matchedItem?.selvedge || ""}
                warpBlend={watch("warp_blend") || matchedItem?.warp_blend || ""}
                weftBlend={watch("weft_blend") || matchedItem?.weft_blend || ""}
                warpYarnGrade={matchedItem?.warp_yarn_grade}
                warpSpinMethod={matchedItem?.warp_spin_method}
                weftYarnGrade={matchedItem?.weft_yarn_grade}
                weftSpinMethod={matchedItem?.weft_spin_method}
                yarn_dyed_or_greige={matchedItem?.yarn_dyed_or_greige || ""}
                source={seed?.source || (email ? "email" : "manual")}
              />

              <AgreementYarnBags
                values={{
                  dyed_warp_bags: watch("dyed_warp_bags"),
                  ecru_warp_bags: watch("ecru_warp_bags"),
                  dyed_weft_bags: watch("dyed_weft_bags"),
                  ecru_weft_bags: watch("ecru_weft_bags"),
                  dyed_bags: watch("dyed_bags"),
                  ecru_bags: watch("ecru_bags"),
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
          currentApproverName={currentApproverDisplayName}
          agreementId={seed?.id}
        />
      )}

      <YarnConsumptionModal
        open={showYarn}
        onClose={() => setShowYarn(false)}
        item={matchedItem}
        totalMeters={totalMeters}
        onTotalMetersChange={(v) => setValue("total_meters", v)}
        widthInches={widthInchesValue}
        widthCm={widthCmValue}
        onComputed={handleComputed}
        dyeingMeta={seed?.dyeing_meta}
        rejPct={watch("rej_pct")}
        finishedMeters={finishedMeters}
        onFinishedMetersChange={(v) => setValue("finished_meters", v)}
        marginPct={marginPct}
        onMarginPctChange={(v) => setValue("margin_pct", v)}
      />

      {!showYarn && (
        <div className="hidden">
          <YarnConsumptionCard
            item={matchedItem}
            totalMeters={totalMeters}
            onTotalMetersChange={(v) => setValue("total_meters", v)}
            widthInches={widthInchesValue}
            widthCm={widthCmValue}
            onComputed={handleComputed}
            dyeingMeta={seed?.dyeing_meta}
            initialRejPct={watch("rej_pct")}
          />
        </div>
      )}

      {submitModalOpen && (
        <SubmitAgreementModal
          closeModal={() => setSubmitModalOpen(false)}
          onConfirm={handleSubmitWithType}
          yarnTermsStatus={yarnTermsStatus}
          fabricDeliveryStatus={fabricDeliveryStatus}
          status={status}
          initialHierarchies={initialHierarchies}
        />
      )}

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
