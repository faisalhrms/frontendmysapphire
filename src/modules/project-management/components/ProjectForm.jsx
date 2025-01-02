import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {useEffect} from "react";
import FormInput from "@components/form/FormInput.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import {formatOptions} from "@helpers/formatters.js";
import FormTextarea from "@components/form/FormTextarea.jsx";
import FormButton from "@components/form/FormButton.jsx";
import projectSchema from "@modules/project-management/schemas/projectSchema.js";
import {priorities, projectStatuses} from "@modules/project-management/services/projectService.js";
import {useProjectForm} from "@modules/project-management/hooks/projectHooks.js";
import GalleryUpload from "@components/GalleryUpload.jsx";

const ProjectForm = ({ projectData, isEditMode = false }) => {

    const { control, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            status: "active",
            priority: "medium",
            ...projectData
        }
    });
    const { handleProjectSubmit } = useProjectForm(projectData, isEditMode);
    useEffect(() => {
        if (projectData) {
            Object.keys(projectData).forEach(key => {
                setValue(key, projectData[key]);
            });
        }
    }, [projectData, setValue]);

    return (
        <form onSubmit={handleSubmit(handleProjectSubmit)}>
            <div className="grid grid-cols-12 gap-x-6">
                <div className="xxl:col-span-9 xl:col-span-12 lg:col-span-12 md:col-span-12 sm:col-span-12 col-span-12">
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title"> Project Info</div>
                        </div>
                        <div className="box-body">
                            <div className="grid grid-cols-12 gap-4">
                                <div className="xl:col-span-6 col-span-12">
                                    <FormInput
                                        name="name"
                                        control={control}
                                        errors={errors}
                                        placeholder="Project Name"
                                    />
                                </div>
                                <div className="xl:col-span-6 col-span-12">
                                    <FormAsyncSelect
                                        name="department_id"
                                        control={control}
                                        errors={errors}
                                        placeholder="Department"
                                        apiUrl="/select/departments/"
                                        queryKeyBase="departments"
                                        clientSideSearch={true}
                                        preselectedOptions={formatOptions(projectData, 'department')}
                                    />
                                </div>
                                <div className="xl:col-span-4 col-span-12">
                                    <FormAsyncSelect
                                        name="manager_id"
                                        control={control}
                                        errors={errors}
                                        placeholder="Manager"
                                        apiUrl="/select/users/"
                                        queryKeyBase="users"
                                        preselectedOptions={formatOptions(projectData, 'manager', 'id', 'full_name')}
                                    />
                                </div>
                                <div className="xl:col-span-4 col-span-12">
                                    <FormInput
                                        type="date"
                                        name="started_at"
                                        control={control}
                                        errors={errors}
                                        placeholder="Start Date"
                                    />
                                </div>
                                <div className="xl:col-span-4 col-span-12">
                                    <FormInput
                                        type="date"
                                        name="ended_at"
                                        control={control}
                                        errors={errors}
                                        placeholder="End Date"
                                    />
                                </div>
                                <div className="col-span-12">
                                    <FormTextarea
                                        name="description"
                                        control={control}
                                        errors={errors}
                                        placeholder="Description"
                                        rows={5}
                                    />
                                </div>
                                <div className="col-span-12">
                                    <GalleryUpload
                                        currentValue={projectData?.attachment_ids}
                                        files={projectData?.attachments}
                                        inputName="attachment_ids"
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
                <div className="xxl:col-span-3 xl:col-span-12 lg:col-span-12 md:col-span-12 sm:col-span-12 col-span-12">
                <div className="box">
                        <div className="box-header">
                            <div className="box-title"> Tags</div>
                        </div>
                        <div className="box-body">
                            <FormAsyncSelect
                                label={false}
                                isMulti={true}
                                name="tag_ids"
                                control={control}
                                errors={errors}
                                placeholder="Tags"
                                apiUrl="/select/tags/"
                                queryKeyBase="tags"
                                preselectedOptions={formatOptions(projectData, 'tags')}
                                saveOptionEndpoint="/select/tag/"
                                allowSaveNewOption={true}
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
                                isMulti={true}
                                name="user_ids"
                                control={control}
                                errors={errors}
                                placeholder="Members"
                                apiUrl="/select/users/"
                                queryKeyBase="users"
                                preselectedOptions={formatOptions(projectData, 'users', 'id', 'full_name')}
                            />
                        </div>
                    </div>
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title"> Status</div>
                        </div>
                        <div className="box-body">
                            <FormSelect
                                label={false}
                                name="status"
                                control={control}
                                errors={errors}
                                options={projectStatuses}
                                placeholder="Status"
                            />
                        </div>
                    </div>
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title"> Priority</div>
                        </div>
                        <div className="box-body">
                            <FormSelect
                                label={false}
                                name="priority"
                                control={control}
                                errors={errors}
                                options={priorities}
                                placeholder="Priority"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default ProjectForm;