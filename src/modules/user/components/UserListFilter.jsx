import FilterButton from "@components/form/FilterButton.jsx";
import FilterClearButton from "@components/form/FilterClearButton.jsx";
import React, {useCallback, useState} from "react";
import DepartmentDropdown from "@components/dropdowns/DepartmentDropdown.jsx";
import {useSelector} from "react-redux";
import CompanyDropdown from "@components/dropdowns/CompanyDropdown.jsx";
import GroupDropDown from "@components/dropdowns/GroupDropDown.jsx";

const UserListFilter = ({ control, errors, clearFilter }) => {
    const companyId = useSelector((state) => state.auth.user.employee.company.id);
    const [company, setCompany] = useState(companyId);
    const [department, setDepartment] = useState(null);
    const [group, setGroup] = useState(null);
    const handleCompanySelect = useCallback((id) => {
        setCompany(id)
        setDepartment(null)
    }, []);

    const handleDepartmentSelect = useCallback((id) => {
        setDepartment(id)
    }, []);
    const handleGroupSelect=useCallback((id)=>{
        setGroup(id)
    },[])
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
                                <GroupDropDown
                                    control={control}
                                    errors={errors}
                                    multiple={true}
                                    onGroupSelect={handleGroupSelect}
                                />

                            </div>
                            <FilterButton/>
                            <FilterClearButton onClick={clearFilter}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default UserListFilter