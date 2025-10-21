import React, { useState, useCallback } from "react";
import FilterButton from "@components/form/FilterButton.jsx";
import LocationDropdown from "@modules/dashboards/eq-aud/components/LocationDropdown.jsx";
import CompanyDropdown from "@components/dropdowns/CompanyDropdown.jsx";
import LocationSubnetDropDown from "@modules/dashboards/eq-aud/components/LocationSubnetDropDown.jsx";

const EquipmentAuditDashboardFilter = ({
                                           control,
                                           errors,
                                           onCompanySelect,
                                           onLocationSelect,
                                           onSubnetSelect,
                                           companyPreselectedOptions = [],
                                           locationPreselectedOptions = [],
                                           subnetPreselectedOptions = [],
                                       }) => {
    const [company, setCompany] = useState(""); // no preselection
    const [site, setSite] = useState("");
    const [subnet, setSubnet] = useState("");

    const handleCompany = useCallback((id) => {
        setCompany(id || "");
        setSite("");
        setSubnet("");
        onCompanySelect?.(id || "");
    }, [onCompanySelect]);

    const handleSite = useCallback((val) => {
        setSite(val || "");
        setSubnet("");
        onLocationSelect?.(val || "");
    }, [onLocationSelect]);

    const handleSubnet = useCallback((val) => {
        setSubnet(val || "");
        onSubnetSelect?.(val || "");
    }, [onSubnetSelect]);

    const locationDisabled = !company;
    const subnetDisabled = !site;

    return (
        <div className="mt-2 w-full">
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-4 items-stretch">
                <div className="min-w-0">
                    <CompanyDropdown
                        control={control}
                        errors={errors}
                        placeholder="Company"
                        preselectedOptions={companyPreselectedOptions }
                        onCompanySelect={handleCompany}
                        className="w-full"
                    />
                </div>

                <div className="min-w-0">
                    <LocationDropdown
                        control={control}
                        errors={errors}
                        preselectedOptions={locationPreselectedOptions }
                        onSiteSelect={handleSite}
                        className="w-full"
                        companyId={company}
                        isDisabled={locationDisabled}
                    />
                </div>


                <div className="min-w-0">
                    <LocationSubnetDropDown
                        control={control}
                        errors={errors}
                        locationId={site}
                        preselectedOptions={subnetPreselectedOptions }
                        onSubnetSelect={handleSubnet}
                        className="w-full"
                        isDisabled={subnetDisabled}
                    />
                </div>

                <div className="flex items-center justify-end gap-2 w-full md:w-auto">
                    <FilterButton />
                </div>
            </div>
        </div>
    );
};

export default React.memo(EquipmentAuditDashboardFilter);
