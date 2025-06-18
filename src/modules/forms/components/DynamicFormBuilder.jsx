import React, { useEffect } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '@components/form/FormInput.jsx';
import FormTextarea from '@components/form/FormTextarea.jsx';
import FormToggle from '@components/form/FormToggle.jsx';
import FormSelect from '@components/form/FormSelect.jsx';
import FormButton from '@components/form/FormButton.jsx';
import OptionsRepeater from '@modules/forms/components/OptionsRepeater.jsx';
import FormAsyncSelect from '@components/form/FormAsyncSelect.jsx';
import FormCheckbox from '@components/form/FormCheckbox.jsx';
import api from "@config/axiosConfig.js";
import {dynamicFormSchema} from "@modules/forms/schemas/dynamicFormSchema.js";

const fieldTypeOptions = [
    { value: 'text', label: 'Text' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'email', label: 'Email' },
    { value: 'password', label: 'Password' },
    { value: 'url', label: 'URL' },
    { value: 'tel', label: 'Telephone' },
    { value: 'number', label: 'Number' },
    { value: 'select', label: 'Select' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'radio', label: 'Radio' },
    { value: 'date', label: 'Date' },
    { value: 'datetime-local', label: 'Date and Time' },
    { value: 'time', label: 'Time' },
    { value: 'month', label: 'Month' },
    { value: 'week', label: 'Week' },
    { value: 'file', label: 'File Upload' },
    { value: 'color', label: 'Color Picker' },
    { value: 'hidden', label: 'Hidden' },
];

const DynamicFormBuilder = ({ formData }) => {
    const { control, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm({
        resolver: zodResolver(dynamicFormSchema),
        defaultValues: {
            title: '',
            description: '',
            enable_alerts: false,
            is_active: true,
            expired_at: undefined,
            notification_emails: [],
            fields: [{ label: '', name: '', short_description: '', field_type: 'text', required: false, options: [], order: 1 }],
            ...formData,
        },
    });
    const { fields, append, remove } = useFieldArray({ control, name: 'fields' });
    const watchedFieldTypes = useWatch({ control, name: 'fields' });
    const watchedAlertField = useWatch({ control, name: 'enable_alerts' });

    useEffect(() => {
        watchedFieldTypes?.forEach((field, index) => {
            if (['select', 'radio', 'checkbox'].includes(field?.field_type) && !field.options?.length) {
                setValue(`fields.${index}.options`, [{ label: '', value: '' }]);
            } else if (!['select', 'radio', 'checkbox'].includes(field?.field_type) && field.options?.length) {
                setValue(`fields.${index}.options`, []);
            }
        });
    }, [watchedFieldTypes, setValue]);

    useEffect(() => {
        if (formData) {
            setValue('title', formData.title || '');
            setValue('description', formData.description || '');
            setValue('enable_alerts', formData.enable_alerts || false);
            setValue('is_active', formData.is_active || true);
            setValue('expired_at', formData.expired_at || undefined);
            setValue('notification_emails', formData.notification_emails?.split(',').filter(Boolean) || []);
            setValue(
                'fields',
                formData.fields?.map((field) => ({
                    ...field,
                    options: field.options?.length ? field.options : ['select', 'radio', 'checkbox'].includes(field.field_type) ? [{ label: '', value: '' }] : [],
                })) || [{ label: '', name: '', short_description: '', field_type: 'text', required: false, options: [], order: 1 }]
            );
        }
    }, [formData, setValue]);

    const onSubmit = async (data) => {
        try {
            const submitData = {
                ...data,
                notification_emails: data.notification_emails?.join(',') || '',
                fields: data.fields.map((field) => ({
                    ...field,
                    options: ['select', 'radio', 'checkbox'].includes(field.field_type)
                        ? field.options?.filter(opt => opt.label && opt.value) || []
                        : [],
                })),
            };

            if (formData?.id) {
                await api.put(`/forms/${formData.id}/`, submitData);
            } else {
                await api.post('/forms/', submitData);
            }
            // navigate('/');
        } catch (error) {
            console.error(error);
            alert('Error saving form');
        }
    };

    const addField = () => {
        append({ label: '', name: '', short_description: '', field_type: 'text', required: false, options: [], order: fields.length + 1 });
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-9 xl:col-span-9 lg:col-span-9 sm:col-span-9 col-span-12">
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">Form Info</div>
                            </div>
                            <div className="box-body">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="xl:col-span-6 col-span-12">
                                        <FormInput
                                            name="title"
                                            control={control}
                                            errors={errors}
                                            placeholder="Form Title"
                                            is_required={true}
                                        />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <FormInput
                                            type="date"
                                            name="expired_at"
                                            control={control}
                                            errors={errors}
                                            placeholder="Form Expired Date"
                                        />
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <FormTextarea
                                            name="description"
                                            control={control}
                                            errors={errors}
                                            placeholder="Form Description"
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-3 xl:col-span-3 lg:col-span-3 sm:col-span-3 col-span-12 self-start">
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">Is Active</div>
                            </div>
                            <div className="box-body">
                                <FormToggle
                                    name="is_active"
                                    control={control}
                                    errors={errors}
                                    toggleClasses="text-center"
                                />
                            </div>
                        </div>
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">Enable Submission Alerts</div>
                            </div>
                            <div className="box-body">
                                <FormToggle
                                    name="enable_alerts"
                                    control={control}
                                    errors={errors}
                                    toggleClasses="text-center"
                                />
                                {watchedAlertField && (
                                    <div className="mt-2">
                                        <FormAsyncSelect
                                            name="notification_emails"
                                            control={control}
                                            errors={errors}
                                            label="User Emails"
                                            isMulti={true}
                                            clientSideSearch={false}
                                            apiUrl="/select/user-emails/"
                                            queryKeyBase="user_emails"
                                            preselectedOptions={formData?.notification_emails
                                                ?.split(',')
                                                .filter(Boolean)
                                                .map((e) => ({ label: e, value: e })) || []}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 sm:col-span-12 col-span-12">
                        <div className="box">
                            <div className="box-header flex justify-between items-center">
                                <div className="box-title">Form Fields</div>
                                <button
                                    type="button"
                                    onClick={addField}
                                    className="ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                                >
                                    <i className="ri-add-line font-semibold align-middle"></i>
                                    Add Field
                                </button>
                            </div>
                            <div className="box-body">
                                {fields.map((field, index) => {
                                    const fieldType = watchedFieldTypes?.[index]?.field_type;
                                    return (
                                        <div key={field.id} className="grid grid-cols-12 gap-4 mb-4 ">
                                            <div className="xl:col-span-2 col-span-12">
                                                <FormInput
                                                    name={`fields.${index}.label`}
                                                    control={control}
                                                    errors={errors}
                                                    placeholder="Field Label"
                                                    label={false}
                                                />
                                            </div>
                                            <div className="xl:col-span-2 col-span-12 ">
                                                <FormInput
                                                    name={`fields.${index}.name`}
                                                    control={control}
                                                    errors={errors}
                                                    placeholder="Field Name"
                                                    label={false}
                                                />
                                            </div>
                                            <div className="xl:col-span-2 col-span-12">
                                                <FormInput
                                                    name={`fields.${index}.short_description`}
                                                    control={control}
                                                    errors={errors}
                                                    placeholder="Field Short Description"
                                                    label={false}
                                                />
                                            </div>
                                            <div className="xl:col-span-3 col-span-12">
                                                <FormSelect
                                                    name={`fields.${index}.field_type`}
                                                    control={control}
                                                    errors={errors}
                                                    placeholder="Select Field Type"
                                                    options={fieldTypeOptions}
                                                    isClearable={false}
                                                    label={false}
                                                />
                                            </div>
                                            <div className="xl:col-span-1 col-span-12">
                                                <FormInput
                                                    type="number"
                                                    name={`fields.${index}.order`}
                                                    control={control}
                                                    errors={errors}
                                                    placeholder="Order"
                                                    label={false}
                                                />
                                            </div>
                                            <div className="xl:col-span-2 col-span-12 flex items-center space-x-2">
                                                <FormCheckbox
                                                    name={`fields.${index}.required`}
                                                    control={control}
                                                    errors={errors}
                                                    label="Required"
                                                />
                                                {index !== 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        className="ti-btn ti-btn-danger ti-btn-sm w-max"
                                                    >
                                                        <i class="bi bi-trash3-fill"></i>
                                                    </button>
                                                )}
                                            </div>
                                            {['select', 'radio', 'checkbox'].includes(fieldType) && (
                                                <div className="xl:col-span-12 col-span-12 border border-gray-400 mr-4 ml-4 rounded-lg mt-10">
                                                    <OptionsRepeater
                                                        fieldIndex={index}
                                                        control={control}
                                                        setValue={setValue}
                                                        errors={errors}
                                                    />
                                                </div>
                                            )}
                                            <div className="xl:col-span-12 col-span-12 ">
                                                <div
                                                    className="px-4 py-2 dark:border-defaultborder sm:flex justify-end border-gray-400"></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="box-footer text-right">
                                <FormButton isLoading={isSubmitting}/>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default DynamicFormBuilder;