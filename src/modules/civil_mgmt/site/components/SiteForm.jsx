import React from "react";
import { useSiteForm } from "@modules/civil_mgmt/site/hooks/useSiteForm.js";
import FormInput from "@components/form/FormInput.jsx";
import FormTextarea from "@components/form/FormTextarea.jsx";
import FormButton from "@components/form/FormButton.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {HardDrive, PlusCircle} from "lucide-react";

const SiteForm = ({ editMode = false, siteId = null }) => {
    const {
        control,
        errors,
        handleSubmit,
        onSubmit,
        isSubmitting,
    } = useSiteForm(editMode, siteId);

    return (
        <>
            <IconPageHeader
                heading={editMode ? "Edit Site" : "Add Site"}
                description={editMode ? "Edit existing site details" : "Create a new site"}
                icon={editMode ? HardDrive : PlusCircle}
            />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 gap-x-6">
                    {/* LEFT MAIN FORM */}
                    <div className="col-span-12">
                        <div className="box">
                            <div className="box-body">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-12">
                                        <FormInput
                                            name="name"
                                            control={control}
                                            errors={errors}
                                            placeholder="Site Name"
                                            is_required={true}
                                        />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <FormInput
                                            name="latitude"
                                            control={control}
                                            errors={errors}
                                            placeholder="Latitude"
                                        />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <FormInput
                                            name="longitude"
                                            control={control}
                                            errors={errors}
                                            placeholder="Longitude"
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <FormTextarea
                                            name="address"
                                            control={control}
                                            errors={errors}
                                            placeholder="Address"
                                            rows={3}
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <FormInput
                                            name="ended_at"
                                            control={control}
                                            errors={errors}
                                            placeholder="Ended At"
                                            type="date"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t sm:flex justify-end">
                                <FormButton isLoading={isSubmitting} />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default SiteForm;
