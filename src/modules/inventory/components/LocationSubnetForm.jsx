import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import FormButton from "@components/form/FormButton.jsx";
import Notify from "@helpers/toastNotifications.js";
import "@assets/css/custom/hierarchy.css";
import locationSubnetSchema from "@modules/inventory/schemas/locationSubnetSchema.js";
import {useLocationSubnetForm} from "@modules/inventory/hooks/useLocationSubnetHooks.js";
import {formatOptions} from "@helpers/formatters.js";


const LocationSubnetForm = ({ subnetData, isEditMode = false }) => {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    } = useForm({
        resolver: zodResolver(locationSubnetSchema),
        defaultValues: {
            location_id: subnetData?.location_id || "",
            ips: subnetData?.ips?.length ? subnetData.ips : [""],
        },
    });

    // ✅ Let react-hook-form control IPs instead of a separate state
    const ips = watch("ips");

    const addIpField = () => {
        setValue("ips", [...ips, ""]);
    };

    const removeIpField = (index) => {
        if (ips.length === 1) return; // at least one required
        setValue(
            "ips",
            ips.filter((_, i) => i !== index)
        );
    };

    const { handleLocationSubnetSubmit } = useLocationSubnetForm(subnetData, isEditMode);

    return (
        <form onSubmit={handleSubmit(handleLocationSubnetSubmit)} className="flex justify-center">
            <div
                className="box box-hierarchy border border-solid border-gray-300 rounded-lg shadow-md bg-white w-full max-w-[700px]">
                <div className="box-body p-8">
                    <div className="grid grid-cols-12 gap-y-6">
                        {/* Location Select */}
                        <div className="col-span-12">
                            <FormAsyncSelect
                                name="location_id"
                                is_required={true}
                                control={control}
                                errors={errors}
                                placeholder="Select Location"
                                apiUrl="/select/locations/"
                                queryKeyBase="locations"
                                clientSideSearch={false}
                                preselectedOptions={formatOptions(subnetData, "location", "id", "name")}
                                isDisabled={isEditMode}
                            />
                        </div>

                        {/* IP Inputs */}
                        <div className="col-span-12">
                            <label className="block mb-2 font-medium text-sm">IP Addresses</label>
                            {ips.map((_, index) => (
                                <div key={index} className="flex items-center space-x-3 mb-3">
                                    <Controller
                                        name={`ips.${index}`}
                                        control={control}
                                        render={({field}) => (
                                            <input
                                                {...field}
                                                type="text"
                                                placeholder="Enter IPv4"
                                                maxLength={15}
                                                className={`form-input flex-1 ${
                                                    errors?.ips?.[index] ? "border-red-500" : ""
                                                }`}
                                                onInput={(e) => {
                                                    let value = e.target.value;
                                                    value = value.replace(/[^0-9.]/g, ""); // digits & dots only
                                                    value = value.replace(/\.{2,}/g, "."); // no multiple dots
                                                    if (value.startsWith(".")) value = value.substring(1);
                                                    const parts = value.split(".");
                                                    if (parts.length > 4) value = parts.slice(0, 4).join(".");
                                                    value = value
                                                        .split(".")
                                                        .map((part) =>
                                                            part.length > 0 ? Math.min(parseInt(part, 10), 255).toString() : ""
                                                        )
                                                        .join(".");
                                                    e.target.value = value;
                                                    field.onChange(e);
                                                }}
                                            />
                                        )}
                                    />
                                    <button
                                        type="button"
                                        onClick={addIpField}
                                        className="text-2xl text-success"
                                        title="Add IP"
                                    >
                                        <i className="bi bi-plus-square"></i>
                                    </button>
                                    {index !== 0 && (
                                        <button
                                            type="button"
                                            onClick={() => removeIpField(index)}
                                            className="text-2xl text-danger"
                                            title="Remove IP"
                                        >
                                            <i className="bi bi-dash-square"></i>
                                        </button>
                                    )}
                                </div>
                            ))}
                            {errors?.ips && (
                                <p className="text-red-500 text-sm">{errors.ips.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="footer-hierarchy flex justify-end p-5 border-t border-dashed border-gray-300">
                    <FormButton type="submit" isLoading={isSubmitting}>
                        Save Subnet
                    </FormButton>
                </div>
            </div>
        </form>
    );
};

export default LocationSubnetForm;
