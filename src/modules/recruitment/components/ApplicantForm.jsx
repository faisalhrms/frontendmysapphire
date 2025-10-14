import React, {useEffect, useMemo} from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@components/form/FormInput.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import FormTextarea from "@components/form/FormTextarea.jsx";
import FormButton from "@components/form/FormButton.jsx";
import GalleryUpload from "@components/GalleryUpload.jsx";
import FormCheckbox from "@components/form/FormCheckbox.jsx";
import {formatNestedOptions, formatOptions, formatOptionsForApplicant} from "@helpers/formatters.js";
import applicantSchema from "@modules/recruitment/schemas/ApplicantSchema.js";
import { useApplicantForm } from "@modules/recruitment/hooks/recruitmentHooks.js";
import SubFormSection from "@components/form/SubFormSection.jsx";
import {useSelector} from "react-redux";

const ApplicantForm = ({ applicantData, isEditMode = false }) => {
    const currentUser = useSelector(state => state.auth.user);

    // CNIC formatting function
    const formatCNIC = (value) => {
        // Remove all non-digits
        const digits = value.replace(/\D/g, '');

        // Limit to 13 digits
        const limitedDigits = digits.substring(0, 13);

        // Apply formatting: 00000-0000000-0
        if (limitedDigits.length <= 5) {
            return limitedDigits;
        } else if (limitedDigits.length <= 12) {
            return `${limitedDigits.substring(0, 5)}-${limitedDigits.substring(5)}`;
        } else {
            return `${limitedDigits.substring(0, 5)}-${limitedDigits.substring(5, 12)}-${limitedDigits.substring(12)}`;
        }
    };

    // Mobile number formatting function
    const formatMobileNumber = (value) => {
        // Remove all non-digits
        const digits = value.replace(/\D/g, '');

        // Limit to 11 digits
        const limitedDigits = digits.substring(0, 11);

        // Apply formatting: 0300-0000000
        if (limitedDigits.length <= 4) {
            return limitedDigits;
        } else {
            return `${limitedDigits.substring(0, 4)}-${limitedDigits.substring(4)}`;
        }
    };

    const transformedData = useMemo(() => {
        if (!applicantData) return null;
        return {
            ...applicantData,
            qualification_set: applicantData.qualifications || [],
            experience_set: applicantData.experiences || [],
            referral_set: applicantData.referrals || [],
        };
    }, [applicantData]);
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(applicantSchema),
        defaultValues: {
            full_name: "",
            father_name: "",
            cnic: "",
            date_of_birth: "",
            mobile_number: "",
            email: "",
            status: "submitted",
            remarks: "",
            home_address: "",
            city: "",
            total_experience_years: 0,
            referred_by: "",
            referred_by_designation: "",
            created_by_location_id: null,
            preferred_store_location_id: null,
            qualification_set: [],
            experience_set: [],
            referral_set: [],
            // Merge transformed data if exists
            ...(transformedData || {}),
            recommendation_ids: transformedData?.recommended_positions?.map(p => p.id) || [],
            attachment_ids: transformedData?.attachments?.map(a => a.id) || [],
        }
    });


    const { fields: qualFields, append: appendQual, remove: removeQual } =
        useFieldArray({ control, name: "qualification_set" });

    const { fields: expFields, append: appendExp, remove: removeExp } =
        useFieldArray({ control, name: "experience_set" });

    const { fields: refFields, append: appendRef, remove: removeRef } =
        useFieldArray({ control, name: "referral_set" });


    const { handleApplicantSubmit } = useApplicantForm(applicantData, isEditMode);
    const status = useWatch({ control, name: "status" });

    const createdByLocationOptions = useMemo(() => {
        // For edit mode, use applicant data
        if (isEditMode && applicantData) {
            return formatOptionsForApplicant(applicantData, "created_by_location");
        }

        // For create mode, use current user's location
        if (!isEditMode && currentUser?.employee?.location) {
            return [{
                value: currentUser.employee.location.id,
                label: currentUser.employee.location.name
            }];
        }

        return [];
    }, [isEditMode, applicantData, currentUser]);

    useEffect(() => {
        if (transformedData) {
            reset({
                ...transformedData,
                recommendation_ids: transformedData.recommended_positions?.map(p => p.id) || [],
                attachment_ids: transformedData.attachments?.map(a => a.id) || [],
            });
        }
    }, [transformedData, reset]);

    useEffect(() => {
        if (!isEditMode && currentUser) {
            // Set Your Location from user's location
            if (currentUser.employee?.location?.id) {
                setValue("created_by_location_id", currentUser.employee.location.id);
            }

            // Set Referred By fields from user's info
            if (currentUser.employee?.full_name) {
                setValue("referred_by", currentUser.employee.full_name);
            }
            if (currentUser.employee?.designation?.name) {
                setValue("referred_by_designation", currentUser.employee.designation.name);
            }
        }
    }, [isEditMode, currentUser, setValue]);
    return (
        <form onSubmit={handleSubmit(handleApplicantSubmit)} className="p-4">
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12">
                    {/* Personal & Application Info */}
                    <div className="box shadow-md rounded-lg">
                        <div className="box-header bg-gray-100 p-4 rounded-t-lg dark:text-gray-200 dark:bg-bodybg">
                            <div className="box-title text-lg font-semibold">Personal Info</div>
                        </div>
                        <div className="box-body p-6">
                            <div className="grid grid-cols-12 gap-6">
                                <div className="col-span-4">
                                    <FormInput
                                        name="referred_by"
                                        control={control}
                                        errors={errors}
                                        placeholder="Referred By"
                                        className="w-full"
                                    />
                                </div>
                                <div className="col-span-4">
                                    <FormInput
                                        name="referred_by_designation"
                                        control={control}
                                        errors={errors}
                                        placeholder="Referrer Designation"
                                        className="w-full"
                                    />
                                </div>
                                <div className="col-span-4">

                                    <FormAsyncSelect
                                        name="created_by_location_id"
                                        is_required={true}
                                        control={control}
                                        errors={errors}
                                        placeholder="Your Location"
                                        apiUrl="/select/locations/"
                                        queryKeyBase="locations"
                                        clientSideSearch={false}
                                        preselectedOptions={createdByLocationOptions}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                                <div className="box shadow-md rounded-lg">
                                    <div className="box-header bg-gray-100 p-4 rounded-t-lg dark:text-gray-200 dark:bg-bodybg">
                                        <div className="box-title text-lg font-semibold">Applicant Info</div>
                                    </div>
                                    <div className="box-body p-6">
                                        <div className="grid grid-cols-12 gap-6">
                                            <div className="col-span-3">
                                                <FormInput name="full_name" control={control} errors={errors}
                                                           placeholder="Full Name" is_required className="w-full"/>
                                            </div>
                                            <div className="col-span-3">
                                                <FormInput name="father_name" control={control} errors={errors}
                                                           placeholder="Father Name" is_required className="w-full"/>
                                            </div>
                                            <div className="col-span-3">
                                                <FormInput name="email" control={control} errors={errors}
                                                           placeholder="Email Address" is_required className="w-full"/>
                                            </div>
                                            <div className="col-span-3">
                                                <FormInput
                                                    name="cnic"
                                                    control={control}
                                                    errors={errors}
                                                    separateLabel={true}
                                                    labelText="CNIC Number"
                                                    placeholder="e.g. xxxxx-xxxxxxx-x"
                                                    is_required
                                                    className="w-full"
                                                    maxLength={15}
                                                    onChange={(e) => {
                                                        const formatted = formatCNIC(e.target.value);
                                                        setValue("cnic", formatted);
                                                    }}
                                                />

                                            </div>
                                            <div className="col-span-3">
                                                <FormInput type="date" name="date_of_birth" control={control}
                                                           errors={errors}
                                                           placeholder="Date of Birth" is_required className="w-full"/>
                                            </div>
                                            <div className="col-span-3">
                                                <FormInput
                                                    name="mobile_number"
                                                    control={control}
                                                    errors={errors}
                                                    separateLabel={true}
                                                    labelText="Mobile Number"
                                                    placeholder="e.g. xxxx-xxxxxxx"
                                                    is_required
                                                    className="w-full"
                                                    maxLength={12}
                                                    onChange={(e) => {
                                                        const formatted = formatMobileNumber(e.target.value);
                                                        setValue("mobile_number", formatted);
                                                    }}
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <FormInput name="city" control={control} errors={errors}
                                                           placeholder="City"
                                                           is_required className="w-full"/>
                                            </div>
                                            <div className="col-span-3">
                                                <FormInput
                                                    name="total_experience_years"
                                                    control={control}
                                                    errors={errors}
                                                    type="number"
                                                    placeholder="Total Experience (Years)"
                                                    className="w-full"
                                                />
                                            </div>

                                            <div className="col-span-6">
                                                <FormAsyncSelect
                                                    name="preferred_store_location_id"
                                                    control={control}
                                                    errors={errors}
                                                    placeholder="Preferred Store"
                                                    apiUrl="/select/locations/"
                                                    queryKeyBase="locations"
                                                    clientSideSearch={false}
                                                    preselectedOptions={formatOptions(
                                                        applicantData,
                                                        "preferred_store_location"
                                                    )}
                                                />
                                            </div>
                                            <div className="col-span-6">

                                                <FormAsyncSelect

                                                    name="recommended_position_id"
                                                    control={control}
                                                    errors={errors}
                                                    placeholder="Recommended Positions"
                                                    apiUrl="/select/applicant/positions/"
                                                    queryKeyBase="positions"
                                                    clientSideSearch={false}
                                                    preselectedOptions={formatOptions(
                                                        applicantData,
                                                        "recommended_position"
                                                    )}
                                                    saveOptionEndpoint="/select/applicant/position/"
                                                    allowSaveNewOption={true}
                                                />
                                            </div>


                                            {/*<div className="col-span-6">*/}
                                            {/*    <FormSelect*/}
                                            {/*        name="status"*/}
                                            {/*        control={control}*/}
                                            {/*        errors={errors}*/}
                                            {/*        placeholder="Status"*/}
                                            {/*        options={[*/}
                                            {/*            {value: "pending", label: "Pending"},*/}
                                            {/*            {value: "approved", label: "Approved"},*/}
                                            {/*            {value: "rejected", label: "Rejected"},*/}
                                            {/*        ]}*/}
                                            {/*        is_required*/}
                                            {/*        className="w-full"*/}
                                            {/*    />*/}
                                            {/*</div>*/}
                                            <div className="col-span-6">
                                                <FormTextarea name="remarks" control={control} errors={errors}
                                                              placeholder="Remarks"
                                                              rows={3} className="w-full"/>
                                            </div>
                                            <div className="col-span-6">
                                                <FormTextarea name="home_address" control={control} errors={errors}
                                                              placeholder="Home Address" rows={3} className="w-full"/>
                                            </div>

                                            <div className="col-span-12">
                                                <GalleryUpload
                                                    currentValue={applicantData?.attachment_ids}
                                                    files={applicantData?.attachments}
                                                    inputName="attachment_ids"
                                                    placeholder="Resume/Documents"
                                                    control={control}
                                                    errors={errors}
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end mt-6">
                                            <FormButton
                                                isLoading={isSubmitting}
                                                label={isEditMode ? "Update" : "Create"}
                                                className="ti-btn ti-btn-primary ti-btn-lg"
                                            />
                                        </div>
                                    </div>

                                </div>


                    <SubFormSection title="Qualifications" className="mt-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 border border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200 dark:bg-bodybg">Degree</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200 dark:bg-bodybg">Institution</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200 dark:bg-bodybg">Years
                                        Completed
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200 dark:bg-bodybg"></th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:text-gray-200 dark:bg-bodybg">
                                {qualFields.map((item, idx) => (
                                    <tr key={item.id} className="hover:bg-gray-100">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <FormInput label={false} name={`qualification_set.${idx}.level`}
                                                                   control={control} errors={errors} placeholder="Level"
                                                                   className="w-full"/>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <FormInput label={false}
                                                                   name={`qualification_set.${idx}.institution`}
                                                                   control={control} errors={errors}
                                                                   placeholder="Institution"
                                                                   className="w-full"/>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <FormInput label={false} type="number"
                                                                   name={`qualification_set.${idx}.years_completed`}
                                                                   control={control} errors={errors} placeholder="Years"
                                                                   className="w-full"/>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <button type="button" onClick={() => removeQual(idx)}
                                                                className="ti-btn ti-btn-danger ti-btn-sm"
                                                                title="Remove this qualification">
                                                            <i className="ti ti-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="flex justify-end mt-4">
                                        <button type="button" onClick={() => appendQual({
                                            level: "",
                                            institution: "",
                                            years_completed: 0
                                        })} className="ti-btn ti-btn-secondary ti-btn-md"
                                                title="Add a new qualification">
                                            Add Qualification
                                        </button>
                                    </div>
                                </SubFormSection>

                                <SubFormSection title="Work Experiences" className="mt-6">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50 border border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Years
                                                    in Role
                                                </th>
                                                {/*<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Exp</th>*/}
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                            </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                            {expFields.map((item, idx) => (
                                                <tr key={item.id} className="hover:bg-gray-100">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <FormInput label={false}
                                                                   name={`experience_set.${idx}.company_name`}
                                                                   control={control} errors={errors}
                                                                   placeholder="Company"
                                                                   className="w-full"/>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <FormInput label={false}
                                                                   name={`experience_set.${idx}.designation`}
                                                                   control={control} errors={errors}
                                                                   placeholder="Designation"
                                                                   className="w-full"/>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <FormInput label={false}
                                                                   name={`experience_set.${idx}.years_in_role`}
                                                                   control={control}
                                                                   errors={errors} placeholder="Years"
                                                                   className="w-full"/>
                                                    </td>
                                                    {/*<td className="px-6 py-4 whitespace-nowrap">*/}
                                                    {/*    <FormInput label={false}*/}
                                                    {/*               name={`experience_set.${idx}.total_experience_years`}*/}
                                                    {/*               control={control} errors={errors} placeholder="Total"*/}
                                                    {/*               className="w-full"/>*/}
                                                    {/*</td>*/}
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <button type="button" onClick={() => removeExp(idx)}
                                                                className="ti-btn ti-btn-danger ti-btn-sm"
                                                                title="Remove this experience">
                                                            <i className="ti ti-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="flex justify-end mt-4">
                                        <button type="button" onClick={() => appendExp({
                                            company_name: "",
                                            designation: "",
                                            years_in_role: 0,
                                            total_experience_years: 0
                                        })} className="ti-btn ti-btn-secondary ti-btn-md" title="Add a new experience">
                                            Add Experience
                                        </button>
                                    </div>
                                </SubFormSection>

                                {/*<SubFormSection title="Referrals" className="mt-6">*/}
                                {/*    <div className="overflow-x-auto">*/}
                                {/*        <table className="min-w-full divide-y divide-gray-200">*/}
                                {/*            <thead className="bg-gray-50">*/}
                                {/*            <tr>*/}
                                {/*                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referrer Name</th>*/}
                                {/*                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>*/}
                                {/*                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store Location</th>*/}
                                {/*                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>*/}
                                {/*            </tr>*/}
                                {/*            </thead>*/}
                                {/*            <tbody className="bg-white divide-y divide-gray-200">*/}
                                {/*            {refFields.map((item, idx) => (*/}
                                {/*                <tr key={item.id} className="hover:bg-gray-100">*/}
                                {/*                    <td className="px-6 py-4 whitespace-nowrap">*/}
                                {/*                        <FormInput label={false} name={`referral_set.${idx}.referrer_name`}*/}
                                {/*                                   control={control} errors={errors} placeholder="Name"*/}
                                {/*                                   className="w-full"/>*/}
                                {/*                    </td>*/}
                                {/*                    <td className="px-6 py-4 whitespace-nowrap">*/}
                                {/*                        <FormInput label={false} name={`referral_set.${idx}.referrer_designation`}*/}
                                {/*                                   control={control} errors={errors} placeholder="Designation"*/}
                                {/*                                   className="w-full"/>*/}
                                {/*                    </td>*/}
                                {/*                    <td className="px-6 py-4 whitespace-nowrap">*/}

                                {/*                        <FormAsyncSelect*/}
                                {/*                            label={false}*/}
                                {/*                            name={`referral_set.${idx}.referrer_store_location_id`}*/}
                                {/*                            control={control}*/}
                                {/*                            errors={errors}*/}
                                {/*                            placeholder="Store Location"*/}
                                {/*                            apiUrl="/select/locations/"*/}
                                {/*                            queryKeyBase="locations"*/}
                                {/*                            clientSideSearch={false}*/}
                                {/*                            preselectedOptions={formatNestedOptions(*/}
                                {/*                                item, // Current referral item*/}
                                {/*                                'referrer_store_location' // Key to look for*/}
                                {/*                            )}*/}
                                {/*                            menuPortalTarget={document.body}*/}
                                {/*                        />*/}
                                {/*                    </td>*/}
                                {/*                    <td className="px-6 py-4 whitespace-nowrap text-right">*/}
                                {/*                        <button type="button" onClick={() => removeRef(idx)}*/}
                                {/*                                className="ti-btn ti-btn-danger ti-btn-sm"*/}
                                {/*                                title="Remove this referral">*/}
                                {/*                            <i className="ti ti-trash"></i>*/}
                                {/*                        </button>*/}
                                {/*                    </td>*/}
                                {/*                </tr>*/}
                                {/*            ))}*/}
                                {/*            </tbody>*/}
                                {/*        </table>*/}
                                {/*    </div>*/}
                                {/*    <div className="flex justify-end m-4">*/}
                                {/*        <button type="button" onClick={() => appendRef({ referrer_name: "", referrer_designation: "", referrer_store_location_id: null })} className="ti-btn ti-btn-secondary ti-btn-md" title="Add a new referral">*/}
                                {/*            Add Referral*/}
                                {/*        </button>*/}
                                {/*    </div>*/}
                                {/*</SubFormSection>*/}

                            </div>
                        </div>
        </form>
);
};

export default ApplicantForm;