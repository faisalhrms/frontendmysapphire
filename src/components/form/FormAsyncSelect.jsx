import React, {useCallback, useEffect, useMemo, useState} from 'react';
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
                             onOptionSelect, // New prop
                             ...rest
                         }) => {
    const [search, setSearch] = useState('');
    const [hasBeenFocused, setHasBeenFocused] = useState(false);
    const [allOptions, setAllOptions] = useState([]);
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState(preselectedOptions);
    const debouncedSearch = useMemo(() => debounce(setSearch, debounceDelay), [debounceDelay]);

    useEffect(() => {
        setSelectedOptions(preselectedOptions);
    }, [preselectedOptions]);

    const fetchOptions = useCallback(async (search) => {
        try {
            const response = await api.get(apiUrl, { params: { search } });
            return ensureArray(response.data?.data);
        } catch (error) {
            console.error('Error fetching options:', error);
            return [];
        }
    }, [apiUrl]);

    const { data: options = [], isLoading, refetch } = useQuery({
        queryKey: [queryKeyBase, search],
        queryFn: () => fetchOptions(search),
        enabled: !clientSideSearch && hasBeenFocused && menuIsOpen,
        staleTime: 60000,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (clientSideSearch && menuIsOpen) {
            const fetchAllOptions = async () => {
                const options = await fetchOptions('');
                setAllOptions(ensureArray(options));
            };
            fetchAllOptions();
        }
    }, [clientSideSearch, menuIsOpen, fetchOptions]);

    const filteredOptions = useMemo(() => {
        return clientSideSearch
            ? allOptions.filter(option => option.label.toLowerCase().includes(search.toLowerCase()))
            : options;
    }, [clientSideSearch, allOptions, options, search]);

    const optionsWithSelected = useMemo(() => {
        const uniqueOptions = new Map(filteredOptions.map(opt => [opt.value, opt]));
        selectedOptions.forEach(opt => {
            if (opt && opt.value) uniqueOptions.set(opt.value, opt);
        });
        return Array.from(uniqueOptions.values());
    }, [filteredOptions, selectedOptions]);

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    // const handleCreateOption = async (newOptionLabel, field) => {
    //     const newOption = await saveNewOption(newOptionLabel);
    //     if (newOption) {
    //         setSelectedOptions(prev => {
    //             return [...prev, newOption].filter((v, i, a) => a.findIndex(t => t.value === v.value) === i);
    //         });
    //         if (isMulti) {
    //             field.onChange([...(field.value || []), newOption.value]);
    //         } else {
    //             field.onChange(newOption.value);
    //         }
    //     }
    // }; Rehab Code

    // Instead of calling the returned data `newOption`, call it `updatedList`
    const handleCreateOption = async (newOptionLabel, field) => {
        const updatedList = await saveNewOption(newOptionLabel);
        if (updatedList && Array.isArray(updatedList)) {
            setAllOptions(updatedList);
            const newlyCreatedItem = updatedList.find(
                opt => opt.label.toLowerCase() === newOptionLabel.toLowerCase()
            );
            if (newlyCreatedItem) {
                if (isMulti) {
                    field.onChange([...(field.value || []), newlyCreatedItem.value]);
                    setSelectedOptions(prev => [...prev, newlyCreatedItem]);
                } else {
                    field.onChange(newlyCreatedItem.value);
                    setSelectedOptions([newlyCreatedItem]);
                }
            }
        }
    };


    const saveNewOption = async (newOptionLabel) => {
                 if (!allowSaveNewOption || !saveOptionEndpoint) return;
                 try {
                         const { data } = await api.post(saveOptionEndpoint, { label: newOptionLabel });
                         return data.data; // Ensure this includes both value and label
                     } catch (error) {
                         console.error('Error saving new option:', error);
                         return null;
               }
       };

    return (
        <>
            {label && <label htmlFor={name} className="form-label">{placeholder}</label>}
            <Controller
                name={name}
                control={control}
                render={({ field }) => {
                    const value = isMulti ? (Array.isArray(field.value) ? field.value : []) : field.value;
                    const SelectComponent = allowSaveNewOption ? MemoizedCreatableSelect : MemoizedSelect;

                    return (
                        <SelectComponent
                            {...field}
                            {...rest}
                            isMulti={isMulti}
                            className={`w-full !rounded-sm border ${errors[name] ? '!border-red' : ''} ${className}`}
                            classNamePrefix="Select2"
                            placeholder={`Select ${placeholder}`}
                            options={optionsWithSelected}
                            isLoading={isLoading}
                            onChange={(selectedOption, actionMeta) => {

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


                                    if (onOptionSelect) {
                                        const selectedEmail = selectedOption?.email || selectedOption || "";
                                        onOptionSelect(selectedEmail);
                                    }
                                }
                            }}
                            onBlur={field.onBlur}
                            onMenuOpen={() => {
                                setMenuIsOpen(true);
                                if (!hasBeenFocused) setHasBeenFocused(true);
                            }}
                            onMenuClose={() => setMenuIsOpen(false)}
                            onInputChange={(inputValue) => {
                                if (clientSideSearch) {
                                    setSearch(inputValue);
                                } else {
                                    debouncedSearch(inputValue);
                                }
                            }}
                            value={isMulti
                                ? optionsWithSelected.filter(option => value.includes(option.value))
                                : optionsWithSelected.find(option => option.value === value) || null
                            }
                            isClearable
                            isSearchable
                        />
                    );
                }}
            />
            <ErrorMessage message={errors[name]?.message} />
        </>
    );
};

export default FormAsyncSelect;
