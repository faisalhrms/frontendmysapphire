import React from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import PageHeader from '@modules/layouts/includes/PageHeader.jsx'
import FormButton from '@components/form/FormButton.jsx'
import FormInput from '@components/form/FormInput.jsx'
import FormAsyncSelect from '@components/form/FormAsyncSelect.jsx'
import FormSelect from '@components/form/FormSelect.jsx'
import {BEIRHOLM_BI_ROUTES} from '@modules/beirholm-bi/routes.js'
import {useDataMappingRule} from '@modules/beirholm-bi/hooks/useDataMappingRule.js'
import {productCountry} from '@modules/beirholm-bi/services/DataSanitizeService.js'
import {formatOptions} from "@helpers/formatters.js"

const DataMappingRuleForm = () => {
    const nav = useNavigate()
    const {id} = useLocation().state || {}
    const {
        handleSubmit,
        control,
        errors,
        isSubmitting,
        onSubmit,
        fields,
        append,
        remove,
        initial
    } = useDataMappingRule(id)
    const submit = async d => {
        await onSubmit(d)
        nav(BEIRHOLM_BI_ROUTES.DATA_MAPPING_RULE_LIST.path)
    }
    const initMapped = initial?.mapped || []
    console.log(initMapped)
    return (
        <div>
            <PageHeader currentpage={id ? 'Edit Mapping Rule' : 'Add Mapping Rule'} mainpage="Mapping Rules" activepage="Mapping Rules List"/>
            <div className="box">
                <div className="box-header">
                    <div className="box-title">{id ? 'Edit Mapping Rule' : 'Add Mapping Rule'}</div>
                </div>
                <div className="box-body">
                    <form onSubmit={handleSubmit(submit)}>
                        <div className="grid grid-cols-12 gap-4">
                            <div className="xl:col-span-3 col-span-12">
                                <FormSelect
                                    name="product_country"
                                    control={control}
                                    errors={errors}
                                    placeholder="Country"
                                    options={productCountry}
                                    label="Country"
                                />
                            </div>
                            <div className="xl:col-span-3 col-span-12">
                                <FormAsyncSelect
                                    label={true}
                                    name="source_header"
                                    control={control}
                                    errors={errors}
                                    placeholder="Source Header"
                                    apiUrl="/select/beirholm/excel/headers/"
                                    queryKeyBase="source_header"
                                    preselectedOptions={formatOptions(initial, 'source_header')}
                                />
                            </div>
                            <div className="xl:col-span-3 col-span-12">
                                <FormInput
                                    name="source_value"
                                    control={control}
                                    errors={errors}
                                    placeholder="Source Value"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-5">
                                <div className="box-title">Target Mappings</div>
                                <button
                                    type="button"
                                    onClick={() => append({mapped_header: '', mapped_value: ''})}
                                    className="ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                                >
                                    <i className="ri-add-line"></i> Add row
                                </button>
                            </div>
                            {fields.map((item, idx) => {
                                const initItem = initMapped[idx]
                                const preOpts = initItem
                                    ? [{value: initItem.mapped_header.id, label: initItem.mapped_header.name}]
                                    : []
                                return (
                                    <div key={item.id}
                                         className="flex items-center space-x-2 p-2 mb-2 bg-gray-50 rounded-md border">
                                        <FormAsyncSelect
                                            name={`mapped.${idx}.mapped_header`}
                                            control={control}
                                            errors={errors}
                                            placeholder="Mapped Header"
                                            apiUrl="/select/beirholm/excel/headers/"
                                            queryKeyBase={['mapped_header', idx]}
                                            className="flex-1"
                                            preselectedOptions={preOpts}
                                        />
                                        <FormInput
                                            name={`mapped.${idx}.mapped_value`}
                                            control={control}
                                            errors={errors}
                                            placeholder="Mapped Value"
                                            className="flex-1"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => remove(idx)}
                                            className="ti-btn ti-btn-danger ti-btn-sm flex items-center"
                                        >
                                            <i className="ti ti-trash"></i>
                                        </button>
                                    </div>
                                )
                            })}

                        </div>
                        <div className="px-6 py-4 border-t sm:flex justify-end">
                            <FormButton isLoading={isSubmitting}/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default DataMappingRuleForm
