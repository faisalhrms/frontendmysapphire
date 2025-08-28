import React from 'react'
import {useLocation} from 'react-router-dom'
import PageHeader from '@modules/layouts/includes/PageHeader.jsx'
import FormButton from '@components/form/FormButton.jsx'
import FormSelect from '@components/form/FormSelect.jsx'
import FormAsyncSelect from '@components/form/FormAsyncSelect.jsx'
import MappingSection from './MappingSection.jsx'
import {businessUnit} from '@modules/road-map/setup/unit-category/services/UnitCategoryService.js'
import {formatOptions} from '@helpers/formatters.js'
import {useChain} from "@modules/road-map/Chain-Designer/hooks/useChain.js";

const ChainForm = () => {
    const {state} = useLocation()
    const {id} = state || {}
    const {handleSubmit, control, errors, isSubmitting, onSubmit, chain, watch} = useChain(id)
    const selectedBusinessUnit = watch('business_unit')
    return (
        <div>
            <PageHeader currentpage={id ? 'Edit Chain' : 'Add Chain'} activepage="Chain"
                        mainpage={id ? 'Edit Chain' : 'Add Chain'}/>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="md:col-span-12 sm:col-span-12 col-span-12">
                        <div className="box">
                            <div className="box-header">
                                <div
                                    className="box-title">{id && id !== ":id" ? "Edit Chain" : "Add Chain"}</div>
                            </div>
                            <div className="box-body">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="xl:col-span-3 col-span-12">
                                        <FormSelect
                                            name="business_unit"
                                            control={control}
                                            errors={errors}
                                            placeholder="Business Unit"
                                            options={businessUnit}
                                            label="Select Business Unit"
                                        />
                                    </div>
                                    <div className="xl:col-span-3 col-span-12">
                                        <FormAsyncSelect
                                            name="process_methods"
                                            control={control}
                                            errors={errors}
                                            clientSideSearch={true}
                                            placeholder="Process Methods"
                                            apiUrl={`/select/roadmap/process-methods?business_unit=${selectedBusinessUnit}`}
                                            queryKeyBase={`process-methods-${selectedBusinessUnit}`}
                                            preselectedOptions={formatOptions(chain, "process_method", "id", "name")}
                                        />
                                    </div>
                                    <div className="xl:col-span-3 col-span-12">
                                        <FormAsyncSelect
                                            name="qualities"
                                            control={control}
                                            errors={errors}
                                            clientSideSearch={true}
                                            placeholder="Qualities"
                                            apiUrl={`/select/roadmap/qualities?business_unit=${selectedBusinessUnit}`}
                                            queryKeyBase={`qualities-${selectedBusinessUnit}`}
                                            preselectedOptions={formatOptions(chain, "quality", "id", "name")}
                                        />
                                    </div>
                                    <div className="xl:col-span-3 col-span-12">
                                        <FormAsyncSelect
                                            name="products"
                                            isMulti={true}
                                            control={control}
                                            errors={errors}
                                            clientSideSearch={true}
                                            placeholder="Products"
                                            apiUrl={`/select/roadmap/products?business_unit=${selectedBusinessUnit}`}
                                            queryKeyBase={`products-${selectedBusinessUnit}`}
                                            preselectedOptions={formatOptions(chain, "products", "id", "name")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <MappingSection
                    title="Raw Materials"
                    fieldName="raw_materials"
                    selectedBusinessUnit={selectedBusinessUnit}
                    control={control}
                    errors={errors}
                />

                <MappingSection
                    title="Units"
                    fieldName="units"
                    selectedBusinessUnit={selectedBusinessUnit}
                    control={control}
                    errors={errors}
                    isUnit
                />

                <MappingSection
                    title="Accessories"
                    fieldName="accessories"
                    selectedBusinessUnit={selectedBusinessUnit}
                    control={control}
                    errors={errors}
                />

                <MappingSection
                    title="Packaging"
                    fieldName="packaging"
                    selectedBusinessUnit={selectedBusinessUnit}
                    control={control}
                    errors={errors}
                />

                <div className="px-6 py-4 border-t border-dashed flex justify-end">
                    <FormButton isLoading={isSubmitting} type="submit"/>
                </div>
            </form>
        </div>
    )
}

export default ChainForm
