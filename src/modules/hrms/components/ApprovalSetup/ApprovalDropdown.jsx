import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useForm, FormProvider } from 'react-hook-form';
import FormSelect from '@components/form/FormSelect.jsx';
import useDynamicDropdown from '@modules/hrms/hooks/useApprovalSetupModal.js';
import DraggableDropdown from "../../components/ApprovalSetup/DraggableApproval.jsx"
import UserDropdown from "@components/dropdowns/UserDropdown.jsx";
import {formatOptionsWithConcatenation} from "@helpers/formatters.js";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import {useSelector} from "react-redux";

const DynamicDropdownChain = ({ initialDropdowns }) => {
    const user = useSelector((state) => state.auth.user);
    const company_id = user.employee?.company?.id

    const {
        dropdowns,
        addDropdown,
        removeDropdown,
        updateDropdownValue,
        moveItem,
        users,
    } = useDynamicDropdown(initialDropdowns);

    const methods = useForm({
        defaultValues: { type: '' },
    });

    return (
        <FormProvider {...methods}>
            <DndProvider backend={HTML5Backend}>
                <div className="max-w-4xl mx-auto">
                    <div className="flex md:flex-row gap-4 mb-4">
                        <div className="w-full">
                            <FormSelect
                                name="Type"
                                control={methods.control}
                                errors={methods.formState.errors}
                                placeholder="Type"
                                options={[
                                    {value: 'objective', label: 'Objective'},
                                    {value: 'appraisal', label: 'Appraisal'},
                                ]}
                                is_required={true}
                                className="w-full"
                            />
                        </div>
                        <div className="w-full">
                            <FormAsyncSelect
                                name="user_id"
                                control={methods.control}
                                errors={methods.formState.errors}
                                placeholder="User"
                                apiUrl={`/select/users/?company_id=${company_id}`}
                                queryKeyBase={`company_${company_id}_users`}
                                preselectedOptions={[]}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto">
                                <tbody className="max-h-96 overflow-y-auto block bg-gray-50">
                                {dropdowns.map((dropdown, index) => (
                                    <DraggableDropdown
                                        key={dropdown.id}
                                        id={dropdown.id}
                                        index={index}
                                        dropdown={dropdown}
                                        moveItem={moveItem}
                                        updateDropdownValue={updateDropdownValue}
                                        addDropdown={addDropdown}
                                        removeDropdown={removeDropdown}
                                        isLast={index === dropdowns.length - 1}
                                        canRemove={dropdowns.length > 1}
                                        users={users}
                                    />
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </DndProvider>
        </FormProvider>
    );
};

export default DynamicDropdownChain;




