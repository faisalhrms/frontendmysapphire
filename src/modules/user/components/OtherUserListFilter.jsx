import FilterButton from "@components/form/FilterButton.jsx";
import FilterClearButton from "@components/form/FilterClearButton.jsx";
import React, {useCallback, useState} from "react";
import DepartmentDropdown from "@components/dropdowns/DepartmentDropdown.jsx";
import {useSelector} from "react-redux";
import CompanyDropdown from "@components/dropdowns/CompanyDropdown.jsx";
import GroupDropDown from "@components/dropdowns/GroupDropDown.jsx";

const OtherUserListFilter = ({ control, errors, clearFilter }) => {
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
                                />

                            </div>
                            <div className="flex items-center gap-4 flex-1">
                                <GroupDropDown
                                    name='group_ids'
                                    control={control}
                                    errors={errors}
                                    multiple={true}
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
export default OtherUserListFilter