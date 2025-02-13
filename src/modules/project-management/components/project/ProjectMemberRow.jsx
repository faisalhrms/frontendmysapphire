import React, {useMemo} from "react";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import {formatMappedData} from "@helpers/formatters.js";
import FormToggle from "@components/form/FormToggle.jsx";

const ProjectMemberRow = ({ data, index, control, errors, remove, append }) => {
    const { users, members } = data;
    const preselectedOptions = useMemo(() => {
        return formatMappedData(members, users);
    }, [members, users]);
    return (
        <div className="grid grid-cols-12 gap-x-2 items-center">
            <div className="col-span-8">
                {
                    index === 0 &&
                    (
                        <label htmlFor={`members.${index}.user_id`} className="form-label">
                            Member
                        </label>
                    )
                }
                <FormAsyncSelect
                    label={false}
                    isMulti={false}
                    name={`members.${index}.user_id`}
                    control={control}
                    errors={errors}
                    placeholder="Member"
                    apiUrl="/select/users/"
                    queryKeyBase="users"
                    preselectedOptions={preselectedOptions}
                />
            </div>
            <div className="col-span-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                    <div className="flex flex-col items-center">
                        {
                            index === 0 &&
                            (
                                <label htmlFor={`members.${index}.can_view_only`} className="form-label">
                                    View
                                </label>
                            )
                        }
                        <FormToggle
                            label={false}
                            toggleClasses='toggle-sm'
                            name={`members.${index}.can_view_only`}
                            control={control}
                            errors={errors}
                            labelClasses='label-primary'
                        />
                    </div>
                    <div className="flex flex-col items-center">
                        {
                            index === 0 &&
                            (
                                <label htmlFor={`members.${index}.email_notification`} className="form-label">
                                    Email
                                </label>
                            )
                        }
                        <FormToggle
                            label={false}
                            toggleClasses='toggle-sm'
                            name={`members.${index}.email_notification`}
                            control={control}
                            errors={errors}
                            labelClasses='label-primary'
                        />
                    </div>
                    <div className="flex flex-col items-end">
                        <div className='flex items-end flex-shrink-0'>
                            <i
                                onClick={() =>
                                    append({
                                        user_id: null,
                                        can_view_only: false,
                                        email_notification: true,
                                    })
                                }
                                className="bi bi-plus-square text-success rounded-md cursor-pointer hover:bg-success-dark">

                            </i>
                            {
                                index > 0 &&
                                (
                                    <i
                                        onClick={() => remove(index)}
                                        className="bi bi-dash-square text-danger rounded-md cursor-pointer hover:bg-danger-dark ml-1">
                                    </i>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectMemberRow;
