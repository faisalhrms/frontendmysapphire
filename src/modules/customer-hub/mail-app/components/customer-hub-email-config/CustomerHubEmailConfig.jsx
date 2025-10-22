import React, { Fragment, useState } from 'react'
import { useLocation } from 'react-router-dom'
import IconPageHeader from '@modules/layouts/includes/IconPageHeader.jsx'
import { Mails, Save, ChevronDown, ChevronRight, Search } from 'lucide-react'
import FormInput from '@components/form/FormInput.jsx'
import FormToggle from '@components/form/FormToggle.jsx'
import FormSelect from '@components/form/FormSelect.jsx'
import FormTextarea from '@components/form/FormTextarea.jsx'
import { useCustomerHubConfig } from "@modules/customer-hub/mail-app/hooks/useCustomerHubConfig.js";

const typeOptions = [
  {value:'str', label:'str'},
  {value:'date', label:'date'},
  {value:'decimal', label:'decimal'},
  {value:'int', label:'int'}
]

const CustomerHubEmailConfig = () => {
  const { id, new: isNew } = useLocation().state || {}
  const {
    handleSubmit,
    onSubmit,
    control,
    errors,
    subjectFA,
    fromFA,
    rulesFA,
    parsedPreview,
    isSubmitting
  } = useCustomerHubConfig(id, { forceBlank: !!isNew })

  const [rulesOpen, setRulesOpen] = useState(true)
  const [ruleSearch, setRuleSearch] = useState('')

  return (
    <Fragment>
      <IconPageHeader heading="Email Settings" description="Configure inbound email rules" icon={Mails} />
      <div className="container sm:p-3 !p-0">
        <div className="grid grid-cols-12 gap-6">
          <form onSubmit={handleSubmit(onSubmit)} className="xl:col-span-8 col-span-12">
            <div className="box">
              <div className="box-header"><div className="box-title">Configuration</div></div>
              <div className="box-body space-y-6">
                <div className="grid grid-cols-12 gap-4">
                  <div className="xl:col-span-12 col-span-12">
                    <FormInput name="mailbox_email" control={control} errors={errors} placeholder="Mailbox Email" />
                  </div>
                  <div className="xl:col-span-2 col-span-6">
                    <FormToggle name="use_unread_only" label control={control} errors={errors} placeholder="Unread only" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="box-title">Subject Patterns</div>
                    <button type="button" onClick={()=>subjectFA.append({value:''})} className="ti-btn ti-btn-outline-primary !py-1 !px-2 !text-[0.75rem] mr-2"><i className="bi bi-plus-circle-fill"></i>Add row</button>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    {subjectFA.fields.map((f,i)=>(
                      <div key={f.id} className="col-span-12 flex items-center gap-2">
                        <FormInput
                          name={`subject_patterns.${i}.value`}
                          control={control}
                          errors={errors}
                          label={false}
                          placeholder="Subject text or *wildcards*"
                          className="flex-1"
                        />
                        <button type="button" onClick={()=>subjectFA.remove(i)} className="ti-btn ti-btn-outline-danger !py-1 !px-2 !text-[0.75rem]"><i className="bi bi-trash3-fill"></i></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="box-title">From Filters</div>
                    <button type="button" onClick={()=>fromFA.append({value:''})} className="ti-btn ti-btn-outline-primary !py-1 !px-2 !text-[0.75rem] mr-2"><i className="bi bi-plus-circle-fill"></i>Add row</button>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    {fromFA.fields.map((f,i)=>(
                      <div key={f.id} className="col-span-12 flex items-center gap-2">
                        <FormInput
                          name={`from_filters.${i}.value`}
                          control={control}
                          errors={errors}
                          label={false}
                          placeholder="buyer@beirholm.dk or *@beirholm.dk or domain:beirholm.dk"
                          className="flex-1"
                        />
                        <button type="button" onClick={()=>fromFA.remove(i)} className="ti-btn ti-btn-outline-danger !py-1 !px-2 !text-[0.75rem]"><i className="bi bi-trash3-fill"></i></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border rounded-md">
                  <div className="px-4 py-3 flex items-center justify-between sticky top-0 bg-white dark:bg-bgdark z-10 border-b rounded-t-md">
                    <button type="button" onClick={()=>setRulesOpen(o=>!o)} className="flex items-center gap-2">
                      {rulesOpen ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                      <span className="box-title !mb-0">Body Rules</span>
                      <span className="text-xs opacity-60">({rulesFA.fields.length})</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 opacity-60"/>
                        <input
                          value={ruleSearch}
                          onChange={e=>setRuleSearch(e.target.value)}
                          placeholder="Search rules"
                          className="form-control !pl-8 !py-1 !h-9"
                        />
                      </div>
                      <button type="button" onClick={()=>rulesFA.append({label_re:'', key:'', type:'str'})} className="ti-btn ti-btn-outline-primary !py-1 !px-2 !text-[0.75rem] mr-2"><i className="bi bi-plus-circle-fill"></i>Add row</button>
                    </div>
                  </div>
                  {rulesOpen && (
                    <div className="p-2 max-h-[40vh] overflow-y-auto">
                      <div className="space-y-2">
                        {rulesFA.fields.map((f,i)=>{
                          const show = !ruleSearch ||
                            String(f?.label_re || '').toLowerCase().includes(ruleSearch.toLowerCase()) ||
                            String(f?.key || '').toLowerCase().includes(ruleSearch.toLowerCase())
                          return (
                            <div key={f.id} className={`col-span-12 lg:col-span-6 ${show ? '' : 'hidden'}`}>
                              <div className="grid grid-cols-12 gap-2 items-center p-2 bg-gray-50 dark:bg-black/20 rounded border">
                                <div className="col-span-6">
                                  <FormInput name={`body_rules.kv_rules.${i}.label_re`} label={false} control={control} errors={errors} placeholder="Label text" />
                                </div>
                                <div className="col-span-3">
                                  <FormInput name={`body_rules.kv_rules.${i}.key`} label={false} control={control} errors={errors} placeholder="key_name" />
                                </div>
                                <div className="col-span-2">
                                  <FormSelect name={`body_rules.kv_rules.${i}.type`} label={false} control={control} errors={errors} options={typeOptions} placeholder="Type" />
                                </div>
                                <div className="col-span-1 flex justify-end">
                                  <button type="button" onClick={()=>rulesFA.remove(i)} className="ti-btn ti-btn-outline-danger !py-1 !px-2 !text-[0.75rem]"><i className="bi bi-trash3-fill"></i></button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="box-footer flex justify-end">
                <button type="submit" disabled={isSubmitting} className="ti-btn ti-btn-primary disabled:opacity-60"><Save size={16}/>Save</button>
              </div>
            </div>
          </form>

          <div className="xl:col-span-4 col-span-12">
            <div className="box">
              <div className="box-header"><div className="box-title">Test & Preview</div></div>
              <div className="box-body space-y-4">
                <FormTextarea name="preview_body" needLabel={false} control={control} errors={errors} placeholder="Paste sample raw body here" rows={16} />
                <div className="text-xs opacity-70">Parsed Output</div>
                <pre className="bg-gray-50 dark:bg-black/20 rounded p-3 text-xs overflow-auto">{JSON.stringify(parsedPreview, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default CustomerHubEmailConfig
