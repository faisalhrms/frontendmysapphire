// src/modules/inlay/components/InlayForm.jsx
import React, { useEffect, useMemo, useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Info, LayoutGrid, FileText, Image as ImageIcon } from "lucide-react";

import FormInput from "@components/form/FormInput.jsx";
import FormCheckbox from "@components/form/FormCheckbox.jsx";
import FormButton from "@components/form/FormButton.jsx";
import GalleryUpload from "@components/GalleryUpload.jsx";

import inlaySchema from "@modules/inlay/schemas/inlaySchema.js";
import { useInlayForm } from "@modules/inlay/hooks/inlayHooks.js";

const buildDefaults = (inlayData) => ({
    design_code: inlayData?.design_code ?? "",
    name: inlayData?.name ?? "",
    is_active: inlayData?.is_active ?? true,
    description: Array.isArray(inlayData?.description)
        ? inlayData.description
        : inlayData?.description
            ? [inlayData.description]
            : [{ label: "", value: "" }],
    attachment_ids: inlayData?.attachments?.map((f) => f.id) ?? [],
});

const InlayForm = ({ inlayData = null, isEditMode = false, onSuccess }) => {
    const defaultValues = useMemo(() => buildDefaults(inlayData), [inlayData?.id, inlayData?.updated_at]);

    const { control, handleSubmit, reset, formState: { errors, isSubmitting }, watch } = useForm({
        resolver: zodResolver(inlaySchema),
        defaultValues,
    });

    const { fields, append, remove } = useFieldArray({ control, name: "description" });
    const { handleInlaySubmit: submitInlay } = useInlayForm(inlayData, isEditMode, onSuccess);

    const initKey = isEditMode ? `edit-${inlayData?.id ?? "none"}` : "create";
    const lastInitKeyRef = useRef(null);

    useEffect(() => {
        if (lastInitKeyRef.current === initKey) return;
        if (isEditMode && !inlayData?.id) return;
        reset(defaultValues);
        lastInitKeyRef.current = initKey;
    }, [initKey, isEditMode, inlayData?.id, reset, defaultValues]);

    const onSubmit = async (formValues) => await submitInlay(formValues);
    const attachmentIds = watch("attachment_ids") || [];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="font-inter">
            <div className="grid grid-cols-12 gap-6">

                {/* LEFT MAIN CONTENT */}
                <div className="xxl:col-span-9 col-span-12 space-y-6">
                    <div className="box border-none shadow-defaultshadow overflow-hidden bg-white dark:bg-bodybg2">

                        {/* Header */}
                        <div className="box-header !border-b !border-defaultborder py-4 px-6 bg-gray-100/50 dark:bg-black/10">
                            <div className="flex items-center gap-2">
                                <h5 className="box-title font-Montserrat font-bold text-gray-800 dark:text-white">
                                    {isEditMode ? "Edit Inlay Profile" : "Create New Inlay"}
                                </h5>
                            </div>
                        </div>

                        <div className="box-body p-6 space-y-10">

                            {/* Section: Basic Details */}
                            <section>
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="h-5 w-1 bg-primary rounded-full"></div>
                                    <h6 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Core Specifications
                                    </h6>
                                </div>

                                <div className="grid grid-cols-12 gap-5">
                                    <div className="xl:col-span-6 col-span-12">
                                        <FormInput
                                            is_required
                                            name="design_code"
                                            control={control}
                                            errors={errors}
                                            placeholder="Design Code"
                                            className="focus:ring-primary/20"
                                        />
                                    </div>

                                    <div className="xl:col-span-6 col-span-12">
                                        <FormInput
                                            is_required
                                            name="name"
                                            control={control}
                                            errors={errors}
                                            placeholder="Inlay Name"
                                        />
                                    </div>

                                    <div className="xl:col-span-12 col-span-12 pt-2">
                                        <div className="bg-gray-100/50 dark:bg-black/5 p-3 rounded-md border border-defaultborder inline-block">
                                            <FormCheckbox
                                                name="is_active"
                                                label="Publish to Catalog"
                                                control={control}
                                                errors={errors}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <hr className="border-defaultborder border-dashed" />

                            {/* Section: Attributes/Description */}
                            <section>
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-2">
                                        <div className="h-5 w-1 bg-secondary rounded-full"></div>
                                        <h6 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                            Product Attributes
                                        </h6>
                                    </div>

                                    <button
                                        type="button"
                                        className="ti-btn !bg-primary/10 !text-primary hover:!bg-primary hover:!text-white transition-all duration-200 ti-btn-md"
                                        onClick={() => append({ label: "", value: "" })}
                                    >
                                        <Plus size={14} className="mr-1" /> Add
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {fields?.map((f, index) => (
                                        <div key={f.id} className="grid grid-cols-12 gap-3 p-3 rounded-lg border border-defaultborder bg-gray-50/30 hover:bg-white transition-colors group">
                                            <div className="xl:col-span-5 col-span-12">
                                                <FormInput
                                                    name={`description.${index}.label`}
                                                    control={control}
                                                    errors={errors}
                                                    placeholder="Label"
                                                />
                                            </div>

                                            <div className="xl:col-span-6 col-span-12">
                                                <FormInput
                                                    name={`description.${index}.value`}
                                                    control={control}
                                                    errors={errors}
                                                    placeholder="Value"
                                                />
                                            </div>

                                            <div className="xl:col-span-1 col-span-12 flex justify-center items-center">
                                                <button
                                                    type="button"
                                                    className="p-2 text-danger hover:bg-danger/10 rounded-full transition-colors disabled:opacity-30"
                                                    onClick={() => remove(index)}
                                                    disabled={fields.length === 1}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <hr className="border-defaultborder border-dashed" />

                            {/* Section: Gallery */}
                            <section>
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="h-5 w-1 bg-info rounded-full"></div>
                                    <h6 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Media Assets
                                    </h6>
                                </div>

                                <div className="bg-gray-50 dark:bg-black/10 p-4 rounded-xl border-2 border-dashed border-defaultborder">
                                    <GalleryUpload
                                        currentValue={inlayData?.attachments?.map((f) => f.id) ?? []}
                                        files={inlayData?.attachments ?? []}
                                        inputName="attachment_ids"
                                        placeholder="Drop images here or click to browse"
                                        control={control}
                                        errors={errors}
                                    />
                                    <div className="mt-3 flex items-start gap-2 text-xs text-textmuted">
                                        <Info size={14} className="mt-0.5 text-info" />
                                        <p>The first image in your selection will be automatically treated as the primary thumbnail.</p>
                                    </div>
                                </div>
                            </section>

                            <div className="flex justify-end pt-4">
                                <FormButton
                                    isLoading={isSubmitting}
                                    className="!px-10 !py-3 !text-base shadow-lg shadow-primary/20"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="xxl:col-span-3 col-span-12 space-y-6">
                    <div className="box border-none shadow-defaultshadow bg-white dark:bg-bodybg2 sticky top-4">
                        <div className="box-header !border-b !border-defaultborder py-3 px-4">
                            <div className="box-title font-Montserrat text-sm flex items-center gap-2">
                                <FileText size={16} className="text-primary" />
                                Form Information
                            </div>
                        </div>
                        <div className="box-body p-4">
                            <div className="space-y-4">
                                <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                                    <div className="text-xs font-bold text-primary uppercase mb-1 flex items-center gap-1">
                                        <ImageIcon size={12} /> Thumbnail Logic
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        The backend prioritizes the <b>first attachment</b> as the cover image.
                                        Drag to reorder your images if your component supports it, or upload the main image first.
                                    </p>
                                </div>

                                {attachmentIds?.length > 0 && (
                                    <div className="flex items-center justify-between text-xs px-1">
                                        <span className="text-textmuted">Selected Files:</span>
                                        <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                                            {attachmentIds.length}
                                        </span>
                                    </div>
                                )}

                                <div className="text-[11px] text-textmuted italic border-t border-defaultborder pt-3">
                                    Last Updated: {inlayData?.updated_at ? new Date(inlayData.updated_at).toLocaleDateString() : 'Never'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default InlayForm;