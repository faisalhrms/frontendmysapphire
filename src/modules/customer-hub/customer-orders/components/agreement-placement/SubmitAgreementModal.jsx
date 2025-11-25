import React, { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import FormSelect from "@components/form/FormSelect.jsx"
import {
  AGREEMENT_EXECUTION_TYPES,
} from "@modules/customer-hub/customer-orders/components/agreement-placement/AgreementPlacementModal.jsx"

const SubmitAgreementModal = ({
  closeModal,
  onConfirm,
  yarnTermsStatus,
  fabricDeliveryStatus,
  status,
  initialExecutionType,
}) => {
  const [submissionType, setSubmissionType] = useState("new")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const modalId = "submitAgreementModal"

  const {
    control,
    handleSubmit: rhfHandleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      execution_type: initialExecutionType || "",
    },
  })

  useEffect(() => {
    reset({ execution_type: initialExecutionType || "" })
  }, [initialExecutionType, reset])

  const cleanup = () => {
    document.querySelectorAll(".hs-overlay-backdrop").forEach((el) => el.remove())
    document.documentElement.classList.remove("hs-overlay-open")
    document.body.classList.remove("hs-overlay-open", "overflow-hidden")
  }

  const handleClose = useCallback(() => {
    const el = document.getElementById(modalId)
    if (el && window.HSOverlay?.close) window.HSOverlay.close(el)
    setTimeout(() => {
      cleanup()
      closeModal?.()
    }, 200)
  }, [closeModal])

  useEffect(() => {
    const el = document.getElementById(modalId)
    if (el && window.HSOverlay?.open) window.HSOverlay.open(el)
    return () => {
      try {
        if (el && window.HSOverlay?.close) window.HSOverlay.close(el)
      } catch {}
      cleanup()
    }
  }, [])

  const onSubmit = async (values) => {
    if (!onConfirm) return
    setIsSubmitting(true)
    try {
      await onConfirm(submissionType, values.execution_type || null)
      handleClose()
    } catch (err) {
    } finally {
      setIsSubmitting(false)
    }
  }

  const stageLabel = (v) => {
    if (!v || v === "pending") return "Pending"
    if (v === "completed") return "Completed"
    if (v === "under_approval") return "Under approval"
    if (v === "revision") return "Revision"
    return v
  }

  return (
    <div
      id={modalId}
      data-hs-overlay-keyboard="false"
      className="hs-overlay ti-modal [--overlay-backdrop:static] backdrop-blur-[0.08rem]"
    >
      <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center">
        <div className="max-h-full mx-auto overflow-hidden ti-modal-content">
          <form onSubmit={rhfHandleSubmit(onSubmit)}>
            <div className="ti-modal-header">
              <h6 className="modal-title">Submit Agreement</h6>
              <button
                type="button"
                className="hs-dropdown-toggle ti-modal-close-btn"
                onClick={handleClose}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="w-3.5 h-3.5"
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                >
                  <path
                    d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>

            <div className="ti-modal-body overflow-y-auto max-h-[calc(100vh-200px)]">
              <div className="space-y-5">
                <div className="rounded-lg border border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 px-3 py-3">
                  <FormSelect
                    name="execution_type"
                    control={control}
                    errors={errors}
                    options={AGREEMENT_EXECUTION_TYPES}
                    placeholder="Execution Type"
                    is_required
                  />
                </div>

                <div className="rounded-lg border border-slate-200/80 dark:border-white/10 bg-gradient-to-r from-slate-50 via-slate-50 to-slate-50 dark:from-white/5 dark:via-white/5 dark:to-white/5 px-3 py-3">
                  <div className="text-xs opacity-80 space-y-1">
                    <div>
                      Yarn terms status:{" "}
                      <span className="font-semibold">
                        {stageLabel(yarnTermsStatus)}
                      </span>
                    </div>
                    <div>
                      Fabric delivery status:{" "}
                      <span className="font-semibold">
                        {stageLabel(fabricDeliveryStatus)}
                      </span>
                    </div>
                    {status && (
                      <div>
                        Agreement status:{" "}
                        <span className="font-semibold capitalize">
                          {String(status || "")
                            .split("_")
                            .join(" ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm opacity-80">
                    Select how you want to submit this agreement.
                  </p>

                  <label className="flex items-start gap-3 cursor-pointer rounded-lg border border-slate-200/80 dark:border-white/10 px-3 py-2 hover:bg-slate-50/70 dark:hover:bg-white/5 transition-colors">
                    <input
                      type="radio"
                      name="submission_type"
                      value="new"
                      checked={submissionType === "new"}
                      onChange={() => setSubmissionType("new")}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-sm font-medium">New agreement</div>
                      <div className="text-xs opacity-70">
                        Normal submission for a fresh agreement.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer rounded-lg border border-slate-200/80 dark:border-white/10 px-3 py-2 hover:bg-slate-50/70 dark:hover:bg-white/5 transition-colors">
                    <input
                      type="radio"
                      name="submission_type"
                      value="yarn_rate_revision"
                      checked={submissionType === "yarn_rate_revision"}
                      onChange={() => setSubmissionType("yarn_rate_revision")}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-sm font-medium">Yarn rate revision</div>
                      <div className="text-xs opacity-70">
                        Send for approval as a yarn rate revision.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer rounded-lg border border-slate-200/80 dark:border-white/10 px-3 py-2 hover:bg-slate-50/70 dark:hover:bg-white/5 transition-colors">
                    <input
                      type="radio"
                      name="submission_type"
                      value="fabric_delivery_revision"
                      checked={submissionType === "fabric_delivery_revision"}
                      onChange={() => setSubmissionType("fabric_delivery_revision")}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-sm font-medium">
                        Fabric delivery revision
                      </div>
                      <div className="text-xs opacity-70">
                        Send for approval as a fabric delivery revision.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="ti-modal-footer">
              <button
                type="button"
                onClick={handleClose}
                className="ti-btn ti-btn-light !mb-0 text-sm"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ti-btn ti-btn-success !mb-0 text-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SubmitAgreementModal
