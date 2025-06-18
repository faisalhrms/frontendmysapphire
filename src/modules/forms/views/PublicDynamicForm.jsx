import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import desktopLogoWhite from "@assets/images/brand-logos/desktop-logo.svg";
import {useParams} from "react-router-dom";

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
                    fieldSchema = z.instanceof(File).nullable();
                    if (field.required) {
                        fieldSchema = fieldSchema.refine((val) => val !== null, "File is required");
                    }
                    break;
                case "email":
                    fieldSchema = z.string();
                    if (field.required) {
                        fieldSchema = fieldSchema.email("Invalid email address").min(1, "This field is required");
                    } else {
                        fieldSchema = fieldSchema.email("Invalid email address").optional();
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
    return z.object(schemaObject);
};

export default function PublicDynamicForm() {
    const { slug } = useParams();
    const [formConfig, setFormConfig] = useState(null);
    const [error, setError] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/forms/${slug}/public`)
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch form");
                return response.json();
            })
            .then((data) => setFormConfig(data.data))
            .catch((error) => setError(error.message));
    }, []);

    const getDefaultValues = (config) => {
        const defaults = {};
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
    } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {},
        mode: "onChange",
    });

    useEffect(() => {
        if (formConfig) {
            reset(getDefaultValues(formConfig));
        }
    }, [formConfig, reset]);

    if (error) return <div className="text-danger text-center">Error: {error}</div>;
    if (!formConfig) return <div className="text-center">Loading...</div>;

    const steps = formConfig.fields.map((step) => ({
        title: step.steps,
        fields: step.fields.map((field) => normalizeFieldName(field.name)),
    }));

    const onSubmit = (data) => {
        console.log("Form submitted:", data);
        alert("Form submitted successfully!");
    };

    const handleNext = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const currentFields = steps[currentStep].fields;
            const isValid = await trigger(currentFields);
            console.log({ isValid, errors, currentFields }); // Debug log
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
                <label className="block text-sm font-normal text-gray-700 mb-1">
                    {field.label} {field.required && <span className="text-danger">*</span>}
                </label>
                <Controller
                    name={fieldName}
                    control={control}
                    render={({ field: controllerField }) => {
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

    return (
        <div className="min-h-screen bg-[#f0f2ff] py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg border border-gray-200 mb-3">
                    <div className="border-t-8 border-[#673ab7] rounded-t-lg">
                        <div className="p-6">
                            <div className="mb-4 flex justify-center">
                                <img
                                    src={desktopLogoWhite}
                                    alt=""
                                    className="authentication-brand desktop-logo w-[200px] h-[30px]"
                                />
                            </div>
                            <h1 className="text-2xl font-normal text-gray-800 mb-2">{formConfig.title}</h1>
                            <p className="text-sm text-gray-600">{formConfig.description}</p>
                            <p className="text-xs text-danger mt-2">* Indicates required question</p>
                            <div className="mt-4">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                      <span>
                                        Step {currentStep + 1} of {steps.length}
                                      </span>
                                        <span>{steps[currentStep].title}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-[#673ab7] h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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