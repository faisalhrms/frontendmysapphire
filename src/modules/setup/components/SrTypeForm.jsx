
import { useForm } from "react-hook-form";
import React, {useEffect} from "react";
import FormInput from "@components/form/FormInput.jsx";
import FormButton from "@components/form/FormButton.jsx";


const SrTypesForm = ({ handleSubmitData, editData,saveData }) => {
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            name: saveData?.name || "",
            short_name: saveData?.short_name || "",
        },
    })

    useEffect(() => {
        setValue("name", saveData?.name || "");
        setValue("short_name", saveData?.short_name || "");
    },[saveData])



    const onSubmit = async(formData) => {
        console.log("Submitting Form Data:", formData);
        handleSubmitData(formData);



    };

    return (

        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-12 gap-4">
                <div className="xl:col-span-4 col-span-12">
                    <FormInput
                        type="text"
                        name="name"
                        control={control}
                        errors={errors.name}
                        label={true}
                        placeholder="Name"
                    />
                </div>
                <div className="xl:col-span-4 col-span-12">
                    <FormInput
                        type="text"
                        name="short_name"
                        control={control}
                        errors={errors.short_name}
                        label={true}
                        placeholder="Short Name"
                    />
                </div>
                <div className="col-span-12 flex justify-end">
                    <FormButton isLoading={isSubmitting} type="submit" />
                </div>
            </div>
        </form>
    );
};

export default SrTypesForm;
