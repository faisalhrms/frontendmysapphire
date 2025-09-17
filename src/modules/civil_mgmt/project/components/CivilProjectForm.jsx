import React from "react";
import FormInput from "@components/form/FormInput.jsx";
import FormTextarea from "@components/form/FormTextarea.jsx";
import FormButton from "@components/form/FormButton.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {HardDrive, PlusCircle} from "lucide-react";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import {formatOptions, formatOptionsWithConcatenation} from "@helpers/formatters.js";
import ProjectPriorityDropdown from "@modules/project-management/components/dropdowns/ProjectPriorityDropdown.jsx";
import GalleryUpload from "@components/GalleryUpload.jsx";
import ProjectStatusDropdown from "@modules/project-management/components/dropdowns/ProjectStatusDropdown.jsx";
import {projectCurrency, useCivilProjectForm} from "@modules/civil_mgmt/project/hooks/useCivilProjectForm.js";
import FormSelect from "@components/form/FormSelect.jsx";

const CivilProjectForm = ({ editMode = false, projectId = null }) => {
    const {
        control,
        errors,
        handleSubmit,
        onSubmit,
        isSubmitting,
        formData
    } = useCivilProjectForm(editMode, projectId);

    return (
        <>
            <IconPageHeader
                heading={editMode ? "Edit Project" : "Add Project"}
                description={editMode ? "Edit existing project details" : "Create a new project"}
                icon={editMode ? HardDrive : PlusCircle}
            />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-8 xl:col-span-8 lg:col-span-8  sm:col-span-8 col-span-12">
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">Civil Project Info</div>
                            </div>
                            <div className="box-body">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-12">
                                        <FormInput
                                            name="name"
                                            control={control}
                                            errors={errors}
                                            placeholder="Project Name"
                                            is_required={true}
                                        />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <FormAsyncSelect
                                            name="site"
                                            control={control}
                                            errors={errors}
                                            placeholder="Project Site"
                                            apiUrl="/select/civil/sites/"
                                            queryKeyBase="civil_sites"
                                            preselectedOptions={formatOptions(formData, 'site_option')}
                                            is_required={true}
                                        />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <FormAsyncSelect
                                            name="type"
                                            control={control}
                                            errors={errors}
                                            placeholder="Project Type"
                                            apiUrl="/select/civil/project/types/"
                                            queryKeyBase="civil_project_types"
                                            preselectedOptions={formatOptions(formData, 'type_option')}
                                            saveOptionEndpoint="/select/civil/project/type/"
                                            allowSaveNewOption={true}
                                            is_required={true}
                                        />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <FormInput
                                            type="number"
                                            name="estimated_budget"
                                            control={control}
                                            errors={errors}
                                            placeholder="Estimated Budget"
                                        />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <FormSelect
                                            name="currency"
                                            control={control}
                                            errors={errors}
                                            options={projectCurrency}
                                            placeholder="Currency"
                                        />
                                    </div>
                                    <div
                                        className="xl:col-span-4 col-span-12">
                                        <FormInput
                                            type="date"
                                            name="started_at"
                                            control={control}
                                            errors={errors}
                                            placeholder="Start Date"
                                            is_required={true}
                                        />
                                    </div>
                                    <div className="xl:col-span-4 col-span-12">
                                        <FormInput
                                            type="date"
                                            name="ended_at"
                                            control={control}
                                            errors={errors}
                                            placeholder="End Date"
                                            is_required={true}
                                        />
                                    </div>
                                    <div className="xl:col-span-4 col-span-12">
                                        <ProjectPriorityDropdown
                                            control={control}
                                            errors={errors}
                                            haveLabel={true}
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <FormTextarea
                                            name="description"
                                            control={control}
                                            errors={errors}
                                            placeholder="Description"
                                            rows={5}
                                            is_required={true}
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <GalleryUpload
                                            currentValue={formData?.attachments}
                                            files={formData?.attached_attachments}
                                            inputName="attachments"
                                            placeholder="Select Attachments"
                                            control={control}
                                            errors={errors}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div
                                className="px-6 py-4 border-t border-dashed dark:border-defaultborder/10 sm:flex justify-end">
                                <FormButton isLoading={isSubmitting}/>
                            </div>
                        </div>
                    </div>
                    <div
                        className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 sm:col-span-4 col-span-12 sticky top-0 self-start ">
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title"> Manager</div>
                            </div>
                            <div className="box-body">
                                <FormAsyncSelect
                                    label={false}
                                    name="manager"
                                    control={control}
                                    errors={errors}
                                    placeholder="Manager"
                                    apiUrl="/select/users/"
                                    queryKeyBase="users"
                                    preselectedOptions={formatOptionsWithConcatenation(formData, 'manager_option', 'id', ['full_name', 'email'])}
                                />
                            </div>
                        </div>
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title"> Members</div>
                            </div>
                            <div className="box-body">
                                <FormAsyncSelect
                                    label={false}
                                    name="users"
                                    isMulti={true}
                                    control={control}
                                    errors={errors}
                                    placeholder="Members"
                                    apiUrl="/select/users/"
                                    queryKeyBase="users"
                                    preselectedOptions={formatOptionsWithConcatenation(formData, 'user_option', 'id', ['full_name', 'email'])}
                                />
                            </div>
                        </div>
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title"> Status</div>
                            </div>
                            <div className="box-body">
                                <ProjectStatusDropdown
                                    control={control}
                                    errors={errors}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default CivilProjectForm;
