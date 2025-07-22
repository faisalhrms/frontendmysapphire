import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import FormButton from "@components/form/FormButton.jsx";
import FormInput from "@components/form/FormInput.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import { businessUnit } from "@modules/road-map/setup/unit-category/services/UnitCategoryService.js";
import { useSupplier } from "@modules/road-map/setup/suppliers/hooks/useSupplier.js";
import CertificateRow from "@modules/road-map/setup/unit/components/CertificateRow.jsx";

const SupplierForm = () => {
    const location = useLocation();
    const { id } = location.state || {};
    const {
        handleSubmit,
        control,
        errors,
        isSubmitting,
        onSubmit,
        watch,
        fields,
        append,
        remove,
        setValue
    } = useSupplier(id);
    const selectedBU = watch("business_unit");

    useEffect(() => {
        if (!fields.length) {
            append({
                certificateType: null,
                certificateType_label: "",
                certificateList: null,
                certificateList_label: "",
                optionType: "",
                expiryDate: "",
                attachment: null
            });
        }
    }, [append, fields.length]);

    return (
        <div>
            <PageHeader
                currentpage={id ? "Edit Supplier" : "Add Supplier"}
                activepage="Supplier"
                mainpage={id ? "Edit Supplier" : "Add Supplier"}
            />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="col-span-12">
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">
                                    {id ? "Edit Supplier" : "Add Supplier"}
                                </div>
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
                                            placeholder="Supplier Name"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="box">
                            <div className="box-header flex justify-between items-center">
                                <div className="box-title">Certificates</div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        append({
                                            certificateType: null,
                                            certificateType_label: "",
                                            certificateList: null,
                                            certificateList_label: "",
                                            optionType: "",
                                            expiryDate: "",
                                            attachment: null
                                        })
                                    }
                                    className="ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                                >
                                    <i className="ri-add-line" /> Add certificate
                                </button>
                            </div>
                            <div className="box-body space-y-2">
                                {fields.map((row, i) => (
                                    <CertificateRow
                                        key={row.id}
                                        row={row}
                                        index={i}
                                        control={control}
                                        errors={errors}
                                        selectedBU={selectedBU}
                                        remove={remove}
                                        watch={watch}
                                        setValue={setValue}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-dashed sm:flex justify-end">
                    <FormButton isLoading={isSubmitting} type="submit" />
                </div>
            </form>
        </div>
    );
};

export default SupplierForm;
