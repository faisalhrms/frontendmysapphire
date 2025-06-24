import React from "react";
import { useForm } from "react-hook-form";
import FormInput from "@components/form/FormInput.jsx";
import FormButton from "@components/form/FormButton.jsx";

const SearchSection = ({ onSearch }) => {
    const {
        handleSubmit,
        control,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            phone: "",
            case_number: ""
        }
    });

    const handleSearch = async (data) => {
        const { phone, case_number } = data;
        if (case_number.trim()) {
            onSearch("case_number", case_number);
        } else if (phone.trim()) {
            onSearch("phone", phone);
        } else {
            alert("Please enter a value to search");
        }
    };

    return (
        <form
            onSubmit={handleSubmit(handleSearch)}
            className="flex gap-4 p-4 bg-gray-100 rounded-lg items-end"
        >
            <div className="flex-grow">
                <FormInput
                    name="case_number"
                    control={control}
                    errors={errors}
                    placeholder="Case Number"
                />
            </div>

            <div className="flex-grow">
                <FormInput
                    name="phone"
                    control={control}
                    errors={errors}
                    placeholder="Phone"
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