import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import DepartmentDropdown from "@components/dropdowns/DepartmentDropdown.jsx";
import SiteDropdown from "@modules/inventory/dropdowns/SiteDropdown.jsx";
import PhysicalLocationDropdown from "@modules/inventory/dropdowns/PhysicalLocationDropdown.jsx";
import EquipmentTypeDropdown from "@modules/inventory/dropdowns/EquipmentTypeDropdown.jsx";
import StatusDropdown from "@modules/inventory/dropdowns/StatusDropdown.jsx";
import CustodianDropdown from "@components/dropdowns/CustodianDropdown.jsx";
import FilterButton from "@components/form/FilterButton.jsx";
import FilterClearButton from "@components/form/FilterClearButton.jsx";
import { equipmentStatuses } from "@modules/inventory/services/inventoryService.js";

const EquipmentListFilter = ({ control, errors,onClear }) => {
    const { user } = useSelector((state) => state.auth);
    const company_id = user?.employee?.company?.id;
    const [department, setDepartment] = useState(null);
    const [site, setSite] = useState(null);
    const [location, setLocation] = useState(null);
    const [equipmentType, setEquipmentType] = useState(null);
    const [status, setStatus] = useState(null);
    const [custodian, setCustodian] = useState(null);


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

    const handleStatusSelect = useCallback((selected) => {
        setStatus(selected);
    }, []);

    const handleCustodianSelect = useCallback((selected) => {
        setCustodian(selected);
    }, []);

    return (
        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
                <div className="box custom-box">
                    <div className="box-body p-4">
                        <div className="flex items-center justify-between gap-4">


                            <DepartmentDropdown
                                company_id={company_id}
                                control={control}
                                errors={errors}
                                onDepartmentSelect={handleDepartmentSelect}
                            />



                            {/* New Filter Dropdowns */}
                            <SiteDropdown
                                control={control}
                                errors={errors}
                                onSiteSelect={handleSiteSelect}
                            />

                            <PhysicalLocationDropdown
                                control={control}
                                errors={errors}
                                onLocationSelect={handleLocationSelect}
                            />

                            <EquipmentTypeDropdown
                                control={control}
                                errors={errors}
                                onTypeSelect={handleTypeSelect}
                            />

                            <StatusDropdown
                                control={control}
                                errors={errors}
                                options={equipmentStatuses}
                                onStatusSelect={handleStatusSelect}
                            />

                            <CustodianDropdown
                                control={control}
                                errors={errors}
                                onCustodianSelect={handleCustodianSelect}
                            />

                            <FilterButton />
                            <FilterClearButton onClick={onClear} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(EquipmentListFilter);
