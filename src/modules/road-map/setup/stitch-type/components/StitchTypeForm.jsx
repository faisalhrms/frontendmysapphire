import React from "react";
import {useLocation} from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import FormButton from "@components/form/FormButton.jsx";
import FormInput from "@components/form/FormInput.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import {businessUnit} from "@modules/road-map/setup/unit-category/services/UnitCategoryService.js";
import {useStitchType} from "@modules/road-map/setup/stitch-type/hooks/useStitchType.js";

const StitchTypeForm = () => {
    const location = useLocation();
    const {id} = location.state || {};
    const {handleSubmit, control, errors, isSubmitting, onSubmit, unit, watch} = useStitchType(id);
    return (
        <div>
            <PageHeader currentpage={id ? "Edit Stitch Type" : "Add Stitch Type"} activepage="Stitch Type"
                        mainpage={id ? "Edit Stitch Type" : "Add Stitch Type"}/>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="md:col-span-12 sm:col-span-12 col-span-12">
                        <div className="box">
                            <div className="box-header">
                                <div
                                    className="box-title">{id && id !== ":id" ? "Edit Stitch Type" : "Add Stitch Type"}</div>
                            </div>
                            <div className="box-body">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="xl:col-span-4 col-span-12">
                                        <FormSelect
                                            name="business_unit"
                                            control={control}
                                            errors={errors}
                                            placeholder="Select Business Unit"
                                            options={businessUnit}
                                            label="Select Business Unit"
                                        />
                                    </div>
                                    <div className="xl:col-span-4 col-span-12">
                                        <FormInput
                                            name="name"
                                            type="text"
                                            control={control}
                                            errors={errors}
                                            placeholder="Stitch Type Name"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-dashed sm:flex justify-end">
                    <FormButton isLoading={isSubmitting} type="submit"/>
                </div>
            </form>
        </div>
    );
};

export default StitchTypeForm;
