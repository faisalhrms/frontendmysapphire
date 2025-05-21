import { useForm } from 'react-hook-form';
import { useCallback, useMemo } from 'react';

/**
 * useFilters Hook
 * @param {Object} config - Configuration object defining the filters.
 * @param {Array} config.initialFilters - Array of filter definitions.
 * @returns {Object} - Contains form methods and filter functions.
 */
const useFilters = (config) => {
    const { initialFilters } = config;

    // Generate default values based on initialFilters
    const defaultValues = useMemo(() => {
        return initialFilters.reduce((acc, filter) => {
            acc[filter.name] = filter.defaultValue || '';
            return acc;
        }, {});
    }, [initialFilters]);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
        getValues,
    } = useForm({
        defaultValues,
        mode: 'onChange',
    });

    // Function to update multiple filters at once
    const updateFilters = useCallback(
        (newFilters) => {
            Object.keys(newFilters).forEach((key) => {
                setValue(key, newFilters[key], { shouldValidate: true, shouldDirty: true });
            });
        },
        [setValue]
    );

    // Function to reset all filters to default or to specific values
    const resetFilters = useCallback(
        (values) => {
            if (values) {
                reset(values);
            } else {
                reset();
            }
        },
        [reset]
    );

    // Function to get current filter values
    const getFilters = useCallback(() => {
        const values = getValues();
        return initialFilters.reduce((acc, filter) => {
            acc[filter.name] = values[filter.name];
            return acc;
        }, {});
    }, [getValues, initialFilters]);

    return {
        control,
        handleSubmit,
        resetFilters,
        updateFilters,
        getFilters,
        errors,
        setValue
    };
};

export default useFilters;
