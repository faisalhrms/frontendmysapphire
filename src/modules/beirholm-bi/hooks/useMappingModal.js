import { useForm } from 'react-hook-form'
import { uploadMappingExcel } from '@modules/beirholm-bi/services/dataMappingRuleService.js'

export const useMappingModal = () => {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: { data_category: '', product_country: '', file: null }
  })
  const submit = async d => {
    const fd = new FormData()
    fd.append('file', d.file[0])
    fd.append('data_category', d.data_category)
    fd.append('product_country', d.product_country)
    await uploadMappingExcel(fd)
  }
  return { handleSubmit, control, register, errors, isSubmitting, onSubmit: submit }
}
