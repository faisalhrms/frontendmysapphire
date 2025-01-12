import React, {useCallback, useEffect, useMemo, useState} from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import {useQuery} from "@tanstack/react-query";
import debounce from "lodash.debounce";
import {Controller} from "react-hook-form";
import ErrorMessage from "@components/form/ErrorMessage.jsx";
import api from "@config/axiosConfig.js";

const ensureArray = (data) => Array.isArray(data) ? data : [];

const MemoizedSelect = React.memo(Select);
const MemoizedCreatableSelect = React.memo(CreatableSelect);

const SRAsyncSelect = ({
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
  onOptionSelect,
  onOptionSelectKey,
  ...rest
}) => {
  const [search, setSearch] = useState("");
  const [hasBeenFocused, setHasBeenFocused] = useState(false);
  const [allOptions, setAllOptions] = useState([]);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(preselectedOptions);
  const debouncedSearch = useMemo(() => debounce(setSearch, debounceDelay), [debounceDelay]);

  useEffect(() => {
    setSelectedOptions(preselectedOptions);
  }, [preselectedOptions]);

  const fetchOptions = useCallback(async (searchValue) => {
    const response = await api.get(apiUrl, { params: { search: searchValue } });
    return ensureArray(response.data?.data);
  }, [apiUrl]);

  const { data: options = [], isLoading } = useQuery({
    queryKey: [queryKeyBase, search],
    queryFn: () => fetchOptions(search),
    enabled: !clientSideSearch && hasBeenFocused && menuIsOpen,
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (clientSideSearch && menuIsOpen) {
      const fetchAllOptions = async () => {
        const data = await fetchOptions("");
        setAllOptions(ensureArray(data));
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
    const uniqueMap = new Map([...filteredOptions, ...ensureArray(preselectedOptions)].map(item => [item.value, item]));
    return Array.from(uniqueMap.values());
  }, [filteredOptions, preselectedOptions]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <>
      {label && <label htmlFor={name} className="form-label">{placeholder}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const value = isMulti
            ? selectedOptions.map(opt => optionsWithSelected.find(o => o.value === opt.value) || opt)
            : optionsWithSelected.find(opt => opt.value === field.value) || null;
          const SelectComponent = allowSaveNewOption ? MemoizedCreatableSelect : MemoizedSelect;
          return (
            <SelectComponent
              {...field}
              {...rest}
              isMulti={isMulti}
              className={`w-full !rounded-sm border ${errors[name] ? "!border-red" : ""} ${className}`}
              classNamePrefix="Select2"
              placeholder={`Select ${placeholder}`}
              options={optionsWithSelected}
              isLoading={isLoading}
              onChange={(selectedOption) => {
                setSelectedOptions(
                  isMulti
                    ? selectedOption.map(opt => optionsWithSelected.find(o => o.value === opt.value) || opt)
                    : selectedOption ? [selectedOption] : []
                );
                field.onChange(
                  isMulti
                    ? selectedOption.map(opt => opt.value)
                    : selectedOption?.value
                );
                if (onOptionSelect) {
                  const selectedData = onOptionSelectKey
                    ? selectedOption?.[onOptionSelectKey]
                    : selectedOption;
                  onOptionSelect(selectedData);
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
              value={value}
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

export default SRAsyncSelect;
