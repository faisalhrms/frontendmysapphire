import React, { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx"
import SubFormSection from "@components/form/SubFormSection.jsx"
import FormSelect from "@components/form/FormSelect.jsx"
import FormButton from "@components/form/FormButton.jsx"
import FormInput from "@components/form/FormInput.jsx"
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx"
import { BEIRHOLM_BI_ROUTES } from "@modules/beirholm-bi/routes.js"
import { ListPlus, Trash2, Settings2 } from "lucide-react"
import { useDataHealthRulesetForm } from "@modules/beirholm-bi/hooks/useDataHealthRuleset.js"
import { useWatch } from "react-hook-form"
import { formatOptions } from "@helpers/formatters.js"

export const helpText = {
  in: "Enter a comma-separated list. Matches when the cell equals any item.",
  not_in: "Enter a comma-separated list. Matches when the cell is not any item.",
  is_blank: "No value needed. Matches empty strings, nulls, or empty lists.",
  is_unknown: "No value needed. Matches placeholders like unknown, n/a, -, ?",
  is_dots: "No value needed. Matches values made only of dots like ....",
  is_unique: "No value needed. Counts distinct non-blank, non-unknown values per month.",
  eq: "Enter exact value. Matches when the cell equals it.",
  ne: "Enter exact value. Matches when the cell is different.",
  regex: "Enter a regex. Example ^[A-Z]+$",
  lt: "Enter a number. Matches when the cell is less than it.",
  lte: "Enter a number. Matches when the cell is less than or equal.",
  gt: "Enter a number. Matches when the cell is greater than it.",
  gte: "Enter a number. Matches when the cell is greater than or equal.",
  between: "Enter two numbers as min,max. Inclusive range.",
  invalid: "Enter a word or a comma-separated list. Matches when the cell contains any term."
}


const DataHealthRulesetEditor = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const initialHeaderId = location.state?.headerId ?? null
  const { control, errors, isSubmitting, handleSubmit, onSubmit, fields, append, remove, operatorOptions, severityOptions, headerData } = useDataHealthRulesetForm(initialHeaderId)
  const rules = useWatch({ control, name: "rules" }) || []

  useEffect(() => {
    if (fields.length === 0) append({ operator: "is_blank", value: "", severity: "Medium" })
  }, [fields.length, append])

  const submitAndGoList = async () => {
    await handleSubmit(onSubmit)()
    navigate(BEIRHOLM_BI_ROUTES.DATA_HEALTH_FLOW_LIST.path)
  }

  return (
    <>
      <IconPageHeader heading="Header Rules" description="Select a header and manage its rules" icon={Settings2} />
      <div className="container sm:p-3 !p-0">
        <div className="grid grid-cols-12 gap-6">
          <div className="xl:col-span-4 col-span-12">
            <SubFormSection title="Select Header">
              <FormAsyncSelect
                label={true}
                name="header"
                control={control}
                errors={errors}
                placeholder="Header Name"
                apiUrl="/select/beirholm/excel/headers/"
                queryKeyBase="header"
                preselectedOptions={formatOptions(headerData, "header")}
                allowSaveNewOption={false}
              />
            </SubFormSection>
          </div>

          <div className="xl:col-span-8 col-span-12">
            <SubFormSection title="Rules">
              <div className="flex justify-end mb-3">
                <button
                  type="button"
                  onClick={() => append({ operator: "is_blank", value: "", severity: "Medium" })}
                  className="ti-btn ti-btn-primary inline-flex items-center gap-2"
                >
                  <ListPlus size={16} />
                </button>
              </div>
              <div className="space-y-3">
                {fields.map((item, idx) => {
                  const op = rules[idx]?.operator || "eq"
                  return (
                    <div key={item.id || idx} className="grid grid-cols-12 gap-3 p-3 border rounded">
                      <div className="col-span-3">
                        <FormSelect name={`rules.${idx}.operator`} control={control} errors={errors} options={operatorOptions} placeholder="Operator" />
                      </div>
                      <div className="col-span-3">
                        <FormInput name={`rules.${idx}.value`} control={control} errors={errors} placeholder="Value" />
                      </div>
                      <div className="col-span-3">
                        <FormSelect name={`rules.${idx}.severity`} control={control} errors={errors} options={severityOptions} placeholder="Severity" />
                      </div>
                      <div className="col-span-3 flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => remove(idx)}
                          className="ti-btn ti-btn-outline-danger !p-0 !h-8 !w-8 !rounded-md flex items-center justify-center"
                          aria-label="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="col-span-12 text-[11px] text-slate-500">{helpText[op]}</div>
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-end mt-4">
                <FormButton isLoading={isSubmitting} onClick={submitAndGoList} text="Save" submitTxt="Saving..." />
              </div>
            </SubFormSection>
          </div>
        </div>
      </div>
    </>
  )
}

export default DataHealthRulesetEditor
