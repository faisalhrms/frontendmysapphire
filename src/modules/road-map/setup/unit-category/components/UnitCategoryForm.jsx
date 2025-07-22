import React from "react";
import {useLocation, useNavigate} from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import FormButton from "@components/form/FormButton.jsx";
import FormInput from "@components/form/FormInput.jsx";
import {useUnitCategory} from "@modules/road-map/setup/unit-category/hooks/useUnitCategory.js";
import FormSelect from "@components/form/FormSelect.jsx";
import {businessUnit, categoryType} from "@modules/road-map/setup/unit-category/services/UnitCategoryService.js";

const UnitCategoryForm = () => {
    const location = useLocation();
    const {id} = location.state || {};
    const {handleSubmit, control, errors, isSubmitting, onSubmit} = useUnitCategory(id);
    return (
        <div>
            <PageHeader currentpage={id ? "Edit Unit Category" : "Add Unit Category"} activepage="Unit Category"
                        mainpage={id ? "Edit Unit Category" : "Add Unit Category"}/>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="md:col-span-12 sm:col-span-12 col-span-12">
                        <div className="box">
                            <div className="box-header">
                                <div
                                    className="box-title">{id && id !== ":id" ? "Edit Unit Category" : "Add Unit Category"}</div>
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
                                      <FormSelect
                                            name="category_type"
                                            control={control}
                                            errors={errors}
                                            placeholder="Select Category Type"
                                            options={categoryType}
                                            label="Select Category Type"
                                        />
                                    </div>
                                    <div className="xl:col-span-4 col-span-12">
                                        <FormInput
                                            name="name"
                                            type="text"
                                            control={control}
                                            errors={errors}
                                            placeholder="Unit Category Name"/>
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

export default UnitCategoryForm;
