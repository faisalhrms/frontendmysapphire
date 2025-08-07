import React from 'react';
import { useSelector } from 'react-redux';
import FormAsyncSelect from '@components/form/FormAsyncSelect.jsx';
import { PlusCircle, MinusCircle } from 'lucide-react';
import {useWatch} from "react-hook-form";

const ApproverRow = ({ index, control, errors, remove, append, fieldsLength }) => {
    const user = useSelector((state) => state.auth.user);
    const company_id = user?.employee?.company?.id;
    const approvers = useWatch({ control, name: 'approvers' }) || [];
    const option = approvers[index]?.approverOption;
    const pre = option ? [option] : [];
    return (
        <div className="grid grid-cols-12 gap-4 items-center">
            {/* Level Badge */}
            <div className="col-span-1 flex justify-center">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                    {index + 1}
                </div>
            </div>

            {/* Approver Select */}
            <div className="col-span-10">
                <FormAsyncSelect
                    name={`approvers.${index}.approver_id`}
                    control={control}
                    errors={errors}
                    placeholder="Select Approver"
                    label={false}
                    apiUrl={`/select/users/?company_id=${company_id}`}
                    queryKeyBase={`company_${company_id}_users`}
                    preselectedOptions={pre}
                />
            </div>

            {/* Add/Remove Buttons */}
            <div className="col-span-1 flex space-x-1 justify-end">
                <PlusCircle
                    className="cursor-pointer text-emerald-500 hover:text-emerald-600"
                    onClick={() => append({ level: fieldsLength + 1, approver_id: null })}
                />
                {index > 0 && (
                    <MinusCircle
                        className="cursor-pointer text-rose-500 hover:text-rose-600"
                        onClick={() => remove(index)}
                    />
                )}
            </div>
        </div>
    );
};

export default ApproverRow;
