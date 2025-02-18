import {useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {useEffect} from "react";
import FormInput from "@components/form/FormInput.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import {formatOptions, formatOptionsWithConcatenation} from "@helpers/formatters.js";
import FormTextarea from "@components/form/FormTextarea.jsx";
import FormButton from "@components/form/FormButton.jsx";
import projectSchema from "@modules/project-management/schemas/projectSchema.js";
import {useProjectForm} from "@modules/project-management/hooks/projectHooks.js";
import GalleryUpload from "@components/GalleryUpload.jsx";
import FormToggle from "@components/form/FormToggle.jsx";
import HasPermission from "@components/HasPermission.jsx";
import ConflictModal from "@modules/project-management/components/model/ConflictModal.jsx";
import ProjectStatusDropdown from "@modules/project-management/components/dropdowns/ProjectStatusDropdown.jsx";
import ProjectPriorityDropdown from "@modules/project-management/components/dropdowns/ProjectPriorityDropdown.jsx";
import WorkspaceDropdown from "@components/dropdowns/WorkspaceDropdown.jsx";
import ProjectMembers from "@modules/project-management/components/project/ProjectMembers.jsx";

const ProjectForm = ({ projectData, isEditMode = false }) => {
    const { control, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            status: "not_started",
            priority: "medium",
            members: (projectData?.members && projectData.members.length > 0)
                ? projectData.members
                : [{ user_id: null, can_view_only: false, email_notification: true }],
            ...projectData
        }
    });
    const { handleProjectSubmit, haveConflict, conflicts, closeConflictModal } = useProjectForm(projectData, isEditMode);
    useEffect(() => {
        if (projectData) {
            Object.keys(projectData).forEach(key => {
                setValue(key, projectData[key]);
            });
        }
    }, [projectData, setValue]);

    const forCustomer = useWatch({ control, name: "for_customer" });
    const company = useWatch({ control, name: "company_id" });
    const department = useWatch({ control, name: "department_id" });
    return (

        <>
            <form onSubmit={handleSubmit(handleProjectSubmit)}>
            <div className="grid grid-cols-12 gap-x-6 min-h-screen">
                <div className="xxl:col-span-8 xl:col-span-8 lg:col-span-8  sm:col-span-8 col-span-12">
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title"> Project Info</div>
                        </div>
                        <div className="box-body">
                            <div className="grid grid-cols-12 gap-4">
                                <HasPermission permission='manage_project'>
                                    <div className="xl:col-span-6  col-span-12">
                                        <FormAsyncSelect
                                            name="company_id"
                                            control={control}
                                            errors={errors}
                                            placeholder="Company"
                                            apiUrl="/select/companies/"
                                            queryKeyBase="companies"
                                            clientSideSearch={true}
                                            preselectedOptions={formatOptions(projectData, 'company')}
                                        />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <FormAsyncSelect
                                            name="department_id"
                                            control={control}
                                            errors={errors}
                                            placeholder="Department"
                                            apiUrl={`/select/departments/${company ? `?company_id=${company}` : ''}`}
                                            queryKeyBase={`departments${company ? `${company}` : ''}`}
                                            clientSideSearch={true}
                                            preselectedOptions={formatOptions(projectData, 'department')}
                                        />
                                    </div>
                                </HasPermission>
                                {
                                    forCustomer &&
                                    (
                                        <div className="xl:col-span-6  col-span-12">
                                            <FormAsyncSelect
                                                name="customer_id"
                                                control={control}
                                                errors={errors}
                                                placeholder="Customer"
                                                apiUrl="/select/user/customers/"
                                                queryKeyBase="user_customers"
                                                preselectedOptions={formatOptions(projectData, 'customer', 'id', 'full_name')}
                                            />
                                        </div>
                                    )
                                }
                                <div className="xl:col-span-6 col-span-12">
                                    <FormInput
                                        name="name"
                                        control={control}
                                        errors={errors}
                                        placeholder="Project Name"
                                    />
                                </div>
                                <div
                                    className={`${forCustomer ? 'xl:col-span-4 col-span-12' : 'xl:col-span-6 col-span-12'}`}>
                                    <FormAsyncSelect
                                        name="manager_id"
                                        control={control}
                                        errors={errors}
                                        placeholder="Manager"
                                        apiUrl="/select/users/"
                                        queryKeyBase="users"
                                        preselectedOptions={formatOptionsWithConcatenation(projectData, 'manager', 'id', ['full_name', 'email'])}
                                    />
                                </div>
                                <div
                                    className={`${forCustomer ? 'xl:col-span-4 col-span-12' : 'xl:col-span-6 col-span-12'}`}>
                                    <FormInput
                                        type="date"
                                        name="started_at"
                                        control={control}
                                        errors={errors}
                                        placeholder="Start Date"
                                    />
                                </div>
                                <div
                                    className={`${forCustomer ? 'xl:col-span-4 col-span-12' : 'xl:col-span-6 col-span-12'}`}>
                                    <FormInput
                                        type="date"
                                        name="ended_at"
                                        control={control}
                                        errors={errors}
                                        placeholder="End Date"
                                    />
                                </div>
                                <div className='xl:col-span-6 col-span-12'>
                                    <WorkspaceDropdown
                                        company_id={company}
                                        department_id={department}
                                        control={control}
                                        errors={errors}
                                        saveNewOption={true}
                                        haveLabel={true}
                                        data={projectData}
                                    />
                                </div>
                                <div className='xl:col-span-6 col-span-12'>
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
                                <div className='col-span-12'>
                                    <FormToggle
                                        label={true}
                                        placeholder='Requires Approval'
                                        toggleClasses=''
                                        name="requires_approval"
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
                    <HasPermission permission='manage_customer_project'>
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title"> For Customer</div>
                            </div>
                            <div className="box-body">
                                <FormToggle
                                    toggleClasses='text-center'
                                    name="for_customer"
                                    control={control}
                                    errors={errors}
                                />
                            </div>
                        </div>
                    </HasPermission>
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title"> Members</div>
                        </div>
                        <div className="box-body">
                            <ProjectMembers data={projectData} control={control} errors={errors}/>
                        </div>
                    </div>
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
            {
                haveConflict &&
                <ConflictModal conflicts={conflicts} heading='Conflicts in milestones/tasks kindly fix this first'
                               closeModal={closeConflictModal}/>
            }
        </>
    );
};

export default ProjectForm;