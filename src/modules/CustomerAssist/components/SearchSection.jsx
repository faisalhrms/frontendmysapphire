import React from "react";
import { useForm } from "react-hook-form";
import FormSelect from "@components/form/FormSelect.jsx";
import FormInput from "@components/form/FormInput.jsx";
import FormButton from "@components/form/FormButton.jsx"; // Adjust path if needed

const SEARCH_OPTIONS = [
    { value: "phone", label: "Phone" },
    { value: "case_number", label: "Case Number" }
];

const SearchSection = ({ onSearch }) => {
    const {
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            type: "phone",
            value: ""
        }
    });

    const selectedType = watch("type");

    const handleSearch = async ({ type, value }) => {
        if (!value.trim()) {
            alert("Please enter a value to search");
            return;
        }
        onSearch(type, value);
    };

    return (
        <form
            onSubmit={handleSubmit(handleSearch)}
            className="flex gap-4 p-4 bg-gray-100 rounded-lg items-end"
        >
            <div className="w-40">
                <FormSelect
                    name="type"
                    control={control}
                    errors={errors}
                    options={SEARCH_OPTIONS}
                    placeholder="Search Type"
                    isClearable={false}
                />
            </div>

            <div className="flex-grow">
                <FormInput
                    name="value"
                    control={control}
                    errors={errors}
                    placeholder={`Enter ${selectedType === "case_number" ? "Case Number" : "Phone"}`}
                    is_required={true}
                />
            </div>

            <FormButton
                isLoading={isSubmitting}
                text="Search"
                submitTxt="Searching..."
                className="!h-[42px] !px-6"
            />
        </form>
    );
};

export default SearchSection;
