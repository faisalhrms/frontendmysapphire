import { useEffect, useRef, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { getHeaderRules, saveHeaderRules } from "@modules/beirholm-bi/services/DataHealthService.js"

export const operatorOptions = [
  { value: "invalid", label: "Contains any of (invalid)" },
  { value: "in", label: "Is one of (list)" },
  { value: "not_in", label: "Is not one of (list)" },
  { value: "is_blank", label: "Is blank/empty" },
  { value: "is_unknown", label: "Is placeholder (unknown/n-a/-/?)" },
  { value: "is_dots", label: "Is only dots (...)" },
  { value: "is_unique", label: "Unique values count" },
  { value: "eq", label: "Equals" },
  { value: "ne", label: "Not equal to" },
  { value: "regex", label: "Matches regex" },
  { value: "lt", label: "Less than (number)" },
  { value: "lte", label: "Less than or equal (number)" },
  { value: "gt", label: "Greater than (number)" },
  { value: "gte", label: "Greater than or equal (number)" },
  { value: "between", label: "Between min,max (numbers)" }
]
export const severityOptions = ["Low","Medium","High","Critical"].map(x=>({value:x,label:x}))

const normalizeId = v => typeof v === "object" && v !== null ? (v.value ?? v.id ?? null) : v ?? null

const parseRuleValue = (op, raw) => {
  if (op === "is_unique") return null
  if (raw === "" || raw == null) return null
  const s = String(raw).trim()
  if (s.startsWith("{") || s.startsWith("[")) {
    try { return JSON.parse(s) } catch { return s }
  }
  if (op === "in" || op === "not_in" || op === "invalid") return s.split(",").map(x=>x.trim()).filter(Boolean)
  if (op === "between") return s.split(",").map(x=>x.trim()).filter(Boolean).slice(0,2)
  return s
}

export const useDataHealthRulesetForm = (initialHeaderId) => {
  const { control, handleSubmit, setValue, watch, formState:{errors,isSubmitting} } = useForm({
    defaultValues: { header: initialHeaderId || null, rules: [] }
  })
  const { fields, append, remove, replace } = useFieldArray({ control, name: "rules" })
  const header = watch("header")
  const [headerData, setHeaderData] = useState({})
  const initialized = useRef(false)

  useEffect(() => {
    const initFromInitial = async () => {
      if (initialized.current) return
      if (!initialHeaderId) return
      if (normalizeId(header)) { initialized.current = true; return }
      const rows = await getHeaderRules(initialHeaderId)
      const hdr = rows?.[0]?.header
      if (hdr?.id) {
        setValue("header", hdr.id, { shouldDirty: false, shouldTouch: false })
        setHeaderData({ header: hdr })
      }
      replace(rows.map(r => ({ id:r.id, operator:r.operator, value:r.value ?? "", severity:r.severity })))
      initialized.current = true
    }
    initFromInitial()
  }, [initialHeaderId, header, setValue, replace])

  useEffect(() => {
    const load = async () => {
      const hid = normalizeId(header)
      if (!hid) { replace([]); setHeaderData({}); return }
      const rows = await getHeaderRules(hid)
      const hdr = rows?.[0]?.header
      if (hdr?.id) setHeaderData({ header: hdr })
      replace(rows.map(r => ({ id:r.id, operator:r.operator, value:r.value ?? "", severity:r.severity })))
    }
    if (normalizeId(header)) load()
  }, [header, replace])

  const onSubmit = async d => {
    const hid = normalizeId(d.header)
    const rules = d.rules.map(x => ({
      id: x.id,
      operator: x.operator,
      value: parseRuleValue(x.operator, x.value),
      severity: x.severity,
      enabled: true
    }))
    await saveHeaderRules({ header_id: hid, rules })
  }

  return { control, errors, isSubmitting, handleSubmit, onSubmit, fields, append, remove, operatorOptions, severityOptions, headerData }
}
