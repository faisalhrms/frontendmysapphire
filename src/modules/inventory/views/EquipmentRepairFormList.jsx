import React from "react";
import { useFieldArray } from "react-hook-form";
import FormInput from "@components/form/FormInput.jsx";
import FormTextarea from "@components/form/FormTextarea.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import GalleryUpload from "@components/GalleryUpload.jsx";

const EquipmentRepairFormList = ({ control, errors }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "repairs",
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Repair History</h3>
                <button
                    type="button"
                    onClick={() =>
                        append({
                            issue_description: "",
                            repair_cost: "",
                            pr_po_number: "",
                            repair_date: "",
                            turnaround_time: "",
                            vendor_details: "",
                            status: "open",
                            attachments: [],
                        })
                    }
                    className="ti-btn ti-btn-secondary btn-sm"
                >
                    + Add Repair Entry
                </button>
            </div>

            {fields.map((field, index) => (
                <div key={field.id} className="border p-4 rounded-md shadow-sm bg-gray-50 relative">
                    <button
                        type="button"
                        onClick={() => remove(index)}
                        className="absolute top-2 right-2 text-xs ti-btn ti-btn-danger btn-sm"
                    >
                        Remove
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FormTextarea
                            name={`repairs.${index}.issue_description`}
                            control={control}
                            errors={errors}
                            placeholder="Issue Description"
                            label="Issue Description"
                            rows={2}
                        />

                        <FormInput
                            name={`repairs.${index}.repair_cost`}
                            control={control}
                            errors={errors}
                            placeholder="Cost"
                            label="Repair Cost"
                            type="number"
                        />

                        <FormInput
                            name={`repairs.${index}.pr_po_number`}
                            control={control}
                            errors={errors}
                            placeholder="PO/PR Number"
                            label="PR/PO Number"
                        />

                        <FormInput
                            name={`repairs.${index}.repair_date`}
                            control={control}
                            errors={errors}
                            label="Repair Date"
                            type="date"
                        />

                        <FormInput
                            name={`repairs.${index}.turnaround_time`}
                            control={control}
                            errors={errors}
                            placeholder="Days"
                            label="Turnaround Time"
                            type="number"
                        />

                        <FormInput
                            name={`repairs.${index}.vendor_details`}
                            control={control}
                            errors={errors}
                            placeholder="Vendor Info"
                            label="Vendor Details"
                        />

                        <FormSelect
                            name={`repairs.${index}.status`}
                            control={control}
                            errors={errors}
                            label="Status"
                            options={[
                                { value: "open", label: "Open" },
                                { value: "in_progress", label: "In Progress" },
                                { value: "closed", label: "Closed" },
                            ]}
                        />

                        <div className="col-span-full">
                            <GalleryUpload
                                name={`repairs.${index}.attachments`}
                                control={control}
                                errors={errors}
                                label="Attachments"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EquipmentRepairFormList;
