import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import {
  createMappingRule,
  mappingRuleById,
  updateMappingRule
} from '@modules/beirholm-bi/services/dataMappingRuleService.js'

export const useDataMappingRule = id => {
  const [initial, setInitial] = useState(null)
  const { handleSubmit, control, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      product_country: '',
      data_category: '',
      source_header: null,
      source_value: '',
      mapped: [{ mapped_header: null, mapped_value: '' }]
    }
  })
  const { fields, append, remove, replace } = useFieldArray({ control, name: 'mapped' })
  useEffect(() => {
    if (!id) return
    mappingRuleById(id).then(res => {
      setInitial(res)
      const rows = res.mapped?.length
        ? res.mapped.map(r => ({ mapped_header: r.mapped_header.id, mapped_value: r.mapped_value }))
        : [{ mapped_header: null, mapped_value: '' }]
      replace(rows)
      setValue('product_country', res.product_country)
      setValue('data_category', res.data_category.id)
      setValue('source_header', res.source_header.id)
      setValue('source_value', res.source_value)
    })
  }, [id, replace, setValue])
  const idOrValue = v => (v && typeof v === 'object' ? v.id ?? v.value : v)
  const submit = async d => {
    const payload = {
      product_country: d.product_country,
      data_category: d.data_category,
      source_header: idOrValue(d.source_header),
      source_value: d.source_value,
      mapped: d.mapped.map(r => ({
        mapped_header: idOrValue(r.mapped_header),
        mapped_value: r.mapped_value
      }))
    }
    id ? await updateMappingRule(id, payload) : await createMappingRule(payload)
  }
  return { handleSubmit, control, errors, isSubmitting, onSubmit: submit, fields, append, remove, initial }
}
