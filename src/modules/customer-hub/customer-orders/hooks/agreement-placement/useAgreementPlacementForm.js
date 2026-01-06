import { useForm } from "react-hook-form"
import { useEffect, useState, useCallback, useMemo } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  createAgreement,
  updateAgreement,
  submitAgreement,
} from "@modules/customer-hub/customer-orders/services/AgreementService.js"
import {
  dateToYMD,
  normalizeDateSeed,
} from "@modules/customer-hub/customer-orders/components/agreement-placement/helpers.js"
import { buildAgreementPlacementSchema } from "@modules/customer-hub/customer-orders/hooks/agreement-placement/agreementPlacementSchema.js"

const r2 = (n) => Number.parseFloat((Number(n || 0)).toFixed(2))

const buildDefaults = (seed = {}, email) => {
  const p = seed.payload || {}
  const matches = seed.customer_item_matches || []

  const greigeCode =
    p.greige_item_code || seed.greige_item_code || seed.greige_item || ""

  const matchedItem =
    matches.find((i) => i.greige_item_code === greigeCode) ||
    (matches.length === 1 ? matches[0] : null)

  const greigeWidthInches =
    matchedItem && matchedItem.greige_width != null
      ? String(matchedItem.greige_width)
      : ""

  return {
    agreement_no: p.agreement_no ?? seed.agreement_no ?? "",
    total_meters: p.total_meters ?? "",
    agreement_type: p.agreement_type ?? seed.vmi_po ?? "",
    execution_type: p.execution_type ?? seed.execution_type ?? "",
    fabric_delivery: normalizeDateSeed(p.fabric_delivery ?? seed.fabric_delivery),
    fabric_detail: p.fabric_detail ?? seed.item_description ?? seed.description ?? "",
    construction: p.construction ?? "",
    warp_blend: p.warp_blend ?? "",
    weft_blend: p.weft_blend ?? "",
    dyed_bags: p.dyed_bags ?? "",
    ecru_bags: p.ecru_bags ?? "",
    dyed_warp_bags: p.dyed_warp_bags ?? "",
    dyed_weft_bags: p.dyed_weft_bags ?? "",
    ecru_warp_bags: p.ecru_warp_bags ?? "",
    ecru_weft_bags: p.ecru_weft_bags ?? "",
    warp_yarn_rate: p.warp_yarn_rate ?? "",
    weft_yarn_rate: p.weft_yarn_rate ?? "",
    warp_delivery: normalizeDateSeed(p.warp_delivery),
    weft_delivery: normalizeDateSeed(p.weft_delivery),
    width_inches: greigeWidthInches || p.width_inches || seed.width_inches || "",
    width_cm: p.width_cm ?? seed.width ?? seed.width_cm ?? "",
    total_bags: p.total_bags ?? "",
    need_by_date: normalizeDateSeed(p.need_by_date ?? seed.auto_need_by_date ?? ""),
    yarn_dyed_or_greige: p.yarn_dyed_or_greige ?? seed.yarn_dyed_or_greige ?? "",
    greige_item_code:
      p.greige_item_code ?? seed.greige_item_code ?? seed.greige_item ?? "",
    warp_yarn_required: p.warp_yarn_required ?? "",
    weft_yarn_required: p.weft_yarn_required ?? "",
    warp_bags: p.warp_bags ?? "",
    weft_bags: p.weft_bags ?? "",
    rej_pct: p.rej_pct ?? 10,
    warp_coverage: p.warp_coverage ?? "",
    weft_coverage: p.weft_coverage ?? "",
    finished_meters: p.finished_meters ?? "",
    margin_pct: p.margin_pct ?? "",
    warp_yarn_source: p.warp_yarn_source ?? "",
    weft_yarn_source: p.weft_yarn_source ?? "",
    split_quantity_enabled: p.split_quantity_enabled ?? false,
    split_deliveries: (p.split_deliveries ?? []).map((d) => ({
      fabric_delivery: normalizeDateSeed(d?.fabric_delivery),
      need_by_date: normalizeDateSeed(d?.need_by_date),
      quantity: d?.quantity ?? "",
    })),
  }
}

export const useAgreementPlacementForm = ({
  seed = {},
  email,
  onAfterPersist,
  refetch,
  activeApprovalType = null,
}) => {
  const queryClient = useQueryClient()

  const defaults = useMemo(
    () => buildDefaults(seed, email),
    [seed?.id, seed?.updated_at, email?.id]
  )

  const canEditYarn = !!seed?.can_edit_yarn_terms
  const canEditFabric = !!seed?.can_edit_fabric_delivery

  const currentApprovalTag =
    seed?.current_approval_tag || seed?.payload?.current_approval_tag || null

  const stageHint = useMemo(() => {
    const yarn = String(seed?.yarn_terms_status || "").toLowerCase()
    const fabric = String(seed?.fabric_delivery_status || "").toLowerCase()

    if (yarn && yarn !== "completed") return "yarn"

    if (yarn === "completed" && fabric && fabric !== "completed") return "fabric"

    return null
  }, [seed?.yarn_terms_status, seed?.fabric_delivery_status])


  const resolver = useCallback(
    async (values, context, options) => {
      const splitEnabled = !!values?.split_quantity_enabled
      const schema = buildAgreementPlacementSchema({
        canEditYarn,
        canEditFabric,
        splitQuantityEnabled: splitEnabled,
        currentApprovalTag,
        activeApprovalType,
        stageHint,
      })
      return zodResolver(schema)(values, context, options)
    },
    [
      canEditYarn,
      canEditFabric,
      currentApprovalTag,
      activeApprovalType,
      stageHint,
    ]
  )

  const {
    control,
    setValue,
    getValues,
    watch,
    reset,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: defaults,
    resolver,
    mode: "onSubmit",
  })

  const [showYarn, setShowYarn] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activityOpen, setActivityOpen] = useState(false)

  useEffect(() => {
    reset(buildDefaults(seed, email))
  }, [reset, seed?.id, seed?.updated_at, email?.id])

  const qc = useMemo(
    () => String(seed?.quality ?? seed?.query_meta?.quality_code ?? "").trim(),
    [seed?.quality, seed?.query_meta?.quality_code, seed?.id, seed?.updated_at]
  )
  const design = useMemo(
    () => String(seed?.design ?? seed?.query_meta?.design ?? "").trim(),
    [seed?.design, seed?.query_meta?.design, seed?.id, seed?.updated_at]
  )
  const color = useMemo(
    () => String(seed?.colour ?? seed?.query_meta?.color ?? "").trim(),
    [seed?.colour, seed?.query_meta?.color, seed?.id, seed?.updated_at]
  )
  const widthSeed = useMemo(
    () => String(seed?.width ?? seed?.query_meta?.width ?? "").trim(),
    [seed?.width, seed?.query_meta?.width, seed?.id, seed?.updated_at]
  )

  const handleComputed = useCallback(
    (res) => {
      if (!res) return
      setValue("warp_yarn_required", r2(res.warp_yarn_required))
      setValue("weft_yarn_required", r2(res.weft_yarn_required))
      setValue("warp_bags", r2(res.warp_bags))
      setValue("weft_bags", r2(res.weft_bags))
      setValue("total_bags", r2(res.total_bags))
      setValue("rej_pct", r2(res.rej_pct))
      setValue("warp_coverage", r2(res.warp_coverage))
      setValue("weft_coverage", r2(res.weft_coverage))
      setValue("dyed_warp_bags", r2(res.dyed_warp_bags))
      setValue("dyed_weft_bags", r2(res.dyed_weft_bags))
      setValue("ecru_warp_bags", r2(res.ecru_warp_bags))
      setValue("ecru_weft_bags", r2(res.ecru_weft_bags))
      setValue("dyed_bags", r2(res.dyed_bags))
      setValue("ecru_bags", r2(res.ecru_bags))
    },
    [setValue]
  )

  const originalExecutionType =
    seed?.execution_type ?? seed?.payload?.execution_type ?? ""

  const payloadForSaveFrom = useCallback(
    (values, opts = {}) => {
      const { lockExecutionType = false } = opts
      const v = values || getValues()

      const topQuality = qc
      const topDesign = design
      const topColour = color
      const topWidth = v.width_cm || widthSeed || ""

      const executionTypeForPersist =
        lockExecutionType && seed?.id
          ? originalExecutionType || null
          : v.execution_type || seed?.execution_type || null
      const existingPayload = seed?.payload || {}

      return {
        owner: seed?.owner || email?.from_name || email?.from_address || null,
        agreement_no: v.agreement_no || seed?.agreement_no || "",
        item_no: seed?.item_no || "",
        colour: topColour || null,
        item_type: v.item_type || seed?.item_type || null,
        execution_type: executionTypeForPersist,
        start_date: dateToYMD(v.fabric_delivery),
        item_description:
          seed?.item_description || v.fabric_detail || seed?.description || "",
        quality: topQuality || null,
        design: topDesign || null,
        width: topWidth || "",
        description: v.fabric_detail || "",
        end_date: dateToYMD(v.need_by_date),
        email_id: email?.id || null,
        source: seed?.source || (email ? "email" : "manual"),
        payload: {
          ...existingPayload,
          ...v,
          execution_type: executionTypeForPersist,
          fabric_delivery: dateToYMD(v.fabric_delivery),
          need_by_date: dateToYMD(v.need_by_date),
        },
      }
    },
    [
      getValues,
      qc,
      design,
      color,
      widthSeed,
      seed?.id,
      seed?.owner,
      seed?.agreement_no,
      seed?.item_no,
      seed?.item_type,
      seed?.execution_type,
      seed?.item_description,
      seed?.description,
      seed?.source,
      email?.id,
      email?.from_name,
      email?.from_address,
      originalExecutionType,
    ]
  )

  const persistDraft = useCallback(
    async (values, opts = {}) => {
      const payload = payloadForSaveFrom(values, opts)
      if (seed?.id) return await updateAgreement(seed.id, payload)
      return await createAgreement(payload)
    },
    [seed?.id, payloadForSaveFrom]
  )

  const invalidateFeed = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["agreementsFeed"] })
  }, [queryClient])

  const doSaveDraft = useCallback(
    () =>
      handleSubmit(async (values) => {
        setSaving(true)
        try {
          const saved = await persistDraft(values)
          if (onAfterPersist) onAfterPersist(saved)
          invalidateFeed()
          if (refetch) refetch()
          return saved
        } finally {
          setSaving(false)
        }
      })(),
    [handleSubmit, persistDraft, onAfterPersist, invalidateFeed, refetch]
  )

  const doSubmit = useCallback(
    async (submissionType = "new", hierarchies = null) => {
      setSaving(true)
      try {
        const values = getValues()
        const saved = await persistDraft(values)

        const execType =
          values?.execution_type ||
          seed?.execution_type ||
          seed?.payload?.execution_type ||
          null

        const submitted = await submitAgreement(saved.id, submissionType, {
          execution_type: execType,
          hierarchies,
        })

        if (onAfterPersist) onAfterPersist(submitted)
        invalidateFeed()
        if (refetch) refetch()
        return submitted
      } finally {
        setSaving(false)
      }
    },
    [
      getValues,
      persistDraft,
      seed?.execution_type,
      seed?.payload?.execution_type,
      onAfterPersist,
      invalidateFeed,
      refetch,
    ]
  )

  const validateBeforeApprove = useCallback(async () => {
    return await trigger()
  }, [trigger])

  return {
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
    validateBeforeApprove,
  }
}
