import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {useNavigate, useParams} from "react-router-dom";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import {useGeoLocation} from "@hooks/useGeoLocation.js";
import {getMarketingMetadata} from "@helpers/helper.js";
import PublicDynamicFormHeader from "@modules/forms/components/PublicDynamicFormHeader.jsx";
import {useIsAuthenticated} from "@modules/auth/hooks/authHooks.js";

const normalizeFieldName = (name) => name.replace(/\s+/g, "_").toLowerCase();

const createFormSchema = (fields) => {
    const schemaObject = {};
    fields.forEach((step) => {
        step.fields.forEach((field) => {
            let fieldSchema;
            switch (field.field_type) {
                case "checkbox":
                    fieldSchema = z.array(z.string());
                    if (field.required) {
                        fieldSchema = fieldSchema.nonempty("At least one option is required");
                    }
                    break;
                case "file":
                    fieldSchema = z
                        .instanceof(File)
                        .superRefine((file, ctx) => {
                            if (file === null) return;

                            if (!file.type.startsWith("image/")) {
                                ctx.addIssue({
                                    code: z.ZodIssueCode.custom,
                                    message: "Only image files are allowed",
                                });
                            }

                            if (file.size > 5 * 1024 * 1024) {
                                ctx.addIssue({
                                    code: z.ZodIssueCode.custom,
                                    message: "File size must be 5MB or less",
                                });
                            }
                        })
                        .nullable();

                    if (field.required) {
                        fieldSchema = fieldSchema.refine((val) => val !== null, {
                            message: "File is required",
                        });
                    }

                    break;
                case "email":
                    fieldSchema = z.string();
                    if (field.required) {
                        fieldSchema = fieldSchema.email("Invalid email address").min(1, "This field is required");
                    } else {
                        fieldSchema = fieldSchema.refine(
                            (val) => !val || z.string().email().safeParse(val).success,
                            { message: "Invalid email address" }
                        ).optional();
                    }
                    break;
                case "url":
                    fieldSchema = z.string();
                    if (field.required) {
                        fieldSchema = fieldSchema.url("Invalid URL").min(1, "This field is required");
                    } else {
                        fieldSchema = fieldSchema.url("Invalid URL").optional();
                    }
                    break;
                case "number":
                    fieldSchema = z.string();
                    if (field.required) {
                        fieldSchema = fieldSchema.regex(/^\d+$/, "Must be a number").min(1, "This field is required");
                    } else {
                        fieldSchema = fieldSchema.regex(/^\d+$/, "Must be a number").optional();
                    }
                    break;
                case "range":
                    fieldSchema = z.string();
                    if (field.required) {
                        fieldSchema = fieldSchema.regex(/^\d+$/, "Must be a number").min(1, "This field is required");
                    } else {
                        fieldSchema = fieldSchema.regex(/^\d+$/, "Must be a number").optional();
                    }
                    break;
                default:
                    fieldSchema = z.string();
                    if (field.required) {
                        fieldSchema = fieldSchema.min(1, "This field is required");
                    } else {
                        fieldSchema = fieldSchema.optional();
                    }
            }
            schemaObject[normalizeFieldName(field.name)] = fieldSchema;
        });
    });
    schemaObject.latitude = z.number().nullable().optional();
    schemaObject.longitude = z.number().nullable().optional();
    return z.object(schemaObject);
};

export default function PublicDynamicForm() {
    const { slug } = useParams();
    const [formConfig, setFormConfig] = useState(null);
    const [error, setError] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { location } = useGeoLocation();
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/forms/${slug}/public`)
            .then(async (response) => {
                const json = await response.json();
                if (!response.ok) {
                    const errorMessage = json?.message || 'Something went wrong';
                    throw new Error(errorMessage);
                }
                return json;
            })
            .then((data) => {
                const formData = data.data;
                if (formData.authenticated_only && !isAuthenticated) {
                    navigate(import.meta.env.BASE_URL, {
                        state: { redirectTo: window.location.pathname },
                        replace: true,
                    });
                    return;
                }

                setFormConfig(formData);
            })
            .catch((error) => setError(error.message));
    }, [slug, isAuthenticated, navigate]);


    const getDefaultValues = (config) => {
        if (!formConfig) return {};

        const defaults = {
            latitude: location?.lat || null,
            longitude: location?.lng || null,
        };
        if (config) {
            config.fields.forEach((step) => {
                step.fields.forEach((field) => {
                    switch (field.field_type) {
                        case "checkbox":
                            defaults[normalizeFieldName(field.name)] = [];
                            break;
                        case "file":
                            defaults[normalizeFieldName(field.name)] = null;
                            break;
                        case "hidden":
                            defaults[normalizeFieldName(field.name)] = field.value || "";
                            break;
                        case "range":
                            defaults[normalizeFieldName(field.name)] = "50";
                            break;
                        default:
                            defaults[normalizeFieldName(field.name)] = "";
                    }
                });
            });
        }
        return defaults;
    };

    const formSchema = formConfig ? createFormSchema(formConfig.fields) : z.object({});
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        trigger,
        setValue,
    } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            latitude: location?.lat || null,
            longitude: location?.lng || null,
        },
        mode: "onChange",
    });

    useEffect(() => {
        if (formConfig) {
            reset(getDefaultValues(formConfig));
        }
    }, [formConfig, reset]);

    useEffect(() => {
        if (location.lat && location.lng) {
            setValue("latitude", location.lat, { shouldDirty: true });
            setValue("longitude", location.lng, { shouldDirty: true });
        }
    }, [location, setValue]);

    if (error){
        return (
            <div className="min-h-screen bg-[#f0f2ff] py-8 px-4">
                <div className="max-w-2xl mx-auto">
                    <PublicDynamicFormHeader
                        description={error}
                        type="danger"
                        border="border-danger"
                    />
                </div>
            </div>
        );
    }
    if (!formConfig) return <LoadingSpinner />;

    const steps = formConfig.fields.map((step) => ({
        title: step.steps,
        fields: step.fields.map((field) => normalizeFieldName(field.name)),
    }));

    const onSubmit = async (formData) => {
        try {
            const metadata = getMarketingMetadata();
            const { latitude, longitude, ...data } = formData;
            const payload = new FormData();

            if (latitude !== null) payload.append("latitude", latitude);
            if (longitude !== null) payload.append("longitude", longitude);

            payload.append("marketing_metadata", JSON.stringify(metadata));

            formConfig.fields.flatMap((step) => step.fields).forEach((field) => {
                const fieldName = field.name;
                const normalizedName = normalizeFieldName(fieldName);
                const value = data[normalizedName];

                if (field.field_type === "file" && value instanceof File) {
                    payload.append(`data[${fieldName}]`, value);
                } else if (value !== null && value !== undefined) {
                    payload.append(`data[${fieldName}]`, JSON.stringify(value));
                }
            });


            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/forms/submissions/${slug}/submit/`, {
                method: "POST",
                body: payload,
            });

            const result = await response.json();
            if (response.ok) {
                setIsSubmitted(true);
            } else {
                throw new Error(result.message || "Submission failed");
            }
        } catch (err) {
            console.error("Submission error:", err);
            alert("Failed to submit form: " + err.message);
        }
    };

    const handleNext = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const currentFields = steps[currentStep].fields;
            const isValid = await trigger(currentFields);
            if (isValid) {
                setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
            } else {
                const firstErrorField = currentFields.find((field) => errors[field]);
                if (firstErrorField) {
                    const element = document.querySelector(`[name="${firstErrorField}"]`);
                    if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "center" });
                        element.focus();
                    }
                }
            }
        } catch (err) {
            console.error("Error in handleNext:", err);
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const clearForm = () => {
        reset(getDefaultValues(formConfig));
        setCurrentStep(0);
    };

    const renderField = (fieldName) => {
        const field = formConfig.fields
            .flatMap((step) => step.fields)
            .find((f) => normalizeFieldName(f.name) === fieldName);
        if (!field) return null;

        if (field.field_type === "hidden") return null;

        const commonInputClass = `w-full max-w-md px-0 py-2 border-0 border-b-2 ${
            errors[fieldName] ? "border-danger focus:border-danger" : "border-gray-300 focus:border-[#673ab7]"
        } focus:outline-none bg-transparent text-sm placeholder-gray-400 transition-colors duration-200`;

        const errorMessage = errors[fieldName] && (
            <p className="text-danger text-xs mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                    />
                </svg>
                {errors[fieldName].message}
            </p>
        );

        return (
            <div
                className={`bg-white rounded-lg border ${
                    errors[fieldName] ? "border-danger" : "border-gray-200"
                } p-6`}
            >
                <label className="block text-sm font-normal text-gray-700 mb-1 line-height-1">
                    {field.label} {field.required && <span className="text-danger">*</span>}
                    { field.short_description &&
                        <>
                            <br/>
                            <span className="form-text">
                                {field.short_description}
                            </span>
                        </>
                    }
                </label>
                <Controller
                    name={fieldName}
                    control={control}
                    render={({field: controllerField }) => {
                        const safeValue = controllerField.value ?? "";
                        switch (field.field_type) {
                            case "text":
                            case "email":
                            case "password":
                            case "url":
                            case "tel":
                            case "number":
                            case "date":
                            case "datetime-local":
                            case "time":
                            case "month":
                            case "week":
                            case "color":
                                return (
                                    <input
                                        type={field.field_type}
                                        {...controllerField}
                                        value={safeValue}
                                        placeholder="Your answer"
                                        className={commonInputClass}
                                        name={normalizeFieldName(field.name)}
                                    />
                                );

                            case "textarea":
                                return (
                                    <textarea
                                        {...controllerField}
                                        value={safeValue}
                                        placeholder="Your answer"
                                        rows={3}
                                        className={`w-full px-0 py-2 border-0 border-b-2 ${
                                            errors[fieldName] ? "border-danger focus:border-danger" : "border-gray-300 focus:border-[#673ab7]"
                                        } focus:outline-none bg-transparent text-sm placeholder-gray-400 resize-none transition-colors duration-200`}
                                        name={normalizeFieldName(field.name)}
                                    />
                                );

                            case "range":
                                return (
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm text-gray-500">1</span>
                                        <input
                                            type="range"
                                            min="1"
                                            max="100"
                                            {...controllerField}
                                            value={controllerField.value ?? "50"}
                                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                            style={{
                                                background: `linear-gradient(to right, #673ab7 0%, #673ab7 ${controllerField.value ?? 50}%, #e5e7eb ${controllerField.value ?? 50}%, #e5e7eb 100%)`,
                                            }}
                                            name={normalizeFieldName(field.name)}
                                        />
                                        <span className="text-sm text-gray-500">100</span>
                                        <span className="text-sm font-medium text-gray-700 min-w-[2rem]">{controllerField.value ?? 50}</span>
                                    </div>
                                );

                            case "select":
                                return (
                                    <select
                                        {...controllerField}
                                        value={safeValue}
                                        className={commonInputClass}
                                        name={normalizeFieldName(field.name)}
                                    >
                                        <option value="">Choose</option>
                                        {field.options.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                );

                            case "checkbox":
                                return (
                                    <div className="space-y-2">
                                        {field.options.map((option) => (
                                            <div key={option.value} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`${fieldName}-${option.value}`}
                                                    value={option.value}
                                                    checked={(controllerField.value ?? []).includes(option.value)}
                                                    onChange={(e) => {
                                                        const newValue = e.target.checked
                                                            ? [...(controllerField.value ?? []), option.value]
                                                            : (controllerField.value ?? []).filter((v) => v !== option.value);
                                                        controllerField.onChange(newValue);
                                                    }}
                                                    className={`w-4 h-4 ${
                                                        errors[fieldName]
                                                            ? "text-danger border-danger focus:ring-danger"
                                                            : "text-[#673ab7] border-gray-300 focus:ring-[#673ab7]"
                                                    } bg-gray-100 rounded focus:ring-2`}
                                                    name={`${normalizeFieldName(field.name)}[]`}
                                                />
                                                <label
                                                    htmlFor={`${fieldName}-${option.value}`}
                                                    className="ml-2 text-sm text-gray-700"
                                                >
                                                    {option.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                );

                            case "radio":
                                return (
                                    <div className="space-y-2">
                                        {field.options.map((option) => (
                                            <div key={option.value} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    id={`${fieldName}-${option.value}`}
                                                    value={option.value}
                                                    checked={controllerField.value === option.value}
                                                    onChange={() => controllerField.onChange(option.value)}
                                                    className={`w-4 h-4 ${
                                                        errors[fieldName]
                                                            ? "text-danger border-danger focus:ring-danger"
                                                            : "text-[#673ab7] border-gray-300 focus:ring-[#673ab7]"
                                                    } bg-gray-100 focus:ring-2`}
                                                    name={normalizeFieldName(field.name)}
                                                />
                                                <label
                                                    htmlFor={`${fieldName}-${option.value}`}
                                                    className="ml-2 text-sm text-gray-700"
                                                >
                                                    {option.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                );

                            case "file":
                                return (
                                    <div
                                        className={`border-2 border-dashed ${
                                            errors[fieldName] ? "border-danger" : "border-gray-300 hover:border-[#673ab7]"
                                        } rounded-lg p-6 text-center transition-colors`}
                                    >
                                        <input
                                            type="file"
                                            id={`file-upload-${fieldName}`}
                                            accept="image/*"
                                            onChange={(e) => controllerField.onChange(e.target.files[0] ?? null)}
                                            className="hidden"
                                            name={normalizeFieldName(field.name)}
                                        />
                                        <label htmlFor={`file-upload-${fieldName}`} className="cursor-pointer">
                                            <div className={`${errors[fieldName] ? "text-danger" : "text-gray-400"} mb-2`}>
                                                <svg className="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                    />
                                                </svg>
                                            </div>
                                            <p className={`text-sm ${errors[fieldName] ? "text-danger" : "text-gray-600"}`}>
                                                {controllerField.value ? controllerField.value.name : "Click to upload or drag and drop"}
                                            </p>
                                        </label>
                                    </div>
                                );

                            default:
                                return null;
                        }
                    }}
                />
                {errorMessage}
            </div>
        );
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-[#f0f2ff] py-8 px-4">
                <div className="max-w-2xl mx-auto">
                    <PublicDynamicFormHeader
                        title={formConfig.title}
                        description="Thank you for your submission! We have received your form successfully."
                        type="success"
                        border="border-success"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f0f2ff] py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <PublicDynamicFormHeader
                    title={formConfig.title}
                    description={formConfig.description}
                    currentStep={currentStep}
                    steps={steps}
                />

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    {steps[currentStep].fields.map((fieldName) => (
                        <div key={fieldName}>{renderField(fieldName)}</div>
                    ))}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex justify-between items-center">
                            <div className="flex space-x-3">
                                {currentStep > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="text-[#673ab7] hover:bg-[#f3e5f5] px-4 py-2 rounded text-sm font-medium transition-colors border border-[#673ab7]"
                                    >
                                        Back
                                    </button>
                                )}
                                {currentStep < steps.length - 1 ? (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="bg-[#673ab7] hover:bg-[#5e35b1] text-white px-6 py-2 rounded text-sm font-medium transition-colors"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="bg-[#673ab7] hover:bg-[#5e35b1] text-white px-6 py-2 rounded text-sm font-medium transition-colors"
                                    >
                                        Submit
                                    </button>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={clearForm}
                                className="text-[#673ab7] hover:bg-[#f3e5f5] px-4 py-2 rounded text-sm font-medium transition-colors"
                            >
                                Clear form
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}