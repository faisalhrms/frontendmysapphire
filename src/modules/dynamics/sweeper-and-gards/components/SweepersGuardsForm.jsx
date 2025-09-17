// SweepersGuardsForm.jsx
import React, { useMemo, useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@components/form/FormInput.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import FormButton from "@components/form/FormButton.jsx";
import SubFormSection from "@components/form/SubFormSection.jsx";

import { useSweeperGuardForm } from "@modules/dynamics/sweeper-and-gards/hooks/useSweeperGuardFormHook.js";

const SweepersGuardsForm = ({ sgData = {}, isEditMode = false }) => {
    const {
        control,
        handleSubmit,
        setValue,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm({
        // resolver: zodResolver(sweeperGuardSchema),
        defaultValues: {
            store_id: sgData?.store?.id || null,
            num_of_guards: sgData?.num_of_guards || 0,
            num_of_sweepers: sgData?.num_of_sweepers || 0,
            num_of_stock_helpers: sgData?.num_of_stock_helpers || 0,
            leased_area_total: sgData?.leased_area_total || 0,
            store_capacity_total: sgData?.store_capacity_total || 0,
            hanging_capacity_total: sgData?.hanging_capacity_total || 0,
            category_designs: sgData?.category_designs || [],
        },
    });

    const { handleSweeperGuardSubmit } = useSweeperGuardForm(sgData, isEditMode);

    // Dynamic field array (category designs)
    const { fields: categoryFields, append: appendCategory, remove: removeCategory } =
        useFieldArray({ control, name: "category_designs" });

    // Watch values
    const categoryDesigns = useWatch({ control, name: "category_designs" });
    const leasedAreaTotal = useWatch({ control, name: "leased_area_total" });
    const storeCapacityTotal = useWatch({ control, name: "store_capacity_total" });
    const hangingCapacityTotal = useWatch({ control, name: "hanging_capacity_total" });

    // Totals
    const totalLeasedArea = useMemo(() => {
        return (categoryDesigns || []).reduce(
            (sum, item) => sum + (parseFloat(item.area_sq_feet) || 0),
            0
        );
    }, [categoryDesigns]);

    const totalCategoryDesigns = useMemo(() => {
        return (categoryDesigns || []).reduce(
            (sum, item) => sum + (parseFloat(item.design_pieces) || 0),
            0
        );
    }, [categoryDesigns]);

    const totalHangingCapacity = useMemo(() => {
        return (categoryDesigns || []).reduce(
            (sum, item) => sum + (parseFloat(item.hanging_capacity) || 0),
            0
        );
    }, [categoryDesigns]);

    const positiveIntegerInputProps = () => ({
        onKeyDown: (e) => {
            // Block minus, plus, and 'e'/'E' for scientific notation
            if (["-", "+", "e", "E"].includes(e.key)) {
                e.preventDefault();
            }
        },
        onInput: (e) => {
            // Remove accidental negatives or decimals
            if (e.target.value < 0) e.target.value = 0;
            if (!Number.isInteger(Number(e.target.value))) {
                e.target.value = Math.floor(e.target.value);
            }
        },
    })
    // Validation effects
    useEffect(() => {
        if (leasedAreaTotal > 0 && totalLeasedArea > leasedAreaTotal) {
            setError("category_designs", {
                type: "manual",
                message: `Total area (${totalLeasedArea}) cannot exceed Leased Area Total (${leasedAreaTotal})`,
            });
        } else {
            clearErrors("category_designs");
        }
    }, [totalLeasedArea, leasedAreaTotal, setError, clearErrors]);

    useEffect(() => {
        if (storeCapacityTotal > 0 && totalCategoryDesigns > storeCapacityTotal) {
            setError("category_designs", {
                type: "manual",
                message: `Total design pieces (${totalCategoryDesigns}) cannot exceed Store Capacity Total (${storeCapacityTotal})`,
            });
        } else {
            clearErrors("category_designs");
        }
    }, [totalCategoryDesigns, storeCapacityTotal, setError, clearErrors]);

    useEffect(() => {
        if (hangingCapacityTotal > 0 && totalHangingCapacity > hangingCapacityTotal) {
            setError("category_designs", {
                type: "manual",
                message: `Total hanging capacity (${totalHangingCapacity}) cannot exceed Hanging Capacity Total (${hangingCapacityTotal})`,
            });
        } else {
            clearErrors("category_designs");
        }
    }, [totalHangingCapacity, hangingCapacityTotal, setError, clearErrors]);

    const isCategoryDesignDisabled =
        !storeCapacityTotal || storeCapacityTotal <= 0 || !hangingCapacityTotal || hangingCapacityTotal <= 0;
    const isSubmitDisabled =
        isSubmitting || (categoryDesigns?.length ?? 0) === 0;

    const remainingLeasedArea = leasedAreaTotal - totalLeasedArea;
    const remainingStoreCapacity = storeCapacityTotal - totalCategoryDesigns;
    const remainingHangingCapacity = hangingCapacityTotal - totalHangingCapacity;

    return (
        <div className="max-w-7xl mx-auto p-2 space-y-6">
            <form onSubmit={handleSubmit(handleSweeperGuardSubmit)} className="space-y-6">

                {/* Basic Info Section */}
                <div className="col-span-12">
                    <div className="box shadow-md rounded-lg">
                        <div className="box-header bg-gray-100 p-4 rounded-t-lg">
                            <div className="box-title text-lg font-semibold">Basic Information</div>
                        </div>
                        <div className="box-body p-6 grid grid-cols-12 gap-6">
                            <div className="col-span-4">
                                <FormAsyncSelect
                                    name="store_id"
                                    control={control}
                                    errors={errors}
                                    placeholder="Select Store"
                                    is_required={true}
                                    apiUrl="/select/dynamics/stores/"
                                    queryKeyBase="store"
                                    clientSideSearch={false}
                                    formatOption={(option) => ({
                                        value: option.id,
                                        label: `${option.store_code} - ${option.store_name}`,
                                    })}
                                    preselectedOptions={
                                        sgData?.store
                                            ? [
                                                {
                                                    value: sgData.store.id,
                                                    label: `${sgData.store.store_code} - ${sgData.store.store_name}`,
                                                },
                                            ]
                                            : []
                                    }
                                />
                            </div>
                            <div className="col-span-4">
                                <FormInput name="num_of_guards"
                                           {...positiveIntegerInputProps()}
                                           type="number" control={control} errors={errors}
                                           is_required={true} placeholder="Approved Guards"/>
                            </div>
                            <div className="col-span-4">
                                <FormInput name="num_of_sweepers"
                                           {...positiveIntegerInputProps()}
                                           type="number" control={control} errors={errors}
                                           is_required={true} placeholder="Approved Sweepers"/>
                            </div>
                            <div className="col-span-3">
                                <FormInput name="num_of_stock_helpers"
                                           {...positiveIntegerInputProps()}
                                           type="number" control={control} errors={errors}
                                           is_required={true} placeholder="Approved Stock Helpers"/>
                            </div>
                            <div className="col-span-3">
                                <FormInput name="store_capacity_total"
                                           {...positiveIntegerInputProps()}
                                           type="number" control={control} errors={errors}
                                           is_required={true} placeholder="Store Capacity Total"/>
                            </div>
                            <div className="col-span-3">
                                <FormInput name="leased_area_total"
                                           {...positiveIntegerInputProps()}
                                           type="number" control={control} errors={errors}
                                           is_required={true} placeholder="Leased Area Total"/>
                            </div>
                            <div className="col-span-3">
                                <FormInput name="hanging_capacity_total"  {...positiveIntegerInputProps()}
                                           type="number" control={control} errors={errors}
                                           is_required={true} placeholder="Hanging Capacity Total"/>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Wise Designs Section */}
                <SubFormSection title="Category Wise Designs">
                    {isCategoryDesignDisabled && (
                        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                            <p className="text-sm text-amber-800">
                                Please enter both "Store Capacity Total" and "Hanging Capacity Total" first to add
                                category designs.
                            </p>
                        </div>
                    )}
                    {errors.category_designs && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-800">{errors.category_designs.message}</p>
                        </div>
                    )}
                    <div className="relative">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Design Pieces
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Area Sq. Feet
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hanging Capacity
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {categoryFields.map((item, idx) => (
                                <tr key={item.id} className="hover:bg-gray-100">
                                    {/* Category Select */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <FormAsyncSelect
                                            label={false}
                                            name={`category_designs.${idx}.category`}
                                            control={control}
                                            errors={errors}
                                            is_required={true}
                                            placeholder="Select Category"
                                            apiUrl="/select/scm/categories-with-id/"
                                            queryKeyBase="scm_categories"
                                            clientSideSearch={false}
                                            preselectedOptions={
                                                sgData?.category_designs && sgData?.category_designs_options
                                                    ? [
                                                        sgData.category_designs_options.find(
                                                            (opt) => opt.value === sgData.category_designs[idx]?.category
                                                        ),
                                                    ].filter(Boolean)
                                                    : []
                                            }
                                            className="w-full min-w-0"
                                        />
                                    </td>

                                    {/* Design Pieces */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <FormInput
                                            label={false}
                                            name={`category_designs.${idx}.design_pieces`}
                                            control={control}
                                            errors={errors}
                                            is_required={true}
                                            type="number"
                                            {...positiveIntegerInputProps()}
                                            placeholder="Pieces"
                                            className="w-full"
                                            max={remainingStoreCapacity + (parseFloat(categoryDesigns?.[idx]?.design_pieces) || 0)}
                                            onChange={(e) => {
                                                let val = parseFloat(e.target.value) || 0;
                                                const maxAllowed = remainingStoreCapacity + (parseFloat(categoryDesigns?.[idx]?.design_pieces) || 0);
                                                if (val > maxAllowed) val = maxAllowed;
                                                setValue(`category_designs.${idx}.design_pieces`, val, {shouldValidate: true});
                                            }}
                                        />
                                    </td>

                                    {/* Area Sq. Feet */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <FormInput
                                            label={false}
                                            name={`category_designs.${idx}.area_sq_feet`}
                                            control={control}
                                            errors={errors}
                                            is_required={true}
                                            type="number"
                                            {...positiveIntegerInputProps()}
                                            placeholder="Area"
                                            className="w-full"
                                            max={remainingLeasedArea + (parseFloat(categoryDesigns?.[idx]?.area_sq_feet) || 0)}
                                            onChange={(e) => {
                                                let val = parseFloat(e.target.value) || 0;
                                                const maxAllowed = remainingLeasedArea + (parseFloat(categoryDesigns?.[idx]?.area_sq_feet) || 0);
                                                if (val > maxAllowed) val = maxAllowed;
                                                setValue(`category_designs.${idx}.area_sq_feet`, val, {shouldValidate: true});
                                            }}
                                        />
                                    </td>

                                    {/* Hanging Capacity */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <FormInput
                                            label={false}
                                            name={`category_designs.${idx}.hanging_capacity`}
                                            control={control}
                                            errors={errors}
                                            is_required={true}
                                            {...positiveIntegerInputProps()}
                                            type="number"
                                            placeholder="Hanging"
                                            className="w-full"
                                            max={remainingHangingCapacity + (parseFloat(categoryDesigns?.[idx]?.hanging_capacity) || 0)}
                                            onChange={(e) => {
                                                let val = parseFloat(e.target.value) || 0;
                                                const maxAllowed = remainingHangingCapacity + (parseFloat(categoryDesigns?.[idx]?.hanging_capacity) || 0);
                                                if (val > maxAllowed) val = maxAllowed;
                                                setValue(`category_designs.${idx}.hanging_capacity`, val, {shouldValidate: true});
                                            }}
                                        />
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button
                                            type="button"
                                            onClick={() => removeCategory(idx)}
                                            className="ti-btn ti-btn-danger ti-btn-sm"
                                            title="Remove this category design"
                                        >
                                            <i className="ti ti-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>

                            {/* Totals + Remaining Row */}
                            <tfoot className="bg-gray-50 font-semibold">
                            <tr>
                                <td className="px-6 py-3 text-right">Totals:</td>
                                <td className="px-6 py-3">
                                    {totalCategoryDesigns}
                                    {storeCapacityTotal > 0 && (
                                        <div
                                            className={`text-sm ${remainingStoreCapacity < 0 ? "text-red-600" : "text-gray-600"}`}>
                                            Remaining: {remainingStoreCapacity}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-3">
                                    {totalLeasedArea}
                                    {leasedAreaTotal > 0 && (
                                        <div
                                            className={`text-sm ${remainingLeasedArea < 0 ? "text-red-600" : "text-gray-600"}`}>
                                            Remaining: {remainingLeasedArea}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-3">
                                    {totalHangingCapacity}
                                    {hangingCapacityTotal > 0 && (
                                        <div
                                            className={`text-sm ${remainingHangingCapacity < 0 ? "text-red-600" : "text-gray-600"}`}>
                                            Remaining: {remainingHangingCapacity}
                                        </div>
                                    )}
                                </td>
                                <td></td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        <button
                            type="button"
                            onClick={() => appendCategory({
                                category: null,
                                design_pieces: 0,
                                area_sq_feet: 0,
                                hanging_capacity: 0
                            })}
                            className={`ti-btn ti-btn-secondary ti-btn-md ${isCategoryDesignDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                            title={isCategoryDesignDisabled ? "Enter Store Capacity Total & Hanging Capacity Total first" : "Add a new category design"}
                            disabled={isCategoryDesignDisabled}
                        >
                            Add Category Design
                        </button>
                    </div>
                </SubFormSection>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <FormButton
                        isLoading={isSubmitting}
                        disabled={isSubmitDisabled}
                        className={`m-2 ${isSubmitDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                        text={isEditMode ? "Update Changes" : "Save Changes"}
                    />
                </div>


            </form>
        </div>
    );
};

export default SweepersGuardsForm;
