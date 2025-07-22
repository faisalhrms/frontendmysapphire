import {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import {useNavigate} from 'react-router-dom'
import {createChain, getChainById, updateChain} from '@modules/road-map/Chain-Designer/services/ChainService.js'

const mapRows = rows =>
  (rows || []).map(r => ({
    item          : r.unit?.id        || '',
    item_label    : r.unit?.name      || '',
    supplier      : r.supplier?.id    || '',
    supplier_label: r.supplier?.name  || '',
    dyes_method   : r.dyes_method?.id || '',
    dyes_label    : r.dyes_method?.name || '',
    stitch_type   : r.stitch_type?.id || '',
    stitch_label  : r.stitch_type?.name || '',
    sort_order    : r.sort_order      || 0
  }))

export const useChain = id => {
  const nav = useNavigate()
  const [chain, setChain] = useState(null)

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: {errors, isSubmitting}
  } = useForm({
    defaultValues: {
      business_unit : '',
      process_methods: '',
      qualities      : '',
      products       : [],
      raw_materials  : [],
      units          : [],
      accessories    : [],
      packaging      : []
    }
  })

  useEffect(() => { if (id) getChainById(id).then(r => setChain(r.data)) }, [id])

  useEffect(() => {
    if (!chain) return
    reset({
      business_unit : chain.business_unit,
      process_methods: chain.process_method?.id || '',
      qualities      : chain.quality?.id       || '',
      products       : chain.products?.id || [],
      raw_materials  : mapRows(chain.raw_materials),
      units          : mapRows(chain.units_detail),
      accessories    : mapRows(chain.accessories),
      packaging      : mapRows(chain.packaging)
    })
  }, [chain, reset])

  const submit = async d => {
    id ? await updateChain(id, d) : await createChain(d)
    nav(-1)
  }

  return {handleSubmit, control, errors, isSubmitting, onSubmit: submit, chain, watch}
}
