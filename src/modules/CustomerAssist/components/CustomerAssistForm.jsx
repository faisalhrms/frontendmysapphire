// src/modules/CustomerAssist/components/CustomerAssistForm.jsx

import React, { useState } from "react";
import SearchSection from "@modules/CustomerAssist/components/SearchSection.jsx";
import FormSection from "@modules/CustomerAssist/components/CustomerAssistMainList.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx"; // adjust path if needed
import { getCustomerCase } from "@modules/CustomerAssist/services/customerAssistService.js";

const CustomerAssistForm = ({isActive}) => {
    if (!isActive) {
        return null;
    }
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (type, value) => {
        setIsLoading(true);
        setError(null);
        setData(null); // optionally clear previous data while loading
        try {
            const result = await getCustomerCase(type, value);
            setData(result);
        } catch (err) {
            console.error("Search failed:", err);
            setError(err.message || "Failed to fetch case data");
            setData(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4">
            <SearchSection onSearch={handleSearch} />

            {/* Show error if any */}
            {error && (
                <div className="mt-2 text-red-600">
                    {error}
                </div>
            )}

            {/* Show loading spinner while fetching */}
            {isLoading && (
                <div className="flex justify-center mt-4">
                    <LoadingSpinner />
                </div>
            )}

            {/* Once loaded (and not loading), show form if data */}
            {!isLoading && data && (
                <FormSection data={data} />
            )}
        </div>
    );
};

export default CustomerAssistForm;
