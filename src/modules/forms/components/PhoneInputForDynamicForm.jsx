import React, { useState, useEffect, useRef } from 'react';

export const COUNTRIES = [
    {
        code: 'US',
        name: 'United States',
        dialCode: '+1',
        format: '(###) ###-####',
        pattern: /^[2-9]\d{2}[2-9]\d{2}\d{4}$/,
        maxLength: 10,
        placeholder: '(xxx) xxx-xxxx'
    },
    {
        code: 'PK',
        name: 'Pakistan',
        dialCode: '+92',
        format: '### ### ####',
        pattern: /^[3][0-9]{9}$/,
        maxLength: 10,
        placeholder: 'xxx xxx xxxx'
    },
    {
        code: 'GB',
        name: 'United Kingdom',
        dialCode: '+44',
        format: '#### ### ####',
        pattern: /^[1-9]\d{9,10}$/,
        maxLength: 11,
        placeholder: 'xxxx xxxxxx'
    },
    {
        code: 'AE',
        name: 'United Arab Emirates',
        dialCode: '+971',
        format: '## ### ####',
        pattern: /^[2-9]\d{7}$/,
        maxLength: 8,
        placeholder: 'xx xxx xxxx'
    },
    {
        code: 'SA',
        name: 'Saudi Arabia',
        dialCode: '+966',
        format: '## ### ####',
        pattern: /^[5][0-9]{8}$/,
        maxLength: 9,
        placeholder: 'xx xxx xxxx'
    },
    {
        code: 'DE',
        name: 'Germany',
        dialCode: '+49',
        format: '### ### ####',
        pattern: /^[1-9]\d{10,11}$/,
        maxLength: 12,
        placeholder: 'xx xxxxxxxx'
    },
    {
        code: 'FR',
        name: 'France',
        dialCode: '+33',
        format: '# ## ## ## ##',
        pattern: /^[1-9]\d{8}$/,
        maxLength: 9,
        placeholder: 'x xx xx xx xx'
    },
    {
        code: 'IT',
        name: 'Italy',
        dialCode: '+39',
        format: '### #### ####',
        pattern: /^[3][0-9]{9}$/,
        maxLength: 10,
        placeholder: 'xxx xxx xxxx'
    },
    {
        code: 'ES',
        name: 'Spain',
        dialCode: '+34',
        format: '### ### ###',
        pattern: /^[6-9]\d{8}$/,
        maxLength: 9,
        placeholder: 'xxx xxx xxx'
    }
];

const PhoneInputForDynamicForm = ({ value = '', onChange, hasError, className, placeholder }) => {
    const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[1]); // Default to Pakistan
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    // Initialize from existing value
    useEffect(() => {
        if (value && value.includes('+')) {
            const parts = value.split(' ');
            if (parts.length >= 2) {
                const dialCode = parts[0];
                const number = parts.slice(1).join('').replace(/\D/g, '');
                const country = COUNTRIES.find(c => c.dialCode === dialCode);
                if (country) {
                    setSelectedCountry(country);
                    setPhoneNumber(number);
                }
            }
        }
    }, [value]);

    // Format phone number according to country pattern
    const formatPhoneNumber = (number, country) => {
        if (!number) return '';
        const cleanNumber = number.replace(/\D/g, '');
        const format = country.format;
        let formatted = '';
        let numberIndex = 0;
        for (let i = 0; i < format.length && numberIndex < cleanNumber.length; i++) {
            if (format[i] === '#') {
                formatted += cleanNumber[numberIndex];
                numberIndex++;
            } else {
                formatted += format[i];
            }
        }
        return formatted;
    };

    // Validate phone number
    const isValidPhoneNumber = (number, country) => {
        const cleanNumber = number.replace(/\D/g, '');
        return country.pattern.test(cleanNumber) && cleanNumber.length <= country.maxLength;
    };

    // Handle phone number input
    const handlePhoneChange = (e) => {
        const input = e.target.value.replace(/\D/g, '');
        if (input.length <= selectedCountry.maxLength) {
            setPhoneNumber(input);
            const fullNumber = input ? `${selectedCountry.dialCode} ${input}` : '';
            onChange(fullNumber);
        }
    };

    // Handle country selection
    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        setIsDropdownOpen(false);
        setSearchTerm('');
        const fullNumber = phoneNumber ? `${country.dialCode} ${phoneNumber}` : '';
        onChange(fullNumber);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    // Filter countries based on search
    const filteredCountries = COUNTRIES.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.dialCode.includes(searchTerm)
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
                setSearchTerm('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formattedPhoneNumber = formatPhoneNumber(phoneNumber, selectedCountry);
    const isValid = !phoneNumber || isValidPhoneNumber(phoneNumber, selectedCountry);

    return (
        <div className="relative">
            <div className={`flex ${className}`}>
                {/* Country Selector */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`flex items-center px-3 py-4 border-0 border-b-2 ${
                            hasError ? 'border-danger' : 'border-gray-300'
                        } bg-transparent focus:outline-none focus:border-blue-500 transition-colors duration-200`}
                    >
                        <span className="text-sm font-medium mr-2">{selectedCountry.dialCode}</span>
                        <svg
                            className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown */}
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-hidden">
                            {/* Search */}
                            <div className="p-3 border-b border-gray-200">
                                <input
                                    type="text"
                                    placeholder="Search countries..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                                />
                            </div>

                            {/* Country List */}
                            <div className="overflow-y-auto max-h-40">
                                {filteredCountries.map((country) => (
                                    <button
                                        key={country.code}
                                        type="button"
                                        onClick={() => handleCountrySelect(country)}
                                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between transition-colors ${
                                            selectedCountry.code === country.code ? 'bg-blue-50 text-blue-600' : ''
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium mr-3">{country.dialCode}</span>
                                            <span className="text-sm">{country.name}</span>
                                        </div>
                                        {selectedCountry.code === country.code && (
                                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                                {filteredCountries.length === 0 && (
                                    <div className="px-4 py-3 text-sm text-gray-500">No countries found</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Phone Number Input */}
                <input
                    ref={inputRef}
                    type="tel"
                    value={formattedPhoneNumber}
                    onChange={handlePhoneChange}
                    placeholder={selectedCountry.placeholder}
                    className={`flex-1 ml-2 w-full max-w-[368px] px-0 py-2 border-0 border-b-2 ${
                        hasError || !isValid ? 'border-danger focus:border-danger' : 'border-gray-300 focus:border-blue-500'
                    } focus:outline-none bg-transparent text-sm placeholder-gray-400 transition-colors duration-200`}
                />
            </div>



        </div>
    );
};

export default PhoneInputForDynamicForm;