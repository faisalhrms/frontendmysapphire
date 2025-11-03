import { useState } from "react"
import { useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import Notify from "@helpers/toastNotifications.js"
import { createAgreement, updateAgreement } from "@modules/customer-hub/customer-orders/services/AgreementService.js"

export const useAgreementPlacementModal = (onCreated) => {
  const user = useSelector((state) => state.auth.user)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)
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
    setEditingId(null)
    form.reset()
  }
  const openForEdit = (ag) => {
    const p = ag?.payload || {}
    form.reset({
      owner: ag.owner || user?.full_name || user?.name || user?.email || "",
      agreement_no: ag.agreement_no || "",
      agreement_type: p.agreement_type || "",
      item_no: ag.item_no || "",
      colour: ag.colour || "",
      item_type: ag.item_type || "Finished",
      start_date: ag.start_date || "",
      end_date: ag.end_date || "",
      item_description: ag.item_description || ag.description || "",
      quality: ag.quality || p.quality || "",
      design: ag.design || p.design || "",
      width: ag.width || p.width || "",
      vendor_design: ag.vendor_design || "",
      description: ag.description || "",
      agreed_min_qty: ag.agreed_min_qty || "",
      log_agreed_min_qty: ag.log_agreed_min_qty || "",
      agreed_max_qty: ag.agreed_max_qty || "",
      log_agreed_max_qty: ag.log_agreed_max_qty || "",
      log_end_date: ag.log_end_date || "",
    })
    setEditingId(ag.id)
    openModal()
  }
  const onSubmit = async (vals) => {
    setIsSubmitting(true)
    try {
      const payload = {
        source: "manual",
        owner: vals.owner || user?.full_name || user?.name || user?.email || "",
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
        payload: {
          agreement_type: vals.agreement_type || "",
          order_date: vals.start_date || new Date().toISOString().slice(0, 10),
          created_by_id: user?.id || null,
          created_by_name: user?.full_name || user?.name || user?.email || null
        }
      }
      let res
      if (editingId) {
        res = await updateAgreement(editingId, payload)
        Notify.success("Agreement updated")
      } else {
        res = await createAgreement(payload)
        Notify.success("Agreement created")
      }
      closeModal()
      if (onCreated) onCreated(res)
    } finally {
      setIsSubmitting(false)
    }
  }
  return {
    openModal,
    openForEdit,
    closeModal,
    control: form.control,
    errors: form.formState.errors,
    isSubmitting,
    handleSubmit: form.handleSubmit,
    onSubmit,
    isEdit: !!editingId,
  }
}
