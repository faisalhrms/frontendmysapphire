import React, { useEffect, useState } from 'react';
import { taskStatuses } from '@modules/project-management/services/taskService.js';
import FormSelect from '@components/form/FormSelect.jsx';

const TaskFilterDropdown = ({ control, errors, selectedStatuses, onChange }) => {
    const statusOptions = taskStatuses.filter(status => status.value).map(status => ({
        value: status.value,
        label: status.label,
    }));

    const handleStatusChange = (newStatuses) => {
        const selectedValues = newStatuses ? newStatuses.map(option => option.value) : [];
        if (onChange) {
            console.log(`selected value`, selectedValues); // Check if selected values are correct
            onChange(selectedValues); // Pass selected values to parent
        }
    };

    // Update selected options based on selectedStatuses prop
    const selectedOptions = statusOptions.filter(status => selectedStatuses.includes(status.value));

    return (
        <div className="xl:col-span-5 col-span-12">
            <FormSelect
                name="filterColumns"
                label={false}
                control={control}
                errors={errors}
                options={statusOptions}
                isClearable={true}
                isMulti={true}
                placeholder="Filter by Status"
                onSelectChange={(newStatuses) => {
                    console.log('FormSelect - newStatuses:', newStatuses); // Check selected values here
                    handleStatusChange(newStatuses);
                }}
                value={selectedOptions} // Ensure selected options are passed correctly
            />
        </div>
    );
};

export default TaskFilterDropdown;
