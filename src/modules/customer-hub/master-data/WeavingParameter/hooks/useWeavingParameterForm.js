import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useLocation } from "react-router-dom"
import { createWeavingParameter, getWeavingParameterById, updateWeavingParameter } from "@modules/customer-hub/master-data/WeavingParameter/services/WeavingParameterService.js"
import { MASTER_DATA } from "@modules/customer-hub/routes.js"

export const useWeavingParameterForm = (editMode = false, paramId = null) => {
  const navigate = useNavigate()
  const location = useLocation()
  const locationId = location?.state?.id ?? null
  const resolvedId = paramId ?? locationId
  const resolvedEdit = editMode || Boolean(resolvedId)

  const { handleSubmit, control, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      weft_method:"", process_type:"", loom_type:"", machine_type:"", weave:"",
      wider_loom_speed:"", wider_efficiency:"", wider_reject_percent:"",
      narrow_loom_speed:"", narrow_efficiency:"", narrow_reject_percent:"",
      recovery:"", dyeing_cost_percent:"", packing_cost_per_yard:""
    }
  })

  useEffect(() => {
    if (!resolvedEdit || !resolvedId) return
    ;(async () => {
      const res = await getWeavingParameterById(resolvedId)
      const d = res?.data?.data ?? res?.data ?? {}
      reset({
        weft_method: d.weft_method ?? "",
        process_type: d.process_type ?? "",
        loom_type: d.loom_type ?? "",
        machine_type: d.machine_type ?? "",
        weave: d.weave ?? "",
        wider_loom_speed: d.wider_loom_speed ?? "",
        wider_efficiency: d.wider_efficiency ?? "",
        wider_reject_percent: d.wider_reject_percent ?? "",
        narrow_loom_speed: d.narrow_loom_speed ?? "",
        narrow_efficiency: d.narrow_efficiency ?? "",
        narrow_reject_percent: d.narrow_reject_percent ?? "",
        recovery: d.recovery ?? "",
        dyeing_cost_percent: d.dyeing_cost_percent ?? "",
        packing_cost_per_yard: d.packing_cost_per_yard ?? ""
      })
    })()
  }, [resolvedEdit, resolvedId, reset, setValue])

  const onSubmit = async (data) => {
    if (resolvedEdit && resolvedId) await updateWeavingParameter(resolvedId, data)
    else await createWeavingParameter(data)
    navigate(`${MASTER_DATA.READ.path}?tab=weaving-params`)
  }

  return { control, errors, handleSubmit, onSubmit, isSubmitting, resolvedEdit }
}
