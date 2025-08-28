import {useEffect, useState} from "react"
import {useForm} from "react-hook-form"
import {uploadChainBulkFD} from "@modules/road-map/Chain-Designer/services/ChainService.js"

export const useChainBulkUpload = () => {
  const {register, handleSubmit, formState:{errors}, reset, control} = useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const fd = new FormData()
      fd.append("business_unit", data.business_unit)
      if (data.sheet) fd.append("sheet", data.sheet)
      fd.append("file", data.file[0])
      const res = await uploadChainBulkFD(fd)
      setResult(res?.data)
      reset()
    } finally {
      setIsSubmitting(false)
    }
  }
  return {register, handleSubmit, errors, isSubmitting, onSubmit, control, result, reset}
}
