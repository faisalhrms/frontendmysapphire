import WorkspaceDropdown from "@components/dropdowns/WorkspaceDropdown.jsx";
import React from "react";
import FilterButton from "@components/form/FilterButton.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import {taskStatuses} from "@modules/project-management/services/taskService.js";
import FormSelect from "@components/form/FormSelect.jsx";
import TagDropdown from "@components/dropdowns/TagDropdown.jsx";
import FilterClearButton from "@components/form/FilterClearButton.jsx";
import {useWatch} from "react-hook-form";

const TaskListFilter = ({ control, errors, clearFilter }) => {
    const workspaces = useWatch({ control, name: "workspaces" });
    return (
        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
                <div className="box custom-box">
                    <div className="box-body p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                <WorkspaceDropdown
                                    name='workspaces'
                                    control={control}
                                    errors={errors}
                                    saveNewOption={false}
                                    multiple={true}
                                    placeholder='Workspaces'
                                />
                                <FormAsyncSelect
                                    label={false}
                                    isMulti={true}
                                    name={`projects`}
                                    control={control}
                                    errors={errors}
                                    placeholder="Projects"
                                    apiUrl={`/select/pms/projects/?${workspaces && workspaces.length > 0 ? `workspaces[]=${workspaces.join('&workspaces[]=')}` : ''}`}
                                    queryKeyBase={`workspaces_${workspaces}_projects`}
                                    preselectedOptions={[]}
                                    allowSaveNewOption={false}
                                />
                                <FormAsyncSelect
                                    label={false}
                                    isMulti={true}
                                    name="teams"
                                    control={control}
                                    errors={errors}
                                    placeholder="Teams"
                                    apiUrl="/select/pms/teams/"
                                    queryKeyBase="pms_teams"
                                    preselectedOptions={[]}
                                    allowSaveNewOption={false}
                                />
                                <FormSelect
                                    label={false}
                                    name="status"
                                    control={control}
                                    errors={errors}
                                    options={taskStatuses}
                                    placeholder="Status"
                                />
                                <TagDropdown
                                    control={control}
                                    errors={errors}
                                    name='tags'
                                />
                            </div>
                            <FilterButton />
                            <FilterClearButton onClick={clearFilter} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.memo(TaskListFilter)