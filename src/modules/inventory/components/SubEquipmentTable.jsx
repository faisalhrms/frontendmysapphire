import React from "react";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import FormInput from "@components/form/FormInput.jsx";
import {formatOptions} from "@helpers/formatters.js";

const SubEquipmentTable = ({ fields, append, remove, control, errors }) => {
    return (
        <div className="box mt-4">
            <div className="box-header">
                <div className="box-title">Sub Equipment</div>
            </div>

            <div className="box-body">
                {/* Add Sub Equipment Button */}
                <div className="flex justify-end mb-2">
                    <button
                        type="button"
                        className="ti-btn !py-1 !px-2 !text-[0.75rem] ti-btn-secondary  btn-wave"
                        onClick={() =>
                            append({
                                type_id: "",
                                description: "",
                                qty: 1,
                                status: "",
                            })
                        }
                    >
                        + Add Sub Equipment
                    </button>
                </div>

                {/* Sub-Equipment Table */}
                <table className="min-w-full divide-y divide-gray-200 border">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Sub Equipment Type
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Description
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Qty
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Status
                        </th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                            Action
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {fields.map((field, index) => (
                        <tr key={field.id} className="border-b">
                            {/* Sub Equipment Type */}
                            <td className="px-4 py-2">
                                <FormAsyncSelect
                                    name={`sub_equipments.${index}.type_id`}
                                    control={control}
                                    errors={errors}
                                    placeholder="Type"
                                    apiUrl="/select/sub-equipment/types/"
                                    queryKeyBase={`sub-equipment-type-${index}`}
                                    clientSideSearch={true}
                                    preselectedOptions={formatOptions(
                                        field,
                                        'type'
                                    )}
                                    label={false} // <--- Hide label
                                />
                            </td>

                            {/* Description */}
                            <td className="px-4 py-2">
                                <FormInput
                                    name={`sub_equipments.${index}.description`}
                                    control={control}
                                    errors={errors}
                                    placeholder="Description"
                                    label={false} // <--- Hide label
                                />
                            </td>

                            {/* Qty */}
                            <td className="px-4 py-2 w-24">
                                <FormInput
                                    type="number"
                                    name={`sub_equipments.${index}.qty`}
                                    control={control}
                                    errors={errors}
                                    placeholder="Quantity"
                                    min="1"
                                    label={false} // <--- Hide label
                                />
                            </td>

                            {/* Status */}
                            <td className="px-4 py-2 w-32">
                                <FormSelect
                                    name={`sub_equipments.${index}.status`}
                                    control={control}
                                    errors={errors}
                                    placeholder="Status"
                                    options={[
                                        { value: "available", label: "Available" },
                                        { value: "in_use", label: "In Use" },
                                        { value: "brand_new", label: "Brand New" },
                                    ]}
                                    label={false} // <--- Hide label
                                />
                            </td>

                            {/* Remove Button */}
                            <td className="px-4 py-2 text-right">
                                <button
                                    type="button"
                                    className="ti-btn !py-1 !px-2 !text-[0.75rem] ti-btn-danger  btn-wave"
                                    onClick={() => remove(index)}
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubEquipmentTable;
