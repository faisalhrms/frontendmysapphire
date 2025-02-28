import WorkspaceDropdown from "@components/dropdowns/WorkspaceDropdown.jsx";
import React, {useCallback} from "react";
import FilterButton from "@components/form/FilterButton.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import {taskStatuses} from "@modules/project-management/services/taskService.js";
import FormSelect from "@components/form/FormSelect.jsx";
import TagDropdown from "@components/dropdowns/TagDropdown.jsx";
import FormInput from "@components/form/FormInput.jsx";
import FilterClearButton from "@components/form/FilterClearButton.jsx";
import ProjectDropDown from "@modules/project-management/components/dropdowns/ProjectDropDown.jsx";
const TaskListFilter = ({ control, errors, clearFilter }) => {
    const [workspaces,setWorkspaces] = React.useState([]);
    const handleWorkspaceSelect = useCallback((id) => {
        console.log(`id from TaskListFilter`,id);
        setWorkspaces(id)
    }, []);
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
                                    onSelectChange={handleWorkspaceSelect}
                                />
                                <ProjectDropDown
                                    name='projects'
                                    workspaces_id={workspaces}
                                    control={control}
                                    errors={errors}
                                    saveNewOption={false}
                                    multiple={true}

                                    placeholder='Projects'

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
                                    saveOptionEndpoint="/select/pms/team/"
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
                                <FormInput
                                    type="date"
                                    name="deadline_from"
                                    control={control}
                                    errors={errors}
                                    label={false}
                                />
                                <FormInput
                                    type="date"
                                    name="deadline_to"
                                    control={control}
                                    errors={errors}
                                    label={false}
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