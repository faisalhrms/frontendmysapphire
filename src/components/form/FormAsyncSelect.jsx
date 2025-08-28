import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import {useQuery} from '@tanstack/react-query';
import debounce from 'lodash.debounce';
import {Controller} from 'react-hook-form';
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
                             onSelectChange,             // existing callback (keeps current behavior)
                             onChange: onRawChange,      // capture parent onChange if provided (will receive raw option object(s))
                             onOptionChange,             // explicit new callback that also receives raw option object(s)
                             needObject = false,
                             isClearable = true,
                             ...rest
                         }) => {
    const [search, setSearch] = useState('');
    const [hasBeenFocused, setHasBeenFocused] = useState(false);
    const [allOptions, setAllOptions] = useState([]);
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState(preselectedOptions);
    const [isUserInteracting, setIsUserInteracting] = useState(false); // NEW: Track user interaction

    // Use ref to track previous preselectedOptions to avoid unnecessary updates
    const prevPreselectedRef = useRef(preselectedOptions);

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

    // FIXED: Better handling of preselectedOptions changes - prevent race condition
    useEffect(() => {
        // Only update if user is not currently interacting with the component
        if (isUserInteracting) {
            return;
        }

        // Deep comparison to avoid unnecessary updates
        const currentOptionsStr = JSON.stringify(preselectedOptions?.map(opt => ({ value: opt?.value, label: opt?.label })) || []);
        const prevOptionsStr = JSON.stringify(prevPreselectedRef.current?.map(opt => ({ value: opt?.value, label: opt?.label })) || []);

        if (currentOptionsStr !== prevOptionsStr) {
            setSelectedOptions(preselectedOptions);
            prevPreselectedRef.current = preselectedOptions;
        }
    }, [preselectedOptions, isUserInteracting]);

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

    // FIXED: Ensure selected options are included in the options list
    const optionsWithSelected = useMemo(() => {
        const uniqueOptions = new Map();

        // Add filtered options first
        filteredOptions.forEach(opt => {
            if (opt && opt.value) uniqueOptions.set(opt.value, opt);
        });

        // Add selected options (this ensures they're always available)
        selectedOptions.forEach(opt => {
            if (opt && opt.value && opt.label) {
                uniqueOptions.set(opt.value, opt);
            }
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

                // Call legacy onSelectChange with the same payload as before
                if (onSelectChange) {
                    if (needObject) {
                        const payload = updatedValues.map(val => {
                            const opt = optionsWithSelected.find(o => o.value === val) || (val === newOption.value ? newOption : null);
                            return opt ? { id: opt.value, name: opt.label } : { id: val, name: '' };
                        });
                        onSelectChange(payload);
                    } else {
                        onSelectChange(updatedValues);
                    }
                }

                // Notify raw option(s)
                if (typeof onRawChange === 'function') {
                    onRawChange([ ...((field.value || []).map(v => optionsWithSelected.find(o=>o.value===v)).filter(Boolean)), newOption ]);
                }
                if (typeof onOptionChange === 'function') {
                    onOptionChange([ ...((field.value || []).map(v => optionsWithSelected.find(o=>o.value===v)).filter(Boolean)), newOption ]);
                }
            } else {
                field.onChange(newOption.value);

                if (onSelectChange) {
                    if (needObject) {
                        onSelectChange({ id: newOption.value, name: newOption.label });
                    } else {
                        onSelectChange(newOption.value);
                    }
                }

                if (typeof onRawChange === 'function') {
                    onRawChange(newOption);
                }
                if (typeof onOptionChange === 'function') {
                    onOptionChange(newOption);
                }
            }
        }
    }, [saveNewOption, isMulti, onSelectChange, needObject, onRawChange, onOptionChange, optionsWithSelected]);

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

                    // FIXED: Enhanced onChange handler with race condition prevention
                    const handleChange = useCallback((selectedOption, actionMeta) => {

                        // Mark that user is interacting to prevent preselectedOptions interference
                        setIsUserInteracting(true);

                        if (actionMeta && actionMeta.action === 'create-option') {
                            // creation handled separately
                            handleCreateOption(actionMeta.option.label, field);
                            // Reset interaction flag after a delay
                            setTimeout(() => setIsUserInteracting(false), 100);
                            return;
                        }

                        // Handle different action types
                        const isClearing = actionMeta?.action === 'clear' || actionMeta?.action === 'select-option' && selectedOption === null;

                        const selectedValues = isMulti
                            ? (selectedOption ? selectedOption.map(opt => opt.value) : [])
                            : (selectedOption ? selectedOption.value : null);

                        // CRITICAL FIX: Update selectedOptions immediately to prevent reset
                        const newSelectedOptions = isMulti
                            ? (selectedOption || [])
                            : (selectedOption ? [selectedOption] : []);

                        setSelectedOptions(newSelectedOptions);

                        // Update the field value (IDs) - this will trigger useWatch and preselectedOptions change
                        field.onChange(selectedValues);


                        // Keep legacy onSelectChange semantics intact
                        if (onSelectChange) {
                            if (needObject) {
                                const payload = isMulti
                                    ? (selectedOption ? selectedOption.map(opt => ({ id: opt.value, name: opt.label })) : [])
                                    : (selectedOption ? { id: selectedOption.value, name: selectedOption.label } : null);
                                onSelectChange(payload);
                            } else {
                                onSelectChange(selectedValues);
                            }
                        }

                        // **Enhanced**: call parent's onChange / onOptionChange with the raw option object(s)
                        const rawPayload = isMulti
                            ? (selectedOption || [])
                            : (selectedOption || null);

                        if (typeof onRawChange === 'function') {
                            try {
                                onRawChange(rawPayload);
                            } catch (e) {
                                console.warn('onChange callback error', e);
                            }
                        }

                        if (typeof onOptionChange === 'function') {
                            try {
                                onOptionChange(rawPayload);
                            } catch (e) {
                                console.warn('onOptionChange callback error', e);
                            }
                        }

                        // Reset interaction flag after callbacks complete
                        setTimeout(() => {
                            setIsUserInteracting(false);
                        }, 50);

                    }, [handleCreateOption, isMulti, onSelectChange, needObject, onRawChange, onOptionChange, field, name]);

                    // Memoized onInputChange handler
                    const handleInputChange = useCallback((inputValue) => {
                        if (clientSideSearch) {
                            setSearch(inputValue);
                        } else {
                            debouncedSetSearch(inputValue);
                        }
                    }, [clientSideSearch, debouncedSetSearch]);

                    // FIXED: Better selectValue calculation with proper logging
                    const selectValue = useMemo(() => {
                        if (isMulti) {
                            if (!Array.isArray(value) || value.length === 0) {
                                return [];
                            }
                            return optionsWithSelected.filter(option => value.includes(option.value));
                        } else {
                            if (value === null || value === undefined || value === '') {
                                return null;
                            }
                            return optionsWithSelected.find(option => option.value === value) || null;
                        }
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
                            isClearable={isClearable}
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