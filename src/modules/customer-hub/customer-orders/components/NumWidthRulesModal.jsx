import React, { useEffect, useMemo, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { Plus, Save, Trash2, X } from "lucide-react"
import FormInput from "@components/form/FormInput.jsx"
import FormSelect from "@components/form/FormSelect.jsx"
import {
  listNumWidthRules,
  createNumWidthRule,
  updateNumWidthRule,
  deleteNumWidthRule,
} from "@modules/customer-hub/customer-orders/services/NumWidthRuleService.js"

const ops = [
  { label: "<", value: "<" },
  { label: "<=", value: "<=" },
  { label: "=", value: "=" },
  { label: ">=", value: ">=" },
  { label: ">", value: ">" },
]

const narrowDefaultRow = {
  id: null,
  loom_type: "",
  operator: "<",
  width_in: "",
  panels: 2,
}

const NumWidthRulesModal = ({ isOpen, onClose, onSaved, loomTypeOptions = [] }) => {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [originalNarrowIds, setOriginalNarrowIds] = useState([])
  const [widerId, setWiderId] = useState(null)

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: { wider: { panels: 1 }, narrowRows: [] },
  })

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "narrowRows",
  })

  const loomTypeOpts = useMemo(() => {
    const base = [{ label: "All", value: "" }]
    const extras = (loomTypeOptions || []).filter(Boolean)
    return [...base, ...extras]
  }, [loomTypeOptions])

  const loadRows = async () => {
    setLoading(true)
    try {
      const all = await listNumWidthRules()

      const narrowRows = (all || [])
        .filter((r) => (r.band || r.loom_band) === "narrow")
        .map((r) => ({
          id: r.id,
          loom_type: r.loom_type ?? "",
          operator: r.operator || "<",
          width_in: r.width_in ?? "",
          panels: r.panels ?? 2,
        }))

      replace(narrowRows.length ? narrowRows : [])
      setOriginalNarrowIds(narrowRows.map((r) => r.id).filter(Boolean))

      const widerRow = (all || []).find((r) => (r.band || r.loom_band) === "wider")
      setWiderId(widerRow?.id ?? null)
      setValue("wider.panels", widerRow?.panels ?? 1)

      if (narrowRows.length === 0) {
        append(narrowDefaultRow)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) loadRows()
  }, [isOpen])

  const onSubmit = async (values) => {
    setSaving(true)
    try {
      const keepIds = []

      const saveTasks = (values.narrowRows || []).map((row) => {
        const payload = {
          band: "narrow",
          loom_type: row.loom_type ?? "",
          operator: row.operator,
          width_in: Number(row.width_in || 0),
          panels: Number(row.panels || 1),
        }

        if (row.id) {
          keepIds.push(row.id)
          return updateNumWidthRule(row.id, payload)
        }
        return createNumWidthRule(payload)
      })

      const toDelete = originalNarrowIds.filter((id) => !keepIds.includes(id))
      const deleteTasks = toDelete.map((id) => deleteNumWidthRule(id))

      const widerPanels = Number(values?.wider?.panels || 1)
      const widerPayload = {
        band: "wider",
        loom_type: "",
        operator: "",
        width_in: null,
        panels: widerPanels,
      }
      const widerTask = widerId
        ? updateNumWidthRule(widerId, widerPayload)
        : createNumWidthRule(widerPayload)

      await Promise.all([...saveTasks, ...deleteTasks, widerTask])
      onSaved && onSaved()
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  const ctrlClass = "!h-10"
  const narrowValues = watch("narrowRows") || []

  const bandSummary = (widthIn, panels) => {
    const w = Number(widthIn || 0)
    const p = Number(panels || 0)
    if (!w || !p) return null
    const total = w * p
    const band = total <= 80 ? "Narrow" : "Wider"
    return { total, band }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full sm:max-w-5xl bg-white dark:bg-[#151515] rounded-xl shadow-xl border dark:border-white/10">
        <div className="px-5 py-3 border-b dark:border-white/10 flex items-center justify-between">
          <div className="font-semibold">No. of Width Rules</div>
          <button
            onClick={onClose}
            className="ti-btn ti-btn-light !mb-0 !py-1 !px-2 rounded-md"
            type="button"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Wider rule */}
          <div className="rounded-lg border dark:border-white/10 p-4 bg-slate-50/60 dark:bg-white/5">
            <div className="font-semibold mb-3">Wider (All Looms / All Widths)</div>
            <div className="grid grid-cols-12 gap-3 items-end">
              <div className="col-span-12 sm:col-span-4">
                <label className="form-label">Loom Type</label>
                <div className="form-control w-full !rounded-sm border bg-gray-50 dark:bg-white/10 !h-10 flex items-center px-3">
                  All
                </div>
              </div>
              <div className="col-span-12 sm:col-span-4">
                <label className="form-label">Width</label>
                <div className="form-control w-full !rounded-sm border bg-gray-50 dark:bg-white/10 !h-10 flex items-center px-3">
                  All
                </div>
              </div>
              <div className="col-span-12 sm:col-span-4">
                <FormInput
                  name="wider.panels"
                  control={control}
                  errors={{}}
                  placeholder="Panels"
                  type="number"
                  className={ctrlClass}
                />
              </div>
            </div>
          </div>

          {/* Narrow rules */}
          <div className="space-y-3 rounded-lg border dark:border-white/10 p-4 bg-slate-50/60 dark:bg-white/5">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Narrow Rules</div>
              <button
                type="button"
                onClick={() => append(narrowDefaultRow)}
                className="ti-btn ti-btn-outline-primary !py-1 !px-2 !text-[0.75rem] inline-flex items-center gap-2"
              >
                <Plus size={14} /> Add row
              </button>
            </div>

            <div className="hidden sm:grid grid-cols-12 gap-3 font-medium uppercase text-slate-500 dark:text-white/60 px-1">
              <div className="col-span-3">Loom Type</div>
              <div className="col-span-2">Operator</div>
              <div className="col-span-2">Width (in)</div>
              <div className="col-span-2">Panels</div>
              <div className="col-span-2">Result</div>
              <div className="col-span-1 text-right pr-2" />
            </div>

            {loading && (
              <div className="text-xs text-slate-500 dark:text-white/60">
                Loading rules…
              </div>
            )}

            {fields.map((field, idx) => {
              const rowVals = narrowValues[idx] || {}
              const summary = bandSummary(rowVals.width_in, rowVals.panels)

              return (
                <div
                  key={`${field?.id ?? "new"}-${idx}`}
                  className="rounded-lg border dark:border-white/10 p-3 bg-white dark:bg-[#101010]"
                >
                  <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-12 sm:col-span-3">
                      <FormSelect
                        name={`narrowRows.${idx}.loom_type`}
                        control={control}
                        errors={{}}
                        placeholder="Loom Type"
                        options={loomTypeOpts}
                        label={false}
                        className={ctrlClass}
                      />
                    </div>
                    <div className="col-span-12 sm:col-span-2">
                      <FormSelect
                        name={`narrowRows.${idx}.operator`}
                        control={control}
                        errors={{}}
                        placeholder="Operator"
                        options={ops}
                        label={false}
                        className={ctrlClass}
                      />
                    </div>
                    <div className="col-span-12 sm:col-span-2">
                      <FormInput
                        name={`narrowRows.${idx}.width_in`}
                        control={control}
                        errors={{}}
                        placeholder="Width (in)"
                        type="number"
                        label={false}
                        className={ctrlClass}
                      />
                    </div>
                    <div className="col-span-12 sm:col-span-2">
                      <FormInput
                        name={`narrowRows.${idx}.panels`}
                        control={control}
                        errors={{}}
                        placeholder="Panels"
                        type="number"
                        label={false}
                        className={ctrlClass}
                      />
                    </div>
                    <div className="col-span-12 sm:col-span-2">
                      <div className="flex flex-col gap-1 sm:items-start">
                        {summary ? (
                          <span
                            className={
                              "inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[0.75rem] font-semibold border " +
                              (summary.band === "Narrow"
                                ? "border-emerald-200 text-emerald-700 bg-emerald-50/80 dark:border-emerald-500/40 dark:bg-emerald-900/20"
                                : "border-indigo-200 text-indigo-700 bg-indigo-50/80 dark:border-indigo-500/40 dark:bg-indigo-900/20")
                            }
                          >
                            {summary.total} in · {summary.band}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </div>
                    </div>
                    <div className="col-span-12 sm:col-span-1 flex sm:justify-end">
                      <button
                        type="button"
                        onClick={() => remove(idx)}
                        className="ti-btn ti-btn-outline-danger !py-1 !px-2 !text-[0.75rem]"
                        title="Remove this row"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="px-5 py-3 border-t dark:border-white/10 flex items-center justify-end gap-2">
          <button onClick={onClose} type="button" className="ti-btn ti-btn-light !mb-0">
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            type="button"
            className="ti-btn ti-btn-primary !mb-0 inline-flex items-center gap-2"
            disabled={saving}
          >
            <Save size={16} /> {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default NumWidthRulesModal
