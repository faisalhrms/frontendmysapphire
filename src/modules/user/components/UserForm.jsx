import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { statuses } from "@modules/user/services/userService.js";
import userSchema from "@modules/user/schemas/userSchema.js";
import FormInput from "@components/form/FormInput.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import FormButton from "@components/form/FormButton.jsx";
import {formatOptions} from "@helpers/formatters.js";
import {useUserForm} from "@modules/user/hooks/userHooks.js";
import FileUpload from "@components/FileUpload.jsx";
import Avatar from "@components/Avatar.jsx";
import {formatDate} from "@helpers/dateTime.js";
import {Link} from "react-router-dom";

const UserForm = ({ userData}) => {

    const { control, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: {
            ...userData
        }
    });

    const { handleUserSubmit } = useUserForm(userData);

    useEffect(() => {
        if (userData) {
            Object.keys(userData).forEach(key => {
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
                                <Avatar avatar={userData.avatar} size='xxl' parentClasses='me-4'/>
                                <div className="flex-grow main-profile-info">
                                    <div className="flex items-center !justify-between">
                                        <h6 className="font-semibold mb-1 text-white text-[1rem]">{userData.full_name} ({userData.emp_code})</h6>
                                    </div>
                                    <p className="mb-1 !text-white  opacity-[0.7]">{userData.position.name}</p>
                                    <p className="text-[0.75rem] text-white mb-6 opacity-[0.5]">
                                        <span className="me-4 inline-flex"><i
                                            className="ri-building-line me-1 align-middle"></i>{userData.company.name}</span>
                                        <span className="inline-flex"><i
                                            className="ri-map-pin-line me-1 align-middle"></i>{userData.location.name}</span>
                                    </p>
                                    <div className="flex mb-0">
                                        <div className="me-6"><p
                                            className="font-bold text-[1rem] text-white text-shadow mb-0">{formatDate(userData.service_started_at)}</p>
                                            <p
                                                className="mb-0 text-[.6875rem] opacity-[0.5] text-white">Service
                                                started date</p></div>
                                        <div className="me-6"><p
                                            className="font-bold text-[1rem] text-white text-shadow mb-0">{userData.service_status}</p>
                                            <p
                                                className="mb-0 text-[.6875rem] opacity-[0.5] text-white">Service
                                                status</p></div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-b border-dashed dark:border-defaultborder/10"><p
                                className="text-[.9375rem] mb-2 me-6 font-semibold">Contact Information :</p>
                                <div className="text-[#8c9097] dark:text-white/50">
                                    <p className="mb-2">
                                        <span
                                            className="avatar avatar-sm avatar-rounded me-2 bg-light text-[#8c9097] dark:text-white/50">
                                            <i className="ri-mail-line align-middle text-[.875rem] text-[#8c9097] dark:text-white/50"></i>
                                        </span>
                                        {userData.email}
                                    </p>
                                    <p className="mb-2">
                                        <span
                                            className="avatar avatar-sm avatar-rounded me-2 bg-light text-[#8c9097] dark:text-white/50">
                                            <i className="ri-phone-line align-middle text-[.875rem] text-[#8c9097] dark:text-white/50"></i>
                                        </span>
                                        {userData.phone}
                                    </p>
                                    <p className="mb-2">
                                        <span
                                            className="avatar avatar-sm avatar-rounded me-2 bg-light text-[#8c9097] dark:text-white/50">
                                            <i className="ri-map-pin-line align-middle text-[.875rem] text-[#8c9097] dark:text-white/50"></i>
                                        </span>
                                        {userData.city?.name}
                                    </p>
                                </div>
                            </div>
                            {userData?.line_manager &&
                                (
                                    <div className="p-6 border-b border-dashed dark:border-defaultborder/10">
                                        <p className="text-[.9375rem] mb-2 me-6 font-semibold">Line Manager :</p>
                                        <ul className="list-group">
                                            <li className="list-group-item">
                                                <div className="sm:flex items-start">
                                                    <Avatar avatar={userData?.line_manager?.avatar}/>
                                                    <div className="sm:ms-2 ms-0 sm:mt-0 mt-1 font-semibold flex-grow">
                                                        <p
                                                            className="mb-0 leading-none">{userData?.line_manager?.full_name}</p>
                                                        <span
                                                            className="text-[.6875rem] text-[#8c9097] dark:text-white/50 opacity-[0.7]">{userData?.line_manager?.email}</span>
                                                    </div>
                                                    <Link
                                                        to={`/module/users/edit/${userData?.line_manager?.id}`}
                                                        className="ti-btn ti-btn-light !py-1 !px-2 !text-[0.75rem]">
                                                        View
                                                    </Link>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                )
                            }
                            <div className="p-6">
                                <p className="text-[.9375rem] mb-2 me-6 font-semibold">Other Information :</p>
                                <ul className="list-group">
                                    <li className="list-group-item">
                                        <div className="flex flex-wrap items-center">
                                            <div className="me-2 font-semibold">Emp code :</div>
                                            <span
                                                className="text-[0.75rem] text-[#8c9097] dark:text-white/50">{userData.emp_code}</span>
                                        </div>
                                    </li>
                                    <li className="list-group-item">
                                        <div className="flex flex-wrap items-center">
                                            <div className="me-2 font-semibold">Father name :</div>
                                            <span
                                                className="text-[0.75rem] text-[#8c9097] dark:text-white/50">{userData.father_name}</span>
                                        </div>
                                    </li>
                                    <li className="list-group-item">
                                        <div className="flex flex-wrap items-center">
                                            <div className="me-2 font-semibold">Gender :</div>
                                            <span
                                                className="text-[0.75rem] text-[#8c9097] dark:text-white/50">{userData.gender}</span>
                                        </div>
                                    </li>
                                    <li className="list-group-item">
                                        <div className="flex flex-wrap items-center">
                                            <div className="me-2 font-semibold">Department :</div>
                                            <span
                                                className="text-[0.75rem] text-[#8c9097] dark:text-white/50">{userData?.department.name}</span>
                                        </div>
                                    </li>
                                    <li className="list-group-item">
                                        <div className="flex flex-wrap items-center">
                                            <div className="me-2 font-semibold">Cnic :</div>
                                            <span
                                                className="text-[0.75rem] text-[#8c9097] dark:text-white/50">{userData.cnic}</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                    <div className="xxl:col-span-7">
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title"> User Info</div>
                            </div>
                            <div className="box-body">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="xl:col-span-12 col-span-12">
                                        <FileUpload
                                            currentValue={userData?.avatar_id}
                                            file={userData?.avatar}
                                            inputName="avatar_id"
                                            control={control}
                                            errors={errors}
                                        />
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <FormInput
                                            type="password"
                                            name="password"
                                            control={control}
                                            errors={errors}
                                            placeholder="Password"
                                        />
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <FormSelect
                                            name="status"
                                            control={control}
                                            errors={errors}
                                            options={statuses}
                                            placeholder="Status"
                                        />
                                    </div>
                                    <div className="xl:col-span-12 col-span-12">
                                        <FormAsyncSelect
                                            isMulti={true}
                                            name="role_ids"
                                            control={control}
                                            errors={errors}
                                            placeholder="Roles"
                                            apiUrl="/select/roles"
                                            queryKeyBase="roles"
                                            preselectedOptions={formatOptions(userData, 'roles')}/>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="px-6 py-4 border-t border-dashed dark:border-defaultborder/10 sm:flex justify-end">
                                <FormButton isLoading={isSubmitting}/>
                            </div>
                        </div>
                    </div>
            </div>
        </form>
    );
};

export default UserForm;
