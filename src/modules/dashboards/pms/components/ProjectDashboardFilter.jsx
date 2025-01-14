import CompanyDropdown from "@components/dropdowns/CompanyDropdown.jsx";
import DepartmentDropdown from "@components/dropdowns/DepartmentDropdown.jsx";
import WorkspaceDropdown from "@components/dropdowns/WorkspaceDropdown.jsx";
import React, {useCallback, useState} from "react";
import FilterButton from "@components/form/FilterButton.jsx";

const ProjectDashboardFilter = ({ control, errors }) => {
    const [company, setCompany] = useState(null);
    const [department, setDepartment] = useState(null);

    const handleCompanySelect = useCallback((id) => {
        setCompany(id)
        setDepartment(null)
    }, []);

    const handleDepartmentSelect = useCallback((id) => {
        setDepartment(id)
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
                                />
                            </div>
                            <FilterButton />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.memo(ProjectDashboardFilter)