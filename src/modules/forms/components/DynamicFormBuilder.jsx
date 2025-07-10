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
import Notify from "@helpers/toastNotifications.js";
import FormRichTextarea from "@components/form/FormRichTextarea.jsx";

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

const platformOptions = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'telegram', label: 'Telegram' },
    { value: 'website', label: 'Website' },
    { value: 'other', label: 'Other' },
];

const fontFamilyOptions = [
    { value: "Inter, sans-serif", label: "Inter (Default)" },
    { value: "Roboto, sans-serif", label: "Roboto" },
    { value: "Open Sans, sans-serif", label: "Open Sans" },
    { value: "Poppins, sans-serif", label: "Poppins" },
    { value: "Lato, sans-serif", label: "Lato" },
    { value: "Montserrat, sans-serif", label: "Montserrat" },
    { value: "Source Sans Pro, sans-serif", label: "Source Sans Pro" },
    { value: "Noto Sans, sans-serif", label: "Noto Sans" },
    { value: "Rubik, sans-serif", label: "Rubik" },
    { value: "Nunito, sans-serif", label: "Nunito" },
    { value: "Work Sans, sans-serif", label: "Work Sans" },
    { value: "Mulish, sans-serif", label: "Mulish" },
    { value: "Manrope, sans-serif", label: "Manrope" },
    { value: "Raleway, sans-serif", label: "Raleway" },
    { value: "IBM Plex Sans, sans-serif", label: "IBM Plex Sans" },
    { value: "DM Sans, sans-serif", label: "DM Sans" },
    { value: "Quicksand, sans-serif", label: "Quicksand" },
    { value: "Space Grotesk, sans-serif", label: "Space Grotesk" },
    { value: "Karla, sans-serif", label: "Karla" },
    { value: "Fira Sans, sans-serif", label: "Fira Sans" },
    { value: "Asap, sans-serif", label: "Asap" },
    { value: "Titillium Web, sans-serif", label: "Titillium Web" },
    { value: "Cabin, sans-serif", label: "Cabin" },
    { value: "Exo 2, sans-serif", label: "Exo 2" },
    { value: "Barlow, sans-serif", label: "Barlow" },
    { value: "Signika, sans-serif", label: "Signika" },
    { value: "PT Sans, sans-serif", label: "PT Sans" },
    { value: "Oxygen, sans-serif", label: "Oxygen" },
    { value: "Questrial, sans-serif", label: "Questrial" },
    { value: "Urbanist, sans-serif", label: "Urbanist" },
    { value: "Be Vietnam Pro, sans-serif", label: "Be Vietnam Pro" },
    { value: "Public Sans, sans-serif", label: "Public Sans" },
    { value: "Hind, sans-serif", label: "Hind" },
    { value: "Figtree, sans-serif", label: "Figtree" },
    { value: "Plus Jakarta Sans, sans-serif", label: "Plus Jakarta Sans" },
    { value: "Sora, sans-serif", label: "Sora" },
    { value: "Epilogue, sans-serif", label: "Epilogue" },
    { value: "Red Hat Display, sans-serif", label: "Red Hat Display" },
    { value: "Lexend, sans-serif", label: "Lexend" },
    { value: "Outfit, sans-serif", label: "Outfit" },
    { value: "Overpass, sans-serif", label: "Overpass" },
    { value: "Jost, sans-serif", label: "Jost" },
    { value: "Archivo, sans-serif", label: "Archivo" },
    { value: "Syne, sans-serif", label: "Syne" },
    { value: "Chivo, sans-serif", label: "Chivo" },
    { value: "Familjen Grotesk, sans-serif", label: "Familjen Grotesk" },
    { value: "Hubot Sans, sans-serif", label: "Hubot Sans" },
    { value: "Gabarito, sans-serif", label: "Gabarito" },
    { value: "Geist, sans-serif", label: "Geist" },
    { value: "League Spartan, sans-serif", label: "League Spartan" },
    { value: "Space Mono, sans-serif", label: "Space Mono" },
    { value: "Anybody, sans-serif", label: "Anybody" },
    { value: "Instrument Sans, sans-serif", label: "Instrument Sans" },
    { value: "Spline Sans, sans-serif", label: "Spline Sans" },
    { value: "Cabinet Grotesk, sans-serif", label: "Cabinet Grotesk" },
    { value: "Switzer, sans-serif", label: "Switzer" },
    { value: "Clash Display, sans-serif", label: "Clash Display" },
    { value: "General Sans, sans-serif", label: "General Sans" },
    { value: "Supreme, sans-serif", label: "Supreme" },
    { value: "Wix Madefor Display, sans-serif", label: "Wix Madefor Display" },
    { value: "Pilcrow Rounded, sans-serif", label: "Pilcrow Rounded" },
    { value: "Fragment Mono, sans-serif", label: "Fragment Mono" },
    { value: "Darker Grotesque, sans-serif", label: "Darker Grotesque" },
    { value: "Jakarta, sans-serif", label: "Jakarta" },
    { value: "Satoshi, sans-serif", label: "Satoshi" },
    { value: "Trirong, sans-serif", label: "Trirong" },
    { value: "Azeret Mono, sans-serif", label: "Azeret Mono" },
    { value: "Newsreader, sans-serif", label: "Newsreader" },
    { value: "Fraunces, sans-serif", label: "Fraunces" },
    { value: "Commissioner, sans-serif", label: "Commissioner" },
    { value: "Encode Sans, sans-serif", label: "Encode Sans" },
    { value: "Atkinson Hyperlegible, sans-serif", label: "Atkinson Hyperlegible" },
    { value: "Gudea, sans-serif", label: "Gudea" },
    { value: "M PLUS 1p, sans-serif", label: "M PLUS 1p" },
    { value: "M PLUS Rounded 1c, sans-serif", label: "M PLUS Rounded 1c" },
    { value: "Noto Sans JP, sans-serif", label: "Noto Sans JP" },
    { value: "Noto Sans KR, sans-serif", label: "Noto Sans KR" },
    { value: "Noto Sans SC, sans-serif", label: "Noto Sans SC" },
    { value: "Noto Sans TC, sans-serif", label: "Noto Sans TC" },
    { value: "Yantramanav, sans-serif", label: "Yantramanav" },
    { value: "Hanken Grotesk, sans-serif", label: "Hanken Grotesk" },
    { value: "Comfortaa, sans-serif", label: "Comfortaa" },
    { value: "Varela Round, sans-serif", label: "Varela Round" },
    { value: "Alata, sans-serif", label: "Alata" },
    { value: "Josefin Sans, sans-serif", label: "Josefin Sans" },
    { value: "Alegreya Sans, sans-serif", label: "Alegreya Sans" },
    { value: "Cantarell, sans-serif", label: "Cantarell" },
    { value: "Dosis, sans-serif", label: "Dosis" },
    { value: "Abel, sans-serif", label: "Abel" },
    { value: "Didact Gothic, sans-serif", label: "Didact Gothic" },
    { value: "Andika, sans-serif", label: "Andika" },
    { value: "Arimo, sans-serif", label: "Arimo" },
    { value: "Tinos, sans-serif", label: "Tinos" },
    { value: "Cormorant, sans-serif", label: "Cormorant" },
    { value: "Proza Libre, sans-serif", label: "Proza Libre" },
    { value: "Sarabun, sans-serif", label: "Sarabun" },
    { value: "Athiti, sans-serif", label: "Athiti" },
    { value: "Prompt, sans-serif", label: "Prompt" },
    { value: "Mitr, sans-serif", label: "Mitr" },
    { value: "Chakra Petch, sans-serif", label: "Chakra Petch" },
    { value: "K2D, sans-serif", label: "K2D" },
    { value: "Niramit, sans-serif", label: "Niramit" },
    { value: "Srisakdi, sans-serif", label: "Srisakdi" },
    { value: "Thasadith, sans-serif", label: "Thasadith" }
];


const DynamicFormBuilder = ({ formData }) => {
    const { control, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm({
        resolver: zodResolver(dynamicFormSchema),
        defaultValues: {
            title: '',
            description: '',
            font_family: 'Inter, sans-serif',
            success_message: "Thank you for your submission! We have received your form successfully.",
            primary_color: '#673ab7',
            enable_alerts: false,
            is_active: true,
            authenticated_only: false,
            require_captcha: false,
            expired_at: undefined,
            notification_emails: [],
            fields: [
                {
                    label: '',
                    name: '',
                    short_description: '',
                    field_type: 'text',
                    group: '',
                    required: false,
                    options: [],
                    order: 1
                }
            ],
            social_links: [
                {
                    platform: 'facebook',
                    url: ''
                }
            ],
            send_email_to_submitter: false,
            email_subject: '',
            email_content: '',
            ...formData,
        },
    });
    const { fields, append, remove } = useFieldArray({ control, name: 'fields' });
    const { fields: socialLinkFields, append: appendLink, remove: removeLink } = useFieldArray({control, name: 'social_links'});

    const watchedFieldTypes = useWatch({ control, name: 'fields' });
    const watchedAlertField = useWatch({ control, name: 'enable_alerts' });
    const watchedSendEmailToSubmitter = useWatch({ control, name: 'send_email_to_submitter' });

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
            setValue('font_family', formData.font_family || 'Inter, sans-serif');
            setValue('success_message', formData.success_message || "Thank you for your submission! We have received your form successfully.");
            setValue('description', formData.description || '');
            setValue('primary_color', formData.primary_color || '#673ab7');
            setValue('enable_alerts', formData.enable_alerts || false);
            setValue('is_active', formData.is_active || true);
            setValue('authenticated_only', formData.authenticated_only || false);
            setValue('require_captcha', formData.require_captcha || false);
            setValue('expired_at', formData.expired_at || undefined);
            setValue(
                'notification_emails',
                formData.notification_emails?.split(',').filter(Boolean) || []
            );
            setValue(
                'fields',
                formData.fields?.map((field) => ({
                    ...field,
                    options:
                        field.options?.length
                            ? field.options
                            : ['select', 'radio', 'checkbox'].includes(field.field_type)
                                ? [{ label: '', value: '' }]
                                : [],
                })) || [
                    {
                        label: '',
                        name: '',
                        short_description: '',
                        field_type: 'text',
                        group: '',
                        required: false,
                        options: [],
                        order: 1,
                    },
                ]
            );
            setValue(
                'social_links',
                formData.social_links?.length
                    ? formData.social_links
                    : [{ platform: 'facebook', url: '' }]
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
                Notify.success('Form Updated Successfully!');
            } else {
                await api.post('/forms/', submitData);
                Notify.success('Form Created Successfully!');
            }
        } catch (error) {
            Notify.error('Error saving form');
            console.error(error);
        }
    };

    const addField = () => {
        append({ label: '', name: '', short_description: '', field_type: 'text', group: '', required: false, options: [], order: fields.length + 1 });
    };

    const addSocialLink = () => {
        appendLink({ platform: '', url: '' });
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
                                    <div className="xl:col-span-12 col-span-12">
                                        <FormInput
                                            name="title"
                                            control={control}
                                            errors={errors}
                                            placeholder="Form Title"
                                            is_required={true}
                                        />
                                    </div>
                                    <div className="xl:col-span-4 col-span-12">
                                        <FormInput
                                            type="color"
                                            name="primary_color"
                                            control={control}
                                            errors={errors}
                                            placeholder="Form Primary Color"
                                            is_required={true}
                                            className='form-control-color !border-0 block'
                                        />
                                    </div>
                                    <div className="xl:col-span-4 col-span-12">
                                        <FormSelect
                                            name={`font_family`}
                                            control={control}
                                            options={fontFamilyOptions}
                                            errors={errors}
                                            placeholder="Form Font Family"
                                            is_required={true}
                                        />
                                    </div>
                                    <div className="xl:col-span-4 col-span-12">
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
                                    <div className="xl:col-span-12 col-span-12">
                                        <FormTextarea
                                            name="success_message"
                                            control={control}
                                            errors={errors}
                                            placeholder="Form Success Message"
                                            rows={9}
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
                                <div className="box-title">For Authenticated User</div>
                            </div>
                            <div className="box-body">
                                <FormToggle
                                    name="authenticated_only"
                                    control={control}
                                    errors={errors}
                                    toggleClasses="text-center"
                                />
                            </div>
                        </div>
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">Require Captcha</div>
                            </div>
                            <div className="box-body">
                                <FormToggle
                                    name="require_captcha"
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
                                                .map((e) => ({label: e, value: e})) || []}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">Send Email to Submitter</div>
                            </div>
                            <div className="box-body">
                                <FormToggle
                                    name="send_email_to_submitter"
                                    control={control}
                                    errors={errors}
                                    toggleClasses="text-center"
                                />
                            </div>
                        </div>

                    </div>
                    {watchedSendEmailToSubmitter && (
                        <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 sm:col-span-12 col-span-12">
                            <div className="box">
                                <div className="box-header">
                                    <div className="box-title">Email Details</div>
                                </div>
                                <div className="box-body space-y-4">
                                    {/* Subject Field */}
                                    <FormInput
                                        name="email_subject"
                                        control={control}
                                        errors={errors}
                                        placeholder="Email Subject"
                                        is_required={true}
                                    />

                                    {/* Rich Text Field */}
                                    <FormRichTextarea
                                        name="email_content"
                                        control={control}
                                        errors={errors}
                                        placeholder="Email Content"
                                        is_required={true}
                                        editorOptions={{
                                            height: 200,
                                            buttonList: [
                                                ["undo", "redo"],
                                                ["bold", "italic", "underline", "strike"],
                                                ["list", "align", "fontColor", "hiliteColor"],
                                                ["link"],
                                                ["removeFormat"]
                                            ]
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )

                    }
                    <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 sm:col-span-12 col-span-12">
                        <div className="box">
                            <div className="box-header flex justify-between items-center">
                                <div className="box-title">Form Social Links</div>
                                <button
                                    type="button"
                                    onClick={addSocialLink}
                                    className="ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                                >
                                    <i className="ri-add-line font-semibold align-middle"></i>
                                    Add Social Link
                                </button>
                            </div>
                            <div className="box-body">
                                <div className="xl:col-span-12 col-span-12">
                                    {socialLinkFields.map((field, index) => (
                                        <div
                                            key={field.id}
                                            className="grid grid-cols-12 gap-4 mb-2"
                                        >
                                            <div className="col-span-3">
                                                <FormSelect
                                                    name={`social_links.${index}.platform`}
                                                    control={control}
                                                            options={platformOptions}
                                                            errors={errors}
                                                            placeholder="Platform"
                                                            label={false}
                                                        />
                                                    </div>
                                                    <div className="col-span-8">
                                                        <FormInput
                                                            name={`social_links.${index}.url`}
                                                            control={control}
                                                            errors={errors}
                                                            placeholder="Platform URL"
                                                            label={false}
                                                        />
                                                    </div>
                                                    <div className="col-span-1 flex items-center space-x-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeLink(index)}
                                                            className="ti-btn ti-btn-danger ti-btn-sm w-max"
                                                        >
                                                            <i className="bi bi-trash3-fill"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
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
                                        <div key={field.id} className="grid grid-cols-12 gap-4 mb-4">
                                            <div className="col-span-10">
                                            <div className='grid grid-cols-12 gap-4'>
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
                                                                        placeholder="Field Description"
                                                                        label={false}
                                                                    />
                                                                </div>
                                                                <div className="xl:col-span-2 col-span-12">
                                                                    <FormInput
                                                                        name={`fields.${index}.group`}
                                                                        control={control}
                                                                        errors={errors}
                                                                        placeholder="Field Group"
                                                                        label={false}
                                                                    />
                                                                </div>
                                                                <div className="xl:col-span-2 col-span-12">
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
                                                                <div
                                                                    className="xl:col-span-2 col-span-12 flex items-center space-x-2">
                                                                    <FormCheckbox
                                                                        name={`fields.${index}.required`}
                                                                        control={control}
                                                                        errors={errors}
                                                                        label="Required"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <div className='grid grid-cols-3 gap-4'>
                                                                <div className="col-span-2">
                                                                    <FormInput
                                                                        type="number"
                                                                        name={`fields.${index}.order`}
                                                                        control={control}
                                                                        errors={errors}
                                                                        placeholder="Order"
                                                                        label={false}
                                                                    />
                                                                </div>
                                                                <div className="col-span-1 flex items-center space-x-2">
                                                                    {index !== 0 && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => remove(index)}
                                                                            className="ti-btn ti-btn-danger ti-btn-sm w-max"
                                                                        >
                                                                            <i className="bi bi-trash3-fill"></i>
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {['select', 'radio', 'checkbox'].includes(fieldType) && (
                                                            <div
                                                                className="xl:col-span-12 col-span-12 border br-4 border-gray-400 mr-4 ml-4 rounded-lg mt-2">
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