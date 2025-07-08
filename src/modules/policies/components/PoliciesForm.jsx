import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import policySchema from '@modules/policies/schemas/policySchema.js';
import { usePolicyForm } from '@modules/policies/hooks/policyHooks.js';
import FormInput from '@components/form/FormInput.jsx';
import FormAsyncSelect from '@components/form/FormAsyncSelect.jsx';
import FormButton from '@components/form/FormButton.jsx';
import FormSelect from '@components/form/FormSelect.jsx';
import GalleryUpload from '@components/GalleryUpload.jsx';
import { formatOptions } from '@helpers/formatters.js';

const PoliciesForm = ({ policyData = {}, isEditMode = false }) => {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        getValues,
        trigger
    } = useForm({
        resolver: zodResolver(policySchema),
        defaultValues: {
            title: '',
            description: '',
            is_public: true,
            attachment_ids: [],
            company_ids: [],
            department_ids: [],
            user_ids: [],
            ...policyData
        }
    });

    const isPublic = useWatch({ control, name: 'is_public' });
    const companyIds = useWatch({ control, name: 'company_ids' }) || [];
    const departmentIds = useWatch({ control, name: 'department_ids' }) || [];

    const { handlePolicySubmit } = usePolicyForm(policyData, isEditMode);

    useEffect(() => {
        if (policyData) {
            Object.keys(policyData).forEach((key) => {
                setValue(key, policyData[key]);
            });
        }
    }, [policyData, setValue]);

    useEffect(() => {
        if (isPublic) {
            setValue('company_ids', []);
            setValue('department_ids', []);
            setValue('user_ids', []);
        }

        trigger('company_ids');

        if (!isPublic) {
            setValue('company_ids', getValues('company_ids'), { shouldTouch: true });
        }
    }, [isPublic, setValue, trigger, getValues]);

    const companyQuery = companyIds.map((id) => `company_id=${id}`).join('&');
    const deptQuery = departmentIds.map((id) => `department_id=${id}`).join('&');
    const deptApiUrl = companyQuery
        ? `/select/departments-for-policies/?${companyQuery}`
        : '/select/departments-for-policies/';
    const userApiUrl =
        (companyQuery || deptQuery)
            ? `/select/users-for-policies/?${[companyQuery, deptQuery].filter(Boolean).join('&')}`
            : '/select/users-for-policies/';

    const isPublicOptions = [
        { label: "Public", value: true },
        { label: "Private", value: false }
    ];

    return (
        <form onSubmit={handleSubmit(handlePolicySubmit)}>
            <div className="grid grid-cols-12 gap-x-6">

                <div className="col-span-12">
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">Policy Details</div>
                        </div>
                        <div className="box-body">
                            <div className="grid grid-cols-12 gap-4">
                                <div className="xl:col-span-4 col-span-12">
                                    <FormInput
                                        is_required
                                        name="title"
                                        control={control}
                                        errors={errors}
                                        placeholder="Title"
                                    />
                                </div>
                                <div className="xl:col-span-4 col-span-12">
                                    <FormInput
                                        is_required
                                        name="description"
                                        control={control}
                                        errors={errors}
                                        placeholder="Short Description"
                                    />
                                </div>
                                <div className="xl:col-span-4 col-span-12">
                                    <FormSelect

                                        name="is_public"
                                        control={control}
                                        errors={errors}
                                        placeholder="Policy Visibility"
                                        isClearable={false}
                                        options={isPublicOptions}
                                    />
                                </div>

                                {!isPublic && (
                                    <>
                                        <div className="xl:col-span-4 col-span-12">
                                            <FormAsyncSelect
                                                isMulti
                                                is_required
                                                name="company_ids"
                                                control={control}
                                                errors={errors}
                                                placeholder="Select Companies"
                                                apiUrl="/select/companies/"
                                                queryKeyBase="companies"
                                                clientSideSearch
                                                preselectedOptions={formatOptions(policyData, 'companies')}
                                            />
                                        </div>

                                        <div className="xl:col-span-4 col-span-12">
                                            <FormAsyncSelect
                                                isMulti
                                                name="department_ids"
                                                control={control}
                                                errors={errors}
                                                placeholder="Select Departments"
                                                apiUrl={deptApiUrl}
                                                queryKeyBase={`departments_${companyIds.join('_')}`}
                                                clientSideSearch
                                                preselectedOptions={formatOptions(policyData, 'departments')}
                                            />
                                        </div>

                                        <div className="xl:col-span-4 col-span-12">
                                            <FormAsyncSelect
                                                isMulti
                                                name="user_ids"
                                                control={control}
                                                errors={errors}
                                                placeholder="Select Users"
                                                apiUrl={userApiUrl}
                                                queryKeyBase={`users_${[...companyIds, ...departmentIds].join('_')}`}
                                                clientSideSearch
                                                preselectedOptions={formatOptions(policyData, 'users')}
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="col-span-12">
                                    <GalleryUpload
                                        currentValue={policyData?.attachment_ids}
                                        files={policyData?.attachments}
                                        label={false}
                                        inputName="attachment_ids"
                                        placeholder="Select Attachments"
                                        control={control}
                                        errors={errors}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-dashed dark:border-defaultborder/10 sm:flex justify-end">
                            <FormButton isLoading={isSubmitting} />
                        </div>
                    </div>
                </div>

            </div>
        </form>
    );
};

export default PoliciesForm;
