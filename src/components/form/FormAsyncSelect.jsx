import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash.debounce';
import { Controller } from 'react-hook-form';
import ErrorMessage from '@components/form/ErrorMessage.jsx';
import api from '@config/axiosConfig.js';

const ensureArray = (data) => Array.isArray(data) ? data : [];

const MemoizedSelect = React.memo(Select);
const MemoizedCreatableSelect = React.memo(CreatableSelect);

const FormAsyncSelect = ({
                             name,
                             is_required = false,
                             label = true,
                             control,
                             errors,
                             placeholder,
                             className = "",
                             apiUrl,
                             debounceDelay = 300,
                             queryKeyBase,
                             isMulti = false,
                             clientSideSearch = false,
                             preselectedOptions = [],
                             saveOptionEndpoint = "",
                             allowSaveNewOption = false,
                             onSelectChange,
                             needObject = false,
                             ...rest
                         }) => {
    const [search, setSearch] = useState('');
    const [hasBeenFocused, setHasBeenFocused] = useState(false);
    const [allOptions, setAllOptions] = useState([]);
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState(preselectedOptions);

    // Debounced search handler
    const debouncedSetSearch = useMemo(
        () => debounce((value) => setSearch(value), debounceDelay),
        [debounceDelay]
    );

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            debouncedSetSearch.cancel();
        };
    }, [debouncedSetSearch]);

    // Update selected options when preselectedOptions change
    useEffect(() => {
        setSelectedOptions(preselectedOptions);
    }, [preselectedOptions]);

    // Fetch options from API
    const fetchOptions = useCallback(async (searchTerm) => {
        try {
            const response = await api.get(apiUrl, { params: { search: searchTerm } });
            return ensureArray(response.data?.data);
        } catch (error) {
            console.error('Error fetching options:', error);
            return [];
        }
    }, [apiUrl]);

    // React Query to fetch options based on search
    const { data: options = [], isLoading } = useQuery({
        queryKey: [queryKeyBase, search],
        queryFn: () => fetchOptions(search),
        enabled: !clientSideSearch && hasBeenFocused && menuIsOpen,
        staleTime: 60000,
        refetchOnWindowFocus: false,
    });

    // Fetch all options for client-side search when menu is open
    useEffect(() => {
        if (clientSideSearch && menuIsOpen) {
            const fetchAllOptions = async () => {
                const fetchedOptions = await fetchOptions('');
                setAllOptions(ensureArray(fetchedOptions));
            };
            fetchAllOptions();
        }
    }, [clientSideSearch, menuIsOpen, fetchOptions]);

    // Memoized filtered options based on search
    const filteredOptions = useMemo(() => {
        return clientSideSearch
            ? allOptions.filter(option => option.label.toLowerCase().includes(search.toLowerCase()))
            : options;
    }, [clientSideSearch, allOptions, options, search]);

    // Ensure selected options are included in the options list
    const optionsWithSelected = useMemo(() => {
        const uniqueOptions = new Map(filteredOptions.map(opt => [opt.value, opt]));
        selectedOptions.forEach(opt => {
            if (opt && opt.value) uniqueOptions.set(opt.value, opt);
        });
        return Array.from(uniqueOptions.values());
    }, [filteredOptions, selectedOptions]);

    // Save new option to the server
    const saveNewOption = useCallback(async (newOptionLabel) => {
        if (!allowSaveNewOption || !saveOptionEndpoint) return null;
        try {
            const { data } = await api.post(saveOptionEndpoint, { label: newOptionLabel });
            return data.data; // Ensure this includes both value and label
        } catch (error) {
            console.error('Error saving new option:', error);
            return null;
        }
    }, [allowSaveNewOption, saveOptionEndpoint]);

    // Handle option creation
    const handleCreateOption = useCallback(async (newOptionLabel, field) => {
        const newOption = await saveNewOption(newOptionLabel);
        if (newOption) {
            setSelectedOptions(prev => {
                const updated = [...prev, newOption];
                return Array.from(new Map(updated.map(opt => [opt.value, opt])).values());
            });
            if (isMulti) {
                const updatedValues = [...(field.value || []), newOption.value];
                field.onChange(updatedValues);
                if (onSelectChange) {
                    onSelectChange(updatedValues);
                }
            } else {
                field.onChange(newOption.value);
                if (onSelectChange) {
                    onSelectChange(newOption.value);
                }
            }
        }
    }, [saveNewOption, isMulti]);

    return (
        <>
            {label && (
                <label htmlFor={name} className="form-label">
                    {placeholder}
                    {is_required && <span className="text-rose-500 pl-1"> *</span>}
                </label>
            )}
            <Controller
                name={name}
                control={control}
                render={({ field }) => {
                    const value = isMulti ? (Array.isArray(field.value) ? field.value : []) : field.value;
                    const SelectComponent = allowSaveNewOption ? MemoizedCreatableSelect : MemoizedSelect;

                    // Memoized onChange handler
                    const handleChange = useCallback((selectedOption, actionMeta) => {
                        if (actionMeta.action === 'create-option') {
                            handleCreateOption(actionMeta.option.label, field);
                        } else {
                            const selectedValues = isMulti
                                ? selectedOption.map(opt => opt.value)
                                : selectedOption?.value;

                            setSelectedOptions(isMulti
                                ? selectedOption.map(opt => optionsWithSelected.find(opt2 => opt2.value === opt.value))
                                : selectedOption ? [selectedOption] : []
                            );

                            field.onChange(selectedValues);

                            if (onSelectChange) {
                                if (needObject) {
                                    const updatedOption = selectedOption.map(opt => ({
                                        id: opt.value,
                                        name: opt.label,
                                    }));
                                    onSelectChange(updatedOption);
                                } else {
                                    onSelectChange(selectedValues);
                                }
                            }
                        }
                    }, [handleCreateOption, isMulti, onSelectChange, optionsWithSelected, field]);

                    // Memoized onInputChange handler
                    const handleInputChange = useCallback((inputValue) => {
                        if (clientSideSearch) {
                            setSearch(inputValue);
                        } else {
                            debouncedSetSearch(inputValue);
                        }
                    }, [clientSideSearch, debouncedSetSearch]);

                    // Determine the current value for the select component
                    const selectValue = useMemo(() => {
                        return isMulti
                            ? optionsWithSelected.filter(option => value.includes(option.value))
                            : optionsWithSelected.find(option => option.value === value) || null;
                    }, [isMulti, optionsWithSelected, value]);

                    return (
                        <SelectComponent
                            {...field}
                            {...rest}
                            isMulti={isMulti}
                            className={`w-full !rounded-sm border ${errors[name] ? '!border-red' : ''} ${className}`}
                            classNamePrefix="Select2"
                            placeholder={placeholder}
                            options={optionsWithSelected}
                            isLoading={isLoading}
                            onChange={handleChange}
                            onBlur={field.onBlur}
                            onMenuOpen={() => {
                                setMenuIsOpen(true);
                                if (!hasBeenFocused) setHasBeenFocused(true);
                            }}
                            onMenuClose={() => setMenuIsOpen(false)}
                            onInputChange={handleInputChange}
                            value={selectValue}
                            isClearable
                            isSearchable
                            loadingMessage={() => 'Loading data...'}
                            noOptionsMessage={() => 'No data found.'}
                        />
                    );
                }}
            />
            <ErrorMessage message={errors[name]?.message} />
        </>
    );
};

export default FormAsyncSelect;
