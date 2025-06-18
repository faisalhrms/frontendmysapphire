import React, { useState } from "react"
import desktopLogoWhite from "@assets/images/brand-logos/desktop-logo.svg";

export default function PublicDynamicForm() {
    const [currentStep, setCurrentStep] = useState(0)
    const [formData, setFormData] = useState({
        fullName: "",
        number: "",
        email: "",
        password: "",
        url: "",
        telephone: "",
        range: "50",
        select: "",
        week: "",
        checkbox: false,
        date: "",
        radio: "",
        datetimeLocal: "",
        file: null,
        textarea: "",
        hidden: "hiddenValue",
    })

    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})

    const steps = [
        {
            title: "Personal Information",
            fields: ["fullName", "number", "email", "password", "url"],
        },
        {
            title: "Contact & Preferences",
            fields: ["telephone", "range", "select", "week", "checkbox"],
        },
        {
            title: "Additional Details",
            fields: ["date", "radio", "datetimeLocal", "file", "textarea"],
        },
    ]

    const requiredFields = [
        "fullName",
        "number",
        "email",
        "password",
        "url",
        "telephone",
        "select",
        "week",
        "checkbox",
        "date",
        "radio",
        "datetimeLocal",
        "file",
        "textarea",
    ]

    const validateField = (name, value) => {
        if (requiredFields.includes(name)) {
            if (name === "checkbox") {
                return value === true
            }
            if (name === "file") {
                return value !== null
            }
            return value && value.toString().trim() !== ""
        }
        return true
    }

    const validateCurrentStep = () => {
        const currentFields = steps[currentStep].fields
        const stepErrors = {}
        let isValid = true

        currentFields.forEach((field) => {
            if (!validateField(field, formData[field])) {
                stepErrors[field] = true
                isValid = false
            }
        })

        setErrors((prev) => ({ ...prev, ...stepErrors }))
        setTouched((prev) => {
            const newTouched = { ...prev }
            currentFields.forEach((field) => {
                newTouched[field] = true
            })
            return newTouched
        })

        return isValid
    }

    const handleInputChange = (e) => {
        const { name, value, type } = e.target
        let newValue = value

        if (type === "checkbox") {
            newValue = e.target.checked
        } else if (type === "file") {
            newValue = e.target.files?.[0] || null
        }

        setFormData((prev) => ({ ...prev, [name]: newValue }))

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: false }))
        }
    }

    const handleBlur = (e) => {
        const { name, value, type } = e.target
        let fieldValue = value

        if (type === "checkbox") {
            fieldValue = e.target.checked
        } else if (type === "file") {
            fieldValue = e.target.files?.[0] || null
        }

        setTouched((prev) => ({ ...prev, [name]: true }))

        if (!validateField(name, fieldValue)) {
            setErrors((prev) => ({ ...prev, [name]: true }))
        }
    }

    const handleNext = () => {
        if (validateCurrentStep()) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
        } else {
            const currentFields = steps[currentStep].fields
            const firstErrorField = currentFields.find((field) => errors[field])
            if (firstErrorField) {
                const element = document.querySelector(`[name="${firstErrorField}"]`)
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "center" })
                    element.focus()
                }
            }
        }
    }

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (validateCurrentStep()) {
            console.log("Form submitted:", formData)
            alert("Form submitted successfully!")
        }
    }

    const clearForm = () => {
        setFormData({
            fullName: "",
            number: "",
            email: "",
            password: "",
            url: "",
            telephone: "",
            range: "50",
            select: "",
            week: "",
            checkbox: false,
            date: "",
            radio: "",
            datetimeLocal: "",
            file: null,
            textarea: "",
            hidden: "hiddenValue",
        })
        setErrors({})
        setTouched({})
        setCurrentStep(0)
    }

    const renderField = (fieldName) => {
        const commonInputClass = `w-full max-w-md px-0 py-2 border-0 border-b-2 ${
            errors[fieldName] ? "border-danger focus:border-danger" : "border-gray-300 focus:border-[#673ab7]"
        } focus:outline-none bg-transparent text-sm placeholder-gray-400 transition-colors duration-200`

        const errorMessage = errors[fieldName] && touched[fieldName] && (
            <p className="text-danger text-xs mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                    />
                </svg>
                This is a required question
            </p>
        )

        switch (fieldName) {
            case "fullName":
                return (
                    <div className={`${
                errors[fieldName] ? "border-danger focus:border-danger" : "border-gray-300 focus:border-[#673ab7]"
            } bg-white rounded-lg border border-gray-200 p-6`}>
                        <label className="block text-sm font-normal text-gray-700 mb-1">
                            Full Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder="Your answer"
                            className={commonInputClass}
                        />
                        {errorMessage}
                    </div>
                )

            case "number":
                return (
                    <div className={`${
                errors[fieldName] ? "border-danger focus:border-danger" : "border-gray-300 focus:border-[#673ab7]"
        } bg-white rounded-lg border border-gray-200 p-6`}>
                        <label className="block text-sm font-normal text-gray-700 mb-1">
                            Number <span className="text-danger">*</span>
                        </label>
                        <input
                            type="number"
                            name="number"
                            value={formData.number}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder="Your answer"
                            className={commonInputClass}
                        />
                        {errorMessage}
                    </div>
                )

            case "email":
                return (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <label className="block text-sm font-normal text-gray-700 mb-1">
                            Email <span className="text-danger">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder="Your answer"
                            className={commonInputClass}
                        />
                        {errorMessage}
                    </div>
                )

            case "password":
                return (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <label className="block text-sm font-normal text-gray-700 mb-1">
                            Password <span className="text-danger">*</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder="Your answer"
                            className={commonInputClass}
                        />
                        {errorMessage}
                    </div>
                )

            case "url":
                return (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <label className="block text-sm font-normal text-gray-700 mb-1">
                            URL <span className="text-danger">*</span>
                        </label>
                        <input
                            type="url"
                            name="url"
                            value={formData.url}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder="Your answer"
                            className={commonInputClass}
                        />
                        {errorMessage}
                    </div>
                )

            case "telephone":
                return (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <label className="block text-sm font-normal text-gray-700 mb-1">
                            Telephone <span className="text-danger">*</span>
                        </label>
                        <input
                            type="tel"
                            name="telephone"
                            value={formData.telephone}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder="Your answer"
                            className={commonInputClass}
                        />
                        {errorMessage}
                    </div>
                )

            case "range":
                return (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <label className="block text-sm font-normal text-gray-700 mb-3">
                            Range <span className="text-danger">*</span>
                        </label>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">1</span>
                            <input
                                type="range"
                                name="range"
                                min="1"
                                max="100"
                                value={formData.range}
                                onChange={handleInputChange}
                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                style={{
                                    background: `linear-gradient(to right, #673ab7 0%, #673ab7 ${formData.range}%, #e5e7eb ${formData.range}%, #e5e7eb 100%)`,
                                }}
                            />
                            <span className="text-sm text-gray-500">100</span>
                            <span className="text-sm font-medium text-gray-700 min-w-[2rem]">{formData.range}</span>
                        </div>
                    </div>
                )

            case "select":
                return (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <label className="block text-sm font-normal text-gray-700 mb-1">
                            Select <span className="text-danger">*</span>
                        </label>
                        <select
                            name="select"
                            value={formData.select}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={commonInputClass}
                        >
                            <option value="">Choose</option>
                            <option value="option1">Option 1</option>
                            <option value="option2">Option 2</option>
                        </select>
                        {errorMessage}
                    </div>
                )

            case "week":
                return (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <label className="block text-sm font-normal text-gray-700 mb-1">
                            Week <span className="text-danger">*</span>
                        </label>
                        <input
                            type="week"
                            name="week"
                            value={formData.week}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={commonInputClass}
                        />
                        {errorMessage}
                    </div>
                )

            case "checkbox":
                return (
                    <div className={`bg-white rounded-lg border ${errors.checkbox ? "border-danger" : "border-gray-200"} p-6`}>
                        <label className="block text-sm font-normal text-gray-700 mb-3">
                            Checkbox <span className="text-danger">*</span>
                        </label>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="checkbox"
                                id="checkbox"
                                checked={formData.checkbox}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`w-4 h-4 ${
                                    errors.checkbox
                                        ? "text-danger border-danger focus:ring-danger"
                                        : "text-[#673ab7] border-gray-300 focus:ring-[#673ab7]"
                                } bg-gray-100 rounded focus:ring-2`}
                            />
                            <label htmlFor="checkbox" className="ml-2 text-sm text-gray-700">
                                Check me out
                            </label>
                        </div>
                        {errorMessage}
                    </div>
                )

            case "date":
                return (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <label className="block text-sm font-normal text-gray-700 mb-1">
                            Date <span className="text-danger">*</span>
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={commonInputClass}
                        />
                        {errorMessage}
                    </div>
                )

            case "radio":
                return (
                    <div className={`bg-white rounded-lg border ${errors.radio ? "border-danger" : "border-gray-200"} p-6`}>
                        <label className="block text-sm font-normal text-gray-700 mb-3">
                            Radio <span className="text-danger">*</span>
                        </label>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    name="radio"
                                    id="radio1"
                                    value="option1"
                                    checked={formData.radio === "option1"}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={`w-4 h-4 ${
                                        errors.radio
                                            ? "text-danger border-danger focus:ring-danger"
                                            : "text-[#673ab7] border-gray-300 focus:ring-[#673ab7]"
                                    } bg-gray-100 focus:ring-2`}
                                />
                                <label htmlFor="radio1" className="ml-2 text-sm text-gray-700">
                                    Option 1
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    name="radio"
                                    id="radio2"
                                    value="option2"
                                    checked={formData.radio === "option2"}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    className={`w-4 h-4 ${
                                        errors.radio
                                            ? "text-danger border-danger focus:ring-danger"
                                            : "text-[#673ab7] border-gray-300 focus:ring-[#673ab7]"
                                    } bg-gray-100 focus:ring-2`}
                                />
                                <label htmlFor="radio2" className="ml-2 text-sm text-gray-700">
                                    Option 2
                                </label>
                            </div>
                        </div>
                        {errorMessage}
                    </div>
                )

            case "datetimeLocal":
                return (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <label className="block text-sm font-normal text-gray-700 mb-1">
                            Date and Time <span className="text-danger">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            name="datetimeLocal"
                            value={formData.datetimeLocal}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={commonInputClass}
                        />
                        {errorMessage}
                    </div>
                )

            case "file":
                return (
                    <div className={`bg-white rounded-lg border ${errors.file ? "border-danger" : "border-gray-200"} p-6`}>
                        <label className="block text-sm font-normal text-gray-700 mb-3">
                            File <span className="text-danger">*</span>
                        </label>
                        <div
                            className={`border-2 border-dashed ${
                                errors.file ? "border-danger" : "border-gray-300 hover:border-[#673ab7]"
                            } rounded-lg p-6 text-center transition-colors`}
                        >
                            <input
                                type="file"
                                name="file"
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <div className={`${errors.file ? "text-danger" : "text-gray-400"} mb-2`}>
                                    <svg className="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                        />
                                    </svg>
                                </div>
                                <p className={`text-sm ${errors.file ? "text-danger" : "text-gray-600"}`}>
                                    {formData.file ? formData.file.name : "Click to upload or drag and drop"}
                                </p>
                            </label>
                        </div>
                        {errorMessage}
                    </div>
                )

            case "textarea":
                return (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <label className="block text-sm font-normal text-gray-700 mb-1">
                            Textarea <span className="text-danger">*</span>
                        </label>
                        <textarea
                            name="textarea"
                            value={formData.textarea}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder="Your answer"
                            rows={3}
                            className={`w-full px-0 py-2 border-0 border-b-2 ${
                                errors.textarea ? "border-danger focus:border-danger" : "border-gray-300 focus:border-[#673ab7]"
                            } focus:outline-none bg-transparent text-sm placeholder-gray-400 resize-none transition-colors duration-200`}
                        />
                        {errorMessage}
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-[#f0f2ff] py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header Card */}
                <div className="bg-white rounded-lg border border-gray-200 mb-3">
                    <div className="border-t-8 border-[#673ab7] rounded-t-lg">
                        <div className="p-6">
                            <div className="mb-4  flex justify-center">
                                <img src={desktopLogoWhite} alt=""
                                     className="authentication-brand desktop-logo w-[200px] h-[30px]"/>
                            </div>
                            <h1 className="text-2xl font-normal text-gray-800 mb-2">Feedback Form</h1>
                            <p className="text-sm text-gray-600">We value your opinion and would love to hear from
                                you!</p>
                            <p className="text-xs text-danger mt-2">* Indicates required question</p>

                            {/* Progress Indicator */}
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
                                        style={{width: `${((currentStep + 1) / steps.length) * 100}%`}}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Render current step fields */}
                    {steps[currentStep].fields.map((fieldName) => (
                        <div key={fieldName}>{renderField(fieldName)}</div>
                    ))}

                    {/* Navigation Buttons */}
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
    )
}
