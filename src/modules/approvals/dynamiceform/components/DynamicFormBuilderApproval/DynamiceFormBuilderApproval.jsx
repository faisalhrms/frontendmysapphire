// import React, { useEffect, useState } from 'react';
// import { useForm, useFieldArray, useWatch } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { FiInfo, FiSettings, FiLink, FiEdit, FiCheck } from 'react-icons/fi';
// import FormInput from '@components/form/FormInput.jsx';
// import FormTextarea from '@components/form/FormTextarea.jsx';
// import FormToggle from '@components/form/FormToggle.jsx';
// import FormSelect from '@components/form/FormSelect.jsx';
// import FormButton from '@components/form/FormButton.jsx';
// import OptionsRepeater from '@modules/forms/components/OptionsRepeater.jsx';
// import FormAsyncSelect from '@components/form/FormAsyncSelect.jsx';
// import FormCheckbox from '@components/form/FormCheckbox.jsx';
// import api from '@config/axiosConfig.js';
// import { dynamicFormSchema } from '@modules/forms/schemas/dynamicFormSchema.js';
// import Notify from '@helpers/toastNotifications.js';
// import FormRichTextarea from '@components/form/FormRichTextarea.jsx';
// import { fontFamilyOptions, fieldTypeOptions, platformOptions } from '@modules/forms/services/DynamicFormService.js';
// import { getPastDate } from '@helpers/dateTime.js';
//
// const DynamicFormBuilder = ({ formData, disabled = false }) => {
//     const [currentStep, setCurrentStep] = useState(0);
//     const [isGoingBack, setIsGoingBack] = useState(false);
//     const [isStepValidating, setIsStepValidating] = useState(false);
//
//     const steps = [
//         { title: 'Basic Info', icon: <FiInfo /> },
//         { title: 'Settings', icon: <FiSettings /> },
//         { title: 'Form Fields', icon: <FiEdit /> },
//         { title: 'Social Links', icon: <FiLink /> },
//     ];
//
//     const { control, handleSubmit, watch, formState: { errors, isSubmitting }, setValue, trigger } = useForm({
//         resolver: zodResolver(dynamicFormSchema),
//         defaultValues: {
//             title: '',
//             description: '',
//             font_family: 'Inter, sans-serif',
//             success_message: 'Thank you for your submission! We have received your form successfully.',
//             primary_color: '#673ab7',
//             enable_alerts: false,
//             is_active: true,
//             authenticated_only: false,
//             require_captcha: false,
//             expired_at: undefined,
//             notification_emails: [],
//             fields: [
//                 {
//                     label: '',
//                     name: '',
//                     short_description: '',
//                     field_type: 'text',
//                     group: '',
//                     required: false,
//                     options: [],
//                     order: 1,
//                 },
//             ],
//             social_links: [],
//             send_email_to_submitter: false,
//             email_subject: '',
//             email_content: '',
//             enable_birthday_gift: false,
//             birthday_coupon_type: null,
//             birthday_discount_amount: null,
//             birthday_min_order_value: null,
//             birthday_coupon_valid_days: 7,
//             enable_anniversary_voucher: false,
//             anniversary_coupon_type: null,
//             anniversary_discount_amount: null,
//             anniversary_min_order_value: null,
//             anniversary_coupon_valid_days: 7,
//             ...formData,
//         },
//     });
//
//     const { fields, append, remove } = useFieldArray({ control, name: 'fields' });
//     const { fields: socialLinkFields, append: appendLink, remove: removeLink } = useFieldArray({ control, name: 'social_links' });
//
//     const watchedFieldTypes = useWatch({ control, name: 'fields' });
//     const watchedAlertField = useWatch({ control, name: 'enable_alerts' });
//     const watchedSendEmailToSubmitter = useWatch({ control, name: 'send_email_to_submitter' });
//     const watchedBirthdayGift = useWatch({ control, name: 'enable_birthday_gift' });
//     const watchedAnniversaryVoucher = useWatch({ control, name: 'enable_anniversary_voucher' });
//
//     useEffect(() => {
//         watchedFieldTypes?.forEach((field, index) => {
//             if (['select', 'radio', 'checkbox'].includes(field?.field_type) && !field.options?.length) {
//                 setValue(`fields.${index}.options`, [{ label: '', value: '' }]);
//             } else if (!['select', 'radio', 'checkbox'].includes(field?.field_type) && field.options?.length) {
//                 setValue(`fields.${index}.options`, []);
//             }
//         });
//     }, [watchedFieldTypes, setValue]);
//
//     useEffect(() => {
//         if (formData) {
//             setValue('title', formData.title || '');
//             setValue('font_family', formData.font_family || 'Inter, sans-serif');
//             setValue('success_message', formData.success_message || 'Thank you for your submission! We have received your form successfully.');
//             setValue('description', formData.description || '');
//             setValue('primary_color', formData.primary_color || '#673ab7');
//             setValue('enable_alerts', formData.enable_alerts || false);
//             setValue('is_active', formData.is_active || true);
//             setValue('authenticated_only', formData.authenticated_only || false);
//             setValue('require_captcha', formData.require_captcha || false);
//             setValue('expired_at', formData.expired_at || undefined);
//             setValue(
//                 'notification_emails',
//                 formData.notification_emails?.split(',').filter(Boolean) || []
//             );
//             setValue(
//                 'fields',
//                 formData.fields?.map((field) => ({
//                     ...field,
//                     options: field.options?.length
//                         ? field.options
//                         : ['select', 'radio', 'checkbox'].includes(field.field_type)
//                             ? [{ label: '', value: '' }]
//                             : [],
//                 })) || [
//                     {
//                         label: '',
//                         name: '',
//                         short_description: '',
//                         field_type: 'text',
//                         group: '',
//                         required: false,
//                         options: [],
//                         order: 1,
//                     },
//                 ]
//             );
//             setValue(
//                 'social_links',
//                 formData.social_links?.length ? formData.social_links : []
//             );
//         }
//     }, [formData, setValue]);
//
//     const onSubmit = async (data) => {
//         if (disabled) return; // Prevent submission if disabled
//         try {
//             const submitData = {
//                 ...data,
//                 notification_emails: data.notification_emails?.join(',') || '',
//                 fields: data.fields.map((field) => ({
//                     ...field,
//                     options: ['select', 'radio', 'checkbox'].includes(field.field_type)
//                         ? field.options?.filter(opt => opt.label && opt.value) || []
//                         : [],
//                 })),
//             };
//
//             if (formData?.id) {
//                 await api.put(`/forms/${formData.id}/`, submitData);
//                 Notify.success('Form Updated Successfully!');
//             } else {
//                 await api.post('/forms/', submitData);
//                 Notify.success('Form Created Successfully!');
//             }
//         } catch (error) {
//             Notify.error('Error saving form');
//             console.error(error);
//         }
//     };
//
//     const addField = () => {
//         if (disabled) return; // Prevent adding fields if disabled
//         append({ label: '', name: '', short_description: '', field_type: 'text', group: '', required: false, options: [], order: fields.length + 1 });
//     };
//
//     const addSocialLink = () => {
//         if (disabled) return; // Prevent adding social links if disabled
//         appendLink({ platform: 'facebook', url: '' });
//     };
//
//     const validateCurrentStep = async () => {
//         if (disabled) return true; // Skip validation if disabled
//         const stepFields = {
//             0: ['title', 'description', 'success_message'],
//             1: [
//                 'primary_color',
//                 'font_family',
//                 'expired_at',
//                 'is_active',
//                 'authenticated_only',
//                 'require_captcha',
//                 'enable_alerts',
//                 'send_email_to_submitter',
//                 'enable_birthday_gift',
//                 'enable_anniversary_voucher',
//                 ...(watchedAlertField ? ['notification_emails'] : []),
//                 ...(watchedSendEmailToSubmitter ? ['email_subject', 'email_content'] : []),
//                 ...(watchedBirthdayGift
//                     ? [
//                         'birthday_coupon_type',
//                         'birthday_discount_amount',
//                         'birthday_coupon_valid_days',
//                         ...(watch('birthday_coupon_type') === 'percentage_threshold'
//                             ? ['birthday_min_order_value']
//                             : []),
//                     ]
//                     : []),
//                 ...(watchedAnniversaryVoucher
//                     ? [
//                         'anniversary_coupon_type',
//                         'anniversary_discount_amount',
//                         'anniversary_coupon_valid_days',
//                         ...(watch('anniversary_coupon_type') === 'percentage_threshold'
//                             ? ['anniversary_min_order_value']
//                             : []),
//                     ]
//                     : []),
//             ],
//             2: ['fields'],
//             3: ['social_links'],
//         };
//
//         const fieldsToValidate = stepFields[currentStep] || [];
//         const isValid = await trigger(fieldsToValidate, { shouldFocus: true });
//
//         if (!isValid) {
//             // Notify.error('Please fill out all required fields correctly.');
//         }
//
//         return isValid;
//     };
//
//     const nextStep = async () => {
//         if (disabled) return; // Prevent navigation if disabled
//         setIsStepValidating(true);
//         const isValid = await validateCurrentStep();
//
//         if (isValid) {
//             setIsGoingBack(false);
//             setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
//         }
//
//         setIsStepValidating(false);
//     };
//
//     const prevStep = () => {
//         if (disabled) return; // Prevent navigation if disabled
//         setIsGoingBack(true);
//         setCurrentStep((prev) => Math.max(prev - 1, 0));
//     };
//
//     const goToStep = async (stepIndex) => {
//         if (disabled) return; // Prevent step navigation if disabled
//         if (stepIndex < currentStep) {
//             setIsGoingBack(true);
//             setCurrentStep(stepIndex);
//             return;
//         }
//
//         setIsStepValidating(true);
//         const isValid = await validateCurrentStep();
//
//         if (isValid) {
//             setIsGoingBack(false);
//             setCurrentStep(stepIndex);
//         }
//
//         setIsStepValidating(false);
//     };
//
//     return (
//         <div className='container sm:p-3 !p-0'>
//             <form onSubmit={handleSubmit(onSubmit)}>
//                 <div className="flex justify-center mb-8">
//                     <div className="flex items-center max-w-3xl w-full">
//                         {steps.map((step, index) => (
//                             <React.Fragment key={index}>
//                                 <div className="flex flex-col items-center">
//                                     <div
//                                         className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors
//                       ${currentStep === index
//                                             ? 'bg-primary text-white'
//                                             : currentStep > index
//                                                 ? 'bg-success text-white'
//                                                 : 'bg-gray-300 text-gray-700'}
//                       ${isStepValidating || disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
//                                         onClick={() => !isStepValidating && !disabled && goToStep(index)}
//                                     >
//                     <span className={`text-2xl`}>
//                       {currentStep > index ? <FiCheck /> : step.icon}
//                     </span>
//                                     </div>
//                                     <span
//                                         className={`mt-2 text-sm font-medium ${currentStep >= index ? 'text-gray-800' : 'text-gray-800'}`}>
//                     {step.title}
//                   </span>
//                                 </div>
//                                 {index < steps.length - 1 && (
//                                     <div className={`flex-1 h-1 mb-4 mx-2 ${currentStep > index ? 'bg-gray-500' : 'bg-gray-200'}`}></div>
//                                 )}
//                             </React.Fragment>
//                         ))}
//                     </div>
//                 </div>
//
//                 <div className="grid grid-cols-12 gap-6 mb-[3rem]">
//                     <div className="xl:col-span-12 col-span-12">
//                         <div className="box">
//                             <div className="box-body">
//                                 {currentStep === 0 && (
//                                     <div className="space-y-4">
//                                         <div className="grid grid-cols-12 gap-4">
//                                             <div className="xl:col-span-12 col-span-12">
//                                                 <FormInput
//                                                     name="title"
//                                                     control={control}
//                                                     errors={errors}
//                                                     placeholder="Form Title"
//                                                     is_required={true}
//                                                     disabled={disabled}
//                                                 />
//                                             </div>
//                                             <div className="xl:col-span-12 col-span-12">
//                                                 <FormTextarea
//                                                     name="description"
//                                                     control={control}
//                                                     errors={errors}
//                                                     placeholder="Form Description"
//                                                     rows={5}
//                                                     disabled={disabled}
//                                                 />
//                                             </div>
//                                             <div className="xl:col-span-12 col-span-12">
//                                                 <FormTextarea
//                                                     name="success_message"
//                                                     control={control}
//                                                     errors={errors}
//                                                     placeholder="Form Success Message"
//                                                     rows={3}
//                                                     disabled={disabled}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}
//
//                                 {currentStep === 1 && (
//                                     <div className="space-y-6">
//                                         <ul className="list-group list-group-flush list-none !rounded-md">
//                                             <li className="list-group-item">
//                                                 <div className="grid grid-cols-12 xl:gap-x-[3rem] gap-y-4">
//                                                     <div className="xl:col-span-4 col-span-12">
//                                                         <p className="text-[1rem] mb-1 font-semibold">Configure</p>
//                                                         <p className="text-[0.75rem] mb-0 text-[#8c9097] dark:text-white/50">
//                                                             Customize the appearance and expiry settings of your interface.
//                                                         </p>
//                                                     </div>
//                                                     <div className="xl:col-span-8 col-span-12">
//                                                         <div className="flex items-center justify-between sm:mt-0 mt-8">
//                                                             <div className="mail-notification-settings">
//                                                                 <p className="text-[0.875rem] mb-1 font-semibold">Primary Color</p>
//                                                                 <p className="text-[0.75rem] mb-0 text-[#8c9097] dark:text-white/50">
//                                                                     Customize primary colors to align the interface with your brand identity.
//                                                                 </p>
//                                                             </div>
//                                                             <div>
//                                                                 <div className="xl:col-span-4 col-span-12">
//                                                                     <FormInput
//                                                                         type="color"
//                                                                         name="primary_color"
//                                                                         control={control}
//                                                                         errors={errors}
//                                                                         is_required={false}
//                                                                         className='form-control-color !border-0 block'
//                                                                         disabled={disabled}
//                                                                     />
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                         <div className="flex items-center justify-between mt-8">
//                                                             <div className="mail-notification-settings">
//                                                                 <p className="text-[0.875rem] mb-1 font-semibold">Font Family Options</p>
//                                                                 <p className="text-[0.75rem] mb-0 text-[#8c9097] dark:text-white/50">
//                                                                     Choose a font style to match your brand's visual tone and readability.
//                                                                 </p>
//                                                             </div>
//                                                             <div>
//                                                                 <div className="w-64 xl:col-span-4 col-span-12">
//                                                                     <FormSelect
//                                                                         name={`font_family`}
//                                                                         control={control}
//                                                                         options={fontFamilyOptions}
//                                                                         errors={errors}
//                                                                         is_required={false}
//                                                                         disabled={disabled}
//                                                                     />
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                         <div className="flex items-center justify-between mt-8">
//                                                             <div className="mail-notification-settings">
//                                                                 <p className="text-[0.875rem] mb-1 font-semibold">Expired At</p>
//                                                                 <p className="text-[0.75rem] mb-0 text-[#8c9097] dark:text-white/50">
//                                                                     Set the expiration date to automatically disable the feature after a specific time.
//                                                                 </p>
//                                                             </div>
//                                                             <div>
//                                                                 <div className="xl:col-span-4 col-span-12">
//                                                                     <FormInput
//                                                                         type="date"
//                                                                         name="expired_at"
//                                                                         control={control}
//                                                                         errors={errors}
//                                                                         min={getPastDate(0)}
//                                                                         disabled={disabled}
//                                                                     />
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </li>
//                                             <li className="list-group-item">
//                                                 <div className="grid grid-cols-12 xl:gap-x-[3rem] gap-y-4">
//                                                     <div className="xl:col-span-4 col-span-12">
//                                                         <p className="text-[1rem] mb-1 font-semibold">Security</p>
//                                                         <p className="text-[0.75rem] mb-0 text-[#8c9097] dark:text-white/50">
//                                                             Manage account protection, access rules, and alerts.
//                                                         </p>
//                                                     </div>
//                                                     <div className="xl:col-span-8 col-span-12">
//                                                         <div className="flex items-center justify-between sm:mt-0 mt-4">
//                                                             <div className="mail-notification-settings">
//                                                                 <p className="text-[0.875rem] mb-1 font-semibold">Is Active</p>
//                                                                 <p className="text-[0.75rem] mb-0 text-[#8c9097] dark:text-white/50">
//                                                                     Toggle to enable or disable this feature or module.
//                                                                 </p>
//                                                             </div>
//                                                             <div>
//                                                                 <FormToggle
//                                                                     name="is_active"
//                                                                     control={control}
//                                                                     errors={errors}
//                                                                     toggleClasses="text-center"
//                                                                     disabled={disabled}
//                                                                 />
//                                                             </div>
//                                                         </div>
//                                                         <div className="flex items-center justify-between mt-8">
//                                                             <div className="mail-notification-settings">
//                                                                 <p className="text-[0.875rem] mb-1 font-semibold">For Authenticated User</p>
//                                                                 <p className="text-[0.75rem] mb-0 text-[#8c9097] dark:text-white/50">
//                                                                     Restrict access to only logged-in or authenticated users.
//                                                                 </p>
//                                                             </div>
//                                                             <div>
//                                                                 <FormToggle
//                                                                     name="authenticated_only"
//                                                                     control={control}
//                                                                     errors={errors}
//                                                                     toggleClasses="text-center"
//                                                                     disabled={disabled}
//                                                                 />
//                                                             </div>
//                                                         </div>
//                                                         <div className="flex items-center justify-between mt-8">
//                                                             <div className="mail-notification-settings">
//                                                                 <p className="text-[0.875rem] mb-1 font-semibold">Require Captcha</p>
//                                                                 <p className="text-[0.75rem] mb-0 text-[#8c9097] dark:text-white/50">
//                                                                     Enable CAPTCHA verification to prevent spam and ensure submissions are made by real users.
//                                                                 </p>
//                                                             </div>
//                                                             <div>
//                                                                 <FormToggle
//                                                                     name="require_captcha"
//                                                                     control={control}
//                                                                     errors={errors}
//                                                                     toggleClasses="text-center"
//                                                                     disabled={disabled}
//                                                                 />
//                                                             </div>
//                                                         </div>
//                                                         <div className="flex items-center justify-between mt-8">
//                                                             <div className="xl:col-span-3 col-span-12">
//                                                                 <p className="text-[0.875rem] mb-1 font-semibold">Enable Submission Alerts</p>
//                                                                 <p className="text-[0.75rem] mb-0 text-[#8c9097] dark:text-white/50">
//                                                                     Get alerts when a new submission is received.
//                                                                 </p>
//                                                             </div>
//                                                             <div className="xl:col-span-4 col-span-12">
//                                                                 {watchedAlertField && (
//                                                                     <div className="mt-2 w-64 xl:col-span-4 col-span-12">
//                                                                         <FormAsyncSelect
//                                                                             name="notification_emails"
//                                                                             control={control}
//                                                                             errors={errors}
//                                                                             label="User Emails"
//                                                                             isMulti={true}
//                                                                             clientSideSearch={false}
//                                                                             apiUrl="/select/user-emails/"
//                                                                             queryKeyBase="user_emails"
//                                                                             preselectedOptions={formData?.notification_emails
//                                                                                 ?.split(',')
//                                                                                 .filter(Boolean)
//                                                                                 .map((e) => ({
//                                                                                     label: e,
//                                                                                     value: e,
//                                                                                 })) || []}
//                                                                             disabled={disabled}
//                                                                         />
//                                                                     </div>
//                                                                 )}
//                                                             </div>
//                                                             <div className="xl:col-span-4 col-span-12">
//                                                                 <FormToggle
//                                                                     name="enable_alerts"
//                                                                     control={control}
//                                                                     errors={errors}
//                                                                     toggleClasses="text-right mt-4"
//                                                                     disabled={disabled}
//                                                                 />
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </li>
//                                             <li className="list-group-item">
//                                                 <div className="grid grid-cols-12 xl:gap-x-[3rem] gap-y-4">
//                                                     <div className="xl:col-span-4 col-span-12">
//                                                         <p className="text-[1rem] mb-1 font-semibold">Send Email to Submitter</p>
//                                                         <p className="text-[0.75rem] mb-0 text-[#8c9097] dark:text-white/50">
//                                                             Automatically send a confirmation or notification email to the form submitter.
//                                                         </p>
//                                                     </div>
//                                                     <div className="xl:col-span-8 col-span-12">
//                                                         <div className="flex items-center justify-between mt-8">
//                                                             <div className="mail-notification-settings">
//                                                                 <p className="text-[0.875rem] mb-1 font-semibold"></p>
//                                                             </div>
//                                                             <div>
//                                                                 <FormToggle
//                                                                     name="send_email_to_submitter"
//                                                                     control={control}
//                                                                     errors={errors}
//                                                                     toggleClasses="text-center"
//                                                                     disabled={disabled}
//                                                                 />
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                     {watchedSendEmailToSubmitter && (
//                                                         <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 sm:col-span-12 col-span-12">
//                                                             <div className="box">
//                                                                 <div className="space-y-2">
//                                                                     <FormInput
//                                                                         name="email_subject"
//                                                                         control={control}
//                                                                         errors={errors}
//                                                                         placeholder="Email Subject"
//                                                                         is_required={true}
//                                                                         disabled={disabled}
//                                                                     />
//                                                                     <FormRichTextarea
//                                                                         name="email_content"
//                                                                         control={control}
//                                                                         errors={errors}
//                                                                         placeholder="Email Content"
//                                                                         is_required={true}
//                                                                         editorOptions={{
//                                                                             height: 100,
//                                                                             buttonList: [
//                                                                                 ['undo', 'redo'],
//                                                                                 ['bold', 'italic', 'underline', 'strike'],
//                                                                                 ['list', 'align', 'fontColor', 'hiliteColor'],
//                                                                                 ['link'],
//                                                                                 ['removeFormat'],
//                                                                             ],
//                                                                         }}
//                                                                         disabled={disabled}
//                                                                     />
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </li>
//                                             <li className="list-group-item">
//                                                 <div className="grid grid-cols-12 xl:gap-x-[3rem] gap-y-4">
//                                                     <div className="xl:col-span-4 col-span-12">
//                                                         <p className="text-[1rem] mb-1 font-semibold">Birthday Gift Settings</p>
//                                                         <p className="text-[0.75rem] mb-0 text-[#8c9097] dark:text-white/50">
//                                                             Customize birthday gift options, eligibility rules, and notification preferences.
//                                                         </p>
//                                                     </div>
//                                                     <div className="xl:col-span-8 col-span-12">
//                                                         <div className="flex items-center justify-between mt-8">
//                                                             <div className="mail-notification-settings">
//                                                                 <p className="text-[0.875rem] mb-1 font-semibold"></p>
//                                                             </div>
//                                                             <div>
//                                                                 <FormToggle
//                                                                     name="enable_birthday_gift"
//                                                                     control={control}
//                                                                     errors={errors}
//                                                                     toggleClasses="text-center"
//                                                                     disabled={disabled}
//                                                                 />
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                     {watchedBirthdayGift && (
//                                                         <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 sm:col-span-12 col-span-12">
//                                                             <div className="space-y-2">
//                                                                 <FormSelect
//                                                                     name="birthday_coupon_type"
//                                                                     control={control}
//                                                                     errors={errors}
//                                                                     options={[
//                                                                         { label: 'Fixed Discount (incl. discounted products)', value: 'fixed' },
//                                                                         { label: 'Percentage Discount with Min Threshold (excl. discounted products)', value: 'percentage_threshold' },
//                                                                         { label: 'Percentage Discount (excl. discounted products)', value: 'percentage' },
//                                                                     ]}
//                                                                     placeholder="Select Coupon Type"
//                                                                     is_required={true}
//                                                                     disabled={disabled}
//                                                                 />
//                                                                 <div className="flex flex-col md:flex-row gap-4">
//                                                                     <div className="w-full md:w-1/3">
//                                                                         <FormInput
//                                                                             name="birthday_discount_amount"
//                                                                             control={control}
//                                                                             errors={errors}
//                                                                             placeholder="Discount Amount / Percentage"
//                                                                             type="number"
//                                                                             is_required={true}
//                                                                             disabled={disabled}
//                                                                         />
//                                                                     </div>
//                                                                     {watch('birthday_coupon_type') === 'percentage_threshold' && (
//                                                                         <div className="w-full md:w-1/3">
//                                                                             <FormInput
//                                                                                 name="birthday_min_order_value"
//                                                                                 control={control}
//                                                                                 errors={errors}
//                                                                                 placeholder="Min Order Value (for threshold)"
//                                                                                 type="number"
//                                                                                 is_required={false}
//                                                                                 disabled={disabled}
//                                                                             />
//                                                                         </div>
//                                                                     )}
//                                                                     <div className="w-full md:w-1/3">
//                                                                         <FormInput
//                                                                             name="birthday_coupon_valid_days"
//                                                                             control={control}
//                                                                             errors={errors}
//                                                                             placeholder="Coupon Validity (in days)"
//                                                                             type="number"
//                                                                             is_required={false}
//                                                                             disabled={disabled}
//                                                                         />
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </li>
//                                             <li className="list-group-item">
//                                                 <div className="grid grid-cols-12 xl:gap-x-[3rem] gap-y-4">
//                                                     <div className="xl:col-span-4 col-span-12">
//                                                         <p className="text-[1rem] mb-1 font-semibold">Enable Anniversary Voucher</p>
//                                                         <p className="text-[0.75rem] mb-0 text-[#8c9097] dark:text-white/50">
//                                                             Activate and configure anniversary voucher settings, eligibility criteria, and notifications.
//                                                         </p>
//                                                     </div>
//                                                     <div className="xl:col-span-8 col-span-12">
//                                                         <div className="flex items-center justify-between mt-8">
//                                                             <div className="mail-notification-settings">
//                                                                 <p className="text-[0.875rem] mb-1 font-semibold"></p>
//                                                             </div>
//                                                             <div>
//                                                                 <FormToggle
//                                                                     name="enable_anniversary_voucher"
//                                                                     control={control}
//                                                                     errors={errors}
//                                                                     toggleClasses="text-center"
//                                                                     disabled={disabled}
//                                                                 />
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                     {watchedAnniversaryVoucher && (
//                                                         <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 sm:col-span-12 col-span-12">
//                                                             <div className="space-y-2">
//                                                                 <FormSelect
//                                                                     name="anniversary_coupon_type"
//                                                                     control={control}
//                                                                     errors={errors}
//                                                                     options={[
//                                                                         { label: 'Fixed Discount', value: 'fixed' },
//                                                                         { label: 'Percentage Discount with Min Threshold', value: 'percentage_threshold' },
//                                                                         { label: 'Percentage Discount', value: 'percentage' },
//                                                                     ]}
//                                                                     placeholder="Select Coupon Type"
//                                                                     is_required={true}
//                                                                     disabled={disabled}
//                                                                 />
//                                                                 <div className="flex flex-col md:flex-row gap-4">
//                                                                     <div className="w-full md:w-1/3">
//                                                                         <FormInput
//                                                                             name="anniversary_discount_amount"
//                                                                             control={control}
//                                                                             errors={errors}
//                                                                             placeholder="Discount Amount / Percentage"
//                                                                             type="number"
//                                                                             is_required={true}
//                                                                             disabled={disabled}
//                                                                         />
//                                                                     </div>
//                                                                     {watch('anniversary_coupon_type') === 'percentage_threshold' && (
//                                                                         <div className="w-full md:w-1/3">
//                                                                             <FormInput
//                                                                                 name="anniversary_min_order_value"
//                                                                                 control={control}
//                                                                                 errors={errors}
//                                                                                 placeholder="Min Order Value (for threshold)"
//                                                                                 type="number"
//                                                                                 is_required={false}
//                                                                                 disabled={disabled}
//                                                                             />
//                                                                         </div>
//                                                                     )}
//                                                                     <div className="w-full md:w-1/3">
//                                                                         <FormInput
//                                                                             name="anniversary_coupon_valid_days"
//                                                                             control={control}
//                                                                             errors={errors}
//                                                                             placeholder="Coupon Validity (in days)"
//                                                                             type="number"
//                                                                             is_required={false}
//                                                                             disabled={disabled}
//                                                                         />
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </li>
//                                         </ul>
//                                     </div>
//                                 )}
//
//                                 {currentStep === 2 && (
//                                     <div className="space-y-4">
//                                         <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 sm:col-span-12 col-span-12">
//                                             <div className="box">
//                                                 <div className="box-body border">
//                                                     {fields.map((field, index) => {
//                                                         const fieldType = watchedFieldTypes?.[index]?.field_type;
//                                                         return (
//                                                             <div key={field.id} className="border border-gray-300 rounded-lg p-4 mt-4 bg-gray-50 dark:text-gray-200 dark:bg-bodybg">
//                                                                 <div className="grid grid-cols-12 gap-4">
//                                                                     <div className="col-span-10">
//                                                                         <div className='grid grid-cols-12 gap-4'>
//                                                                             <div className="xl:col-span-2 col-span-12">
//                                                                                 <FormInput
//                                                                                     name={`fields.${index}.label`}
//                                                                                     control={control}
//                                                                                     errors={errors}
//                                                                                     placeholder="Field Label"
//                                                                                     label={false}
//                                                                                     disabled={disabled}
//                                                                                 />
//                                                                             </div>
//                                                                             <div className="xl:col-span-2 col-span-12">
//                                                                                 <FormInput
//                                                                                     name={`fields.${index}.name`}
//                                                                                     control={control}
//                                                                                     errors={errors}
//                                                                                     placeholder="Field Name"
//                                                                                     label={false}
//                                                                                     disabled={true} // Already disabled in original code
//                                                                                 />
//                                                                             </div>
//                                                                             <div className="xl:col-span-2 col-span-12">
//                                                                                 <FormInput
//                                                                                     name={`fields.${index}.short_description`}
//                                                                                     control={control}
//                                                                                     errors={errors}
//                                                                                     placeholder="Field Description"
//                                                                                     label={false}
//                                                                                     disabled={disabled}
//                                                                                 />
//                                                                             </div>
//                                                                             <div className="xl:col-span-2 col-span-12">
//                                                                                 <FormInput
//                                                                                     name={`fields.${index}.group`}
//                                                                                     control={control}
//                                                                                     errors={errors}
//                                                                                     placeholder="Field Group"
//                                                                                     label={false}
//                                                                                     disabled={disabled}
//                                                                                 />
//                                                                             </div>
//                                                                             <div className="xl:col-span-2 col-span-12">
//                                                                                 <FormSelect
//                                                                                     name={`fields.${index}.field_type`}
//                                                                                     control={control}
//                                                                                     errors={errors}
//                                                                                     placeholder="Select Field Type"
//                                                                                     options={fieldTypeOptions}
//                                                                                     isClearable={false}
//                                                                                     label={false}
//                                                                                     disabled={disabled}
//                                                                                 />
//                                                                             </div>
//                                                                             <div className="xl:col-span-2 col-span-12 flex items-center space-x-4 ml-4">
//                                                                                 <FormCheckbox
//                                                                                     name={`fields.${index}.required`}
//                                                                                     control={control}
//                                                                                     errors={errors}
//                                                                                     label="Required"
//                                                                                     disabled={disabled}
//                                                                                 />
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                     <div className="col-span-2">
//                                                                         <div className='grid grid-cols-3 gap-4'>
//                                                                             <div className="col-span-2">
//                                                                                 <FormInput
//                                                                                     type="number"
//                                                                                     name={`fields.${index}.order`}
//                                                                                     control={control}
//                                                                                     errors={errors}
//                                                                                     placeholder="Order"
//                                                                                     label={false}
//                                                                                     disabled={disabled}
//                                                                                 />
//                                                                             </div>
//                                                                             <div className="col-span-1 flex items-center space-x-2">
//                                                                                 {!disabled && index !== 0 && (
//                                                                                     <button
//                                                                                         type="button"
//                                                                                         onClick={() => remove(index)}
//                                                                                         className="ti-btn ti-btn-danger ti-btn-sm w-max"
//                                                                                     >
//                                                                                         <i className="bi bi-trash3-fill"></i>
//                                                                                     </button>
//                                                                                 )}
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                                 {['select', 'radio', 'checkbox'].includes(fieldType) && (
//                                                                     <div className="border border-gray-400 rounded-lg p-4 mt-4 bg-white">
//                                                                         <OptionsRepeater
//                                                                             fieldIndex={index}
//                                                                             control={control}
//                                                                             setValue={setValue}
//                                                                             errors={errors}
//                                                                             disabled={disabled} // Pass disabled prop to OptionsRepeater
//                                                                         />
//                                                                     </div>
//                                                                 )}
//                                                             </div>
//                                                         );
//                                                     })}
//                                                     {!disabled && ( // Conditionally render Add Field button
//                                                         <div className="mt-4">
//                                                             <button
//                                                                 type="button"
//                                                                 onClick={addField}
//                                                                 className="ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
//                                                             >
//                                                                 <i className="ri-add-line font-semibold align-middle"></i>
//                                                                 Add Field
//                                                             </button>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}
//
//                                 {currentStep === 3 && (
//                                     <div className="space-y-4">
//                                         <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 sm:col-span-12 col-span-12">
//                                             <div className="box">
//                                                 <div className="box-body border">
//                                                     <div className="xl:col-span-12 col-span-12">
//                                                         {socialLinkFields.length === 0 ? (
//                                                             <div className="text-center py-8">
//                                                                 <FiLink className="mx-auto text-4xl text-gray-400 mb-4" />
//                                                                 <p className="text-gray-500 mb-4">
//                                                                     No social links added yet
//                                                                 </p>
//                                                                 {!disabled && ( // Conditionally render Add Social Link button
//                                                                     <button
//                                                                         type="button"
//                                                                         onClick={addSocialLink}
//                                                                         className="ti-btn ti-btn-primary-full"
//                                                                     >
//                                                                         <i className="ri-add-line font-semibold align-middle me-1"></i>
//                                                                         Add Social Link
//                                                                     </button>
//                                                                 )}
//                                                             </div>
//                                                         ) : (
//                                                             <>
//                                                                 {socialLinkFields.map((field, index) => (
//                                                                     <div key={field.id} className="grid grid-cols-12 gap-4 mt-4 mb-2">
//                                                                         <div className="col-span-3">
//                                                                             <FormSelect
//                                                                                 name={`social_links.${index}.platform`}
//                                                                                 control={control}
//                                                                                 options={platformOptions}
//                                                                                 errors={errors}
//                                                                                 placeholder="Platform"
//                                                                                 label={false}
//                                                                                 disabled={disabled}
//                                                                             />
//                                                                         </div>
//                                                                         <div className="col-span-8">
//                                                                             <FormInput
//                                                                                 name={`social_links.${index}.url`}
//                                                                                 control={control}
//                                                                                 errors={errors}
//                                                                                 placeholder="Platform URL"
//                                                                                 label={false}
//                                                                                 disabled={disabled}
//                                                                             />
//                                                                         </div>
//                                                                         <div className="col-span-1 flex items-center space-x-2">
//                                                                             {!disabled && (
//                                                                                 <button
//                                                                                     type="button"
//                                                                                     onClick={() => removeLink(index)}
//                                                                                     className="ti-btn ti-btn-danger ti-btn-sm w-max"
//                                                                                 >
//                                                                                     <i className="bi bi-trash3-fill"></i>
//                                                                                 </button>
//                                                                             )}
//                                                                         </div>
//                                                                     </div>
//                                                                 ))}
//                                                                 {!disabled && ( // Conditionally render Add Another Link button
//                                                                     <div className="mt-12">
//                                                                         <button
//                                                                             type="button"
//                                                                             onClick={addSocialLink}
//                                                                             className="ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
//                                                                         >
//                                                                             <i className="ri-add-line font-semibold align-middle"></i>
//                                                                             Add Another Link
//                                                                         </button>
//                                                                     </div>
//                                                                 )}
//                                                             </>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                             <div className="box-footer flex justify-between mt-6">
//                                 <button
//                                     type="button"
//                                     onClick={prevStep}
//                                     disabled={currentStep === 0 || disabled}
//                                     className={`ti-btn ${currentStep === 0 || disabled ? 'ti-btn-light opacity-50 cursor-not-allowed' : 'ti-btn-primary'}`}
//                                 >
//                                     Previous
//                                 </button>
//                                 {currentStep < steps.length - 1 ? (
//                                     <button
//                                         type="button"
//                                         onClick={nextStep}
//                                         disabled={isStepValidating || disabled}
//                                         className={`ti-btn ti-btn-primary ${isStepValidating || disabled ? 'opacity-75 cursor-not-allowed' : ''}`}
//                                     >
//                                         {isStepValidating ? (
//                                             <>
//                         <span
//                             className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
//                                                 Validating...
//                                             </>
//                                         ) : 'Next'}
//                                     </button>
//                                 ) : (
//                                     <FormButton isLoading={isSubmitting} disabled={disabled} />
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </form>
//         </div>
//     );
// };
//
// export default DynamicFormBuilder;
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiInfo, FiSettings, FiLink, FiEdit, FiCheck } from 'react-icons/fi';
import FormInput from '@components/form/FormInput.jsx';
import FormTextarea from '@components/form/FormTextarea.jsx';
import FormToggle from '@components/form/FormToggle.jsx';
import FormSelect from '@components/form/FormSelect.jsx';
import FormButton from '@components/form/FormButton.jsx';
import OptionsRepeater from '@modules/forms/components/OptionsRepeater.jsx';
import FormAsyncSelect from '@components/form/FormAsyncSelect.jsx';
import FormCheckbox from '@components/form/FormCheckbox.jsx';
import api from '@config/axiosConfig.js';
import { dynamicFormSchema } from '@modules/forms/schemas/dynamicFormSchema.js';
import Notify from '@helpers/toastNotifications.js';
import FormRichTextarea from '@components/form/FormRichTextarea.jsx';
import { fontFamilyOptions, fieldTypeOptions, platformOptions } from '@modules/forms/services/DynamicFormService.js';
import { getPastDate } from '@helpers/dateTime.js';

const DynamicFormBuilder = ({ formData, disabled = false }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isGoingBack, setIsGoingBack] = useState(false);
    const [isStepValidating, setIsStepValidating] = useState(false);

    const steps = [
        { title: 'Basic Info', icon: <FiInfo /> },
        { title: 'Settings', icon: <FiSettings /> },
        { title: 'Form Fields', icon: <FiEdit /> },
        { title: 'Social Links', icon: <FiLink /> },
    ];

    const { control, handleSubmit, watch, formState: { errors, isSubmitting }, setValue, trigger } = useForm({
        resolver: zodResolver(dynamicFormSchema),
        defaultValues: {
            title: '',
            description: '',
            font_family: 'Inter, sans-serif',
            success_message: 'Thank you for your submission! We have received your form successfully.',
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
                    order: 1,
                },
            ],
            social_links: [],
            send_email_to_submitter: false,
            email_subject: '',
            email_content: '',
            enable_birthday_gift: false,
            birthday_coupon_type: null,
            birthday_discount_amount: null,
            birthday_min_order_value: null,
            birthday_coupon_valid_days: 7,
            enable_anniversary_voucher: false,
            anniversary_coupon_type: null,
            anniversary_discount_amount: null,
            anniversary_min_order_value: null,
            anniversary_coupon_valid_days: 7,
            ...formData,
        },
    });

    const { fields, append, remove } = useFieldArray({ control, name: 'fields' });
    const { fields: socialLinkFields, append: appendLink, remove: removeLink } = useFieldArray({ control, name: 'social_links' });

    const watchedFieldTypes = useWatch({ control, name: 'fields' });
    const watchedAlertField = useWatch({ control, name: 'enable_alerts' });
    const watchedSendEmailToSubmitter = useWatch({ control, name: 'send_email_to_submitter' });
    const watchedBirthdayGift = useWatch({ control, name: 'enable_birthday_gift' });
    const watchedAnniversaryVoucher = useWatch({ control, name: 'enable_anniversary_voucher' });

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
            setValue('success_message', formData.success_message || 'Thank you for your submission! We have received your form successfully.');
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
                    options: field.options?.length
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
                formData.social_links?.length ? formData.social_links : []
            );
        }
    }, [formData, setValue]);

    const onSubmit = async (data) => {
        if (disabled) return; // Prevent submission if disabled
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
        if (disabled) return; // Prevent adding fields if disabled
        append({ label: '', name: '', short_description: '', field_type: 'text', group: '', required: false, options: [], order: fields.length + 1 });
    };

    const addSocialLink = () => {
        if (disabled) return; // Prevent adding social links if disabled
        appendLink({ platform: 'facebook', url: '' });
    };

    const validateCurrentStep = async () => {
        if (disabled) return true; // Skip validation if disabled
        const stepFields = {
            0: ['title', 'description', 'success_message'],
            1: [
                'primary_color',
                'font_family',
                'expired_at',
                'is_active',
                'authenticated_only',
                'require_captcha',
                'enable_alerts',
                'send_email_to_submitter',
                'enable_birthday_gift',
                'enable_anniversary_voucher',
                ...(watchedAlertField ? ['notification_emails'] : []),
                ...(watchedSendEmailToSubmitter ? ['email_subject', 'email_content'] : []),
                ...(watchedBirthdayGift
                    ? [
                        'birthday_coupon_type',
                        'birthday_discount_amount',
                        'birthday_coupon_valid_days',
                        ...(watch('birthday_coupon_type') === 'percentage_threshold'
                            ? ['birthday_min_order_value']
                            : []),
                    ]
                    : []),
                ...(watchedAnniversaryVoucher
                    ? [
                        'anniversary_coupon_type',
                        'anniversary_discount_amount',
                        'anniversary_coupon_valid_days',
                        ...(watch('anniversary_coupon_type') === 'percentage_threshold'
                            ? ['anniversary_min_order_value']
                            : []),
                    ]
                    : []),
            ],
            2: ['fields'],
            3: ['social_links'],
        };

        const fieldsToValidate = stepFields[currentStep] || [];
        const isValid = await trigger(fieldsToValidate, { shouldFocus: true });

        if (!isValid) {
            // Notify.error('Please fill out all required fields correctly.');
        }

        return isValid;
    };

    const nextStep = async () => {
        if (disabled) return; // Prevent navigation via Next button if disabled
        setIsStepValidating(true);
        const isValid = await validateCurrentStep();

        if (isValid) {
            setIsGoingBack(false);
            setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
        }

        setIsStepValidating(false);
    };

    const prevStep = () => {
        if (disabled) return; // Prevent navigation via Previous button if disabled
        setIsGoingBack(true);
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const goToStep = (stepIndex) => {
        // Allow tab navigation even when disabled
        setIsGoingBack(stepIndex < currentStep);
        setCurrentStep(stepIndex);
    };

    return (
        <div className='container sm:p-3 !p-0'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex justify-center mb-8">
                    <div className="flex items-center max-w-3xl w-full">
                        {steps.map((step, index) => (
                            <React.Fragment key={index}>
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors
                      ${currentStep === index
                                            ? 'bg-primary text-white'
                                            : currentStep > index
                                                ? 'bg-success text-white'
                                                : 'bg-gray-300 text-gray-700'}
                      ${isStepValidating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={() => !isStepValidating && goToStep(index)}
                                    >
                    <span className="text-2xl">
                      {currentStep > index ? <FiCheck /> : step.icon}
                    </span>
                                    </div>
                                    <span
                                        className={`mt-2 text-sm font-medium ${currentStep >= index ? 'text-gray-800' : 'text-gray-800'}`}
                                    >
                    {step.title}
                  </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`flex-1 h-1 mb-4 mx-2 ${currentStep > index ? 'bg-gray-500' : 'bg-gray-200'}`}></div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-6 mb-[3rem]">
                    <div className="xl:col-span-12 col-span-12">
                        <div className="box">
                            <div className="box-body">
                                {currentStep === 0 && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-12 gap-4">
                                            <div className="xl:col-span-12 col-span-12">
                                                <FormInput
                                                    name="title"
                                                    control={control}
                                                    errors={errors}
                                                    placeholder="Form Title"
                                                    is_required={true}
                                                    disabled={disabled}
                                                />
                                            </div>
                                            <div className="xl:col-span-12 col-span-12">
                                                <FormTextarea
                                                    name="description"
                                                    control={control}
                                                    errors={errors}
                                                    placeholder="Form Description"
                                                    rows={5}
                                                    disabled={disabled}
                                                />
                                            </div>
                                            <div className="xl:col-span-12 col-span-12">
                                                <FormTextarea
                                                    name="success_message"
                                                    control={control}
                                                    errors={errors}
                                                    placeholder="Form Success Message"
                                                    rows={3}
                                                    disabled={disabled}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 1 && (
                                    <div className="space-y-6">
                                        <ul className="list-group list-group-flush list-none !rounded-md">
                                            <li className="list-group-item">
                                                <div className="grid grid-cols-12 xl:gap-x-[3rem] gap-y-4">
                                                    <div className="xl:col-span-4 col-span-12">
                                                        <p className="text-[1rem] mb-1 font-semibold">Configure</p>
                                                        <p className="text-[0.75rem] mb-0 text-[#8c9097] dark:text-white/50">
                                                            Customize the appearance and expiry settings of your interface.
                                                        </p>
                                                    </div>
                                                    <div className="xl:col-span-8 col-span-12">
                                                        <div className="flex items-center justify-between sm:mt-0 mt-8">
                                                            <div className="mail-notification-settings">
                                                                <p className="text-[0.875rem] mb-1 font-semibold">Primary Color</p>
                                                                <p className="text-[0.75rem] mb-0 text-[#8c9097] dark:text-white/50">
                                                                    Customize primary colors to align the interface with your brand identity.
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <div className="xl:col-span-4 col-span-12">
                                                                    <FormInput
                                                                        type="color"
                                                                        name="primary_color"
                                                                        control={control}
                                                                        errors={errors}
                                                                        is_required={false}
                                                                        className="form-control-color !border-0 block"
                                                                        disabled={disabled}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-8">
                                                            <div className="mail-notification-settings">
                                                                <p className="text-[0.875rem] mb-1 font-semibold">Font Family Options</p>
                                                                <p className="text-[0.75rem] mb-0 text-[#8c9097] dark:text-white/50">
                                                                    Choose a font style to match your brand's visual tone and readability.
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <div className="w-64 xl:col-span-4 col-span-12">
                                                                    <FormSelect
                                                                        name="font_family"
                                                                        control={control}
                                                                        options={fontFamilyOptions}
                                                                        errors={errors}
                                                                        is_required={false}
                                                                        disabled={disabled}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-8">
                                                            <div className="mail-notification-settings">
                                                                <p className="text-[0.875rem] mb-1 font-semibold">Expired At</p>
                                                                <p className="text-[0.75rem] mb-0 text-[#8c9097] dark:text-white/50">
                                                                    Set the expiration date to automatically disable the feature after a specific time.
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <div className="xl:col-span-4 col-span-12">
                                                                    <FormInput
                                                                        type="date"
                                                                        name="expired_at"
                                                                        control={control}
                                                                        errors={errors}
                                                                        min={getPastDate(0)}
                                                                        disabled={disabled}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="list-group-item">
                                                <div className="grid grid-cols-12 xl:gap-x-[3rem] gap-y-4">
                                                    <div className="xl:col-span-4 col-span-12">
                                                        <p className="text-[1rem] mb-1 font-semibold">Security</p>
                                                        <p className="text-[0.75rem] mb-0 text-[#8c9097] dark:text-white/50">
                                                            Manage account protection, access rules, and alerts.
                                                        </p>
                                                    </div>
                                                    <div className="xl:col-span-8 col-span-12">
                                                        <div className="flex items-center justify-between sm:mt-0 mt-4">
                                                            <div className="mail-notification-settings">
                                                                <p className="text-[0.875rem] mb-1 font-semibold">Is Active</p>
                                                                <p className="text-[0.75rem] mb-0 text-[#8c9097] dark:text-white/50">
                                                                    Toggle to enable or disable this feature or module.
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <FormToggle
                                                                    name="is_active"
                                                                    control={control}
                                                                    errors={errors}
                                                                    toggleClasses="text-center"
                                                                    disabled={disabled}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-8">
                                                            <div className="mail-notification-settings">
                                                                <p className="text-[0.875rem] mb-1 font-semibold">For Authenticated User</p>
                                                                <p className="text-[0.75rem] mb-0 text-[#8c9097] dark:text-white/50">
                                                                    Restrict access to only logged-in or authenticated users.
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <FormToggle
                                                                    name="authenticated_only"
                                                                    control={control}
                                                                    errors={errors}
                                                                    toggleClasses="text-center"
                                                                    disabled={disabled}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-8">
                                                            <div className="mail-notification-settings">
                                                                <p className="text-[0.875rem] mb-1 font-semibold">Require Captcha</p>
                                                                <p className="text-[0.75rem] mb-0 text-[#8c9097] dark:text-white/50">
                                                                    Enable CAPTCHA verification to prevent spam and ensure submissions are made by real users.
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <FormToggle
                                                                    name="require_captcha"
                                                                    control={control}
                                                                    errors={errors}
                                                                    toggleClasses="text-center"
                                                                    disabled={disabled}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-8">
                                                            <div className="xl:col-span-3 col-span-12">
                                                                <p className="text-[0.875rem] mb-1 font-semibold">Enable Submission Alerts</p>
                                                                <p className="text-[0.75rem] mb-0 text-[#8c9097] dark:text-white/50">
                                                                    Get alerts when a new submission is received.
                                                                </p>
                                                            </div>
                                                            <div className="xl:col-span-4 col-span-12">
                                                                {watchedAlertField && (
                                                                    <div className="mt-2 w-64 xl:col-span-4 col-span-12">
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
                                                                                .map((e) => ({
                                                                                    label: e,
                                                                                    value: e,
                                                                                })) || []}
                                                                            disabled={disabled}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="xl:col-span-4 col-span-12">
                                                                <FormToggle
                                                                    name="enable_alerts"
                                                                    control={control}
                                                                    errors={errors}
                                                                    toggleClasses="text-right mt-4"
                                                                    disabled={disabled}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="list-group-item">
                                                <div className="grid grid-cols-12 xl:gap-x-[3rem] gap-y-4">
                                                    <div className="xl:col-span-4 col-span-12">
                                                        <p className="text-[1rem] mb-1 font-semibold">Send Email to Submitter</p>
                                                        <p className="text-[0.75rem] mb-0 text-[#8c9097] dark:text-white/50">
                                                            Automatically send a confirmation or notification email to the form submitter.
                                                        </p>
                                                    </div>
                                                    <div className="xl:col-span-8 col-span-12">
                                                        <div className="flex items-center justify-between mt-8">
                                                            <div className="mail-notification-settings">
                                                                <p className="text-[0.875rem] mb-1 font-semibold"></p>
                                                            </div>
                                                            <div>
                                                                <FormToggle
                                                                    name="send_email_to_submitter"
                                                                    control={control}
                                                                    errors={errors}
                                                                    toggleClasses="text-center"
                                                                    disabled={disabled}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {watchedSendEmailToSubmitter && (
                                                        <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 sm:col-span-12 col-span-12">
                                                            <div className="box">
                                                                <div className="space-y-2">
                                                                    <FormInput
                                                                        name="email_subject"
                                                                        control={control}
                                                                        errors={errors}
                                                                        placeholder="Email Subject"
                                                                        is_required={true}
                                                                        disabled={disabled}
                                                                    />
                                                                    <FormRichTextarea
                                                                        name="email_content"
                                                                        control={control}
                                                                        errors={errors}
                                                                        placeholder="Email Content"
                                                                        is_required={true}
                                                                        editorOptions={{
                                                                            height: 100,
                                                                            buttonList: [
                                                                                ['undo', 'redo'],
                                                                                ['bold', 'italic', 'underline', 'strike'],
                                                                                ['list', 'align', 'fontColor', 'hiliteColor'],
                                                                                ['link'],
                                                                                ['removeFormat'],
                                                                            ],
                                                                        }}
                                                                        disabled={disabled}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </li>
                                            <li className="list-group-item">
                                                <div className="grid grid-cols-12 xl:gap-x-[3rem] gap-y-4">
                                                    <div className="xl:col-span-4 col-span-12">
                                                        <p className="text-[1rem] mb-1 font-semibold">Birthday Gift Settings</p>
                                                        <p className="text-[0.75rem] mb-0 text-[#8c9097] dark:text-white/50">
                                                            Customize birthday gift options, eligibility rules, and notification preferences.
                                                        </p>
                                                    </div>
                                                    <div className="xl:col-span-8 col-span-12">
                                                        <div className="flex items-center justify-between mt-8">
                                                            <div className="mail-notification-settings">
                                                                <p className="text-[0.875rem] mb-1 font-semibold"></p>
                                                            </div>
                                                            <div>
                                                                <FormToggle
                                                                    name="enable_birthday_gift"
                                                                    control={control}
                                                                    errors={errors}
                                                                    toggleClasses="text-center"
                                                                    disabled={disabled}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {watchedBirthdayGift && (
                                                        <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 sm:col-span-12 col-span-12">
                                                            <div className="space-y-2">
                                                                <FormSelect
                                                                    name="birthday_coupon_type"
                                                                    control={control}
                                                                    errors={errors}
                                                                    options={[
                                                                        { label: 'Fixed Discount (incl. discounted products)', value: 'fixed' },
                                                                        { label: 'Percentage Discount with Min Threshold (excl. discounted products)', value: 'percentage_threshold' },
                                                                        { label: 'Percentage Discount (excl. discounted products)', value: 'percentage' },
                                                                    ]}
                                                                    placeholder="Select Coupon Type"
                                                                    is_required={true}
                                                                    disabled={disabled}
                                                                />
                                                                <div className="flex flex-col md:flex-row gap-4">
                                                                    <div className="w-full md:w-1/3">
                                                                        <FormInput
                                                                            name="birthday_discount_amount"
                                                                            control={control}
                                                                            errors={errors}
                                                                            placeholder="Discount Amount / Percentage"
                                                                            type="number"
                                                                            is_required={true}
                                                                            disabled={disabled}
                                                                        />
                                                                    </div>
                                                                    {watch('birthday_coupon_type') === 'percentage_threshold' && (
                                                                        <div className="w-full md:w-1/3">
                                                                            <FormInput
                                                                                name="birthday_min_order_value"
                                                                                control={control}
                                                                                errors={errors}
                                                                                placeholder="Min Order Value (for threshold)"
                                                                                type="number"
                                                                                is_required={false}
                                                                                disabled={disabled}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                    <div className="w-full md:w-1/3">
                                                                        <FormInput
                                                                            name="birthday_coupon_valid_days"
                                                                            control={control}
                                                                            errors={errors}
                                                                            placeholder="Coupon Validity (in days)"
                                                                            type="number"
                                                                            is_required={false}
                                                                            disabled={disabled}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </li>
                                            <li className="list-group-item">
                                                <div className="grid grid-cols-12 xl:gap-x-[3rem] gap-y-4">
                                                    <div className="xl:col-span-4 col-span-12">
                                                        <p className="text-[1rem] mb-1 font-semibold">Enable Anniversary Voucher</p>
                                                        <p className="text-[0.75rem] mb-0 text-[#8c9097] dark:text-white/50">
                                                            Activate and configure anniversary voucher settings, eligibility criteria, and notifications.
                                                        </p>
                                                    </div>
                                                    <div className="xl:col-span-8 col-span-12">
                                                        <div className="flex items-center justify-between mt-8">
                                                            <div className="mail-notification-settings">
                                                                <p className="text-[0.875rem] mb-1 font-semibold"></p>
                                                            </div>
                                                            <div>
                                                                <FormToggle
                                                                    name="enable_anniversary_voucher"
                                                                    control={control}
                                                                    errors={errors}
                                                                    toggleClasses="text-center"
                                                                    disabled={disabled}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {watchedAnniversaryVoucher && (
                                                        <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 sm:col-span-12 col-span-12">
                                                            <div className="space-y-2">
                                                                <FormSelect
                                                                    name="anniversary_coupon_type"
                                                                    control={control}
                                                                    errors={errors}
                                                                    options={[
                                                                        { label: 'Fixed Discount', value: 'fixed' },
                                                                        { label: 'Percentage Discount with Min Threshold', value: 'percentage_threshold' },
                                                                        { label: 'Percentage Discount', value: 'percentage' },
                                                                    ]}
                                                                    placeholder="Select Coupon Type"
                                                                    is_required={true}
                                                                    disabled={disabled}
                                                                />
                                                                <div className="flex flex-col md:flex-row gap-4">
                                                                    <div className="w-full md:w-1/3">
                                                                        <FormInput
                                                                            name="anniversary_discount_amount"
                                                                            control={control}
                                                                            errors={errors}
                                                                            placeholder="Discount Amount / Percentage"
                                                                            type="number"
                                                                            is_required={true}
                                                                            disabled={disabled}
                                                                        />
                                                                    </div>
                                                                    {watch('anniversary_coupon_type') === 'percentage_threshold' && (
                                                                        <div className="w-full md:w-1/3">
                                                                            <FormInput
                                                                                name="anniversary_min_order_value"
                                                                                control={control}
                                                                                errors={errors}
                                                                                placeholder="Min Order Value (for threshold)"
                                                                                type="number"
                                                                                is_required={false}
                                                                                disabled={disabled}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                    <div className="w-full md:w-1/3">
                                                                        <FormInput
                                                                            name="anniversary_coupon_valid_days"
                                                                            control={control}
                                                                            errors={errors}
                                                                            placeholder="Coupon Validity (in days)"
                                                                            type="number"
                                                                            is_required={false}
                                                                            disabled={disabled}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="space-y-4">
                                        <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 sm:col-span-12 col-span-12">
                                            <div className="box">
                                                <div className="box-body border">
                                                    {fields.map((field, index) => {
                                                        const fieldType = watchedFieldTypes?.[index]?.field_type;
                                                        return (
                                                            <div key={field.id} className="border border-gray-300 rounded-lg p-4 mt-4 bg-gray-50 dark:text-gray-200 dark:bg-bodybg">
                                                                <div className="grid grid-cols-12 gap-4">
                                                                    <div className="col-span-10">
                                                                        <div className="grid grid-cols-12 gap-4">
                                                                            <div className="xl:col-span-2 col-span-12">
                                                                                <FormInput
                                                                                    name={`fields.${index}.label`}
                                                                                    control={control}
                                                                                    errors={errors}
                                                                                    placeholder="Field Label"
                                                                                    label={false}
                                                                                    disabled={disabled}
                                                                                />
                                                                            </div>
                                                                            <div className="xl:col-span-2 col-span-12">
                                                                                <FormInput
                                                                                    name={`fields.${index}.name`}
                                                                                    control={control}
                                                                                    errors={errors}
                                                                                    placeholder="Field Name"
                                                                                    label={false}
                                                                                    disabled={true} // Already disabled in original code
                                                                                />
                                                                            </div>
                                                                            <div className="xl:col-span-2 col-span-12">
                                                                                <FormInput
                                                                                    name={`fields.${index}.short_description`}
                                                                                    control={control}
                                                                                    errors={errors}
                                                                                    placeholder="Field Description"
                                                                                    label={false}
                                                                                    disabled={disabled}
                                                                                />
                                                                            </div>
                                                                            <div className="xl:col-span-2 col-span-12">
                                                                                <FormInput
                                                                                    name={`fields.${index}.group`}
                                                                                    control={control}
                                                                                    errors={errors}
                                                                                    placeholder="Field Group"
                                                                                    label={false}
                                                                                    disabled={disabled}
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
                                                                                    disabled={disabled}
                                                                                />
                                                                            </div>
                                                                            <div className="xl:col-span-2 col-span-12 flex items-center space-x-4 ml-4">
                                                                                <FormCheckbox
                                                                                    name={`fields.${index}.required`}
                                                                                    control={control}
                                                                                    errors={errors}
                                                                                    label="Required"
                                                                                    disabled={disabled}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-span-2">
                                                                        <div className="grid grid-cols-3 gap-4">
                                                                            <div className="col-span-2">
                                                                                <FormInput
                                                                                    type="number"
                                                                                    name={`fields.${index}.order`}
                                                                                    control={control}
                                                                                    errors={errors}
                                                                                    placeholder="Order"
                                                                                    label={false}
                                                                                    disabled={disabled}
                                                                                />
                                                                            </div>
                                                                            <div className="col-span-1 flex items-center space-x-2">
                                                                                {!disabled && index !== 0 && (
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
                                                                </div>
                                                                {['select', 'radio', 'checkbox'].includes(fieldType) && (
                                                                    <div className="border border-gray-400 rounded-lg p-4 mt-4 bg-white">
                                                                        <OptionsRepeater
                                                                            fieldIndex={index}
                                                                            control={control}
                                                                            setValue={setValue}
                                                                            errors={errors}
                                                                            disabled={disabled}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                    {!disabled && (
                                                        <div className="mt-4">
                                                            <button
                                                                type="button"
                                                                onClick={addField}
                                                                className="ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                                                            >
                                                                <i className="ri-add-line font-semibold align-middle"></i>
                                                                Add Field
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 3 && (
                                    <div className="space-y-4">
                                        <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 sm:col-span-12 col-span-12">
                                            <div className="box">
                                                <div className="box-body border">
                                                    <div className="xl:col-span-12 col-span-12">
                                                        {socialLinkFields.length === 0 ? (
                                                            <div className="text-center py-8">
                                                                <FiLink className="mx-auto text-4xl text-gray-400 mb-4" />
                                                                <p className="text-gray-500 mb-4">
                                                                    No social links added yet
                                                                </p>
                                                                {!disabled && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={addSocialLink}
                                                                        className="ti-btn ti-btn-primary-full"
                                                                    >
                                                                        <i className="ri-add-line font-semibold align-middle me-1"></i>
                                                                        Add Social Link
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {socialLinkFields.map((field, index) => (
                                                                    <div key={field.id} className="grid grid-cols-12 gap-4 mt-4 mb-2">
                                                                        <div className="col-span-3">
                                                                            <FormSelect
                                                                                name={`social_links.${index}.platform`}
                                                                                control={control}
                                                                                options={platformOptions}
                                                                                errors={errors}
                                                                                placeholder="Platform"
                                                                                label={false}
                                                                                disabled={disabled}
                                                                            />
                                                                        </div>
                                                                        <div className="col-span-8">
                                                                            <FormInput
                                                                                name={`social_links.${index}.url`}
                                                                                control={control}
                                                                                errors={errors}
                                                                                placeholder="Platform URL"
                                                                                label={false}
                                                                                disabled={disabled}
                                                                            />
                                                                        </div>
                                                                        <div className="col-span-1 flex items-center space-x-2">
                                                                            {!disabled && (
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => removeLink(index)}
                                                                                    className="ti-btn ti-btn-danger ti-btn-sm w-max"
                                                                                >
                                                                                    <i className="bi bi-trash3-fill"></i>
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {!disabled && (
                                                                    <div className="mt-12">
                                                                        <button
                                                                            type="button"
                                                                            onClick={addSocialLink}
                                                                            className="ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                                                                        >
                                                                            <i className="ri-add-line font-semibold align-middle"></i>
                                                                            Add Another Link
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="box-footer flex justify-between mt-6">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    disabled={currentStep === 0 || disabled}
                                    className={`ti-btn ${currentStep === 0 || disabled ? 'ti-btn-light opacity-50 cursor-not-allowed' : 'ti-btn-primary'}`}
                                >
                                    Previous
                                </button>
                                {currentStep < steps.length - 1 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        disabled={isStepValidating || disabled}
                                        className={`ti-btn ti-btn-primary ${isStepValidating || disabled ? 'opacity-75 cursor-not-allowed' : ''}`}
                                    >
                                        {isStepValidating ? (
                                            <>
                        <span
                            className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                        ></span>
                                                Validating...
                                            </>
                                        ) : (
                                            'Next'
                                        )}
                                    </button>
                                ) : (
                                    <FormButton isLoading={isSubmitting} disabled={disabled} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default DynamicFormBuilder;