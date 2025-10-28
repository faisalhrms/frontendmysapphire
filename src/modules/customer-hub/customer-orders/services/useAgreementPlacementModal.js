import { useState } from "react"
import { useForm } from "react-hook-form"
import Notify from "@helpers/toastNotifications.js"
import { createAgreement } from "@modules/customer-hub/customer-orders/services/AgreementService.js"

export const useAgreementPlacementModal = (onCreated) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm({
    defaultValues: {
      owner: "",
      agreement_no: "",
      agreement_type: "",
      item_no: "",
      colour: "",
      item_type: "Finished",
      start_date: "",
      item_description: "",
      quality: "",
      design: "",
      width: "",
      vendor_design: "",
      description: "",
      agreed_min_qty: "",
      log_agreed_min_qty: "",
      agreed_max_qty: "",
      log_agreed_max_qty: "",
      end_date: "",
      log_end_date: "",
    }
  })
  const openModal = () => {
    const modal = document.getElementById("itemModal")
    if (modal && window.HSOverlay) window.HSOverlay.open(modal)
  }
  const closeModal = () => {
    const modal = document.getElementById("itemModal")
    if (modal && window.HSOverlay) window.HSOverlay.close(modal)
    form.reset()
  }
  const onSubmit = async (vals) => {
    setIsSubmitting(true)
    try {
      const payload = {
        source: "manual",
        owner: vals.owner || null,
        agreement_no: vals.agreement_no || "",
        item_no: vals.item_no || null,
        colour: vals.colour || null,
        item_type: vals.item_type || null,
        start_date: vals.start_date || null,
        item_description: vals.item_description || null,
        quality: vals.quality || null,
        design: vals.design || null,
        width: vals.width || null,
        vendor_design: vals.vendor_design || null,
        description: vals.description || null,
        agreed_min_qty: vals.agreed_min_qty || null,
        log_agreed_min_qty: vals.log_agreed_min_qty || null,
        agreed_max_qty: vals.agreed_max_qty || null,
        log_agreed_max_qty: vals.log_agreed_max_qty || null,
        end_date: vals.end_date || null,
        log_end_date: vals.log_end_date || null,
        status: "draft",
        payload: { agreement_type: vals.agreement_type || "" }
      }
      const created = await createAgreement(payload)
      if (created?.id) {
        Notify.success("Agreement created")
        closeModal()
        if (onCreated) onCreated(created)
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  return {
    openModal,
    closeModal,
    control: form.control,
    errors: form.formState.errors,
    isSubmitting,
    handleSubmit: form.handleSubmit,
    onSubmit,
  }
}
