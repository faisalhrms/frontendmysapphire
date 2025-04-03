import CompanyDropdown from "@components/dropdowns/CompanyDropdown.jsx";
import DepartmentDropdown from "@components/dropdowns/DepartmentDropdown.jsx";
import WorkspaceDropdown from "@components/dropdowns/WorkspaceDropdown.jsx";
import React, {useCallback, useState} from "react";
import FilterButton from "@components/form/FilterButton.jsx";
import {useSelector} from "react-redux";
import ProjectDropDown from "@modules/project-management/components/dropdowns/ProjectDropDown.jsx";

const ProjectDashboardFilter = ({ control, errors }) => {
    const companyId = useSelector((state) => state.auth.user.employee.company.id);
    const [company, setCompany] = useState(companyId);
    const [department, setDepartment] = useState(null);
    const [workspace, setWorkspace] = useState(null);

    const handleCompanySelect = useCallback((id) => {
        setCompany(id)
        setDepartment(null)
    }, []);

    const handleDepartmentSelect = useCallback((id) => {
        setDepartment(id)
    }, []);

    const handleWorkspaceSelect = useCallback((id) => {
        setWorkspace(id)
    }, []);

    return (
        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
                <div className="box custom-box">
                    <div className="box-body p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                <CompanyDropdown
                                    control={control}
                                    errors={errors}
                                    onCompanySelect={handleCompanySelect}
                                />
                            </div>
                            <div className="flex items-center gap-4 flex-1">
                                <DepartmentDropdown
                                    company_id={company}
                                    control={control}
                                    errors={errors}
                                    onDepartmentSelect={handleDepartmentSelect}
                                />
                            </div>
                            <div className="flex items-center gap-4 flex-1">
                                <WorkspaceDropdown
                                    company_id={company}
                                    department_id={department}
                                    name='workspace_id'
                                    control={control}
                                    errors={errors}
                                    saveNewOption={false}
                                    onSelectChange={handleWorkspaceSelect}
                                    needObject={false}
                                />
                            </div>
                            <div className="flex items-center gap-4 flex-1">
                                <ProjectDropDown
                                    workspace_id={workspace}
                                    control={control}
                                    errors={errors}
                                />
                            </div>
                            <FilterButton/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.memo(ProjectDashboardFilter)