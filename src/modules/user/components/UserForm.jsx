import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@components/form/FormInput.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import FormButton from "@components/form/FormButton.jsx";
import { formatOptions } from "@helpers/formatters.js";
import { useUserForm } from "@modules/user/hooks/userHooks.js";
import FileUpload from "@components/FileUpload.jsx";
import Avatar from "@components/Avatar.jsx";
import { formatDate } from "@helpers/dateTime.js";
import { Link } from "react-router-dom";
import FormCheckbox from "@components/form/FormCheckbox.jsx";
import userEditSchema from "@modules/user/schemas/userEditSchema.js";
import { usePasswordPolicy } from "@hooks/passPolicyHooks.js";
import PassPolicy from "@components/PassPolicy.jsx";
import CompanyDropdown from "@components/dropdowns/CompanyDropdown.jsx";

const UserForm = ({ userData }) => {
    const {
        password,
        handlePasswordChange,
        policyStatus,
    } = usePasswordPolicy(userData?.password || "");

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm({
        resolver: zodResolver(userEditSchema),
        defaultValues: {
            ...userData,
            password,
        },
    });

    const { handleUserSubmit } = useUserForm(userData);

    useEffect(() => {
        if (userData) {
            Object.keys(userData).forEach((key) => {
                setValue(key, userData[key]);
            });
        }
    }, [userData, setValue]);

    return (
        <form onSubmit={handleSubmit(handleUserSubmit)}>
            <div className="grid grid-cols-12 gap-x-6">
                <div className="xxl:col-span-5 xl:col-span-12 col-span-12">
                    <div className="box overflow-hidden">
                        <div className="box-body !p-0">
                            <div className="sm:flex items-start p-6 main-profile-cover">
                                <Avatar avatar={userData.avatar} size="xxl" parentClasses="me-4" />
                                <div className="flex-grow main-profile-info">
                                    <div className="flex items-center !justify-between">
                                        <h6 className="font-semibold mb-1 text-white text-[1rem]">
                                            {userData.full_name} ({userData.employee.emp_code})
                                        </h6>
                                    </div>
                                    <p className="mb-1 !text-white  opacity-[0.7]">
                                        {userData.employee.position.name}
                                    </p>
                                    <p className="text-[0.75rem] text-white mb-6 opacity-[0.5]">
                    <span className="me-4 inline-flex">
                      <i className="ri-building-line me-1 align-middle"></i>
                        {userData.employee.company.name}
                    </span>
                                        <span className="inline-flex">
                      <i className="ri-map-pin-line me-1 align-middle"></i>
                                            {userData.employee.location.name}
                    </span>
                                    </p>
                                    <div className="flex mb-0">
                                        <div className="me-6">
                                            <p className="font-bold text-[1rem] text-white text-shadow mb-0">
                                                {formatDate(userData.employee.service_started_at)}
                                            </p>
                                            <p className="mb-0 text-[.6875rem] opacity-[0.5] text-white">
                                                Service started date
                                            </p>
                                        </div>
                                        <div className="me-6">
                                            <p className="font-bold text-[1rem] text-white text-shadow mb-0">
                                                {userData.is_active ? "Active" : "Not Active"}
                                            </p>
                                            <p className="mb-0 text-[.6875rem] opacity-[0.5] text-white">
                                                Service status
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-b border-dashed dark:border-defaultborder/10">
                                <p className="text-[.9375rem] mb-2 me-6 font-semibold">
                                    Contact Information :
                                </p>
                                <div className="text-[#8c9097] dark:text-white/50">
                                    <p className="mb-2">
                    <span className="avatar avatar-sm avatar-rounded me-2 bg-light text-[#8c9097] dark:text-white/50">
                      <i className="ri-mail-line align-middle text-[.875rem] text-[#8c9097] dark:text-white/50"></i>
                    </span>
                                        {userData.email}
                                    </p>
                                    <p className="mb-2">
                    <span className="avatar avatar-sm avatar-rounded me-2 bg-light text-[#8c9097] dark:text-white/50">
                      <i className="ri-phone-line align-middle text-[.875rem] text-[#8c9097] dark:text-white/50"></i>
                    </span>
                                        {userData.employee.phone}
                                    </p>
                                    <p className="mb-2">
                    <span className="avatar avatar-sm avatar-rounded me-2 bg-light text-[#8c9097] dark:text-white/50">
                      <i className="ri-map-pin-line align-middle text-[.875rem] text-[#8c9097] dark:text-white/50"></i>
                    </span>
                                        {userData.employee.city?.name}
                                    </p>
                                </div>
                            </div>
                            {userData?.line_manager && (
                                <div className="p-6 border-b border-dashed dark:border-defaultborder/10">
                                    <p className="text-[.9375rem] mb-2 me-6 font-semibold">
                                        Line Manager :
                                    </p>
                                    <ul className="list-group">
                                        <li className="list-group-item">
                                            <div className="sm:flex items-start">
                                                <Avatar avatar={userData?.line_manager?.avatar} />
                                                <div className="sm:ms-2 ms-0 sm:mt-0 mt-1 font-semibold flex-grow">
                                                    <p className="mb-0 leading-none">
                                                        {userData?.line_manager?.full_name}
                                                    </p>
                                                    <span className="text-[.6875rem] text-[#8c9097] dark:text-white/50 opacity-[0.7]">
                            {userData?.line_manager?.email}
                          </span>
                                                </div>
                                                <Link
                                                    to={`/module/users/edit/${userData?.line_manager?.id}`}
                                                    className="ti-btn ti-btn-light !py-1 !px-2 !text-[0.75rem]"
                                                >
                                                    View
                                                </Link>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            )}
                            <div className="p-6">
                                <p className="text-[.9375rem] mb-2 me-6 font-semibold">
                                    Other Information :
                                </p>
                                <ul className="list-group">
                                    <li className="list-group-item">
                                        <div className="flex flex-wrap items-center">
                                            <div className="me-2 font-semibold">Emp code :</div>
                                            <span className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                        {userData.employee.emp_code}
                      </span>
                                        </div>
                                    </li>
                                    <li className="list-group-item">
                                        <div className="flex flex-wrap items-center">
                                            <div className="me-2 font-semibold">Father name :</div>
                                            <span className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                        {userData.employee.father_name}
                      </span>
                                        </div>
                                    </li>
                                    <li className="list-group-item">
                                        <div className="flex flex-wrap items-center">
                                            <div className="me-2 font-semibold">Gender :</div>
                                            <span className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                        {userData.employee.gender === "M" ? "Male" : "Female"}
                      </span>
                                        </div>
                                    </li>
                                    <li className="list-group-item">
                                        <div className="flex flex-wrap items-center">
                                            <div className="me-2 font-semibold">Department :</div>
                                            <span className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                        {userData?.employee.department.name}
                      </span>
                                        </div>
                                    </li>
                                    {/* If needed, uncomment CNIC */}
                                    {/*<li className="list-group-item">
                    <div className="flex flex-wrap items-center">
                      <div className="me-2 font-semibold">Cnic :</div>
                      <span className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                        {userData?.employee.cnic}
                      </span>
                    </div>
                  </li>*/}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="xxl:col-span-7">
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">User Info</div>
                        </div>

                        <div className="box-body">
                            <div className="grid grid-cols-12 gap-4">
                                {/* Avatar Upload */}
                                <div className="xl:col-span-12 col-span-12">
                                    <FileUpload
                                        currentValue={userData?.avatar?.id}
                                        file={userData?.avatar}
                                        inputName="avatar_id"
                                        control={control}
                                        errors={errors}
                                    />
                                </div>

                                {/* Password Input + Policy Tooltip */}
                                <div className="xl:col-span-12 col-span-12 relative">
                                    <FormInput
                                        type="password"
                                        name="password"
                                        control={control}
                                        errors={errors}
                                        placeholder="Password"
                                        onChange={(e) => {
                                            handlePasswordChange(e);
                                            setValue("password", e.target.value);
                                        }}
                                        value={password}
                                    />
                                    {/* Integrate PassPolicy here, passing both policyStatus and password */}
                                    <PassPolicy policyStatus={policyStatus} password={password}/>
                                </div>

                                {/* Group IDs Async Select */}
                                <div className="xl:col-span-12 col-span-12">
                                    <FormAsyncSelect
                                        isMulti={true}
                                        name="group_ids"
                                        control={control}
                                        errors={errors}
                                        placeholder="Groups"
                                        apiUrl="/select/roles/"
                                        queryKeyBase="groups"
                                        preselectedOptions={formatOptions(userData, "groups")}
                                    />
                                </div>

                                <div className="xl:col-span-12 col-span-12">
                                    <CompanyDropdown
                                        name='company_right_ids'
                                        control={control}
                                        errors={errors}
                                        haveLabel={true}
                                        placeholder='Company Rights'
                                        multiple={true}
                                        data={userData}
                                        dataKey='company_rights'
                                    />
                                </div>

                                {/* Superuser Checkbox */}
                                <div className="xl:col-span-6 col-span-12">
                                    <FormCheckbox
                                        name="is_superuser"
                                        label="Superuser"
                                        control={control}
                                        errors={errors}
                                    />
                                </div>

                                {/* Send Email On Update Checkbox */}
                                <div className="xl:col-span-6 col-span-12">
                                    <FormCheckbox
                                        name="send_email_on_update"
                                        label="Send Email On Update"
                                        control={control}
                                        errors={errors}
                                        defaultChecked={false} // Ensure this is unchecked by default
                                    />
                                </div>


                                {/* Active Status Checkbox */}
                                <div className="xl:col-span-12 col-span-12">
                                    <FormCheckbox
                                        name="is_active"
                                        label="Active"
                                        control={control}
                                        errors={errors}
                                        className="mt-1"
                                    />
                                </div>


                            </div>
                        </div>

                        {/* Submit Button */}
                        <div
                            className="px-6 py-4 border-t border-dashed dark:border-defaultborder/10 sm:flex justify-end"
                        >
                            <FormButton isLoading={isSubmitting}/>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default UserForm;
