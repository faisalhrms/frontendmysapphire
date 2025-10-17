import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import CompanyDropdown from "@components/dropdowns/CompanyDropdown.jsx";
import DepartmentDropdown from "@components/dropdowns/DepartmentDropdown.jsx";
import SiteDropdown from "@modules/inventory/dropdowns/SiteDropdown.jsx";
import PhysicalLocationDropdown from "@modules/inventory/dropdowns/PhysicalLocationDropdown.jsx";
import EquipmentTypeDropdown from "@modules/inventory/dropdowns/EquipmentTypeDropdown.jsx";
import StatusDropdown from "@modules/inventory/dropdowns/StatusDropdown.jsx";
import CustodianDropdown from "@components/dropdowns/CustodianDropDown.jsx";
import FilterButton from "@components/form/FilterButton.jsx";
import FilterClearButton from "@components/form/FilterClearButton.jsx";
import { equipmentStatuses } from "@modules/inventory/services/inventoryService.js";
import UserCompanyDropdown from "@components/dropdowns/UserCompanyDropdown.jsx";

const EquipmentDashboardFilter = ({ control, errors, onClear }) => {
    const { user } = useSelector((state) => state.auth);
    const company_id = user?.employee?.company?.id;
    const [company, setCompany] = useState(company_id);
    const [department, setDepartment] = useState(null);
    const [site, setSite] = useState(null);
    const [location, setLocation] = useState(null);
    const [equipmentType, setEquipmentType] = useState(null);
    const [status, setStatus] = useState(null);
    const [custodian, setCustodian] = useState(null);

    const handleCompanySelect = useCallback((id) => {
        setCompany(id);
        setDepartment(null);
    }, []);

    const handleDepartmentSelect = useCallback((id) => {
        setDepartment(id);
    }, []);

    const handleSiteSelect = useCallback((selected) => {
        setSite(selected);
    }, []);

    const handleLocationSelect = useCallback((selected) => {
        setLocation(selected);
    }, []);

    const handleTypeSelect = useCallback((selected) => {
        setEquipmentType(selected);
    }, []);

    return (
        <div className="grid grid-cols-12 gap-6 mt-6 border-t border-gray-200 pt-4 dark:border-gray-700 overflow-x-auto">
            <div className="col-span-12">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                <UserCompanyDropdown
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
                                <SiteDropdown
                                    control={control}
                                    errors={errors}
                                    onSiteSelect={handleSiteSelect}
                                />
                            </div>

                            <div className="flex items-center gap-4 flex-1">
                                <PhysicalLocationDropdown
                                    control={control}
                                    errors={errors}
                                    onLocationSelect={handleLocationSelect}
                                />
                            </div>

                            <div className="flex items-center gap-4 flex-1">
                                <EquipmentTypeDropdown
                                    control={control}
                                    errors={errors}
                                    onTypeSelect={handleTypeSelect}
                                />
                            </div>
                            <FilterButton />
                </div>
            </div>
        </div>
    );
};

export default React.memo(EquipmentDashboardFilter);
