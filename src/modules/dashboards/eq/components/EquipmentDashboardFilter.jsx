// src/modules/dashboards/equipment/components/EquipmentDashboardFilter.jsx

import React from "react";
import { Controller } from "react-hook-form";
import Select from 'react-select';

const EquipmentDashboardFilter = ({ control, errors }) => {
    return (
        <div className="flex space-x-4">
            <Controller
                name="company_id"
                control={control}
                render={({ field }) => (
                    <Select
                        {...field}
                        label="Company"
                        options={[
                            { value: 1, label: "Company A" },
                            { value: 2, label: "Company B" },
                            // Add more companies as needed
                        ]}
                        error={errors.company_id}
                    />
                )}
            />
            <Controller
                name="department_id"
                control={control}
                render={({ field }) => (
                    <Select
                        {...field}
                        label="Department"
                        options={[
                            { value: 1, label: "IT" },
                            { value: 2, label: "HR" },
                            { value: 3, label: "Finance" },
                            // Add more departments as needed
                        ]}
                        error={errors.department_id}
                    />
                )}
            />
            <Controller
                name="location_id"
                control={control}
                render={({ field }) => (
                    <Select
                        {...field}
                        label="Location"
                        options={[
                            { value: 1, label: "Warehouse" },
                            { value: 2, label: "Office A" },
                            { value: 3, label: "Office B" },
                            // Add more locations as needed
                        ]}
                        error={errors.location_id}
                    />
                )}
            />
            <button type="submit" className="btn btn-primary">
                Apply Filters
            </button>
        </div>
    );
}

export default EquipmentDashboardFilter;
