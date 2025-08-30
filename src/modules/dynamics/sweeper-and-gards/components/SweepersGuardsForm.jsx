import React, { useMemo, useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@components/form/FormInput.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import FormButton from "@components/form/FormButton.jsx";
import SubFormSection from "@components/form/SubFormSection.jsx";

import { formatOptions } from "@helpers/formatters.js";
// import sweeperGuardSchema from "@modules/dynamics/schemas/sweeperGuardSchema.js"; // TODO: create schema later
import { useSweeperGuardForm } from "@modules/dynamics/sweeper-and-gards/hooks/useSweeperGuardFormHook.js";
import SweepersGuardsSubFormSection
    from "@modules/dynamics/sweeper-and-gards/components/SweepersGuardsSubFormSection.jsx"; // TODO: hook later

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
            store_id: sgData?.store?.id || null, // ✅ map to id
            num_of_guards: sgData?.num_of_guards || 0,
            num_of_sweepers: sgData?.num_of_sweepers || 0,
            num_of_stock_helpers: sgData?.num_of_stock_helpers || 0,
            leased_area_total: sgData?.leased_area_total || 0,
            store_capacity_total: sgData?.store_capacity_total || 0,
            leased_areas: sgData?.leased_areas || [],
            category_designs: sgData?.category_designs || [],
        },
    });

    const { handleSweeperGuardSubmit } = useSweeperGuardForm(sgData, isEditMode);

    // Dynamic field arrays
    const { fields: leasedAreaFields, append: appendLeasedArea, remove: removeLeasedArea } =
        useFieldArray({ control, name: "leased_areas" });

    const { fields: categoryFields, append: appendCategory, remove: removeCategory } =
        useFieldArray({ control, name: "category_designs" });

    // Watch values for sums and validation
    const leasedAreas = useWatch({ control, name: "leased_areas" });
    const categoryDesigns = useWatch({ control, name: "category_designs" });
    const leasedAreaTotal = useWatch({ control, name: "leased_area_total" });
    const storeCapacityTotal = useWatch({ control, name: "store_capacity_total" });

    const totalLeasedArea = useMemo(() => {
        return (leasedAreas || []).reduce((sum, item) => sum + (parseFloat(item.area_sq_feet) || 0), 0);
    }, [leasedAreas]);

    const totalCategoryDesigns = useMemo(() => {
        return (categoryDesigns || []).reduce((sum, item) => sum + (parseFloat(item.design_pieces) || 0), 0);
    }, [categoryDesigns]);

    // Validation effects
    useEffect(() => {
        // Validate leased area total vs sum of areas
        if (leasedAreaTotal > 0 && totalLeasedArea > leasedAreaTotal) {
            setError("leased_areas", {
                type: "manual",
                message: `Total area (${totalLeasedArea}) cannot exceed Leased Area Total (${leasedAreaTotal})`
            });
        } else {
            clearErrors("leased_areas");
        }
    }, [totalLeasedArea, leasedAreaTotal, setError, clearErrors]);

    useEffect(() => {
        // Validate store capacity total vs sum of design pieces
        if (storeCapacityTotal > 0 && totalCategoryDesigns > storeCapacityTotal) {
            setError("category_designs", {
                type: "manual",
                message: `Total design pieces (${totalCategoryDesigns}) cannot exceed Store Capacity Total (${storeCapacityTotal})`
            });
        } else {
            clearErrors("category_designs");
        }
    }, [totalCategoryDesigns, storeCapacityTotal, setError, clearErrors]);

    // Check if sections should be disabled
    const isLeasedAreaDisabled = !leasedAreaTotal || leasedAreaTotal <= 0;
    const isCategoryDesignDisabled = !storeCapacityTotal || storeCapacityTotal <= 0;

    // Calculate remaining capacity
    const remainingLeasedArea = leasedAreaTotal - totalLeasedArea;
    const remainingStoreCapacity = storeCapacityTotal - totalCategoryDesigns;

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
                                <FormInput name="num_of_guards" type="number" control={control} errors={errors} is_required={true} placeholder="Guards" />
                            </div>
                            <div className="col-span-4">
                                <FormInput name="num_of_sweepers" type="number" control={control} errors={errors} is_required={true} placeholder="Sweepers" />
                            </div>
                            <div className="col-span-4">
                                <FormInput name="num_of_stock_helpers" type="number" control={control} errors={errors} is_required={true} placeholder="Stock Helpers" />
                            </div>
                            <div className="col-span-4">
                                <FormInput name="leased_area_total" type="number" control={control} errors={errors} is_required={true} placeholder="Leased Area Total" />
                            </div>
                            <div className="col-span-4">
                                <FormInput name="store_capacity_total" type="number" control={control} errors={errors} is_required={true} placeholder="Store Capacity Total" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dynamic Sections in Grid Layout */}
                <div className="grid grid-cols-12 gap-6">

                    {/* Leased Selling Area Section */}
                    <div className="col-span-6">
                        <SubFormSection title="Leased Selling Areas" >
                            {isLeasedAreaDisabled && (
                                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                                    <p className="text-sm text-amber-800">
                                        Please enter "Leased Area Total" first to add leased areas.
                                    </p>
                                </div>
                            )}
                            {errors.leased_areas && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-sm text-rose-800">{errors.leased_areas.message}</p>
                                </div>
                            )}
                            <div className="relative">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Area Sq. Feet</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {leasedAreaFields.map((item, idx) => {

                                        return (
                                            <tr key={item.id} className="hover:bg-gray-100">
                                                <td className="px-6 py-4 whitespace-nowrap w-1/2">
                                                    <FormAsyncSelect
                                                        label={false}
                                                        name={`leased_areas.${idx}.category`}
                                                        control={control}
                                                        errors={errors}
                                                        placeholder="Select Category"
                                                        is_required={true}
                                                        apiUrl="/select/leased-selling-area/categories/"
                                                        saveOptionEndpoint="/select/leased-selling-area/category/"
                                                        queryKeyBase="lsa_categories"
                                                        clientSideSearch={false}
                                                        allowSaveNewOption={true}
                                                        preselectedOptions={
                                                            sgData?.leased_areas && sgData?.leased_areas_options
                                                                ? [
                                                                    sgData.leased_areas_options.find(
                                                                        (opt) => opt.value === sgData.leased_areas[idx]?.category
                                                                    )
                                                                ].filter(Boolean) // removes null if not found
                                                                : []
                                                        }
                                                        className="w-full min-w-0"
                                                    />

                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap w-1/3">
                                                    <FormInput
                                                        label={false}
                                                        name={`leased_areas.${idx}.area_sq_feet`}
                                                        control={control}
                                                        errors={errors}
                                                        type="number"
                                                        is_required={true}
                                                        placeholder="Area"
                                                        className="w-full"
                                                        max={remainingLeasedArea + (parseFloat(leasedAreas?.[idx]?.area_sq_feet) || 0)}
                                                        onChange={(e) => {
                                                            let val = parseFloat(e.target.value) || 0;
                                                            const maxAllowed =
                                                                remainingLeasedArea + (parseFloat(leasedAreas?.[idx]?.area_sq_feet) || 0);

                                                            console.log(
                                                                `Index ${idx} -> Entered: ${val}, MaxAllowed: ${maxAllowed}`
                                                            );

                                                            if (val > maxAllowed) {
                                                                val = maxAllowed; // clamp value
                                                            }
                                                            setValue(`leased_areas.${idx}.area_sq_feet`, val, {
                                                                shouldValidate: true,
                                                            });
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right w-1/6">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            console.log("Removing leased area at index:", idx, item);
                                                            removeLeasedArea(idx);
                                                        }}
                                                        className="ti-btn ti-btn-danger ti-btn-sm"
                                                        title="Remove this leased area"
                                                    >
                                                        <i className="ti ti-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <button
                                    type="button"
                                    onClick={() => appendLeasedArea({ category: null, area_sq_feet: 0 })}
                                    className={`ti-btn ti-btn-secondary ti-btn-md ${isLeasedAreaDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    title={isLeasedAreaDisabled ? "Enter Leased Area Total first" : "Add a new leased area"}
                                    disabled={isLeasedAreaDisabled}
                                >
                                    Add Leased Area
                                </button>
                                <div className="text-right">
                                    <div className="font-semibold">Sum: {totalLeasedArea}</div>
                                    {leasedAreaTotal > 0 && (
                                        <div className={`text-sm ${remainingLeasedArea < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                            Remaining: {remainingLeasedArea}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </SubFormSection>
                    </div>

                    {/* Category Wise Designs Section */}
                    <div className="col-span-6">
                        <SubFormSection title="Category Wise Designs" >
                            {isCategoryDesignDisabled && (
                                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                                    <p className="text-sm text-amber-800">
                                        Please enter "Store Capacity Total" first to add category designs.
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Design Pieces</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {categoryFields.map((item, idx) => (
                                        <tr key={item.id} className="hover:bg-gray-100">
                                            <td className="px-6 py-4 whitespace-nowrap w-1/2">

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
                                                                )
                                                            ].filter(Boolean) // removes null if not found
                                                            : []
                                                    }
                                                    className="w-full min-w-0"
                                                />


                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap w-1/3">
                                                <FormInput
                                                    label={false}
                                                    name={`category_designs.${idx}.design_pieces`}
                                                    control={control}
                                                    errors={errors}
                                                    is_required={true}
                                                    type="number"
                                                    placeholder="Pieces"
                                                    className="w-full"
                                                    max={remainingStoreCapacity + (parseFloat(categoryDesigns?.[idx]?.design_pieces) || 0)}
                                                    onChange={(e) => {
                                                        let val = parseFloat(e.target.value) || 0;
                                                        const maxAllowed = remainingStoreCapacity + (parseFloat(categoryDesigns?.[idx]?.design_pieces) || 0);
                                                        if (val > maxAllowed) {
                                                            val = maxAllowed;
                                                        }
                                                        setValue(`category_designs.${idx}.design_pieces`, val, { shouldValidate: true });
                                                    }}
                                                />

                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right w-1/6">
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
                                </table>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <button
                                    type="button"
                                    onClick={() => appendCategory({ category: null, design_pieces: 0 })}
                                    className={`ti-btn ti-btn-secondary ti-btn-md ${isCategoryDesignDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    title={isCategoryDesignDisabled ? "Enter Store Capacity Total first" : "Add a new category design"}
                                    disabled={isCategoryDesignDisabled}
                                >
                                    Add Category Design
                                </button>
                                <div className="text-right">
                                    <div className="font-semibold">Sum: {totalCategoryDesigns}</div>
                                    {storeCapacityTotal > 0 && (
                                        <div className={`text-sm ${remainingStoreCapacity < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                            Remaining: {remainingStoreCapacity}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </SubFormSection>
                    </div>

                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <FormButton
                        isLoading={isSubmitting}
                        label={isEditMode ? "Update Sweepers & Guards" : "Create Sweepers & Guards"}
                    />
                </div>

            </form>
        </div>
    );
};

export default SweepersGuardsForm;