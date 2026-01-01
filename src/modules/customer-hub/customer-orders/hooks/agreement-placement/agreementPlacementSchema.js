import { z } from "zod"

const isBlank = (v) => v == null || String(v).trim() === ""
const isPositiveNumber = (v) => Number.isFinite(Number(v)) && Number(v) > 0

const stageFromTag = (tag) => {
  const t = String(tag || "").toLowerCase()
  if (!t) return null
  if (t.includes("yarn_rate") || t.includes("yarn_revision")) return "yarn"
  if (t.includes("fabric_delivery") || t.includes("fabric_revision")) return "fabric"
  return null
}

const stageFromApprovalType = (approvalType) => {
  const t = String(approvalType || "").toLowerCase()
  if (!t) return null

  if (t.includes("agreement_yarn_rate")) return "yarn"
  if (t.includes("agreement_fabric_delivery")) return "fabric"

  if (t.includes("yarn rate")) return "yarn"
  if (t.includes("fabric delivery")) return "fabric"

  return null
}

export const buildAgreementPlacementSchema = ({
  canEditYarn,
  canEditFabric,
  splitQuantityEnabled,
  currentApprovalTag,
  activeApprovalType,
  stageHint,
}) => {
const activeStage =
  stageFromApprovalType(activeApprovalType) ||
  stageHint ||
  stageFromTag(currentApprovalTag) ||
  null

  console.log("activeStage", activeStage)
  console.log("stageHint",stageHint)
  console.log("currentApprovalTag",currentApprovalTag)
  console.log("activeApprovalType",activeApprovalType)
  const requireYarn = !!canEditYarn && activeStage === "yarn"
  const requireFabric = !!canEditFabric && activeStage === "fabric"

  return z
    .object({
      warp_yarn_rate: z.any().optional(),
      weft_yarn_rate: z.any().optional(),
      warp_delivery: z.any().optional(),
      weft_delivery: z.any().optional(),
      warp_yarn_source: z.any().optional(),
      weft_yarn_source: z.any().optional(),

      fabric_delivery: z.any().optional(),
      split_quantity_enabled: z.any().optional(),
      split_deliveries: z
      .array(
        z.object({
          fabric_delivery: z.any().optional(),
          need_by_date: z.any().optional(),
          quantity: z.any().optional(),
        })
      )
      .optional(),

    })
    .passthrough()
    .superRefine((data, ctx) => {
      if (requireYarn) {
        if (!isPositiveNumber(data.warp_yarn_rate)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["warp_yarn_rate"], message: "Warp Yarn Rate is required." })
        }
        if (!isPositiveNumber(data.weft_yarn_rate)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["weft_yarn_rate"], message: "Weft Yarn Rate is required." })
        }
        if (isBlank(data.warp_delivery)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["warp_delivery"], message: "Warp Delivery is required." })
        }
        if (isBlank(data.weft_delivery)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["weft_delivery"], message: "Weft Delivery is required." })
        }
        if (isBlank(data.warp_yarn_source)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["warp_yarn_source"], message: "Warp Yarn Source is required." })
        }
        if (isBlank(data.weft_yarn_source)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["weft_yarn_source"],  message: "Weft Yarn Source is required." })
        }
      }

      if (requireFabric) {
        if (splitQuantityEnabled) {
          const rows = Array.isArray(data.split_deliveries) ? data.split_deliveries : []

          if (rows.length === 0) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["split_deliveries"], message: "Fabric Delivery is required." })
            return
          }

          rows.forEach((r, idx) => {
            if (!isPositiveNumber(r?.quantity)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["split_deliveries", idx, "quantity"],
                message: "Qty is required.",
              })
            }

            if (isBlank(r?.need_by_date)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["split_deliveries", idx, "need_by_date"],
                message: "Need by date is required.",
              })
            }

            if (isBlank(r?.fabric_delivery)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["split_deliveries", idx, "fabric_delivery"],
                message: "Fabric delivery is required.",
              })
            }
          })

        } else {
          if (isBlank(data.fabric_delivery)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["fabric_delivery"], message: "Fabric Delivery is required.", })
          }
        }
      }
    })
}
